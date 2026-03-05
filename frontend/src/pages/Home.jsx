import { Link } from 'react-router-dom';
import { PlayCircle, Star, Users, BookOpen, User, ChevronRight, ArrowRight, Zap, Target, Award, Globe } from 'lucide-react';

const Home = () => {
    return (
        <div className="bg-[#0f172a] text-slate-200 min-h-screen overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-0 -ml-40 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                                <Zap size={14} className="fill-current" />
                                Revolutionizing Education 2.0
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8 text-white">
                                MASTER THE <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">FUTURE</span>
                            </h1>

                            <p className="text-slate-400 text-lg md:text-xl font-medium mb-10 max-w-xl leading-relaxed">
                                Join an elite community of 500k+ learners. Access immersive, industry-grade courses designed to catapult your career into the stratosphere.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5">
                                <Link to="/courses" className="group relative flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-indigo-500/25 active:scale-95">
                                    Start Learning Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/become-teacher" className="flex items-center justify-center gap-3 bg-slate-900 border border-white/10 hover:border-white/20 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all backdrop-blur-xl">
                                    Apply as Instructor
                                </Link>
                            </div>

                            <div className="mt-16 flex flex-wrap items-center gap-10 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-6" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-6" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix" className="h-6" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg" alt="Slack" className="h-6" />
                            </div>
                        </div>

                        <div className="relative animate-fade-in-up lg:block hidden" style={{ animationDelay: '0.2s' }}>
                            <div className="relative z-10 p-4 bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-3xl group">
                                <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] bg-slate-800">
                                    <img
                                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
                                        alt="Learning platform interface"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <button className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-indigo-600 transition-all hover:scale-110 shadow-2xl group/play">
                                            <PlayCircle size={48} className="fill-current" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Analytics Card */}
                            <div className="absolute -bottom-10 -left-10 p-8 bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl animate-bounce-slow">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                                        <Target size={28} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black text-white tracking-tighter">98%</p>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Success Rate</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Metrics Section */}
            <section className="py-32 bg-slate-950/50 backdrop-blur-md border-y border-white/5 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-24">
                        {[
                            { icon: BookOpen, label: 'Curated Courses', val: '12K+', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                            { icon: Users, label: 'Global Students', val: '500K+', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                            { icon: Award, label: 'Certifications', val: '85K+', color: 'text-pink-400', bg: 'bg-pink-500/10' },
                            { icon: Star, label: 'Top Rating', val: '4.9/5', color: 'text-amber-400', bg: 'bg-amber-500/10' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-white/5`}>
                                    <stat.icon size={28} />
                                </div>
                                <h3 className="text-4xl font-black text-white mb-2 tracking-tighter">{stat.val}</h3>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 animate-fade-in-up">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Globe className="w-5 h-5 text-indigo-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Industry Segments</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
                            ELITE <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">CATEGORIES</span>
                        </h2>
                    </div>
                    <Link to="/courses" className="group flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-widest text-[11px] hover:text-white transition-colors">
                        Explore Full Directory
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { title: 'Development', desc: 'Build scalable apps with React, Node, and Python.', slug: 'Development', icon: '💻' },
                        { title: 'Design', desc: 'Master UI/UX, Motion, and Visual Communication.', slug: 'Design', icon: '🎨' },
                        { title: 'Marketing', desc: 'Growth hacking and performance marketing strategies.', slug: 'Marketing', icon: '📈' },
                        { title: 'Business', desc: 'Leadership, management, and financial modeling.', slug: 'Business', icon: '💼' },
                        { title: 'Photography', desc: 'Cinematic lighting and professional editing.', slug: 'Photography', icon: '📸' },
                        { title: 'Music', desc: 'Sound engineering and digital production.', slug: 'Music', icon: '🎵' },
                    ].map((cat, i) => (
                        <Link
                            key={cat.title}
                            to={`/courses?category=${cat.slug}`}
                            className="group p-10 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-indigo-500/30 transition-all duration-500 shadow-xl"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <div className="text-4xl mb-8 group-hover:scale-125 transition-transform duration-500 inline-block">{cat.icon}</div>
                            <h4 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-indigo-400 transition-colors uppercase">{cat.title}</h4>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed group-hover:text-slate-400 transition-colors">{cat.desc}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Cinematic CTA */}
            <section className="py-32 container px-4">
                <div className="relative rounded-[4rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden shadow-2xl shadow-indigo-500/20 transition-transform hover:scale-[1.01] duration-700">
                    <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px]"></div>
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                    <div className="relative z-10 py-24 text-center max-w-3xl mx-auto px-6">
                        <h2 className="text-5xl md:text-7xl font-black mb-8 text-white tracking-tighter leading-none uppercase">
                            Your Elite <br /> Journey Starts <span className="text-slate-950">NOW</span>
                        </h2>
                        <p className="text-white/90 text-lg md:text-xl font-medium mb-12 leading-relaxed">
                            Join the ranks of thousands already mastering industry-standard skills. No barriers, just growth.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link to="/register" className="bg-white text-slate-900 hover:bg-slate-50 px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3">
                                Initialize Account <ArrowRight size={18} />
                            </Link>
                            <Link to="/courses" className="bg-slate-950/30 text-white border border-white/30 hover:bg-slate-950/50 px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all backdrop-blur-md flex items-center justify-center">
                                Browse directory
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

