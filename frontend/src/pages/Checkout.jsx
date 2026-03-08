import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Spinner } from '../components/common/Spinner';
import { Lock, Ticket, Check, ShieldCheck, ArrowRight, Zap, Target, CreditCard, ChevronLeft, Calendar, FileText, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

const Checkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [activeCoupons, setActiveCoupons] = useState([]);
    const [processing, setProcessing] = useState(false);

    const fetchData = async () => {
        try {
            const [courseRes, activeCouponsRes] = await Promise.all([
                api.get(`/courses/${id}`),
                api.get('/coupons/active')
            ]);
            setCourse(courseRes.data.data.course);
            setActiveCoupons(activeCouponsRes.data.data.coupons || []);
        } catch (e) {
            toast.error('ARCHIVE RETRIEVAL FAILURE');
            navigate('/courses');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [id, navigate]);

    const handleApplyCoupon = async (codeToApply) => {
        const code = codeToApply || couponCode;
        if (!code) return;
        try {
            const res = await api.post('/coupons/apply', { code, coursePrice: course.finalPrice });
            setAppliedCoupon(res.data.data.coupon);
            if (codeToApply) setCouponCode(codeToApply);
            toast.success('DECRYPTION CODE ACCEPTED');
        } catch (e) {
            toast.error(e.response?.data?.message || 'INVALID DECRYPTION CODE');
        }
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setProcessing(true);
        const res = await loadRazorpay();

        if (!res) {
            toast.error('PAYMENT GATEWAY INITIALIZATION FAILURE');
            setProcessing(false);
            return;
        }

        try {
            const orderRes = await api.post('/payments/create-order', {
                courseId: id,
                couponCode: appliedCoupon?.code
            });

            const { order, key } = orderRes.data.data;

            const options = {
                key: key,
                amount: order.amount,
                currency: order.currency,
                name: 'COURSIFY CORE',
                description: `ACADEMY ENROLLMENT: ${course.title}`,
                order_id: order.id,
                handler: async (response) => {
                    try {
                        await api.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            courseId: id
                        });
                        toast.success('ENROLLMENT SEQUENCE COMPLETED');
                        setTimeout(() => navigate(`/watch/${id}`), 2000);
                    } catch (e) {
                        toast.error('VERIFICATION SEQUENCE FAILURE');
                    }
                },
                theme: { color: '#6366f1' }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (e) {
            toast.error(e.response?.data?.message || 'TRANSACTION INITIALIZATION FAILURE');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-16 h-16 relative mb-4">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 animate-pulse">Initializing checkout...</span>
        </div>
    );

    const discountAmount = appliedCoupon ? (course.finalPrice * appliedCoupon.discountPercentage) / 100 : 0;
    const totalAmount = course.finalPrice - discountAmount;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Order Architecture */}
                    <div className="lg:col-span-2 flex-1 space-y-12 animate-fade-in-up">
                        <div>
                            <Link to="/courses" className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 hover:text-indigo-600 transition-colors mb-6">
                                <ChevronLeft size={14} /> Abort enrollment
                            </Link>
                            <h1 className="text-4xl md:text-6xl font-semibold text-slate-900 tracking-tight leading-none mb-6">
                                Enrollment <span className="text-indigo-600">summary</span>
                            </h1>
                            <p className="text-slate-400 font-semibold text-xs">Protocol: Secure acquisition sequence</p>
                        </div>

                        <div className="group relative p-8 bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col md:flex-row gap-10 items-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent"></div>

                            <div className="relative w-full md:w-64 aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-xl">
                                <img src={course.thumbnail?.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-slate-900/5"></div>
                            </div>

                            <div className="relative flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-semibold border border-indigo-100">
                                        Level {course.level}
                                    </span>
                                    <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                                    <span className="text-[10px] font-semibold text-slate-400">{course.duration}h duration</span>
                                </div>
                                <h3 className="font-semibold text-2xl text-slate-900 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                                <p className="text-slate-400 text-sm font-semibold opacity-80">Academy lead: {course.teacher?.name}</p>
                            </div>
                        </div>

                        {/* Security Protocol Badges */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-md flex items-center gap-6 group hover:border-emerald-500/20 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-400 mb-1">Vault status</p>
                                    <p className="text-xs font-semibold text-slate-700">AES-256 encrypted</p>
                                </div>
                            </div>
                            <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-md flex items-center gap-6 group hover:border-indigo-500/20 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                    <Lock size={28} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-400 mb-1">Privacy tier</p>
                                    <p className="text-xs font-semibold text-slate-700">Secure protocol</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Matrix */}
                    <div className="lg:w-[400px] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="sticky top-32 p-10 bg-white rounded-[3rem] border border-slate-100 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full"></div>

                            <h3 className="text-[11px] font-semibold text-slate-400 mb-12 border-b border-slate-50 pb-4">Financial matrix</h3>

                            <div className="space-y-6 mb-12">
                                <div className="flex justify-between items-center group">
                                    <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">Academy base fee</span>
                                    <span className="text-sm font-semibold text-slate-900">₹{course.finalPrice}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between items-center group">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                            <span className="text-[11px] font-semibold text-emerald-600">Matrix discount</span>
                                        </div>
                                        <span className="text-sm font-semibold text-emerald-600">- ₹{discountAmount}</span>
                                    </div>
                                )}
                                <div className="pt-8 border-t border-slate-50 flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-semibold text-indigo-600 mb-1">Total commitment</span>
                                        <div className="w-8 h-1 bg-indigo-500 rounded-full"></div>
                                    </div>
                                    <span className="text-4xl font-semibold text-slate-900">₹{totalAmount}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-semibold block mb-2">Secure transaction node</span>
                            </div>

                            {/* Coupon Decryption Section */}
                            <div className="mb-12">
                                <p className="text-[10px] font-semibold text-slate-400 mb-4 px-1">Decryption key (coupon)</p>
                                <div className="flex gap-2 mb-6">
                                    <div className="relative flex-1 group/field">
                                        <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-indigo-600 transition-colors" size={16} />
                                        <input
                                            type="text"
                                            placeholder="XXXX-XXXX"
                                            className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-100 rounded-2xl py-4 pl-12 pr-4 text-[11px] font-semibold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                                            value={couponCode}
                                            onChange={e => setCouponCode(e.target.value.toUpperCase())}
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleApplyCoupon()}
                                        className="bg-slate-900 hover:bg-slate-800 text-white px-6 rounded-2xl text-[10px] font-semibold transition-all active:scale-95"
                                    >
                                        Verify
                                    </button>
                                </div>

                                {activeCoupons.length > 0 && (
                                    <div className="space-y-3">
                                        <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest px-1">Available Node Keys</p>
                                        <div className="flex flex-wrap gap-2">
                                            {activeCoupons.map(c => (
                                                <button
                                                    key={c._id}
                                                    onClick={() => handleApplyCoupon(c.code)}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-semibold border transition-all flex items-center gap-2
                                                        ${appliedCoupon?.code === c.code
                                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                            : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-100 hover:text-indigo-600'
                                                        }`}
                                                >
                                                    <Sparkles size={12} className={appliedCoupon?.code === c.code ? 'text-emerald-500' : 'text-slate-300'} />
                                                    {c.code} ({c.discountPercentage}%)
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={processing}
                                className="group relative w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-5 rounded-[2.5rem] shadow-xl shadow-indigo-600/20 transition-all text-sm flex items-center justify-center gap-4 active:scale-95 overflow-hidden"
                            >
                                {processing ? <Loader2 className="animate-spin" /> : <><CreditCard size={18} /> Initialize payment <ArrowRight size={18} /></>}
                            </button>

                            <p className="mt-8 text-[10px] text-center text-slate-400 leading-relaxed font-semibold">
                                Transaction protected by <br />
                                <span className="text-slate-500">Global security standards</span>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;
