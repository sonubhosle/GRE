import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Spinner } from '../../components/common/Spinner';
import { Edit2, Trash2, Eye, Plus, Check, Loader2, History, BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses/my-courses');
            setCourses(res.data.data.courses);
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;
        try {
            await api.delete(`/courses/${id}`);
            toast.success('Course deleted');
            setCourses(courses.filter(c => c._id !== id));
        } catch (e) {
            toast.error(e.message || 'Failed to delete course');
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;

    return (
        <div className="container py-12">
            <div className="flex justify-between items-end mb-12 fade-in-up">
                <div>
                    <h1 className="text-4xl font-bold mb-2">My <span className="gradient-text">Courses</span></h1>
                    <p className="text-text-muted">Manage your content and curriculum.</p>
                </div>
                <Link to="/teacher/courses/create" className="btn-primary gap-2">
                    <Plus className="w-5 h-5" /> Create New Course
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 fade-in-up" style={{ animationDelay: '0.1s' }}>
                {courses.length > 0 ? courses.map((course) => (
                    <div key={course._id} className="card p-4 md:p-6 flex flex-col md:row gap-6 items-center">
                        {/* Thumbnail */}
                        <div className="w-full md:w-60 aspect-video rounded-xl overflow-hidden flex-shrink-0 group relative">
                            <img src={course.thumbnail?.url} alt={course.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Link to={`/courses/${course._id}`} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20">
                                    <Eye size={20} />
                                </Link>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`badge ${course.approvalStatus === 'approved' ? 'badge-success' : course.approvalStatus === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                                    {course.approvalStatus}
                                </span>
                                <span className="badge badge-primary">{course.category?.name}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">{course.title}</h3>
                            <div className="flex flex-wrap gap-4 text-xs font-bold text-text-muted uppercase tracking-wider">
                                <span className="flex items-center gap-1"><Eye size={14} /> {course.enrolledStudents?.length || 0} Enrolled</span>
                                <span className="flex items-center gap-1"><Loader2 size={14} /> {course.courseVideos?.length || 0} Lessons</span>
                                <span className="flex items-center gap-1"><History size={14} /> Updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <Link to={`/teacher/courses/edit/${course._id}`} className="btn-secondary h-11 px-4 gap-2 border-border hover:border-primary">
                                <Edit2 size={18} /> <span className="md:hidden lg:inline">Edit</span>
                            </Link>
                            <button
                                onClick={() => handleDelete(course._id)}
                                className="btn-danger h-11 px-4 border-none bg-red-500/10 hover:bg-red-500"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="bg-bg-card p-20 rounded-3xl border border-border text-center">
                        <BookOpen size={64} className="text-text-muted mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">No courses yet</h3>
                        <p className="text-text-muted mb-8 max-w-sm mx-auto">Start sharing your knowledge with the world. Create your first course today!</p>
                        <Link to="/teacher/courses/create" className="btn-primary">Create Your First Course</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCourses;
