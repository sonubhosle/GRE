import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';
import { User, Mail, Lock, Phone, Briefcase, ArrowLeft, GraduationCap, Eye, EyeOff, Upload, BadgeCheck, Users, Save, Loader2 } from 'lucide-react';

const Register = () => {
    const [role, setRole] = useState('USER');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        mobile: '',
        specialization: '',
        experience: '',
        technicalSkills: '',
    });
    const [photo, setPhoto] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            toast.success('Vector established: Welcome to the matrix.');
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key]) data.append(key, formData[key]);
        });
        data.append('role', role);
        if (photo) data.append('photo', photo);

        dispatch(register(data));
    };

    return (
        <div className="min-h-screen flex bg-white overflow-hidden">
            {/* Left Side: Visual/Branding (Desktop Only) */}
            <div className="hidden lg:flex lg:w-2/5 relative flex-col justify-center p-20 overflow-hidden bg-slate-50">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-transparent"></div>

                <div className="relative z-10 space-y-10">
                    <Link to="/" className="inline-flex items-center gap-3 text-slate-400 hover:text-indigo-600 transition-all mb-8 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Return to frequency</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white shadow-xl border border-slate-100 rounded-2xl flex items-center justify-center text-indigo-600 transition-transform hover:rotate-6">
                            <GraduationCap size={28} />
                        </div>
                        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Edu<span className="text-indigo-600">Platform</span></h1>
                    </div>

                    <h2 className="text-5xl font-semibold text-slate-900 leading-[1.05] tracking-tight">
                        Begin your <span className="text-indigo-600">knowledge</span> journey.
                    </h2>

                    <p className="text-slate-500 font-medium leading-relaxed max-w-sm text-lg">
                        Create your identity vector and unlock access to the world's most
                        advanced learning matrix. Whether you're here to learn or lead,
                        your evolution is our priority.
                    </p>

                    <div className="space-y-6 pt-12 border-t border-slate-100">
                        <div className="flex items-center gap-5 group/item">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl border border-slate-50 transition-transform group-hover/item:scale-110">
                                <BadgeCheck size={24} />
                            </div>
                            <div>
                                <h4 className="text-slate-900 text-[10px] font-bold uppercase tracking-widest">Verified Modules</h4>
                                <p className="text-slate-500 text-[11px] font-medium mt-1">Curated by sector architects</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-5 group/item">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-xl border border-slate-50 transition-transform group-hover/item:scale-110">
                                <Users size={24} />
                            </div>
                            <div>
                                <h4 className="text-slate-900 text-[10px] font-bold uppercase tracking-widest">Global Network</h4>
                                <p className="text-slate-500 text-[11px] font-medium mt-1">Collaborate with high-value talent</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Register Form */}
            <div className="w-full lg:w-3/5 flex items-center justify-center p-6 sm:p-12 relative flex-col">
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>

                <div className="w-full max-w-[640px] space-y-12 h-full flex flex-col justify-center py-12">
                    <div className="text-center lg:text-left space-y-4">
                        <h3 className="text-4xl font-semibold text-slate-900 tracking-tight">Initialize Identity</h3>
                        <p className="text-slate-500 font-semibold text-[10px] uppercase tracking-[0.2em]">Join the elite community of modern learners</p>
                    </div>

                    {/* Role Switcher */}
                    <div className="flex bg-slate-50 p-2 rounded-3xl border border-slate-100 w-full sm:w-fit mx-auto lg:mx-0 shadow-sm">
                        <button
                            className={`flex-1 sm:flex-none px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${role === 'USER' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-600'}`}
                            onClick={() => setRole('USER')}
                        >
                            Student Vector
                        </button>
                        <button
                            className={`flex-1 sm:flex-none px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${role === 'TEACHER' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-600'}`}
                            onClick={() => setRole('TEACHER')}
                        >
                            Master Link
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                        <div className="space-y-4 group/field">
                            <label className="text-[10px] font-bold text-slate-400 px-1 uppercase tracking-widest">Full Identity</label>
                            <div className="relative">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-indigo-600 transition-colors" size={20} />
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-100 rounded-3xl py-6 h-16 pl-16 pr-8 text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                                    placeholder="Enter full name..."
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 group/field">
                            <label className="text-[10px] font-bold text-slate-400 px-1 uppercase tracking-widest">Comm frequency</label>
                            <div className="relative">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-indigo-600 transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-100 rounded-3xl py-6 h-16 pl-16 pr-8 text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                                    placeholder="Enter encrypted email..."
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 group/field">
                            <label className="text-[10px] font-bold text-slate-400 px-1 uppercase tracking-widest">Mobile Link</label>
                            <div className="relative">
                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-indigo-600 transition-colors" size={20} />
                                <input
                                    type="tel"
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-100 rounded-3xl py-6 h-16 pl-16 pr-8 text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                                    placeholder="+X XXX XXX XXXX"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 group/field">
                            <label className="text-[10px] font-bold text-slate-400 px-1 uppercase tracking-widest">Access Key</label>
                            <div className="relative">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-indigo-600 transition-colors" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-100 rounded-3xl py-6 h-16 pl-16 pr-16 text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
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

                        <div className="md:col-span-2 space-y-4">
                            <label className="text-[10px] font-bold text-slate-400 px-1 uppercase tracking-widest">Identity Visual</label>
                            <div className="relative group/photo">
                                <Upload className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-hover/photo:text-indigo-600 transition-colors" size={20} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full bg-white border-2 border-dashed border-slate-100 hover:border-indigo-100 rounded-3xl py-6 h-16 pl-16 pr-8 text-slate-400 text-xs font-semibold cursor-pointer transition-all file:hidden"
                                    onChange={(e) => setPhoto(e.target.files[0])}
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-600 pointer-events-none uppercase tracking-widest">
                                    {photo ? photo.name.substring(0, 15) + '...' : 'Upload biometric'}
                                </span>
                            </div>
                        </div>

                        {role === 'TEACHER' && (
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 pt-4">
                                <div className="space-y-4 group/field">
                                    <label className="text-[10px] font-bold text-slate-400 px-1 uppercase tracking-widest">Specialization</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-indigo-600 transition-colors" size={16} />
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-100 rounded-3xl py-6 h-16 pl-16 pr-8 text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                                            placeholder="e.g. Neural Networks"
                                            value={formData.specialization}
                                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 group/field">
                                    <label className="text-[10px] font-bold text-slate-400 px-1 uppercase tracking-widest">Field Duration (Years)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-100 rounded-3xl py-6 h-16 px-8 text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                                        placeholder="5"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-4 group/field">
                                    <label className="text-[10px] font-bold text-slate-400 px-1 uppercase tracking-widest">Technical Sub-Skills</label>
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-100 rounded-[2rem] py-6 px-8 text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none min-h-[120px] resize-none"
                                        placeholder="e.g. React, Node.js, Python..."
                                        value={formData.technicalSkills}
                                        onChange={(e) => setFormData({ ...formData, technicalSkills: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        <div className="md:col-span-2 pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-16 rounded-[2rem] shadow-xl shadow-indigo-600/20 transition-all text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 overflow-hidden"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Establish Identity</>}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        Already authenticated?{' '}
                        <Link to="/login" className="text-indigo-600 hover:text-indigo-800 transition-colors underline decoration-indigo-600/30">
                            Axis Portal
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
