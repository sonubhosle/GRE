import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Zap, ArrowRight, Shield, Globe } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-slate-100 pt-32 pb-16 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/[0.02] blur-[150px] rounded-full -ml-64 -mb-64"></div>

            <div className="max-w-7xl mx-auto px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                    {/* Brand */}
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                                <Zap size={22} className="text-white fill-current" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">
                                Cours<span className="text-indigo-600">ify</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
                            Elevate your cognitive hardware with the world's most advanced e-learning ecosystem. Precision training for elite achievers.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600/30 transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* platform */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-900 mb-10">Platform architecture</h4>
                        <ul className="space-y-5">
                            {['Academy Directory', 'Elite Categories', 'Instructor Portal', 'Revenue Dashboard'].map(item => (
                                <li key={item}>
                                    <Link to="#" className="text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium flex items-center gap-2 group">
                                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* support */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-900 mb-10">Core support</h4>
                        <ul className="space-y-5">
                            {['Technical Hub', 'Service Protocol', 'Privacy Shield', 'Contact Secure'].map(item => (
                                <li key={item}>
                                    <Link to="#" className="text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium flex items-center gap-2 group">
                                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* newsletter */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-900 mb-10">Intelligence updates</h4>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">Subscribe to receive high-signal intelligence and protocol updates.</p>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Protocol email"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-6 pr-14 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/30 transition-all font-bold"
                            />
                            <button className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 transition-all shadow-lg active:scale-90">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-16 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-bold text-slate-400 font-sans">
                        © {new Date().getFullYear()} Coursify core. Protocol active.
                    </p>
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                            <Globe size={14} className="text-indigo-600/50" /> V2.5.0-STABLE
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                            <Shield size={14} className="text-emerald-600/50" /> AES-256 ENCRYPTED
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

