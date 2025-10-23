import axios from "axios";
import { getToken, setToken} from "./jwt";
const api = axios.create({
    baseURL: "https://learnspring-production.up.railway.app/api",
    // baseURL: "http://localhost:8080/api",
    // baseURL: "https://8080-bebbbaadcbdafadabdcfaceddbbabeaeefcea.premiumproject.examly.io/api",
    headers: { "Content-Type": "application/json" },
});
// ✅ Automatically attach JWT to every request (if available)
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Users
export const register = (user) => api.post("/users/register", user).then(res => res.data);
export const login = async (username, password) => {
    const res = await api.post("/users/login", { username, password });
    const user = res.data;

    // Generate a simple frontend JWT (base64 payload only, not secure)
    if (!user.token) {
        user.token = btoa(JSON.stringify({ id: user.id, username: user.username, role: user.role }));
    }

    setToken(user.token); // Save token in localStorage
    return user;
};
export const getProfile = (id) => api.get(`/users/${id}`).then(res => res.data);
export const getAllUsers = () => api.get("/users").then(res => res.data);
export const deleteUser = (id) => api.delete(`/users/${id}`).then(res => res.data);
export const updateUser = (id, user) => api.put(`/users/${id}`, user).then(res => res.data);

// Courses
export const getAllCourses = () => api.get("/courses").then(res => res.data);
export const addCourse = (course) => api.post("/courses", course).then(res => res.data);
export const updateCourse = (id, course) => api.put(`/courses/${id}`, course).then(res => res.data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`).then(res => res.data);


// Quiz
export const addQuiz = (courseId, quiz) => api.post(`/quiz/${courseId}`, quiz).then(res => res.data);
export const updateQuiz = (quizId, quiz) => api.put(`/quiz/${quizId}`, quiz).then(res => res.data);
export const deleteQuiz = (quizId) => api.delete(`/quiz/${quizId}`).then(res => res.data);
export const getQuizzesByCourse = (courseId) => api.get(`/quiz/course/${courseId}`).then(res => res.data);

// Progress (optional)
export const updateProgress = (courseId, student, progress) =>
    api.put(`/courses/${courseId}/progress`, null, { params: { student, progress } }).then(res => res.data);


// Enrollment
export const enrollCourse = (courseId, studentId) =>
    api.post(`/enrollments/enroll`, null, {
        params: { studentId, courseId },
    }).then(res => res.data);

export const getStudentEnrollments = (studentId) =>
    api.get(`/enrollments/student/${studentId}`).then(res => res.data);

export const completeCourse = (courseId, studentId, score) =>
    api.put(`/enrollments/complete`, null, {
        params: { studentId, courseId, score },
    }).then(res => res.data);


