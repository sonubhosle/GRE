import { Link } from 'react-router-dom';
import { PlayCircle, Star, Users, BookOpen, User, ChevronRight, ArrowRight, Zap, Target, Award, Globe } from 'lucide-react';

const Home = () => {
    return (
        <div className="bg-white text-slate-900 min-h-screen overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-indigo-600/[0.03] blur-[150px] rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-0 -ml-40 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/[0.03] blur-[150px] rounded-full"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[11px] font-bold mb-8">
                                <Zap size={14} className="fill-current" />
                                Revolutionizing Education 2.0
                            </div>

                            <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] mb-8 text-slate-900">
                                Master the <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Future</span>
                            </h1>

                            <p className="text-slate-400 text-lg md:text-xl font-medium mb-10 max-w-xl leading-relaxed">
                                Join an elite community of 500k+ learners. Access immersive, industry-grade courses designed to catapult your career into the stratosphere.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5">
                                <Link to="/courses" className="group relative flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl font-bold text-sm transition-all shadow-2xl shadow-indigo-500/25 active:scale-95">
                                    Start learning now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/become-teacher" className="flex items-center justify-center gap-3 bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-900 px-10 py-5 rounded-2xl font-bold text-sm transition-all backdrop-blur-xl">
                                    Apply as instructor
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
                            <div className="relative z-10 p-4 bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-slate-200 shadow-3xl group">
                                <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] bg-slate-100">
                                    <img
                                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
                                        alt="Learning platform interface"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-100/50 via-transparent to-transparent"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <button className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-indigo-600 transition-all hover:scale-110 shadow-2xl group/play">
                                            <PlayCircle size={48} className="fill-current" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Analytics Card */}
                            <div className="absolute -bottom-10 -left-10 p-8 bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-slate-200 shadow-2xl animate-bounce-slow">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                                        <Target size={28} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-slate-900 tracking-tight">98%</p>
                                        <p className="text-[11px] font-bold text-slate-400">Success rate</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Metrics Section */}
            <section className="py-32 bg-slate-50 backdrop-blur-md border-y border-slate-100 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-24">
                        {[
                            { icon: BookOpen, label: 'Curated courses', val: '12K+', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { icon: Users, label: 'Global students', val: '500K+', color: 'text-purple-600', bg: 'bg-purple-50' },
                            { icon: Award, label: 'Certifications', val: '85K+', color: 'text-pink-600', bg: 'bg-pink-50' },
                            { icon: Star, label: 'Top rating', val: '4.9/5', color: 'text-amber-600', bg: 'bg-amber-50' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-slate-100`}>
                                    <stat.icon size={28} />
                                </div>
                                <h3 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">{stat.val}</h3>
                                <p className="text-[11px] font-bold text-slate-400">{stat.label}</p>
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
                            <Globe className="w-5 h-5 text-indigo-600" />
                            <span className="text-[11px] font-bold text-slate-400">Industry segments</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                            Elite <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Categories</span>
                        </h2>
                    </div>
                    <Link to="/courses" className="group flex items-center gap-2 text-indigo-600 font-bold text-[12px] hover:text-indigo-700 transition-colors">
                        Explore full directory
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
                            className="group p-10 rounded-[2.5rem] bg-slate-50 backdrop-blur-xl border border-slate-100 hover:border-indigo-600/30 transition-all duration-500 shadow-sm hover:shadow-xl"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <div className="text-4xl mb-8 group-hover:scale-125 transition-transform duration-500 inline-block">{cat.icon}</div>
                            <h4 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">{cat.title}</h4>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed group-hover:text-slate-600 transition-colors">{cat.desc}</p>
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
                        <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white tracking-tight leading-none">
                            Your Elite <br /> Journey Starts Now
                        </h2>
                        <p className="text-white/90 text-lg md:text-xl font-medium mb-12 leading-relaxed">
                            Join the ranks of thousands already mastering industry-standard skills. No barriers, just growth.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link to="/register" className="bg-white text-slate-900 hover:bg-slate-50 px-12 py-6 rounded-[2rem] font-bold text-sm transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3">
                                Initialize account <ArrowRight size={18} />
                            </Link>
                            <Link to="/courses" className="bg-slate-950/30 text-white border border-white/30 hover:bg-slate-950/50 px-12 py-6 rounded-[2rem] font-bold text-sm transition-all backdrop-blur-md flex items-center justify-center">
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

