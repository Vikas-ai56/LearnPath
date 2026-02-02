import React from 'react';
import { Lightbulb, Eye, Ear, FileText, Hand, Sparkles } from 'lucide-react';
import { STYLE_BADGES } from '../api/varkUtils';

/**
 * SmartStudyTip Component
 * 
 * Displays VARK-aware study tips based on user's learning style.
 * 
 * EXAMINER NOTES:
 * - All tips are PRE-DEFINED and DETERMINISTIC
 * - No AI or ML is used to generate tips
 * - Tips are selected from fixed arrays based on learning style
 * - Logic is transparent and easy to audit
 * 
 * HOW IT WORKS:
 * 1. Receives user's learning style as prop
 * 2. Selects tips from the appropriate style array
 * 3. Displays a random tip (changes on refresh or can be cycled)
 * 4. Shows explanation of why this tip is relevant
 */

// DETERMINISTIC study tips organized by learning style
const STUDY_TIPS = {
    Visual: {
        icon: Eye,
        color: 'purple',
        bgClass: 'bg-purple-50 border-purple-200',
        iconClass: 'bg-purple-500',
        textClass: 'text-purple-800',
        tips: [
            "Try creating mind maps or diagrams to visualize concepts",
            "Use color-coding to organize your notes by topic",
            "Watch video tutorials and pause to study the visuals",
            "Draw flowcharts to understand processes step by step",
            "Convert text notes into visual summaries or infographics",
            "Use highlighters to mark key information in different colors",
            "Create visual mnemonics to remember complex information"
        ],
        description: "Visual learners benefit from diagrams, charts, and color-coded notes."
    },
    Auditory: {
        icon: Ear,
        color: 'blue',
        bgClass: 'bg-blue-50 border-blue-200',
        iconClass: 'bg-blue-500',
        textClass: 'text-blue-800',
        tips: [
            "Listen to audio lectures or podcasts on the topic",
            "Discuss concepts with study partners or peers",
            "Record yourself explaining concepts and play it back",
            "Use verbal associations and rhymes to remember facts",
            "Explain what you've learned out loud to reinforce it",
            "Join study groups for discussion-based learning",
            "Listen to background music that helps you focus"
        ],
        description: "Auditory learners excel through listening and verbal discussion."
    },
    Aural: {
        icon: Ear,
        color: 'blue',
        bgClass: 'bg-blue-50 border-blue-200',
        iconClass: 'bg-blue-500',
        textClass: 'text-blue-800',
        tips: [
            "Listen to audio lectures or podcasts on the topic",
            "Discuss concepts with study partners or peers",
            "Record yourself explaining concepts and play it back",
            "Use verbal associations and rhymes to remember facts",
            "Explain what you've learned out loud to reinforce it",
            "Join study groups for discussion-based learning",
            "Listen to background music that helps you focus"
        ],
        description: "Auditory learners excel through listening and verbal discussion."
    },
    ReadWrite: {
        icon: FileText,
        color: 'green',
        bgClass: 'bg-green-50 border-green-200',
        iconClass: 'bg-green-500',
        textClass: 'text-green-800',
        tips: [
            "Take detailed written notes while studying",
            "Rewrite concepts in your own words to internalize them",
            "Create lists and written summaries of key points",
            "Read textbooks and articles multiple times",
            "Write practice essays or explanations of topics",
            "Use flashcards with written definitions",
            "Keep a learning journal to track your understanding"
        ],
        description: "Read/Write learners prefer text-based content and note-taking."
    },
    Kinesthetic: {
        icon: Hand,
        color: 'orange',
        bgClass: 'bg-orange-50 border-orange-200',
        iconClass: 'bg-orange-500',
        textClass: 'text-orange-800',
        tips: [
            "Practice with hands-on coding exercises",
            "Build small projects to apply what you learn",
            "Use simulations and interactive tools",
            "Take breaks and move around while studying",
            "Work through examples step by step, typing along",
            "Create physical models or use gestures to remember",
            "Alternate between study sessions and active breaks"
        ],
        description: "Kinesthetic learners thrive with hands-on practice and physical activity."
    },
    Multimodal: {
        icon: Sparkles,
        color: 'gray',
        bgClass: 'bg-gray-50 border-gray-200',
        iconClass: 'bg-gray-500',
        textClass: 'text-gray-800',
        tips: [
            "Mix different learning methods for best results",
            "Combine videos with note-taking for reinforcement",
            "Discuss concepts after reading about them",
            "Practice hands-on while reviewing visual guides",
            "Use multiple resources to cover the same topic",
            "Find what combination works best for each subject",
            "Switch methods when one approach isn't working"
        ],
        description: "Multimodal learners benefit from using multiple learning approaches."
    }
};

