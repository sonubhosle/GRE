import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import { Layout, Video, FileUp, Trash2, Plus, Check, Loader2, ArrowLeft, Image as ImageIcon, Save, Info } from 'lucide-react';
import { toast } from 'react-toastify';

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [updatingCourse, setUpdatingCourse] = useState(false);

    // Course form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
        discount: '',
        level: 'Beginner',
        language: 'English',
        tags: '',
        thumbnail: null,
        previewVideo: null
    });

    // Form states for adding content
    const [lessonData, setLessonData] = useState({ title: '', video: null });
    const [materialData, setMaterialData] = useState({ title: '', file: null });

    useEffect(() => {
        fetchCourse();
        fetchCategories();
    }, [id]);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data.data.categories);
        } catch (e) {
            console.error('Failed to fetch categories');
        }
    };

    const fetchCourse = async () => {
        try {
            const res = await api.get(`/courses/${id}`);
            const c = res.data.data.course;
            setCourse(c);
            setFormData({
                title: c.title || '',
                description: c.description || '',
                category: c.category?._id || c.category || '',
                price: c.price || '',
                discount: c.discount || '0',
                level: c.level || 'Beginner',
                language: c.language || 'English',
                tags: Array.isArray(c.tags) ? c.tags.join(', ') : c.tags || '',
                thumbnail: null,
                previewVideo: null
            });
        } catch (e) {
            toast.error('Failed to fetch course details');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        setUpdatingCourse(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                data.append(key, formData[key]);
            }
        });

        try {
            await api.put(`/courses/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Course details updated successfully!');
            fetchCourse();
        } catch (e) {
            toast.error(e.response?.data?.message || 'Update failed');
        } finally {
            setUpdatingCourse(false);
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
            await api.post(`/courses/${id}/lessons`, data, {
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
            await api.delete(`/courses/${id}/lessons/${videoId}`);
            toast.success('Lesson deleted');
            fetchCourse();
        } catch (e) { toast.error('Delete failed'); }
    };

    const handleDeleteMaterial = async (materialId) => {
        if (!window.confirm('Delete this material?')) return;
        try {
            await api.delete(`/courses/${id}/materials/${materialId}`);
            toast.success('Material deleted');
            fetchCourse();
        } catch (e) { toast.error('Delete failed'); }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/teacher/courses')}
                    className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 mb-12 transition-all font-bold text-xs group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to courses
                </button>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Course Info & Details Left Column */}
                    <div className="flex-1 space-y-12">
                        <div className="animate-fade-in-up">
                            <h1 className="text-4xl font-bold text-slate-900 mb-3 leading-tight">Edit <span className="text-indigo-600">Course</span></h1>
                            <p className="text-slate-500 font-medium text-lg">Managing details and curriculum for: <span className="text-slate-900 font-bold">{course.title}</span></p>
                        </div>

                        {/* Course Details Form */}
                        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden animate-fade-in-up delay-75">
                            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                                <h2 className="text-xl font-bold flex items-center gap-3 text-slate-900"><Info className="text-indigo-600" /> Basic Information</h2>
                            </div>
                            <form onSubmit={handleUpdateCourse} className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2">
                                        <label className="text-[11px] font-bold text-slate-400 block mb-3 uppercase tracking-wider">Course Title</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="Enter course title"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-[11px] font-bold text-slate-400 block mb-3 uppercase tracking-wider">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all min-h-[150px]"
                                            placeholder="Enter detailed description"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-slate-400 block mb-3 uppercase tracking-wider">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-slate-400 block mb-3 uppercase tracking-wider">Level</label>
                                        <select
                                            value={formData.level}
                                            onChange={e => setFormData({ ...formData, level: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-slate-400 block mb-3 uppercase tracking-wider">Price (₹)</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="Price"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-slate-400 block mb-3 uppercase tracking-wider">Discount (%)</label>
                                        <input
                                            type="number"
                                            value={formData.discount}
                                            onChange={e => setFormData({ ...formData, discount: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="Discount"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-slate-400 block mb-3 uppercase tracking-wider">Language</label>
                                        <input
                                            type="text"
                                            value={formData.language}
                                            onChange={e => setFormData({ ...formData, language: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="e.g. English"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-slate-400 block mb-3 uppercase tracking-wider">Tags (comma separated)</label>
                                        <input
                                            type="text"
                                            value={formData.tags}
                                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="e.g. React, JS, Web Dev"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-slate-400 block mb-3 uppercase tracking-wider">Update Thumbnail</label>
                                        <div className="relative group/file">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={e => setFormData({ ...formData, thumbnail: e.target.files[0] })}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-slate-400 font-medium group-hover/file:bg-white group-hover/file:border-indigo-500 transition-all flex items-center justify-between truncate">
                                                <span className="truncate">{formData.thumbnail ? formData.thumbnail.name : 'Select image...'}</span>
                                                <ImageIcon size={18} className="flex-shrink-0" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-slate-400 block mb-3 uppercase tracking-wider">Update Preview Video</label>
                                        <div className="relative group/file">
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={e => setFormData({ ...formData, previewVideo: e.target.files[0] })}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-slate-400 font-medium group-hover/file:bg-white group-hover/file:border-indigo-500 transition-all flex items-center justify-between truncate">
                                                <span className="truncate">{formData.previewVideo ? formData.previewVideo.name : 'Select video...'}</span>
                                                <Video size={18} className="flex-shrink-0" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={updatingCourse}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-14 px-10 rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
                                    >
                                        {updatingCourse ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Update Course Details</>}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Lessons List */}
                        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden animate-fade-in-up delay-100">
                            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                                <h2 className="text-xl font-bold flex items-center gap-3 text-slate-900"><Video className="text-indigo-600" /> Lessons ({course.courseVideos?.length || 0})</h2>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {course.courseVideos?.map((video, idx) => (
                                    <div key={video._id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                                        <div className="flex items-center gap-6">
                                            <span className="text-xs font-bold text-slate-300 w-6">{String(idx + 1).padStart(2, '0')}</span>
                                            <div>
                                                <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{video.title}</p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1">{Math.floor(video.duration / 60)}m {video.duration % 60}s</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteVideo(video._id)}
                                            className="w-12 h-12 rounded-2xl bg-white text-rose-500 border border-slate-100 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all flex items-center justify-center shadow-sm active:scale-95"
                                            title="Delete lesson"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                {(!course.courseVideos || course.courseVideos.length === 0) && (
                                    <div className="p-20 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                                            <Video size={24} />
                                        </div>
                                        <p className="text-slate-500 font-medium">No lessons added yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Materials List */}
                        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden animate-fade-in-up delay-200">
                            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                                <h2 className="text-xl font-bold flex items-center gap-3 text-slate-900"><FileUp className="text-purple-600" /> Study materials ({course.studyMaterials?.length || 0})</h2>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {course.studyMaterials?.map((mat) => (
                                    <div key={mat._id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <p className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors">{mat.title}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={mat.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-4 py-2 bg-purple-50 text-purple-600 rounded-xl font-bold text-[10px] hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                                            >
                                                View file
                                            </a>
                                            <button
                                                onClick={() => handleDeleteMaterial(mat._id)}
                                                className="w-10 h-10 rounded-xl bg-white text-rose-500 border border-slate-100 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all flex items-center justify-center shadow-sm active:scale-95"
                                                title="Delete material"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!course.studyMaterials || course.studyMaterials.length === 0) && (
                                    <div className="p-20 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                                            <FileUp size={24} />
                                        </div>
                                        <p className="text-slate-500 font-medium">No study materials added yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Upload Forms Right Column */}
                    <div className="lg:w-[400px] space-y-10 animate-fade-in-up delay-300">
                        {/* Add Lesson Form */}
                        <div className="bg-white p-8 rounded-[3rem] border border-indigo-100 shadow-xl shadow-indigo-500/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-[0.03] rounded-full -mr-16 -mt-16 blur-3xl"></div>
                            <h3 className="text-xl font-bold text-slate-900 mb-8">Add new lesson</h3>
                            <form onSubmit={handleAddLesson} className="space-y-6">
                                <div>
                                    <label className="text-[11px] font-bold text-slate-400 block mb-3">Lesson title</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="e.g. Introduction to Hooks"
                                        value={lessonData.title}
                                        onChange={e => setLessonData({ ...lessonData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-slate-400 block mb-3">Video file</label>
                                    <div className="relative group/file">
                                        <input
                                            type="file"
                                            accept="video/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            onChange={e => setLessonData({ ...lessonData, video: e.target.files[0] })}
                                        />
                                        <div className="bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-slate-400 font-medium group-hover/file:bg-white group-hover/file:border-indigo-500 transition-all flex items-center justify-between truncate">
                                            <span className="truncate">{lessonData.video ? lessonData.video.name : 'Select video file...'}</span>
                                            <Video size={18} className="flex-shrink-0" />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-14 rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
                                >
                                    {uploading ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> Add lesson</>}
                                </button>
                            </form>
                        </div>

                        {/* Add Material Form */}
                        <div className="bg-white p-8 rounded-[3rem] border border-purple-100 shadow-xl shadow-purple-500/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-[0.03] rounded-full -mr-16 -mt-16 blur-3xl"></div>
                            <h3 className="text-xl font-bold text-slate-900 mb-8">Add study material</h3>
                            <form onSubmit={handleAddMaterial} className="space-y-6">
                                <div>
                                    <label className="text-[11px] font-bold text-slate-400 block mb-3">Material title</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                                        placeholder="e.g. Hooks Cheat Sheet"
                                        value={materialData.title}
                                        onChange={e => setMaterialData({ ...materialData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-slate-400 block mb-3">PDF/Doc file</label>
                                    <div className="relative group/file">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            onChange={e => setMaterialData({ ...materialData, file: e.target.files[0] })}
                                        />
                                        <div className="bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-slate-400 font-medium group-hover/file:bg-white group-hover/file:border-purple-500 transition-all flex items-center justify-between truncate">
                                            <span className="truncate">{materialData.file ? materialData.file.name : 'Select file...'}</span>
                                            <FileUp size={18} className="flex-shrink-0" />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold h-14 rounded-2xl shadow-xl shadow-purple-200 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
                                >
                                    {uploading ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> Add material</>}
                                </button>
                            </form>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                Max size: <strong className="text-slate-700">100MB</strong> for videos, <strong className="text-slate-700">10MB</strong> for docs. Supported formats: MP4, WebM, PDF, DOCX.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCourse;
