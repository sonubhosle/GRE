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
            toast.success('Core profile updated successfully');
            dispatch(getMe());
            setEditing(false);
        } catch (e) {
            toast.error(e.response?.data?.message || 'Update sequence failed');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-16 h-16 relative mb-4">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
            <span className="text-[11px] font-bold text-slate-400 animate-pulse">Loading profile...</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-16 animate-fade-in-up">

                    {/* Professional Bio Column */}
                    <div className="lg:w-96 space-y-10">
                        <div className="relative group p-10 bg-white rounded-[3rem] border border-slate-100 shadow-2xl text-center overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                            <div className="relative inline-block mb-10 group/avatar">
                                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-10 group-hover/avatar:opacity-20 transition-opacity"></div>
                                <img
                                    src={photo ? URL.createObjectURL(photo) : user.photo?.url || 'https://via.placeholder.com/150'}
                                    className="relative w-40 h-40 rounded-[2.5rem] border-4 border-slate-50 object-cover shadow-xl transition-transform duration-700 group-hover/avatar:scale-105"
                                />
                                <label className="absolute -bottom-4 -right-4 w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center cursor-pointer shadow-xl hover:bg-indigo-500 transition-all active:scale-95 border-4 border-white">
                                    <Camera size={24} />
                                    <input type="file" className="hidden" accept="image/*" onChange={e => setPhoto(e.target.files[0])} />
                                </label>
                            </div>

                            <h2 className="text-3xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                {user.name}
                            </h2>
                            <span className="inline-block bg-indigo-50 text-indigo-600 text-[11px] font-bold px-6 py-2 rounded-full border border-indigo-100 mb-10">
                                {user.role.charAt(0) + user.role.slice(1).toLowerCase()} Account
                            </span>

                            <div className="space-y-6 text-left border-t border-slate-50 pt-10">
                                <div className="flex items-center gap-4 group/item">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover/item:text-indigo-600 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400">Email Address</span>
                                        <span className="text-[12px] font-bold text-slate-700 truncate max-w-[180px]">{user.email}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group/item">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover/item:text-indigo-600 transition-colors">
                                        <Phone size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400">Mobile Number</span>
                                        <span className="text-[12px] font-bold text-slate-700">{user.mobile || 'Not configured'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Matrix */}
                        <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-md">
                            <div className="flex items-center gap-3 mb-8">
                                <Shield className="text-indigo-600" size={18} />
                                <h3 className="text-[11px] font-bold text-slate-400">Security Settings</h3>
                            </div>
                            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all text-sm flex items-center justify-center gap-3">
                                <Lock size={16} /> Change password
                            </button>
                        </div>
                    </div>

                    {/* Technical Profile Config */}
                    <div className="flex-1 space-y-10">
                        <div className="p-12 bg-white rounded-[3rem] border border-slate-100 shadow-2xl relative overflow-hidden group">
                            <div className="flex justify-between items-center mb-16 px-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-10 bg-indigo-500 rounded-full"></div>
                                    <h1 className="text-4xl font-bold text-slate-900 leading-none">
                                        Account <span className="text-indigo-600">Settings</span>
                                    </h1>
                                </div>
                                <button
                                    onClick={() => setEditing(!editing)}
                                    className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-[11px] font-bold border transition-all shadow-sm h-11 ${editing
                                        ? 'bg-rose-50 text-rose-600 border-rose-100'
                                        : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                        }`}
                                >
                                    {editing ? <><X size={16} /> Cancel</> : <><Edit2 size={16} /> Edit Profile</>}
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="col-span-full group/field">
                                    <label className="text-[11px] font-bold text-slate-400 mb-4 block px-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-indigo-600 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            className={`w-full bg-slate-50 border rounded-3xl py-6 h-16 pl-16 pr-8 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 transition-all ${editing
                                                ? 'border-indigo-100 ring-indigo-600/5 cursor-text'
                                                : 'border-slate-100 cursor-not-allowed opacity-50'
                                                }`}
                                            disabled={!editing}
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter name..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[11px] font-bold text-slate-400 mb-4 block px-1">Core email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-5 px-8 text-sm font-bold text-slate-400 cursor-not-allowed"
                                        disabled
                                        value={formData.email}
                                    />
                                    <p className="text-[10px] text-slate-400 font-bold px-1">Contact your admin to change email</p>
                                </div>

                                <div className="space-y-3 group/field">
                                    <label className="text-[11px] font-bold text-slate-400 mb-4 block px-1">Mobile Number</label>
                                    <input
                                        type="text"
                                        className={`w-full bg-slate-50 border rounded-[2rem] py-5 px-8 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 transition-all ${editing
                                            ? 'border-indigo-100 ring-indigo-600/5 cursor-text'
                                            : 'border-slate-100 cursor-not-allowed opacity-50'
                                            }`}
                                        disabled={!editing}
                                        value={formData.mobile}
                                        onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                                        placeholder="+X XXX XXX XXXX"
                                    />
                                </div>

                                {user.role === 'TEACHER' && (
                                    <>
                                        <div className="col-span-full pt-10 border-t border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <Award className="text-indigo-600" size={18} />
                                                <h3 className="text-[11px] font-bold text-slate-400">Teacher Professional Data</h3>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-bold text-slate-400 mb-4 block px-1">Specialization</label>
                                            <input
                                                type="text"
                                                className={`w-full bg-slate-50 border rounded-[2rem] py-5 px-8 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 transition-all ${editing
                                                    ? 'border-indigo-100 ring-indigo-600/5 cursor-text'
                                                    : 'border-slate-100 cursor-not-allowed opacity-50'
                                                    }`}
                                                disabled={!editing}
                                                value={formData.specialization}
                                                onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                                                placeholder="e.g. Quantum Computing..."
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-bold text-slate-400 mb-4 block px-1">Years of Experience</label>
                                            <input
                                                type="number"
                                                className={`w-full bg-slate-50 border rounded-[2rem] py-5 px-8 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 transition-all ${editing
                                                    ? 'border-indigo-100 ring-indigo-600/5 cursor-text'
                                                    : 'border-slate-100 cursor-not-allowed opacity-50'
                                                    }`}
                                                disabled={!editing}
                                                value={formData.experience}
                                                onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                                placeholder="Experience level..."
                                            />
                                        </div>
                                    </>
                                )}

                                {editing && (
                                    <div className="col-span-full pt-16">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="group relative w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-[2.5rem] shadow-xl shadow-indigo-600/20 transition-all text-sm flex items-center justify-center gap-4 active:scale-95 overflow-hidden"
                                        >
                                            {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Changes</>}
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