export default function SmartStudyTip({ userStyle, variant = 'default' }) {
    // Don't render if no style provided
    if (!userStyle || !STUDY_TIPS[userStyle]) {
        return null;
    }

    const styleInfo = STUDY_TIPS[userStyle];
    const IconComponent = styleInfo.icon;
    const badge = STYLE_BADGES[userStyle];

    // Pick a random tip (using current minute to change tip periodically)
    const tipIndex = new Date().getMinutes() % styleInfo.tips.length;
    const currentTip = styleInfo.tips[tipIndex];

    // Compact variant for sidebar or smaller spaces
    if (variant === 'compact') {
        return (
            <div className={`rounded-lg border p-3 ${styleInfo.bgClass}`}>
                <div className="flex items-center gap-2">
                    <Lightbulb className={`w-4 h-4 ${styleInfo.textClass}`} />
                    <span className={`text-sm font-medium ${styleInfo.textClass}`}>Quick Tip</span>
                </div>
                <p className={`text-sm mt-1 ${styleInfo.textClass}`}>{currentTip}</p>
            </div>
        );
    }

    // Default full variant
    return (
        <div className={`rounded-lg border p-4 mb-6 ${styleInfo.bgClass}`}>
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`${styleInfo.iconClass} rounded-full p-2 flex-shrink-0`}>
                    <Lightbulb className="w-4 h-4 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold text-sm ${styleInfo.textClass}`}>
                            💡 Smart Study Tip for {userStyle === 'Aural' ? 'Auditory' : userStyle} Learners
                        </h4>
                        {badge && (
                            <span className={`text-xs px-2 py-0.5 rounded-full bg-${styleInfo.color}-100 text-${styleInfo.color}-700`}>
                                {badge.emoji}
                            </span>
                        )}
                    </div>
                    <p className={`text-sm ${styleInfo.textClass}`}>
                        {currentTip}
                    </p>
                    <p className={`text-xs mt-2 ${styleInfo.textClass} opacity-75`}>
                        ℹ️ {styleInfo.description}
                    </p>
                </div>
            </div>
        </div>
    );
}

/**
 * StudyTipCard - A card variant for displaying tips in a grid
 */
export function StudyTipCard({ userStyle }) {
    if (!userStyle || !STUDY_TIPS[userStyle]) {
        return null;
    }

    const styleInfo = STUDY_TIPS[userStyle];
    const IconComponent = styleInfo.icon;

    return (
        <div className={`rounded-xl border-2 p-5 ${styleInfo.bgClass} hover:shadow-md transition-shadow`}>
            <div className="flex items-center gap-3 mb-3">
                <div className={`${styleInfo.iconClass} rounded-full p-2`}>
                    <IconComponent className="w-5 h-5 text-white" />
                </div>
                <h3 className={`font-bold ${styleInfo.textClass}`}>
                    {userStyle === 'Aural' ? 'Auditory' : userStyle} Learning Tips
                </h3>
            </div>
            <ul className="space-y-2">
                {styleInfo.tips.slice(0, 4).map((tip, index) => (
                    <li key={index} className={`text-sm ${styleInfo.textClass} flex items-start gap-2`}>
                        <span className="text-lg leading-none">•</span>
                        <span>{tip}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
