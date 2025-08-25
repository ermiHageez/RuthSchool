import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './component/Navbar';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import AdminDashboard from './pages/AdminDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ProfileManagement from './component/ProfileManagement';
import CourseManagement from './component/CourseManagement';
import UserManagement from './component/UserManagement';
import LoginPage from './pages/LoginPage';
import Footer from './component/Footer';

const App = () => {
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (role) => {
    setUserRole(role);
  };

  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          {userRole === 'Admin' && (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
            </>
          )}
          {userRole === 'Instructor' && (
            <Route path="/instructor" element={<InstructorDashboard />} />
          )}
          {userRole === 'Student' && (
            <>
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/profile" element={<ProfileManagement />} />
            </>
          )}
          <Route path="/courses" element={<CourseManagement />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;