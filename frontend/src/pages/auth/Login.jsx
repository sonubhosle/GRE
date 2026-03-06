import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, clearError } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, GraduationCap, ShieldCheck, Zap } from 'lucide-react';

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
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center p-20 overflow-hidden bg-slate-50">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-transparent"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-[0.03] mix-blend-multiply"></div>

                {/* Visual Elements */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full"></div>
                <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500/5 blur-3xl rounded-full"></div>

                <div className="relative z-10 space-y-8 max-w-lg">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-8 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold">Back to Home</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white shadow-sm border border-slate-200 rounded-2xl flex items-center justify-center text-indigo-600">
                            <GraduationCap size={28} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Coursify</h1>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                        Master the art of <span className="text-indigo-600">modern</span> skills.
                    </h2>

                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                        Join 50k+ ambitious learners worldwide. Access premium resources,
                        expert mentorship, and a community that pushes your limits.
                    </p>

                    <div className="grid grid-cols-2 gap-6 pt-10 border-t border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <ShieldCheck size={18} />
                            </div>
                            <span className="text-xs font-bold text-slate-600">Global certification</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                                <Zap size={18} />
                            </div>
                            <span className="text-xs font-bold text-slate-600">Adaptive learning</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative flex-col">
                {/* Mobile Identity */}
                <div className="lg:hidden absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <GraduationCap size={24} />
                    </div>
                    <span className="text-lg font-bold text-slate-900 tracking-tight">Coursify</span>
                </div>

                <div className="w-full max-w-[400px] space-y-10">
                    <div className="text-center lg:text-left space-y-2">
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h3>
                        <p className="text-slate-500 font-medium">Continue your learning journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-600 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600/50 rounded-2xl py-4 px-12 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-bold text-slate-600">Password</label>
                                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600/50 rounded-2xl py-4 px-12 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-all outline-none"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-1">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-600/20 cursor-pointer"
                                />
                            </div>
                            <label htmlFor="remember" className="text-xs font-bold text-slate-500 cursor-pointer select-none">
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all text-sm flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-slate-500 text-xs font-medium">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-indigo-600 font-bold hover:underline underline-offset-4 transition-colors">
                            Register now
                        </Link>
                    </p>
                </div>

                <div className="absolute bottom-8 text-[10px] font-bold text-slate-300 tracking-wider">
                    © 2026 COURSIFY. ALL RIGHTS RESERVED.
                </div>
            </div>
        </div>
    );
};

export default Login;
