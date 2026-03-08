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
            await api.patch('/notifications/mark-all-read');
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            toast.success('ALL PROTOCOLS MARKED AS RESOLVED');
        } catch (e) { toast.error('GLOBAL UPDATE FAILURE'); }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
            toast.success('TRANSMISSION PURGED');
        } catch (e) { toast.error('DELETION PROTOCOL FAILURE'); }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-16 h-16 relative mb-4">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 animate-pulse uppercase tracking-widest">Scanning transmission frequencies...</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 animate-fade-in-up">
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                            <ChevronLeft size={14} /> Exit interface
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-none">
                            Comm <span className="text-indigo-600">Matrix</span>
                        </h1>
                        <p className="text-slate-400 font-semibold text-[10px] uppercase tracking-[0.2em]">Secure inbound transmissions</p>
                    </div>
                    {notifications.some(n => !n.read) && (
                        <button
                            onClick={markAllRead}
                            className="group flex items-center gap-3 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white px-8 py-4 rounded-2xl text-[10px] font-bold transition-all border border-indigo-100 active:scale-95 shadow-lg shadow-indigo-600/10 uppercase tracking-widest"
                        >
                            <CheckCheck size={18} className="group-hover:scale-110 transition-transform" /> Clear system dash
                        </button>
                    )}
                </div>

                <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {notifications.length > 0 ? notifications.map((notif, i) => (
                        <div
                            key={notif._id}
                            className={`group relative p-6 rounded-[2rem] border transition-all flex flex-col md:flex-row gap-6 items-start overflow-hidden ${notif.read
                                ? 'bg-white border-slate-50 opacity-70 grayscale hover:grayscale-0 transition-all duration-700'
                                : 'bg-white border-indigo-100 shadow-xl'
                                }`}
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            {!notif.read && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 animate-pulse"></div>
                            )}

                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-500 group-hover:scale-110 ${notif.read
                                ? 'bg-slate-50 text-slate-300'
                                : 'bg-indigo-50 text-indigo-600 shadow-lg shadow-indigo-600/5'
                                }`}>
                                {notif.type === 'ALERT' ? <ShieldAlert size={20} /> : <Bell size={20} />}
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${notif.read ? 'text-slate-300' : 'text-indigo-600'}`}>
                                        #{notif._id.slice(-6).toUpperCase()}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase">
                                            <Calendar size={12} className="text-slate-200" />
                                            {new Date(notif.createdAt).toLocaleDateString()}
                                        </div>
                                        <button
                                            onClick={() => deleteNotification(notif._id)}
                                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                            title="Delete transmission"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className={`text-lg font-semibold tracking-tight transition-colors ${notif.read ? 'text-slate-300' : 'text-slate-900'}`}>
                                    {notif.title || 'Inbound Signal'}
                                </h3>
                                <p className={`text-sm font-medium leading-relaxed ${notif.read ? 'text-slate-300' : 'text-slate-500'}`}>
                                    {notif.message}
                                </p>

                                {!notif.read && (
                                    <button
                                        onClick={() => markAsRead(notif._id)}
                                        className="mt-4 flex items-center gap-2 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors group/btn uppercase tracking-widest"
                                    >
                                        <Archive size={14} className="group-hover/btn:rotate-12 transition-transform" /> Acknowledge Protocol
                                    </button>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="p-20 bg-white rounded-[4rem] border border-slate-100 border-dashed text-center flex flex-col items-center justify-center group pointer-events-none">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-slate-500 blur-3xl opacity-5 transition-opacity"></div>
                                <Inbox size={60} className="relative text-slate-100 group-hover:text-slate-200 transition-colors duration-1000" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-200 tracking-tight mb-2">Matrix Silence</h3>
                            <p className="text-[10px] font-semibold text-slate-100 uppercase tracking-widest">All inbound frequencies clear</p>
                        </div>
                    )}
                </div>

                <div className="mt-16 p-8 rounded-[2rem] bg-indigo-50 flex flex-col md:flex-row items-center gap-6 border border-indigo-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-[40px] rounded-full"></div>
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-indigo-600 flex-shrink-0 group-hover:rotate-12 transition-transform shadow-sm">
                        <Info size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            System Archive Protocol:
                        </p>
                        <p className="text-[11px] font-medium text-slate-500 leading-relaxed mt-1">
                            Transmissions are automatically purged periodically to maintain database efficiency. Configure frequencies in your <Link to="/profile" className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors underline decoration-indigo-600/30">identity matrix</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
