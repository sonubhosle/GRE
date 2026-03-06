import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import CourseCard from '../../components/ui/CourseCard';
import { Heart, Loader2 } from 'lucide-react';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await api.get('/users/wishlist');
                setWishlist(res.data.data.wishlist);
            } catch (e) {
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-slate-900">
                        My <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">Wishlist</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Courses you've saved for later. Ready to start?</p>
                </div>

                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in-up delay-100">
                        {wishlist.map(course => <CourseCard key={course._id} course={course} />)}
                    </div>
                ) : (
                    <div className="bg-white p-24 rounded-[3rem] border border-dashed border-slate-200 text-center animate-fade-in-up shadow-sm">
                        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-8 text-rose-300">
                            <Heart size={48} fill="currentColor" opacity={0.2} />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-3">Your wishlist is empty</h3>
                        <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">Save courses you want to learn later and they'll show up here.</p>
                        <Link to="/courses" className="inline-flex bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-5 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95">Explore courses</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
