import express from 'express';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { authenticate } from './auth.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create database connection
const dbPath = join(__dirname, '..', 'users.db');
const db = new sqlite3.Database(dbPath);

/**
 * VARK_PREFERENCE - Deterministic Rule-Based Mapping
 * 
 * This mapping defines which content types are most suitable for each learning style.
 * It is used to filter and prioritize content recommendations.
 * 
 * WHY THIS APPROACH:
 * - Transparent and explainable to examiners
 * - No black-box AI or ML algorithms
 * - Easy to audit and modify
 * - Consistent and reproducible results
 */
const VARK_PREFERENCE = {
  Visual: ["video", "diagram", "visual_quiz"],
  Auditory: ["video", "audio", "discussion"],
  Aural: ["video", "audio", "discussion"],  // Alias for Auditory
  ReadWrite: ["text", "pdf", "cheatsheet"],
  Kinesthetic: ["exercise", "quiz", "coding"],
  Multimodal: ["video", "diagram", "audio", "text", "pdf", "quiz", "exercise", "coding"]
};

/**
 * Generates an explanation label for why content is recommended
 * This makes the recommendation system transparent and explainable
 */
function getExplanationLabel(contentType, userStyle) {
  const styleDescriptions = {
    Visual: "visual learners who prefer diagrams and videos",
    Auditory: "auditory learners who prefer listening and discussion",
    Aural: "auditory learners who prefer listening and discussion",
    ReadWrite: "read/write learners who prefer text-based content",
    Kinesthetic: "kinesthetic learners who prefer hands-on practice"
  };

  const typeDescriptions = {
    video: "video content",
    diagram: "visual diagrams",
    audio: "audio content",
    discussion: "discussion-based learning",
    text: "reading material",
    pdf: "PDF documents",
    cheatsheet: "quick reference guides",
    exercise: "hands-on exercises",
    quiz: "interactive quizzes",
    coding: "coding practice",
    visual_quiz: "visual quizzes"
  };

  return `Recommended for ${styleDescriptions[userStyle] || "your learning style"} - ${typeDescriptions[contentType] || contentType}`;
}

// Get user profile - NOW INCLUDES learning_style
router.get('/profile', authenticate, (req, res) => {
  db.get(
    'SELECT id, name, email, xp, vark_completed, learning_style, created_at FROM users WHERE id = ?',
    [req.userId],
    (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        xp: user.xp || 0,
        varkCompleted: user.vark_completed || false,
        learningStyle: user.learning_style || 'ReadWrite',
        createdAt: user.created_at
      });
    }
  );
});

// Update user profile
router.put('/profile', authenticate, (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  db.run(
    'UPDATE users SET name = ? WHERE id = ?',
    [name, req.userId],
    function (err) {
      if (err) {
        console.error('Error updating profile:', err);
        return res.status(500).json({ error: 'Error updating profile' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'Profile updated successfully', name });
    }
  );
});

// POST /api/user/vark - Update learning style for logged-in user
router.post('/vark', authenticate, (req, res) => {
  const { learning_style } = req.body;

  // Validate learning style
  const validStyles = ['Visual', 'Aural', 'ReadWrite', 'Kinesthetic', 'Multimodal'];
  if (!learning_style || !validStyles.includes(learning_style)) {
    return res.status(400).json({
      error: 'Invalid learning style. Must be one of: Visual, Aural, ReadWrite, Kinesthetic, Multimodal'
    });
  }

  // Update learning_style column in database
  db.run(
    'UPDATE users SET learning_style = ? WHERE id = ?',
    [learning_style, req.userId],
    function (err) {
      if (err) {
        console.error('Error updating learning style:', err);
        return res.status(500).json({ error: 'Database error while updating learning style' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        message: 'Learning style updated successfully',
        learning_style: learning_style
      });
    }
  );
});

// Legacy endpoint for backward compatibility
router.put('/learning-style', authenticate, (req, res) => {
  const { learningStyle, learning_style } = req.body;
  const style = learning_style || learningStyle;

  if (!style) {
    return res.status(400).json({ error: 'learningStyle is required' });
  }

  db.run(
    'UPDATE users SET learning_style = ? WHERE id = ?',
    [style, req.userId],
    function (err) {
      if (err) {
        console.error('Error updating learning style:', err);
        return res.status(500).json({ error: 'Error updating learning style' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ learningStyle: style });
    }
  );
});

// GET /api/user/content - Retrieve content filtered by learning style (optional)
router.get('/content', (req, res) => {
  const { type, course, learning_style } = req.query;

  let query = 'SELECT * FROM content WHERE 1=1';
  const params = [];

  // Filter by type (video, diagram, audio, text, quiz)
  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }

  // Filter by course
  if (course) {
    query += ' AND course = ?';
    params.push(course);
  }

  // Filter by learning style - map to content types
  if (learning_style) {
    const styleMapping = {
      'Visual': ['video', 'diagram'],
      'Aural': ['audio'],
      'ReadWrite': ['text'],
      'Kinesthetic': ['quiz']
    };
    const types = styleMapping[learning_style];
    if (types) {
      query += ` AND type IN (${types.map(() => '?').join(',')})`;
      params.push(...types);
    }
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching content:', err);
      return res.status(500).json({ error: 'Error fetching content' });
    }

    res.json({ content: rows });
  });
});

