import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import {
    Search, User, ShoppingCart, Bell, LogOut, LayoutDashboard,
    Menu, X, Zap, ChevronDown, UserCircle, Settings
} from 'lucide-react';
import { toast } from 'react-toastify';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { unreadCount } = useSelector((state) => (state.notifications || { unreadCount: 0 }));
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Session terminated successfully');
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsOpen(false);
        }
    };

    return (
        <nav className={`sticky top-0 z-[100] transition-all duration-500 w-full ${scrolled
            ? 'bg-white border-b border-slate-200 shadow-sm'
            : 'bg-white/90 backdrop-blur-md border-b border-slate-100'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                            <Zap size={22} className="text-white fill-current" />
                        </div>
                        <span className="text-xl font-semibold text-slate-900 tracking-tight">
                            Edu<span className="text-indigo-600">Platform</span>
                        </span>
                    </Link>

                    {/* Desktop Search & Menu */}
                    <div className="hidden md:flex items-center gap-8 flex-1 justify-center max-w-2xl px-12">
                        <form onSubmit={handleSearch} className="relative w-full group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for courses..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all font-semibold"
                            />
                        </form>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/courses" className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Academy</Link>

                        <div className="flex items-center gap-4">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/notifications" className="relative p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all border border-slate-200 group">
                                        <Bell size={18} className="text-slate-500 group-hover:text-indigo-600 transition-colors" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-[10px] font-semibold text-white rounded-full flex items-center justify-center border-2 border-white">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </Link>

                                    <div className="relative">
                                        <button
                                            onClick={() => setProfileOpen(!profileOpen)}
                                            onBlur={() => setTimeout(() => setProfileOpen(false), 200)}
                                            className="flex items-center gap-3 p-1.5 pr-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all border border-slate-200 group"
                                        >
                                            <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 group-hover:border-indigo-500/50 transition-colors">
                                                {user?.photo?.url ? (
                                                    <img src={user.photo.url} alt={user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-semibold">
                                                        {user?.name?.charAt(0) || <User size={14} />}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs font-semibold text-slate-700">{user?.name?.split(' ')[0]}</span>
                                            <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Profile Dropdown with Smooth Transition */}
                                        <div className={`absolute right-0 mt-4 w-64 py-3 bg-white rounded-2xl border border-slate-200 shadow-2xl transition-all duration-300 origin-top-right ${profileOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                            }`}>
                                            <div className="px-5 py-3 border-b border-slate-100 mb-2">
                                                <p className="text-[10px] font-semibold text-slate-400 mb-1">User Account</p>
                                                <p className="text-xs font-semibold text-slate-900 truncate">{user?.email}</p>
                                            </div>
                                            <Link to={user?.role === 'ADMIN' ? '/admin/dashboard' : user?.role === 'TEACHER' ? '/teacher/dashboard' : '/dashboard'} className="flex items-center gap-3 px-5 py-3 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all text-xs font-semibold">
                                                <LayoutDashboard size={16} className="text-indigo-600" /> My Dashboard
                                            </Link>
                                            <Link to="/profile" className="flex items-center gap-3 px-5 py-3 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all text-xs font-semibold">
                                                <UserCircle size={16} className="text-indigo-600" /> My Profile
                                            </Link>
                                            <Link to="/wishlist" className="flex items-center gap-3 px-5 py-3 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all text-xs font-semibold">
                                                <ShoppingCart size={16} className="text-indigo-600" /> Wishlist
                                            </Link>
                                            <div className="h-px bg-slate-100 mx-5 my-2"></div>
                                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3 text-rose-600 hover:text-rose-500 hover:bg-rose-50 transition-all text-xs font-semibold">
                                                <LogOut size={16} /> Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link to="/login" className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Login</Link>
                                    <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95">Enroll now</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden p-2 text-slate-400 hover:text-indigo-600 transition-colors" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Refinement */}
            <div className={`md:hidden transition-all duration-300 overflow-hidden bg-white border-b border-slate-100 ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 py-10 space-y-6">
                    <form onSubmit={handleSearch} className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Explore courses..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-xs font-semibold outline-none focus:border-indigo-600/30 transition-all"
                        />
                    </form>

                    <div className="space-y-4">
                        <Link to="/courses" onClick={() => setIsOpen(false)} className="block text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Academy Directory</Link>
                        <Link to="/become-teacher" onClick={() => setIsOpen(false)} className="block text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Become Instructor</Link>
                        <Link to="/contact" onClick={() => setIsOpen(false)} className="block text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Contact Support</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
