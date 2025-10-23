import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api";
import "../styles/Guest.css";

export default function Guest() {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const allCourses = await api.getAllCourses();
                setCourses(allCourses);
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };
        fetchCourses();
    }, []);

    const handleEnrollClick = (course) => {
        alert("Please login to enroll in this course.");
        localStorage.setItem("pendingEnrollCourse", course.id);
        navigate("/auth?mode=login");
    };

    return (
        <div className="guest-container">
            <h2 className="guest-title">Available Courses</h2>
            <div className="guest-courses-grid">
                {courses.map((course) => (
                    <div key={course.id} className="guest-course-card">
                        <div className="course-header">
                            <h4>{course.title}</h4>
                        </div>
                        <p className="course-description">{course.description}</p>
                        <button
                            className="guest-enroll-btn"
                            onClick={() => handleEnrollClick(course)}
                        >
                            Enroll
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
