import React, { useEffect, useState } from "react";
import * as api from "../../api";
import "../../styles/StudentQuizPage.css";

export default function QuizPage({ courseId, onClose }) {
    const [quizzes, setQuizzes] = useState([]);
    const [answers, setAnswers] = useState({});

    const fetchQuizzes = async () => {
        try {
            const data = await api.getQuizzesByCourse(courseId);
            setQuizzes(data);
        } catch (err) {
            console.error("Error fetching quizzes:", err);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, [courseId]);

    const handleAnswerChange = (quizIndex, optionIndex) => {
        setAnswers({ ...answers, [quizIndex]: optionIndex });
    };

    const handleSubmitQuiz = async () => {
        try {
            let score = 0;
            quizzes.forEach((quiz, index) => {
                if (answers[index] === quiz.correctIndex) score++;
            });

            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) return;

            await api.completeCourse(courseId, user.id, score);

            alert(`Quiz submitted! Your score: ${score}/${quizzes.length}`);
            if (onClose) onClose();
        } catch (err) {
            console.error("Error submitting quiz:", err);
        }
    };

    return (
        <div className="quizpage-container">
            <h2>Course Quiz</h2>
            <button className="close-quiz-btn" onClick={onClose}>Close Quiz</button>

            {quizzes.length === 0 ? (
                <p>No quizzes available for this course.</p>
            ) : (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmitQuiz();
                    }}
                >
                    {quizzes.map((quiz, qIndex) => (
                        <div key={quiz.id} className="quiz-question">
                            <h4>{quiz.question}</h4>
                            <ul>
                                {quiz.options.map((option, oIndex) => (
                                    <li key={oIndex}>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`quiz-${qIndex}`}
                                                value={oIndex}
                                                checked={answers[qIndex] === oIndex}
                                                onChange={() => handleAnswerChange(qIndex, oIndex)}
                                            />
                                            {option}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <button type="submit" className="submit-btn">Submit Quiz</button>
                </form>
            )}
        </div>
    );
}
