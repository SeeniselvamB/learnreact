import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Welcome to the Learning Management System</h1>
                <p>Manage courses, track progress, and connect with instructors seamlessly.</p>
                <div className="hero-buttons">
                    <div className="top-buttons">
                    <Link to="/auth?mode=login" className="btn login-btn">Login</Link>
                    <Link to="/auth?mode=register" className="btn register-btn">Register</Link>
                    </div>
                    <div className="bottom-buttons">
                    <Link to="/guest" className="btn guest-btn">Continue as Guest</Link>
                    </div>
                </div>
            </div>

            <div className="features-section">
                <h2>Features</h2>
                <div className="features-cards">
                    <div className="feature-card">
                        <h3>Interactive Courses</h3>
                        <p>Access a wide range of courses with interactive lessons and quizzes.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Track Progress</h3>
                        <p>Monitor your learning progress and achievements in real time.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Instructor Support</h3>
                        <p>Connect with instructors and get guidance whenever you need it.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
