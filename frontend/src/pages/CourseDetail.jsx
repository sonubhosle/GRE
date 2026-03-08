import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseById } from '../features/courses/courseSlice';
import api from '../services/api';
import {
    Star, Clock, Globe, Check, PlayCircle,
    Lock, FileText, Users, User, ChevronRight, Zap, Trophy,
    ShieldCheck, Activity, Info, Send, Trash2, MessageCircle,
    BookOpen, Award
} from 'lucide-react';
import { toast } from 'react-toastify';

/* ─── Star Rating Input ──────────────────────────────────────────────────── */
const StarRatingInput = ({ value, onChange }) => (
    <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <button
                key={star}
                type="button"
                onClick={() => onChange(star)}
                className="transition-transform hover:scale-125 focus:outline-none"
            >
                <Star
                    size={22}
                    className={star <= value ? 'text-amber-400' : 'text-slate-200'}
                    fill={star <= value ? 'currentColor' : 'none'}
                />
            </button>
        ))}
    </div>
);

/* ─── Static Stars Display ───────────────────────────────────────────────── */
const StarDisplay = ({ value, size = 14 }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                size={size}
                className={star <= Math.round(value) ? 'text-amber-400' : 'text-slate-200'}
                fill={star <= Math.round(value) ? 'currentColor' : 'none'}
            />
        ))}
    </div>
);

