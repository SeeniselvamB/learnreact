import React, { useState, useEffect } from "react";
import * as api from "../../api";
import "../../styles/AdminQuiz.css";

export default function QuizPage({ courseId: propCourseId }) {
    const [course, setCourse] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [localQuizzes, setLocalQuizzes] = useState([]);
    const [newQuiz, setNewQuiz] = useState({ question: "", options: ["", "", "", ""], correctIndex: 0 });
    const [editingBackendQuiz, setEditingBackendQuiz] = useState(null);
    const [editingLocalIndex, setEditingLocalIndex] = useState(null);

    const courseId = propCourseId; 

    useEffect(() => {
        if (!courseId) return;

        const fetchData = async () => {
            try {
                const courses = await api.getAllCourses();
                const c = courses.find(c => c.id === parseInt(courseId));
                setCourse(c);

                const data = await api.getQuizzesByCourse(courseId);
                setQuizzes(data);
            } catch (err) {
                console.error("Error fetching quizzes:", err);
            }
        };

        fetchData();
    }, [courseId]);

    
    const handleAddLocalQuiz = () => {
        if (!newQuiz.question.trim()) { alert("Please enter a question!"); return; }

        if (editingLocalIndex !== null) {
            const updated = [...localQuizzes];
            updated[editingLocalIndex] = newQuiz;
            setLocalQuizzes(updated);
            setEditingLocalIndex(null);
        } else {
            setLocalQuizzes([...localQuizzes, newQuiz]);
        }

        setNewQuiz({ question: "", options: ["", "", "", ""], correctIndex: 0 });
    };

    const handleSaveAll = async () => {
        if (localQuizzes.length === 0) { alert("No quizzes to save!"); return; }

        try {
            for (const quiz of localQuizzes) {
                await api.addQuiz(parseInt(courseId), quiz);
            }
            const data = await api.getQuizzesByCourse(courseId);
            setQuizzes(data);
            setLocalQuizzes([]);
            alert("All quizzes saved successfully!");
        } catch (err) {
            console.error("Error saving quizzes:", err);
        }
    };

    const handleEditBackendQuiz = (quiz) => {
        setEditingBackendQuiz(quiz);
        setNewQuiz({ question: quiz.question, options: quiz.options, correctIndex: quiz.correctIndex });
    };

    const handleUpdateBackendQuiz = async () => {
        if (!editingBackendQuiz) return;
        try {
            await api.updateQuiz(editingBackendQuiz.id, { ...newQuiz, courseId: parseInt(courseId) });
            const updated = await api.getQuizzesByCourse(courseId);
            setQuizzes(updated);
            setEditingBackendQuiz(null);
            setNewQuiz({ question: "", options: ["", "", "", ""], correctIndex: 0 });
            alert("Quiz updated successfully!");
        } catch (err) { console.error(err); }
    };

    const handleDeleteQuiz = async (id) => {
        if (!window.confirm("Delete this quiz?")) return;
        try {
            await api.deleteQuiz(id);
            const data = await api.getQuizzesByCourse(courseId);
            setQuizzes(data);
        } catch (err) { console.error(err); }
    };

    const handleEditLocalQuiz = (index) => { setNewQuiz(localQuizzes[index]); setEditingLocalIndex(index); };
    const handleDeleteLocalQuiz = (index) => { setLocalQuizzes(localQuizzes.filter((_, i) => i !== index)); };
    const handleCancelEdit = () => { setNewQuiz({ question: "", options: ["", "", "", ""], correctIndex: 0 }); setEditingBackendQuiz(null); setEditingLocalIndex(null); };

    return (
        <div className="quizpage-container">
            <h2>Quiz Management for "{course?.title}"</h2>

            {/* Quiz Input Form */}
            <div className="quiz-form">
                <input
                    type="text"
                    placeholder="Question"
                    value={newQuiz.question}
                    onChange={e => setNewQuiz({ ...newQuiz, question: e.target.value })}
                />
                {newQuiz.options.map((opt, i) => (
                    <input
                        key={i}
                        type="text"
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={e => {
                            const updatedOptions = [...newQuiz.options];
                            updatedOptions[i] = e.target.value;
                            setNewQuiz({ ...newQuiz, options: updatedOptions });
                        }}
                    />
                ))}
                <input
                    type="number"
                    min="0"
                    max="3"
                    placeholder="Correct Index"
                    value={newQuiz.correctIndex}
                    onChange={e => setNewQuiz({ ...newQuiz, correctIndex: parseInt(e.target.value) })}
                />
                <button onClick={editingBackendQuiz ? handleUpdateBackendQuiz : editingLocalIndex !== null ? handleAddLocalQuiz : handleAddLocalQuiz}>
                    {editingBackendQuiz ? "Update Saved Quiz" : editingLocalIndex !== null ? "Update Local Quiz" : "Add Quiz"}
                </button>
                <button onClick={handleCancelEdit}>Cancel</button>
            </div>

            {/* Unsaved Local Quizzes */}
            {localQuizzes.length > 0 && (
                <div className="unsaved-quizzes">
                    <h3>Unsaved Quizzes</h3>
                    <ul>
                        {localQuizzes.map((q, idx) => (
                            <li key={idx}>
                                <strong>{q.question}</strong>
                                <ul>{q.options.map((o, i) => <li key={i}>{o}</li>)}</ul>
                                <p>Correct Index: {q.correctIndex}</p>
                                <button onClick={() => handleEditLocalQuiz(idx)}>Edit</button>
                                <button onClick={() => handleDeleteLocalQuiz(idx)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <button className="save-all-btn" onClick={handleSaveAll}>Save All Quizzes</button>
                </div>
            )}

            {/* Saved Quizzes from Backend */}
            <div className="saved-quizzes">
                <h3>Saved Quizzes</h3>
                <ul className="quiz-list">
                    {quizzes.map(q => (
                        <li key={q.id}>
                            <strong>{q.question}</strong>
                            <ul>{q.options.map((o, idx) => <li key={idx}>{o}</li>)}</ul>
                            <p>Correct Index: {q.correctIndex}</p>
                            <button onClick={() => handleEditBackendQuiz(q)}>Edit</button>
                            <button onClick={() => handleDeleteQuiz(q.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
