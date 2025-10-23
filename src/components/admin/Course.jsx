import React, { useState, useEffect } from "react";
import CourseForm from "./CourseForm";
import * as api from "../../api";
import "../../styles/AdminCourse.css";

export default function Course({ courses, setCourses, onManageQuiz }) {
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    // ✅ Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 3;

    useEffect(() => {
        if (!courses || courses.length === 0) {
            const fetchCourses = async () => {
                try {
                    const data = await api.getAllCourses();
                    setCourses(data);
                } catch (err) {
                    console.error("Error fetching courses:", err);
                    alert("Failed to fetch courses from backend");
                }
            };
            fetchCourses();
        }
    }, [courses, setCourses]);

    const toggleForm = () => {
        setEditingCourse(null);
        setShowForm(!showForm);
    };

    const handleManageQuizClick = (course) => {
        if (onManageQuiz) onManageQuiz(course.id);
    };

    const handleDeleteCourse = async (course) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            await api.deleteCourse(course.id);
            setCourses(courses.filter((c) => c.id !== course.id));
            alert("Course deleted successfully!");
        } catch (err) {
            console.error("Failed to delete course:", err);
            alert("Failed to delete course.");
        }
    };

    const handleAddCourse = async (course) => {
        try {
            // ✅ Prevent duplicate course title
            const duplicate = courses.find(
                (c) => c.title.trim().toLowerCase() === course.title.trim().toLowerCase()
            );
            if (duplicate) {
                alert(`Course "${course.title}" already exists!`);
                return;
            }

            const added = await api.addCourse(course);
            setCourses([...courses, added]);
            setShowForm(false);
            alert("Course added successfully!");
        } catch (err) {
            console.error("Failed to add course:", err);
            alert("Failed to add course.");
        }
    };

    // ✅ Pagination logic
    const totalPages = Math.ceil(courses.length / coursesPerPage);
    const startIndex = (currentPage - 1) * coursesPerPage;
    const currentCourses = courses.slice(startIndex, startIndex + coursesPerPage);

    const goToPage = (pageNum) => {
        if (pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        }
    };

    return (
        <div className="course-container">
            {!showForm ? (
                <>
                    <button className="add-course-btn" onClick={toggleForm}>
                        Add Course
                    </button>

                    {/* ✅ Course Grid with Pagination */}
                    <div className="courses-grid">
                        {currentCourses.length > 0 ? (
                            currentCourses.map((course) => (
                                <div key={course.id} className="course-card">
                                    <h3 className="course-title">{course.title}</h3>
                                    <p className="course-desc">{course.description}</p>
                                    <div className="course-buttons">
                                        <button
                                            className="manage-btn"
                                            onClick={() => handleManageQuizClick(course)}
                                        >
                                            Manage Quiz
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDeleteCourse(course)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No courses available.</p>
                        )}
                    </div>

                    {/* ✅ Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                ⬅ Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index + 1}
                                    className={currentPage === index + 1 ? "active" : ""}
                                    onClick={() => goToPage(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next ➡
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <CourseForm
                    courseData={editingCourse}
                    onSave={handleAddCourse}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </div>
    );
}
