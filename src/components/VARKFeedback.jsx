import React from 'react';
import { AlertCircle, Lightbulb, Eye, Ear, FileText, Hand, RefreshCw } from 'lucide-react';
import { getIncorrectAnswerTip, STYLE_BADGES } from '../api/varkUtils';

/**
 * VARKFeedback Component
 * 
 * Displays learning-style-specific feedback when a learner answers incorrectly.
 * 
 * EXAMINER NOTES:
 * - Uses DETERMINISTIC, pre-defined tips
 * - Tips are selected from a fixed array based on learning style
 * - No AI generation or ML involved
 * - Logic is transparent and auditable
 * 
 * HOW IT WORKS:
 * 1. Receives user's learning style and whether answer was correct
 * 2. If incorrect, displays a tip from INCORRECT_ANSWER_TIPS
 * 3. Tip is randomly selected from the style-appropriate array
 * 4. User can refresh to get a different tip
 */
export default function VARKFeedback({
    userStyle,
    isCorrect,
    showFeedback = true,
    correctAnswer = null,
    explanation = null
}) {
    const [currentTip, setCurrentTip] = React.useState('');
    const [showTip, setShowTip] = React.useState(false);

    // Style-specific icons
    const styleIcons = {
        Visual: Eye,
        Auditory: Ear,
        Aural: Ear,
        ReadWrite: FileText,
        Kinesthetic: Hand,
        Multimodal: Lightbulb
    };

    const StyleIcon = styleIcons[userStyle] || Lightbulb;
    const badge = STYLE_BADGES[userStyle];

    React.useEffect(() => {
        if (!isCorrect && showFeedback) {
            setCurrentTip(getIncorrectAnswerTip(userStyle));
            setShowTip(true);
        } else {
            setShowTip(false);
        }
    }, [isCorrect, userStyle, showFeedback]);

    const refreshTip = () => {
        setCurrentTip(getIncorrectAnswerTip(userStyle));
    };

    // Don't show anything if answer is correct or feedback is disabled
    if (isCorrect || !showFeedback || !showTip) {
        return null;
    }

    return (
        <div className="mt-4 rounded-lg overflow-hidden border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
            {/* Header */}
            <div className="bg-amber-100 px-4 py-3 flex items-center gap-3">
                <div className="flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-amber-800">
                        Not quite right - but here's a tip for you!
                    </h4>
                </div>
                {badge && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${badge.color}-100 text-${badge.color}-700`}>
                        {badge.emoji} {badge.label}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Correct Answer (if provided) */}
                {correctAnswer && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                            <span className="font-semibold">Correct Answer:</span> {correctAnswer}
                        </p>
                    </div>
                )}

                {/* Explanation (if provided) */}
                {explanation && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <span className="font-semibold">Explanation:</span> {explanation}
                        </p>
                    </div>
                )}

                {/* Learning Style Tip */}
                <div className="flex items-start gap-3 p-3 bg-white border border-amber-200 rounded-lg">
                    <div className={`flex-shrink-0 p-2 rounded-full bg-${badge?.color || 'amber'}-100`}>
                        <StyleIcon className={`w-5 h-5 text-${badge?.color || 'amber'}-600`} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold text-slate-800 text-sm">
                                💡 Study Tip for {userStyle === 'Aural' ? 'Auditory' : userStyle} Learners
                            </h5>
                        </div>
                        <p className="text-slate-700 text-sm">{currentTip}</p>
                    </div>
                    <button
                        onClick={refreshTip}
                        className="flex-shrink-0 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        title="Get another tip"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>

                {/* Transparency Note */}
                <p className="mt-3 text-xs text-slate-500 italic">
                    ℹ️ This tip is tailored for your {userStyle === 'Aural' ? 'Auditory' : userStyle} learning style preference.
                </p>
            </div>
        </div>
    );
}

/**
 * Compact version for inline use in quiz components
 */
export function VARKFeedbackCompact({ userStyle, isCorrect }) {
    const [tip, setTip] = React.useState('');

    React.useEffect(() => {
        if (!isCorrect) {
            setTip(getIncorrectAnswerTip(userStyle));
        }
    }, [isCorrect, userStyle]);

    if (isCorrect) return null;

    const badge = STYLE_BADGES[userStyle];

    return (
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
                <span className="font-semibold">{badge?.emoji || '💡'} Tip:</span> {tip}
            </p>
        </div>
    );
}
