import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../services/api';
import { getMe } from '../features/auth/authSlice';
import { Spinner } from '../components/common/Spinner';
import { User, Mail, Phone, Camera, Shield, Edit2, Save, Lock, Zap, Award, Target, Settings, LogOut, X, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        mobile: user?.mobile || '',
        specialization: user?.specialization || '',
        experience: user?.experience || '',
    });
    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                mobile: user.mobile || '',
                specialization: user.specialization || '',
                experience: user.experience || '',
            });
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (photo) data.append('photo', photo);

        try {
            await api.put('/users/profile', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('CORE PROFILE UPDATED SUCCESSFULLY');
            dispatch(getMe());
            setEditing(false);
        } catch (e) {
            toast.error(e.response?.data?.message || 'Update sequence failed');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a]">
            <div className="w-16 h-16 relative mb-4">
                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">Accessing Secure Profile...</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-16 animate-fade-in-up">

                    {/* Professional Bio Column */}
                    <div className="lg:w-96 space-y-10">
                        <div className="relative group p-10 bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 shadow-3xl text-center overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                            <div className="relative inline-block mb-10 group/avatar">
                                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover/avatar:opacity-40 transition-opacity"></div>
                                <img
                                    src={photo ? URL.createObjectURL(photo) : user.photo?.url || 'https://via.placeholder.com/150'}
                                    className="relative w-40 h-40 rounded-[2.5rem] border-4 border-white/5 object-cover shadow-2xl transition-transform duration-700 group-hover/avatar:scale-105"
                                />
                                <label className="absolute -bottom-4 -right-4 w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center cursor-pointer shadow-2xl hover:bg-indigo-500 transition-all active:scale-95 border-4 border-[#0e1526]">
                                    <Camera size={24} />
                                    <input type="file" className="hidden" accept="image/*" onChange={e => setPhoto(e.target.files[0])} />
                                </label>
                            </div>

                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2 group-hover:text-indigo-400 transition-colors">
                                {user.name}
                            </h2>
                            <span className="inline-block bg-indigo-600/10 text-indigo-400 text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest border border-indigo-500/20 mb-10">
                                {user.role} INTERFACE
                            </span>

                            <div className="space-y-6 text-left border-t border-white/5 pt-10">
                                <div className="flex items-center gap-4 group/item">
                                    <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-slate-500 group-hover/item:text-indigo-400 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Protocol Email</span>
                                        <span className="text-[11px] font-bold text-slate-300 truncate max-w-[180px]">{user.email}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group/item">
                                    <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-slate-500 group-hover/item:text-indigo-400 transition-colors">
                                        <Phone size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Secure Mobile</span>
                                        <span className="text-[11px] font-bold text-slate-300">{user.mobile || 'NOT CONFIGURED'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Matrix */}
                        <div className="p-8 bg-slate-900/10 backdrop-blur-xl rounded-[2.5rem] border border-white/[0.03]">
                            <div className="flex items-center gap-3 mb-8">
                                <Shield className="text-indigo-400" size={18} />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 font-mono">Security Protocol</h3>
                            </div>
                            <button className="w-full bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 border border-white/5">
                                <Lock size={16} /> Reconfigure Credentials
                            </button>
                        </div>
                    </div>

                    {/* Technical Profile Config */}
                    <div className="flex-1 space-y-10">
                        <div className="p-12 bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 shadow-3xl relative overflow-hidden group">
                            <div className="flex justify-between items-center mb-16 px-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-10 bg-indigo-500 rounded-full"></div>
                                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                                        IDENTITY <span className="text-indigo-500">MATRIX</span>
                                    </h1>
                                </div>
                                <button
                                    onClick={() => setEditing(!editing)}
                                    className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${editing
                                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        : 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20'
                                        }`}
                                >
                                    {editing ? <><X size={16} /> ABORT</> : <><Edit2 size={16} /> CONFIGURE</>}
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="col-span-full group/field">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4 block px-1">Full Identity Designation</label>
                                    <div className="relative">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/field:text-indigo-400 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            className={`w-full bg-slate-950/50 border rounded-3xl py-6 h-16 pl-16 pr-8 text-sm font-black text-white tracking-tight focus:outline-none focus:ring-4 transition-all ${editing
                                                ? 'border-indigo-500/30 ring-indigo-500/5 cursor-text'
                                                : 'border-white/5 cursor-not-allowed opacity-50'
                                                }`}
                                            disabled={!editing}
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="ENTER NAME..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4 block px-1">Core Email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-slate-950/30 border border-white/5 rounded-[2rem] py-5 px-8 text-sm font-black text-slate-500 cursor-not-allowed"
                                        disabled
                                        value={formData.email}
                                    />
                                    <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest px-1">UNALTERABLE AUTHENTICATION SOURCE</p>
                                </div>

                                <div className="space-y-3 group/field">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4 block px-1">Mobile Interface</label>
                                    <input
                                        type="text"
                                        className={`w-full bg-slate-950/50 border rounded-[2rem] py-5 px-8 text-sm font-black text-white tracking-tight focus:outline-none focus:ring-4 transition-all ${editing
                                            ? 'border-indigo-500/30 ring-indigo-500/5 cursor-text'
                                            : 'border-white/5 cursor-not-allowed opacity-50'
                                            }`}
                                        disabled={!editing}
                                        value={formData.mobile}
                                        onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                                        placeholder="+X XXX XXX XXXX"
                                    />
                                </div>

                                {user.role === 'TEACHER' && (
                                    <>
                                        <div className="col-span-full pt-10 border-t border-white/5">
                                            <div className="flex items-center gap-3">
                                                <Award className="text-indigo-500" size={18} />
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Professional Specialization Data</h3>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4 block px-1">Core Expertise</label>
                                            <input
                                                type="text"
                                                className={`w-full bg-slate-950/50 border rounded-[2rem] py-5 px-8 text-sm font-black text-white tracking-tight focus:outline-none focus:ring-4 transition-all ${editing
                                                    ? 'border-indigo-500/30 ring-indigo-500/5 cursor-text'
                                                    : 'border-white/5 cursor-not-allowed opacity-50'
                                                    }`}
                                                disabled={!editing}
                                                value={formData.specialization}
                                                onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                                                placeholder="E.G. QUANTUM COMPUTING..."
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4 block px-1">Temporal Expertise (Years)</label>
                                            <input
                                                type="number"
                                                className={`w-full bg-slate-950/50 border rounded-[2rem] py-5 px-8 text-sm font-black text-white tracking-tight focus:outline-none focus:ring-4 transition-all ${editing
                                                    ? 'border-indigo-500/30 ring-indigo-500/5 cursor-text'
                                                    : 'border-white/5 cursor-not-allowed opacity-50'
                                                    }`}
                                                disabled={!editing}
                                                value={formData.experience}
                                                onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                                placeholder="EXPERIENCE LEVEL..."
                                            />
                                        </div>
                                    </>
                                )}

                                {editing && (
                                    <div className="col-span-full pt-16">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="group relative w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-[2.5rem] shadow-2xl shadow-indigo-500/40 transition-all uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 active:scale-95 overflow-hidden"
                                        >
                                            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 animate-pulse"></div>
                                            {loading ? <Loader2 className="animate-spin" /> : <><Zap size={20} className="fill-current" /> COMMIT CHANGES TO DATABASE</>}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;

