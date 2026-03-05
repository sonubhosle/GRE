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
        duration
    } = course;

    return (
        <Link to={`/courses/${_id}`} className="group relative block bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-indigo-500/30 transition-all duration-700 hover:-translate-y-2 shadow-2xl">
            {/* Dynamic Hover Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            {/* Thumbnail System */}
            <div className="relative aspect-video overflow-hidden m-3 rounded-[1.8rem] shadow-inner">
                <img
                    src={thumbnail?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors duration-700"></div>

                {/* Status Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 scale-90 origin-top-right">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-2xl backdrop-blur-md ${level === 'Beginner' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' :
                        level === 'Intermediate' ? 'bg-amber-500/20 text-amber-400 border-amber-500/20' :
                            'bg-rose-500/20 text-rose-400 border-rose-500/20'
                        }`}>
                        {level}
                    </span>
                    {discount > 0 && (
                        <span className="bg-indigo-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl shadow-indigo-500/40 flex items-center justify-center gap-1">
                            <Zap size={10} className="fill-current" /> {discount}% OFF
                        </span>
                    )}
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-y-4 group-hover:translate-y-0">
                    <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                        <PlayCircle size={28} />
                    </div>
                </div>
            </div>

            {/* Content Matrix */}
            <div className="px-8 pb-8 pt-4">
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                        <Clock size={12} className="text-indigo-400" /> {duration} HOURS
                    </div>
                    <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                        <ShieldCheck size={12} className="text-emerald-400" /> CERTIFIED
                    </div>
                </div>

                <h3 className="font-black text-xl mb-4 line-clamp-2 text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tighter leading-tight">
                    {title}
                </h3>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 bg-slate-900 group-hover:border-indigo-500/30 transition-colors">
                            <img
                                src={teacher?.photo?.url || 'https://via.placeholder.com/100'}
                                alt={teacher?.name}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Instructor</span>
                            <p className="text-[11px] text-slate-300 font-bold tracking-tight">{teacher?.name}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        {discount > 0 ? (
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-slate-600 line-through font-black">₹{price}</span>
                                <span className="text-xl font-black text-indigo-400 tracking-tighter">₹{finalPrice}</span>
                            </div>
                        ) : (
                            <span className="text-xl font-black text-white tracking-tighter">₹{price}</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;

