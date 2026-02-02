import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Award, Brain, ArrowRight, RotateCcw, PlayCircle, Star, ExternalLink, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Simple hash function for question text
const hashQuestion = (text) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};

const QuizComponent = ({ topicId, quizData, topicData, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);
  const [questionStats, setQuestionStats] = useState({});
  const [currentQuestionStats, setCurrentQuestionStats] = useState(null);

  const { completeQuiz, user } = useAuth();

  const question = quizData[currentQuestion];
  const totalQuestions = quizData.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // Fetch question stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/user/question-stats/${topicId}`);
        if (response.ok) {
          const data = await response.json();
          setQuestionStats(data.stats || {});
        }
      } catch (error) {
        console.log('Could not fetch question stats');
      }
    };
    fetchStats();
  }, [topicId]);

  const handleAnswerSelect = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === question.correct;
    setShowResult(true);

    if (isCorrect) {
      setScore(score + 1);
    }

    setAnswers([...answers, { questionIndex: currentQuestion, selectedAnswer, isCorrect }]);

    // Update question stats in backend
    const questionHash = hashQuestion(question.question);
    const token = localStorage.getItem('token');

    try {
      await fetch('http://localhost:3000/api/user/question-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topicId,
          questionHash,
          isCorrect
        })
      });

      // Update local stats for immediate display
      const currentStats = questionStats[questionHash] || { correctPercentage: 0, wrongPercentage: 0, totalAttempts: 0 };
      const newTotal = currentStats.totalAttempts + 1;
      const newCorrect = isCorrect
        ? Math.round(((currentStats.correctPercentage / 100) * currentStats.totalAttempts + 1) / newTotal * 100)
        : Math.round(((currentStats.correctPercentage / 100) * currentStats.totalAttempts) / newTotal * 100);

      setCurrentQuestionStats({
        correctPercentage: newCorrect,
        wrongPercentage: 100 - newCorrect,
        totalAttempts: newTotal
      });
    } catch (error) {
      console.log('Could not update question stats');
    }
  };

  const handleNext = async () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setCurrentQuestionStats(null); // Reset stats for next question
    } else {
      const finalScore = score + (selectedAnswer === question.correct ? 1 : 0);

      // Collect all incorrect answers for insights
      const allAnswers = [...answers, { questionIndex: currentQuestion, selectedAnswer, isCorrect: selectedAnswer === question.correct }];
      const incorrectAnswers = allAnswers.filter(a => !a.isCorrect);

      setQuizComplete(true);

      // Award XP points by calling the completeQuiz API
      if (completeQuiz && !xpAwarded && topicData) {
        try {
          // Use the subject/course name from topicData
          const courseName = topicData.domain || 'General';
          const quizTitle = topicData.label || 'Quiz';

          const result = await completeQuiz(courseName, topicId, quizTitle, finalScore, totalQuestions);

          if (result) {
            setXpAwarded(true);
          }

          // Save weak areas if there are incorrect answers
          if (incorrectAnswers.length > 0) {
            const token = localStorage.getItem('token');
            if (token) {
              const wrongQuestions = incorrectAnswers.map(a => ({
                question: quizData[a.questionIndex].question,
                correctAnswer: quizData[a.questionIndex].options[quizData[a.questionIndex].correct]
              }));

              await fetch('http://localhost:3000/api/user/save-weak-areas', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  courseName,
                  topicId,
                  topicLabel: quizTitle,
                  wrongQuestions
                })
              });
              console.log('📊 Weak areas saved for insights:', wrongQuestions.length, 'questions');
            }
          }
        } catch (error) {
          console.error('Error completing quiz:', error);
        }
      }

      if (onComplete) {
        onComplete({ score: finalScore, total: totalQuestions });
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizComplete(false);
    setXpAwarded(false);
  };

  if (quizComplete) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 70;
    const incorrectAnswers = answers.filter(a => !a.isCorrect);

    return (
      <div className="bg-slate-800 rounded-xl p-8">
        <div className="text-center">
          <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${passed ? 'bg-green-500/20' : 'bg-orange-500/20'
            }`}>
            {passed ? (
              <Award className="w-12 h-12 text-green-400" />
            ) : (
              <Brain className="w-12 h-12 text-orange-400" />
            )}
          </div>

          <h2 className="text-3xl font-bold mb-4">
            {passed ? 'Congratulations!' : 'Keep Learning!'}
          </h2>

          {/* XP Awarded */}
          {xpAwarded && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 font-bold text-xl">+10 XP</span>
            </div>
          )}

          {/* Score Summary */}
          <div className="bg-slate-900 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Quiz Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-green-400">{score}</p>
                <p className="text-sm text-gray-400">Correct</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-400">{totalQuestions - score}</p>
                <p className="text-sm text-gray-400">Wrong</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-400">{percentage}%</p>
                <p className="text-sm text-gray-400">Score</p>
              </div>
            </div>
          </div>

          {passed ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
              <p className="text-green-400">
                Excellent work! You've demonstrated strong understanding of this topic.
              </p>
            </div>
          ) : (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
              <p className="text-orange-400">
                Review the material and try again to achieve 70% or higher.
              </p>
            </div>
          )}

          {/* Review incorrect answers with video recommendations */}
          {incorrectAnswers.length > 0 && (
            <div className="bg-slate-900 rounded-lg p-6 mb-6 text-left">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Review Incorrect Answers
              </h3>

              {incorrectAnswers.map((answer, index) => {
                const q = quizData[answer.questionIndex];
                return (
                  <div key={index} className="mb-4 pb-4 border-b border-slate-700 last:border-0">
                    <p className="font-medium mb-2">{q.question}</p>
                    <p className="text-sm text-red-400 mb-1">
                      Your answer: {q.options[answer.selectedAnswer]}
                    </p>
                    <p className="text-sm text-green-400 mb-2">
                      Correct answer: {q.options[q.correct]}
                    </p>
                    <p className="text-sm text-gray-400">{q.explanation}</p>
                  </div>
                );
              })}

              {/* Video Recommendations */}
              {topicData?.videos && topicData.videos.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-blue-400" />
                    Recommended Video Lectures to Review
                  </h4>
                  <div className="space-y-3">
                    {topicData.videos.slice(0, 3).map((video, index) => (
                      <a
                        key={index}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors group"
                      >
                        <div className="bg-slate-700 w-16 h-12 rounded flex items-center justify-center flex-shrink-0">
                          <PlayCircle className="w-6 h-6 text-white/50 group-hover:text-white/80 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{video.title}</p>
                          <p className="text-xs text-gray-400">{video.channel} • {video.duration}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg"
            >
              <RotateCcw className="w-4 h-4" />
              Retry Quiz
            </button>
            {passed && (
              <button
                onClick={() => onComplete?.({ score, total: totalQuestions, passed: true })}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg"
              >
                Continue Learning
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Question {currentQuestion + 1} of {totalQuestions}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-6">{question.question}</h3>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = question.correct === index;
            const showCorrect = showResult && isCorrect;
            const showIncorrect = showResult && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${showCorrect
                  ? 'border-green-500 bg-green-500/10'
                  : showIncorrect
                    ? 'border-red-500 bg-red-500/10'
                    : isSelected
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 hover:border-slate-600 bg-slate-900'
                  } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showCorrect && <CheckCircle className="w-5 h-5 text-green-400" />}
                  {showIncorrect && <XCircle className="w-5 h-5 text-red-400" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      {showResult && (
        <div className={`mb-6 p-4 rounded-lg border ${selectedAnswer === question.correct
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-red-500/10 border-red-500/30'
          }`}>
          <p className={`font-medium mb-2 ${selectedAnswer === question.correct ? 'text-green-400' : 'text-red-400'
            }`}>
            {selectedAnswer === question.correct ? 'Correct!' : 'Incorrect'}
          </p>
          <p className="text-gray-300 mb-3">{question.explanation}</p>

          {/* Peer Comparison Stats */}
          {currentQuestionStats && currentQuestionStats.totalAttempts > 0 && (
            <div className="flex items-center gap-2 pt-3 border-t border-slate-600">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">
                {selectedAnswer === question.correct ? (
                  <>
                    <span className="text-green-400 font-medium">{currentQuestionStats.correctPercentage}%</span>
                    {' '}of learners got this right
                  </>
                ) : (
                  <>
                    <span className="text-red-400 font-medium">{currentQuestionStats.wrongPercentage}%</span>
                    {' '}of learners also got this wrong
                  </>
                )}
                <span className="text-slate-500 ml-1">
                  ({currentQuestionStats.totalAttempts} {currentQuestionStats.totalAttempts === 1 ? 'attempt' : 'attempts'})
                </span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <div className="text-sm text-gray-400">
          Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
        </div>

        <div className="flex gap-3">
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              {currentQuestion < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;
