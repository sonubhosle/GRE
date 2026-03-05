import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import { ImagePlus, Video, Info, Check, ChevronRight, ChevronLeft, CircleDollarSign } from 'lucide-react';
import { toast } from 'react-toastify';

const CreateCourse = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
        discount: '0',
        level: 'Beginner',
        language: 'English',
        availableSeats: '100',
        tags: ''
    });

    const [files, setFiles] = useState({
        thumbnail: null,
        previewVideo: null
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data.data.categories);
            } catch (e) {
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (files.thumbnail) data.append('thumbnail', files.thumbnail);
        if (files.previewVideo) data.append('previewVideo', files.previewVideo);

        try {
            const res = await api.post('/courses', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Course created! Add your lessons next.');
            navigate(`/teacher/courses/edit/${res.data.data.course._id}`);
        } catch (e) {
            toast.error(e.response?.data?.message || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-12 max-w-4xl">
            <div className="mb-12 text-center fade-in-up">
                <h1 className="text-4xl font-bold mb-2">Create New <span className="gradient-text">Course</span></h1>
                <p className="text-text-muted">Fill in the details to launch your masterpiece.</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 mb-12 fade-in-up">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 1 ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-text-muted'}`}>1</div>
                <div className={`h-0.5 w-12 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-white/5'}`}></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 2 ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-text-muted'}`}>2</div>
                <div className={`h-0.5 w-12 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-white/5'}`}></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 3 ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-text-muted'}`}>3</div>
            </div>

            <div className="card p-8 md:p-12 fade-in-up">
                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div className="space-y-6 fade-in-up">
                            <div className="flex items-center gap-3 mb-8">
                                <Info className="text-primary text-2xl" />
                                <h2 className="text-xl font-bold">Basic Information</h2>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-3 text-text-muted uppercase tracking-widest text-[10px]">Course Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    className="input-field py-4"
                                    placeholder="e.g. Master React in 30 Days"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-3 text-text-muted uppercase tracking-widest text-[10px]">Description</label>
                                <textarea
                                    name="description"
                                    required
                                    className="input-field min-h-[160px]"
                                    placeholder="What will students learn in this course?"
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-3 text-text-muted uppercase tracking-widest text-[10px]">Category</label>
                                    <select name="category" required className="input-field py-4" value={formData.category} onChange={handleChange}>
                                        <option value="">Select Category</option>
                                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-3 text-text-muted uppercase tracking-widest text-[10px]">Difficulty Level</label>
                                    <select name="level" className="input-field py-4" value={formData.level} onChange={handleChange}>
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-8 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    disabled={!formData.title || !formData.description || !formData.category}
                                    className="btn-primary gap-2 h-14 px-10 group"
                                >
                                    Next Step <ChevronRight className="group-hover:translate-x-1 transition-transform text-xl" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 fade-in-up">
                            <div className="flex items-center gap-3 mb-8">
                                <CircleDollarSign className="text-primary text-2xl" />
                                <h2 className="text-xl font-bold">Pricing & Assets</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-3 text-text-muted uppercase tracking-widest text-[10px]">Regular Price (INR)</label>
                                    <input type="number" name="price" required className="input-field py-4" value={formData.price} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-3 text-text-muted uppercase tracking-widest text-[10px]">Discount (%)</label>
                                    <input type="number" name="discount" className="input-field py-4" value={formData.discount} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                                <div>
                                    <label className="block text-sm font-bold mb-3 text-text-muted uppercase tracking-widest text-[10px]">Thumbnail Image</label>
                                    <div className="relative group">
                                        <input type="file" name="thumbnail" accept="image/*" className="hidden" id="thumbnail" onChange={handleFileChange} />
                                        <label htmlFor="thumbnail" className="aspect-video bg-white/5 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                                            {files.thumbnail ? (
                                                <span className="text-primary font-bold flex items-center gap-2"><Check /> {files.thumbnail.name.substring(0, 20)}...</span>
                                            ) : (
                                                <>
                                                    <ImagePlus className="text-3xl text-text-muted group-hover:text-primary mb-2 transition-colors" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Click to Upload</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-3 text-text-muted uppercase tracking-widest text-[10px]">Preview Video (Intro)</label>
                                    <div className="relative group">
                                        <input type="file" name="previewVideo" accept="video/*" className="hidden" id="preview" onChange={handleFileChange} />
                                        <label htmlFor="preview" className="aspect-video bg-white/5 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                                            {files.previewVideo ? (
                                                <span className="text-primary font-bold flex items-center gap-2"><Check /> {files.previewVideo.name.substring(0, 20)}...</span>
                                            ) : (
                                                <>
                                                    <Video className="text-3xl text-text-muted group-hover:text-primary mb-2 transition-colors" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Click to Upload</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 flex justify-between items-center">
                                <button type="button" onClick={() => setStep(1)} className="btn-secondary gap-2 border-none">
                                    <ChevronLeft className="text-xl" /> Back
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    disabled={!formData.price || !files.thumbnail}
                                    className="btn-primary gap-2 h-14 px-10 group"
                                >
                                    Final Review <ChevronRight className="group-hover:translate-x-1 transition-transform text-xl" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 fade-in-up text-center py-8">
                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-4xl mx-auto mb-6">
                                <Check />
                            </div>
                            <h2 className="text-2xl font-bold">Ready to Launch?</h2>
                            <p className="text-text-muted max-w-md mx-auto leading-relaxed">
                                Your course "<strong>{formData.title}</strong>" is ready for review. Once created, you can proceed to upload individual lessons and study materials.
                            </p>

                            <div className="pt-8 flex flex-col items-center gap-4">
                                <button type="submit" disabled={loading} className="btn-primary w-full h-16 justify-center text-lg pulse-glow">
                                    {loading ? <Spinner /> : 'Create and Launch Course'}
                                </button>
                                <button type="button" onClick={() => setStep(2)} className="text-text-muted hover:text-white transition-colors">
                                    Hold on, need to change something
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;
