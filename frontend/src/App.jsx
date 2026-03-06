import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getMe } from './features/auth/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import StudentDashboard from './pages/student/Dashboard';
import Wishlist from './pages/student/Wishlist';
import TeacherDashboard from './pages/teacher/Dashboard';
import MyCourses from './pages/teacher/MyCourses';
import CreateCourse from './pages/teacher/CreateCourse';
import EditCourse from './pages/teacher/EditCourse';
import PendingVerification from './pages/teacher/PendingVerification';
import WatchCourse from './pages/student/WatchCourse';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminCategories from './pages/admin/Categories';
import AdminCoupons from './pages/admin/Coupons';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import { ProtectedRoute, PublicRoute } from './components/common/RouteGuards';

const AppContent = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  const hideLayout = ['/login', '/register', '/teacher/pending'].includes(location.pathname) || location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {!hideLayout && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />

          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/watch/:id" element={<WatchCourse />} />
          </Route>

          {/* Protected Teacher Routes */}
          <Route path="/teacher/pending" element={<ProtectedRoute allowedRoles={['TEACHER']}><PendingVerification /></ProtectedRoute>} />
          <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/courses" element={<MyCourses />} />
            <Route path="/teacher/courses/create" element={<CreateCourse />} />
            <Route path="/teacher/courses/edit/:id" element={<EditCourse />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/coupons" element={<AdminCoupons />} />
          </Route>

          {/* Common Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/checkout/:id" element={<Checkout />} />
          </Route>

          <Route path="*" element={<div className="container py-20 text-center"><h1>404 - Not Found</h1></div>} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
