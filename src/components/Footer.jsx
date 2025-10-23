import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
    const year = new Date().getFullYear();
    const navigate = useNavigate();

    const handleStudentClick = (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.role?.toUpperCase() === "STUDENT") {
            navigate("/student");
        } else {
            navigate("/auth?mode=login");
        }
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                <p className="footer-text">© {year} LMS Lite. All rights reserved.</p>
                <nav className="footer-nav">
                    <Link to="/" className="footer-link">Home</Link>
                    <Link to="/guest" className="footer-link">Guest</Link>
                    <Link 
                        to="/student" 
                        className="footer-link" 
                        onClick={handleStudentClick}
                    >
                        Student
                    </Link>
                </nav>
            </div>
        </footer>
    );
}

export default Footer;
