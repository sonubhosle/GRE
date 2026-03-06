import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import CustomDropdown from '../../components/common/CustomDropdown';
import { Info, CircleDollarSign, Video, BookOpen, Loader2, Clock, ChevronRight, ChevronLeft, Upload, Trash2, Plus, Sparkles, ImagePlus, Check } from 'lucide-react';
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
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-16 text-center animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 leading-tight">Create New <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">course</span></h1>
                    <p className="text-slate-500 font-medium text-lg">Share your expertise and inspire a worldwide audience.</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-6 mb-16 animate-fade-in-up delay-100">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 shadow-sm ${step >= 1 ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white text-slate-400 border border-slate-100'}`}>1</div>
                        <span className={`text-sm font-bold ${step >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>General</span>
                    </div>
                    <div className={`h-1 w-12 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 shadow-sm ${step >= 2 ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white text-slate-400 border border-slate-100'}`}>2</div>
                        <span className={`text-sm font-bold ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>Pricing</span>
                    </div>
                    <div className={`h-1 w-12 rounded-full transition-all duration-500 ${step >= 3 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 shadow-sm ${step >= 3 ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white text-slate-400 border border-slate-100'}`}>3</div>
                        <span className={`text-sm font-bold ${step >= 3 ? 'text-indigo-600' : 'text-slate-400'}`}>Finish</span>
                    </div>
                </div>

                <div className="bg-white p-8 md:p-16 rounded-[4rem] border border-slate-100 shadow-xl shadow-slate-200/50 animate-fade-in-up delay-200">
                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="space-y-10 animate-fade-in-up">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <Info size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">Basic information</h2>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 mb-3">Course title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            required
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="e.g. Master React in 30 Days"
                                            value={formData.title}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 mb-3">Description</label>
                                        <textarea
                                            name="description"
                                            required
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all min-h-[160px]"
                                            placeholder="What will students learn in this course?"
                                            value={formData.description}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <CustomDropdown
                                                options={categories.map(cat => ({ value: cat._id, label: cat.name }))}
                                                value={formData.category}
                                                onChange={(val) => setFormData({ ...formData, category: val })}
                                                placeholder="Select Category"
                                                label="Category"
                                            />
                                        </div>
                                        <div>
                                            <CustomDropdown
                                                options={[
                                                    { value: 'Beginner', label: 'Beginner' },
                                                    { value: 'Intermediate', label: 'Intermediate' },
                                                    { value: 'Advanced', label: 'Advanced' }
                                                ]}
                                                value={formData.level}
                                                onChange={(val) => setFormData({ ...formData, level: val })}
                                                label="Difficulty level"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-10 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        disabled={!formData.title || !formData.description || !formData.category}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-5 rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center gap-3 group disabled:opacity-50 disabled:scale-100"
                                    >
                                        Next step <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-10 animate-fade-in-up">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <CircleDollarSign size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">Pricing & assets</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 mb-3">Regular price (INR)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            required
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                            value={formData.price}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 mb-3">Discount (%)</label>
                                        <input
                                            type="number"
                                            name="discount"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                            value={formData.discount}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 mb-3">Thumbnail image</label>
                                        <div className="relative group/upload">
                                            <input type="file" name="thumbnail" accept="image/*" className="hidden" id="thumbnail" onChange={handleFileChange} />
                                            <label htmlFor="thumbnail" className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 cursor-pointer hover:border-indigo-500 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all group/label">
                                                {files.thumbnail ? (
                                                    <div className="flex flex-col items-center gap-4 text-center">
                                                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                                                            <Check size={32} />
                                                        </div>
                                                        <span className="text-slate-900 font-bold text-sm truncate max-w-[200px]">{files.thumbnail.name}</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover/label:text-indigo-600 group-hover/label:scale-110 transition-all shadow-sm mb-4">
                                                            <ImagePlus size={32} />
                                                        </div>
                                                        <span className="text-[11px] font-bold text-slate-400">Click to upload</span>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 mb-3">Preview video (Intro)</label>
                                        <div className="relative group/upload">
                                            <input type="file" name="previewVideo" accept="video/*" className="hidden" id="preview" onChange={handleFileChange} />
                                            <label htmlFor="preview" className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 cursor-pointer hover:border-purple-500 hover:bg-white hover:shadow-xl hover:shadow-purple-500/5 transition-all group/label">
                                                {files.previewVideo ? (
                                                    <div className="flex flex-col items-center gap-4 text-center">
                                                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                                                            <Check size={32} />
                                                        </div>
                                                        <span className="text-slate-900 font-bold text-sm truncate max-w-[200px]">{files.previewVideo.name}</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover/label:text-purple-600 group-hover/label:scale-110 transition-all shadow-sm mb-4">
                                                            <Video size={32} />
                                                        </div>
                                                        <span className="text-[11px] font-bold text-slate-400">Click to upload</span>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-10 flex justify-between items-center">
                                    <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                                        <ChevronLeft size={20} /> Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(3)}
                                        disabled={!formData.price || !files.thumbnail}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-5 rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center gap-3 group disabled:opacity-50 disabled:scale-100"
                                    >
                                        Final review <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-10 animate-fade-in-up text-center py-6">
                                <div className="w-24 h-24 rounded-[2rem] bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto mb-8 shadow-inner">
                                    <Check size={48} />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-bold text-slate-900">Ready to launch?</h2>
                                    <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed text-lg">
                                        Your course "<span className="text-indigo-600 font-bold">{formData.title}</span>" is ready for review. Once created, you can proceed to upload individual lessons.
                                    </p>
                                </div>

                                <div className="pt-10 flex flex-col items-center gap-6">
                                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-6 rounded-3xl shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center text-xl disabled:opacity-70 disabled:cursor-not-allowed">
                                        {loading ? <Loader2 className="animate-spin mr-3" size={28} /> : null}
                                        {loading ? 'Creating and Launching Course...' : 'Create and Launch Course'}
                                    </button>
                                    <button type="button" onClick={() => setStep(2)} className="text-slate-400 hover:text-indigo-600 font-bold transition-colors">
                                        Hold on, need to change something
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;
