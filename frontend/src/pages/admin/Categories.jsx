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
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-fade-in-up">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <LayoutGrid className="w-5 h-5 text-indigo-600" />
                            <span className="text-[11px] font-bold text-slate-400">Inventory control</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-slate-900">
                            Category <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Manager</span>
                        </h1>
                        <p className="text-slate-500 font-medium max-w-md">Curate and organize learning paths for your global student community.</p>
                    </div>
                    <button
                        onClick={() => { setEditing(null); setFormData({ name: '', description: '', icon: '' }); setShowModal(true); }}
                        className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-indigo-500/10 active:scale-95"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        Add new category
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up transition-all delay-100">
                    {categories.map((cat, i) => (
                        <div
                            key={cat._id}
                            className="group relative p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-indigo-100 transition-all duration-500 shadow-sm hover:shadow-xl"
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-0 rounded-full -mr-16 -mt-16 blur-3xl group-hover:opacity-[0.03] transition-opacity"></div>

                            <div className="flex justify-between items-start mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-500">
                                    <Tag className="w-6 h-6" />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                    <button
                                        onClick={() => { setEditing(cat); setFormData({ name: cat.name, description: cat.description, icon: cat.icon }); setShowModal(true); }}
                                        className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center border border-slate-100"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat._id)}
                                        className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center justify-center border border-slate-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-indigo-600 transition-colors">{cat.name}</h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2 mb-6">{cat.description}</p>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                                    <Hash size={12} className="text-indigo-300" />
                                    Category ID
                                </span>
                                <div className="text-[11px] font-mono text-slate-400">{cat._id.slice(-6).toUpperCase()}</div>
                            </div>
                        </div>
                    ))}

                    {categories.length === 0 && (
                        <div className="col-span-full py-24 rounded-[3rem] bg-white border border-dashed border-slate-200 flex flex-col items-center justify-center shadow-sm">
                            <LayoutGrid size={48} className="text-slate-200 mb-6" />
                            <p className="text-slate-400 font-bold text-xl uppercase tracking-widest">No categories found</p>
                        </div>
                    )}
                </div>

                {/* Modern Glassy Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
                        <div className="relative w-full max-w-lg p-10 bg-white rounded-[3rem] border border-slate-100 shadow-2xl animate-fade-in-up">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-6 right-6 p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-10 text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
                                    {editing ? <Pencil className="text-white w-8 h-8" /> : <Plus className="text-white w-8 h-8" />}
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{editing ? 'Edit' : 'Create'} category</h2>
                                <p className="text-slate-500 text-sm font-medium mt-1">Fill in the details for your course category</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 ml-1">Category name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-200 rounded-2xl py-4 px-6 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold tracking-tight"
                                        placeholder="e.g. Artificial Intelligence"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 ml-1">Full description</label>
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-200 rounded-2xl py-4 px-6 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium min-h-[140px] resize-none"
                                        placeholder="Describe what students will learn in this path..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {submitting ? <Loader2 size={18} className="animate-spin" /> : (editing ? 'Apply changes' : 'Initialize category')}
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

