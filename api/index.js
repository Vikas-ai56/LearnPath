import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// In-memory storage (note: resets on cold starts - use a real DB for production)
const users = new Map();
const progressData = new Map();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Helper to send JSON response
function json(res, data, status = 200) {
  res.writeHead(status, { ...corsHeaders, 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Main handler
export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;
  const body = req.body || {};

  try {
    // ==================== AUTH ROUTES ====================
    
    // POST /api/auth/signup
    if (path === '/api/auth/signup' && method === 'POST') {
      const { name, email, password, learningStyle } = body;
      
      if (!name || !email || !password) {
        return json(res, { error: 'Name, email, and password are required' }, 400);
      }
      
      if (users.has(email)) {
        return json(res, { error: 'User already exists' }, 400);
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
      return json(res, { user: userWithoutPassword, token }, 201);
    }

    // POST /api/auth/login
    if (path === '/api/auth/login' && method === 'POST') {
      const { email, password } = body;
      
      if (!email || !password) {
        return json(res, { error: 'Email and password are required' }, 400);
      }
      
      const user = users.get(email);
      if (!user) {
        return json(res, { error: 'Invalid credentials' }, 401);
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return json(res, { error: 'Invalid credentials' }, 401);
      }
      
      const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
      
      const { password: _, ...userWithoutPassword } = user;
      return json(res, { user: userWithoutPassword, token });
    }

    // GET /api/auth/me
    if (path === '/api/auth/me' && method === 'GET') {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return json(res, { error: 'No token provided' }, 401);
      }
      
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = users.get(decoded.email);
        
        if (!user) {
          return json(res, { error: 'User not found' }, 404);
        }
        
        const { password: _, ...userWithoutPassword } = user;
        return json(res, { user: userWithoutPassword });
      } catch {
        return json(res, { error: 'Invalid token' }, 401);
      }
    }

    // ==================== USER ROUTES ====================
    
    // PUT /api/user/learning-style
    if (path === '/api/user/learning-style' && method === 'PUT') {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return json(res, { error: 'No token provided' }, 401);
      }
      
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = users.get(decoded.email);
        
        if (!user) {
          return json(res, { error: 'User not found' }, 404);
        }
        
        const { learningStyle } = body;
        user.learningStyle = learningStyle;
        users.set(decoded.email, user);
        
        const { password: _, ...userWithoutPassword } = user;
        return json(res, { user: userWithoutPassword });
      } catch {
        return json(res, { error: 'Server error' }, 500);
      }
    }

    // POST /api/user/xp
    if (path === '/api/user/xp' && method === 'POST') {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return json(res, { error: 'No token provided' }, 401);
      }
      
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = users.get(decoded.email);
        
        if (!user) {
          return json(res, { error: 'User not found' }, 404);
        }
        
        const { amount } = body;
        user.xp = (user.xp || 0) + amount;
        user.level = Math.floor(user.xp / 1000) + 1;
        users.set(decoded.email, user);
        
        const { password: _, ...userWithoutPassword } = user;
        return json(res, { user: userWithoutPassword, xpGained: amount });
      } catch {
        return json(res, { error: 'Server error' }, 500);
      }
    }

    // ==================== PROGRESS ROUTES ====================
    
    // GET /api/progress
    if (path === '/api/progress' && method === 'GET') {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return json(res, { progress: {} });
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const userProgress = progressData.get(decoded.email) || {};
        
        return json(res, { progress: userProgress });
      } catch {
        return json(res, { progress: {} });
      }
    }

    // POST /api/progress/challenge
    if (path === '/api/progress/challenge' && method === 'POST') {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return json(res, { error: 'No token provided' }, 401);
      }
      
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const { challengeId, points } = body;
        
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
        
        return json(res, { success: true, progress: userProgress });
      } catch {
        return json(res, { error: 'Server error' }, 500);
      }
    }

    // ==================== HEALTH CHECK ====================
    if (path === '/api/health' && method === 'GET') {
      return json(res, { status: 'ok', timestamp: new Date().toISOString(), environment: 'vercel' });
    }

    // ==================== 404 ====================
    return json(res, { error: 'API endpoint not found', path }, 404);

  } catch (error) {
    console.error('API Error:', error);
    return json(res, { error: 'Internal server error' }, 500);
  }
}
