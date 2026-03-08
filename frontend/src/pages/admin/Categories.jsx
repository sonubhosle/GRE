import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import {
    Plus, Pencil, Trash2, Tag, Loader2, X,
    LayoutGrid, ChevronRight, Hash, Layers,
    Search, Filter, MoreVertical
} from 'lucide-react';
import { toast } from 'react-toastify';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', icon: '' });
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
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
        if (!window.confirm('Are you sure you want to delete this category? This might affect courses assigned to it.')) return;
        try {
            await api.delete(`/categories/${id}`);
            toast.success('Category removed');
            fetchCategories();
        } catch (e) { toast.error('Delete failed'); }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
    );

    return (
        <div className="space-y-10 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
                        Category <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 font-extrabold">Architecture</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-[13px]">Organize learning paths and taxonomies for the course catalog.</p>
                </div>

                <button
                    onClick={() => { setEditing(null); setFormData({ name: '', description: '', icon: '' }); setShowModal(true); }}
                    className="group flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Initialize Category
                </button>
            </div>

            {/* Quick Stats / Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-[2rem] bg-white border border-slate-100 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Layers size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{categories.length}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Groups</p>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2 p-6 rounded-[2rem] bg-white border border-slate-100 flex items-center gap-4 shadow-sm">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-6 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="p-3.5 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 border border-slate-100 transition-all">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredCategories.map((cat, i) => (
                    <div
                        key={cat._id}
                        className="group relative p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-indigo-100 transition-all duration-500 shadow-sm hover:shadow-xl flex flex-col"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-0 rounded-full -mr-16 -mt-16 blur-3xl group-hover:opacity-[0.03] transition-opacity"></div>

                        <div className="flex justify-between items-start mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-inner">
                                <Tag className="w-6 h-6" />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                <button
                                    onClick={() => { setEditing(cat); setFormData({ name: cat.name, description: cat.description, icon: cat.icon }); setShowModal(true); }}
                                    className="w-10 h-10 rounded-xl bg-white text-slate-400 hover:text-indigo-600 border border-slate-100 hover:border-indigo-100 transition-all flex items-center justify-center shadow-sm"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(cat._id)}
                                    className="w-10 h-10 rounded-xl bg-white text-slate-400 hover:text-rose-600 border border-slate-100 hover:border-rose-100 transition-all flex items-center justify-center shadow-sm"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{cat.name}</h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2 mb-8 flex-1">{cat.description || "No description provided for this catalog branch."}</p>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                            <span className="text-[10px] font-extrabold text-slate-300 flex items-center gap-1.5 uppercase tracking-widest">
                                <Hash size={12} />
                                Branch ID
                            </span>
                            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">{cat._id.slice(-8)}</div>
                        </div>
                    </div>
                ))}

                {filteredCategories.length === 0 && (
                    <div className="col-span-full py-24 rounded-[3rem] bg-white border border-dashed border-slate-200 flex flex-col items-center justify-center animate-fade-in-up">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 ring-8 ring-slate-50/50">
                            <LayoutGrid size={40} />
                        </div>
                        <p className="text-slate-900 font-bold text-lg mb-2 tracking-tight uppercase tracking-widest">Catalog Empty</p>
                        <p className="text-slate-500 text-sm font-medium">No categories matching "{search}" were discovered.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
                    <div className="relative w-full max-w-lg p-10 bg-white rounded-[3rem] border border-slate-200 shadow-2xl animate-fade-in-up">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-8 right-8 p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all border border-slate-100"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-12 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20 ring-4 ring-white">
                                {editing ? <Pencil className="text-white w-10 h-10" /> : <Plus className="text-white w-10 h-10" />}
                            </div>
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{editing ? 'Modify' : 'Create'} Branch</h2>
                            <p className="text-slate-500 text-sm font-medium mt-2">Configure catalog architecture parameters</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Branch Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-300 rounded-2xl py-5 px-6 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold tracking-tight text-lg"
                                    placeholder="e.g. Machine Learning"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Contextual Description</label>
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-300 rounded-2xl py-5 px-6 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium min-h-[160px] resize-none leading-relaxed"
                                    placeholder="Define the scope of this learning path..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-6 rounded-2xl shadow-2xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-[0.2em] text-xs active:scale-95"
                            >
                                {submitting ? <Loader2 size={20} className="animate-spin" /> : (editing ? 'Apply Modifications' : 'Initialize Node')}
                                {!submitting && <ChevronRight size={20} />}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
