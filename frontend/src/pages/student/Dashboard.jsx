import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import { BookOpen, Award, Clock, Play, XCircle, Loader2, ShieldCheck, PlayCircle } from 'lucide-react';
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-fade-in-up delay-300">
                        {enrolledCourses.map((course, i) => (
                            <div key={course._id} className="group bg-white rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl overflow-hidden transition-all duration-700 flex flex-col hover:-translate-y-4" style={{ animationDelay: `${i * 0.1}s` }}>
                                {/* Thumbnail Section - Decluttered */}
                                <div className="relative aspect-[16/9] overflow-hidden m-5 rounded-[2.8rem] shadow-inner bg-slate-100">
                                    <img src={course.thumbnail?.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={course.title} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-1000"></div>

                                    {/* Progress HUD - Prominent */}
                                    <div className="absolute inset-x-8 bottom-8 group-hover:translate-y-0 translate-y-2 transition-transform duration-700 z-10">
                                        <div className="flex justify-between items-end mb-3">
                                            <span className="text-[10px] font-semibold text-white uppercase tracking-[0.3em]">Course Mastery</span>
                                            <span className="text-2xl font-semibold text-white tabular-nums drop-shadow-lg">{course.progress?.progressPercent || 0}%</span>
                                        </div>
                                        <div className="h-3 w-full bg-white/20 backdrop-blur-md rounded-full overflow-hidden border border-white/10 p-0.5">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(129,140,248,0.6)]"
                                                style={{ width: `${course.progress?.progressPercent || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-12 pb-12 pt-6 flex-1 flex flex-col">
                                    {/* Body Badges Matrix */}
                                    <div className="flex flex-wrap items-center gap-3 mb-8">
                                        <span className={`px-5 py-2 rounded-2xl text-[10px] font-semibold border shadow-sm uppercase tracking-[0.2em] ${course.level === 'Beginner' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            course.level === 'Intermediate' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-rose-50 text-rose-600 border-rose-100'
                                            }`}>
                                            {course.level}
                                        </span>
                                        <span className="bg-indigo-50 text-indigo-600 px-5 py-2 rounded-2xl text-[10px] font-semibold border border-indigo-100 shadow-sm uppercase tracking-[0.2em]">
                                            {course.category?.name || 'Knowledge'}
                                        </span>
                                        <div className="flex-1"></div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-2xl shadow-xl">
                                            <ShieldCheck size={14} className="text-emerald-400" />
                                            <span className="text-[9px] font-semibold text-white uppercase tracking-widest">ENROLLED</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-400 uppercase tracking-[0.3em] bg-slate-50 px-4 py-2 rounded-xl">
                                            <Play size={12} className="text-indigo-600 fill-current" /> {course.courseVideos?.length || 0} Modules
                                        </div>
                                        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-400 uppercase tracking-[0.3em] bg-slate-50 px-4 py-2 rounded-xl">
                                            <Clock size={12} className="text-slate-400" /> {course.duration}H
                                        </div>
                                    </div>

                                    <h3 className="font-semibold text-3xl mb-12 line-clamp-2 text-slate-900 group-hover:text-indigo-600 transition-all tracking-tight leading-[1.1] min-h-[4.2rem]">
                                        {course.title}
                                    </h3>

                                    {/* Action & Mentor Integration */}
                                    <div className="mt-auto pt-10 border-t-2 border-slate-50 flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden border-4 border-white bg-slate-50 group-hover:border-indigo-600 transition-all shadow-xl ring-8 ring-slate-50">
                                                <img
                                                    src={course.teacher?.photo?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.teacher?.name || 'T')}&background=818cf8&color=fff`}
                                                    alt={course.teacher?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.3em] mb-1">Mentor</span>
                                                <p className="text-base text-slate-900 font-semibold tracking-tight truncate max-w-[140px] uppercase">{course.teacher?.name}</p>
                                            </div>
                                        </div>

                                        <Link
                                            to={`/watch/${course._id}`}
                                            className="bg-indigo-600 hover:bg-slate-900 text-white font-semibold py-5 px-10 rounded-[2rem] transition-all shadow-2xl shadow-indigo-600/20 active:scale-95 flex items-center gap-3 group/btn"
                                        >
                                            <span className="uppercase tracking-[0.2em] text-[11px]">Continue</span>
                                            <PlayCircle size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {course.progress?.completed && (
                                        <button
                                            onClick={async () => {
                                                window.open(`/api/users/certificate/${course._id}`, '_blank');
                                            }}
                                            className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 hover:bg-green-600 hover:text-white transition-all flex items-center justify-center border border-amber-100 shadow-sm active:scale-95 hover:border-green-500"
                                            title="Download certificate"
                                        >
                                            <Award size={24} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleCancelEnrollment(course._id)}
                                        className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-50 text-rose-500 border border-slate-100 hover:border-rose-100 transition-all flex items-center justify-center shadow-sm active:scale-95 group/cancel"
                                        title="Cancel enrollment"
                                    >
                                        <XCircle size={22} className="group-hover/cancel:scale-110 transition-transform" />
                                    </button>
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
