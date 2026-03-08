import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, clearError } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Loader2, GraduationCap, ShieldCheck, Zap } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && user) {
            toast.success(`Welcome back, ${user.name}!`);
            const redirectPath = user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'TEACHER' ? '/teacher/dashboard' : '/dashboard';
            navigate(redirectPath);
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(formData));
    };

    return (
        <div className="min-h-screen flex bg-white overflow-hidden">
            {/* Left Side: Visual/Branding (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center p-24 overflow-hidden bg-slate-50">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-transparent"></div>

                {/* Visual Elements */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full"></div>
                <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500/5 blur-3xl rounded-full"></div>

                <div className="relative z-10 space-y-10 max-w-lg">
                    <Link to="/" className="inline-flex items-center gap-3 text-slate-400 hover:text-indigo-600 transition-all mb-12 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Return to frequency</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white shadow-xl border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-indigo-600 transition-transform hover:rotate-6">
                            <GraduationCap size={32} />
                        </div>
                        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Edu<span className="text-indigo-600">Platform</span></h1>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-semibold text-slate-900 leading-[1.05] tracking-tight">
                        Forge your <span className="text-indigo-600">digital</span> legacy.
                    </h2>

                    <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-md">
                        Join a global network of specialized minds. Access high-frequency resources
                        and expert-led modules designed for the modern architect.
                    </p>

                    <div className="grid grid-cols-2 gap-8 pt-12 border-t border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
                                <ShieldCheck size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Matrix Opt-in</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm">
                                <Zap size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural Adaptation</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative flex-col">
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>

                {/* Mobile Identity */}
                <div className="lg:hidden absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-600/20">
                        <GraduationCap size={28} />
                    </div>
                    <span className="text-xl font-semibold text-slate-900 tracking-tight">EduPlatform</span>
                </div>

                <div className="w-full max-w-[420px] space-y-12">
                    <div className="text-center lg:text-left space-y-4">
                        <h3 className="text-4xl font-semibold text-slate-900 tracking-tight">Axis Login</h3>
                        <p className="text-slate-500 font-semibold text-[10px] uppercase tracking-[0.2em]">Synchronize your identity matrix</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4 group/field">
                            <label className="text-[10px] font-bold text-slate-400 px-1 uppercase tracking-widest">Identity Frequency</label>
                            <div className="relative">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-indigo-600 transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-100 rounded-[2rem] py-6 h-16 pl-16 pr-8 text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                                    placeholder="Enter verified email..."
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 group/field">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Access Key</label>
                                <Link to="/forgot-password" size="sm" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest">
                                    Lost key?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-indigo-600 transition-colors" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-100 rounded-[2rem] py-6 h-16 pl-16 pr-16 text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-all outline-none"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 px-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-600/10 cursor-pointer shadow-sm transition-all"
                            />
                            <label htmlFor="remember" className="text-[10px] font-bold text-slate-400 cursor-pointer select-none uppercase tracking-widest">
                                Persist Transmission
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-16 rounded-[2rem] shadow-xl shadow-indigo-600/20 transition-all text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 mt-10 overflow-hidden"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><ArrowRight size={20} /> Establish Link</>}
                        </button>
                    </form>

                    <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        Unauthorized axis?{' '}
                        <Link to="/register" className="text-indigo-600 hover:text-indigo-800 transition-colors underline decoration-indigo-600/30">
                            Initialize identity
                        </Link>
                    </p>
                </div>

                <div className="absolute bottom-8 text-[10px] font-bold text-slate-300 tracking-[0.3em] uppercase">
                    © 2026 EduPlatform Matrix
                </div>
            </div>
        </div>
    );
};

export default Login;
