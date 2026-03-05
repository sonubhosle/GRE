import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchCourses } from '../features/courses/courseSlice';
import api from '../services/api';
import CourseCard from '../components/ui/CourseCard';
import { Spinner } from '../components/common/Spinner';
import { Filter, Search, X } from 'lucide-react';

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
        if (window.innerWidth < 768) setShowFilters(false);
    };

    const clearFilters = () => {
        const reset = { search: '', category: '', level: '', minPrice: '', maxPrice: '', rating: '' };
        setFilters(reset);
        setSearchParams({});
    };

    return (
        <div className="container py-12">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Sidebar Filters */}
                <aside className={`md:w-64 space-y-8 ${showFilters ? 'fixed inset-0 z-50 bg-bg-dark p-6 overflow-y-auto' : 'hidden md:block'}`}>
                    <div className="flex items-center justify-between mb-4 md:hidden">
                        <h3 className="text-xl font-bold">Filters</h3>
                        <button onClick={() => setShowFilters(false)} className="text-2xl"><X /></button>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-text-muted">Search</h4>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-text-muted w-4 h-4" />
                            <input
                                type="text"
                                className="input-field pl-10"
                                placeholder="Keywords..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-text-muted">Category</h4>
                        <select
                            className="input-field"
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-text-muted">Level</h4>
                        <div className="space-y-2">
                            {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                                <label key={l} className="flex items-center justify-between cursor-pointer group">
                                    <span className="text-sm text-text-muted group-hover:text-primary transition-colors">{l}</span>
                                    <input
                                        type="radio"
                                        name="level"
                                        className="accent-primary"
                                        checked={filters.level === l}
                                        onChange={() => handleFilterChange('level', l)}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-text-muted">Price Range</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                className="input-field p-2 text-xs"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                className="input-field p-2 text-xs"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-4 space-y-3">
                        <button onClick={applyFilters} className="btn-primary w-full justify-center">Apply Filters</button>
                        <button onClick={clearFilters} className="btn-secondary w-full justify-center border-none">Clear All</button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold">
                            {searchParams.get('search') ? `Results for "${searchParams.get('search')}"` : 'Discover Courses'}
                        </h1>
                        <button
                            onClick={() => setShowFilters(true)}
                            className="md:hidden flex items-center gap-2 btn-secondary px-4 h-10"
                        >
                            <Filter size={18} /> Filters
                        </button>
                    </div>

                    {loading ? (
                        <div className="h-96 flex items-center justify-center"><Spinner /></div>
                    ) : courses.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses.map(course => <CourseCard key={course._id} course={course} />)}
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.pages > 1 && (
                                <div className="mt-12 flex justify-center gap-2">
                                    {[...Array(pagination.pages)].map((_, i) => (
                                        <button
                                            key={i}
                                            className={`w-10 h-10 rounded-lg font-bold transition-all ${pagination.page === i + 1 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}
                                            onClick={() => setSearchParams({ ...Object.fromEntries([...searchParams]), page: i + 1 })}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-bg-card p-12 rounded-3xl border border-border text-center">
                            <Search size={64} className="text-text-muted mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">No courses found</h3>
                            <p className="text-text-muted mb-6">Try adjusting your filters or search terms.</p>
                            <button onClick={clearFilters} className="btn-primary">Reset All Filters</button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Courses;
