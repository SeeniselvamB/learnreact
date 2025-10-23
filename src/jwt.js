// src/jwt.js

// Save JWT token in localStorage
export const setToken = (token) => {
    if (token) localStorage.setItem("jwtToken", token);
};

// Get JWT token from localStorage
export const getToken = () => {
    return localStorage.getItem("jwtToken");
};

// Remove JWT token from localStorage (for logout)
export const clearToken = () => {
    localStorage.removeItem("jwtToken");
};

// Example helper: attach token to axios or fetch requests
export const authHeader = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};
