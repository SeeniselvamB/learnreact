import React, { useState, useEffect } from "react";
import Course from "./Course";
import Profile from "./Profile";
import QuizPage from "./QuizPage";
import ManageUsers from "./UserManagement"; 
import Instructor from "./Instructor"; 
import { getAllCourses } from "../../api";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminDashboard.css";

export default function AdminDashboard() {
    const admin = { fullName: "Seeniselvam", username: "Seeniselvam", role: "ADMIN" };
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("profile");
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    
    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/"); 
    };

    
    useEffect(() => {
        const fetchCoursesData = async () => {
            try {
                const res = await getAllCourses();
                setCourses(res);
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };
        fetchCoursesData();
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setSelectedCourseId(null); // reset course selection when switching tabs
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h2>Admin Dashboard</h2>
                <div className="admin-info">
                    <span>Welcome, <strong>{admin.fullName}</strong></span>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>

                {/* Tabs */}
                <div className="tabs">
                    {["profile","instructors","users",  "courses"].map((tab) => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                            onClick={() => handleTabClick(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </header>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === "profile" && <Profile admin={admin} />}

                {activeTab === "users" && <ManageUsers filterRole="STUDENT" />}

                {activeTab === "instructors" && <Instructor />}

                {activeTab === "courses" && !selectedCourseId && (
                    <Course
                        courses={courses}
                        setCourses={setCourses}
                        onManageQuiz={(courseId) => setSelectedCourseId(courseId)}
                    />
                )}

                {activeTab === "courses" && selectedCourseId && (
                    <QuizPage courseId={selectedCourseId} onBack={() => setSelectedCourseId(null)} />
                )}

            </div>
        </div>
    );
}
