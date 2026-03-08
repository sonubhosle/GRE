import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import {
    LayoutDashboard, Users, GraduationCap, BookOpen,
    Tags, Ticket, Bell, LogOut, ChevronRight, Menu, X,
    Zap, Search, UserCircle, Globe
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { user } = useSelector(state => state.auth);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: GraduationCap, label: 'Teachers', path: '/admin/teachers' },
        { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
        { icon: Tags, label: 'Categories', path: '/admin/categories' },
        { icon: Ticket, label: 'Coupons', path: '/admin/coupons' },
    ];

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Admin session ended');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-900">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:translate-x-0`}>
                <div className="h-full flex flex-col p-6">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 mb-10 group px-2">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                            <Zap size={22} className="text-white fill-current" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            Admin<span className="text-indigo-600">Panel</span>
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all group ${location.pathname === item.path
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <item.icon size={20} className={location.pathname === item.path ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} />
                                {item.label}
                                {location.pathname === item.path && (
                                    <ChevronRight size={14} className="ml-auto" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* User Profile info */}
                    <div className="mt-auto pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-4 mb-6 px-2">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 p-0.5">
                                <img
                                    src={user?.photo?.url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                                    className="w-full h-full rounded-[14px] object-cover"
                                    alt="Admin"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[13px] font-bold truncate">{user?.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold text-rose-600 hover:bg-rose-50 transition-all group"
                        >
                            <LogOut size={20} className="text-rose-500 group-hover:translate-x-1 transition-transform" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-100 transition-all"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-lg border border-indigo-100">
                            <Globe size={14} className="text-indigo-600" />
                            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Live System Monitoring</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Global search..."
                                className="bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-12 pr-6 text-xs font-bold w-64 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        <button className="relative p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-100 transition-all group">
                            <Bell size={20} className="group-hover:animate-swing" />
                            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
                        </button>
                    </div>
                </header>

                {/* Dashboard Viewport */}
                <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
