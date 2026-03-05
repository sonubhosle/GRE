import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, CircleDollarSign, Star, BookOpen, Plus } from 'lucide-react';

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

    if (loading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;

    const chartData = stats?.monthlyRevenue?.map(item => ({
        name: `${item._id.month}/${item._id.year}`,
        revenue: item.revenue,
        enrollments: item.enrollments
    })) || [];

    return (
        <div className="container py-12">
            <div className="flex justify-between items-end mb-12 fade-in-up">
                <div>
                    <h1 className="text-4xl font-bold mb-2 text-white">Teacher Dashboard</h1>
                    <p className="text-text-muted">Manage your courses and track your performance.</p>
                </div>
                <Link to="/teacher/courses/create" className="btn-primary gap-2">
                    <Plus className="w-5 h-5" /> Create New Course
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="card p-6 bg-primary/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-2xl"><Users /></div>
                    <div><p className="text-2xl font-bold">{stats?.totalStudents || 0}</p><p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Total Students</p></div>
                </div>
                <div className="card p-6 bg-accent/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent text-2xl"><CircleDollarSign /></div>
                    <div><p className="text-2xl font-bold">₹{stats?.totalRevenue || 0}</p><p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Total Revenue</p></div>
                </div>
                <div className="card p-6 bg-secondary/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary text-2xl"><Star /></div>
                    <div><p className="text-2xl font-bold">{stats?.avgRating || 0}</p><p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Avg Rating</p></div>
                </div>
                <div className="card p-6 bg-white/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white text-2xl"><BookOpen /></div>
                    <div><p className="text-2xl font-bold">{stats?.totalCourses || 0}</p><p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Active Courses</p></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Revenue Chart */}
                <div className="card p-8 fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <h3 className="text-xl font-bold mb-8">Revenue Growth</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3f" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ background: '#1a1a2e', border: '1px solid #2d2d3f', borderRadius: '12px' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Enrollments Chart */}
                <div className="card p-8 fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <h3 className="text-xl font-bold mb-8">Monthly Enrollments</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3f" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ background: '#1a1a2e', border: '1px solid #2d2d3f', borderRadius: '12px' }}
                                />
                                <Bar dataKey="enrollments" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Course Performance Table */}
            <div className="card overflow-hidden fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="p-8 border-b border-border flex justify-between items-center">
                    <h3 className="text-xl font-bold">Course Performance</h3>
                    <Link to="/teacher/courses" className="text-primary text-sm font-bold hover:underline">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th>Course Name</th>
                                <th>Enrolled</th>
                                <th>Revenue</th>
                                <th>Rating</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.courseStats?.slice(0, 5).map(c => (
                                <tr key={c._id}>
                                    <td className="font-bold text-white">{c.title}</td>
                                    <td>{c.enrollments}</td>
                                    <td>₹{c.revenue}</td>
                                    <td><div className="flex items-center gap-1"><Star size={16} className="text-yellow-500 fill-yellow-500" /> {c.rating}</div></td>
                                    <td><Link to={`/teacher/courses/edit/${c._id}`} className="text-primary hover:underline font-bold text-xs uppercase tracking-widest">Edit</Link></td>
                                </tr>
                            ))}
                            {(!stats?.courseStats || stats.courseStats.length === 0) && (
                                <tr><td colSpan="5" className="text-center py-12 text-text-muted">You haven't created any courses yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
