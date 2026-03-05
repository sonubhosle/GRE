import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';
import { User, Mail, Lock, Phone, Briefcase } from 'lucide-react';

const Register = () => {
    const [role, setRole] = useState('USER');
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
        <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
            <div className="card w-full max-w-2xl p-8 fade-in-up">
                <h2 className="text-3xl font-bold mb-2 text-center gradient-text">Create Account</h2>
                <p className="text-text-muted text-center mb-8">Join the elite community of learners and teachers.</p>

                {/* Role Switcher */}
                <div className="flex bg-bg-dark p-1 rounded-xl mb-8 w-fit mx-auto border border-border">
                    <button
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${role === 'USER' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
                        onClick={() => setRole('USER')}
                    >
                        I'm a Student
                    </button>
                    <button
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${role === 'TEACHER' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
                        onClick={() => setRole('TEACHER')}
                    >
                        I'm a Teacher
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium mb-2 text-text-muted">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 text-text-muted w-4 h-4" />
                            <input
                                type="text"
                                required
                                className="input-field pl-10"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium mb-2 text-text-muted">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-text-muted w-4 h-4" />
                            <input
                                type="email"
                                required
                                className="input-field pl-10"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium mb-2 text-text-muted">Mobile Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3.5 text-text-muted w-4 h-4" />
                            <input
                                type="tel"
                                required
                                className="input-field pl-10"
                                placeholder="+1 234 567 890"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium mb-2 text-text-muted">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 text-text-muted w-4 h-4" />
                            <input
                                type="password"
                                required
                                className="input-field pl-10"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2 text-text-muted">Profile Photo</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="input-field p-2 bg-transparent border-dashed border-2 hover:border-primary transition-colors"
                            onChange={(e) => setPhoto(e.target.files[0])}
                        />
                    </div>

                    {role === 'TEACHER' && (
                        <>
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium mb-2 text-text-muted">Specialization</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3.5 text-text-muted w-4 h-4" />
                                    <input
                                        type="text"
                                        required
                                        className="input-field pl-10"
                                        placeholder="e.g. Full Stack Developer"
                                        value={formData.specialization}
                                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium mb-2 text-text-muted">Years of Experience</label>
                                <input
                                    type="number"
                                    required
                                    className="input-field"
                                    placeholder="e.g. 5"
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2 text-text-muted">Technical Skills (comma separated)</label>
                                <textarea
                                    className="input-field min-h-[80px]"
                                    placeholder="React, Node.js, Python, AWS..."
                                    value={formData.technicalSkills}
                                    onChange={(e) => setFormData({ ...formData, technicalSkills: e.target.value })}
                                ></textarea>
                            </div>
                        </>
                    )}

                    <div className="md:col-span-2 mt-4">
                        <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-lg py-4">
                            {loading ? 'Creating Account...' : 'Get Started'}
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-text-muted text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-bold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
