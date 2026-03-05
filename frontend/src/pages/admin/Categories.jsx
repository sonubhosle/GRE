import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import { Plus, Pencil, Trash2, Tag, Loader2, X, LayoutGrid, ChevronRight, Hash } from 'lucide-react';
import { toast } from 'react-toastify';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', icon: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data.data.categories);
        } catch (e) {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editing) {
                await api.put(`/categories/${editing._id}`, formData);
                toast.success('Category updated successfully');
            } else {
                await api.post('/categories', formData);
                toast.success('New category created');
            }
            setFormData({ name: '', description: '', icon: '' });
            setShowModal(false);
            setEditing(null);
            fetchCategories();
        } catch (e) {
            toast.error(e.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) return;
        try {
            await api.delete(`/categories/${id}`);
            toast.success('Category removed');
            fetchCategories();
        } catch (e) { toast.error('Delete failed'); }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-fade-in-up">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <LayoutGrid className="w-5 h-5 text-indigo-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Inventory Control</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-white">
                            Category <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Manager</span>
                        </h1>
                        <p className="text-slate-400 font-medium max-w-md">Curate and organize learning paths for your global student community.</p>
                    </div>
                    <button
                        onClick={() => { setEditing(null); setFormData({ name: '', description: '', icon: '' }); setShowModal(true); }}
                        className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        Add New Category
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up transition-all delay-100">
                    {categories.map((cat, i) => (
                        <div
                            key={cat._id}
                            className="group relative p-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-indigo-500/30 transition-all duration-500 shadow-2xl"
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-0 rounded-full -mr-16 -mt-16 blur-3xl group-hover:opacity-[0.05] transition-opacity"></div>

                            <div className="flex justify-between items-start mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-500">
                                    <Tag className="w-6 h-6" />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                    <button
                                        onClick={() => { setEditing(cat); setFormData({ name: cat.name, description: cat.description, icon: cat.icon }); setShowModal(true); }}
                                        className="w-10 h-10 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-indigo-500 transition-all flex items-center justify-center border border-white/5"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat._id)}
                                        className="w-10 h-10 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-rose-500 transition-all flex items-center justify-center border border-white/5"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-indigo-400 transition-colors uppercase">{cat.name}</h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2 mb-6">{cat.description}</p>

                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-1.5">
                                    <Hash size={12} className="text-indigo-500/50" />
                                    Category ID
                                </span>
                                <div className="text-[10px] font-mono text-slate-500">{cat._id.slice(-6).toUpperCase()}</div>
                            </div>
                        </div>
                    ))}

                    {categories.length === 0 && (
                        <div className="col-span-full py-24 rounded-[3rem] bg-slate-900/20 border border-dashed border-white/5 flex flex-col items-center justify-center">
                            <LayoutGrid size={48} className="text-slate-800 mb-6" />
                            <p className="text-slate-500 font-bold text-xl uppercase tracking-widest">No Categories Found</p>
                        </div>
                    )}
                </div>

                {/* Modern Glassy Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
                        <div className="relative w-full max-w-lg p-10 bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-fade-in-up">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800/50 text-slate-500 hover:text-white hover:bg-slate-700 transition-all"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-10 text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/40">
                                    {editing ? <Pencil className="text-white w-8 h-8" /> : <Plus className="text-white w-8 h-8" />}
                                </div>
                                <h2 className="text-3xl font-black text-white tracking-tight uppercase">{editing ? 'Edit' : 'Create'} Category</h2>
                                <p className="text-slate-500 text-sm font-medium mt-1">Fill in the details for your course category</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Category Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-950/50 border border-slate-800 focus:border-indigo-500/50 rounded-2xl py-4 px-6 text-white placeholder-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold tracking-tight"
                                        placeholder="e.g. Artificial Intelligence"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Description</label>
                                    <textarea
                                        className="w-full bg-slate-950/50 border border-slate-800 focus:border-indigo-500/50 rounded-2xl py-4 px-6 text-white placeholder-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium min-h-[140px] resize-none"
                                        placeholder="Describe what students will learn in this path..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-widest text-sm"
                                    >
                                        {submitting ? <Loader2 size={18} className="animate-spin" /> : (editing ? 'Apply Changes' : 'Initialize Category')}
                                        {!submitting && <ChevronRight size={18} />}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryManagement;

