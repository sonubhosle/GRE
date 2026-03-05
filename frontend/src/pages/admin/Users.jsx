import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import { User, GraduationCap, ShieldCheck, Lock, Search, Check, X, Ban, History, MoreVertical, Filter, Loader2 } from 'lucide-react';
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
            const res = await api.get(`/admin/users?role=${filter === 'all' ? '' : filter.toUpperCase()}`);
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

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-fade-in-up">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">
                            User <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Management</span>
                        </h1>
                        <p className="text-slate-400 font-medium">Control access and verify instructor applications.</p>
                    </div>

                    <div className="flex bg-slate-900/50 backdrop-blur-md p-1 rounded-2xl border border-white/5 shadow-xl">
                        {['all', 'student', 'teacher', 'admin'].map(r => (
                            <button
                                key={r}
                                onClick={() => setFilter(r)}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${filter === r ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {r}s
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden animate-fade-in-up transition-all delay-100">
                    <div className="p-6 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-950/50 px-3 py-1.5 rounded-lg border border-white/5">
                                {filteredUsers.length} Users Found
                            </span>
                            <button className="p-2.5 rounded-xl bg-slate-950/50 border border-white/5 text-slate-400 hover:text-white transition-colors">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.01]">
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">User Details</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Access Level</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Current Status</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Joined Date</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map(user => (
                                    <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <img src={user.photo?.url} className="w-11 h-11 rounded-[14px] object-cover border border-white/10" />
                                                    <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">{user.name}</p>
                                                    <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded-lg ${user.role === 'ADMIN' ? 'bg-pink-500/10 text-pink-500' :
                                                        user.role === 'TEACHER' ? 'bg-amber-500/10 text-amber-500' :
                                                            'bg-indigo-500/10 text-indigo-500'
                                                    }`}>
                                                    {user.role === 'ADMIN' && <ShieldCheck size={14} />}
                                                    {user.role === 'TEACHER' && <GraduationCap size={14} />}
                                                    {user.role === 'USER' && <User size={14} />}
                                                </div>
                                                <span className="text-xs font-black uppercase tracking-tighter text-slate-300">{user.role}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    user.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
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
                                                        className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
                                                        title="Approve Teacher"
                                                    >
                                                        {actionLoading === user._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check size={18} />}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleBlockToggle(user._id)}
                                                    disabled={actionLoading === user._id}
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg ${user.status === 'blocked'
                                                            ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white shadow-emerald-500/10'
                                                            : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white shadow-rose-500/10'
                                                        }`}
                                                    title={user.status === 'blocked' ? 'Unblock' : 'Block'}
                                                >
                                                    {actionLoading === user._id ? <Loader2 className="w-4 h-4 animate-spin" /> : (user.status === 'blocked' ? <Check size={18} /> : <Ban size={18} />)}
                                                </button>
                                                <button className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all shadow-sm" title="View History">
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
                    <div className="text-center py-20 bg-slate-900/20 rounded-[2rem] border border-dashed border-white/5 mt-8 animate-fade-in-up">
                        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
                            <Search size={32} />
                        </div>
                        <p className="text-slate-400 font-bold text-lg mb-2">No users matching your search</p>
                        <p className="text-slate-500 text-sm">Try using different keywords or clearing your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;

