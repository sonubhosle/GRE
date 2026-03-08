import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Star, Clock, User, TrendingUp, PlayCircle, ShieldCheck, Zap, CheckCircle2, Heart } from 'lucide-react';
import api from '../../services/api';
import { getMe } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';

const CourseCard = ({ course }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        _id,
        title,
        thumbnail,
        teacher,
        price,
        discount,
        finalPrice,
        ratingsAverage,
        ratingsQuantity,
        level,
        category,
        duration,
        previewVideo
    } = course;

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    useEffect(() => {
        if (user?.wishlist) {
            setIsWishlisted(user.wishlist.some(item =>
                (typeof item === 'string' ? item : item._id) === _id
            ));
        }
    }, [user, _id]);

    const toggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.info('Please login to manage your wishlist');
            return navigate('/login');
        }

        setWishlistLoading(true);
        try {
            await api.post('/users/wishlist', { courseId: _id });
            setIsWishlisted(!isWishlisted);
            dispatch(getMe());
            toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
        } catch (error) {
            toast.error('Failed to update wishlist');
        } finally {
            setWishlistLoading(false);
        }
    };

    return (
        <div className="group relative block bg-white rounded-xl border border-slate-100 hover:border-indigo-600/30 transition-all duration-700 hover:-translate-y-4 shadow-sm hover:shadow-2xl">
            <div className="relative aspect-[16/9] overflow-hidden m-1 rounded-xl shadow-inner bg-slate-100">
                <img
                    src={thumbnail?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 shadow-sm"
                />

                {/* Wishlist Heart Icon */}
                <button
                    onClick={toggleWishlist}
                    disabled={wishlistLoading}
                    className={`absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-lg ${isWishlisted
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/70 text-slate-400 hover:text-rose-500 hover:bg-white'
                        }`}
                >
                    <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
                </button>

                {/* Only Discount on Thumbnail */}
                {discount > 0 && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="bg-rose-500 text-white text-[10px] font-bold px-3 py-2.5 rounded-2xl shadow-2xl shadow-rose-500/40 flex items-center justify-center gap-2 uppercase tracking-widest ">
                            <Zap size={14} className="fill-current" /> {discount}% OFF
                        </span>
                    </div>
                )}
            </div>

            {/* High-Impact Content Body */}
            <div className="px-3 pt-3">
                <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-semibold px-3 py-1.5 rounded-xl ${level === 'Beginner' ? 'bg-emerald-50 text-emerald-500' :
                            level === 'Intermediate' ? 'bg-amber-50 text-amber-600' :
                                'bg-rose-50 text-rose-600'
                        }`}>
                        {level}
                    </span>
                    {category && (
                        <span className="bg-indigo-50 px-3 py-1.5 rounded-xl text-indigo-600 text-[10px] font-semibold">
                            {category.name}
                        </span>
                    )}
                </div>

                <h3 className="font-semibold py-3 text-lg line-clamp-2 text-slate-900 group-hover:text-indigo-600 transition-all tracking-tight leading-[1.1]">
                    {title}
                </h3>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">
                        <Clock size={14} className="text-indigo-600" /> {duration}H
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">
                        <Star size={14} className="text-yellow-500" /> {ratingsAverage}
                    </div>
                </div>

                <div className="py-4 mt-4 border-t-2 border-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-50 group-hover:border-indigo-600 transition-all shadow-md">
                            <img
                                src={teacher?.photo?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher?.name || 'T')}&background=818cf8&color=fff`}
                                alt={teacher?.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tighter">Elite Mentor</span>
                            <p className="text-sm text-slate-900 font-semibold truncate max-w-[150px]">{teacher?.name}</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <Link to={`/courses/${_id}`} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-3xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                            Enroll Now
                        </Link>
                        {discount > 0 ? (
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-slate-400 line-through font-semibold mb-0.5 tracking-widest">₹{price}</span>
                                <span className="text-2xl font-semibold text-indigo-600 tracking-tighter tabular-nums">₹{finalPrice}</span>
                            </div>
                        ) : (
                            <span className="text-2xl font-semibold text-slate-900 tracking-tighter tabular-nums">₹{price}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
