import express from 'express';
import { db } from '../index.js';
import { authenticate } from './auth.js';
import crypto from 'crypto';

const router = express.Router();

// Initialize quests for new users
const initializeQuests = (userId) => {
  const defaultQuests = [
    { 
      id: crypto.randomUUID(),
      userId,
      title: "Memory Master", 
      desc: "Solve a problem using < 2MB Memory", 
      progress: 0, 
      reward: "Badge: Minimalist",
      completed: false
    },
    { 
      id: crypto.randomUUID(),
      userId,
      title: "Clean Code", 
      desc: "Pass static analysis with 0 warnings", 
      progress: 0, 
      reward: "+50 Efficiency Pts",
      completed: false
    },
    { 
      id: crypto.randomUUID(),
      userId,
      title: "Peer Review", 
      desc: "Review 2 Jigsaw module PRs", 
      progress: 0, 
      reward: "Mentor Status",
      completed: false
    },
    { 
      id: crypto.randomUUID(),
      userId,
      title: "Speed Demon", 
      desc: "Complete 5 modules in one day", 
      progress: 0, 
      reward: "+100 XP Boost",
      completed: false
    },
    { 
      id: crypto.randomUUID(),
      userId,
      title: "Knowledge Navigator", 
      desc: "Unlock all nodes in a domain", 
      progress: 0, 
      reward: "Domain Master Badge",
      completed: false
    }
  ];

  defaultQuests.forEach(quest => {
    db.quests.set(quest.id, quest);
  });

  return defaultQuests;
};

// Get user quests
router.get('/', authenticate, (req, res) => {
  let userQuests = Array.from(db.quests.values())
    .filter(q => q.userId === req.userId);

  if (userQuests.length === 0) {
    userQuests = initializeQuests(req.userId);
  }

  res.json(userQuests);
});

// Update quest progress
router.put('/:questId', authenticate, (req, res) => {
  const { questId } = req.params;
  const { progress } = req.body;
  
  const quest = db.quests.get(questId);
  if (!quest || quest.userId !== req.userId) {
    return res.status(404).json({ error: 'Quest not found' });
  }

  quest.progress = Math.min(progress, 100);
  quest.completed = quest.progress >= 100;
  
  db.quests.set(questId, quest);

  // Award rewards if completed
  if (quest.completed && !quest.rewarded) {
    const user = db.users.get(req.userId);
    if (quest.reward.includes('XP')) {
      const xpMatch = quest.reward.match(/\+(\d+)/);
      if (xpMatch) {
        user.xp += parseInt(xpMatch[1]);
        db.users.set(req.userId, user);
      }
    }
    quest.rewarded = true;
    db.quests.set(questId, quest);
  }

  res.json(quest);
});

export default router;
