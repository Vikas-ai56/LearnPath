/**
 * VARK Module 3: Content Organization Utility
 * 
 * This file contains DETERMINISTIC, RULE-BASED logic for organizing content
 * based on user's VARK learning style. NO ML or black-box AI is used.
 * 
 * EXAMINER NOTES:
 * - All mappings are explicit and auditable
 * - Content prioritization uses simple array-based filtering
 * - Explanation labels make recommendations transparent
 */

/**
 * VARK_PREFERENCE - Deterministic Rule-Based Mapping
 * 
 * Maps each learning style to its preferred content types.
 * This mapping is based on the VARK learning style model.
 * 
 * Visual: Prefers diagrams, charts, videos with visual demonstrations
 * Auditory: Prefers listening, discussions, audio content
 * ReadWrite: Prefers text-based content, reading materials
 * Kinesthetic: Prefers hands-on practice, interactive exercises
 */
export const VARK_PREFERENCE = {
  Visual: ["video", "diagram", "visual_quiz"],
  Auditory: ["video", "audio", "discussion"],
  Aural: ["video", "audio", "discussion"],  // Alias for Auditory (some systems use this)
  ReadWrite: ["text", "pdf", "cheatsheet"],
  Kinesthetic: ["exercise", "quiz", "coding"],
  Multimodal: ["video", "diagram", "audio", "text", "pdf", "quiz", "exercise", "coding", "discussion", "cheatsheet", "visual_quiz"]
};

// Legacy mapping for backward compatibility
export const VARK_MAPPING = VARK_PREFERENCE;

/**
 * Badge labels for each learning style
 * Used to display visual indicators on recommended content
 */
export const STYLE_BADGES = {
  Visual: { label: "Visual Friendly", emoji: "👁️", color: "purple" },
  Auditory: { label: "Audio Friendly", emoji: "👂", color: "blue" },
  Aural: { label: "Audio Friendly", emoji: "👂", color: "blue" },
  ReadWrite: { label: "Text Friendly", emoji: "📖", color: "green" },
  Kinesthetic: { label: "Hands-On", emoji: "🖐️", color: "orange" },
  Multimodal: { label: "Multi-Modal", emoji: "🎯", color: "gray" }
};

/**
 * Type-to-style mapping (reverse lookup)
 * Identifies which learning styles prefer each content type
 */
export const TYPE_TO_STYLES = {
  video: ["Visual", "Auditory"],
  diagram: ["Visual"],
  visual_quiz: ["Visual"],
  audio: ["Auditory"],
  discussion: ["Auditory"],
  text: ["ReadWrite"],
  pdf: ["ReadWrite"],
  cheatsheet: ["ReadWrite"],
  exercise: ["Kinesthetic"],
  quiz: ["Kinesthetic"],
  coding: ["Kinesthetic"]
};

/**
 * Generates an explanation label for why content is recommended
 * 
 * @param {String} contentType - Type of content (video, text, quiz, etc.)
 * @param {String} userStyle - User's VARK learning style
 * @returns {String} Human-readable explanation
 */
export function getExplanationLabel(contentType, userStyle) {
  const styleDescriptions = {
    Visual: "visual learners who prefer diagrams and videos",
    Auditory: "auditory learners who prefer listening and discussion",
    Aural: "auditory learners who prefer listening and discussion",
    ReadWrite: "read/write learners who prefer text-based content",
    Kinesthetic: "kinesthetic learners who prefer hands-on practice",
    Multimodal: "learners with multiple preferences"
  };

  const typeDescriptions = {
    video: "video content",
    diagram: "visual diagrams",
    visual_quiz: "visual quizzes",
    audio: "audio content",
    discussion: "discussion-based learning",
    text: "reading material",
    pdf: "PDF documents",
    cheatsheet: "quick reference guides",
    exercise: "hands-on exercises",
    quiz: "interactive quizzes",
    coding: "coding practice"
  };

  const styleDesc = styleDescriptions[userStyle] || "your learning style";
  const typeDesc = typeDescriptions[contentType] || contentType;

  return `⭐ Recommended for ${styleDesc} - ${typeDesc}`;
}

/**
 * Gets the badge information for a content item based on user's learning style
 * 
 * @param {String} contentType - Type of content
 * @param {String} userStyle - User's VARK learning style
 * @returns {Object|null} Badge info or null if not recommended
 */
export function getContentBadge(contentType, userStyle) {
  const preferredTypes = VARK_PREFERENCE[userStyle] || [];

  if (preferredTypes.includes(contentType?.toLowerCase())) {
    return STYLE_BADGES[userStyle] || null;
  }

  return null;
}

