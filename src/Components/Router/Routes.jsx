import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import StudentDashboard from '../Dashboard/StudentDashboard'
import TeacherDashboard from '../Dashboard/TeacherDashboard'
import AdmissionForm from '../Admission/AdmissionForm'
import { AuthProvider, useAuth } from '../../context/AuthContext'
import History from '../About/History'
import Vision from '../About/Vision'
import Achievements from '../About/Achievements'
import Message from '../About/Message'
import Management from '../About/Management'
import Home from '../Home/Home'
import School from '../School/School'
import LoginPage from '../Auth/LoginPage'
import SignupPage from '../Auth/SignupPage'

function Protected({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <LoginPage />;
  if (roles && !roles.includes(user.role)) return <Home />;
  return children;
}

function Landing() {
  const { user } = useAuth();
  if (user?.role === 'student') return <Navigate to="/student" replace />;
  if (user?.role === 'teacher' || user?.role === 'admin') return <Navigate to="/teacher" replace />;
  return <Home />;
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavbarGate />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/school" element={<School />} />
          <Route path="/history" element={<History />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/message" element={<Message />} />
          <Route path="/management" element={<Management />} />
          <Route path="/admission" element={<AdmissionForm />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/student" element={<Protected roles={["student"]}><StudentDashboard /></Protected>} />
          <Route path="/teacher" element={<Protected roles={["teacher","admin"]}><TeacherDashboard /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

function NavbarGate() {
  const location = useLocation();
  const hide = location.pathname.startsWith('/student') || location.pathname.startsWith('/teacher');
  return hide ? null : <Navbar />;
}
