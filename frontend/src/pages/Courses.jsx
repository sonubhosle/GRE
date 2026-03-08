import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchCourses } from '../features/courses/courseSlice';
import api from '../services/api';
import CourseCard from '../components/ui/CourseCard';
import { Filter, Search, X, GraduationCap, Loader2, ChevronRight, Zap } from 'lucide-react';
import CustomDropdown from '../components/common/CustomDropdown';

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
        const reset = { search: '', category: '', level: '', minPrice: '', maxPrice: '' };
        setFilters(reset);
        setSearchParams({});
    };

    return (
        <div className="min-h-screen bg-[#fafbfc] py-10 px-6 ">
            <div className="">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Sidebar Filters */}
                    <aside className={`lg:w-80 flex-shrink-0 ${showFilters ? 'fixed inset-0 z-50 bg-white/98 backdrop-blur-2xl p-10 overflow-y-auto' : 'hidden lg:block'}`}>
                        <div className="flex items-center justify-between mb-12 lg:hidden">
                            <h3 className="text-3xl font-semibold text-slate-900 tracking-tight">Filters</h3>
                            <button onClick={() => setShowFilters(false)} className="w-14 h-14 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-95"><X /></button>
                        </div>

                        <div className="sticky top-28 space-y-14">
                            {/* Search Container */}
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div> Search Catalog
                                </h4>
                                <div className="relative group">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/20 transition-all font-medium"
                                        placeholder="What do you want to learn?"
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Category Navigator */}
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                                <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div> Categories
                                </h4>
                                <CustomDropdown
                                    options={[
                                        { value: '', label: 'All Specialties' },
                                        ...categories.map(cat => ({ value: cat._id, label: cat.name }))
                                    ]}
                                    value={filters.category}
                                    onChange={(val) => handleFilterChange('category', val)}
                                    placeholder="Select category"
                                />
                            </div>

                            {/* Difficulty Matrix */}
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                                <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div> Skill Level
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                                        <button
                                            key={l}
                                            onClick={() => handleFilterChange('level', filters.level === l ? '' : l)}
                                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group ${filters.level === l
                                                ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-600/20 translate-x-1'
                                                : 'bg-slate-50/50 border-slate-100 hover:border-indigo-600/30 text-slate-500'
                                                }`}
                                        >
                                            <span className={`text-xs font-semibold uppercase tracking-widest ${filters.level === l ? 'text-white' : 'group-hover:text-indigo-600'}`}>
                                                {l}
                                            </span>
                                            {filters.level === l && <CheckCircle2 size={16} className="text-white" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Architecture */}
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                                <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-600"></div> Pricing
                                </h4>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-[9px] uppercase tracking-widest">Min</span>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-4 pl-12 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all"
                                            value={filters.minPrice}
                                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                        />
                                    </div>
                                    <div className="relative flex-1">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-[9px] uppercase tracking-widest">Max</span>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-50/50 border border-slate-100 rounded-xl py-4 pl-12 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all"
                                            value={filters.maxPrice}
                                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Nexus */}
                            <div className="pt-4 space-y-4">
                                <button
                                    onClick={applyFilters}
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-5 rounded-[2rem] transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-3 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-indigo-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 opacity-20"></div>
                                    <Search size={18} />
                                    <span className="uppercase tracking-widest text-[11px]">Apply Filters</span>
                                </button>
                                <button
                                    onClick={clearFilters}
                                    className="w-full text-slate-400 hover:text-rose-500 font-semibold py-2 transition-all text-[10px] uppercase tracking-[0.3em]"
                                >
                                    Reset Discovery
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="mb-12">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                                            <GraduationCap size={20} />
                                        </div>
                                        <span className="text-[11px] font-semibold uppercase tracking-widest text-indigo-600">Explore catalog</span>
                                    </div>
                                    <h1 className="text-4xl  font-bold text-slate-900 tracking-tight leading-none">
                                        {searchParams.get('search') ? (
                                            <>Search items: <span className="text-indigo-600">"{searchParams.get('search')}"</span></>
                                        ) : (
                                            <>Find your <span className="text-indigo-600">expert</span> path</>
                                        )}
                                    </h1>
                                </div>
                                <button
                                    onClick={() => setShowFilters(true)}
                                    className="lg:hidden flex items-center gap-3 bg-white border border-slate-200 hover:border-indigo-600/30 text-slate-700 font-bold px-6 h-14 rounded-2xl transition-all shadow-sm active:scale-95"
                                >
                                    <Filter size={18} /> Filters
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="h-[60vh] flex flex-col items-center justify-center">
                                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                                <p className="text-slate-400 font-bold text-sm">Curating best courses...</p>
                            </div>
                        ) : courses.length > 0 ? (
                            <div className="animate-fade-in-up">
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 pb-12">
                                    {courses.map(course => <CourseCard key={course._id} course={course} />)}
                                </div>

                                {/* Pagination */}
                                {pagination && pagination.pages > 1 && (
                                    <div className="mt-16 flex items-center justify-center gap-3">
                                        {[...Array(pagination.pages)].map((_, i) => (
                                            <button
                                                key={i}
                                                className={`w-12 h-12 rounded-2xl font-semibold text-sm transition-all duration-300 ${pagination.page === i + 1
                                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 scale-110'
                                                    : 'bg-white text-slate-400 border border-slate-100 hover:border-indigo-600/30 hover:text-indigo-600 translate-y-0 hover:-translate-y-1'
                                                    }`}
                                                onClick={() => setSearchParams({ ...Object.fromEntries([...searchParams]), page: i + 1 })}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white p-24 rounded-[4rem] border border-slate-100 text-center animate-fade-in-up shadow-sm">
                                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-200 shadow-inner">
                                    <Search size={48} />
                                </div>
                                <h3 className="text-3xl font-bold mb-4 text-slate-900 tracking-tight">No results matched</h3>
                                <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed">We couldn't find any courses matching your current filters. Try resetting or using different keywords.</p>
                                <button onClick={clearFilters} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 px-12 rounded-3xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95">Reset all filters</button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Courses;