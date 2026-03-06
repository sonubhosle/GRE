import { Link } from 'react-router-dom';
import { Star, Clock, User, TrendingUp, PlayCircle, ShieldCheck, Zap } from 'lucide-react';

const CourseCard = ({ course }) => {
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
        duration,
        previewVideo
    } = course;

    return (
        <Link to={`/courses/${_id}`} className="group relative block bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:border-indigo-600/30 transition-all duration-700 hover:-translate-y-2 shadow-sm hover:shadow-xl">
            {/* Dynamic Hover Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            {/* Thumbnail System */}
            <div className="relative aspect-video overflow-hidden m-3 rounded-[1.8rem] shadow-inner bg-slate-100">
                <img
                    src={thumbnail?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-0 transition-all duration-700 shadow-sm"
                />

                {/* Video Preview */}
                {previewVideo?.url && (
                    <video
                        src={previewVideo.url}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        muted
                        loop
                        onMouseOver={(e) => e.target.play()}
                        onMouseOut={(e) => {
                            e.target.pause();
                            e.target.currentTime = 0;
                        }}
                    />
                )}

                <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-700 pointer-events-none"></div>

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 scale-90 origin-top-left z-10">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border shadow-sm backdrop-blur-md ${level === 'Beginner' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                        level === 'Intermediate' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                            'bg-rose-500/10 text-rose-600 border-rose-500/20'
                        }`}>
                        {level}
                    </span>
                </div>

                {discount > 0 && (
                    <div className="absolute top-4 right-4 z-10 scale-90 origin-top-right">
                        <span className="bg-indigo-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-1">
                            <Zap size={10} className="fill-current" /> {discount}% off
                        </span>
                    </div>
                )}
            </div>

            {/* Content Matrix */}
            <div className="px-8 pb-8 pt-4">
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                        <Clock size={12} className="text-indigo-600" /> {duration} hours
                    </div>
                    <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                        <ShieldCheck size={12} className="text-emerald-600" /> Certified
                    </div>
                </div>

                <h3 className="font-bold text-lg mb-4 line-clamp-2 text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight leading-tight">
                    {title}
                </h3>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group-hover:border-indigo-600/30 transition-colors">
                            <img
                                src={teacher?.photo?.url || 'https://via.placeholder.com/100'}
                                alt={teacher?.name}
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400">Instructor</span>
                            <p className="text-[11px] text-slate-700 font-bold tracking-tight">{teacher?.name}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        {discount > 0 ? (
                            <div className="flex flex-col items-end">
                                <span className="text-xs text-slate-400 line-through font-bold">₹{price}</span>
                                <span className="text-xl font-bold text-indigo-600 tracking-tight">₹{finalPrice}</span>
                            </div>
                        ) : (
                            <span className="text-xl font-bold text-slate-900 tracking-tight">₹{price}</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;

