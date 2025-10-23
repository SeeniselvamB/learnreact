import React, { useEffect, useState } from "react";
import * as api from "../../api";
import "../../styles/UserManagement.css";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        role: "STUDENT",
        password: "",
    });
    const [editUser, setEditUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [modalUser, setModalUser] = useState(null);
    const [enrollmentsMap, setEnrollmentsMap] = useState({});
    const [coursesMap, setCoursesMap] = useState({});

    useEffect(() => {
        fetchUsers();
        fetchCourses();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.getAllUsers();
            setUsers(res);
            fetchEnrollments(res);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const fetchCourses = async () => {
        try {
            const allCourses = await api.getAllCourses();
            const map = {};
            allCourses.forEach((c) => (map[c.id] = c.title));
            setCoursesMap(map);
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    };

    const fetchEnrollments = async (userList) => {
        const map = {};
        for (const u of userList) {
            try {
                const enrolledCourses = await api.getStudentEnrollments(u.id);
                map[u.id] = enrolledCourses;
            } catch (err) {
                console.error(`Error fetching enrollments for user ${u.id}:`, err);
                map[u.id] = [];
            }
        }
        setEnrollmentsMap(map);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isValidPassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
        return regex.test(password);
    };

    // Add User
    const handleAddUser = async (e) => {
        e.preventDefault();

        if (!isValidPassword(formData.password)) {
            alert(
                "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character."
            );
            return;
        }

        try {
            await api.register(formData); // backend should return 409 if email exists
            handleCloseForm();
            fetchUsers();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                alert("Email already exists");
            } else {
                console.error("Error adding user:", err);
                alert("Server error. Please try again.");
            }
        }
    };

    // Edit User
    const handleEditUser = (user) => {
        setEditUser(user);
        setFormData({
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            role: user.role,
            password: "",
        });
        setShowForm(true);
    };

    // Update User
    const handleUpdateUser = async (e) => {
        e.preventDefault();

        if (formData.password && !isValidPassword(formData.password)) {
            alert(
                "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character."
            );
            return;
        }

        try {
            await api.updateUser(editUser.id, formData);
            handleCloseForm();
            fetchUsers();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                alert("Email already exists");
            } else {
                console.error("Error updating user:", err);
                alert("Server error. Please try again.");
            }
        }
    };

    // Delete User
    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.deleteUser(id);
            fetchUsers();
        } catch (err) {
            console.error("Error deleting user:", err);
        }
    };

    const handleOpenAddForm = () => {
        setEditUser(null);
        setFormData({
            fullName: "",
            username: "",
            email: "",
            role: "STUDENT",
            password: "",
        });
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditUser(null);
        setFormData({
            fullName: "",
            username: "",
            email: "",
            role: "STUDENT",
            password: "",
        });
    };

    const handleViewCourses = (user) => {
        const courses = enrollmentsMap[user.id] || [];
        setModalUser({ user, courses });
    };

    return (
        <div className="manageuser-container">
            {/* Header */}
            <div className="manageuser-header">
                <h2>Manage Users</h2>
                <div className="add-btn-container">
                    <button className="add-btn" onClick={handleOpenAddForm}>
                        Add User
                    </button>
                </div>
            </div>

            {/* User Table */}
            <table className="manageuser-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Full Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                        <th>Courses</th>
                    </tr>
                </thead>
                <tbody>
                    {users
                        .filter((u) => u.role === "STUDENT") // show only students
                        .map((u, idx) => {
                            const enrollments = enrollmentsMap[u.id] || [];
                            const courseText =
                                enrollments.length === 0
                                    ? "None"
                                    : `${enrollments.length} Course${enrollments.length > 1 ? "s" : ""}`;

                            return (
                                <tr key={u.id} className="manageuser-row">
                                    <td>{idx + 1}</td>
                                    <td>{u.fullName}</td>
                                    <td>{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`role-badge ${u.role.toLowerCase()}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="edit-btn" onClick={() => handleEditUser(u)}>
                                            Edit
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDeleteUser(u.id)}>
                                            Delete
                                        </button>
                                    </td>
                                    <td className="courses-cell">
                                        <span>{courseText}</span>
                                        {enrollments.length > 0 && (
                                            <button className="view-btn-right" onClick={() => handleViewCourses(u)}>
                                                View
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>

            {/* Add/Edit Side Form */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editUser ? "Edit User" : "Add New User"}</h3>
                            <button className="close-btn" onClick={handleCloseForm}>
                                ×
                            </button>
                        </div>

                        <form
                            className="manageuser-form"
                            onSubmit={editUser ? handleUpdateUser : handleAddUser}
                        >
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />

                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />

                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                            <label>Role</label>
                            <select name="role" value={formData.role} onChange={handleChange}>
                                <option value="STUDENT">STUDENT</option>
                            </select>

                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={editUser ? "Leave blank to keep current password" : ""}
                                required={!editUser}
                            />

                            <button type="submit" className="save-btn">
                                {editUser ? "Update User" : "Add User"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Course Modal */}
            {modalUser && (
                <div className="modal-overlay">
                    <div className="modal-content slide-in">
                        <div className="modal-header">
                            <h3>{modalUser.user.fullName}'s Courses</h3>
                            <button className="close-btn" onClick={() => setModalUser(null)}>
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <table className="modal-table">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Course Name</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalUser.courses.map((c, idx) => (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td>{coursesMap[c.courseId] || "Unknown"}</td>
                                            <td>
                                                <span
                                                    className={`course-score ${
                                                        c.score !== null ? "completed" : "not-started"
                                                    }`}
                                                >
                                                    {c.score !== null ? c.score : "Not Started"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

