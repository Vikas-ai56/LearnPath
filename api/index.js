import express from 'express';
import cors from 'cors';

// Create Express app for serverless
const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory database for serverless (stateless between requests)
export const db = {
  users: new Map(),
  courses: new Map(),
  progress: new Map(),
  quests: new Map(),
  sessions: new Map()
};

// ==================== AUTH ROUTES ====================
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Simple in-memory user store (replace with database in production)
const users = new Map();

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, learningStyle } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    if (users.has(email)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      learningStyle: learningStyle || null,
      xp: 0,
      level: 1,
      streak: 0,
      createdAt: new Date().toISOString()
    };
    
    users.set(email, user);
    
    const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
    
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: 'Server error during signup' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.get('/api/auth/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.get(decoded.email);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ==================== USER ROUTES ====================
app.put('/api/user/learning-style', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.get(decoded.email);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { learningStyle } = req.body;
    user.learningStyle = learningStyle;
    users.set(decoded.email, user);
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/user/xp', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.get(decoded.email);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { amount } = req.body;
    user.xp = (user.xp || 0) + amount;
    user.level = Math.floor(user.xp / 1000) + 1;
    users.set(decoded.email, user);
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, xpGained: amount });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== PROGRESS ROUTES ====================
const progressData = new Map();

app.get('/api/progress', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.json({ progress: {} });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userProgress = progressData.get(decoded.email) || {};
    
    res.json({ progress: userProgress });
  } catch (error) {
    res.json({ progress: {} });
  }
});

app.post('/api/progress/challenge', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const { challengeId, points } = req.body;
    
    let userProgress = progressData.get(decoded.email) || {};
    userProgress[challengeId] = { completed: true, points, completedAt: new Date().toISOString() };
    progressData.set(decoded.email, userProgress);
    
    // Also update XP
    const user = users.get(decoded.email);
    if (user) {
      user.xp = (user.xp || 0) + points;
      user.level = Math.floor(user.xp / 1000) + 1;
      users.set(decoded.email, user);
    }
    
    res.json({ success: true, progress: userProgress });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), environment: 'vercel' });
});

// ==================== CATCH-ALL ====================
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found', path: req.path });
});

// Export for Vercel
export default app;
