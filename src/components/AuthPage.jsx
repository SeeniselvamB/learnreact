import React, { useState } from "react";
import { login, register } from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/auth.css";

export default function AuthPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get("mode");

    const [isLogin, setIsLogin] = useState(mode !== "register");
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        username: "",
        password: "",
        role: "STUDENT",
    });
    const [error, setError] = useState(null);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const isValidPassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Admin hardcoded login
            if (isLogin && form.username === "Seeniselvam" && form.password === "Selvam@123") {
                const adminUser = { username: "Seeniselvam", fullName: "Seeniselvam", role: "ADMIN" };
                localStorage.setItem("user", JSON.stringify(adminUser));
                navigate("/admin");
                return;
            }

            if (isLogin) {
                // Login
                const user = await login(form.username, form.password);
                const role = user.role?.toUpperCase();
                localStorage.setItem("user", JSON.stringify(user));

                if (role === "STUDENT") navigate("/student");
                else if (role === "INSTRUCTOR") navigate("/instructor");
                else if (role === "ADMIN") navigate("/admin");
                else alert("Unknown role. Contact admin.");
            } else {
                // Registration
                if (!isValidPassword(form.password)) {
                    alert(
                        "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character."
                    );
                    return;
                }

                form.role = "STUDENT";

                try {
                    await register(form);
                    alert("Registration successful! Please login.");
                    setIsLogin(true);
                } catch (err) {
                    if (err.response && err.response.status === 409) {
                        // Handle duplicate email or username
                        const message = err.response.data?.message || "";
                        if (message.includes("email")) {
                            alert("Email already exists");
                        } else if (message.includes("username")) {
                            alert("Username already exists");
                        } else {
                            alert("Email or username already exists");
                        }
                    } else {
                        alert("Server error. Please try again.");
                    }
                }
            }
        } catch (err) {
            alert("Invalid credentials or server error");
            console.error(err);
        }
    };

    return (
        <div className="login-wrap">
            <div className="login-box">
                <h2>{isLogin ? "Login" : "Register"}</h2>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <input
                                name="fullName"
                                placeholder="Full Name"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                            <input
                                name="username"
                                placeholder="User Name"
                                value={form.username}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            <select name="role" value="STUDENT" readOnly>
                                <option value="STUDENT">Student</option>
                            </select>
                        </>
                    )}
                    {isLogin && (
                        <>
                            <input
                                name="username"
                                placeholder="User Name"
                                value={form.username}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </>
                    )}
                    <button type="submit">{isLogin ? "Login" : "Register"}</button>
                </form>
                {error && <p className="error">{error}</p>}
                <p
                    onClick={() => setIsLogin(!isLogin)}
                    className="switch-link"
                >
                    {isLogin ? "New user? Register here" : "Already registered? Login here"}
                </p>
            </div>
        </div>
    );
}
