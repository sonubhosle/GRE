import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchCourses } from '../features/courses/courseSlice';
import api from '../services/api';
import CourseCard from '../components/ui/CourseCard';
import { Spinner } from '../components/common/Spinner';
import { Filter, Search, X, Layers, TrendingUp, DollarSign, Target, ChevronRight, Zap, Sparkles, SlidersHorizontal } from 'lucide-react';

const Courses = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { courses, loading, pagination } = useSelector((state) => state.courses);
    const [categories, setCategories] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    // Filter States
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        level: searchParams.get('level') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        rating: searchParams.get('rating') || '',
    });

    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data.data.categories);
            } catch (e) { }
        };
        getCategories();
    }, []);

    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);
        dispatch(fetchCourses(params));
    }, [searchParams, dispatch]);

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== '')
        );
        setSearchParams(cleanFilters);
        if (window.innerWidth < 1024) setShowFilters(false);
    };

    const clearFilters = () => {
        const reset = { search: '', category: '', level: '', minPrice: '', maxPrice: '', rating: '' };
        setFilters(reset);
        setSearchParams({});
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 font-sans pb-24">

            {/* Dynamic Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] max-w-7xl pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob"></div>
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000"></div>
                </div>

                <div className="container relative z-10 px-4 mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border rounded-full bg-white/5 border-white/10 backdrop-blur-md">
                        <Sparkles size={16} className="text-indigo-400" />
                        <span className="text-sm font-semibold tracking-wide text-slate-300">Transform Your Future</span>
                    </div>
                    <h1 className="mb-6 text-5xl font-black tracking-tight text-transparent lg:text-7xl bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500">
                        Master New Skills. <br className="hidden md:block" /> Elevate Your Career.
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg leading-relaxed text-slate-400 lg:text-xl">
                        Explore our world-class curriculum designed by industry experts. Find the perfect course to take your abilities to the next level.
                    </p>
                </div>

                {/* Decorative fade at bottom of hero */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020617] to-transparent pointer-events-none"></div>
            </div>

            <div className="container px-4 mx-auto mt-8">
                <div className="flex flex-col gap-12 lg:flex-row">

                    {/* Filter Sidebar - Glassmorphic */}
                    <aside className={`fixed inset-0 z-50 lg:relative lg:z-0 lg:w-[320px] shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                        {/* Mobile Overlay */}
                        <div
                            className={`fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                            onClick={() => setShowFilters(false)}
                        />

                        <div className="relative h-full lg:h-auto w-[85%] sm:w-[400px] lg:w-full bg-slate-900/60 lg:bg-slate-900/40 backdrop-blur-2xl border-r lg:border border-white/5 lg:rounded-[2.5rem] p-6 sm:p-8 overflow-y-auto custom-scrollbar shadow-2xl">

                            <div className="flex items-center justify-between mb-8">
                                <h3 className="flex items-center gap-2 text-xl font-black tracking-tighter text-white uppercase"><Filter size={20} className="text-indigo-400" /> Filters</h3>
                                <button onClick={() => setShowFilters(false)} className="p-2 transition-colors rounded-full lg:hidden bg-white/5 hover:bg-white/10 text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Search */}
                            <div className="mb-8">
                                <h4 className="flex items-center gap-2 mb-4 text-xs font-bold tracking-widest text-slate-500 uppercase"><Target size={14} /> Search</h4>
                                <div className="relative group">
                                    <div className="absolute inset-0 transition-opacity bg-indigo-500 rounded-xl blur-md opacity-20 group-focus-within:opacity-40 pointer-events-none"></div>
                                    <div className="relative flex items-center bg-slate-950/50 border border-white/10 rounded-xl overflow-hidden focus-within:border-indigo-500/50 transition-colors">
                                        <Search className="absolute left-4 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            className="w-full py-3.5 pl-11 pr-4 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none"
                                            placeholder="What do you want to learn?"
                                            value={filters.search}
                                            onChange={(e) => handleFilterChange('search', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="my-8 border-white/5" />

                            {/* Category */}
                            <div className="mb-8">
                                <h4 className="flex items-center gap-2 mb-4 text-xs font-bold tracking-widest text-slate-500 uppercase"><Layers size={14} /> Category</h4>
                                <div className="relative">
                                    <select
                                        className="w-full py-3.5 px-4 bg-slate-950/50 border border-white/10 rounded-xl text-sm text-slate-300 appearance-none outline-none focus:border-indigo-500/50 cursor-pointer transition-colors"
                                        value={filters.category}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                    >
                                        <option value="" className="bg-slate-900 text-slate-300">All Categories</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id} className="bg-slate-900 text-slate-300">{cat.name}</option>
                                        ))}
                                    </select>
                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none rotate-90" />
                                </div>
                            </div>

                            <hr className="my-8 border-white/5" />

                            {/* Level */}
                            <div className="mb-8">
                                <h4 className="flex items-center gap-2 mb-4 text-xs font-bold tracking-widest text-slate-500 uppercase"><TrendingUp size={14} /> Level</h4>
                                <div className="space-y-3">
                                    {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                                        <label key={l} className="flex items-center justify-between p-3 transition-colors border cursor-pointer group bg-slate-950/30 border-white/5 rounded-xl hover:border-indigo-500/30 hover:bg-indigo-500/5">
                                            <span className="text-sm font-medium transition-colors text-slate-400 group-hover:text-slate-200">{l}</span>
                                            <div className="relative flex items-center justify-center w-5 h-5 border rounded-full border-slate-600 bg-slate-900">
                                                <div className={`w-2.5 h-2.5 rounded-full bg-indigo-500 transition-all duration-300 ${filters.level === l ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
                                                <input
                                                    type="radio"
                                                    name="level"
                                                    className="absolute opacity-0"
                                                    checked={filters.level === l}
                                                    onChange={() => handleFilterChange('level', l)}
                                                />
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <hr className="my-8 border-white/5" />

                            {/* Price Range */}
                            <div className="mb-10">
                                <h4 className="flex items-center gap-2 mb-4 text-xs font-bold tracking-widest text-slate-500 uppercase"><DollarSign size={14} /> Price Range</h4>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-full group">
                                        <div className="absolute inset-0 transition-opacity bg-indigo-500/10 rounded-xl blur-sm opacity-20 group-focus-within:opacity-100 pointer-events-none"></div>
                                        <div className="relative flex items-center bg-slate-950/50 border border-white/10 rounded-xl overflow-hidden focus-within:border-indigo-500/50 transition-colors">
                                            <span className="pl-4 pr-1 text-slate-500 text-sm font-black">₹</span>
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                className="w-full py-3.5 pr-3 text-sm bg-transparent outline-none text-slate-300"
                                                value={filters.minPrice}
                                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-slate-500">-</span>
                                    <div className="relative w-full group">
                                        <div className="absolute inset-0 transition-opacity bg-indigo-500/10 rounded-xl blur-sm opacity-20 group-focus-within:opacity-100 pointer-events-none"></div>
                                        <div className="relative flex items-center bg-slate-950/50 border border-white/10 rounded-xl overflow-hidden focus-within:border-indigo-500/50 transition-colors">
                                            <span className="pl-4 pr-1 text-slate-500 text-sm font-black">₹</span>
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                className="w-full py-3.5 pr-3 text-sm bg-transparent outline-none text-slate-300"
                                                value={filters.maxPrice}
                                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="sticky bottom-0 left-0 right-0 py-4 mt-auto space-y-3 lg:bg-transparent lg:static border-t lg:border-none border-white/5 z-10 bg-slate-900/90 backdrop-blur-md lg:backdrop-blur-none lg:p-0 px-2 rounded-xl lg:rounded-none">
                                <button
                                    onClick={applyFilters}
                                    className="relative flex items-center justify-center w-full gap-2 py-4 text-sm font-bold text-white uppercase transition-all duration-300 rounded-xl bg-indigo-600 hover:bg-indigo-500 tracking-widest overflow-hidden group shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-95"
                                >
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full duration-1000"></div>
                                    <Zap size={16} className="fill-current" /> Apply Filters
                                </button>
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center justify-center w-full gap-2 py-3.5 text-sm font-bold tracking-widest text-slate-400 uppercase transition-colors rounded-xl hover:text-white hover:bg-white/5 active:scale-95"
                                >
                                    Reset All
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">

                        {/* Course Header & Mobile Trigger */}
                        <div className="flex items-end justify-between mb-10 pb-6 border-b border-white/5">
                            <div>
                                <h2 className="text-3xl font-black text-white tracking-tighter mb-2">
                                    {searchParams.get('search') ? `Results for "${searchParams.get('search')}"` : 'All Courses'}
                                </h2>
                                <p className="text-slate-500 text-sm font-medium">
                                    {loading ? 'Searching catalog...' : `${courses?.length || 0} ${courses?.length === 1 ? 'course' : 'courses'} found`}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowFilters(true)}
                                className="flex lg:hidden items-center gap-2 px-5 py-3 text-sm font-bold text-slate-200 transition-all border rounded-xl bg-slate-800/50 border-white/10 hover:border-indigo-500/50 active:scale-95"
                            >
                                <SlidersHorizontal size={16} /> <span className="uppercase tracking-widest text-xs hidden sm:inline">Filter</span>
                            </button>
                        </div>

                        {/* Course Grid */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 mt-12 bg-slate-900/20 backdrop-blur-xl border border-white/5 rounded-[3rem]">
                                <div className="w-16 h-16 mb-6 text-indigo-500">
                                    <Spinner />
                                </div>
                                <p className="text-sm font-bold tracking-widest text-slate-500 uppercase animate-pulse">Loading amazing courses...</p>
                            </div>
                        ) : courses?.length > 0 ? (
                            <div className="space-y-16">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
                                    {courses.map((course, i) => (
                                        <div key={course._id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${(i % 10) * 100}ms` }}>
                                            <CourseCard course={course} />
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination && pagination.pages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-16 pt-8 border-t border-white/5">
                                        {[...Array(pagination.pages)].map((_, i) => (
                                            <button
                                                key={i}
                                                className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-sm transition-all duration-300 ${pagination.page === i + 1
                                                        ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] scale-110'
                                                        : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-white border border-white/5 hover:border-white/10'
                                                    }`}
                                                onClick={() => {
                                                    setSearchParams({ ...Object.fromEntries([...searchParams]), page: i + 1 });
                                                    window.scrollTo({ top: 300, behavior: 'smooth' });
                                                }}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 text-center rounded-[3rem] bg-slate-900/20 border border-white/5 backdrop-blur-sm">
                                <div className="flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-slate-800/50 text-slate-500 border border-white/5 shadow-inner">
                                    <Search size={32} />
                                </div>
                                <h3 className="mb-3 text-2xl font-black text-white tracking-tight">No courses found</h3>
                                <p className="max-w-md mb-8 text-slate-400 leading-relaxed">
                                    We couldn't find any courses matching your current filters. Try adjusting your search keywords or clearing some filters.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="px-8 py-4 text-sm font-bold tracking-widest text-white uppercase transition-all duration-300 rounded-xl bg-slate-800 hover:bg-slate-700 hover:shadow-xl active:scale-95 border border-white/5"
                                >
                                    Reset All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Courses;
