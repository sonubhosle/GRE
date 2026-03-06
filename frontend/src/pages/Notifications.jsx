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
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-16 h-16 relative mb-4">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
            <span className="text-[11px] font-bold text-slate-400 animate-pulse">Scanning transmission frequencies...</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 animate-fade-in-up">
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                            <ChevronLeft size={14} /> Exit interface
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-none">
                            Comm <span className="text-indigo-600">matrix</span>
                        </h1>
                        <p className="text-slate-400 font-bold text-xs">Secure inbound transmissions</p>
                    </div>
                    {notifications.some(n => !n.read) && (
                        <button
                            onClick={markAllRead}
                            className="group flex items-center gap-3 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white px-8 py-4 rounded-2xl text-[11px] font-bold transition-all border border-indigo-100 active:scale-95 shadow-lg shadow-indigo-600/10"
                        >
                            <CheckCheck size={18} className="group-hover:scale-110 transition-transform" /> Clear system dash
                        </button>
                    )}
                </div>

                <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {notifications.length > 0 ? notifications.map((notif, i) => (
                        <div
                            key={notif._id}
                            className={`group relative p-8 rounded-[2.5rem] border transition-all flex flex-col md:flex-row gap-8 items-start overflow-hidden ${notif.read
                                ? 'bg-white border-slate-50 opacity-60 grayscale hover:grayscale-0 transition-all duration-700'
                                : 'bg-white border-indigo-100 shadow-2xl'
                                }`}
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            {!notif.read && (
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 animate-pulse"></div>
                            )}

                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform duration-500 group-hover:scale-110 ${notif.read
                                ? 'bg-slate-50 text-slate-300'
                                : 'bg-indigo-50 text-indigo-600 shadow-lg shadow-indigo-600/10'
                                }`}>
                                {notif.type === 'ALERT' ? <ShieldAlert size={28} /> : <Bell size={28} />}
                            </div>

                            <div className="flex-1 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className={`text-[11px] font-bold ${notif.read ? 'text-slate-300' : 'text-indigo-600'}`}>
                                        Transmission #{notif._id.slice(-6).toUpperCase()}
                                    </span>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                        <Calendar size={12} className="text-slate-200" />
                                        {new Date(notif.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <h3 className={`text-xl font-bold tracking-tight transition-colors ${notif.read ? 'text-slate-300' : 'text-slate-900'}`}>
                                    {notif.title || 'Inbound signal'}
                                </h3>
                                <p className={`text-sm font-bold leading-relaxed ${notif.read ? 'text-slate-300' : 'text-slate-500'}`}>
                                    {notif.message}
                                </p>

                                {!notif.read && (
                                    <button
                                        onClick={() => markAsRead(notif._id)}
                                        className="mt-6 flex items-center gap-2 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors group/btn"
                                    >
                                        <Archive size={14} className="group-hover/btn:rotate-12 transition-transform" /> Acknowledge protocol
                                    </button>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="p-24 bg-white rounded-[4rem] border border-slate-100 border-dashed text-center flex flex-col items-center justify-center group pointer-events-none">
                            <div className="relative mb-10">
                                <div className="absolute inset-0 bg-slate-500 blur-3xl opacity-5 transition-opacity"></div>
                                <Inbox size={80} className="relative text-slate-100 group-hover:text-slate-200 transition-colors duration-1000" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-200 tracking-tight mb-4">Matrix silence</h3>
                            <p className="text-[11px] font-bold text-slate-100">All inbound frequencies clear</p>
                        </div>
                    )}
                </div>

                <div className="mt-20 p-10 rounded-[2.5rem] bg-indigo-50 flex flex-col md:flex-row items-center gap-8 border border-indigo-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full"></div>
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-indigo-600 flex-shrink-0 group-hover:rotate-12 transition-transform shadow-sm">
                        <Info size={32} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 leading-relaxed">
                            System archive protocol:
                        </p>
                        <p className="text-[11px] font-bold text-slate-500 leading-relaxed mt-2">
                            Transmissions are automatically purged every 30 days to maintain database efficiency. Configure frequencies in <Link to="/profile" className="text-indigo-600 hover:text-indigo-800 transition-colors underline decoration-indigo-600/30">identity matrix settings</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
