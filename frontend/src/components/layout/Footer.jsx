import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Zap, ArrowRight, Shield, Globe } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#0f172a] border-t border-white/5 pt-32 pb-16 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[150px] rounded-full -ml-64 -mb-64"></div>

            <div className="max-w-7xl mx-auto px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                    {/* Brand */}
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                                <Zap size={22} className="text-white fill-current" />
                            </div>
                            <span className="text-xl font-black text-white tracking-tighter uppercase">
                                COURS<span className="text-indigo-400">IFY</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
                            Elevate your cognitive hardware with the world's most advanced e-learning ecosystem. Precision training for elite achievers.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:border-indigo-500/30 transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* platform */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-10">Platform Architecture</h4>
                        <ul className="space-y-5">
                            {['Academy Directory', 'Elite Categories', 'Instructor Portal', 'Revenue Dashboard'].map(item => (
                                <li key={item}>
                                    <Link to="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm font-bold flex items-center gap-2 group">
                                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* support */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-10">Core Support</h4>
                        <ul className="space-y-5">
                            {['Technical Hub', 'Service Protocol', 'Privacy Shield', 'Contact Secure'].map(item => (
                                <li key={item}>
                                    <Link to="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm font-bold flex items-center gap-2 group">
                                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* newsletter */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-10">Intelligence Updates</h4>
                        <p className="text-slate-500 text-xs font-bold leading-relaxed mb-6">Subscribe to receive high-signal intelligence and protocol updates.</p>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Protocol Email"
                                className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 pl-6 pr-14 text-xs text-white placeholder-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all font-bold"
                            />
                            <button className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 transition-all shadow-lg active:scale-90">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest font-mono">
                        © {new Date().getFullYear()} COURSIFY CORE. PROTOCOL ACTIVE.
                    </p>
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <Globe size={14} className="text-indigo-500/50" /> V2.5.0-STABLE
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <Shield size={14} className="text-emerald-500/50" /> AES-256 ENCRYPTED
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

