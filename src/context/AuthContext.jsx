import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [quizProgress, setQuizProgress] = useState({});

    useEffect(() => {
        // Verify token on mount
        if (token) {
            verifyToken();
        } else {
            setLoading(false);
        }
    }, []);

    const verifyToken = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                // Token invalid, clear it
                logout();
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const signup = async (name, email, password) => {
        const response = await fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Signup failed');
        }

        // Store token and user
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);

        return data;
    };

    const login = async (email, password) => {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Store token and user
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);

        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setQuizProgress({});
    };

    const completeQuiz = async (courseName, topicId, quizTitle, score, totalQuestions) => {
        if (!token) return null;

        try {
            const response = await fetch('http://localhost:3000/api/auth/complete-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ courseName, topicId, quizTitle, score, totalQuestions })
            });

            const data = await response.json();

            if (response.ok) {
                // Update token and user with new XP
                localStorage.setItem('token', data.token);
                setToken(data.token);

                // Decode token to get updated user info
                const decoded = JSON.parse(atob(data.token.split('.')[1]));
                setUser(decoded);

                // Refresh quiz progress
                await fetchQuizProgress(courseName);

                return data;
            }
        } catch (error) {
            console.error('Error completing quiz:', error);
        }
        return null;
    };

    const fetchQuizProgress = async (courseName) => {
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:3000/api/auth/quiz-progress/${courseName}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                // Store progress by topic ID for easy lookup
                const progressMap = {};
                data.progress.forEach(p => {
                    progressMap[p.topic_id] = p;
                });
                setQuizProgress(prev => ({ ...prev, [courseName]: progressMap }));
            }
        } catch (error) {
            console.error('Error fetching quiz progress:', error);
        }
    };

    const isQuizCompleted = (courseName, topicId) => {
        return quizProgress[courseName]?.[topicId] !== undefined;
    };

    const submitVARK = async (responses) => {
        if (!token) {
            throw new Error('Please log in to submit the questionnaire');
        }
        try {
            const response = await fetch('http://localhost:3000/api/auth/vark-submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ responses })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
                const decoded = JSON.parse(atob(data.token.split('.')[1]));
                setUser(decoded);
                return data;
            } else {
                throw new Error(data.error || 'Failed to submit questionnaire');
            }
        } catch (error) {
            console.error('Error submitting VARK:', error);
            throw error;
        }
    };

    const fetchVARKResponses = async () => {
        if (!token) return null;
        try {
            const response = await fetch('http://localhost:3000/api/auth/vark-responses', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) return data.responses;
        } catch (error) {
            console.error('Error fetching VARK responses:', error);
        }
        return null;
    };

    const updateLearningStyle = async (learning_style) => {
        if (!token) throw new Error('Not authenticated');
        try {
            const response = await fetch('http://localhost:3000/api/user/vark', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ learning_style })
            });
            const data = await response.json();

            if (response.ok) {
                // Update user state with new learning style
                setUser(prev => ({ ...prev, learningStyle: learning_style }));
                return data;
            } else {
                throw new Error(data.error || 'Failed to update learning style');
            }
        } catch (error) {
            console.error('Error updating learning style:', error);
            throw error;
        }
    };

    // Update user data (e.g., after completing a challenge)
    const updateUser = (userData) => {
        setUser(userData);
    };

    const value = {
        user,
        token,
        loading,
        signup,
        login,
        logout,
        completeQuiz,
        fetchQuizProgress,
        isQuizCompleted,
        quizProgress,
        submitVARK,
        fetchVARKResponses,
        updateLearningStyle,
        updateUser,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
