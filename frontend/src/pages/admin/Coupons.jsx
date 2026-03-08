import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import {
    Ticket, Plus, Trash2, Loader2, X,
    ChevronRight, Calculator, Calendar, Activity,
    Zap, Search, Filter, TrendingUp, Sparkles,
    CheckCircle2, Clock
} from 'lucide-react';
import { toast } from 'react-toastify';

const CouponManagement = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({
        code: '',
        discountPercentage: '',
        expiryDate: '',
        maxUsage: '100',
        active: true
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const res = await api.get('/coupons');
            setCoupons(res.data.data.coupons);
        } catch (e) {
            toast.error('Failed to load coupons');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/coupons', formData);
            toast.success('Promo code generated successfully');
            setShowModal(false);
            setFormData({ code: '', discountPercentage: '', expiryDate: '', maxUsage: '100', active: true });
            fetchCoupons();
        } catch (e) {
            toast.error(e.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this coupon? This will invalidate it for all users.')) return;
        try {
            await api.delete(`/coupons/${id}`);
            toast.success('Coupon invalidated and removed');
            fetchCoupons();
        } catch (e) { toast.error('Delete failed'); }
    };

    const filteredCoupons = coupons.filter(c =>
        c.code.toLowerCase().includes(search.toLowerCase())
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
                        Promo <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600 font-extrabold text-5xl">Engine</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-[13px]">Generate and audit promotional campaigns to drive course enrollment.</p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="group flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-white px-10 py-4 rounded-2xl font-extrabold text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-amber-500/10 active:scale-95 flex-shrink-0"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    Launch Campaign
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-8 rounded-[2.5rem] bg-indigo-900 text-white shadow-2xl shadow-indigo-900/10 flex flex-col justify-between">
                    <Sparkles className="text-indigo-300 mb-6" />
                    <div>
                        <p className="text-3xl font-extrabold tracking-tighter mb-1">{coupons.length}</p>
                        <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Active Perks</p>
                    </div>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
                    <TrendingUp className="text-emerald-500 mb-6" />
                    <div>
                        <p className="text-3xl font-bold text-slate-900 tracking-tighter mb-1">
                            {coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0)}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Redemptions</p>
                    </div>
                </div>
                <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-amber-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find specific promo code..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-4 pl-14 pr-6 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-amber-500/5 transition-all font-bold tracking-tight"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Content Table Card */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden transition-all duration-300">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Campaign Code</th>
                                <th className="px-10 py-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Benefit</th>
                                <th className="px-10 py-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Growth Metrics</th>
                                <th className="px-10 py-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Expiration</th>
                                <th className="px-10 py-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredCoupons.map(coupon => (
                                <tr key={coupon._id} className="hover:bg-amber-50/20 transition-all group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-inner">
                                                <Ticket size={24} />
                                            </div>
                                            <div>
                                                <span className="font-mono font-extrabold text-slate-900 tracking-tighter text-lg">{coupon.code}</span>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${coupon.active ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{coupon.active ? 'System Active' : 'Deactivated'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col items-center">
                                            <span className="text-2xl font-black text-slate-900 tracking-tighter">{coupon.discountPercentage}%</span>
                                            <span className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest">Off MSRP</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-3 w-48">
                                            <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.1em]">
                                                <span>Pipeline</span>
                                                <span className="text-slate-900">{Math.round((coupon.usedCount / coupon.maxUsage) * 100)}% Used</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
                                                <div
                                                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                                                    style={{ width: `${(coupon.usedCount / coupon.maxUsage) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-bold italic">{coupon.usedCount} of {coupon.maxUsage} slots filled</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-2.5 text-slate-600 font-extrabold text-[12px] uppercase">
                                            <Clock size={16} className="text-slate-400" />
                                            {new Date(coupon.expiryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                            <button
                                                onClick={() => handleDelete(coupon._id)}
                                                className="w-12 h-12 rounded-xl bg-white text-slate-400 hover:text-rose-600 border border-slate-100 hover:border-rose-100 hover:bg-rose-50 transition-all shadow-sm flex items-center justify-center"
                                                title="Retract Code"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                            <button className="w-12 h-12 rounded-xl bg-white text-slate-400 hover:text-slate-900 border border-slate-100 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center">
                                                <MoreVertical size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredCoupons.length === 0 && (
                <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200 animate-fade-in-up">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200 ring-8 ring-slate-50/50">
                        <Ticket size={48} />
                    </div>
                    <p className="text-slate-900 font-extrabold text-2xl mb-2 tracking-tight uppercase">Campaigns Offline</p>
                    <p className="text-slate-500 text-[13px] font-medium max-w-sm mx-auto">No promotional identifiers found in the registry.</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
                    <div className="relative w-full max-w-xl p-10 bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl animate-fade-in-up">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-10 right-10 p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all border border-slate-100"
                        >
                            <X size={22} />
                        </button>

                        <div className="mb-12 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-amber-500/30 rotate-12 ring-4 ring-white">
                                <Ticket className="text-white w-12 h-12 -rotate-12" />
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Mint <span className="text-amber-500 underline decoration-amber-100 underline-offset-8">Promo</span></h2>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-3">Initialize new strategic campaign</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Universal Access Code</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border-2 border-slate-50 focus:border-amber-400/50 rounded-3xl py-6 px-8 text-slate-900 placeholder-slate-200 focus:outline-none focus:ring-8 focus:ring-amber-500/5 transition-all font-mono font-black text-3xl text-center tracking-[0.2em] shadow-inner"
                                    required
                                    placeholder="GLOBAL50"
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Calculator size={14} className="text-amber-500" /> Rebate (%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            className="w-full bg-slate-50 border border-slate-100 focus:border-amber-300 rounded-2xl py-5 px-6 text-slate-900 placeholder-slate-300 focus:outline-none transition-all font-black text-2xl shadow-sm"
                                            required
                                            placeholder="20"
                                            value={formData.discountPercentage}
                                            onChange={e => setFormData({ ...formData, discountPercentage: e.target.value })}
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xl">%</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Zap size={14} className="text-amber-500" /> Allocation
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 border border-slate-100 focus:border-amber-300 rounded-2xl py-5 px-6 text-slate-900 placeholder-slate-300 focus:outline-none transition-all font-black text-2xl shadow-sm"
                                        required
                                        placeholder="500"
                                        value={formData.maxUsage}
                                        onChange={e => setFormData({ ...formData, maxUsage: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Clock size={14} className="text-amber-500" /> Lifecycle End
                                </label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-50 border border-slate-100 focus:border-amber-300 rounded-2xl py-5 px-6 text-slate-900 focus:outline-none transition-all font-extrabold text-lg shadow-sm"
                                    required
                                    value={formData.expiryDate}
                                    onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-7 rounded-[2.5rem] shadow-2xl shadow-amber-500/20 transition-all flex items-center justify-center gap-4 disabled:opacity-50 uppercase tracking-[0.3em] text-xs active:scale-95 border-b-4 border-amber-700 hover:border-b-2 hover:translate-y-0.5"
                            >
                                {submitting ? <Loader2 size={24} className="animate-spin" /> : <><CheckCircle2 size={24} /> Mint Campaign</>}
                                {!submitting && <ChevronRight size={24} />}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CouponManagement;
