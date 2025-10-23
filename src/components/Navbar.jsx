import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <nav className="navbar">
            <h1 className="navbar-title">Learning Management System</h1>
            <div className="navbar-links">
                <NavLink to="/" className="nav-link">Home</NavLink>
                
                {isLoggedIn && (
                    <span onClick={handleLogout} className="nav-link interactive-link">
                        Logout
                    </span>
                )}
            </div>
        </nav>
    );
}
