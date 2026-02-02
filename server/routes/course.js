import express from 'express';
import { authenticate } from './auth.js';
import { KNOWLEDGE_GRAPH } from '../../src/data/mockData.js';

const router = express.Router();

// Get all courses/nodes
router.get('/', authenticate, (req, res) => {
  res.json(KNOWLEDGE_GRAPH);
});

// Get single course
router.get('/:courseId', authenticate, (req, res) => {
  const course = KNOWLEDGE_GRAPH.find(c => c.id === req.params.courseId);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json(course);
});

export default router;
