import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import {
    User, GraduationCap, ShieldCheck, Lock, Search,
    Check, X, Ban, History, MoreVertical, Filter,
    Loader2, Trash2, Mail, ShieldAlert, BadgeCheck
} from 'lucide-react';
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
            setLoading(true);
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
        if (!window.confirm('Are you sure you want to PERMANENTLY delete this user? This action cannot be undone.')) return;
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
        <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
    );

    return (
        <div className="space-y-10 animate-fade-in-up">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
                        User <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 font-extrabold">Control Center</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-[13px]">Manage access rights, monitor activities, and handle user accounts.</p>
                </div>

                <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                    {['all', 'student', 'teacher', 'admin'].map(r => (
                        <button
                            key={r}
                            onClick={() => setFilter(r)}
                            className={`px-5 py-2.5 rounded-xl text-[11px] font-bold transition-all duration-300 uppercase tracking-widest ${filter === r
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/10'
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {r}s
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Table Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden transition-all duration-300">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-6 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[11px] font-bold text-slate-400 bg-white px-4 py-2 rounded-xl border border-slate-100 uppercase tracking-widest">
                            {filteredUsers.length} records matched
                        </span>
                        <button className="p-3 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 transition-colors hover:shadow-md">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">User Profile</th>
                                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Access Level</th>
                                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Platform Status</th>
                                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.map(user => (
                                <tr key={user._id} className="hover:bg-indigo-50/20 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={user.photo?.url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.name}
                                                    className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm"
                                                    alt=""
                                                />
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${user.status === 'active' ? 'bg-emerald-500 shadow-sm' : 'bg-slate-300'}`}></div>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-900 text-[13px] tracking-tight group-hover:text-indigo-600 transition-colors truncate">{user.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 truncate uppercase tracking-widest"><Mail size={10} /> {user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm border ${user.role === 'ADMIN' ? 'bg-pink-50 text-pink-600 border-pink-100' :
                                                    user.role === 'TEACHER' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        'bg-indigo-50 text-indigo-600 border-indigo-100'
                                                }`}>
                                                {user.role === 'ADMIN' && <ShieldCheck size={16} />}
                                                {user.role === 'TEACHER' && <GraduationCap size={16} />}
                                                {user.role === 'USER' && <User size={16} />}
                                            </div>
                                            <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-widest">{user.role === 'USER' ? 'STUDENT' : user.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold border uppercase tracking-widest transition-all ${user.status === 'active'
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-500/5' :
                                                user.status === 'pending'
                                                    ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    'bg-rose-50 text-rose-600 border-rose-100'
                                            }`}>
                                            {user.status === 'active' ? <BadgeCheck size={12} /> : user.status === 'pending' ? <History size={12} /> : <Ban size={12} />}
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {user.role === 'TEACHER' && user.status === 'pending' && (
                                                <button
                                                    onClick={() => handleApproveTeacher(user._id)}
                                                    disabled={actionLoading === user._id}
                                                    className="w-10 h-10 rounded-xl bg-white text-emerald-500 hover:text-white border border-slate-100 hover:bg-emerald-600 hover:border-emerald-600 transition-all shadow-sm flex items-center justify-center"
                                                    title="Approve Teacher"
                                                >
                                                    {actionLoading === user._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check size={18} />}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleBlockToggle(user._id)}
                                                disabled={actionLoading === user._id || user.role === 'ADMIN'}
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm border border-slate-100 hover:border-transparent ${user.status === 'blocked'
                                                        ? 'bg-white text-emerald-500 hover:bg-emerald-600 hover:text-white'
                                                        : 'bg-white text-rose-500 hover:bg-rose-600 hover:text-white'
                                                    } ${user.role === 'ADMIN' ? 'opacity-20 cursor-not-allowed' : ''}`}
                                                title={user.status === 'blocked' ? 'Unblock Account' : 'Block Account'}
                                            >
                                                {actionLoading === user._id ? <Loader2 className="w-5 h-5 animate-spin" /> : (user.status === 'blocked' ? <Check size={18} /> : <Ban size={18} />)}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                disabled={actionLoading === user._id || user.role === 'ADMIN'}
                                                className={`w-10 h-10 rounded-xl bg-white text-slate-400 hover:text-white border border-slate-100 hover:bg-rose-600 hover:border-rose-600 transition-all shadow-sm flex items-center justify-center ${user.role === 'ADMIN' ? 'opacity-20 cursor-not-allowed' : ''}`}
                                                title="Delete Account"
                                            >
                                                {actionLoading === user._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 size={18} />}
                                            </button>
                                            <button className="w-10 h-10 rounded-xl bg-white text-slate-400 hover:text-slate-600 border border-slate-100 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center">
                                                <MoreVertical size={18} />
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
                <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200 animate-fade-in-up">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                        <Search size={40} />
                    </div>
                    <p className="text-slate-900 font-bold text-lg mb-2 tracking-tight">No records discovered</p>
                    <p className="text-slate-500 text-sm font-medium">Try broadening your search or check your filters.</p>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
