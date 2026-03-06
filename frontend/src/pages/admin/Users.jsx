import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import { User, GraduationCap, ShieldCheck, Lock, Search, Check, X, Ban, History, MoreVertical, Filter, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [filter]);

    const fetchUsers = async () => {
        try {
            let roleParam = filter === 'all' ? '' : filter.toUpperCase();
            if (roleParam === 'STUDENT') roleParam = 'USER';
            const res = await api.get(`/admin/users?role=${roleParam}`);
            setUsers(res.data.data.users);
        } catch (e) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleBlockToggle = async (id) => {
        setActionLoading(id);
        try {
            await api.patch(`/admin/users/${id}/block`);
            toast.success('User status updated');
            fetchUsers();
        } catch (e) { toast.error('Action failed'); }
        finally { setActionLoading(null); }
    };

    const handleApproveTeacher = async (id) => {
        setActionLoading(id);
        try {
            await api.patch(`/admin/teachers/${id}/approve`);
            toast.success('Teacher approved!');
            fetchUsers();
        } catch (e) { toast.error('Approval failed'); }
        finally { setActionLoading(null); }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to PERMANENTLY delete this user? This cannot be undone.')) return;
        setActionLoading(id);
        try {
            await api.delete(`/admin/users/${id}`);
            toast.success('User deleted permanently');
            fetchUsers();
        } catch (e) { toast.error('Deletion failed'); }
        finally { setActionLoading(null); }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-fade-in-up">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2 text-slate-900">
                            User <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Management</span>
                        </h1>
                        <p className="text-slate-500 font-medium">Control access and verify instructor applications.</p>
                    </div>

                    <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                        {['all', 'student', 'teacher', 'admin'].map(r => (
                            <button
                                key={r}
                                onClick={() => setFilter(r)}
                                className={`px-5 py-2 rounded-xl text-[11px] font-bold transition-all duration-300 ${filter === r ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/10' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {r}s
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden animate-fade-in-up transition-all delay-100">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/5 transition-all font-medium"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[11px] font-bold text-slate-400 bg-white px-3 py-1.5 rounded-lg border border-slate-100">
                                {filteredUsers.length} users found
                            </span>
                            <button className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 transition-colors">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-6 py-5 text-[11px] font-bold text-slate-400">User details</th>
                                        <th className="px-6 py-5 text-[11px] font-bold text-slate-400">Access level</th>
                                        <th className="px-6 py-5 text-[11px] font-bold text-slate-400">Current status</th>
                                        <th className="px-6 py-5 text-[11px] font-bold text-slate-400">Joined date</th>
                                        <th className="px-6 py-5 text-[11px] font-bold text-slate-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredUsers.map(user => (
                                    <tr key={user._id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <img src={user.photo?.url} className="w-11 h-11 rounded-[14px] object-cover border border-slate-100" />
                                                    <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{user.name}</p>
                                                    <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded-lg ${user.role === 'ADMIN' ? 'bg-pink-50 text-pink-600' :
                                                    user.role === 'TEACHER' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-indigo-50 text-indigo-600'
                                                    }`}>
                                                    {user.role === 'ADMIN' && <ShieldCheck size={14} />}
                                                    {user.role === 'TEACHER' && <GraduationCap size={14} />}
                                                    {user.role === 'USER' && <User size={14} />}
                                                </div>
                                                <span className="text-xs font-bold text-slate-600">{user.role}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${user.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                user.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    'bg-rose-50 text-rose-600 border-rose-100'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-semibold text-slate-400">
                                                {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {user.role === 'TEACHER' && user.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleApproveTeacher(user._id)}
                                                        disabled={actionLoading === user._id}
                                                        className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                        title="Approve Teacher"
                                                    >
                                                        {actionLoading === user._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check size={18} />}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleBlockToggle(user._id)}
                                                    disabled={actionLoading === user._id}
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${user.status === 'blocked'
                                                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                                                        : 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white'
                                                        }`}
                                                    title={user.status === 'blocked' ? 'Unblock' : 'Block'}
                                                >
                                                    {actionLoading === user._id ? <Loader2 className="w-4 h-4 animate-spin" /> : (user.status === 'blocked' ? <Check size={18} /> : <Ban size={18} />)}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    disabled={actionLoading === user._id}
                                                    className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                    title="Delete User"
                                                >
                                                    {actionLoading === user._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 size={18} />}
                                                </button>
                                                <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-slate-600 transition-all shadow-sm" title="View History">
                                                    <History size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200 mt-8 animate-fade-in-up">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <Search size={32} />
                        </div>
                        <p className="text-slate-900 font-bold text-lg mb-2">No users matching your search</p>
                        <p className="text-slate-500 text-sm">Try using different keywords or clearing your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;

