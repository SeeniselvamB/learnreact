import React, { useState, useEffect } from "react";
import "../../styles/AdminCourseForm.css";

export default function CourseForm({ courseData, onSave, onCancel }) {
    const [course, setCourse] = useState({ title: "", description: "" });

    useEffect(() => { 
        if (courseData) setCourse(courseData); 
    }, [courseData]);

    const handleSave = () => {
        if (!course.title.trim() || !course.description.trim()) {
            alert("Both Title and Description are required!");
            return;
        }
        onSave(course);
    };

    return (
        <div className="course-form-container">
            <h2 className="course-form-title">
                {courseData ? "Edit Course" : "Add New Course"}
            </h2>

            <div className="course-form-field">
                <label>Course Title</label>
                <input
                    type="text"
                    placeholder="Enter course title"
                    value={course.title}
                    onChange={e => setCourse({ ...course, title: e.target.value })}
                />
            </div>

            <div className="course-form-field">
                <label>Course Description</label>
                <textarea
                    placeholder="Enter course description"
                    value={course.description}
                    onChange={e => setCourse({ ...course, description: e.target.value })}
                />
            </div>

            <div className="course-form-buttons">
                <button type="button" className="save-btn" onClick={handleSave}>
                    {courseData ? "Save Changes" : "Add Course"}
                </button>
                <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}
