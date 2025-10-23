import React, { useEffect, useState } from "react";
import * as api from "../../api";
import "../../styles/UserManagement.css";

export default function Instructor() {
    const [instructors, setInstructors] = useState([]);
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        role: "INSTRUCTOR",
    });
    const [editInstructor, setEditInstructor] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            const res = await api.getAllUsers();
            const filtered = res.filter(u => u.role === "INSTRUCTOR");
            setInstructors(filtered);
        } catch (err) {
            console.error("Error fetching instructors:", err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isValidPassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
        return regex.test(password);
    };

    const handleAddInstructor = async (e) => {
        e.preventDefault();
        if (!isValidPassword(formData.password)) {
            alert(
                "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character."
            );
            return;
        }

        try {
            await api.register(formData); // Backend adds instructor
            handleCloseForm();
            fetchInstructors();
            alert("Instructor added successfully! They can now log in.");
        } catch (err) {
            if (err.response && err.response.status === 409) {
                alert("Email already exists");
            } else {
                console.error("Error adding instructor:", err);
                alert("Server error. Please try again.");
            }
        }
    };

    const handleEditInstructor = (instr) => {
        setEditInstructor(instr);
        setFormData({
            fullName: instr.fullName,
            username: instr.username,
            email: instr.email,
            password: "",
            role: "INSTRUCTOR",
        });
        setShowForm(true);
    };

    const handleUpdateInstructor = async (e) => {
        e.preventDefault();
        if (formData.password && !isValidPassword(formData.password)) {
            alert(
                "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character."
            );
            return;
        }

        try {
            await api.updateUser(editInstructor.id, formData);
            handleCloseForm();
            fetchInstructors();
            alert("Instructor updated successfully!");
        } catch (err) {
            if (err.response && err.response.status === 409) {
                alert("Email already exists");
            } else {
                console.error("Error updating instructor:", err);
                alert("Server error. Please try again.");
            }
        }
    };

    const handleDeleteInstructor = async (id) => {
        if (!window.confirm("Are you sure you want to delete this instructor?")) return;
        try {
            await api.deleteUser(id);
            fetchInstructors();
        } catch (err) {
            console.error("Error deleting instructor:", err);
        }
    };

    const handleOpenAddForm = () => {
        setEditInstructor(null);
        setFormData({
            fullName: "",
            username: "",
            email: "",
            password: "",
            role: "INSTRUCTOR",
        });
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditInstructor(null);
        setFormData({
            fullName: "",
            username: "",
            email: "",
            password: "",
            role: "INSTRUCTOR",
        });
    };

    return (
        <div className="manageuser-container">
            <div className="manageuser-header">
                <h2>Manage Instructors</h2>
                <div className="add-btn-container">
                    <button className="add-btn" onClick={handleOpenAddForm}>
                        Add Instructor
                    </button>
                </div>
            </div>

            {instructors.length === 0 ? (
                <div className="no-data">No instructors available.</div>
            ) : (
                <table className="manageuser-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Full Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {instructors.map((u, idx) => (
                            <tr key={u.id}>
                                <td>{idx + 1}</td>
                                <td>{u.fullName}</td>
                                <td>{u.username}</td>
                                <td>{u.email}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEditInstructor(u)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDeleteInstructor(u.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content slide-in">
                        <div className="modal-header">
                            <h3>{editInstructor ? "Edit Instructor" : "Add New Instructor"}</h3>
                            <button className="close-btn" onClick={handleCloseForm}>×</button>
                        </div>
                        <form
                            className="manageuser-form"
                            onSubmit={editInstructor ? handleUpdateInstructor : handleAddInstructor}
                        >
                            <label>Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />

                            <label>Username</label>
                            <input type="text" name="username" value={formData.username} onChange={handleChange} required />

                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={editInstructor ? "Leave blank to keep current password" : ""}
                                required={!editInstructor}
                            />

                            <button type="submit" className="save-btn">
                                {editInstructor ? "Update Instructor" : "Add Instructor"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
