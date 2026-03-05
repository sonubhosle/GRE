import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import { Video, FileUp, Trash2, Plus, Check, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Form states for adding content
    const [lessonData, setLessonData] = useState({ title: '', video: null });
    const [materialData, setMaterialData] = useState({ title: '', file: null });

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const res = await api.get(`/courses/${id}`);
            setCourse(res.data.data.course);
        } catch (e) {
            toast.error('Failed to fetch course details');
        } finally {
            setLoading(false);
        }
    };

    const handleAddLesson = async (e) => {
        e.preventDefault();
        if (!lessonData.title || !lessonData.video) return toast.error('Title and video are required');

        setUploading(true);
        const data = new FormData();
        data.append('title', lessonData.title);
        data.append('video', lessonData.video);

        try {
            await api.post(`/courses/${id}/videos`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Lesson added successfully!');
            setLessonData({ title: '', video: null });
            fetchCourse();
        } catch (e) {
            toast.error(e.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleAddMaterial = async (e) => {
        e.preventDefault();
        if (!materialData.title || !materialData.file) return toast.error('Title and file are required');

        setUploading(true);
        const data = new FormData();
        data.append('title', materialData.title);
        data.append('material', materialData.file);

        try {
            await api.post(`/courses/${id}/materials`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Material added successfully!');
            setMaterialData({ title: '', file: null });
            fetchCourse();
        } catch (e) {
            toast.error(e.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteVideo = async (videoId) => {
        if (!window.confirm('Delete this lesson?')) return;
        try {
            await api.delete(`/courses/${id}/videos/${videoId}`);
            toast.success('Lesson deleted');
            fetchCourse();
        } catch (e) { toast.error('Delete failed'); }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;

    return (
        <div className="container py-12">
            <button onClick={() => navigate('/teacher/courses')} className="flex items-center gap-2 text-text-muted hover:text-primary mb-8 transition-colors font-bold uppercase tracking-widest text-xs">
                <ArrowLeft size={16} /> Back to Courses
            </button>

            <div className="flex flex-col lg:row gap-12">

                {/* Course Info & Curriculum Left Column */}
                <div className="flex-1 space-y-12">
                    <div className="fade-in-up">
                        <h1 className="text-3xl font-bold mb-2">Edit Curriculum</h1>
                        <p className="text-text-muted">Currently editing: <span className="text-white font-bold">{course.title}</span></p>
                    </div>

                    {/* Lessons List */}
                    <div className="card overflow-hidden fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <div className="p-6 border-b border-border bg-white/5">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Video className="text-primary" /> Lessons ({course.courseVideos?.length})</h2>
                        </div>
                        <div className="divide-y divide-border">
                            {course.courseVideos?.map((video, idx) => (
                                <div key={video._id} className="p-4 flex items-center justify-between hover:bg-white/2">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-bold text-text-muted w-4">{idx + 1}</span>
                                        <div>
                                            <p className="font-bold text-sm tracking-tight">{video.title}</p>
                                            <p className="text-[10px] text-text-muted uppercase tracking-widest">{Math.floor(video.duration / 60)}m {video.duration % 60}s</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteVideo(video._id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {(!course.courseVideos || course.courseVideos.length === 0) && (
                                <div className="p-12 text-center text-text-muted text-sm">No lessons added yet.</div>
                            )}
                        </div>
                    </div>

                    {/* Materials List */}
                    <div className="card overflow-hidden fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="p-6 border-b border-border bg-white/5">
                            <h2 className="text-xl font-bold flex items-center gap-2"><FileUp className="text-primary" /> Study Materials ({course.studyMaterials?.length})</h2>
                        </div>
                        <div className="divide-y divide-border">
                            {course.studyMaterials?.map((mat) => (
                                <div key={mat._id} className="p-4 flex items-center justify-between hover:bg-white/2">
                                    <p className="font-bold text-sm">{mat.title}</p>
                                    <a href={mat.url} target="_blank" className="text-[10px] text-primary font-bold uppercase hover:underline">View File</a>
                                </div>
                            ))}
                            {(!course.studyMaterials || course.studyMaterials.length === 0) && (
                                <div className="p-12 text-center text-text-muted text-sm">No study materials added yet.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Upload Forms Right Column */}
                <div className="lg:w-96 space-y-8">

                    {/* Add Lesson Form */}
                    <div className="card p-6 border-primary/20 bg-primary/2 fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <h3 className="text-lg font-bold mb-6">Add New Lesson</h3>
                        <form onSubmit={handleAddLesson} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-2">Lesson Title</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g. Introduction to Hooks"
                                    value={lessonData.title}
                                    onChange={e => setLessonData({ ...lessonData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-2">Video File</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    className="input-field p-2 text-xs"
                                    onChange={e => setLessonData({ ...lessonData, video: e.target.files[0] })}
                                />
                            </div>
                            <button type="submit" disabled={uploading} className="btn-primary w-full justify-center h-12">
                                {uploading ? <Loader2 className="animate-spin text-xl" /> : <><Plus size={18} /> Add Lesson</>}
                            </button>
                        </form>
                    </div>

                    {/* Add Material Form */}
                    <div className="card p-6 fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <h3 className="text-lg font-bold mb-6">Add Study Material</h3>
                        <form onSubmit={handleAddMaterial} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-2">Material Title</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g. Hooks Cheat Sheet"
                                    value={materialData.title}
                                    onChange={e => setMaterialData({ ...materialData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-2">PDF/Doc File</label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="input-field p-2 text-xs"
                                    onChange={e => setMaterialData({ ...materialData, file: e.target.files[0] })}
                                />
                            </div>
                            <button type="submit" disabled={uploading} className="btn-secondary w-full justify-center h-12">
                                {uploading ? <Loader2 className="animate-spin text-xl" /> : <><Plus size={18} /> Add Material</>}
                            </button>
                        </form>
                    </div>

                    <div className="bg-bg-card/50 p-6 rounded-2xl border border-dashed border-border text-center">
                        <p className="text-xs text-text-muted leading-relaxed">
                            Maximum file size: <strong>100MB</strong> for videos, <strong>10MB</strong> for materials. Supported formats: MP4, WebM, PDF, DOCX.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EditCourse;
