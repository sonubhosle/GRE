import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import {
    Search, BookOpen, Trash2, ExternalLink,
    MoreVertical, Filter, Loader2, Eye,
    CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/courses');
            setCourses(res.data.data.courses);
        } catch (e) {
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCourse = async (id) => {
        if (!window.confirm('Are you sure you want to PERMANENTLY delete this course? All student progress for this course will be lost.')) return;
        setActionLoading(id);
        try {
            await api.delete(`/courses/${id}`);
            toast.success('Course deleted permanently');
            fetchCourses();
        } catch (e) {
            toast.error(e.response?.data?.message || 'Deletion failed');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.teacher?.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
    );

    return (
        <div className="space-y-10 animate-fade-in-up ">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
                        Course <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Management</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-[13px]">Monitor, review, and manage all courses across the platform.</p>
                </div>

                <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                    <button className="px-5 py-2.5 rounded-xl text-[11px] font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-500/10">All Courses</button>
                    <button className="px-5 py-2.5 rounded-xl text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-all">Pending</button>
                    <button className="px-5 py-2.5 rounded-xl text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-all">Reported</button>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden transition-all duration-300">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by course or instructor..."
                            className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-6 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[11px] font-bold text-slate-400 bg-white px-4 py-2 rounded-xl border border-slate-100 uppercase tracking-wider">
                            {filteredCourses.length} active courses
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
                                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Course Information</th>
                                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Instructor</th>
                                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Stats</th>
                                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredCourses.map(course => (
                                <tr key={course._id} className="hover:bg-indigo-50/30 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="relative w-24 h-14 rounded-xl overflow-hidden shadow-sm border border-slate-100 flex-shrink-0">
                                                <img src={course.thumbnail?.url} className="w-full h-full object-cover" alt={course.title} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors truncate tracking-tight">{course.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">{course.category?.name}</span>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">₹{course.price}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                                                <img src={course.teacher?.photo?.url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher"} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-bold text-slate-700">{course.teacher?.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400">{course.teacher?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-700">{course.enrolledStudents?.length || 0}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Students</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-emerald-600 tracking-tighter">★ {course.ratingsAverage?.toFixed(1) || '0.0'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${course.approvalStatus === 'approved'
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-500/5'
                                            : course.approvalStatus === 'pending'
                                                ? 'bg-amber-50 text-amber-600 border-amber-100'
                                                : 'bg-rose-50 text-rose-600 border-rose-100'
                                            }`}>
                                            {course.approvalStatus === 'approved' ? <CheckCircle2 size={12} /> : course.approvalStatus === 'pending' ? <AlertCircle size={12} /> : <XCircle size={12} />}
                                            {course.approvalStatus}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                to={`/courses/${course._id}`}
                                                className="w-10 h-10 rounded-xl bg-white text-slate-400 hover:text-indigo-600 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50 transition-all flex items-center justify-center shadow-sm"
                                                title="View Page"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteCourse(course._id)}
                                                disabled={actionLoading === course._id}
                                                className="w-10 h-10 rounded-xl bg-white text-slate-400 hover:text-rose-600 border border-slate-100 hover:border-rose-100 hover:bg-rose-50 transition-all flex items-center justify-center shadow-sm"
                                                title="Delete Course"
                                            >
                                                {actionLoading === course._id ? <Loader2 size={18} className="animate-spin text-rose-500" /> : <Trash2 size={18} />}
                                            </button>
                                            <button className="w-10 h-10 rounded-xl bg-white text-slate-400 hover:text-slate-600 border border-slate-100 hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm">
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

            {filteredCourses.length === 0 && (
                <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200 animate-fade-in-up">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                        <BookOpen size={40} />
                    </div>
                    <p className="text-slate-900 font-bold text-lg mb-2 tracking-tight">No courses discovered</p>
                    <p className="text-slate-500 text-sm font-medium">Try broadening your search or check again later.</p>
                </div>
            )}
        </div>
    );
};

export default AdminCourses;