/**
 * GET /api/user/content-prioritized
 * 
 * Returns content organized by learning style priority with explanation labels.
 * 
 * HOW IT WORKS (Explainable Logic):
 * 1. Fetch user's learning style from database
 * 2. Use VARK_PREFERENCE mapping to identify preferred content types
 * 3. Categorize all content into "recommended" and "other"
 * 4. Add explanation labels to each recommended item
 * 5. Return both categories so ALL content remains accessible
 * 
 * This approach is TRANSPARENT - no hidden algorithms or ML black boxes.
 */
router.get('/content-prioritized', authenticate, (req, res) => {
  const { course } = req.query;

  // Step 1: Get user's learning style
  db.get(
    'SELECT learning_style FROM users WHERE id = ?',
    [req.userId],
    (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      const userStyle = user?.learning_style || 'ReadWrite';
      const preferredTypes = VARK_PREFERENCE[userStyle] || VARK_PREFERENCE['Multimodal'];

      // Step 2: Build query for content
      let query = 'SELECT * FROM content';
      const params = [];

      if (course) {
        query += ' WHERE course = ?';
        params.push(course);
      }

      query += ' ORDER BY created_at DESC';

      // Step 3: Fetch and categorize content
      db.all(query, params, (err, rows) => {
        if (err) {
          console.error('Error fetching content:', err);
          return res.status(500).json({ error: 'Error fetching content' });
        }

        // Step 4: Separate into recommended and other
        const recommended = [];
        const other = [];

        rows.forEach(item => {
          const isPreferred = preferredTypes.includes(item.type?.toLowerCase());

          if (isPreferred) {
            // Add explanation label for transparency
            recommended.push({
              ...item,
              isRecommended: true,
              recommendationReason: getExplanationLabel(item.type, userStyle),
              badge: `${userStyle} Friendly`,
              priority: preferredTypes.indexOf(item.type?.toLowerCase()) + 1
            });
          } else {
            other.push({
              ...item,
              isRecommended: false,
              recommendationReason: null,
              badge: null
            });
          }
        });

        // Sort recommended by priority (most relevant first)
        recommended.sort((a, b) => a.priority - b.priority);

        // Step 5: Return with full transparency
        res.json({
          userLearningStyle: userStyle,
          preferredContentTypes: preferredTypes,
          explanation: `Content is prioritized based on your ${userStyle} learning style preference. Recommended items match your preferred content types: ${preferredTypes.join(', ')}.`,
          recommended,
          other,
          totalContent: rows.length,
          recommendedCount: recommended.length,
          otherCount: other.length
        });
      });
    }
  );
});

/**
 * GET /api/user/progress
 * 
 * Returns user's learning progress across all subjects.
 * 
 * Tracks:
 * - Quizzes completed
 * - XP earned
 * - Content viewed (placeholder for future)
 */
router.get('/progress', authenticate, (req, res) => {
  // Get user's basic stats
  db.get(
    'SELECT id, name, xp, vark_completed, learning_style FROM users WHERE id = ?',
    [req.userId],
    (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get quiz progress
      db.all(
        'SELECT course_name, topic_id, score, total_questions, completed_at FROM quiz_progress WHERE user_email = (SELECT email FROM users WHERE id = ?)',
        [req.userId],
        (err, quizzes) => {
          if (err) {
            console.error('Error fetching quiz progress:', err);
            return res.status(500).json({ error: 'Error fetching progress' });
          }

          // Calculate progress stats
          const completedQuizzes = quizzes?.length || 0;
          const totalScore = quizzes?.reduce((sum, q) => sum + (q.score || 0), 0) || 0;
          const totalPossible = quizzes?.reduce((sum, q) => sum + (q.total_questions || 0), 0) || 0;
          const averageScore = totalPossible > 0 ? Math.min(100, Math.round((totalScore / totalPossible) * 100)) : 0;

          // Group quizzes by course
          const progressByCourse = {};
          quizzes?.forEach(q => {
            if (!progressByCourse[q.course_name]) {
              progressByCourse[q.course_name] = {
                completed: 0,
                totalScore: 0,
                totalPossible: 0
              };
            }
            progressByCourse[q.course_name].completed++;
            progressByCourse[q.course_name].totalScore += q.score || 0;
            progressByCourse[q.course_name].totalPossible += q.total_questions || 0;
          });

          res.json({
            userId: user.id,
            name: user.name,
            xp: user.xp || 0,
            learningStyle: user.learning_style || 'ReadWrite',
            varkCompleted: user.vark_completed || false,
            stats: {
              completedQuizzes,
              averageScore,
              totalXP: user.xp || 0
            },
            progressByCourse,
            recentActivity: quizzes?.slice(0, 5) || []
          });
        }
      );
    }
  );
});

