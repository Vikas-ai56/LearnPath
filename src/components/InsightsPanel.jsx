import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Lightbulb, TrendingUp, BookOpen, RefreshCw, ChevronDown, ChevronUp, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../api/service';

/**
 * InsightsPanel - Displays personalized improvement recommendations
 * 
 * EXAMINER NOTES:
 * - Rule-based insights generation (no ML/AI)
 * - Shows topics where user made mistakes
 * - Provides learning-style-specific improvement tips
 * - Transparent and deterministic recommendations
 */
const InsightsPanel = () => {
    const [insights, setInsights] = useState([]);
    const [summary, setSummary] = useState({ weakTopicCount: 0, totalWrongAnswers: 0 });
    const [learningStyle, setLearningStyle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedTopic, setExpandedTopic] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please log in to see your insights');
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/user/insights`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch insights');
            }

            const data = await response.json();
            setInsights(data.insights || []);
            setSummary(data.summary || { weakTopicCount: 0, totalWrongAnswers: 0 });
            setLearningStyle(data.learningStyle);
            setMessage(data.message);
            setError(null);
        } catch (err) {
            console.error('Error fetching insights:', err);
            setError('Unable to load insights');
        } finally {
            setLoading(false);
        }
    };

    const markAsReviewed = async (topicId, courseName) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_BASE_URL}/user/mark-reviewed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ topicId, courseName })
            });

            // Remove from local state
            setInsights(prev => prev.filter(i => !(i.topicId === topicId && i.courseName === courseName)));
            setSummary(prev => ({
                ...prev,
                weakTopicCount: Math.max(0, prev.weakTopicCount - 1)
            }));
        } catch (err) {
            console.error('Error marking as reviewed:', err);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-500/20 border-red-500/50 text-red-400';
            case 'medium': return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
            default: return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
        }
    };

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'high': return '🔴 Needs Attention';
            case 'medium': return '🟠 Review Recommended';
            default: return '🟡 Minor Gap';
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <p className="text-gray-500 text-center">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <Target className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Your Improvement Areas</h2>
                    </div>
                    <button
                        onClick={fetchInsights}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        title="Refresh insights"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-amber-100 text-sm">Personalized recommendations based on your quiz performance</p>
            </div>

            {/* Summary Stats */}
            {summary.weakTopicCount > 0 && (
                <div className="grid grid-cols-2 gap-4 p-4 border-b border-slate-100 bg-slate-50">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-amber-600">{summary.weakTopicCount}</div>
                        <div className="text-sm text-slate-500">Topics to Review</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{summary.totalWrongAnswers}</div>
                        <div className="text-sm text-slate-500">Questions to Practice</div>
                    </div>
                </div>
            )}

            {/* Insights List */}
            <div className="p-4">
                {insights.length === 0 ? (
                    <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg text-slate-800 mb-2">Great Job!</h3>
                        <p className="text-slate-500">{message || 'No weak areas identified. Keep taking quizzes!'}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {insights.map((insight, index) => (
                            <div
                                key={`${insight.topicId}-${index}`}
                                className={`rounded-lg border-2 overflow-hidden ${getPriorityColor(insight.priority)}`}
                            >
                                {/* Topic Header */}
                                <div
                                    className="p-4 cursor-pointer hover:bg-black/5 transition-colors"
                                    onClick={() => setExpandedTopic(expandedTopic === index ? null : index)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <AlertTriangle className="w-4 h-4" />
                                                <span className="text-xs font-medium uppercase tracking-wide">
                                                    {getPriorityLabel(insight.priority)}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-slate-800">{insight.topicLabel}</h3>
                                            <p className="text-sm text-slate-600">{insight.courseName}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium px-2 py-1 bg-white/50 rounded">
                                                {insight.wrongCount} wrong
                                            </span>
                                            {expandedTopic === index ? (
                                                <ChevronUp className="w-5 h-5 text-slate-400" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-slate-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {expandedTopic === index && (
                                    <div className="border-t border-current/20 p-4 bg-white/50">
                                        {/* Improvement Tips */}
                                        <div className="mb-4">
                                            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                                <Lightbulb className="w-4 h-4 text-amber-500" />
                                                How to Improve ({learningStyle} Style)
                                            </h4>
                                            <ul className="space-y-2">
                                                {insight.improvementTips?.map((tip, tipIndex) => (
                                                    <li key={tipIndex} className="flex items-start gap-2 text-sm text-slate-700">
                                                        <span className="text-amber-500 mt-1">•</span>
                                                        <span>{tip}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3 pt-3 border-t border-slate-200">
                                            <Link
                                                to={`/subject/${insight.courseName}`}
                                                className="flex-1 text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                                            >
                                                <BookOpen className="w-4 h-4 inline mr-2" />
                                                Review Topic
                                            </Link>
                                            <button
                                                onClick={() => markAsReviewed(insight.topicId, insight.courseName)}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                                            >
                                                <CheckCircle className="w-4 h-4 inline mr-2" />
                                                Mark Reviewed
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Tip */}
            {insights.length > 0 && (
                <div className="p-4 bg-blue-50 border-t border-blue-100">
                    <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <p className="text-sm text-blue-800">
                                <strong>Pro Tip:</strong> Focus on high-priority topics first.
                                As a <strong>{learningStyle}</strong> learner, the tips above are tailored to your preferred learning style.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InsightsPanel;
