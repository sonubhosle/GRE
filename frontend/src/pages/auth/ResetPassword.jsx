import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, Loader2, ShieldAlert, Key } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Shield mismatch: Passwords must align');
        }

        setLoading(true);
        try {
            await api.patch(`/auth/reset-password/${token}`, { password: formData.password });
            toast.success('Identity secured: Access restored');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Token expired or invalid');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-20 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-rose-500/5 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full"></div>

            <div className="max-w-md w-full space-y-12 relative">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-3 bg-rose-50 text-rose-600 px-6 py-2 rounded-full border border-rose-100 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                        <Key size={14} /> Single Use Token Authenticated
                    </div>
                    <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-none">
                        New <span className="text-rose-500">Pass-Key</span>
                    </h1>
                    <p className="text-slate-400 font-semibold text-[10px] uppercase tracking-[0.2em] max-w-[200px] mx-auto">Recalibrate axis shield protocol</p>
                </div>

                <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl space-y-10 group">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4 group/field">
                            <label className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-widest">Secure Entry Sequence</label>
                            <div className="relative">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-rose-500 transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    minLength="8"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-6 h-16 pl-16 pr-8 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-100 transition-all placeholder:text-slate-300"
                                    placeholder="Enter new master key..."
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 group/field">
                            <label className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-widest">Verify Sequence</label>
                            <div className="relative">
                                <ShieldAlert className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-rose-500 transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-6 h-16 pl-16 pr-8 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-100 transition-all placeholder:text-slate-300"
                                    placeholder="Confirm new master key..."
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-[2rem] shadow-xl shadow-rose-500/20 transition-all text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 active:scale-95 group-hover:shadow-rose-500/30 overflow-hidden"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><ArrowRight size={20} /> Secure Identity</>}
                        </button>
                    </form>

                    <div className="pt-8 border-t border-slate-50">
                        <p className="text-[10px] font-medium text-slate-400 text-center leading-relaxed italic">
                            Once updated, your previous credentials will be permanently purged from the matrix.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
