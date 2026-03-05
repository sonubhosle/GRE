import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import { BookOpen, Award, Clock, Play } from 'lucide-react';

const StudentDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrolled = async () => {
            try {
                const res = await api.get('/users/enrolled-courses');
                setEnrolledCourses(res.data.data.courses);
            } catch (e) {
            } finally {
                setLoading(false);
            }
        };
        fetchEnrolled();
    }, []);

    if (loading) return <div className="h-96 flex items-center justify-center"><Spinner /></div>;

    const completedCourses = enrolledCourses.filter(c => c.progress?.completed);

    return (
        <div className="container py-12">
            <div className="mb-12 fade-in-up">
                <h1 className="text-4xl font-bold mb-2">Welcome back, <span className="gradient-text">{user?.name}</span>! 👋</h1>
                <p className="text-text-muted">You're on a roll. Keep up the great progress!</p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="card p-6 bg-primary/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-2xl">
                        <BookOpen />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{enrolledCourses.length}</p>
                        <p className="text-xs text-text-muted uppercase font-bold tracking-widest">Enrolled Courses</p>
                    </div>
                </div>
                <div className="card p-6 bg-accent/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent text-2xl">
                        <Award />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{completedCourses.length}</p>
                        <p className="text-xs text-text-muted uppercase font-bold tracking-widest">Certificates Earned</p>
                    </div>
                </div>
                <div className="card p-6 bg-secondary/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary text-2xl">
                        <Clock />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">~{enrolledCourses.reduce((acc, c) => acc + (c.duration || 0), 0)}h</p>
                        <p className="text-xs text-text-muted uppercase font-bold tracking-widest">Total Study Time</p>
                    </div>
                </div>
            </div>

            {/* Enrolled Courses Grid */}
            <h2 className="text-2xl font-bold mb-8 fade-in-up" style={{ animationDelay: '0.2s' }}>My Enrolled Courses</h2>

            {enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 fade-in-up" style={{ animationDelay: '0.3s' }}>
                    {enrolledCourses.map((course) => (
                        <div key={course._id} className="card overflow-hidden flex flex-col group">
                            <div className="relative aspect-video">
                                <img src={course.thumbnail?.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Progress</span>
                                        <span className="text-xs font-bold text-white">{course.progress?.progressPercent || 0}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-1000"
                                            style={{ width: `${course.progress?.progressPercent || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <Link to={`/watch/${course._id}`} className="font-bold text-lg mb-4 hover:text-primary transition-colors line-clamp-2">
                                    {course.title}
                                </Link>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-6 h-6 rounded-full overflow-hidden border border-border">
                                        <img src={course.teacher?.photo?.url || 'https://via.placeholder.com/24'} className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-xs text-text-muted">{course.teacher?.name}</p>
                                </div>

                                <div className="mt-auto flex gap-3">
                                    <Link to={`/watch/${course._id}`} className="btn-primary flex-1 justify-center gap-2">
                                        <Play size={18} fill="currentColor" /> {course.progress?.progressPercent > 0 ? 'Resume' : 'Start'}
                                    </Link>
                                    {course.progress?.completed && (
                                        <button
                                            onClick={async () => {
                                                window.open(`/api/users/certificate/${course._id}`, '_blank');
                                            }}
                                            className="btn-secondary px-4 h-11"
                                            title="Download Certificate"
                                        >
                                            <Award className="text-xl" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-bg-card p-16 rounded-3xl border border-border text-center fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <BookOpen size={64} className="text-text-muted mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">No courses enrolled yet</h3>
                    <p className="text-text-muted mb-8 max-w-sm mx-auto">Explore our catalog and start your learning journey today!</p>
                    <Link to="/courses" className="btn-primary">Browse All Courses</Link>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
