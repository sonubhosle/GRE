import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Star, Users, BookOpen, ChevronRight, ArrowRight, Zap, Target, Award, Globe,
    ArrowUpRight, Monitor, Palette, BarChart3, Briefcase, Camera, Music, GraduationCap
} from 'lucide-react';
import api from '../services/api';

const Home = () => {
    const [stats, setStats] = useState({ courses: 0, students: 0, teachers: 0, certificates: 0 });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, categoriesRes] = await Promise.all([
                    api.get('/public/stats'),
                    api.get('/categories')
                ]);
                setStats(statsRes.data.data || { courses: 0, students: 0, teachers: 0, certificates: 0 });
                setCategories(categoriesRes.data.data.categories || []);
            } catch (error) {
                console.error('Failed to fetch home data:', error);
                setStats({ courses: 0, students: 0, teachers: 0, certificates: 0 });
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const categoryList = Array.isArray(categories) ? categories : [];

    return (
        <div className="bg-white text-slate-900 min-h-screen overflow-x-hidden">
            {/* Hero Section - Redesigned (Centered, Animated) */}
            <section className="relative py-15 overflow-hidden flex items-center justify-center text-center">
                {/* Dynamic Background Elements - Enhanced */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/[0.05] blur-[150px] rounded-full animate-pulse-slow"></div>
                <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-purple-600/[0.05] blur-[150px] rounded-full animate-bounce-slow"></div>

                {/* Floating Animated Blobs */}
                <div className="absolute top-40 left-20 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl animate-float"></div>
                <div className="absolute bottom-40 right-20 w-48 h-48 bg-pink-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] mb-10 shadow-sm animate-pulse">
                            <Zap size={14} className="fill-current" />
                            Next-Generation Intelligence Platform
                        </div>

                        <h1 className="text-7xl  font-semibold uppercase  mb-5 text-slate-900 r">
                            Master the <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x">Future</span>
                        </h1>

                        <p className="text-slate-400 text-lg md:text-2xl font-medium mb-12 max-w-3xl mx-auto leading-relaxed">
                            Access immersive, industry-grade courses designed to catapult your career into the stratosphere. Join an elite community of high-achievers.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Link to="/courses" className="group relative flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-6 rounded-[2rem] font-semibold text-sm transition-all shadow-2xl shadow-indigo-500/25 active:scale-95">
                                Start learning now
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <Link to="/become-teacher" className="flex items-center justify-center gap-3 bg-slate-50 border border-slate-200 hover:border-indigo-600/30 hover:bg-indigo-50 text-slate-900 px-12 py-6 rounded-[2rem] font-semibold text-sm transition-all backdrop-blur-xl group">
                                Apply as instructor
                                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                            </Link>
                        </div>

                        <div className="mt-24 flex flex-wrap justify-center items-center gap-12 sm:gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-6 sm:h-7" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-6 sm:h-7" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix" className="h-6 sm:h-7" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg" alt="Slack" className="h-6 sm:h-7" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Metrics Section - Real Stats */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
                        {[
                            { icon: BookOpen, label: 'Elite Courses', val: stats.courses, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { icon: Users, label: 'Global Minds', val: stats.students, color: 'text-purple-600', bg: 'bg-purple-50' },
                            { icon: GraduationCap, label: 'Expert Faculty', val: stats.teachers, color: 'text-pink-600', bg: 'bg-pink-50' },
                            { icon: Award, label: 'Certifications', val: stats.certificates, color: 'text-amber-600', bg: 'bg-amber-50' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center group p-8 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                                <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-slate-100 shadow-inner`}>
                                    <stat.icon size={28} />
                                </div>
                                <h3 className="text-5xl font-semibold text-slate-900 mb-2 tracking-tighter">
                                    {stat.val.toLocaleString()}{typeof stat.val === 'number' && i < 3 ? '+' : ''}
                                </h3>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Grid - Dynamic & Smaller Cards */}
            <section className="py-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 animate-fade-in-up">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-1 bg-indigo-600 rounded-full"></div>
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Industry Segments</span>
                        </div>
                        <h2 className="text-3xl  font-semibold  text-slate-900">
                            Elite <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Specializations</span>
                        </h2>
                    </div>
                    <Link to="/courses" className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
                        Expand All
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {categoryList.map((cat, i) => (
                        <Link
                            key={cat._id}
                            to={`/courses?category=${cat._id}`}
                            className="group p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-indigo-600/30 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 flex flex-col items-center text-center"
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            <h4 className="text-base font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors  truncate w-full">{cat.name}</h4>
                        </Link>
                    ))}

                    {categoryList.length === 0 && !loading && (
                        [1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-40 rounded-[2rem] bg-slate-50 animate-pulse border border-slate-100"></div>
                        ))
                    )}
                </div>
            </section>

            {/* Cinematic CTA */}
            <section className="py-32 container px-4 sm:px-6 lg:px-8 mx-auto">
                <div className="relative rounded-[4rem] bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-950 overflow-hidden shadow-2xl shadow-indigo-900/40 transition-transform hover:scale-[1.005] duration-700 group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>

                    <div className="relative z-10 py-32 text-center max-w-4xl mx-auto px-6">
                        <div className="mb-10 inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-200 text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur-md">
                            <Target size={14} className="text-indigo-400" />
                            Mission Protocol Active
                        </div>
                        <h2 className="text-5xl md:text-8xl font-semibold mb-10 text-white tracking-tighter leading-[0.85]">
                            Your Elite <br /> Journey <span className="text-indigo-400">Begins</span>
                        </h2>
                        <p className="text-indigo-100/60 text-lg md:text-xl font-medium mb-16 leading-relaxed max-w-2xl mx-auto">
                            Join the ranks of thousands already mastering industry-standard skills. No barriers, just growth.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                            <Link to="/register" className="bg-white text-indigo-950 hover:bg-indigo-50 px-14 py-6 rounded-[2rem] font-semibold text-sm transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 group/btn">
                                Initialize Account
                                <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                            </Link>
                            <Link to="/courses" className="bg-indigo-950/50 text-white border border-white/10 hover:bg-white/10 px-14 py-6 rounded-[2rem] font-semibold text-sm transition-all backdrop-blur-md flex items-center justify-center uppercase tracking-widest">
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
