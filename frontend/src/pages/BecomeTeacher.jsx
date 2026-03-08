import { Link } from 'react-router-dom';
import {
    Zap, Rocket, Target, Users, BookOpen,
    ChevronRight, ArrowRight, Shield, Globe,
    Wallet, Award, Star, CheckCircle2
} from 'lucide-react';

const BecomeTeacher = () => {
    return (
        <div className="bg-white text-slate-900 min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-slate-950">
                <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-indigo-600/20 blur-[150px] rounded-full"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-bold mb-8 uppercase tracking-[0.2em]">
                            <Rocket size={14} className="fill-current" />
                            Faculty Onboarding Open
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-[0.9]">
                            Empower the <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Next Generation</span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl font-medium mb-10 leading-relaxed">
                            Join the world's most advanced e-learning ecosystem. Share your expertise, build your brand, and earn high-yield revenue.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5 justify-center">
                            <Link to="/register?role=teacher" className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl font-bold text-sm transition-all shadow-2xl shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-3">
                                Start application <ArrowRight size={18} />
                            </Link>
                            <a href="#how-it-works" className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-bold text-sm transition-all backdrop-blur-xl flex items-center justify-center gap-3">
                                View requirements
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Propositions */}
            <section className="py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Wallet,
                                title: "Superior Revenue",
                                desc: "Keep up to 80% of your course earnings. Weekly payouts directly to your account with zero hidden fees.",
                                color: "text-emerald-500",
                                bg: "bg-emerald-50"
                            },
                            {
                                icon: Target,
                                title: "Global Reach",
                                desc: "Connect with over 500,000+ students across 120 countries. We handle the marketing, you handle the teaching.",
                                color: "text-indigo-500",
                                bg: "bg-indigo-50"
                            },
                            {
                                icon: Zap,
                                title: "Pro Infrastructure",
                                desc: "Access studio-grade course builders, analytics heatmaps, and AI-driven engagement tools.",
                                color: "text-amber-500",
                                bg: "bg-amber-50"
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                                <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                                    <item.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-24 items-center">
                        <div className="flex-1">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12 tracking-tight">
                                Simple Path to <br />
                                <span className="text-indigo-600">Becoming an Elite Mentor</span>
                            </h2>
                            <div className="space-y-10">
                                {[
                                    { step: "01", title: "Submit Application", desc: "Fill out your professional profile and share your teaching experience." },
                                    { step: "02", title: "Identity Verification", desc: "Brief KYC process to maintain platform integrity and security." },
                                    { step: "03", title: "Course Development", desc: "Use our blueprint tools to design and record your first masterclass." },
                                    { step: "04", title: "Global Launch", desc: "Go live, get featured, and start generating revenue instantly." }
                                ].map((s, i) => (
                                    <div key={i} className="flex gap-8 group">
                                        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-semibold text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            {s.step}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h4>
                                            <p className="text-slate-500 text-sm font-medium leading-relaxed">{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="relative p-4 bg-slate-50 rounded-[4rem] border border-slate-200">
                                <div className="rounded-[3.2rem] overflow-hidden aspect-video bg-white shadow-2xl relative group">
                                    <img
                                        src="https://images.unsplash.com/photo-1524178232363-1fb28f74b671?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        alt="Teaching"
                                    />
                                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-2xl hover:scale-110 transition-all cursor-pointer">
                                            <Zap size={32} className="fill-current" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-8 -right-8 p-8 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <Star size={24} className="fill-current" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-semibold text-slate-900">4.9/5</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instructor Satisfaction</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 px-4">
                <div className="max-w-7xl mx-auto rounded-[4rem] bg-indigo-600 p-24 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">Ready to build your <br /> educational empire?</h2>
                        <p className="text-indigo-100 text-lg font-medium mb-12 max-w-xl mx-auto">Applications are reviewed within 48 hours for top-tier candidates.</p>
                        <Link to="/register?role=teacher" className="bg-white text-indigo-600 hover:bg-slate-50 px-12 py-6 rounded-[2rem] font-bold text-sm transition-all shadow-3xl active:scale-95 inline-flex items-center gap-3">
                            Start teaching today <Rocket size={18} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BecomeTeacher;
