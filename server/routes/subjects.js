import express from 'express';
import { 
  getCurriculum, 
  getPrerequisites, 
  getLearningPath,
  getUserProgress,
  updateProgress 
} from '../neo4j/database.js';
import { OS_CURRICULUM } from '../../src/data/operatingSystemsCurriculum.js';

const router = express.Router();

/**
 * Get all topics for a subject
 */
router.get('/:subject', async (req, res) => {
  try {
    const { subject } = req.params;
    
    // Try Neo4j first
    let curriculum = await getCurriculum(subject);
    
    // Fallback to static data if Neo4j not available
    if (!curriculum || curriculum.length === 0) {
      if (subject === 'Operating Systems' || subject === 'operating-systems') {
        curriculum = OS_CURRICULUM.nodes;
      }
    }
    
    res.json({ success: true, data: curriculum });
  } catch (error) {
    console.error('Error fetching curriculum:', error);
    
    // Return static data as fallback
    if (req.params.subject === 'Operating Systems' || req.params.subject === 'operating-systems') {
      return res.json({ success: true, data: OS_CURRICULUM.nodes });
    }
    
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get learning path for a subject
 */
router.get('/:subject/path', async (req, res) => {
  try {
    const { subject } = req.params;
    const path = await getLearningPath(subject);
    res.json({ success: true, data: path });
  } catch (error) {
    console.error('Error fetching learning path:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get prerequisites for a topic
 */
router.get('/:subject/topic/:topicId/prerequisites', async (req, res) => {
  try {
    const { subject, topicId } = req.params;
    const prerequisites = await getPrerequisites(subject, topicId);
    res.json({ success: true, data: prerequisites });
  } catch (error) {
    console.error('Error fetching prerequisites:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get user progress for a subject
 */
router.get('/:subject/progress/:userId', async (req, res) => {
  try {
    const { subject, userId } = req.params;
    const progress = await getUserProgress(userId, subject);
    res.json({ success: true, data: progress });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Update user progress
 */
router.post('/:subject/progress/:userId/:topicId', async (req, res) => {
  try {
    const { subject, userId, topicId } = req.params;
    const { status } = req.body; // 'started', 'in-progress', 'completed'
    
    await updateProgress(userId, subject, topicId, status);
    res.json({ success: true, message: 'Progress updated' });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
