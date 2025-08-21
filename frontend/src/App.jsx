import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🎓 Student Pages
import ApplyForm from "./pages/student/ApplyForm";
import StudentLogin from "./pages/student/Login";
import StudentDashboard from "./pages/student/Dashboard";
// import RegisterSemester from "./pages/student/RegisterSemester";
// import RequestRestoration from "./pages/student/RequestRestoration";

// 🧑‍🏫 Department Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import Applications from "./pages/admin/Applications";
// import Accounts from "./pages/admin/Accounts";
import Grades from "./pages/admin/Grades";
// import SemesterControl from "./pages/admin/SemesterControl";
import RestorationRequests from "./pages/admin/RestorationRequests";

// 🏫 School Admin Pages
import SchoolLogin from "./pages/school/Login";
import SchoolDashboard from "./pages/school/Dashboard";
import AllStudents from "./pages/school/AllStudents";
import Departments from "./pages/school/Departments";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🎓 Student Routes */}
        <Route path="/apply" element={<ApplyForm />} />
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/register-semester" element={<RegisterSemester />} />
        <Route path="/request-restoration" element={<RequestRestoration />} />

        {/* 🧑‍🏫 Department Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/applications" element={<Applications />} />
        <Route path="/admin/accounts" element={<Accounts />} />
        <Route path="/admin/grades" element={<Grades />} />
        <Route path="/admin/semester-control" element={<SemesterControl />} />
        <Route path="/admin/restoration-requests" element={<RestorationRequests />} />

        {/* 🏫 School Admin Routes */}
        <Route path="/school-admin/login" element={<SchoolLogin />} />
        <Route path="/school-admin/dashboard" element={<SchoolDashboard />} />
        <Route path="/school-admin/students" element={<AllStudents />} />
        <Route path="/school-admin/departments" element={<Departments />} />
      </Routes>
    </Router>
  );
}

export default App;
