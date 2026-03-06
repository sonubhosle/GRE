import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ShieldCheck, Mail, ArrowLeft, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const PendingVerification = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full space-y-8 animate-fade-in-up">
                {/* Icon Circle */}
                <div className="relative mx-auto w-24 h-24 mb-10">
                    <div className="absolute inset-0 bg-indigo-50 rounded-[2.5rem] animate-pulse"></div>
                    <div className="relative flex items-center justify-center h-full text-indigo-600">
                        <Clock size={48} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-slate-900 leading-tight">Verification <span className="text-indigo-600">Pending</span></h1>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed">
                        Hello {user?.name.split(' ')[0]}, your mentor account is currently being reviewed by our administrative team.
                    </p>
                </div>

                <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 space-y-6 text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500 opacity-[0.03] rounded-full -mr-12 -mt-12 blur-2xl group-hover:opacity-[0.05] transition-opacity"></div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 shadow-sm flex-shrink-0">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm mb-1 text-capitalize">Quality Audit</p>
                            <p className="text-xs text-slate-500 font-medium">We're verifying your professional background and specialization details.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 shadow-sm flex-shrink-0">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm mb-1 text-capitalize">Email Notification</p>
                            <p className="text-xs text-slate-500 font-medium">You'll receive a confirmation email at <span className="text-indigo-600 font-bold">{user?.email}</span> once approved.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-8 space-y-4">
                    <p className="text-xs font-bold text-slate-400">Typical wait time: 24-48 business hours</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl shadow-slate-200 text-sm flex items-center justify-center gap-2 active:scale-95">
                            <ArrowLeft size={18} /> Back to Home
                        </Link>
                        <button
                            onClick={() => dispatch(logout())}
                            className="flex-1 bg-white border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-100 font-bold py-4 px-6 rounded-2xl transition-all text-sm flex items-center justify-center gap-2 active:scale-95 hover:bg-rose-50"
                        >
                            <LogOut size={18} /> Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-20 text-[10px] font-bold text-slate-300 tracking-[0.2em] text-capitalize">
                © 2026 Coursify Portal • Security Guaranteed
            </div>
        </div>
    );
};

export default PendingVerification;
