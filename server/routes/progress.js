import express from 'express';
import { db } from '../index.js';
import { authenticate } from './auth.js';
import { KNOWLEDGE_GRAPH } from '../../src/data/mockData.js';

const router = express.Router();

// Complete a module
router.post('/complete/:nodeId', authenticate, (req, res) => {
  const user = db.users.get(req.userId);
  const { nodeId } = req.params;

  if (!user.completedNodes.includes(nodeId)) {
    user.completedNodes.push(nodeId);
    user.xp += 100;

    // Unlock dependent nodes
    const dependentNodes = KNOWLEDGE_GRAPH
      .filter(n => n.prereqs.includes(nodeId))
      .map(n => n.id);
    
    user.unlockedNodes = [...new Set([...user.unlockedNodes, ...dependentNodes])];
    
    db.users.set(req.userId, user);
  }

  res.json({ 
    completedNodes: user.completedNodes, 
    unlockedNodes: user.unlockedNodes,
    xp: user.xp
  });
});

// Update theta score
router.post('/theta', authenticate, (req, res) => {
  const { theta, answers } = req.body;
  const user = db.users.get(req.userId);

  user.thetaScore = theta;

  // Unlock initial nodes based on theta
  const unlocked = ['cs101', 'math101'];
  if (theta > 1.5) unlocked.push('cs102');
  if (theta > 2.5) unlocked.push('ds101');

  user.unlockedNodes = [...new Set([...user.unlockedNodes, ...unlocked])];
  db.users.set(req.userId, user);

  res.json({ 
    thetaScore: user.thetaScore, 
    unlockedNodes: user.unlockedNodes 
  });
});

// Get user progress
router.get('/', authenticate, (req, res) => {
  const user = db.users.get(req.userId);
  res.json({
    completedNodes: user.completedNodes,
    unlockedNodes: user.unlockedNodes,
    thetaScore: user.thetaScore,
    xp: user.xp,
    streak: user.streak
  });
});

export default router;
