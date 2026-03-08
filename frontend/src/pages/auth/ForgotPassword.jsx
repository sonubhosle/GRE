import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ChevronLeft, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSubmitted(true);
            toast.success('Reset protocol initiated');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Access denied');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <div className="max-w-md w-full p-12 bg-white rounded-[3rem] border border-slate-100 shadow-2xl text-center space-y-8 animate-fade-in-up">
                    <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/5 rotate-12">
                        <ShieldCheck size={40} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Check Your Inbox</h1>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed px-4">
                            We've dispatched a secure reset link to <span className="text-indigo-600 font-bold">{email}</span>. Please verify within 10 minutes.
                        </p>
                    </div>
                    <div className="pt-8 border-t border-slate-50">
                        <button
                            onClick={() => setSubmitted(false)}
                            className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                        >
                            Back to Access Portal
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-20 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full"></div>

            <div className="max-w-md w-full space-y-12 relative">
                <div className="text-center space-y-6">
                    <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest mb-4">
                        <ChevronLeft size={14} /> Identity Portal
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-none">
                        Access <span className="text-indigo-600">Recovery</span>
                    </h1>
                    <p className="text-slate-400 font-semibold text-[10px] uppercase tracking-[0.2em] max-w-[200px] mx-auto">Bypass biometric & password failure</p>
                </div>

                <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl space-y-10 group">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4 group/field">
                            <label className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-widest">Linked Email</label>
                            <div className="relative">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-indigo-600 transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-6 h-16 pl-16 pr-8 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-100 transition-all placeholder:text-slate-300"
                                    placeholder="Enter verified account email..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-[2rem] shadow-xl shadow-indigo-600/20 transition-all text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 active:scale-95 group-hover:shadow-indigo-600/30 overflow-hidden"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><ArrowRight size={20} /> Request Recovery</>}
                        </button>
                    </form>

                    <div className="pt-8 border-t border-slate-50 flex items-center justify-center gap-6">
                        <Mail size={16} className="text-indigo-600" />
                        <span className="text-[10px] font-medium text-slate-400 leading-tight">
                            Encrypted link will be sent to your primary identity frequency.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
