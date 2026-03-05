import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';
import { Spinner } from '../components/common/Spinner';
import { Bell, CheckCheck, Trash2, Calendar, Info, Zap, ChevronLeft, Inbox, ShieldAlert, Archive, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.data.notifications);
        } catch (e) {
            toast.error('COMMUNICATION RETRIEVAL FAILURE');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (e) { toast.error('PROTOCOL UPDATE FAILURE'); }
    };

    const markAllRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            toast.success('ALL PROTOCOLS MARKED AS RESOLVED');
        } catch (e) { toast.error('GLOBAL UPDATE FAILURE'); }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a]">
            <div className="w-16 h-16 relative mb-4">
                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">Scanning Transmission Frequencies...</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 animate-fade-in-up">
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors">
                            <ChevronLeft size={14} /> EXIT INTERFACE
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                            COMM <span className="text-indigo-500">MATRIX</span>
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">SECURE INBOUND TRANSMISSIONS</p>
                    </div>
                    {notifications.some(n => !n.read) && (
                        <button
                            onClick={markAllRead}
                            className="group flex items-center gap-3 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-indigo-500/20 active:scale-95 shadow-2xl shadow-indigo-500/10"
                        >
                            <CheckCheck size={18} className="group-hover:scale-110 transition-transform" /> CLEAR SYSTEM DASH
                        </button>
                    )}
                </div>

                <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {notifications.length > 0 ? notifications.map((notif, i) => (
                        <div
                            key={notif._id}
                            className={`group relative p-8 rounded-[2.5rem] border transition-all flex flex-col md:flex-row gap-8 items-start overflow-hidden ${notif.read
                                ? 'bg-slate-900/10 border-white/[0.03] opacity-60 grayscale hover:grayscale-0 transition-all duration-700'
                                : 'bg-slate-900/40 border-indigo-500/20 shadow-3xl'
                                }`}
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            {!notif.read && (
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 animate-pulse"></div>
                            )}

                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform duration-500 group-hover:scale-110 ${notif.read
                                ? 'bg-slate-950 text-slate-700'
                                : 'bg-indigo-500/10 text-indigo-400 shadow-2xl shadow-indigo-500/20'
                                }`}>
                                {notif.type === 'ALERT' ? <ShieldAlert size={28} /> : <Bell size={28} />}
                            </div>

                            <div className="flex-1 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${notif.read ? 'text-slate-700' : 'text-indigo-400'}`}>
                                        TRANSMISSION #{notif._id.slice(-6).toUpperCase()}
                                    </span>
                                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                        <Calendar size={12} className="text-slate-800" />
                                        {new Date(notif.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <h3 className={`text-xl font-black tracking-tight uppercase leading-none transition-colors ${notif.read ? 'text-slate-500' : 'text-white'}`}>
                                    {notif.title || 'INBOUND SIGNAL'}
                                </h3>
                                <p className={`text-sm font-bold uppercase tracking-wide leading-relaxed ${notif.read ? 'text-slate-600' : 'text-slate-400'}`}>
                                    {notif.message}
                                </p>

                                {!notif.read && (
                                    <button
                                        onClick={() => markAsRead(notif._id)}
                                        className="mt-6 flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors group/btn"
                                    >
                                        <Archive size={14} className="group-hover/btn:rotate-12 transition-transform" /> ACKNOWLEDGE PROTOCOL
                                    </button>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="p-24 bg-slate-900/20 rounded-[4rem] border border-white/5 border-dashed text-center flex flex-col items-center justify-center group pointer-events-none">
                            <div className="relative mb-10">
                                <div className="absolute inset-0 bg-slate-500 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                                <Inbox size={80} className="relative text-slate-800 group-hover:text-slate-700 transition-colors duration-1000" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-700 tracking-tighter uppercase mb-4">MATRIX SILENCE</h3>
                            <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em]">ALL INBOUND FREQUENCIES CLEAR</p>
                        </div>
                    )}
                </div>

                <div className="mt-20 p-10 rounded-[2.5rem] bg-indigo-600/5 backdrop-blur-xl flex flex-col md:flex-row items-center gap-8 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full"></div>
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 flex-shrink-0 group-hover:rotate-12 transition-transform">
                        <Info size={32} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                            SYSTEM ARCHIVE PROTOCOL:
                        </p>
                        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider leading-relaxed mt-2">
                            TRANSMISSIONS ARE AUTOMATICALLY PURGED EVERY 30 DAYS TO MAINTAIN DATABASE EFFICIENCY. CONFIGURE FREQUENCIES IN <Link to="/profile" className="text-indigo-500 hover:text-white transition-colors underline decoration-indigo-500/30">IDENTITY MATRIX SETTINGS</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
