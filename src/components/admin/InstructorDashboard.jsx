import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile";
import Course from "./Course";
import QuizPage from "./QuizPage";
import UserManagement from "./UserManagement";
import { getAllCourses } from "../../api";
import "../../styles/InstructorDashboard.css";

export default function InstructorDashboard({ instructor }) {
    const navigate = useNavigate();

    // Fallback to localStorage if prop is not passed
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const currentInstructor = instructor || storedUser;

    // Redirect if no user found
    useEffect(() => {
        if (!currentInstructor) {
            navigate("/"); // go back to login
        }
    }, [currentInstructor, navigate]);

    const [activeTab, setActiveTab] = useState("profile");
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    // Fetch instructor courses
    useEffect(() => {
        const fetchCoursesData = async () => {
            if (!currentInstructor?.id) return;
            try {
                const res = await getAllCourses();
                const instructorCourses = res.filter(
                    (course) => course.instructorId === currentInstructor.id
                );
                setCourses(instructorCourses);
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };
        fetchCoursesData();
    }, [currentInstructor?.id]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setSelectedCourseId(null);
    };

    if (!currentInstructor) return null; // prevent rendering before user is loaded

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h2>Instructor Dashboard</h2>
                <div className="admin-info">
                    <span>Welcome, <strong>{currentInstructor.fullName}</strong></span>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
                <div className="tabs">
                    {["profile","users","courses" ].map((tab) => (
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

            <div className="tab-content">
                {activeTab === "profile" && <Profile admin={currentInstructor} />}
                
                {activeTab === "courses" && !selectedCourseId && (
                    <Course
                        courses={courses}
                        setCourses={setCourses}
                        onManageQuiz={(courseId) => setSelectedCourseId(courseId)}
                        isInstructor={true} // hide admin-only actions
                    />
                )}
                
                {activeTab === "courses" && selectedCourseId && (
                    <QuizPage courseId={selectedCourseId} onBack={() => setSelectedCourseId(null)} />
                )}

                {activeTab === "users" && (
                    <UserManagement />
                )}
                
            </div>
        </div>
    );
}
