import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import { Edit2, Trash2, Eye, Plus, Check, Loader2, History, BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses/my-courses');
            setCourses(res.data.data.courses);
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;
        try {
            await api.delete(`/courses/${id}`);
            toast.success('Course deleted');
            setCourses(courses.filter(c => c._id !== id));
        } catch (e) {
            toast.error(e.message || 'Failed to delete course');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 animate-fade-in-up">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-slate-900 leading-tight">My <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">courses</span></h1>
                        <p className="text-slate-500 font-medium text-lg">Manage your curriculum and track student engagement.</p>
                    </div>
                    <Link to="/teacher/courses/create" className="inline-flex bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95 gap-3 items-center whitespace-nowrap">
                        <Plus size={20} /> Create new course
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-8 animate-fade-in-up delay-100">
                    {courses.length > 0 ? courses.map((course) => (
                        <div key={course._id} className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col md:row gap-8 items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-0 rounded-full -mr-16 -mt-16 blur-3xl group-hover:opacity-[0.03] transition-opacity"></div>

                            {/* Thumbnail */}
                            <div className="w-full md:w-72 aspect-video rounded-3xl overflow-hidden flex-shrink-0 group/img relative shadow-sm border border-slate-100">
                                <img src={course.thumbnail?.url} alt={course.title} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <Link to={`/courses/${course._id}`} className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all hover:scale-110">
                                        <Eye size={24} />
                                    </Link>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border ${course.approvalStatus === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        course.approvalStatus === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                            'bg-rose-50 text-rose-600 border-rose-100'
                                        }`}>
                                        {course.approvalStatus}
                                    </span>
                                    <span className="px-4 py-1.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">{course.category?.name}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                                <div className="flex flex-wrap gap-6 text-[11px] font-bold text-slate-400">
                                    <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100"><Users size={14} className="text-indigo-500" /> {course.enrolledStudents?.length || 0} students</span>
                                    <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100"><Loader2 size={14} className="text-purple-500" /> {course.courseVideos?.length || 0} lessons</span>
                                    <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100"><History size={14} className="text-slate-400" /> Updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <Link to={`/teacher/courses/edit/${course._id}`} className="flex-1 md:flex-none h-14 px-6 rounded-2xl bg-slate-50 text-slate-600 border border-slate-100 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all flex items-center justify-center gap-2 font-bold shadow-sm active:scale-95">
                                    <Edit2 size={18} /> Edit curriculum
                                </Link>
                                <button
                                    onClick={() => handleDelete(course._id)}
                                    className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border border-rose-100 shadow-sm active:scale-95"
                                    title="Delete course"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="bg-white p-24 rounded-[3rem] border border-dashed border-slate-200 text-center animate-fade-in-up shadow-sm">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200 shadow-inner">
                                <BookOpen size={48} />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-3">No courses found</h3>
                            <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">Start sharing your knowledge with the world. Your first masterpiece is just a few clicks away!</p>
                            <Link to="/teacher/courses/create" className="inline-flex bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-5 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95">Create your first course</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyCourses;
