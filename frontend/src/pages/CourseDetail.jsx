import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseById } from '../features/courses/courseSlice';
import { Spinner } from '../components/common/Spinner';
import {
    Star, Clock, TrendingUp, Globe, Check, PlayCircle,
    Lock, FileText, Users, ChevronRight, Zap, Trophy,
    ShieldCheck, Calendar, Activity, Info
} from 'lucide-react';
import { toast } from 'react-toastify';

const CourseDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentCourse, loading } = useSelector((state) => state.courses);
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        dispatch(fetchCourseById(id));
    }, [id, dispatch]);

    if (loading || !currentCourse) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-16 h-16 relative mb-4">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
            <span className="text-[11px] font-bold text-slate-400 animate-pulse">Loading course details...</span>
        </div>
    );

    const isEnrolled = user?.enrolledCourses?.includes(id);

    const handleEnroll = () => {
        if (!isAuthenticated) {
            toast.info('Authentication required to enroll');
            return navigate('/login');
        }
        navigate(`/checkout/${id}`);
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 pb-24">
            {/* Cinematic Hero Header */}
            <div className="relative pt-32 pb-20 border-b border-slate-100 overflow-hidden">
                {/* Background dynamics */}
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-indigo-600/[0.02] via-transparent to-transparent opacity-50"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/[0.02] blur-[120px] rounded-full"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-3 gap-16 items-start">
                        <div className="lg:col-span-2 space-y-8 animate-fade-in-up">
                            <nav className="flex items-center gap-3 text-[11px] font-bold text-slate-400 mb-8">
                                <Link to="/courses" className="hover:text-indigo-600 transition-colors">Catalog</Link>
                                <ChevronRight size={10} className="text-slate-300" />
                                <span className="text-indigo-600 font-bold">{currentCourse.category?.name}</span>
                            </nav>

                            <h1 className="text-4xl md:text-6xl font-bold leading-none tracking-tight text-slate-900">
                                {currentCourse.title}
                            </h1>

                            <p className="text-slate-500 text-lg md:text-xl font-medium max-w-3xl leading-relaxed">
                                {currentCourse.description.substring(0, 180)}...
                            </p>

                            <div className="flex flex-wrap items-center gap-8 pt-6">
                                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
                                    <Star className="text-amber-400" size={18} fill="currentColor" />
                                    <span className="font-bold text-slate-900">{currentCourse.ratingsAverage}</span>
                                    <span className="text-slate-400 text-[11px] font-bold">({currentCourse.ratingsQuantity} reviews)</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Users className="text-indigo-600" size={18} />
                                    <span className="text-xs font-bold">{currentCourse.enrolledStudents?.length || 0} enrolled</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Globe className="text-purple-600" size={18} />
                                    <span className="text-xs font-bold">{currentCourse.language}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-10 group">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-10 group-hover:opacity-20 transition-opacity"></div>
                                    <img
                                        src={currentCourse.teacher?.photo?.url || 'https://via.placeholder.com/100'}
                                        alt={currentCourse.teacher?.name}
                                        className="relative w-14 h-14 rounded-2xl border border-slate-200 object-cover shadow-xl"
                                    />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold mb-1">Lead instructor</p>
                                    <p className="text-sm font-bold text-slate-900">{currentCourse.teacher?.name}</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Purchase Matrix */}
                        <div className="lg:col-span-1 lg:sticky lg:top-32 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="relative p-6 bg-white border border-slate-100 shadow-2xl rounded-[3rem] overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/[0.02] via-transparent to-transparent"></div>

                                <div className="relative rounded-[2rem] overflow-hidden aspect-video mb-8 group/preview cursor-pointer shadow-lg border border-slate-100">
                                    <img
                                        src={currentCourse.thumbnail?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                        className="w-full h-full object-cover group-hover/preview:scale-110 transition-transform duration-1000 opacity-90"
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/5 group-hover/preview:bg-transparent transition-colors">
                                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white shadow-xl group-hover/preview:scale-110 transition-transform duration-500">
                                            <PlayCircle size={32} />
                                        </div>
                                        <span className="text-[11px] font-bold text-white mt-4 shadow-lg">Preview module</span>
                                    </div>
                                </div>

                                <div className="px-4 py-2">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-slate-400 mb-1">Access pass</span>
                                            <div className="flex items-end gap-3">
                                                <span className="text-4xl font-bold text-slate-900 tracking-tight">₹{currentCourse.finalPrice}</span>
                                                {currentCourse.discount > 0 && (
                                                    <span className="text-sm text-slate-400 line-through font-bold mb-1">₹{currentCourse.price}</span>
                                                )}
                                            </div>
                                        </div>
                                        {currentCourse.discount > 0 && (
                                            <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100 text-[11px] font-bold">
                                                -{currentCourse.discount}%
                                            </div>
                                        )}
                                    </div>

                                    {isEnrolled ? (
                                        <Link to={`/watch/${id}`} className="flex items-center justify-center gap-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-[2rem] shadow-xl shadow-indigo-600/20 transition-all text-sm mb-8">
                                            Continue learning <ChevronRight size={18} />
                                        </Link>
                                    ) : (
                                        <button onClick={handleEnroll} className="group relative flex items-center justify-center gap-3 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-[2rem] shadow-xl transition-all text-sm mb-8 active:scale-95">
                                            Join Course <Zap size={18} className="fill-current" />
                                        </button>
                                    )}

                                    <div className="space-y-6 pt-6 border-t border-slate-50">
                                        <h4 className="text-[11px] font-bold text-slate-400">What's included</h4>
                                        <ul className="space-y-4">
                                            <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                                <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                    <PlayCircle size={14} />
                                                </div>
                                                {currentCourse.duration} hours of video lessons
                                            </li>
                                            <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                                <div className="w-6 h-6 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                                                    <FileText size={14} />
                                                </div>
                                                {currentCourse.studyMaterials?.length || 0} study materials
                                            </li>
                                            <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                                <div className="w-6 h-6 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600">
                                                    <Trophy size={14} />
                                                </div>
                                                Professional certification
                                            </li>
                                            <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                                <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                    <ShieldCheck size={14} />
                                                </div>
                                                Lifetime access
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* In-depth content section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                <div className="grid lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-20">
                        {/* Tab Navigation System */}
                        <div className="flex gap-10 border-b border-slate-100 overflow-x-auto pb-4">
                            {['overview', 'curriculum', 'instructor', 'reviews'].map(tab => (
                                <button
                                    key={tab}
                                    className={`relative text-[11px] font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    {activeTab === tab && (
                                        <div className="absolute -bottom-[17px] inset-x-0 h-[2px] bg-indigo-600"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Dynamic content matrix */}
                        <div className="animate-fade-in">
                            {activeTab === 'overview' && (
                                <div className="space-y-16">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="col-span-full">
                                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-8 flex items-center gap-3">
                                                <Zap className="text-amber-400" size={24} />
                                                Learning Outcomes
                                            </h3>
                                        </div>
                                        {[
                                            'Master industrial-grade software engineering protocols',
                                            'Develop high-performance production systems',
                                            'Implement elite security and scalability standards',
                                            'Deploy precision workflows and automation systems'
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-4 p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-indigo-600/20 transition-all">
                                                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                                                    <Check size={18} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-500 leading-relaxed group-hover:text-slate-900 transition-colors">{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                                            <Info className="text-indigo-600" size={24} />
                                            Course Description
                                        </h3>
                                        <div className="text-slate-600 font-medium leading-[1.8] text-lg whitespace-pre-line bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                            {currentCourse.description}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'curriculum' && (
                                <div className="space-y-8">
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                                        <Activity className="text-purple-600" size={24} />
                                        Curriculum
                                    </h3>
                                    <div className="space-y-3">
                                        {currentCourse.courseVideos.map((video, i) => (
                                            <div key={video._id} className="group flex items-center justify-between p-6 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-indigo-600/20 rounded-[1.5rem] transition-all">
                                                <div className="flex items-center gap-5">
                                                    <span className="text-[10px] font-bold text-slate-300 w-6 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform shadow-sm">
                                                        <PlayCircle size={20} />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700 tracking-tight group-hover:text-indigo-600 transition-colors">{video.title}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-3 py-1 rounded-lg">
                                                        {Math.floor(video.duration / 60)}M {video.duration % 60}S
                                                    </span>
                                                    {!isEnrolled && <Lock size={14} className="text-slate-300" />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'instructor' && (
                                <div className="space-y-8">
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                                        <User className="text-indigo-600" size={24} />
                                        Lead faculty
                                    </h3>
                                    <div className="p-10 bg-white border border-slate-100 shadow-2xl rounded-[3rem] flex flex-col md:flex-row gap-12 items-start relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/[0.02] blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                        <div className="relative">
                                            <img src={currentCourse.teacher?.photo?.url || 'https://via.placeholder.com/200'} className="w-32 h-32 rounded-[2rem] object-cover border border-slate-100 shadow-xl group-hover:scale-105 transition-transform duration-700" />
                                            <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white border-2 border-white shadow-xl">
                                                <ShieldCheck size={24} />
                                            </div>
                                        </div>
                                        <div className="space-y-6 flex-1">
                                            <div>
                                                <h3 className="text-3xl font-bold text-slate-900 mb-2">{currentCourse.teacher?.name}</h3>
                                                <p className="text-indigo-600 text-[11px] font-bold">{currentCourse.teacher?.specialization}</p>
                                            </div>
                                            <p className="text-slate-600 text-base font-medium leading-relaxed">{currentCourse.teacher?.bio}</p>
                                            <div className="grid grid-cols-3 gap-6 py-6 border-y border-slate-100">
                                                <div className="text-center md:text-left">
                                                    <p className="text-2xl font-bold text-slate-900 tracking-tight">12k+</p>
                                                    <p className="text-[10px] text-slate-400 font-bold mt-1">Learners</p>
                                                </div>
                                                <div className="text-center md:text-left">
                                                    <p className="text-2xl font-bold text-slate-900 tracking-tight">{currentCourse.teacher?.experience}Y</p>
                                                    <p className="text-[10px] text-slate-400 font-bold mt-1">Expertise</p>
                                                </div>
                                                <div className="text-center md:text-left">
                                                    <p className="text-2xl font-bold text-slate-900 tracking-tight">100%</p>
                                                    <p className="text-[10px] text-slate-400 font-bold mt-1">Score</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;

