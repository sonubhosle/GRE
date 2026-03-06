import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import { BookOpen, Award, Clock, Play, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const StudentDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEnrolled = async () => {
        try {
            const res = await api.get('/users/enrolled-courses');
            setEnrolledCourses(res.data.data.courses);
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEnrollment = async (courseId) => {
        if (!window.confirm('Are you sure you want to cancel your enrollment in this course? Your progress will be lost.')) return;
        try {
            await api.delete(`/users/cancel-enrollment/${courseId}`);
            toast.success('Enrollment cancelled successfully');
            fetchEnrolled();
        } catch (e) {
            toast.error(e.response?.data?.message || 'Failed to cancel enrollment');
        }
    };

    useEffect(() => {
        fetchEnrolled();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
    );

    const completedCourses = enrolledCourses.filter(c => c.progress?.completed);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-slate-900 leading-tight">
                        Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">{user?.name}</span>! 👋
                    </h1>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl">You're doing great! Continue your learning journey where you left off.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 animate-fade-in-up delay-100">
                    <div className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-0 rounded-full -mr-16 -mt-16 blur-3xl group-hover:opacity-[0.03] transition-opacity"></div>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                <BookOpen size={28} />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-900">{enrolledCourses.length}</p>
                                <p className="text-[11px] font-bold text-slate-400">Enrolled courses</p>
                            </div>
                        </div>
                    </div>

                    <div className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-0 rounded-full -mr-16 -mt-16 blur-3xl group-hover:opacity-[0.03] transition-opacity"></div>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                <Award size={28} />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-900">{completedCourses.length}</p>
                                <p className="text-[11px] font-bold text-slate-400">Certificates earned</p>
                            </div>
                        </div>
                    </div>

                    <div className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500 opacity-0 rounded-full -mr-16 -mt-16 blur-3xl group-hover:opacity-[0.03] transition-opacity"></div>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                <Clock size={28} />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-900">~{enrolledCourses.reduce((acc, c) => acc + (c.duration || 0), 0)}h</p>
                                <p className="text-[11px] font-bold text-slate-400">Total study time</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-10 animate-fade-in-up delay-200">
                    <h2 className="text-3xl font-bold text-slate-900">My enrolled <span className="text-indigo-600">courses</span></h2>
                    <Link to="/courses" className="text-indigo-600 font-bold text-sm hover:underline">Explore more</Link>
                </div>

                {enrolledCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-fade-in-up delay-300">
                        {enrolledCourses.map((course, i) => (
                            <div key={course._id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl overflow-hidden transition-all duration-500 flex flex-col" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="relative aspect-video overflow-hidden">
                                    <img src={course.thumbnail?.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute inset-x-6 bottom-6 group-hover:translate-y-0 translate-y-4 transition-transform duration-500">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-bold text-white/90">Course progress</span>
                                            <span className="text-xs font-bold text-white">{course.progress?.progressPercent || 0}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/20 backdrop-blur-md rounded-full overflow-hidden border border-white/10">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-1000 shadow-[0_0_10px_rgba(129,140,248,0.5)]"
                                                style={{ width: `${course.progress?.progressPercent || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <Link to={`/watch/${course._id}`} className="font-bold text-xl text-slate-900 mb-4 hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                                        {course.title}
                                    </Link>
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
                                            <img src={course.teacher?.photo?.url || 'https://via.placeholder.com/32'} className="w-full h-full object-cover" />
                                        </div>
                                        <p className="text-sm text-slate-500 font-medium">{course.teacher?.name}</p>
                                    </div>

                                    <div className="mt-auto flex gap-3">
                                        <Link to={`/watch/${course._id}`} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 group/btn">
                                            <Play size={18} className="fill-current group-hover:scale-110 transition-transform" />
                                            {course.progress?.progressPercent > 0 ? 'Resume' : 'Start learning'}
                                        </Link>
                                        <button
                                            onClick={() => handleCancelEnrollment(course._id)}
                                            className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-50 text-rose-500 border border-slate-100 hover:border-rose-100 transition-all flex items-center justify-center shadow-sm active:scale-95 group/cancel"
                                            title="Cancel enrollment"
                                        >
                                            <XCircle size={22} className="group-hover/cancel:scale-110 transition-transform" />
                                        </button>
                                        {course.progress?.completed && (
                                            <button
                                                onClick={async () => {
                                                    window.open(`/api/users/certificate/${course._id}`, '_blank');
                                                }}
                                                className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center border border-amber-100 shadow-sm active:scale-95"
                                                title="Download certificate"
                                            >
                                                <Award size={24} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-24 rounded-[3rem] border border-dashed border-slate-200 text-center animate-fade-in-up shadow-sm">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
                            <BookOpen size={48} />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-3">No courses enrolled yet</h3>
                        <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">Take the first step in your career by choosing a expert-led course.</p>
                        <Link to="/courses" className="inline-flex bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-5 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95">Browse all courses</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
