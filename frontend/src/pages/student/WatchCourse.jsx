import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { PlayCircle, Check, Loader2, ArrowLeft, FileText, Star, FileUp, Clock, Download, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const WatchCourse = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [progress, setProgress] = useState(null);
    const [videoError, setVideoError] = useState(false);
    const [videoLoading, setVideoLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [durationMap, setDurationMap] = useState({});

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [courseRes, progressRes] = await Promise.all([
                api.get(`/courses/${id}`),
                api.get(`/users/progress/${id}`)
            ]);
            const c = courseRes.data.data.course;
            setCourse(c);
            setProgress(progressRes.data.data.progress);

            // Select first video by default
            if (c.courseVideos.length > 0) {
                setCurrentVideo(c.courseVideos[0]);
            }
        } catch (e) {
            toast.error('Failed to load course content');
        } finally {
            setLoading(false);
        }
    };

    const handleProgressUpdate = async (videoId) => {
        // Prevent duplicate updates if already completed
        if (progress?.completedLessons?.includes(videoId)) return;

        try {
            const res = await api.patch(`/courses/${id}/progress`, { videoId });
            setProgress(res.data.data.progress);
            toast.success('Marked as completed');
        } catch (e) {
            toast.error('Failed to update progress');
        }
    };

    const handleTimeUpdate = (e) => {
        const video = e.target;
        if (!video.duration) return;

        // Auto-complete at 90%
        const percentage = (video.currentTime / video.duration) * 100;
        if (percentage > 90 && currentVideo) {
            handleProgressUpdate(currentVideo._id);
        }
    };

    const handleVideoError = (e) => {
        console.error('Video error details:', e);
        setVideoError(true);
        setVideoLoading(false);
        toast.error('Failed to load video. You can download it instead.');
    };

    const handleVideoLoad = (e) => {
        setVideoLoading(false);
        setVideoError(false);
        const video = e.target;
        if (video.duration && currentVideo) {
            setDurationMap(prev => ({ ...prev, [currentVideo._id]: video.duration }));
        }
    };

    const handleVideoSelect = (video) => {
        setCurrentVideo(video);
        setVideoError(false);
        setVideoLoading(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading || !course) return (
        <div className="h-screen flex items-center justify-center bg-white">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
    );

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <FileText size={16} /> },
        { id: 'curriculum', label: 'Curriculum', icon: <PlayCircle size={16} />, className: 'lg:hidden' }, // Mobile only
        { id: 'resources', label: 'Resources', icon: <FileUp size={16} /> },
        { id: 'instructor', label: 'Instructor', icon: <Star size={16} /> },
    ];

    const formatDuration = (seconds) => {
        if (!seconds) return '0m 0s';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m ${s}s`;
    };

    return (
        <div className="flex flex-col  bg-slate-50 px-6 lg:px-18 py-10 ">
            {/* Top Bar: Cinematic Video Player */}
            <div className={`w-full p-5 rounded-3xl bg-white mb-10 transition-all duration-500 ease-in-out ${isTheaterMode ? 'min-h-[80vh] flex items-center' : 'h-auto'}`}>
                <div className={`flex flex-col gap-5 lg:flex-row h-full transition-all duration-500 ${isTheaterMode ? 'max-w-full w-full' : 'max-w-[1600px]'}`}>

                    {/* Video Player */}
                    <div className={`flex-1 relative rounded-3xl flex items-center justify-center bg-black group/player transition-all duration-500 ${isTheaterMode ? 'min-h-[90vh] w-full' : 'aspect-video lg:h-[50vh]'}`}>
                        <div className="absolute top-6 left-6 z-20 flex gap-2">
                            <Link to="/dashboard" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-all text-xs font-bold bg-white/5 hover:bg-white/10 px-3 py-2 rounded-full backdrop-blur-md border border-white/5">
                                <ArrowLeft size={16} />
                                Back
                            </Link>
                            <button
                                onClick={() => setIsTheaterMode(!isTheaterMode)}
                                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-all text-xs font-bold bg-white/5 hover:bg-white/10 px-3 py-2 rounded-full backdrop-blur-md border border-white/5"
                                title={isTheaterMode ? 'Normal Mode' : 'Theater Mode'}
                            >
                                {isTheaterMode ? <ArrowLeft size={16} className="rotate-180" /> : <PlayCircle size={16} />}
                                {isTheaterMode ? 'Exit Theater' : 'Theater Mode'}
                            </button>
                        </div>

                        {currentVideo ? (
                            <div className="w-full h-full relative group flex items-center justify-center">
                                {videoLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 backdrop-blur-sm">
                                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                                    </div>
                                )}

                                {videoError ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/50 p-8 text-center min-h-[300px]">
                                        <AlertCircle size={48} className="text-red-400 mb-4" />
                                        <h3 className="text-white font-bold mb-2 text-lg">Playback failed</h3>
                                        <p className="text-slate-400 text-sm mb-6 max-w-sm">
                                            The video format might not be supported by your browser's direct playback.
                                        </p>
                                        <a
                                            href={currentVideo.url}
                                            download
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-500/20 active:scale-95"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Download size={18} />
                                            Download Lesson
                                        </a>
                                    </div>
                                ) : (
                                    <video
                                        key={currentVideo.url}
                                        controls
                                        autoPlay
                                        preload="metadata"
                                        className="w-full max-h-full object-contain"
                                        onLoadedData={handleVideoLoad}
                                        onLoadStart={() => setVideoLoading(true)}
                                        onError={handleVideoError}
                                        onTimeUpdate={handleTimeUpdate}
                                        onEnded={() => handleProgressUpdate(currentVideo._id)}
                                    >
                                        <source src={currentVideo.url} type="video/webm" />
                                        <source src={currentVideo.url} type="video/mp4" />
                                        Your browser doesn't support video playback.
                                    </video>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-slate-500 p-12 text-center min-h-[300px]">
                                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6">
                                    <PlayCircle size={40} className="text-indigo-500 opacity-50" />
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2">Ready to start?</h3>
                                <p className="text-slate-400 text-sm max-w-xs">Select a lesson from the curriculum to begin your learning journey.</p>
                            </div>
                        )}
                    </div>

                    {/* Desktop Sidebar: Curriculum */}
                    {!isTheaterMode && (
                        <div className="hidden  lg:flex w-[400px] flex-col bg-white ">
                            <div className="py-5 border-b border-slate-100 bg-white sticky top-0 z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-900">Curriculum</h3>
                                    <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-wider font-bold">
                                        {Math.round(progress?.progressPercent || 0)}%
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600 transition-all duration-700" style={{ width: `${progress?.progressPercent || 0}%` }}></div>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase">
                                    {progress?.completedLessons?.length || 0} of {course.courseVideos?.length} lessons completed
                                </p>
                            </div>

                            <div className="flex-1">
                                {course.courseVideos?.map((video, i) => {
                                    const isCompleted = progress?.completedLessons?.includes(video._id);
                                    const isActive = currentVideo?._id === video._id;
                                    const activeDuration = durationMap[video._id] || video.duration;

                                    return (
                                        <div
                                            key={video._id}
                                            className={`w-full p-4 flex items-start gap-4 text-left border-b border-slate-50 transition-all ${isActive ? 'bg-indigo-50/50 border-l-4 border-l-indigo-600 rounded-3xl' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}
                                        >
                                            <button
                                                onClick={() => handleVideoSelect(video)}
                                                className="flex-1 flex items-start gap-4 text-left"
                                            >
                                                <div className="flex-shrink-0 mt-1">
                                                    {isCompleted ? (
                                                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Check size={14} strokeWidth={3} /></div>
                                                    ) : (
                                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold transition-colors ${isActive ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-400 group-hover:border-indigo-300'}`}>
                                                            {i + 1}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className={`text-sm font-bold truncate transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-700'}`}>{video.title}</p>
                                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1 uppercase">
                                                        <Clock size={12} className="opacity-50" />
                                                        {formatDuration(activeDuration)}
                                                    </span>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => handleProgressUpdate(video._id)}
                                                className={`p-1.5 rounded-lg transition-all ${isCompleted ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-300 hover:bg-slate-100 hover:text-slate-600'}`}
                                                title={isCompleted ? 'Completed' : 'Mark as complete'}
                                            >
                                                <Check size={16} strokeWidth={isCompleted ? 3 : 1.5} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Section: Tabs & Details */}
            {!isTheaterMode && (
                <div className="flex-1 bg-white">
                    <div className="max-w-[1600px] mx-auto px-6">

                        {/* Tab Navigation */}
                        <div className="flex items-center gap-8 border-b border-slate-100 pb-px mb-8 sticky top-0 bg-white z-10">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-5 text-sm font-bold transition-all relative ${tab.className || ''} ${activeTab === tab.id ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600 border-b-2 border-transparent'}`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="max-w-5xl pb-20">
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                        <div className="lg:col-span-2">
                                            <h1 className="text-3xl font-semibold text-slate-900 mb-6 tracking-tight leading-tight">{course.title}</h1>

                                            <div className="flex flex-wrap items-center gap-4 mb-8">
                                                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold border border-indigo-100 uppercase tracking-wide">{course.category?.name}</span>
                                                <span className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase tracking-wider"><Star size={14} className="text-amber-400 fill-amber-400" /> {course.ratingsAverage}</span>
                                                <span className="text-slate-200">|</span>
                                                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{course.level}</span>
                                                <span className="text-slate-200">|</span>
                                                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{course.language}</span>
                                            </div>

                                            <div className="prose prose-slate max-w-none mb-12">
                                                <h3 className="text-lg font-bold text-slate-900 mb-4">Description</h3>
                                                <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{course.description}</p>
                                            </div>

                                            {course.tags?.length > 0 && (
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Tags</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {course.tags.map((tag, i) => (
                                                            <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-100 uppercase tracking-tight">#{tag}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-8">
                                            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Course Info</h4>
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold text-slate-500 flex items-center gap-2"><PlayCircle size={14} /> Lessons</span>
                                                        <span className="text-sm font-bold text-slate-900">{course.courseVideos?.length}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold text-slate-500 flex items-center gap-2"><Clock size={14} /> Duration</span>
                                                        <span className="text-sm font-bold text-slate-900">{course.duration} Hours</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold text-slate-500 flex items-center gap-2"><FileText size={14} /> Level</span>
                                                        <span className="text-sm font-bold text-slate-900">{course.level}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-4">
                                                        <span className="text-sm font-bold text-slate-500 flex items-center gap-2 font-semibold"><Check size={14} /> Enrolled</span>
                                                        <span className="text-sm font-bold text-indigo-600">{course.enrolledStudents?.length || 0} Students</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Mobile Curriculum Tab */}
                            {activeTab === 'curriculum' && (
                                <div className="lg:hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="space-y-2">
                                        {course.courseVideos?.map((video, i) => (
                                            <div
                                                key={video._id}
                                                className={`p-4 flex items-center gap-4 text-left rounded-2xl border transition-all ${currentVideo?._id === video._id ? 'bg-indigo-50 border-indigo-200 shadow-lg shadow-indigo-500/5' : 'bg-slate-50 border-slate-100'}`}
                                            >
                                                <button
                                                    onClick={() => { handleVideoSelect(video); setActiveTab('overview'); }}
                                                    className="flex-1 flex items-center gap-4"
                                                >
                                                    <span className="text-[10px] font-semibold text-slate-400 w-4">{i + 1}</span>
                                                    <span className="flex-1 text-sm font-bold text-slate-700 truncate">{video.title}</span>
                                                </button>
                                                <button
                                                    onClick={() => handleProgressUpdate(video._id)}
                                                    className={`p-2 rounded-xl border transition-all ${progress?.completedLessons?.includes(video._id) ? 'bg-emerald-100 border-emerald-200 text-emerald-600' : 'bg-white border-slate-100 text-slate-300'}`}
                                                >
                                                    <Check size={16} strokeWidth={3} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Resources Tab */}
                            {activeTab === 'resources' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-wider">Study materials</h3>
                                    {course.studyMaterials?.length > 0 ? (
                                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                            {course.studyMaterials.map(mat => (
                                                <a
                                                    key={mat._id}
                                                    href={mat.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex flex-col p-6 rounded-3xl border border-slate-100 bg-white hover:border-indigo-600 transition-all hover:shadow-2xl hover:shadow-indigo-500/10"
                                                >
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors mb-4">
                                                        <FileText size={24} strokeWidth={1.5} />
                                                    </div>
                                                    <p className="text-sm font-semibold text-slate-900 mb-2 leading-tight">{mat.title}</p>
                                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{mat.fileType || 'PDF'}</span>
                                                        <Download size={16} className="text-indigo-600 transition-transform group-hover:translate-y-0.5" />
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-slate-50 rounded-[40px] p-20 text-center border-2 border-dashed border-slate-200">
                                            <div className="w-20 h-20 rounded-full bg-white mx-auto flex items-center justify-center shadow-sm mb-6">
                                                <FileText size={32} className="text-slate-200" />
                                            </div>
                                            <p className="text-slate-400 font-semibold uppercase tracking-widest">No resources found</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Instructor Tab */}
                            {activeTab === 'instructor' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <h3 className="text-lg font-bold text-slate-900 mb-8 uppercase tracking-wider">The Instructor</h3>
                                    <div className="flex flex-col md:flex-row gap-12 items-start bg-slate-50 p-10 rounded-[40px] border border-slate-100">
                                        <div className="w-40 h-40 rounded-[40px] overflow-hidden bg-slate-100 border-8 border-white shadow-2xl flex-shrink-0 -rotate-3 hover:rotate-0 transition-transform duration-500">
                                            <img src={course.teacher?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.teacher?.name)}&background=818cf8&color=fff&size=200`} alt={course.teacher?.name} className="w-full h-full object-cover shadow-inner" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-3xl font-semibold text-slate-900 mb-4 tracking-tight leading-none uppercase">{course.teacher?.name}</h4>
                                            <div className="flex flex-wrap gap-4 mb-8">
                                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                                                    <Star size={14} className="text-amber-400 fill-amber-400" />
                                                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-tight">4.9 Rating</span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                                                    <PlayCircle size={14} className="text-indigo-600" />
                                                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-tight">{course.teacher?.enrolledStudents?.length || 0} Students</span>
                                                </div>
                                            </div>
                                            <p className="text-slate-600 leading-relaxed font-bold text-lg max-w-2xl italic">
                                                "Dedicated to empowering students with professional {course.category?.name || 'skills'} through high-quality, practical training."
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WatchCourse;
