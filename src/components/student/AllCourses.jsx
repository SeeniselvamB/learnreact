import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../../api";
import "../../styles/StudentCourse.css";

export default function AllCourses({ username, setMyCourses }) {
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const allCourses = await api.getAllCourses();
            setCourses(allCourses);

            const loggedUser = JSON.parse(localStorage.getItem("user"));
            if (loggedUser?.id) {
                const enrolledData = await api.getStudentEnrollments(loggedUser.id);
                setEnrollments(enrolledData);
            }
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEnroll = async (course) => {
        try {
            const loggedUser = JSON.parse(localStorage.getItem("user"));
            if (!loggedUser) return;

            await api.enrollCourse(course.id, loggedUser.id);

            alert("Enrolled successfully!");
            // Refresh data from backend so it persists across reloads
            fetchData();
        } catch (err) {
            console.error("Enrollment error:", err);
        }
    };

    const getEnrollment = (courseId) =>
        enrollments.find((e) => e.courseId === courseId);

    return (
        <div className="courses-section">
            <h3>All Available Courses</h3>
            <div className="courses-grid">
                {courses.map((course) => {
                    const enrollment = getEnrollment(course.id);
                    const status = enrollment?.status;
                    const score = enrollment?.score;

                    return (
                        <div key={course.id} className="course-card">
                            <h4>{course.title}</h4>
                            <p>{course.description}</p>

                            {!status && (
                                <button
                                    className="enroll-btn"
                                    onClick={() => handleEnroll(course)}
                                >
                                    Enroll
                                </button>
                            )}

                            {status === "ENROLLED" && (
                                <button
                                    className="start-quiz-btn" disabled
                                    onClick={() =>
                                        navigate(`/student/quiz/${course.id}`)
                                    }
                                >
                                    Start Quiz
                                </button>
                            )}

                            {status === "COMPLETED" && (
                                <button className="completed-btn" disabled>
                                    Completed (Score: {score})
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


