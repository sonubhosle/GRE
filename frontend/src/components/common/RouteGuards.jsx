import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spinner } from './Spinner';

export const ProtectedRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

    if (loading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    // Handle Pending Teachers
    if (user?.role === 'TEACHER' && user?.status === 'pending') {
        return <Navigate to="/teacher/pending" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
        if (user?.role === 'TEACHER') return <Navigate to="/teacher/dashboard" replace />;
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export const PublicRoute = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    if (isAuthenticated) {
        if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
        if (user?.role === 'TEACHER') {
            return user?.status === 'pending'
                ? <Navigate to="/teacher/pending" replace />
                : <Navigate to="/teacher/dashboard" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
