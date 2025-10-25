import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import AdmissionForm from '../Admission/AdmissionForm'
import ContactUs from '../Contact/ContactUs'
import PhotoGallery from '../Gallery/PhotoGallery'
import History from '../About/History'
import Vision from '../About/Vision'
import Achievements from '../About/Achievements'
import Message from '../About/Message'
import Management from '../About/Management'
import Home from '../Home/Home'
import School from '../School/School'
import Login from '../Auth/Login'
import Register from '../Auth/Register'
import RoleSelection from '../Auth/RoleSelection'
import StudentDashboard from '../Dashboard/StudentDashboard'
import TeacherDashboard from '../Dashboard/TeacherDashboard'
import AdminDashboard from '../Dashboard/AdminDashboard'
import AdmissionList from '../Admin/AdmissionList'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!user || !token || !user.id) {
    return <Navigate to="/role-selection" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard or show unauthorized
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : 
                        user.role === 'teacher' ? '/dashboard/teacher' : 
                        '/dashboard/student';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (user && token && user.id) {
    // Redirect to appropriate dashboard if already logged in
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : 
                        user.role === 'teacher' ? '/dashboard/teacher' : 
                        '/dashboard/student';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/role-selection" element={
          <PublicRoute>
            <RoleSelection />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Protected Student Routes */}
        <Route path="/dashboard/student" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />

        {/* Protected Teacher Routes */}
        <Route path="/dashboard/teacher" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        } />

        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/admissions" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdmissionList />
          </ProtectedRoute>
        } />

        {/* Public Content Routes */}
        <Route path="/admission" element={<AdmissionForm />} />
        <Route path="/school" element={<School />} />
        <Route path="/history" element={<History />} />
        <Route path="/vision" element={<Vision />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/message" element={<Message />} />
        <Route path="/management" element={<Management />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/gallery" element={<PhotoGallery />} />

        {/* Catch all other routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
