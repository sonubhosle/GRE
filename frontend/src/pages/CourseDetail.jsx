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
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a]">
            <div className="w-16 h-16 relative mb-4">
                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">Decrypting Course Archive...</span>
        </div>
    );

    const isEnrolled = user?.enrolledCourses?.includes(id);

    const handleEnroll = () => {
        if (!isAuthenticated) {
            toast.info('AUTHENTICATION REQUIRED FOR ACCESS');
            return navigate('/login');
        }
        navigate(`/checkout/${id}`);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-24">
            {/* Cinematic Hero Header */}
            <div className="relative pt-32 pb-20 border-b border-white/5 overflow-hidden">
                {/* Background dynamics */}
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-indigo-600/10 via-transparent to-transparent opacity-50"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-3 gap-16 items-start">
                        <div className="lg:col-span-2 space-y-8 animate-fade-in-up">
                            <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8">
                                <Link to="/courses" className="hover:text-indigo-400 transition-colors">Academy Directory</Link>
                                <ChevronRight size={10} className="text-slate-700" />
                                <span className="text-indigo-400">{currentCourse.category?.name}</span>
                            </nav>

                            <h1 className="text-4xl md:text-6xl font-black leading-none tracking-tighter text-white uppercase">
                                {currentCourse.title}
                            </h1>

                            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-3xl leading-relaxed">
                                {currentCourse.description.substring(0, 180)}...
                            </p>

                            <div className="flex flex-wrap items-center gap-8 pt-6">
                                <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2.5 rounded-2xl border border-white/5 shadow-xl">
                                    <Star className="text-amber-400" size={18} fill="currentColor" />
                                    <span className="font-black text-white">{currentCourse.ratingsAverage}</span>
                                    <span className="text-slate-500 text-[10px] font-bold">({currentCourse.ratingsQuantity} REVIEWS)</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Users className="text-indigo-400" size={18} />
                                    <span className="text-xs font-black uppercase tracking-widest">{currentCourse.enrolledStudents?.length || 0} ENROLLED</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Globe className="text-purple-400" size={18} />
                                    <span className="text-xs font-black uppercase tracking-widest">{currentCourse.language}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-10 group">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                    <img
                                        src={currentCourse.teacher?.photo?.url || 'https://via.placeholder.com/100'}
                                        alt={currentCourse.teacher?.name}
                                        className="relative w-14 h-14 rounded-2xl border border-white/10 object-cover shadow-2xl"
                                    />
                                </div>
                                <div>
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black mb-1">Lead Instructor</p>
                                    <p className="text-sm font-black text-white uppercase tracking-tighter">{currentCourse.teacher?.name}</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Purchase Matrix */}
                        <div className="lg:col-span-1 lg:sticky lg:top-32 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="relative p-6 bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 shadow-3xl overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent"></div>

                                <div className="relative rounded-[2rem] overflow-hidden aspect-video mb-8 group/preview cursor-pointer shadow-2xl border border-white/5">
                                    <img
                                        src={currentCourse.thumbnail?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                        className="w-full h-full object-cover group-hover/preview:scale-110 transition-transform duration-1000 opacity-60"
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/20 group-hover/preview:bg-transparent transition-colors">
                                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-2xl group-hover/preview:scale-110 transition-transform duration-500">
                                            <PlayCircle size={32} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white mt-4 shadow-lg">Preview Module</span>
                                    </div>
                                </div>

                                <div className="px-4 py-2">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Access Pass</span>
                                            <div className="flex items-end gap-3">
                                                <span className="text-4xl font-black text-white tracking-tighter">₹{currentCourse.finalPrice}</span>
                                                {currentCourse.discount > 0 && (
                                                    <span className="text-sm text-slate-600 line-through font-bold mb-1">₹{currentCourse.price}</span>
                                                )}
                                            </div>
                                        </div>
                                        {currentCourse.discount > 0 && (
                                            <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                                                -{currentCourse.discount}%
                                            </div>
                                        )}
                                    </div>

                                    {isEnrolled ? (
                                        <Link to={`/watch/${id}`} className="flex items-center justify-center gap-3 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-indigo-500/30 transition-all uppercase tracking-widest text-[10px] mb-8">
                                            Continue Learning <ChevronRight size={18} />
                                        </Link>
                                    ) : (
                                        <button onClick={handleEnroll} className="group relative flex items-center justify-center gap-3 w-full bg-white hover:bg-slate-100 text-slate-950 font-black py-5 rounded-[2rem] shadow-2xl transition-all uppercase tracking-widest text-[10px] mb-8 active:scale-95">
                                            Initialize Enrollment <Zap size={18} className="fill-current" />
                                        </button>
                                    )}

                                    <div className="space-y-6 pt-6 border-t border-white/5">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Curriculum Package</h4>
                                        <ul className="space-y-4">
                                            <li className="flex items-center gap-3 text-xs font-bold text-slate-300">
                                                <div className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                    <PlayCircle size={14} />
                                                </div>
                                                {currentCourse.duration} HOURS ACCREDITED VIDEO
                                            </li>
                                            <li className="flex items-center gap-3 text-xs font-bold text-slate-300">
                                                <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                                                    <FileText size={14} />
                                                </div>
                                                {currentCourse.studyMaterials?.length || 0} DEPTH RESOURCES
                                            </li>
                                            <li className="flex items-center gap-3 text-xs font-bold text-slate-300">
                                                <div className="w-6 h-6 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400">
                                                    <Trophy size={14} />
                                                </div>
                                                PROFESSIONAL CERTIFICATION
                                            </li>
                                            <li className="flex items-center gap-3 text-xs font-bold text-slate-300">
                                                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                                    <ShieldCheck size={14} />
                                                </div>
                                                LIFETIME SYSTEM ACCESS
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
                        <div className="flex gap-10 border-b border-white/5 overflow-x-auto pb-4">
                            {['overview', 'curriculum', 'instructor', 'reviews'].map(tab => (
                                <button
                                    key={tab}
                                    className={`relative text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab ? 'text-indigo-400 scale-110' : 'text-slate-600 hover:text-slate-300'
                                        }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <div className="absolute -bottom-[17px] inset-x-0 h-[2px] bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
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
                                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                                                <Zap className="text-amber-400" size={24} />
                                                Competency Matrix
                                            </h3>
                                        </div>
                                        {[
                                            'Master industrial-grade software engineering protocols',
                                            'Develop high-performance production systems',
                                            'Implement elite security and scalability standards',
                                            'Deploy precision workflows and automation systems'
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-4 p-6 rounded-3xl bg-slate-900/30 border border-white/[0.03] group hover:border-indigo-500/20 transition-all">
                                                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                                                    <Check size={18} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                            <Info className="text-indigo-400" size={24} />
                                            Intelligence Report
                                        </h3>
                                        <div className="text-slate-400 font-medium leading-[1.8] text-lg whitespace-pre-line bg-slate-900/20 p-8 rounded-[2rem] border border-white/[0.02]">
                                            {currentCourse.description}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'curriculum' && (
                                <div className="space-y-8">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                        <Activity className="text-purple-400" size={24} />
                                        Module Architecture
                                    </h3>
                                    <div className="space-y-3">
                                        {currentCourse.courseVideos.map((video, i) => (
                                            <div key={video._id} className="group flex items-center justify-between p-6 bg-slate-900/30 hover:bg-slate-900/60 border border-white/[0.03] hover:border-indigo-500/20 rounded-[1.5rem] transition-all">
                                                <div className="flex items-center gap-5">
                                                    <span className="text-[10px] font-black text-slate-800 w-6 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                                                    <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                                        <PlayCircle size={20} />
                                                    </div>
                                                    <span className="text-sm font-black text-slate-300 uppercase tracking-tight group-hover:text-white transition-colors">{video.title}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-950 px-3 py-1 rounded-lg">
                                                        {Math.floor(video.duration / 60)}M {video.duration % 60}S
                                                    </span>
                                                    {!isEnrolled && <Lock size={14} className="text-slate-800" />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'instructor' && (
                                <div className="space-y-8">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                        <User className="text-indigo-400" size={24} />
                                        Lead Faculty
                                    </h3>
                                    <div className="p-10 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] flex flex-col md:flex-row gap-12 items-start relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                        <div className="relative">
                                            <img src={currentCourse.teacher?.photo?.url || 'https://via.placeholder.com/200'} className="w-32 h-32 rounded-[2rem] object-cover border border-white/10 shadow-3xl group-hover:scale-105 transition-transform duration-700" />
                                            <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white border-2 border-[#0e1526] shadow-2xl">
                                                <ShieldCheck size={24} />
                                            </div>
                                        </div>
                                        <div className="space-y-6 flex-1">
                                            <div>
                                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">{currentCourse.teacher?.name}</h3>
                                                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">{currentCourse.teacher?.specialization}</p>
                                            </div>
                                            <p className="text-slate-400 text-base font-medium leading-relaxed">{currentCourse.teacher?.bio}</p>
                                            <div className="grid grid-cols-3 gap-6 py-6 border-y border-white/5">
                                                <div className="text-center md:text-left">
                                                    <p className="text-2xl font-black text-white tracking-tighter">12k+</p>
                                                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1">Learners</p>
                                                </div>
                                                <div className="text-center md:text-left">
                                                    <p className="text-2xl font-black text-white tracking-tighter">{currentCourse.teacher?.experience}Y</p>
                                                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1">Expertise</p>
                                                </div>
                                                <div className="text-center md:text-left">
                                                    <p className="text-2xl font-black text-white tracking-tighter">100%</p>
                                                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1">Score</p>
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

