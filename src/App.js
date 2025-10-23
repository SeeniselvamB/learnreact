import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AuthPage from "./components/AuthPage";
import Footer from "./components/Footer";
import StudentDashboard from "./components/student/StudentDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import InstructorDashboard from "./components/admin/InstructorDashboard";
import CoursePage from "./components/admin/Course";
import AdminQuizPage from "./components/admin/QuizPage";
import StudentQuizPage from "./components/student/QuizPage";
import Guest from "./components/Guest";

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

function AppContent() {
    const location = useLocation();
    const showFooter = location.pathname === "/";

    // Get logged-in user
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const role = storedUser?.role?.toUpperCase();

    return (
        <>
            <Navbar />
            <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/guest" element={<Guest />} />

                {/* Student */}
                <Route path="/student" element={role === "STUDENT" ? <StudentDashboard /> : <Navigate to="/auth" />} />
                <Route path="/student/quiz/:id" element={role === "STUDENT" ? <StudentQuizPage /> : <Navigate to="/auth" />} />
                <Route path="/student/courses" element={role === "STUDENT" ? <StudentDashboard /> : <Navigate to="/auth" />} />

                {/* Admin */}
                <Route path="/admin" element={role === "ADMIN" ? <AdminDashboard /> : <Navigate to="/auth" />} />
                <Route path="/admin/courses" element={role === "ADMIN" ? <CoursePage /> : <Navigate to="/auth" />} />
                <Route path="/admin/quiz/:courseId" element={role === "ADMIN" ? <AdminQuizPage /> : <Navigate to="/auth" />} />

                {/* Instructor */}
                <Route path="/instructor" element={role === "INSTRUCTOR" ? <InstructorDashboard /> : <Navigate to="/auth" />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            {showFooter && <Footer />}
        </>
    );
}

export default App;
