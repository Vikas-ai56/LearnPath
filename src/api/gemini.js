/**
 * GEMINI API CONFIGURATION AND UTILITIES
 */

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

/**
 * Calls the Gemini API with a given prompt
 * @param {string} prompt - The prompt to send to Gemini
 * @returns {Promise<string>} The AI-generated response
 */
export const callGemini = async (prompt) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The AI tutor is currently offline. Please try again later.";
  }
};