/* ─── Review Card ────────────────────────────────────────────────────────── */
const ReviewCard = ({ review, currentUserId, onDelete }) => {
    const isOwner = review.user?._id === currentUserId;
    const dateStr = new Date(review.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
    });

    return (
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300">
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0">
                        {review.user?.photo?.url ? (
                            <img src={review.user.photo.url} alt={review.user.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600 font-semibold text-sm">
                                {review.user?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-900 leading-none mb-1">{review.user?.name || 'Student'}</p>
                        <p className="text-[10px] font-semibold text-slate-400">{dateStr}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <StarDisplay value={review.rating} />
                    {isOwner && (
                        <button
                            onClick={() => onDelete(review._id)}
                            className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-100 transition-all"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">{review.comment}</p>
            {review.teacherReply?.message && (
                <div className="mt-4 ml-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                    <p className="text-[10px] font-semibold text-indigo-600 mb-1 uppercase tracking-wider">Instructor Reply</p>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{review.teacherReply.message}</p>
                </div>
            )}
        </div>
    );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
const CourseDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentCourse, loading } = useSelector((state) => state.courses);
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState('overview');
    const [previewPlaying, setPreviewPlaying] = useState(false);

    // Reviews state
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewPage, setReviewPage] = useState(1);
    const [reviewPagination, setReviewPagination] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        dispatch(fetchCourseById(id));
    }, [id, dispatch]);

    const fetchReviews = useCallback(async (page = 1) => {
        setReviewsLoading(true);
        try {
            const res = await api.get(`/reviews/${id}?page=${page}&limit=6`);
            const data = res.data.data;
            setReviews(prev => page === 1 ? data.reviews : [...prev, ...data.reviews]);
            setReviewPagination(data.pagination);
            setReviewPage(page);
        } catch { /* silently fail */ } finally {
            setReviewsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (activeTab === 'reviews') fetchReviews(1);
    }, [activeTab, fetchReviews]);

    if (loading || !currentCourse) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafbfc]">
            <div className="w-14 h-14 relative mb-4">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 animate-pulse">Loading course details...</span>
        </div>
    );

    const isEnrolled = user?.enrolledCourses?.includes(id);
    const avg = Number(currentCourse.ratingsAverage || 0).toFixed(1);

    // Compute real total duration from video durations (seconds → h m)
    const totalSeconds = currentCourse.courseVideos?.reduce((sum, v) => sum + (v.duration || 0), 0) || 0;
    const totalHours = Math.floor(totalSeconds / 3600);
    const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
    // If all video durations are 0 (not recorded yet), show lesson count instead
    const lessonCount = currentCourse.courseVideos?.length || 0;
    const durationDisplay = totalSeconds > 0
        ? (totalHours > 0 ? `${totalHours}h ${totalMinutes > 0 ? totalMinutes + 'm' : ''}` : `${totalMinutes}m`)
        : currentCourse.duration > 0
            ? `${currentCourse.duration}h`
            : lessonCount > 0 ? `${lessonCount} lesson${lessonCount > 1 ? 's' : ''}` : 'N/A';

    const handleEnroll = () => {
        if (!isAuthenticated) {
            toast.info('Please sign in to enroll');
            return navigate('/login');
        }
        navigate(`/checkout/${id}`);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) { toast.info('Please sign in to leave a review'); return navigate('/login'); }
        if (rating === 0) return toast.warning('Please select a star rating');
        if (!comment.trim()) return toast.warning('Please write a comment');
        setSubmitting(true);
        try {
            await api.post('/reviews', { courseId: id, rating, comment });
            toast.success('Review submitted!');
            setRating(0);
            setComment('');
            fetchReviews(1);
            dispatch(fetchCourseById(id));
        } catch (err) {
            toast.error(err.message || 'Could not submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await api.delete(`/reviews/${reviewId}`);
            toast.success('Review removed');
            fetchReviews(1);
            dispatch(fetchCourseById(id));
        } catch (err) {
            toast.error(err.message || 'Could not delete review');
        }
    };

    const tabs = ['overview', 'curriculum', 'instructor', 'reviews'];
    const hasPreview = !!currentCourse.previewVideo?.url;

    return (
        <div className="min-h-screen bg-[#fafbfc] text-slate-900 pb-24">

            {/* ══════════════ HERO SECTION ══════════════ */}
            <div className="bg-white border-b border-slate-100 pt-28 pb-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">

                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 mb-8 text-[11px] font-semibold text-slate-400">
                        <Link to="/courses" className="hover:text-indigo-600 transition-colors">Catalog</Link>
                        <ChevronRight size={10} className="text-slate-300" />
                        <span className="text-indigo-600">{currentCourse.category?.name}</span>
                    </nav>

                    {/* Two-column grid: left = image, right = info */}
                    <div className="flex flex-col lg:flex-row gap-10 xl:gap-14 items-start">

                        {/* ── LEFT: Course Thumbnail / Preview Video ── */}
                        <div className="w-full lg:w-[460px] xl:w-[500px] flex-shrink-0">
                            <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-xl border border-slate-100">

                                {/* ── PREVIEW VIDEO (block flow, fully visible) ── */}
                                {hasPreview && previewPlaying ? (
                                    <>
                                        <video
                                            src={currentCourse.previewVideo.url}
                                            className="w-full block"
                                            style={{ aspectRatio: '16/10', objectFit: 'cover' }}
                                            autoPlay
                                            controls
                                            playsInline
                                            onEnded={() => setPreviewPlaying(false)}
                                        />
                                        {/* Close preview */}
                                        <button
                                            onClick={() => setPreviewPlaying(false)}
                                            className="absolute top-4 right-4 bg-black/50 backdrop-blur text-white text-[10px] font-semibold px-3 py-1.5 rounded-full border border-white/20 hover:bg-black/70 transition-colors"
                                        >
                                            ✕ Close
                                        </button>
                                    </>
                                ) : (
                                    /* ── THUMBNAIL + overlays ── */
                                    <div className="relative" style={{ aspectRatio: '16/10' }}>
                                        <img
                                            src={currentCourse.thumbnail?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                            alt={currentCourse.title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />

                                        {/* Dark overlay + play button */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/25 hover:bg-slate-900/35 transition-colors duration-300">
                                            <button
                                                onClick={() => hasPreview && setPreviewPlaying(true)}
                                                className={`w-16 h-16 rounded-full bg-white/25 backdrop-blur-xl border border-white/40 flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform duration-300 ${!hasPreview ? 'cursor-default opacity-60' : 'cursor-pointer'}`}
                                            >
                                                <PlayCircle size={32} />
                                            </button>
                                            {hasPreview && (
                                                <span className="mt-3 bg-black/50 backdrop-blur text-white text-[10px] font-semibold px-4 py-1.5 rounded-full border border-white/20">
                                                    Click to preview
                                                </span>
                                            )}
                                        </div>

                                        {/* Level badge */}
                                        {currentCourse.level && (
                                            <div className="absolute top-4 left-4">
                                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-semibold border backdrop-blur-md shadow-sm
                                                    ${currentCourse.level === 'Beginner'
                                                        ? 'bg-emerald-500/80 text-white border-emerald-400/30'
                                                        : currentCourse.level === 'Intermediate'
                                                            ? 'bg-amber-500/80 text-white border-amber-400/30'
                                                            : 'bg-rose-500/80 text-white border-rose-400/30'}`}>
                                                    {currentCourse.level}
                                                </span>
                                            </div>
                                        )}

                                        {/* Discount badge */}
                                        {currentCourse.discount > 0 && (
                                            <div className="absolute top-4 right-4">
                                                <span className="bg-indigo-600 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                                    <Zap size={10} className="fill-current" /> {currentCourse.discount}% off
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* ── RIGHT: All course info ── */}
                        <div className="flex-1 min-w-0 space-y-5">

                            {/* Title */}
                            <h1 className="text-2xl md:text-4xl font-semibold leading-tight tracking-tight text-slate-900">
                                {currentCourse.title}
                            </h1>

                            {/* Short description */}
                            <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">
                                {currentCourse.description?.substring(0, 220)}...
                            </p>

                            {/* Meta pills */}
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700">
                                    <Star className="text-amber-400" size={13} fill="currentColor" />
                                    <span>{avg}</span>
                                    <span className="text-slate-400">({currentCourse.ratingsQuantity || 0} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700">
                                    <Users size={12} className="text-indigo-600" />
                                    {currentCourse.enrolledStudents?.length || 0} enrolled
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700">
                                    <Clock size={12} className="text-purple-600" />
                                    {durationDisplay} video
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700">
                                    <BookOpen size={12} className="text-emerald-600" />
                                    {currentCourse.courseVideos?.length || 0} lessons
                                </div>
                                {currentCourse.language && (
                                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700">
                                        <Globe size={12} className="text-sky-600" />
                                        {currentCourse.language}
                                    </div>
                                )}
                            </div>

                            {/* Instructor chip */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                                    <img
                                        src={currentCourse.teacher?.photo?.url || 'https://via.placeholder.com/100'}
                                        alt={currentCourse.teacher?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Instructor</p>
                                    <p className="text-sm font-semibold text-slate-900">{currentCourse.teacher?.name}</p>
                                </div>
                                {currentCourse.teacher?.specialization && (
                                    <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                                        {currentCourse.teacher.specialization}
                                    </span>
                                )}
                            </div>

                            <div className="border-t border-slate-100" />

                            {/* Price + CTA */}
                            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Course Price</p>
                                    <div className="flex items-end gap-2">
                                        <span className="text-3xl font-semibold text-slate-900 tracking-tight">₹{currentCourse.finalPrice}</span>
                                        {currentCourse.discount > 0 && (
                                            <>
                                                <span className="text-sm text-slate-400 line-through font-semibold mb-1">₹{currentCourse.price}</span>
                                                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg mb-1">
                                                    Save {currentCourse.discount}%
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="sm:ml-auto">
                                    {isEnrolled ? (
                                        <Link
                                            to={`/watch/${id}`}
                                            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all text-sm active:scale-95 whitespace-nowrap"
                                        >
                                            Continue Learning <ChevronRight size={16} />
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={handleEnroll}
                                            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg transition-all text-sm active:scale-95 whitespace-nowrap"
                                        >
                                            Enroll Now <Zap size={15} className="fill-current" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Includes chips */}
                            <div className="flex flex-wrap gap-2 pt-1">
                                {[
                                    { icon: PlayCircle, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100', label: `${durationDisplay} video` },
                                    { icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100', label: `${currentCourse.studyMaterials?.length || 0} materials` },
                                    { icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100', label: 'Certificate' },
                                    { icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', label: 'Lifetime access' },
                                ].map(({ icon: Icon, color, bg, label }, i) => (
                                    <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[11px] font-semibold text-slate-700 ${bg}`}>
                                        <Icon size={13} className={color} />
                                        {label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════════ BODY / TABS ══════════════ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 pt-10">

                {/* Tab bar */}
                <div className="flex gap-8 border-b border-slate-200 overflow-x-auto mb-10">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative pb-4 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition-all
                                ${activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab === 'reviews'
                                ? `Reviews (${currentCourse.ratingsQuantity || 0})`
                                : tab.charAt(0).toUpperCase() + tab.slice(1)}
                            {activeTab === tab && (
                                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* ── OVERVIEW ─────────────────────────────────────────────── */}
                {activeTab === 'overview' && (
                    <div className="max-w-3xl space-y-8">
                        {/* Stat cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { icon: Star, label: 'Rating', value: avg, iconCls: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
                                { icon: Users, label: 'Students', value: currentCourse.enrolledStudents?.length || 0, iconCls: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
                                { icon: BookOpen, label: 'Lessons', value: currentCourse.courseVideos?.length || 0, iconCls: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
                                { icon: Clock, label: 'Duration', value: durationDisplay, iconCls: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                            ].map(({ icon: Icon, label, value, iconCls, bg, border }) => (
                                <div key={label} className={`bg-white border ${border} rounded-[1.5rem] p-4 shadow-sm flex flex-col gap-2`}>
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}>
                                        <Icon size={16} className={iconCls} />
                                    </div>
                                    <p className="text-xl font-semibold text-slate-900">{value}</p>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Full description */}
                        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
                            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-5">
                                <Info className="text-indigo-600" size={17} /> About this course
                            </h3>
                            <p className="text-slate-600 font-medium leading-[1.9] text-sm whitespace-pre-line">
                                {currentCourse.description}
                            </p>
                        </div>

                        {/* What you'll learn */}
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-5">
                                <Award className="text-amber-500" size={17} /> What you'll learn
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {[
                                    'Master core concepts and practical skills',
                                    'Build real-world production-ready projects',
                                    'Apply industry-standard best practices',
                                    'Earn a verifiable certificate of completion',
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-3 items-start p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-100 transition-all">
                                        <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
                                            <Check size={13} />
                                        </div>
                                        <span className="text-sm font-medium text-slate-600 leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── CURRICULUM ───────────────────────────────────────────── */}
                {activeTab === 'curriculum' && (
                    <div className="max-w-3xl space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                <Activity className="text-purple-600" size={17} /> Course Curriculum
                            </h3>
                            <span className="text-[11px] font-semibold text-slate-400">
                                {currentCourse.courseVideos?.length || 0} lessons · {currentCourse.duration} hrs
                            </span>
                        </div>
                        <div className="space-y-2">
                            {currentCourse.courseVideos?.map((video, i) => (
                                <div
                                    key={video._id}
                                    className="group flex items-center justify-between p-4 bg-white border border-slate-100 hover:border-indigo-100 rounded-2xl shadow-sm transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-semibold text-slate-300 w-5 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                                        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                                            <PlayCircle size={17} />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors tracking-tight">{video.title}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">
                                            {Math.floor(video.duration / 60)}m {video.duration % 60}s
                                        </span>
                                        {!isEnrolled && <Lock size={13} className="text-slate-300" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── INSTRUCTOR ───────────────────────────────────────────── */}
                {activeTab === 'instructor' && (
                    <div className="max-w-3xl">
                        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-6">
                            <User className="text-indigo-600" size={17} /> Meet your instructor
                        </h3>
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                            <div className="flex flex-col sm:flex-row gap-8 items-start">
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={currentCourse.teacher?.photo?.url || 'https://via.placeholder.com/200'}
                                        className="w-28 h-28 rounded-[1.5rem] object-cover border border-slate-100 shadow-lg"
                                        alt={currentCourse.teacher?.name}
                                    />
                                    <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white border-2 border-white shadow-lg">
                                        <ShieldCheck size={18} />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h4 className="text-2xl font-semibold text-slate-900 mb-0.5">{currentCourse.teacher?.name}</h4>
                                        {currentCourse.teacher?.specialization && (
                                            <p className="text-indigo-600 text-[11px] font-semibold uppercase tracking-wider">{currentCourse.teacher.specialization}</p>
                                        )}
                                    </div>
                                    {currentCourse.teacher?.bio && (
                                        <p className="text-slate-600 text-sm font-medium leading-relaxed">{currentCourse.teacher.bio}</p>
                                    )}
                                    <div className="flex gap-6 pt-4 border-t border-slate-100">
                                        <div>
                                            <p className="text-xl font-semibold text-slate-900">12k+</p>
                                            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Learners</p>
                                        </div>
                                        {currentCourse.teacher?.experience && (
                                            <div>
                                                <p className="text-xl font-semibold text-slate-900">{currentCourse.teacher.experience}Y</p>
                                                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Experience</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-xl font-semibold text-slate-900">100%</p>
                                            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Rating</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── REVIEWS ──────────────────────────────────────────────── */}
                {activeTab === 'reviews' && (
                    <div className="max-w-3xl space-y-6">

                        {/* Rating summary */}
                        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
                            <div className="text-center flex-shrink-0">
                                <p className="text-5xl font-semibold text-slate-900 tracking-tight">{avg}</p>
                                <StarDisplay value={Number(avg)} size={18} />
                                <p className="text-[11px] font-semibold text-slate-400 mt-2">{currentCourse.ratingsQuantity || 0} ratings</p>
                            </div>
                            <div className="flex-1 w-full space-y-2">
                                {[5, 4, 3, 2, 1].map(star => {
                                    const count = reviews.filter(r => r.rating === star).length;
                                    const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                                    return (
                                        <div key={star} className="flex items-center gap-3">
                                            <span className="text-[11px] font-semibold text-slate-500 w-3">{star}</span>
                                            <Star size={11} className="text-amber-400" fill="currentColor" />
                                            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="text-[10px] font-semibold text-slate-400 w-7">{pct}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Write review form */}
                        {isAuthenticated && isEnrolled && (
                            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
                                <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <MessageCircle size={16} className="text-indigo-600" /> Write a Review
                                </h4>
                                <form onSubmit={handleSubmitReview} className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Rating</p>
                                        <StarRatingInput value={rating} onChange={setRating} />
                                    </div>
                                    <textarea
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        placeholder="Share your experience with this course..."
                                        rows={4}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/30 transition-all resize-none"
                                    />
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-2xl transition-all text-sm active:scale-95 shadow-lg shadow-indigo-500/20"
                                    >
                                        {submitting ? 'Submitting...' : <><Send size={15} /> Submit Review</>}
                                    </button>
                                </form>
                            </div>
                        )}

                        {!isAuthenticated && (
                            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-center">
                                <p className="text-sm font-semibold text-indigo-700 mb-2">Sign in to leave a review</p>
                                <Link to="/login" className="text-[11px] font-semibold text-indigo-600 underline underline-offset-2">Go to Login →</Link>
                            </div>
                        )}

                        {isAuthenticated && !isEnrolled && (
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-center">
                                <p className="text-sm font-semibold text-amber-700">Enroll in this course to write a review.</p>
                            </div>
                        )}

                        {/* Reviews list */}
                        {reviewsLoading && reviews.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="bg-white border border-slate-100 rounded-[2rem] p-10 text-center shadow-sm">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4 text-slate-300">
                                    <Star size={28} />
                                </div>
                                <p className="text-sm font-semibold text-slate-600">No reviews yet</p>
                                <p className="text-[11px] text-slate-400 font-medium mt-1">Be the first to review this course!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map(review => (
                                    <ReviewCard
                                        key={review._id}
                                        review={review}
                                        currentUserId={user?._id}
                                        onDelete={handleDeleteReview}
                                    />
                                ))}
                                {reviewPagination && reviewPage < reviewPagination.pages && (
                                    <button
                                        onClick={() => fetchReviews(reviewPage + 1)}
                                        disabled={reviewsLoading}
                                        className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition-all disabled:opacity-50"
                                    >
                                        {reviewsLoading ? 'Loading...' : 'Load more reviews'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDetail;
