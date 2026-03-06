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
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/stats');
            setStats(res.data.data);
        } catch (e) {
            toast.error('Failed to load admin statistics');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.patch(`/admin/teachers/${id}/approve`);
            toast.success('Teacher approved!');
            fetchStats();
        } catch (e) { toast.error('Check console for error'); }
    };

    const handleFire = async (id) => {
        if (!window.confirm('Are you sure you want to fire this teacher? All their courses will remain but they will lose access.')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            toast.success('Teacher removed from platform');
            fetchStats();
        } catch (e) { toast.error('Action failed'); }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
    );

    const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];
    const userRoleData = [
        { name: 'Students', value: stats?.usersCount?.student || 0 },
        { name: 'Teachers', value: stats?.usersCount?.teacher || 0 },
        { name: 'Admins', value: stats?.usersCount?.admin || 0 },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] font-bold text-indigo-600">
                            Admin portal
                        </div>
                        <div className="text-slate-400 text-[11px] font-bold">
                            <Calendar className="inline-block w-3 h-3 mr-1 mb-0.5" />
                            {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-slate-900">
                        Platform <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Overview</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Global statistics and administration control dashboard.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in-up">
                    {[
                        { icon: Users, label: 'Total students', value: stats?.totalStudents, color: 'indigo', trend: '+12%' },
                        { icon: GraduationCap, label: 'Total teachers', value: stats?.totalTeachers, color: 'purple', trend: '+5%' },
                        { icon: BookOpen, label: 'Total courses', value: stats?.totalCourses, color: 'emerald', trend: '+8%' },
                        { icon: CircleDollarSign, label: 'Total revenue', value: `₹${stats?.totalRevenue || 0}`, color: 'pink', trend: '+15%' },
                    ].map((item, i) => (
                        <div key={i} className="group p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-indigo-100 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-xl">
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-${item.color}-500 opacity-[0.03] rounded-full -mr-16 -mt-16 blur-2xl group-hover:opacity-[0.05] transition-opacity`}></div>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-${item.color}-50 border border-${item.color}-100 text-${item.color}-600`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                    <ArrowUpRight size={12} />
                                    {item.trend}
                                </div>
                            </div>
                            <div>
                                <p className="text-3xl font-bold tracking-tight text-slate-900 mb-1">{item.value}</p>
                                <p className="text-[11px] font-bold text-slate-400">{item.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Revenue Line Chart */}
                    <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-1">Revenue insights</h3>
                                <p className="text-xs text-slate-400 font-medium">Monthly financial performance</p>
                            </div>
                            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                                <button className="px-4 py-1.5 rounded-lg text-[11px] font-bold bg-white text-indigo-600 shadow-sm border border-slate-100">Growth</button>
                                <button className="px-4 py-1.5 rounded-lg text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors">Net</button>
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
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        stroke="#94a3b8"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontWeight: 600 }}
                                        tickFormatter={(v) => `₹${v}`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#fff',
                                            border: '1px solid #f1f5f9',
                                            borderRadius: '16px',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                        }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}
                                        labelStyle={{ fontSize: '11px', color: '#64748b', fontWeight: '700', marginBottom: '4px' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* User Roles Pie Chart */}
                    <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-1">User demographics</h3>
                        <p className="text-xs text-slate-400 font-medium mb-10">Role-based distribution</p>
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
                                            background: '#fff',
                                            border: '1px solid #f1f5f9',
                                            borderRadius: '16px',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <p className="text-2xl font-bold text-slate-900">{stats?.totalStudents + stats?.totalTeachers + stats?.usersCount?.admin}</p>
                                <p className="text-[11px] font-bold text-slate-400">Total users</p>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-col gap-3">
                            {userRoleData.map((e, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                                        <span className="text-[11px] font-bold text-slate-500">{e.name}</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-900">{e.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pending Approvals Section */}
                <div className="rounded-[2.5rem] bg-white border border-slate-100 shadow-xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-1">Pending teacher approvals</h3>
                            <p className="text-xs text-slate-400 font-medium">Review instructor applications</p>
                        </div>
                        <div className="px-4 py-1.5 rounded-xl bg-amber-50 border border-amber-100 text-[11px] font-bold text-amber-600">
                            {stats?.pendingTeachers?.length || 0} Awaiting action
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400">Applicant</th>
                                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400">Specialization</th>
                                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400">Experience</th>
                                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {stats?.pendingTeachers?.map(teacher => (
                                    <tr key={teacher._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <img src={teacher.photo?.url} className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
                                                <div>
                                                    <span className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors tracking-tight">{teacher.name}</span>
                                                    <p className="text-[11px] text-slate-400 font-bold mt-0.5">{teacher.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-semibold text-slate-600">
                                            {teacher.specialization}
                                        </td>
                                        <td className="px-8 py-5 text-sm font-bold text-slate-500">
                                            {teacher.experience} <span className="text-[11px] font-bold ml-1 text-slate-300">Years</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleApprove(teacher._id)}
                                                    className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                    title="Approve Teacher"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleFire(teacher._id)}
                                                    className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                    title="Reject/Fire"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {(!stats?.pendingTeachers || stats.pendingTeachers.length === 0) && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-20 text-slate-300 font-medium">
                                            <div className="flex flex-col items-center">
                                                <Flag className="w-12 h-12 text-slate-100 mb-4" />
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

