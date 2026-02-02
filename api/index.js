import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for server-side
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

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

  // Check Supabase connection
  if (!supabase) {
    return json(res, { 
      error: 'Database not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.' 
    }, 500);
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
      
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();
      
      if (existingUser) {
        return json(res, { error: 'User already exists' }, 400);
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          name,
          email,
          password_hash: hashedPassword,
          learning_style: learningStyle || null,
          xp: 0,
          level: 1,
          streak: 0
        })
        .select()
        .single();
      
      if (error) {
        console.error('Signup error:', error);
        return json(res, { error: 'Failed to create user' }, 500);
      }
      
      const token = jwt.sign({ userId: newUser.id, email }, JWT_SECRET, { expiresIn: '7d' });
      
      const user = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        learningStyle: newUser.learning_style,
        xp: newUser.xp,
        level: newUser.level,
        streak: newUser.streak,
        varkCompleted: newUser.vark_completed
      };
      
      return json(res, { user, token }, 201);
    }

    // POST /api/auth/login
    if (path === '/api/auth/login' && method === 'POST') {
      const { email, password } = body;
      
      if (!email || !password) {
        return json(res, { error: 'Email and password are required' }, 400);
      }
      
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error || !user) {
        return json(res, { error: 'Invalid credentials' }, 401);
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return json(res, { error: 'Invalid credentials' }, 401);
      }
      
      const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
      
      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        learningStyle: user.learning_style,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        varkCompleted: user.vark_completed
      };
      
      return json(res, { user: userResponse, token });
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
        
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', decoded.email)
          .single();
        
        if (error || !user) {
          return json(res, { error: 'User not found' }, 404);
        }
        
        const userResponse = {
          id: user.id,
          name: user.name,
          email: user.email,
          learningStyle: user.learning_style,
          xp: user.xp,
          level: user.level,
          streak: user.streak,
          varkCompleted: user.vark_completed,
          varkScores: user.vark_scores
        };
        
        return json(res, { user: userResponse });
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
        
        const { learningStyle } = body;
        
        const { data: user, error } = await supabase
          .from('users')
          .update({ learning_style: learningStyle, updated_at: new Date().toISOString() })
          .eq('email', decoded.email)
          .select()
          .single();
        
        if (error) {
          return json(res, { error: 'Failed to update learning style' }, 500);
        }
        
        const userResponse = {
          id: user.id,
          name: user.name,
          email: user.email,
          learningStyle: user.learning_style,
          xp: user.xp,
          level: user.level
        };
        
        return json(res, { user: userResponse });
      } catch {
        return json(res, { error: 'Server error' }, 500);
      }
    }

    // ==================== VARK ROUTES ====================

    // POST /api/auth/vark-submit - Submit VARK questionnaire responses
    if (path === '/api/auth/vark-submit' && method === 'POST') {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return json(res, { error: 'No token provided' }, 401);
      }

      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Get user
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', decoded.email)
          .single();

        if (userError || !user) {
          return json(res, { error: 'User not found' }, 404);
        }

        const { responses } = body;
        
        // Calculate VARK scores from responses
        const scores = { V: 0, A: 0, R: 0, K: 0 };
        const answerMapping = {
          q1: { a: 'K', b: 'A', c: 'R', d: 'V' },
          q2: { a: 'V', b: 'A', c: 'R', d: 'K' },
          q3: { a: 'A', b: 'R', c: 'K', d: 'V' },
          q4: { a: 'K', b: 'A', c: 'V', d: 'R' },
          q5: { a: 'A', b: 'V', c: 'K', d: 'R' },
          q6: { a: 'R', b: 'A', c: 'K', d: 'V' },
          q7: { a: 'K', b: 'A', c: 'V', d: 'R' },
          q8: { a: 'V', b: 'R', c: 'A', d: 'K' },
          q9: { a: 'R', b: 'A', c: 'K', d: 'V' },
          q10: { a: 'K', b: 'V', c: 'R', d: 'A' },
          q11: { a: 'A', b: 'R', c: 'V', d: 'K' },
          q12: { a: 'K', b: 'R', c: 'A', d: 'V' },
          q13: { a: 'K', b: 'A', c: 'R', d: 'V' },
          q14: { a: 'K', b: 'R', c: 'V', d: 'A' },
          q15: { a: 'K', b: 'A', c: 'R', d: 'V' },
          q16: { a: 'V', b: 'A', c: 'R', d: 'K' }
        };

        // Calculate scores
        for (const [questionId, answer] of Object.entries(responses)) {
          if (answerMapping[questionId] && answerMapping[questionId][answer]) {
            scores[answerMapping[questionId][answer]]++;
          }
        }

        // Determine dominant learning style
        const maxScore = Math.max(...Object.values(scores));
        const dominantStyles = Object.entries(scores)
          .filter(([_, score]) => score === maxScore)
          .map(([style]) => style);
        const learningStyle = dominantStyles.join('');

        // Save VARK responses (upsert)
        await supabase
          .from('vark_responses')
          .upsert({
            user_id: user.id,
            responses
          }, { onConflict: 'user_id' });

        // Update user with learning style
        await supabase
          .from('users')
          .update({
            learning_style: learningStyle,
            vark_completed: true,
            vark_scores: scores,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        // Generate new token with updated info
        const newToken = jwt.sign({
          userId: user.id,
          email: user.email,
          name: user.name,
          learningStyle: learningStyle,
          varkCompleted: true,
          xp: user.xp,
          level: user.level
        }, JWT_SECRET, { expiresIn: '7d' });

        return json(res, { 
          token: newToken, 
          learningStyle, 
          scores,
          message: 'VARK assessment completed successfully'
        });
      } catch (err) {
        console.error('VARK submit error:', err);
        return json(res, { error: 'Server error' }, 500);
      }
    }

    // GET /api/auth/vark-responses - Get user's VARK responses
    if (path === '/api/auth/vark-responses' && method === 'GET') {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return json(res, { error: 'No token provided' }, 401);
      }

      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Get user first
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('email', decoded.email)
          .single();
        
        if (!user) {
          return json(res, { responses: null });
        }
        
        const { data } = await supabase
          .from('vark_responses')
          .select('responses')
          .eq('user_id', user.id)
          .single();
        
        return json(res, { responses: data?.responses || null });
      } catch {
        return json(res, { error: 'Invalid token' }, 401);
      }
    }

    // POST /api/user/vark - Update learning style directly
    if (path === '/api/user/vark' && method === 'POST') {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return json(res, { error: 'No token provided' }, 401);
      }

      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const { learning_style } = body;
        
        const { data: user, error } = await supabase
          .from('users')
          .update({
            learning_style,
            vark_completed: true,
            updated_at: new Date().toISOString()
          })
          .eq('email', decoded.email)
          .select()
          .single();

        if (error || !user) {
          return json(res, { error: 'User not found' }, 404);
        }

        const userResponse = {
          id: user.id,
          name: user.name,
          email: user.email,
          learningStyle: user.learning_style,
          varkCompleted: user.vark_completed
        };
        
        return json(res, { user: userResponse, message: 'Learning style updated' });
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
        
        // Get current user
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('email', decoded.email)
          .single();
        
        if (!user) {
          return json(res, { error: 'User not found' }, 404);
        }
        
        const { amount } = body;
        const newXp = (user.xp || 0) + amount;
        const newLevel = Math.floor(newXp / 1000) + 1;
        
        const { data: updatedUser, error } = await supabase
          .from('users')
          .update({ 
            xp: newXp, 
            level: newLevel,
            updated_at: new Date().toISOString()
          })
          .eq('email', decoded.email)
          .select()
          .single();
        
        if (error) {
          return json(res, { error: 'Failed to update XP' }, 500);
        }
        
        const userResponse = {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          xp: updatedUser.xp,
          level: updatedUser.level
        };
        
        return json(res, { user: userResponse, xpGained: amount });
      } catch {
        return json(res, { error: 'Server error' }, 500);
      }
    }

    // ==================== CHALLENGE ROUTES ====================

    // POST /api/auth/complete-challenge - Complete a coding challenge
    if (path === '/api/auth/complete-challenge' && method === 'POST') {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return json(res, { error: 'No token provided' }, 401);
      }

      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const { challengeId, topicId, points } = body;

        // Get user
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('email', decoded.email)
          .single();

        if (!user) {
          return json(res, { error: 'User not found' }, 404);
        }

        // Check if already completed
        const { data: existingProgress } = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('challenge_id', challengeId)
          .single();

        if (existingProgress) {
          return json(res, { 
            success: true, 
            xpAwarded: 0, 
            totalXp: user.xp,
            message: 'Challenge already completed' 
          });
        }

        // Save progress
        await supabase
          .from('progress')
          .insert({
            user_id: user.id,
            challenge_id: challengeId,
            completed: true,
            points,
            completed_at: new Date().toISOString()
          });

        // Update user XP
        const newXp = (user.xp || 0) + points;
        const newLevel = Math.floor(newXp / 1000) + 1;

        await supabase
          .from('users')
          .update({ xp: newXp, level: newLevel, updated_at: new Date().toISOString() })
          .eq('id', user.id);

        // Generate new token with updated XP
        const newToken = jwt.sign({
          userId: user.id,
          email: user.email,
          name: user.name,
          learningStyle: user.learning_style,
          xp: newXp,
          level: newLevel
        }, JWT_SECRET, { expiresIn: '7d' });

        return json(res, { 
          success: true, 
          xpAwarded: points, 
          totalXp: newXp,
          token: newToken
        });
      } catch (err) {
        console.error('Challenge complete error:', err);
        return json(res, { error: 'Server error' }, 500);
      }
    }

    // GET /api/auth/challenge-progress - Get all challenge progress
    if (path === '/api/auth/challenge-progress' && method === 'GET') {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return json(res, { progress: {} });
      }

      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get user
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('email', decoded.email)
          .single();

        if (!user) {
          return json(res, { progress: {} });
        }

        // Get all progress
        const { data: progressList } = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', user.id);

        const progress = {};
        if (progressList) {
          for (const p of progressList) {
            progress[p.challenge_id] = {
              completed: p.completed,
              points: p.points,
              completedAt: p.completed_at
            };
          }
        }

        return json(res, { progress });
      } catch {
        return json(res, { progress: {} });
      }
    }

    // GET /api/auth/challenge-progress/:topicId - Get challenge progress for topic
    if (path.startsWith('/api/auth/challenge-progress/') && method === 'GET') {
      const authHeader = req.headers.authorization;
      const topicId = path.split('/').pop();
      
      if (!authHeader) {
        return json(res, { progress: {} });
      }

      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('email', decoded.email)
          .single();

        if (!user) {
          return json(res, { progress: {} });
        }

        // Get progress for challenges containing the topicId
        const { data: progressList } = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', user.id)
          .like('challenge_id', `%${topicId}%`);

        const progress = {};
        if (progressList) {
          for (const p of progressList) {
            progress[p.challenge_id] = {
              completed: p.completed,
              points: p.points,
              completedAt: p.completed_at
            };
          }
        }

        return json(res, { progress });
      } catch {
        return json(res, { progress: {} });
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
        
        // Get user
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('email', decoded.email)
          .single();
        
        if (!user) {
          return json(res, { progress: {} });
        }
        
        // Get all progress for user
        const { data: progressList } = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', user.id);
        
        // Convert to object format
        const progress = {};
        if (progressList) {
          for (const p of progressList) {
            progress[p.challenge_id] = {
              completed: p.completed,
              points: p.points,
              completedAt: p.completed_at
            };
          }
        }
        
        return json(res, { progress });
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
        
        // Get user
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('email', decoded.email)
          .single();
        
        if (!user) {
          return json(res, { error: 'User not found' }, 404);
        }
        
        // Upsert progress
        await supabase
          .from('progress')
          .upsert({
            user_id: user.id,
            challenge_id: challengeId,
            completed: true,
            points,
            completed_at: new Date().toISOString()
          }, { onConflict: 'user_id,challenge_id' });
        
        // Update user XP
        const newXp = (user.xp || 0) + points;
        const newLevel = Math.floor(newXp / 1000) + 1;
        
        await supabase
          .from('users')
          .update({ xp: newXp, level: newLevel, updated_at: new Date().toISOString() })
          .eq('id', user.id);
        
        // Get updated progress
        const { data: progressList } = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', user.id);
        
        const progress = {};
        if (progressList) {
          for (const p of progressList) {
            progress[p.challenge_id] = {
              completed: p.completed,
              points: p.points,
              completedAt: p.completed_at
            };
          }
        }
        
        return json(res, { success: true, progress });
      } catch (err) {
        console.error('Progress error:', err);
        return json(res, { error: 'Server error' }, 500);
      }
    }

    // ==================== HEALTH CHECK ====================
    if (path === '/api/health' && method === 'GET') {
      // Test Supabase connection
      const { error } = await supabase.from('users').select('count').limit(1);
      
      return json(res, { 
        status: error ? 'degraded' : 'ok', 
        timestamp: new Date().toISOString(), 
        environment: 'vercel',
        database: error ? 'disconnected' : 'connected'
      });
    }

    // ==================== 404 ====================
    return json(res, { error: 'API endpoint not found', path }, 404);

  } catch (error) {
    console.error('API Error:', error);
    return json(res, { error: 'Internal server error' }, 500);
  }
}
