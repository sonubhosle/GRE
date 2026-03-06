import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import { PlayCircle, Check, Loader2, ArrowLeft, FileText, Star, FileUp } from 'lucide-react';
import { toast } from 'react-toastify';

const WatchCourse = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [progress, setProgress] = useState(null);

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

            // Select first video by default or last watched
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
        try {
            const res = await api.patch(`/courses/${id}/progress`, { videoId });
            setProgress(res.data.data.progress);
            toast.success('Progress updated');
        } catch (e) {
            toast.error('Failed to update progress');
        }
    };

    if (loading || !course) return (
        <div className="h-screen flex items-center justify-center bg-white">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden bg-white">

            {/* Video Player Section */}
            <div className="flex-1 bg-slate-900 flex flex-col pt-4 overflow-hidden">
                <div className="px-6 mb-4">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all text-xs font-bold group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to dashboard
                    </Link>
                </div>

                <div className="flex-1 relative bg-slate-900/50 p-4 md:p-8">
                    {currentVideo ? (
                        <div className="w-full h-full max-w-5xl mx-auto shadow-2xl shadow-indigo-500/10 rounded-2xl overflow-hidden bg-black border border-white/5">
                            <video
                                key={currentVideo.url}
                                controls
                                className="w-full h-full object-contain"
                                onEnded={() => handleProgressUpdate(currentVideo._id)}
                            >
                                <source src={currentVideo.url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                            <PlayCircle size={64} className="mb-4 opacity-20" />
                            <p className="font-bold">Select a lesson to start learning</p>
                        </div>
                    )}
                </div>

                <div className="bg-white p-8 border-t border-slate-100 shadow-[0_-1px_10px_rgba(0,0,0,0.02)]">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 mb-2">{currentVideo?.title || 'Course Content'}</h1>
                                <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                                    <span className="text-indigo-600">{course.title}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                                    {course.teacher?.name}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <span className="text-[11px] font-bold text-slate-400">Your progress</span>
                                <div className="w-40 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-[0_0_10px_rgba(129,140,248,0.3)] transition-all duration-1000" style={{ width: `${progress?.progressPercent || 0}%` }}></div>
                                </div>
                                <span className="text-sm font-bold text-indigo-600">{progress?.progressPercent || 0}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Curriculum Sidebar */}
            <div className="w-full lg:w-96 bg-white border-l border-slate-100 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                    <h3 className="font-bold text-lg text-slate-900 mb-1">Course content</h3>
                    <p className="text-[11px] text-slate-400 font-bold">
                        {progress?.completedVideos?.length || 0} / {course.courseVideos?.length} lessons finished
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                    {course.courseVideos?.map((video, i) => {
                        const isCompleted = progress?.completedVideos?.includes(video._id);
                        const isActive = currentVideo?._id === video._id;

                        return (
                            <button
                                key={video._id}
                                onClick={() => setCurrentVideo(video)}
                                className={`w-full p-5 flex items-center gap-4 text-left border-b border-slate-50 transition-all group ${isActive ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
                            >
                                <div className="flex-shrink-0">
                                    {isCompleted ? (
                                        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100"><Check size={16} strokeWidth={3} /></div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all">{i + 1}</div>
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className={`text-sm font-bold truncate transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-900'}`}>{video.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock size={10} className="text-slate-300" />
                                        <p className="text-[10px] text-slate-400 font-bold">{Math.floor(video.duration / 60)}m {video.duration % 60}s</p>
                                    </div>
                                </div>
                                {isActive && <PlayCircle size={20} className="text-indigo-600 animate-pulse" />}
                            </button>
                        );
                    })}

                    {/* Study Materials */}
                    {course.studyMaterials?.length > 0 && (
                        <div className="p-6 bg-slate-50/50 border-t border-slate-50">
                            <h4 className="text-[11px] font-bold text-slate-400 mb-4 flex items-center gap-2">
                                <FileText size={14} /> Learning resources
                            </h4>
                            <div className="space-y-3">
                                {course.studyMaterials.map(mat => (
                                    <a
                                        key={mat._id}
                                        href={mat.url}
                                        target="_blank"
                                        className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-white hover:border-indigo-200 transition-all hover:shadow-lg shadow-indigo-500/5 group"
                                    >
                                        <span className="text-xs font-bold text-slate-700 truncate flex-1 pr-2">{mat.title}</span>
                                        <FileUp size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
                    <Link to={`/courses/${id}`} className="flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-white py-4 rounded-xl shadow-sm border border-slate-100 transition-all hover:scale-[1.02]">
                        <Star size={14} fill="currentColor" /> Share your feedback
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default WatchCourse;
