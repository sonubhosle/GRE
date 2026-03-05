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

    if (loading || !course) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;

    return (
        <div className="flex flex-col lg:row h-[calc(100vh-64px)] overflow-hidden">

            {/* Video Player Section */}
            <div className="flex-1 bg-black flex flex-col pt-4">
                <div className="container px-4 mb-4">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                </div>

                <div className="flex-1 relative bg-bg-dark/50 p-4">
                    {currentVideo ? (
                        <video
                            key={currentVideo.url}
                            controls
                            className="w-full h-full object-contain rounded-xl shadow-2xl"
                            onEnded={() => handleProgressUpdate(currentVideo._id)}
                        >
                            <source src={currentVideo.url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted">
                            Select a lesson to start learning
                        </div>
                    )}
                </div>

                <div className="bg-bg-card p-6 border-t border-border">
                    <div className="container">
                        <h1 className="text-2xl font-bold mb-2">{currentVideo?.title || 'Course Content'}</h1>
                        <div className="flex items-center justify-between">
                            <p className="text-text-muted text-sm">{course.title} • {course.teacher?.name}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Your Progress</span>
                                <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${progress?.progressPercent || 0}%` }}></div>
                                </div>
                                <span className="text-xs font-bold text-primary">{progress?.progressPercent || 0}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Curriculum Sidebar */}
            <div className="w-full lg:w-96 bg-bg-card border-l border-border flex flex-col overflow-y-auto">
                <div className="p-6 border-b border-border">
                    <h3 className="font-bold text-lg mb-1">Course Content</h3>
                    <p className="text-xs text-text-muted uppercase tracking-widest font-bold">
                        {progress?.completedVideos?.length || 0} / {course.courseVideos?.length} Lessons Finished
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {course.courseVideos?.map((video, i) => {
                        const isCompleted = progress?.completedVideos?.includes(video._id);
                        const isActive = currentVideo?._id === video._id;

                        return (
                            <button
                                key={video._id}
                                onClick={() => setCurrentVideo(video)}
                                className={`w-full p-4 flex items-center gap-4 text-left border-b border-border transition-colors hover:bg-white/2 ${isActive ? 'bg-primary/5' : ''}`}
                            >
                                <div className="flex-shrink-0">
                                    {isCompleted ? (
                                        <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent"><Check size={14} /></div>
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-text-muted text-xs font-bold">{i + 1}</div>
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className={`text-sm font-bold truncate ${isActive ? 'text-primary' : 'text-text-primary'}`}>{video.title}</p>
                                    <p className="text-[10px] text-text-muted uppercase tracking-widest">{Math.floor(video.duration / 60)}m {video.duration % 60}s</p>
                                </div>
                                {isActive && <PlayCircle size={20} className="text-primary" />}
                            </button>
                        );
                    })}

                    {/* Study Materials */}
                    {course.studyMaterials?.length > 0 && (
                        <div className="p-6 bg-white/2">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
                                <FileText size={14} /> Resources
                            </h4>
                            <div className="space-y-3">
                                {course.studyMaterials.map(mat => (
                                    <a
                                        key={mat._id}
                                        href={mat.url}
                                        target="_blank"
                                        className="flex items-center justify-between p-3 rounded-lg border border-border bg-bg-dark/50 hover:border-primary transition-colors hover:bg-primary/5 group"
                                    >
                                        <span className="text-xs font-medium truncate flex-1 pr-2">{mat.title}</span>
                                        <FileUp size={16} className="text-text-muted group-hover:text-primary transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-bg-dark/50 border-t border-border">
                    <Link to={`/courses/${id}`} className="flex items-center justify-center gap-2 text-xs font-bold text-primary uppercase tracking-widest hover:underline p-2">
                        <Star size={14} /> Leave a Review
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default WatchCourse;
