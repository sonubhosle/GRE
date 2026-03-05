import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Users, GraduationCap, BookOpen, CircleDollarSign, Flag, Check, X, TrendingUp, Calendar, ArrowUpRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [statsRes, revenueRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/revenue')
                ]);
                setStats({ ...statsRes.data.data, revenueHistory: revenueRes.data.data.monthlyRevenue });
            } catch (e) {
                toast.error('Failed to load admin statistics');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        </div>
    );

    const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];
    const userRoleData = [
        { name: 'Students', value: stats?.usersCount?.student || 0 },
        { name: 'Teachers', value: stats?.usersCount?.teacher || 0 },
        { name: 'Admins', value: stats?.usersCount?.admin || 0 },
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                            Admin Portal
                        </div>
                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                            <Calendar className="inline-block w-3 h-3 mr-1 mb-0.5" />
                            {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                        Platform <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Overview</span>
                    </h1>
                    <p className="text-slate-400 font-medium">Global statistics and administration control dashboard.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in-up">
                    {[
                        { icon: Users, label: 'Total Students', value: stats?.totalStudents, color: 'indigo', trend: '+12%' },
                        { icon: GraduationCap, label: 'Total Teachers', value: stats?.totalTeachers, color: 'purple', trend: '+5%' },
                        { icon: BookOpen, label: 'Total Courses', value: stats?.totalCourses, color: 'emerald', trend: '+8%' },
                        { icon: CircleDollarSign, label: 'Total Revenue', value: `₹${stats?.totalRevenue || 0}`, color: 'pink', trend: '+15%' },
                    ].map((item, i) => (
                        <div key={i} className="group p-6 rounded-[2rem] bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden shadow-2xl">
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-${item.color}-500 opacity-[0.03] rounded-full -mr-16 -mt-16 blur-2xl group-hover:opacity-[0.05] transition-opacity`}></div>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-${item.color}-500/10 border border-${item.color}-500/20 text-${item.color}-400`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">
                                    <ArrowUpRight size={12} />
                                    {item.trend}
                                </div>
                            </div>
                            <div>
                                <p className="text-3xl font-black tracking-tighter text-white mb-1">{item.value}</p>
                                <p className="uppercase tracking-widest text-[9px] font-black text-slate-500">{item.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Revenue Line Chart */}
                    <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/5 shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-black tracking-tight text-white mb-1">Revenue Insights</h3>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Monthly financial performance</p>
                            </div>
                            <div className="flex bg-slate-950/50 p-1 rounded-xl border border-white/5">
                                <button className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white shadow-lg">Growth</button>
                                <button className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-300">Net</button>
                            </div>
                        </div>
                        <div className="h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.revenueHistory}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        stroke="#475569"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="#475569"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontWeight: 600 }}
                                        tickFormatter={(v) => `₹${v}`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'rgba(15, 23, 42, 0.9)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '16px',
                                            backdropFilter: 'blur(12px)',
                                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                                        }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}
                                        labelStyle={{ fontSize: '10px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* User Roles Pie Chart */}
                    <div className="p-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/5 shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <h3 className="text-xl font-black tracking-tight text-white mb-1">User Demographics</h3>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mb-10">Role-based distribution</p>
                        <div className="h-[240px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={userRoleData}
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {userRoleData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: 'rgba(15, 23, 42, 0.9)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '16px',
                                            backdropFilter: 'blur(12px)'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <p className="text-2xl font-black text-white">{stats?.totalStudents + stats?.totalTeachers + stats?.usersCount?.admin}</p>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Users</p>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-col gap-3">
                            {userRoleData.map((e, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/40 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                                        <span className="text-[11px] font-bold uppercase tracking-tight text-slate-400">{e.name}</span>
                                    </div>
                                    <span className="text-xs font-black text-white">{e.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pending Approvals Section */}
                <div className="rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <div className="p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-black tracking-tight text-white mb-1">Pending Teacher Approvals</h3>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Review instructor applications</p>
                        </div>
                        <div className="px-4 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] font-black text-amber-400 uppercase tracking-widest">
                            {stats?.pendingTeachers?.length || 0} Awaiting Action
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.01]">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Applicant</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Specialization</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Experience</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {stats?.pendingTeachers?.map(teacher => (
                                    <tr key={teacher._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <img src={teacher.photo?.url} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                                                <div>
                                                    <span className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{teacher.name}</span>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{teacher.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-semibold text-slate-300">
                                            {teacher.specialization}
                                        </td>
                                        <td className="px-8 py-5 text-sm font-black text-slate-400">
                                            {teacher.experience} <span className="text-[10px] uppercase tracking-widest font-bold ml-1 text-slate-600">Years</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10">
                                                    <Check size={18} />
                                                </button>
                                                <button className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/10">
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {(!stats?.pendingTeachers || stats.pendingTeachers.length === 0) && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-20 text-slate-500 font-medium">
                                            <div className="flex flex-col items-center">
                                                <Flag className="w-12 h-12 text-slate-800 mb-4" />
                                                <p className="text-sm">No pending teacher applications at the moment.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