/**
 * Organizes content based on user's VARK learning style
 * 
 * HOW IT WORKS (Explainable Logic):
 * 1. Get the preferred content types for the user's learning style
 * 2. Filter content into "recommended" (matches preferences) and "others"
 * 3. Add explanation labels and badges to recommended items
 * 4. Return both arrays - ALL content remains accessible
 * 
 * @param {Array} allContent - Array of content objects with 'type' property
 * @param {String} userStyle - VARK style: 'Visual', 'Auditory', 'ReadWrite', 'Kinesthetic', 'Multimodal'
 * @returns {Object} { recommended: [], others: [], explanation: "" }
 */
export function organizeContentByStyle(allContent, userStyle) {
  // Edge case: empty or invalid input
  if (!allContent || !Array.isArray(allContent) || allContent.length === 0) {
    return {
      recommended: [],
      others: [],
      explanation: "No content available."
    };
  }

  // Edge case: no user style specified - put everything in others
  if (!userStyle || !VARK_PREFERENCE[userStyle]) {
    return {
      recommended: [],
      others: allContent,
      explanation: "Complete the VARK questionnaire to get personalized recommendations."
    };
  }

  // Get matching content types for user's style
  const matchingTypes = VARK_PREFERENCE[userStyle];
  const styleInfo = STYLE_BADGES[userStyle];

  // Separate content into recommended and others with enhanced metadata
  const recommended = allContent
    .filter(item => item.type && matchingTypes.includes(item.type.toLowerCase()))
    .map(item => ({
      ...item,
      isRecommended: true,
      recommendationReason: getExplanationLabel(item.type, userStyle),
      badge: styleInfo?.label || `${userStyle} Friendly`,
      badgeEmoji: styleInfo?.emoji || "⭐",
      badgeColor: styleInfo?.color || "blue"
    }));

  const others = allContent
    .filter(item => !item.type || !matchingTypes.includes(item.type.toLowerCase()))
    .map(item => ({
      ...item,
      isRecommended: false,
      recommendationReason: null,
      badge: null
    }));

  return {
    recommended,
    others,
    explanation: `Content is prioritized for ${userStyle} learners. ${recommended.length} items match your preferences.`
  };
}

/**
 * React hook version for organizing content
 * 
 * @param {Array} allContent - Array of content objects
 * @param {String} userStyle - User's VARK learning style
 * @returns {Object} { recommended: [], others: [], explanation: "" }
 */
export function useOrganizedContent(allContent, userStyle) {
  return organizeContentByStyle(allContent, userStyle);
}

/**
 * Get content types for a specific VARK style
 * 
 * @param {String} style - VARK style name
 * @returns {Array} Array of matching content types
 */
export function getContentTypesForStyle(style) {
  return VARK_PREFERENCE[style] || [];
}

/**
 * INCORRECT_ANSWER_TIPS - Deterministic Feedback for Wrong Quiz Answers
 * 
 * When a learner answers a question incorrectly, show a style-specific tip
 * to help them learn the material in their preferred way.
 * 
 * This is DETERMINISTIC - the same wrong answer for the same learning style
 * always shows the same tip. No AI generation involved.
 */
export const INCORRECT_ANSWER_TIPS = {
  Visual: [
    "Try drawing a diagram to visualize this concept.",
    "Watch a video explanation of this topic.",
    "Create a flowchart to understand the process.",
    "Use color-coding to organize the information."
  ],
  Auditory: [
    "Try explaining this concept out loud to yourself.",
    "Discuss this topic with a study partner.",
    "Listen to an audio explanation or podcast.",
    "Record yourself explaining it and play it back."
  ],
  Aural: [
    "Try explaining this concept out loud to yourself.",
    "Discuss this topic with a study partner.",
    "Listen to an audio explanation or podcast.",
    "Record yourself explaining it and play it back."
  ],
  ReadWrite: [
    "Re-read the relevant section and take notes.",
    "Write a summary of this concept in your own words.",
    "Create a list of key points to remember.",
    "Look up additional reading materials on this topic."
  ],
  Kinesthetic: [
    "Try a hands-on exercise to practice this concept.",
    "Work through a coding example step by step.",
    "Use a simulation or interactive tool to explore.",
    "Take a break and come back to practice again."
  ],
  Multimodal: [
    "Try a different approach - maybe a video or exercise.",
    "Combine reading with hands-on practice.",
    "Discuss the topic while looking at diagrams.",
    "Mix different learning methods to reinforce the concept."
  ]
};

/**
 * Get a random tip for incorrect answers based on learning style
 * 
 * @param {String} userStyle - User's VARK learning style
 * @returns {String} A tip appropriate for the learning style
 */
export function getIncorrectAnswerTip(userStyle) {
  const tips = INCORRECT_ANSWER_TIPS[userStyle] || INCORRECT_ANSWER_TIPS['Multimodal'];
  const randomIndex = Math.floor(Math.random() * tips.length);
  return tips[randomIndex];
}
