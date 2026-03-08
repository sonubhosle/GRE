import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
    Users, GraduationCap, BookOpen, CircleDollarSign,
    Flag, Check, X, TrendingUp, Calendar, ArrowUpRight,
    Loader2, Zap, ArrowDownRight, Activity, Wallet,
    Award, Target, Rocket
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

    const handleApprove = async (id) => {
        try {
            await api.patch(`/admin/teachers/${id}/approve`);
            toast.success('Teacher approved successfully');
            fetchStats();
        } catch (e) { toast.error('Action failed'); }
    };

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
    );

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];
    const userRoleData = [
        { name: 'Students', value: stats?.usersCount?.student || 0 },
        { name: 'Instructors', value: stats?.usersCount?.teacher || 0 },
        { name: 'Administrators', value: stats?.usersCount?.admin || 0 },
    ];

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

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                    { icon: Users, label: 'Cumulative users', value: stats?.totalStudents + stats?.totalTeachers + stats?.usersCount?.admin, color: 'indigo', trend: '+12.4%', up: true },
                    { icon: Rocket, label: 'Course Catalog', value: stats?.totalCourses, color: 'purple', trend: '+5.2%', up: true },
                    { icon: GraduationCap, label: 'Faculty Active', value: stats?.totalTeachers, color: 'emerald', trend: '+2.1%', up: true },
                    { icon: Wallet, label: 'Gross Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, color: 'pink', trend: '+15%', up: true },
                ].map((item, i) => (
                    <div key={i} className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-indigo-100 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-xl">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-${item.color}-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-${item.color}-500/10 transition-colors`}></div>
                        <div className="flex items-start justify-between mb-8">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${item.color}-50 border border-${item.color}-50 text-${item.color}-600 shadow-inner group-hover:scale-110 transition-transform`}>
                                <item.icon size={28} />
                            </div>
                            <div className={`flex items-center gap-1 text-[11px] font-extrabold px-3 py-1.5 rounded-full ${item.up ? 'bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-500/5' : 'bg-rose-50 text-rose-600'}`}>
                                {item.up ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                                {item.trend}
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">{item.value}</p>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Flow */}
                <div className="lg:col-span-2 p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/20 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                        <div>
                            <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-1 flex items-center gap-3">
                                <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
                                Capital Trajectory
                            </h3>
                            <p className="text-[13px] text-slate-400 font-medium">Monitoring platform financial throughput</p>
                        </div>
                        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                            <button className="px-6 py-2 rounded-xl text-[11px] font-bold bg-white text-indigo-600 shadow-md border border-slate-100 transition-all">Revenue</button>
                            <button className="px-6 py-2 rounded-xl text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors">Growth</button>
                        </div>
                    </div>

                    <div className="h-[360px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.revenueHistory}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" >
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    stroke="#94a3b8"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontWeight: 700 }}
                                    dy={15}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontWeight: 700 }}
                                    tickFormatter={(v) => `₹${v}`}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                                    contentStyle={{
                                        background: '#fff',
                                        border: 'none',
                                        borderRadius: '20px',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                                        padding: '16px'
                                    }}
                                    itemStyle={{ fontSize: '13px', fontWeight: 'bold', color: '#6366f1' }}
                                    labelStyle={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#6366f1"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorRev)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Network Distribution */}
                <div className="p-10 rounded-[3rem] bg-indigo-900 border border-indigo-800 shadow-2xl shadow-indigo-900/40 text-white animate-fade-in-up flex flex-col" style={{ animationDelay: '0.2s' }}>
                    <h3 className="text-2xl font-bold tracking-tight mb-1">Ecosystem Mix</h3>
                    <p className="text-[13px] text-indigo-200/60 font-medium mb-10">User role distribution analysis</p>

                    <div className="h-[260px] relative mb-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={userRoleData}
                                    innerRadius={75}
                                    outerRadius={100}
                                    paddingAngle={10}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {userRoleData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: '#1e1b4b',
                                        border: '1px solid #312e81',
                                        borderRadius: '16px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                    }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <p className="text-4xl font-extrabold text-white">{(stats?.totalStudents + stats?.totalTeachers + stats?.usersCount?.admin).toLocaleString()}</p>
                            <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Global Nodes</p>
                        </div>
                    </div>

                    <div className="space-y-4 mt-auto">
                        {userRoleData.map((e, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-3xl bg-indigo-800/40 border border-indigo-700/50 backdrop-blur-sm transition-all hover:bg-indigo-800/60">
                                <div className="flex items-center gap-4">
                                    <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: COLORS[i], color: COLORS[i] }}></div>
                                    <span className="text-[11px] font-extrabold text-indigo-100 uppercase tracking-widest">{e.name}</span>
                                </div>
                                <span className="text-sm font-bold text-white tracking-widest">{e.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions / Notifications Bar */}
            {stats?.pendingTeachers?.length > 0 && (
                <div className="rounded-3xl bg-white border-2 border-indigo-50 p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse-slow">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                            <Zap size={28} className="fill-current" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-slate-900 tracking-tight">{stats.pendingTeachers.length} New verification requests</h4>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Instructors awaiting platform onboarding</p>
                        </div>
                    </div>
                    <Link to="/admin/teachers" className="px-8 py-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-2xl text-[11px] font-extrabold uppercase tracking-widest transition-all border border-indigo-100 group">
                        Review Pipeline <ArrowUpRight size={14} className="inline ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
