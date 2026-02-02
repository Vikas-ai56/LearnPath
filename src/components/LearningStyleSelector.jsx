import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Brain, Eye, Ear, BookOpen, Hand, Check } from 'lucide-react';

/**
 * VARK Learning Style Selector Component
 * Allows users to select and update their preferred learning style
 */
const LearningStyleSelector = () => {
    const { user, updateLearningStyle } = useAuth();
    const [selectedStyle, setSelectedStyle] = useState(user?.learningStyle || 'ReadWrite');
    const [isUpdating, setIsUpdating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Learning style options with descriptions and icons
    const learningStyles = [
        {
            value: 'Visual',
            label: 'Visual',
            description: 'Learn best through diagrams, charts, and visual aids',
            icon: Eye,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500'
        },
        {
            value: 'Aural',
            label: 'Aural',
            description: 'Prefer listening to lectures and discussions',
            icon: Ear,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500'
        },
        {
            value: 'ReadWrite',
            label: 'Read/Write',
            description: 'Learn through reading and taking notes',
            icon: BookOpen,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500'
        },
        {
            value: 'Kinesthetic',
            label: 'Kinesthetic',
            description: 'Learn by doing and hands-on experience',
            icon: Hand,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-500/10',
            borderColor: 'border-orange-500'
        },
        {
            value: 'Multimodal',
            label: 'Multimodal',
            description: 'Combine multiple learning styles',
            icon: Brain,
            color: 'from-pink-500 to-pink-600',
            bgColor: 'bg-pink-500/10',
            borderColor: 'border-pink-500'
        }
    ];

    useEffect(() => {
        if (user?.learningStyle) {
            setSelectedStyle(user.learningStyle);
        }
    }, [user]);

    const handleStyleSelect = async (style) => {
        setIsUpdating(true);
        setShowSuccess(false);

        try {
            await updateLearningStyle(style);
            setSelectedStyle(style);
            setShowSuccess(true);

            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Failed to update learning style:', error);
            alert('Failed to update learning style. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                    <Brain className="w-8 h-8 text-blue-400" />
                    Your Learning Style
                </h2>
                <p className="text-gray-400">
                    Select the learning style that works best for you
                </p>
            </div>

            {/* Success Message */}
            {showSuccess && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg flex items-center gap-3 animate-fade-in">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">
                        Learning style updated successfully!
                    </span>
                </div>
            )}

            {/* Current Style Display */}
            <div className="mb-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between">
                    <span className="text-gray-400">Current Style:</span>
                    <span className="text-white font-semibold text-lg">
                        {selectedStyle}
                    </span>
                </div>
            </div>

            {/* Learning Style Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {learningStyles.map((style) => {
                    const Icon = style.icon;
                    const isSelected = selectedStyle === style.value;

                    return (
                        <button
                            key={style.value}
                            onClick={() => handleStyleSelect(style.value)}
                            disabled={isUpdating}
                            className={`
                                relative p-6 rounded-xl border-2 transition-all duration-300
                                ${isSelected 
                                    ? `${style.borderColor} ${style.bgColor} scale-105` 
                                    : 'border-slate-700 bg-slate-800/30 hover:border-slate-600 hover:scale-102'
                                }
                                ${isUpdating ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                                text-left group
                            `}
                        >
                            {/* Selection Indicator */}
                            {isSelected && (
                                <div className="absolute top-3 right-3">
                                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${style.color} flex items-center justify-center`}>
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            )}

                            {/* Icon */}
                            <div className={`mb-4 w-12 h-12 rounded-lg bg-gradient-to-r ${style.color} flex items-center justify-center`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-white mb-2">
                                {style.label}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-gray-400">
                                {style.description}
                            </p>

                            {/* Hover Effect */}
                            <div className={`
                                absolute bottom-0 left-0 right-0 h-1 rounded-b-xl
                                bg-gradient-to-r ${style.color}
                                transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300
                            `} />
                        </button>
                    );
                })}
            </div>

            {/* Info Box */}
            <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                    <Brain className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="text-blue-400 font-semibold mb-2">
                            Why does this matter?
                        </h4>
                        <p className="text-gray-300 text-sm">
                            Understanding your learning style helps us personalize your educational 
                            experience. We'll adapt content delivery to match your preferences, 
                            making learning more effective and enjoyable.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningStyleSelector;
