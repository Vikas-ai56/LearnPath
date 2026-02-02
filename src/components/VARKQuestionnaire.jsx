import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle } from 'lucide-react';

const VARKQuestionnaire = () => {
    const navigate = useNavigate();
    const { submitVARK, fetchVARKResponses, user, token } = useAuth();
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fetchingPrevious, setFetchingPrevious] = useState(true);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!token && !user) {
            navigate('/login', { state: { from: '/vark-questionnaire', message: 'Please log in to take the VARK questionnaire' } });
        }
    }, [token, user, navigate]);

    // Fetch previous responses when component mounts
    useEffect(() => {
        const loadPreviousResponses = async () => {
            try {
                const previousResponses = await fetchVARKResponses();
                if (previousResponses) {
                    setResponses(previousResponses);
                }
            } catch (err) {
                console.error('Error loading previous responses:', err);
            } finally {
                setFetchingPrevious(false);
            }
        };

        if (user) {
            loadPreviousResponses();
        } else {
            setFetchingPrevious(false);
        }
    }, [user, fetchVARKResponses]);

    const questions = [
        {
            id: 'q1',
            question: 'You are helping someone who wants to go to your airport, the center of town or railway station. You would:',
            options: [
                { value: 'a', label: 'Go with her' },
                { value: 'b', label: 'Tell her the directions' },
                { value: 'c', label: 'Write down the directions' },
                { value: 'd', label: 'Draw, or show her a map, or give her a map' }
            ]
        },
        {
            id: 'q2',
            question: 'A website has a video showing how to make a special graph. There is a person speaking, some lists and words describing what to do and some diagrams. You would learn most from:',
            options: [
                { value: 'a', label: 'Seeing the diagrams' },
                { value: 'b', label: 'Listening' },
                { value: 'c', label: 'Reading the words' },
                { value: 'd', label: 'Watching the actions' }
            ]
        },
        {
            id: 'q3',
            question: 'You are planning a vacation for a group. You want some feedback from them about the plan. You would:',
            options: [
                { value: 'a', label: 'Phone, text or email them' },
                { value: 'b', label: 'Give them a copy of the printed itinerary' },
                { value: 'c', label: 'Describe some of the highlights they will experience' },
                { value: 'd', label: 'Use a map to show them the places' }
            ]
        },
        {
            id: 'q4',
            question: 'You are going to cook something as a special treat. You would:',
            options: [
                { value: 'a', label: 'Cook something you know without the need for instructions' },
                { value: 'b', label: 'Ask friends for suggestions' },
                { value: 'c', label: 'Look on the internet or in a cookbook for ideas from the pictures' },
                { value: 'd', label: 'Use a good recipe' }
            ]
        },
        {
            id: 'q5',
            question: 'A group of tourists wants to learn about the parks or wildlife reserves in your area. You would:',
            options: [
                { value: 'a', label: 'Talk about, or arrange a talk for them about parks or wildlife reserves' },
                { value: 'b', label: 'Show them maps and internet pictures' },
                { value: 'c', label: 'Take them to a park or wildlife reserve and walk with them' },
                { value: 'd', label: 'Give them pamphlets or a book on parks or wildlife reserves' }
            ]
        },
        {
            id: 'q6',
            question: 'You are about to purchase a digital camera or mobile phone. Other than price, what would most influence your decision?',
            options: [
                { value: 'a', label: 'Reading the details or checking its features online' },
                { value: 'b', label: 'The salesperson telling me about its features' },
                { value: 'c', label: 'Trying or testing it' },
                { value: 'd', label: 'It is a modern design and looks good' }
            ]
        },
        {
            id: 'q7',
            question: 'Remember a time when you learned how to do something new. Avoid choosing a physical skill, e.g. riding a bike. You learned best by:',
            options: [
                { value: 'a', label: 'Watching a demonstration' },
                { value: 'b', label: 'Listening to somebody explaining it and asking questions' },
                { value: 'c', label: 'Diagrams, maps, and charts - visual clues' },
                { value: 'd', label: 'Written instructions – e.g. a manual or book' }
            ]
        },
        {
            id: 'q8',
            question: 'You have a problem with your heart. You would prefer that the doctor:',
            options: [
                { value: 'a', label: 'Showed you a diagram of what was wrong' },
                { value: 'b', label: 'Gave you something to read to explain what was wrong' },
                { value: 'c', label: 'Described what was wrong' },
                { value: 'd', label: 'Used a plastic model to show what was wrong' }
            ]
        },
        {
            id: 'q9',
            question: 'You want to learn a new program, skill or game on a computer. You would:',
            options: [
                { value: 'a', label: 'Read the written instructions that came with the program' },
                { value: 'b', label: 'Talk with people who know about the program' },
                { value: 'c', label: 'Use the controls or keyboard' },
                { value: 'd', label: 'Follow the diagrams in the book that came with it' }
            ]
        },
        {
            id: 'q10',
            question: 'I like websites that have:',
            options: [
                { value: 'a', label: 'Things I can click on, shift or try' },
                { value: 'b', label: 'Interesting design and visual features' },
                { value: 'c', label: 'Interesting written descriptions, lists and explanations' },
                { value: 'd', label: 'Audio channels where I can hear music, radio programs or interviews' }
            ]
        },
        {
            id: 'q11',
            question: 'Other than price, what would most influence your decision to buy a new non-fiction book?',
            options: [
                { value: 'a', label: 'A friend talks about it and recommends it' },
                { value: 'b', label: 'Quickly reading parts of it' },
                { value: 'c', label: 'The way it looks is appealing' },
                { value: 'd', label: 'Real stories, experiences and examples in the book' }
            ]
        },
        {
            id: 'q12',
            question: 'You are using a book, CD or website to learn how to take photos with your new digital camera. You would like to have:',
            options: [
                { value: 'a', label: 'A chance to ask questions and talk about the camera and its features' },
                { value: 'b', label: 'Clear written instructions with lists and bullet points about what to do' },
                { value: 'c', label: 'Diagrams showing the camera and what each part does' },
                { value: 'd', label: 'Many examples of good and poor photos and how to improve them' }
            ]
        },
        {
            id: 'q13',
            question: 'Do you prefer a teacher or a presenter who uses:',
            options: [
                { value: 'a', label: 'Demonstrations, models or practical sessions' },
                { value: 'b', label: 'Question and answer, talk, group discussion, or guest speakers' },
                { value: 'c', label: 'Handouts, books, or readings' },
                { value: 'd', label: 'Diagrams, charts or graphs' }
            ]
        },
        {
            id: 'q14',
            question: 'You have finished a competition or test and would like some feedback. You would like to have feedback:',
            options: [
                { value: 'a', label: 'Using examples from what you have done' },
                { value: 'b', label: 'Using a written description of your results' },
                { value: 'c', label: 'From somebody who talks it through with you' },
                { value: 'd', label: 'Using graphs showing what you had achieved' }
            ]
        },
        {
            id: 'q15',
            question: 'You are going to choose food at a restaurant or cafe. You would:',
            options: [
                { value: 'a', label: 'Choose something that you have had there before' },
                { value: 'b', label: 'Listen to the waiter or ask friends to recommend choices' },
                { value: 'c', label: 'Choose from the descriptions in the menu' },
                { value: 'd', label: 'Look at what others are eating or look at pictures of each dish' }
            ]
        },
        {
            id: 'q16',
            question: 'You have to make an important speech at a conference or special occasion. You would:',
            options: [
                { value: 'a', label: 'Make diagrams or get graphs to help explain things' },
                { value: 'b', label: 'Write a few key words and practice saying your speech over and over' },
                { value: 'c', label: 'Write out your speech and learn from reading it over several times' },
                { value: 'd', label: 'Gather many examples and stories to make the talk real and practical' }
            ]
        }
    ];

    const handleOptionChange = (questionId, value) => {
        setResponses(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all questions are answered
        if (Object.keys(responses).length < 16) {
            setError('Please answer all questions before submitting.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await submitVARK(responses);
            // Navigate to dashboard after successful submission
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to submit questionnaire');
        } finally {
            setLoading(false);
        }
    };

    const progress = (Object.keys(responses).length / 16) * 100;

    if (fetchingPrevious) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading your preferences...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">Let Us Get To Know About You</h1>
                    <p className="text-gray-300 text-lg">
                        {Object.keys(responses).length > 0
                            ? 'Update your learning preferences by changing any answers below'
                            : 'Please answer all 16 questions to help us personalize your learning experience'
                        }
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">Progress</span>
                        <span className="text-sm text-gray-300">{Object.keys(responses).length}/16</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
                        {error}
                    </div>
                )}

                {/* Questions Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {questions.map((q, index) => (
                        <div key={q.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white mb-4">{q.question}</h3>
                                    <div className="space-y-3">
                                        {q.options.map((option) => (
                                            <label
                                                key={option.value}
                                                className={`flex items-start p-4 rounded-lg cursor-pointer transition-all ${responses[q.id] === option.value
                                                    ? 'bg-purple-600/30 border-2 border-purple-500'
                                                    : 'bg-slate-700/30 border-2 border-transparent hover:border-slate-600'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={q.id}
                                                    value={option.value}
                                                    checked={responses[q.id] === option.value}
                                                    onChange={() => handleOptionChange(q.id, option.value)}
                                                    className="mt-1 mr-3"
                                                />
                                                <span className="text-gray-200">{option.label}</span>
                                                {responses[q.id] === option.value && (
                                                    <CheckCircle className="ml-auto w-5 h-5 text-purple-400 flex-shrink-0" />
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Submit Button */}
                    <div className="flex justify-center pt-6">
                        <button
                            type="submit"
                            disabled={loading || Object.keys(responses).length < 16}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold text-white text-lg shadow-lg hover:shadow-xl transition-all"
                        >
                            {loading ? 'Submitting...' : 'Submit Questionnaire'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VARKQuestionnaire;
