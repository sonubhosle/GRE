import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Star, Clock, User, TrendingUp, PlayCircle, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';

const CourseCard = ({ course }) => {
    const { user } = useSelector((state) => state.auth);
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

    const isEnrolled = user?.enrolledCourses?.includes(_id);

    return (
        <div className="group relative block bg-white rounded-xl border border-slate-100  hover:border-indigo-600/30 transition-all duration-700 hover:-translate-y-4 shadow-sm hover:shadow-2xl">

            <div className="relative aspect-[16/9] overflow-hidden m-1 rounded-xl shadow-inner bg-slate-100">
                <img
                    src={thumbnail?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 shadow-sm"
                />

                {/* Only Discount on Thumbnail */}
                {discount > 0 && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="bg-rose-500 text-white text-xs font-black px-3 py-2.5 rounded-2xl shadow-2xl shadow-rose-500/40 flex items-center justify-center gap-2 uppercase tracking-widest ">
                            <Zap size={14} className="fill-current" /> {discount}% OFF
                        </span>
                    </div>
                )}
            </div>

            {/* High-Impact Content Body */}
            <div className="px-3 pt-3">
                {/* Body Badges Matrix - Integrated Here */}
                <div className="flex  items-center gap-3">
                    <span className={` text-[10px] font-semibold px-3 py-1.5 rounded-xl  ${level === 'Beginner' ? 'bg-emerald-50 text-emerald-500 ' :
                        level === 'Intermediate' ? 'bg-amber-50 text-amber-600 ' :
                            'bg-amber text-rose-600 '
                        }`}>
                        {level}
                    </span>
                    {category && (
                        <span className="bg-indigo-50 px-3 py-1.5 rounded-xl text-indigo-600  text-[10px] font-semibold ]">
                            {category.name}
                        </span>
                    )}
                </div>

                <h3 className="font-semibold py-3 text-lg  line-clamp-2 text-slate-900 group-hover:text-indigo-600 transition-all tracking-tight leading-[1.1]">
                    {title}
                </h3>


                <div className=" flex items-center gap-3 ">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-[0.3em]">
                        <Clock size={14} className="text-indigo-600" /> {duration}H
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 uppercase tracking-[0.3em]">
                        <Star size={14} className="text-yellow-500" /> {ratingsAverage}
                    </div>
                </div>
                <div className=" py-4 mt-4 border-t-2 border-slate-50">
                    <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-50 group-hover:border-indigo-600 transition-all shadow-xl">
                            <img
                                src={teacher?.photo?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher?.name || 'T')}&background=818cf8&color=fff`}
                                alt={teacher?.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-semibold text-slate-400">Elite Mentor</span>
                            <p className="text-base text-slate-900 font-semibold  truncate max-w-[180px]">{teacher?.name}</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <Link to={`/courses/${_id}`} className="bg-linear-to-r from-indigo-600 to-indigo-800 mt-4 text-white px-6 py-2 rounded-3xl">Enroll Now</Link>
                        {discount > 0 ? (
                            <div className="flex flex-col items-end">
                                <span className="text-sm text-slate-400 line-through font-semibold mb-1 tracking-widest">₹{price}</span>
                                <span className="text-3xl font-semibold text-indigo-600 tracking-tighter tabular-nums drop-shadow-xl">₹{finalPrice}</span>
                            </div>
                        ) : (
                            <span className="text-3xl font-semibold text-slate-900 tracking-tighter tabular-nums drop-shadow-xl">₹{price}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
