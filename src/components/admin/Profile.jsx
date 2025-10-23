import React from "react";
import "../../styles/AdminProfile.css";

export default function Profile({ admin }) {
    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <h2>Admin Profile</h2>
                </div>
                <div className="profile-details">
                    <div className="detail-item">
                        <span className="label">Full Name:</span>
                        <span className="value">{admin.fullName}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Username:</span>
                        <span className="value">{admin.username}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Role:</span>
                        <span className="value">{admin.role}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
