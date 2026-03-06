import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';
import { User, Mail, Lock, Phone, Briefcase, ArrowLeft, GraduationCap, Eye, EyeOff, Upload, BadgeCheck, Users } from 'lucide-react';

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
            toast.success('Registration successful!');
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
            <div className="hidden lg:flex lg:w-2/5 relative flex-col justify-center p-16 overflow-hidden bg-slate-50">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-transparent"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-[0.05] mix-blend-multiply"></div>

                <div className="relative z-10 space-y-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-4 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold">Back to Home</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white shadow-sm border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600">
                            <GraduationCap size={24} />
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Coursify</h1>
                    </div>

                    <h2 className="text-5xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                        Begin your <span className="text-indigo-600">knowledge</span> journey.
                    </h2>

                    <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
                        Create your identity vector and unlock access to the world's most
                        advanced learning platform. Whether you're here to learn or lead,
                        your growth is our priority.
                    </p>

                    <div className="space-y-4 pt-10">
                        <div className="flex items-center gap-4 bg-white/50 border border-slate-200 p-4 rounded-2xl shadow-sm">
                            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                <BadgeCheck size={20} />
                            </div>
                            <div>
                                <h4 className="text-slate-900 text-xs font-bold">Verified content</h4>
                                <p className="text-slate-500 text-[10px]">Curated by industry veterans</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white/50 border border-slate-200 p-4 rounded-2xl shadow-sm">
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                                <Users size={20} />
                            </div>
                            <div>
                                <h4 className="text-slate-900 text-xs font-bold">Global network</h4>
                                <p className="text-slate-500 text-[10px]">Collaborate with top 1% talent</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Register Form */}
            <div className="w-full lg:w-3/5 flex items-center justify-center p-6 sm:p-12 relative flex-col">
                <div className="w-full max-w-[600px] space-y-8 h-full flex flex-col justify-center py-12 scrollbar-hide">
                    <div className="text-center lg:text-left space-y-2">
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Create account</h3>
                        <p className="text-slate-500 font-medium">Join the elite community of modern learners</p>
                    </div>

                    {/* Role Switcher */}
                    <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 w-full sm:w-fit mx-auto lg:mx-0 shadow-sm">
                        <button
                            className={`flex-1 sm:flex-none px-8 py-3 rounded-xl text-xs font-bold transition-all ${role === 'USER' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setRole('USER')}
                        >
                            Student
                        </button>
                        <button
                            className={`flex-1 sm:flex-none px-8 py-3 rounded-xl text-xs font-bold transition-all ${role === 'TEACHER' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setRole('TEACHER')}
                        >
                            Mentor
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-600 ml-1">Full name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600/50 rounded-2xl py-3.5 px-12 text-slate-900 placeholder-slate-400 focus:outline-none transition-all outline-none"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-600 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600/50 rounded-2xl py-3.5 px-12 text-slate-900 placeholder-slate-400 focus:outline-none transition-all outline-none"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-600 ml-1">Mobile number</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                                <input
                                    type="tel"
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600/50 rounded-2xl py-3.5 px-12 text-slate-900 placeholder-slate-400 focus:outline-none transition-all outline-none"
                                    placeholder="+1 234 567 890"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-600 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600/50 rounded-2xl py-3.5 px-12 text-slate-900 placeholder-slate-400 focus:outline-none transition-all outline-none"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-all outline-none"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-600 ml-1">Profile Photo</label>
                            <div className="relative group">
                                <Upload className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full bg-white border-2 border-dashed border-slate-200 hover:border-indigo-600/50 rounded-2xl py-3.5 px-12 text-slate-400 text-xs cursor-pointer transition-all file:hidden"
                                    onChange={(e) => setPhoto(e.target.files[0])}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-600 pointer-events-none">
                                    {photo ? photo.name.substring(0, 15) + '...' : 'Upload photo'}
                                </span>
                            </div>
                        </div>

                        {role === 'TEACHER' && (
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-600 ml-1">Specialization</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600/50 rounded-2xl py-3.5 px-12 text-slate-900 placeholder-slate-400 focus:outline-none transition-all outline-none"
                                            placeholder="e.g. Quantum Computing"
                                            value={formData.specialization}
                                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-600 ml-1">Experience (Years)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600/50 rounded-2xl py-3.5 px-6 text-slate-900 placeholder-slate-400 focus:outline-none transition-all outline-none"
                                        placeholder="5"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-slate-600 ml-1">Technical Skills</label>
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600/50 rounded-2xl py-4 px-6 text-slate-900 placeholder-slate-400 focus:outline-none transition-all outline-none min-h-[100px] resize-none"
                                        placeholder="e.g. React, Node.js, Python..."
                                        value={formData.technicalSkills}
                                        onChange={(e) => setFormData({ ...formData, technicalSkills: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        <div className="md:col-span-2 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all text-sm flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-slate-500 text-xs font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 font-bold hover:underline underline-offset-4 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
