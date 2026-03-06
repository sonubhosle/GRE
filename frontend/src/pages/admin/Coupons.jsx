import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import { Ticket, Plus, Trash2, Loader2, X, ChevronRight, Calculator, Calendar, Activity, Zap } from 'lucide-react';
import { toast } from 'react-toastify';

const CouponManagement = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
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
                            <Zap className="w-5 h-5 text-amber-500" />
                            <span className="text-[11px] font-bold text-slate-400">Marketing & growth</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-slate-900">
                            Coupon <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500">Engine</span>
                        </h1>
                        <p className="text-slate-500 font-medium max-w-md">Create and manage high-conversion promotional campaigns with smart promo codes.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="group flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-slate-200/50 border border-slate-100 active:scale-95"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500 text-amber-500" />
                        Generate new code
                    </button>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden animate-fade-in-up transition-all delay-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-6 text-[11px] font-bold text-slate-400">Promo identifier</th>
                                    <th className="px-8 py-6 text-[11px] font-bold text-slate-400">Discount value</th>
                                    <th className="px-8 py-6 text-[11px] font-bold text-slate-400">Usage metrics</th>
                                    <th className="px-8 py-6 text-[11px] font-bold text-slate-400">Valid until</th>
                                    <th className="px-8 py-6 text-[11px] font-bold text-slate-400">Current state</th>
                                    <th className="px-8 py-6 text-[11px] font-bold text-slate-400 text-right">Admin</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {coupons.map(coupon => (
                                    <tr key={coupon._id} className="hover:bg-slate-50/30 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                                                    <Ticket size={20} />
                                                </div>
                                                <span className="font-mono font-bold text-slate-900 tracking-tight text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">{coupon.code}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-bold text-emerald-600">{coupon.discountPercentage}%</span>
                                                <span className="text-[11px] font-bold text-slate-400">Redeemable</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-2 w-32">
                                                <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                                                    <span>Usage</span>
                                                    <span className="text-slate-600">{Math.round((coupon.usedCount / coupon.maxUsage) * 100)}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000"
                                                        style={{ width: `${(coupon.usedCount / coupon.maxUsage) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-bold">{coupon.usedCount} of {coupon.maxUsage} redeemed</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                                                <Calendar size={14} className="text-slate-600" />
                                                {new Date(coupon.expiryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border shadow-sm ${coupon.active
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                : 'bg-rose-50 text-rose-600 border-rose-100'
                                                }`}>
                                                <Activity size={10} className={coupon.active ? 'animate-pulse' : ''} />
                                                {coupon.active ? 'Operational' : 'Deactivated'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => handleDelete(coupon._id)}
                                                className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-100 inline-flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {coupons.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-24 text-slate-400 font-bold">
                                            <div className="flex flex-col items-center">
                                                <Ticket size={48} className="text-slate-100 mb-6" />
                                                No promotional campaigns active
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modern Glassy Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
                        <div className="relative w-full max-w-xl p-10 bg-white rounded-[3rem] border border-slate-100 shadow-2xl animate-fade-in-up">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-8 right-8 p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all border border-slate-100"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-12 text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/20 rotate-12">
                                    <Ticket className="text-white w-8 h-8 -rotate-12" />
                                </div>
                                <h2 className="text-4xl font-bold text-slate-900">Generate <span className="text-amber-500">promo</span></h2>
                                <p className="text-slate-500 text-sm font-medium mt-2">Initialize new marketing campaign parameters</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 ml-1">Campaign code</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-100 focus:border-amber-200 rounded-2xl py-5 px-6 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-amber-500/5 transition-all font-mono font-bold text-xl text-center"
                                        required
                                        placeholder="SAVE2024"
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-400 ml-1 flex items-center gap-2">
                                            <Calculator size={12} /> Discount (%)
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-50 border border-slate-100 focus:border-amber-200 rounded-2xl py-4 px-6 text-slate-900 placeholder-slate-300 focus:outline-none transition-all font-bold text-lg"
                                            required
                                            placeholder="20"
                                            value={formData.discountPercentage}
                                            onChange={e => setFormData({ ...formData, discountPercentage: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-400 ml-1 flex items-center gap-2">
                                            <Activity size={12} /> Max claims
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-50 border border-slate-100 focus:border-amber-200 rounded-2xl py-4 px-6 text-slate-900 placeholder-slate-300 focus:outline-none transition-all font-bold text-lg"
                                            required
                                            placeholder="100"
                                            value={formData.maxUsage}
                                            onChange={e => setFormData({ ...formData, maxUsage: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 ml-1 flex items-center gap-2">
                                        <Calendar size={12} /> Expiration date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full bg-slate-50 border border-slate-100 focus:border-amber-200 rounded-2xl py-4 px-6 text-slate-900 focus:outline-none transition-all font-bold"
                                        required
                                        value={formData.expiryDate}
                                        onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                    />
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-6 rounded-[2rem] shadow-xl shadow-amber-500/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Launch campaign'}
                                        {!submitting && <ChevronRight size={20} />}
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

export default CouponManagement;