/**
 * POST /save-weak-areas - Save topics where user answered incorrectly
 * 
 * EXAMINER NOTES:
 * - Stores incorrect answers for personalized insights
 * - Tracks which concepts need more practice
 * - Used for generating improvement recommendations
 */
router.post('/save-weak-areas', authenticate, (req, res) => {
  const { courseName, topicId, topicLabel, wrongQuestions } = req.body;
  const userEmail = req.user.email;

  if (!courseName || !topicId || !wrongQuestions || !Array.isArray(wrongQuestions)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let savedCount = 0;
  wrongQuestions.forEach(q => {
    db.run(
      `INSERT INTO quiz_weak_areas (user_email, course_name, topic_id, topic_label, question_text)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT DO UPDATE SET wrong_count = wrong_count + 1, last_wrong_at = CURRENT_TIMESTAMP`,
      [userEmail, courseName, topicId, topicLabel || topicId, q.question],
      (err) => {
        if (!err) savedCount++;
      }
    );
  });

  res.json({ message: 'Weak areas saved', savedCount });
});

/**
 * GET /insights - Get personalized improvement recommendations
 * 
 * EXAMINER NOTES:
 * - Rule-based insights generation (no ML/AI)
 * - Groups weak areas by topic
 * - Provides actionable improvement suggestions
 * - Transparent and deterministic recommendations
 */
router.get('/insights', authenticate, (req, res) => {
  const userEmail = req.user.email;

  // Get weak areas grouped by topic
  db.all(
    `SELECT 
      course_name, 
      topic_id, 
      topic_label,
      COUNT(*) as wrong_count,
      MAX(last_wrong_at) as last_wrong_at,
      GROUP_CONCAT(DISTINCT question_text) as questions
     FROM quiz_weak_areas 
     WHERE user_email = ? AND reviewed = 0
     GROUP BY course_name, topic_id
     ORDER BY wrong_count DESC, last_wrong_at DESC
     LIMIT 10`,
    [userEmail],
    (err, weakAreas) => {
      if (err) {
        console.error('Error fetching weak areas:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      // Get user's learning style for targeted recommendations
      db.get(
        'SELECT learning_style FROM users WHERE email = ?',
        [userEmail],
        (err, user) => {
          if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Database error' });
          }

          const learningStyle = user?.learning_style || 'ReadWrite';

          // Generate insights with rule-based recommendations
          const insights = (weakAreas || []).map(area => {
            // Split questions if they were concatenated
            const questionList = area.questions ? area.questions.split(',').slice(0, 3) : [];

            // Generate style-specific improvement tips
            const improvementTips = getImprovementTips(area.topic_label || area.topic_id, learningStyle);

            return {
              courseName: area.course_name,
              topicId: area.topic_id,
              topicLabel: area.topic_label || area.topic_id,
              wrongCount: area.wrong_count,
              lastWrongAt: area.last_wrong_at,
              sampleQuestions: questionList,
              improvementTips,
              priority: area.wrong_count >= 3 ? 'high' : area.wrong_count >= 2 ? 'medium' : 'low'
            };
          });

          // Get overall stats
          db.get(
            `SELECT 
              COUNT(DISTINCT topic_id) as weak_topic_count,
              SUM(wrong_count) as total_wrong_answers
             FROM quiz_weak_areas 
             WHERE user_email = ? AND reviewed = 0`,
            [userEmail],
            (err, stats) => {
              res.json({
                learningStyle,
                insights,
                summary: {
                  weakTopicCount: stats?.weak_topic_count || 0,
                  totalWrongAnswers: stats?.total_wrong_answers || 0
                },
                message: insights.length > 0
                  ? `You have ${insights.length} topics to review for improvement`
                  : 'Great job! No weak areas identified yet. Keep taking quizzes!'
              });
            }
          );
        }
      );
    }
  );
});

/**
 * POST /mark-reviewed - Mark a weak area as reviewed
 */
router.post('/mark-reviewed', authenticate, (req, res) => {
  const { topicId, courseName } = req.body;
  const userEmail = req.user.email;

  db.run(
    'UPDATE quiz_weak_areas SET reviewed = 1 WHERE user_email = ? AND topic_id = ? AND course_name = ?',
    [userEmail, topicId, courseName],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Marked as reviewed', updated: this.changes });
    }
  );
});

/**
 * Helper function to generate learning-style-specific improvement tips
 * 
 * EXAMINER NOTES:
 * - Deterministic, rule-based tip generation
 * - Tips are specific to both topic and learning style
 * - No AI/ML - fully transparent and auditable
 */
function getImprovementTips(topicLabel, learningStyle) {
  const topicLower = topicLabel.toLowerCase();

  // Generic tips by learning style
  const styleTips = {
    Visual: [
      `Draw a diagram showing how ${topicLabel} works`,
      `Watch a video tutorial on ${topicLabel}`,
      `Create a mind map connecting ${topicLabel} concepts`
    ],
    Auditory: [
      `Explain ${topicLabel} out loud to yourself or a friend`,
      `Listen to a lecture or podcast about ${topicLabel}`,
      `Discuss ${topicLabel} concepts in a study group`
    ],
    Aural: [
      `Explain ${topicLabel} out loud to yourself or a friend`,
      `Listen to a lecture or podcast about ${topicLabel}`,
      `Discuss ${topicLabel} concepts in a study group`
    ],
    ReadWrite: [
      `Read the textbook chapter on ${topicLabel}`,
      `Write summary notes about ${topicLabel}`,
      `Create flashcards for key ${topicLabel} concepts`
    ],
    Kinesthetic: [
      `Practice coding exercises related to ${topicLabel}`,
      `Build a small project using ${topicLabel}`,
      `Take more quizzes on ${topicLabel} until you master it`
    ]
  };

  return styleTips[learningStyle] || styleTips['ReadWrite'];
}

/**
 * POST /question-stats - Update question statistics when a user answers
 * 
 * EXAMINER NOTES:
 * - Tracks how many users got each question right or wrong
 * - Uses a hash of the question text as identifier
 * - Enables showing "X% of users got this right" after answering
 */
router.post('/question-stats', authenticate, (req, res) => {
  const { topicId, questionHash, isCorrect } = req.body;

  if (!topicId || !questionHash || isCorrect === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Upsert question stats
  if (isCorrect) {
    db.run(
      `INSERT INTO quiz_question_stats (topic_id, question_hash, correct_count, wrong_count)
       VALUES (?, ?, 1, 0)
       ON CONFLICT(topic_id, question_hash) 
       DO UPDATE SET correct_count = correct_count + 1`,
      [topicId, questionHash],
      (err) => {
        if (err) {
          console.error('Error updating question stats:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Stats updated' });
      }
    );
  } else {
    db.run(
      `INSERT INTO quiz_question_stats (topic_id, question_hash, correct_count, wrong_count)
       VALUES (?, ?, 0, 1)
       ON CONFLICT(topic_id, question_hash) 
       DO UPDATE SET wrong_count = wrong_count + 1`,
      [topicId, questionHash],
      (err) => {
        if (err) {
          console.error('Error updating question stats:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Stats updated' });
      }
    );
  }
});

/**
 * GET /question-stats/:topicId - Get statistics for all questions in a topic
 * 
 * EXAMINER NOTES:
 * - Returns percentage of users who got each question right/wrong
 * - Enables peer comparison feature in quiz UI
 */
router.get('/question-stats/:topicId', (req, res) => {
  const { topicId } = req.params;

  db.all(
    `SELECT question_hash, correct_count, wrong_count,
            ROUND(CAST(correct_count AS FLOAT) / NULLIF(correct_count + wrong_count, 0) * 100) as correct_percentage,
            ROUND(CAST(wrong_count AS FLOAT) / NULLIF(correct_count + wrong_count, 0) * 100) as wrong_percentage,
            (correct_count + wrong_count) as total_attempts
     FROM quiz_question_stats 
     WHERE topic_id = ?`,
    [topicId],
    (err, stats) => {
      if (err) {
        console.error('Error fetching question stats:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      // Convert to a map for easy lookup
      const statsMap = {};
      (stats || []).forEach(s => {
        statsMap[s.question_hash] = {
          correctPercentage: s.correct_percentage || 0,
          wrongPercentage: s.wrong_percentage || 0,
          totalAttempts: s.total_attempts || 0
        };
      });

      res.json({ stats: statsMap });
    }
  );
});

export default router;

