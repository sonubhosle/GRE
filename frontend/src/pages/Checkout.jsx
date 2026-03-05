import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Spinner } from '../components/common/Spinner';
import { Lock, Ticket, Check, ShieldCheck, ArrowRight, Zap, Target, CreditCard, ChevronLeft, Calendar, FileText, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Checkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/courses/${id}`);
                setCourse(res.data.data.course);
            } catch (e) {
                toast.error('ARCHIVE RETRIEVAL FAILURE');
                navigate('/courses');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id, navigate]);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        try {
            const res = await api.post('/coupons/apply', { code: couponCode });
            setAppliedCoupon(res.data.data.coupon);
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

            const order = orderRes.data.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a]">
            <div className="w-16 h-16 relative mb-4">
                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">Initializing Checkout Matrix...</span>
        </div>
    );

    const discountAmount = appliedCoupon ? (course.finalPrice * appliedCoupon.discountPercentage) / 100 : 0;
    const totalAmount = course.finalPrice - discountAmount;

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Order Architecture */}
                    <div className="lg:col-span-2 flex-1 space-y-12 animate-fade-in-up">
                        <div>
                            <Link to="/courses" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors mb-6">
                                <ChevronLeft size={14} /> ABORT ENROLLMENT
                            </Link>
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none mb-6">
                                ENROLLMENT <span className="text-indigo-500">SUMMARY</span>
                            </h1>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">PROTOCOL: SECURE ACQUISITION SEQUENCE</p>
                        </div>

                        <div className="group relative p-8 bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 shadow-3xl overflow-hidden flex flex-col md:flex-row gap-10 items-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent"></div>

                            <div className="relative w-full md:w-64 aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                <img src={course.thumbnail?.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80" />
                                <div className="absolute inset-0 bg-slate-950/20"></div>
                            </div>

                            <div className="relative flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="px-4 py-1.5 rounded-full bg-indigo-600/10 text-indigo-400 text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">
                                        LEVEL {course.level}
                                    </span>
                                    <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{course.duration}H DURATION</span>
                                </div>
                                <h3 className="font-black text-2xl text-white uppercase tracking-tighter group-hover:text-indigo-400 transition-colors">{course.title}</h3>
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest opacity-60">ACADEMY LEAD: {course.teacher?.name}</p>
                            </div>
                        </div>

                        {/* Security Protocol Badges */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 rounded-[2rem] bg-slate-950/50 border border-white/5 flex items-center gap-6 group hover:border-emerald-500/20 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">Vault Status</p>
                                    <p className="text-xs font-black text-white tracking-widest uppercase">AES-256 ENCRYPTED</p>
                                </div>
                            </div>
                            <div className="p-8 rounded-[2rem] bg-slate-950/50 border border-white/5 flex items-center gap-6 group hover:border-indigo-500/20 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                    <Lock size={28} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">Privacy Tier</p>
                                    <p className="text-xs font-black text-white tracking-widest uppercase">SECURE PROTOCOL</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Matrix */}
                    <div className="lg:w-[400px] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="sticky top-32 p-10 bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border-2 border-indigo-500/10 shadow-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full"></div>

                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-12 border-b border-white/5 pb-4 font-mono">FINANCIAL MATRIX</h3>

                            <div className="space-y-6 mb-12">
                                <div className="flex justify-between items-center group">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">ACADEMY BASE FEE</span>
                                    <span className="text-sm font-black text-white">₹{course.finalPrice}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between items-center group">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">MATRIX DISCOUNT</span>
                                        </div>
                                        <span className="text-sm font-black text-emerald-400">- ₹{discountAmount}</span>
                                    </div>
                                )}
                                <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">TOTAL COMMITMENT</span>
                                        <div className="w-8 h-1 bg-indigo-500 rounded-full"></div>
                                    </div>
                                    <span className="text-4xl font-black text-white tracking-tighter">₹{totalAmount}</span>
                                </div>
                            </div>

                            {/* Coupon Decryption Section */}
                            <div className="mb-12">
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4 px-1">Decryption Key (Coupon)</p>
                                <div className="flex gap-2">
                                    <div className="relative flex-1 group/field">
                                        <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/field:text-indigo-400 transition-colors" size={16} />
                                        <input
                                            type="text"
                                            placeholder="XXXX-XXXX"
                                            className="w-full bg-slate-950/50 border border-white/5 focus:border-indigo-500/30 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black text-white placeholder-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none uppercase tracking-widest"
                                            value={couponCode}
                                            onChange={e => setCouponCode(e.target.value.toUpperCase())}
                                        />
                                    </div>
                                    <button
                                        onClick={handleApplyCoupon}
                                        className="bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white px-6 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border border-white/5 active:scale-95"
                                    >
                                        VERIFY
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={processing}
                                className="group relative w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-[2.5rem] shadow-2xl shadow-indigo-500/40 transition-all uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 active:scale-95 overflow-hidden"
                            >
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 animate-pulse"></div>
                                {processing ? <Loader2 className="animate-spin" /> : <><CreditCard size={18} /> INITIALIZE PAYMENT <ArrowRight size={18} /></>}
                            </button>

                            <p className="mt-8 text-[9px] text-center text-slate-700 uppercase tracking-widest leading-relaxed font-bold">
                                TRANSACTION PROTECTED BY <br />
                                <span className="text-slate-500">GLOBAL SECURITY STANDARDS</span>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;
