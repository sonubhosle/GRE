import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import CourseCard from '../../components/ui/CourseCard';
import { Spinner } from '../../components/common/Spinner';
import { Heart } from 'lucide-react';

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

    if (loading) return <div className="h-96 flex items-center justify-center"><Spinner /></div>;

    return (
        <div className="container py-12">
            <div className="mb-12 fade-in-up">
                <h1 className="text-4xl font-bold mb-2">My <span className="gradient-text">Wishlist</span></h1>
                <p className="text-text-muted">Courses you're interested in.</p>
            </div>

            {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {wishlist.map(course => <CourseCard key={course._id} course={course} />)}
                </div>
            ) : (
                <div className="bg-bg-card p-16 rounded-3xl border border-border text-center fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <Heart size={64} className="text-text-muted mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Your wishlist is empty</h3>
                    <p className="text-text-muted mb-8 max-w-sm mx-auto">Save courses you want to learn later and they'll show up here.</p>
                    {/* Use standard a tag if Link import from react-redux was a mistake, fixed to react-router-dom below in thought */}
                    <a href="/courses" className="btn-primary">Explore Courses</a>
                </div>
            )}
        </div>
    );
};

export default Wishlist;
