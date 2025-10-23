import React, { useEffect, useState } from "react";
import { getProfile } from "../../api";
import "../../styles/StudentProfile.css";

export default function Profile() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) return;

        const fetchProfile = async () => {
            try {
                const data = await getProfile(storedUser.id);
                setProfile(data);
            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };
        fetchProfile();
    }, []);

    if (!profile) return <p>Loading profile...</p>;

    return (
        <div className="profile-container">
            <div className="profile-avatar">
                {profile.username[0].toUpperCase()}
            </div>
            <div className="profile-info">
                <h2>Student Profile</h2>
                <p><strong>ID:</strong> {profile.id}</p>
                <p><strong>Username:</strong> {profile.username}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Role:</strong> {profile.role}</p>
            </div>
        </div>
    );
}


