import { useState, useEffect } from 'react';
import api from '../../services/api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import {
    Users, GraduationCap, BookOpen,
    ArrowRight, TrendingUp, Calendar, ArrowUpRight,
    Loader2, Zap, Activity
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/stats');
            setStats(res.data.data);
        } catch (e) {
            toast.error('Failed to load platform statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
    );

    const revenueData = stats?.revenueHistory || [];

    return (
        <div className="space-y-12 animate-fade-in-up">
            {/* Hero Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">
                            Intelligence Engine
                        </div>
                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <Calendar size={12} />
                            {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        Platform <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Vitality</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-[13px] mt-2 max-w-xl leading-relaxed">
                        Real-time analytics and management dashboard for the next generation of digital learning.
                    </p>
                </div>

                <div className="flex gap-4">
                    <button onClick={fetchStats} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <Activity size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </button>
                    <Link to="/admin/courses" className="flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-bold shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95">
                        Audit Content <ArrowUpRight size={14} />
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Total Enrolled Students', value: stats?.totalStudents || 0, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Platform Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Active Course Library', value: stats?.totalCourses || 0, icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Global Faculty Count', value: stats?.totalTeachers || 0, icon: GraduationCap, color: 'text-rose-600', bg: 'bg-rose-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group">
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-sm`}>
                            <stat.icon size={26} />
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-semibold text-slate-900 tracking-tight">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Quick Management Actions & Revenue Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group min-h-[400px] flex flex-col justify-center">
                    <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full transition-all group-hover:scale-150"></div>
                    <h3 className="text-2xl font-bold mb-4 relative z-10">Quick <br />Management</h3>
                    <p className="text-slate-400 text-sm mb-10 relative z-10 leading-relaxed">Direct access to core administrative protocols and platform controls.</p>
                    <div className="space-y-4 relative z-10">
                        <Link to="/admin/users" className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest">
                            Manage All Users <ArrowRight size={16} />
                        </Link>
                        <Link to="/admin/courses" className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest">
                            Review Courses <ArrowRight size={16} />
                        </Link>
                        <Link to="/admin/teachers" className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest">
                            Teacher Approvals <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                <div className="md:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-3">
                                <TrendingUp className="text-indigo-600" /> Revenue Trajectory
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Monthly financial throughput analysis</p>
                        </div>
                        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                            <button className="px-4 py-1.5 rounded-lg text-[10px] font-bold bg-white text-indigo-600 shadow-sm border border-slate-100">Monthly</button>
                            <button className="px-4 py-1.5 rounded-lg text-[10px] font-bold text-slate-400">Yearly</button>
                        </div>
                    </div>
                    <div className="h-[300px] mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.01} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                    tickFormatter={(v) => `₹${v}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '20px',
                                        border: 'none',
                                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                                        padding: '16px'
                                    }}
                                    itemStyle={{ fontSize: '13px', fontWeight: '800', color: '#4f46e5' }}
                                    labelStyle={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Teacher Verification Pipeline (Optional Quick Action) */}
            {stats?.pendingTeachers?.length > 0 && (
                <div className="rounded-[2.5rem] bg-indigo-600 p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-600/20">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-xl border border-white/20">
                            <Zap size={32} className="fill-current" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold tracking-tight">{stats.pendingTeachers.length} Pending Instructor Approvals</h4>
                            <p className="text-xs font-bold text-indigo-100/60 uppercase tracking-widest mt-1">High-priority verification pipeline active</p>
                        </div>
                    </div>
                    <Link to="/admin/teachers" className="px-10 py-5 bg-white text-indigo-600 rounded-2xl text-[11px] font-semibold uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-xl">
                        Launch Verification Protocol <ArrowUpRight size={16} className="inline ml-1" />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
