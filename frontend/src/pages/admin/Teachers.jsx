import { useState, useEffect } from 'react';
import api from '../../services/api';
import {
    Users, GraduationCap, Check, X, Shield,
    Trash2, Mail, Award, Loader2, Search,
    UserPlus, Filter, MoreHorizontal, ArrowUpRight
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminTeachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [pendingTeachers, setPendingTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchTeachers();
        fetchPending();
    }, []);

    const fetchTeachers = async () => {
        try {
            const res = await api.get('/admin/users?role=TEACHER');
            setTeachers(res.data.data.users);
        } catch (e) {
            toast.error('Failed to load active teachers');
        } finally {
            setLoading(false);
        }
    };

    const fetchPending = async () => {
        try {
            const res = await api.get('/admin/stats');
            setPendingTeachers(res.data.data.pendingTeachers || []);
        } catch (e) {
            console.error('Failed to load pending teachers');
        }
    };

    const handleApprove = async (id) => {
        setActionLoading(id);
        try {
            await api.patch(`/admin/teachers/${id}/approve`);
            toast.success('Teacher approved successfully');
            fetchTeachers();
            fetchPending();
        } catch (e) {
            toast.error('Approval failed');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this teacher? This action is permanent.')) return;
        setActionLoading(id);
        try {
            await api.delete(`/admin/users/${id}`);
            toast.success('Teacher removed from platform');
            fetchTeachers();
            fetchPending();
        } catch (e) {
            toast.error('Deletion failed');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredTeachers = teachers.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
    );

    return (
        <div className="space-y-12 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
                        Teacher <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 font-extrabold">Management</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-[13px]">Manage instructor profiles, verify applications, and monitor performance.</p>
                </div>

                <div className="flex gap-4">
                    <div className="px-5 py-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs ring-4 ring-indigo-50/50">
                            {teachers.length}
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
                    </div>
                    <div className="px-5 py-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-xs ring-4 ring-amber-50/50">
                            {pendingTeachers.length}
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pending</span>
                    </div>
                </div>
            </div>

            {/* Pending Approvals Section */}
            {pendingTeachers.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-[2.5rem] border border-amber-100 shadow-xl shadow-amber-900/5 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200 opacity-[0.1] rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20 ring-4 ring-white">
                            <UserPlus size={24} className="animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Active Applications</h3>
                            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Action Required</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {pendingTeachers.map((teacher) => (
                            <div key={teacher._id} className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group flex flex-col">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-2xl border-2 border-white overflow-hidden shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
                                        <img src={teacher.photo?.url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + teacher.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-slate-900 tracking-tight truncate">{teacher.name}</h4>
                                        <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 truncate">
                                            <Mail size={12} /> {teacher.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4 mb-8">
                                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 italic text-[11px] font-medium text-slate-500 leading-relaxed">
                                        "{teacher.bio || "No biography provided yet."}"
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold border border-indigo-100">{teacher.specialization}</span>
                                        <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold border border-amber-100">{teacher.experience} Years Exp.</span>
                                    </div>
                                </div>
                                <div className="mt-auto pt-4 flex gap-3">
                                    <button
                                        onClick={() => handleApprove(teacher._id)}
                                        disabled={actionLoading === teacher._id}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-[11px] tracking-widest uppercase transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {actionLoading === teacher._id ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} /> Approve</>}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(teacher._id)}
                                        disabled={actionLoading === teacher._id}
                                        className="w-12 h-12 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 border border-slate-100 hover:border-rose-100 font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Active Teachers Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden shadow-slate-200/50 transition-all duration-300">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search active instructors..."
                            className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-6 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-100 text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-all hover:shadow-md">
                            <Filter size={16} /> Filter List
                        </button>
                        <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-[11px] font-bold text-white hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                            Export Data <ArrowUpRight size={14} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Instructor</th>
                                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Expertise</th>
                                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Verification</th>
                                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredTeachers.map(teacher => (
                                <tr key={teacher._id} className="group hover:bg-indigo-50/20 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-11 h-11 rounded-[14px] bg-slate-100 border border-slate-100 overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                                                <img src={teacher.photo?.url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + teacher.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-indigo-600 transition-colors truncate">{teacher.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-widest">{teacher.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                                                <Award size={16} />
                                            </div>
                                            <span className="text-[13px] font-bold text-slate-700">{teacher.specialization || "Professional Instructor"}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full w-fit border border-emerald-100">
                                            <Shield size={12} className="fill-current" />
                                            <span className="text-[10px] font-extrabold uppercase tracking-widest">Verified Partner</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleDelete(teacher._id)}
                                                disabled={actionLoading === teacher._id}
                                                className="w-10 h-10 rounded-xl bg-white text-slate-400 hover:text-rose-600 border border-slate-100 hover:border-rose-100 hover:bg-rose-50 transition-all shadow-sm flex items-center justify-center"
                                                title="Remove Access"
                                            >
                                                {actionLoading === teacher._id ? <Loader2 size={16} className="animate-spin text-rose-500" /> : <Trash2 size={18} />}
                                            </button>
                                            <button className="w-10 h-10 rounded-xl bg-white text-slate-400 hover:text-slate-600 border border-slate-100 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredTeachers.length === 0 && !loading && (
                <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200 animate-fade-in-up">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 ring-8 ring-slate-50/50">
                        <GraduationCap size={40} />
                    </div>
                    <p className="text-slate-900 font-bold text-lg mb-2 tracking-tight">Community expanding</p>
                    <p className="text-slate-500 text-sm font-medium">No instructors found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default AdminTeachers;
