import React, { useEffect, useState } from "react";
import Profile from "./Profile";
import StudentCourses from "./StudentCourses";
import AllCourses from "./AllCourses";
import QuizPage from "./QuizPage";
import * as api from "../../api";
import "../../styles/StudentDashboard.css";

export default function StudentDashboard() {
    const [activeTab, setActiveTab] = useState("profile");
    const [user, setUser] = useState(null);
    const [quizCourseId, setQuizCourseId] = useState(null); 

    const loggedUser = JSON.parse(localStorage.getItem("user"));
    const userId = loggedUser?.id;

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) return;
            const profileData = await api.getProfile(userId);
            setUser(profileData);
        };
        fetchProfile();
    }, [userId]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/"; // or navigate("/")
    };

    // Callback to open quiz inside dashboard
    const handleStartQuiz = (courseId) => {
        setQuizCourseId(courseId);
        setActiveTab("quiz");
    };

    // Close quiz and go back to My Courses
    const handleCloseQuiz = () => {
        setQuizCourseId(null);
        setActiveTab("enrolled");
    };

    return (
        <div className="dashboard-container">
            <header>
                <h2>Welcome, {user?.fullName || loggedUser?.username}</h2>
                <div className="tabs">
                    <button
                        className={activeTab === "profile" ? "active" : ""}
                        onClick={() => setActiveTab("profile")}
                    >
                        Profile
                    </button>
                    <button
                        className={activeTab === "enrolled" ? "active" : ""}
                        onClick={() => setActiveTab("enrolled")}
                    >
                        My Courses
                    </button>
                    <button
                        className={activeTab === "all" ? "active" : ""}
                        onClick={() => setActiveTab("all")}
                    >
                        All Courses
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            <div className="tab-content">
                {activeTab === "profile" && <Profile user={user} />}
                {activeTab === "enrolled" && (
                    <StudentCourses onStartQuiz={handleStartQuiz} />
                )}
                {activeTab === "all" && <AllCourses />}
                {activeTab === "quiz" && quizCourseId && (
                    <QuizPage courseId={quizCourseId} onClose={handleCloseQuiz} />
                )}
            </div>
        </div>
    );
}
