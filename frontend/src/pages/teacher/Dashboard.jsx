import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, CircleDollarSign, Star, BookOpen, Plus, Loader2 } from 'lucide-react';

const TeacherDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/teacher/dashboard');
                setStats(res.data.data);
            } catch (e) {
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
    );

    const chartData = stats?.monthlyRevenue?.map(item => ({
        name: `${item._id.month}/${item._id.year}`,
        revenue: item.revenue,
        enrollments: item.enrollments
    })) || [];

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 animate-fade-in-up">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-slate-900 leading-tight">Teacher <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Dashboard</span></h1>
                        <p className="text-slate-500 font-medium text-lg">Track your growth and manage your curriculum with ease.</p>
                    </div>
                    <Link to="/teacher/courses/create" className="inline-flex bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95 gap-3 items-center whitespace-nowrap">
                        <Plus size={20} /> Create new course
                    </Link>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 animate-fade-in-up delay-100">
                    <div className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-0 rounded-full -mr-16 -mt-16 blur-3xl group-hover:opacity-[0.03] transition-opacity"></div>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                <Users size={28} />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-900">{stats?.totalStudents || 0}</p>
                                <p className="text-[11px] font-bold text-slate-400">Total students</p>
                            </div>
                        </div>
                    </div>

                    <div className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 opacity-0 rounded-full -mr-16 -mt-16 blur-3xl group-hover:opacity-[0.03] transition-opacity"></div>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                <CircleDollarSign size={28} />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-900">₹{stats?.totalRevenue || 0}</p>
                                <p className="text-[11px] font-bold text-slate-400">Total revenue</p>
                            </div>
                        </div>
                    </div>

                    <div className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-0 rounded-full -mr-16 -mt-16 blur-3xl group-hover:opacity-[0.03] transition-opacity"></div>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                <Star size={28} />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-900">{stats?.avgRating || 0}</p>
                                <p className="text-[11px] font-bold text-slate-400">Avg rating</p>
                            </div>
                        </div>
                    </div>

                    <div className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-0 rounded-full -mr-16 -mt-16 blur-3xl group-hover:opacity-[0.03] transition-opacity"></div>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                <BookOpen size={28} />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-900">{stats?.totalCourses || 0}</p>
                                <p className="text-[11px] font-bold text-slate-400">Active courses</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
                    {/* Revenue Chart */}
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm animate-fade-in-up delay-200">
                        <h3 className="text-2xl font-bold text-slate-900 mb- aggregation">Revenue growth</h3>
                        <div className="h-[350px] mt-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                                    <Tooltip
                                        contentStyle={{ background: '#fff', border: 'none', borderRadius: '1.5rem', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Enrollments Chart */}
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm animate-fade-in-up delay-300">
                        <h3 className="text-2xl font-bold text-slate-900 mb-8">Monthly enrollments</h3>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc', radius: 12 }}
                                        contentStyle={{ background: '#fff', border: 'none', borderRadius: '1.5rem', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="enrollments" fill="#10b981" radius={[12, 12, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Course Performance Table */}
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden animate-fade-in-up delay-400">
                    <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <h3 className="text-2xl font-bold text-slate-900">Course performance</h3>
                        <Link to="/teacher/courses" className="text-indigo-600 text-sm font-bold hover:underline">View all courses</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-10 py-6 text-[11px] font-bold text-slate-400">Course name</th>
                                    <th className="px-10 py-6 text-[11px] font-bold text-slate-400">Enrolled</th>
                                    <th className="px-10 py-6 text-[11px] font-bold text-slate-400">Revenue</th>
                                    <th className="px-10 py-6 text-[11px] font-bold text-slate-400">Rating</th>
                                    <th className="px-10 py-6 text-[11px] font-bold text-slate-400 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {stats?.courseStats?.slice(0, 5).map(c => (
                                    <tr key={c._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-10 py-6 font-bold text-slate-900">{c.title}</td>
                                        <td className="px-10 py-6 text-slate-500 font-medium">{c.enrollments} students</td>
                                        <td className="px-10 py-6 text-slate-900 font-bold">₹{c.revenue}</td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full w-fit border border-amber-100 font-bold text-xs">
                                                <Star size={14} className="fill-current" /> {c.rating}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <Link to={`/teacher/courses/edit/${c._id}`} className="text-indigo-600 hover:text-indigo-700 font-bold text-sm">Edit</Link>
                                        </td>
                                    </tr>
                                ))}
                                {(!stats?.courseStats || stats.courseStats.length === 0) && (
                                    <tr>
                                        <td colSpan="5" className="px-10 py-24 text-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                                                <BookOpen size={24} />
                                            </div>
                                            <p className="text-slate-500 font-medium">You haven't created any courses yet.</p>
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

export default TeacherDashboard;
