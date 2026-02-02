import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create database connection
const dbPath = join(__dirname, '..', 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Users table with email as unique identifier
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      xp INTEGER DEFAULT 0,
      vark_completed BOOLEAN DEFAULT 0,
      learning_style TEXT DEFAULT 'ReadWrite',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table ready');
      // Migration: Add learning_style column if it doesn't exist (for existing databases)
      db.run(`ALTER TABLE users ADD COLUMN learning_style TEXT DEFAULT 'ReadWrite'`, (alterErr) => {
        if (alterErr) {
          // Column likely already exists, safe to ignore
          if (!alterErr.message.includes('duplicate column')) {
            console.log('Note: learning_style column migration skipped (may already exist)');
          }
        } else {
          console.log('✅ Added learning_style column to users table');
        }
      });
    }
  });

  // Quiz progress table - tracks which quizzes each user has completed
  db.run(`
    CREATE TABLE IF NOT EXISTS quiz_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      course_name TEXT NOT NULL,
      topic_id TEXT NOT NULL,
      quiz_title TEXT NOT NULL,
      score INTEGER,
      total_questions INTEGER,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      xp_awarded BOOLEAN DEFAULT 0,
      FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,
      UNIQUE(user_email, course_name, topic_id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating quiz_progress table:', err.message);
    } else {
      console.log('Quiz progress table ready');
    }
  });

  // Quiz weak areas table - tracks topics where users made mistakes for insights
  db.run(`
    CREATE TABLE IF NOT EXISTS quiz_weak_areas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      course_name TEXT NOT NULL,
      topic_id TEXT NOT NULL,
      topic_label TEXT,
      question_text TEXT,
      wrong_count INTEGER DEFAULT 1,
      last_wrong_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reviewed BOOLEAN DEFAULT 0,
      FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating quiz_weak_areas table:', err.message);
    } else {
      console.log('Quiz weak areas table ready');
    }
  });

  // Quiz question stats table - tracks how many users got each question right/wrong
  db.run(`
    CREATE TABLE IF NOT EXISTS quiz_question_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id TEXT NOT NULL,
      question_hash TEXT NOT NULL,
      correct_count INTEGER DEFAULT 0,
      wrong_count INTEGER DEFAULT 0,
      UNIQUE(topic_id, question_hash)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating quiz_question_stats table:', err.message);
    } else {
      console.log('Quiz question stats table ready');
    }
  });

  // VARK responses table - stores user learning style questionnaire responses
  db.run(`
    CREATE TABLE IF NOT EXISTS vark_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL UNIQUE,
      responses TEXT NOT NULL,
      visual_score INTEGER DEFAULT 0,
      aural_score INTEGER DEFAULT 0,
      read_write_score INTEGER DEFAULT 0,
      kinesthetic_score INTEGER DEFAULT 0,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating vark_responses table:', err.message);
    } else {
      console.log('VARK responses table ready');
    }
  });

  // Content table - stores learning resources with VARK types
  db.run(`
    CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL,
      url TEXT,
      course TEXT,
      topic_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating content table:', err.message);
    } else {
      console.log('Content table ready');
      // Seed dummy data if table is empty
      db.get('SELECT COUNT(*) as count FROM content', [], (err, row) => {
        if (!err && row.count === 0) {
          seedContentData();
        }
      });
    }
  });
}

// Seed content data with different VARK types - USING REAL YOUTUBE URLS from curriculum
function seedContentData() {
  const contentData = [
    // ==================== DATA STRUCTURES ====================
    // Visual content (videos, diagrams)
    { title: 'Introduction to Data Structures', description: 'Complete introduction to data structures with visual examples', type: 'video', url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM', course: 'data-structures', topic_id: 'ds-intro' },
    { title: 'Data Structures Full Course', description: 'Comprehensive visual course covering all DS concepts', type: 'video', url: 'https://www.youtube.com/watch?v=B31LgI4Y4DQ', course: 'data-structures', topic_id: 'ds-intro' },
    { title: 'Stack Data Structure', description: 'Visual explanation of stack operations', type: 'video', url: 'https://www.youtube.com/watch?v=F1F2imiOJfk', course: 'data-structures', topic_id: 'stacks' },
    { title: 'Queue Data Structure', description: 'Visual guide to queue operations and circular queues', type: 'video', url: 'https://www.youtube.com/watch?v=zp6pBNbUB2U', course: 'data-structures', topic_id: 'queues' },
    { title: 'Linked List Data Structure', description: 'Visual explanation of linked list operations', type: 'video', url: 'https://www.youtube.com/watch?v=R9PTBwOzceo', course: 'data-structures', topic_id: 'linked-lists' },
    { title: 'Binary Search Trees', description: 'Visual guide to BST operations and traversals', type: 'video', url: 'https://www.youtube.com/watch?v=pYT9F8_LFTM', course: 'data-structures', topic_id: 'trees-intro' },
    { title: 'Heap Data Structure', description: 'Visual explanation of heaps and heap sort', type: 'video', url: 'https://www.youtube.com/watch?v=HqPJF2L5h9U', course: 'data-structures', topic_id: 'heaps' },
    { title: 'Graph Data Structure', description: 'Visual introduction to graphs and representations', type: 'video', url: 'https://www.youtube.com/watch?v=gXgEDyodOJU', course: 'data-structures', topic_id: 'graphs' },

    // Read/Write content (text, notes)
    { title: 'Data Structures Cheat Sheet', description: 'Quick reference for all DS operations and complexities', type: 'text', url: 'https://www.geeksforgeeks.org/data-structures/', course: 'data-structures', topic_id: 'ds-intro' },
    { title: 'Algorithms Textbook Notes', description: 'Detailed notes on sorting and searching algorithms', type: 'text', url: 'https://www.programiz.com/dsa/algorithm', course: 'data-structures', topic_id: 'ds-intro' },

    // Kinesthetic content (quizzes, exercises)
    { title: 'Binary Search Practice', description: 'Interactive coding challenge for binary search', type: 'quiz', url: '/subject/data-structures#recursion', course: 'data-structures', topic_id: 'recursion' },
    { title: 'Stack Operations Quiz', description: 'Test your understanding of stack operations', type: 'quiz', url: '/subject/data-structures#stacks', course: 'data-structures', topic_id: 'stacks' },

    // ==================== OPERATING SYSTEMS ====================
    // Visual content
    { title: 'Introduction to Operating Systems', description: 'Visual overview of OS concepts and components', type: 'video', url: 'https://www.youtube.com/watch?v=vBURTt97EkA', course: 'operating-systems', topic_id: 'os-intro' },
    { title: 'Process Management in OS', description: 'Visual guide to processes and PCB', type: 'video', url: 'https://www.youtube.com/watch?v=OrM7nZcxXZU', course: 'operating-systems', topic_id: 'process-concept' },
    { title: 'CPU Scheduling Algorithms', description: 'Visual explanation of FCFS, SJF, Round Robin', type: 'video', url: 'https://www.youtube.com/watch?v=EWkQl0n0w5M', course: 'operating-systems', topic_id: 'cpu-scheduling' },
    { title: 'Threads in Operating System', description: 'Visual guide to multithreading concepts', type: 'video', url: 'https://www.youtube.com/watch?v=LOfGJcVnvAk', course: 'operating-systems', topic_id: 'threads' },
    { title: 'Memory Management in OS', description: 'Visual explanation of paging and segmentation', type: 'video', url: 'https://www.youtube.com/watch?v=qdkxXygc3rE', course: 'operating-systems', topic_id: 'memory-management' },
    { title: 'Deadlock in Operating System', description: 'Visual guide to deadlock detection and prevention', type: 'video', url: 'https://www.youtube.com/watch?v=UVo9mGARkhQ', course: 'operating-systems', topic_id: 'deadlocks' },

    // Auditory content (discussion-based videos)
    { title: 'OS Process States Discussion', description: 'Audio-focused lecture on process states', type: 'audio', url: 'https://www.youtube.com/watch?v=jZ_6PXoaoxo', course: 'operating-systems', topic_id: 'process-concept' },
    { title: 'Bankers Algorithm Explained', description: 'Discussion on deadlock avoidance', type: 'audio', url: 'https://www.youtube.com/watch?v=bx6V-PgoMyI', course: 'operating-systems', topic_id: 'deadlocks' },

    // Read/Write content
    { title: 'OS Concepts Summary', description: 'Written summary of operating system fundamentals', type: 'text', url: 'https://www.geeksforgeeks.org/operating-systems/', course: 'operating-systems', topic_id: 'os-intro' },
    { title: 'Memory Management Notes', description: 'Comprehensive notes on paging and segmentation', type: 'text', url: 'https://www.tutorialspoint.com/operating_system/os_memory_management.htm', course: 'operating-systems', topic_id: 'memory-management' },

    // Kinesthetic content
    { title: 'CPU Scheduling Quiz', description: 'Practice problems for scheduling algorithms', type: 'quiz', url: '/subject/operating-systems#cpu-scheduling', course: 'operating-systems', topic_id: 'cpu-scheduling' },
    { title: 'Threading Exercise', description: 'Hands-on practice with multithreading concepts', type: 'quiz', url: '/subject/operating-systems#threads', course: 'operating-systems', topic_id: 'threads' },

    // ==================== DATABASE SYSTEMS ====================
    // Visual content
    { title: 'Database ER Diagrams Tutorial', description: 'Visual guide to entity-relationship modeling', type: 'video', url: 'https://www.youtube.com/watch?v=QpdhBUYk7Kk', course: 'database-systems', topic_id: 'er-model' },
    { title: 'SQL Tutorial for Beginners', description: 'Visual introduction to SQL queries', type: 'video', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', course: 'database-systems', topic_id: 'sql' },

    // Read/Write content
    { title: 'SQL Reference Manual', description: 'Complete reference for SQL commands and syntax', type: 'text', url: 'https://www.w3schools.com/sql/', course: 'database-systems', topic_id: 'sql' },
    { title: 'Normalization Guide', description: 'Written guide to database normalization forms', type: 'text', url: 'https://www.geeksforgeeks.org/normal-forms-in-dbms/', course: 'database-systems', topic_id: 'normalization' },

    // Kinesthetic content
    { title: 'SQL Query Practice', description: 'Hands-on practice with SQL queries', type: 'quiz', url: 'https://www.w3schools.com/sql/sql_exercises.asp', course: 'database-systems', topic_id: 'sql' },

    // ==================== COMPUTER NETWORKS ====================
    // Visual content
    { title: 'OSI Model Explained', description: 'Visual guide to OSI layers', type: 'video', url: 'https://www.youtube.com/watch?v=vv4y_uOneC0', course: 'computer-networks', topic_id: 'osi-model' },
    { title: 'TCP/IP Protocol Suite', description: 'Visual explanation of networking protocols', type: 'video', url: 'https://www.youtube.com/watch?v=2QGgEk20RXM', course: 'computer-networks', topic_id: 'protocols' },

    // Read/Write content
    { title: 'Networking Protocols Guide', description: 'Written guide to TCP/IP and OSI model', type: 'text', url: 'https://www.geeksforgeeks.org/computer-network-tutorials/', course: 'computer-networks', topic_id: 'protocols' },

    // Kinesthetic content
    { title: 'Network Packet Analysis Lab', description: 'Interactive lab for analyzing network packets', type: 'quiz', url: '/subject/computer-networks#packets', course: 'computer-networks', topic_id: 'packets' }
  ];

  const stmt = db.prepare('INSERT INTO content (title, description, type, url, course, topic_id) VALUES (?, ?, ?, ?, ?, ?)');
  contentData.forEach(item => {
    stmt.run(item.title, item.description, item.type, item.url, item.course, item.topic_id);
  });
  stmt.finalize(() => {
    console.log('✅ Content table seeded with REAL VARK-tagged resources from curriculum');
  });
}

// Signup endpoint
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (row) {
        return res.status(409).json({ error: 'Email already exists', shouldRedirectToLogin: true });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Insert user
      db.run(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
        [name, email, passwordHash],
        function (err) {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ error: 'Error creating user' });
          }

          // Generate JWT token
          const token = jwt.sign(
            { id: this.lastID, email, name, xp: 0, varkCompleted: false, learningStyle: 'ReadWrite' },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: this.lastID, name, email, xp: 0, varkCompleted: false, learningStyle: 'ReadWrite' }
          });
        }
      );
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Find user
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    try {
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          xp: user.xp || 0,
          varkCompleted: user.vark_completed || false,
          learningStyle: user.learning_style || 'ReadWrite'
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          xp: user.xp || 0,
          varkCompleted: user.vark_completed || false,
          learningStyle: user.learning_style || 'ReadWrite'
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
});

// Verify token endpoint - fetches fresh user data from database
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch fresh user data from database to ensure we have latest varkCompleted and learningStyle
    db.get(
      'SELECT id, name, email, xp, vark_completed, learning_style FROM users WHERE id = ?',
      [decoded.id],
      (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
          return res.status(401).json({ error: 'User not found' });
        }

        // Return fresh user data
        res.json({
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            xp: user.xp || 0,
            varkCompleted: user.vark_completed === 1 || user.vark_completed === true,
            learningStyle: user.learning_style || null
          }
        });
      }
    );
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Middleware to verify token (must be defined before routes that use it)
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Get leaderboard (top 10 users by XP)
router.get('/leaderboard', (req, res) => {
  db.all(
    'SELECT id, name, xp FROM users ORDER BY xp DESC LIMIT 10',
    [],
    (err, users) => {
      if (err) {
        console.error('Error fetching leaderboard:', err);
        return res.status(500).json({ error: 'Error fetching leaderboard' });
      }
      res.json({ leaderboard: users });
    }
  );
});

// Complete quiz - awards XP and marks as completed
router.post('/complete-quiz', authenticate, (req, res) => {
  const { courseName, topicId, quizTitle, score, totalQuestions } = req.body;
  const userEmail = req.user.email;

  if (!courseName || !topicId || !quizTitle || score === undefined || !totalQuestions) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if quiz already completed
  db.get(
    'SELECT * FROM quiz_progress WHERE user_email = ? AND course_name = ? AND topic_id = ?',
    [userEmail, courseName, topicId],
    (err, existing) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      const xpToAward = existing && existing.xp_awarded ? 0 : 10; // Only award XP if not already awarded

      // Insert or update quiz progress
      db.run(
        `INSERT INTO quiz_progress (user_email, course_name, topic_id, quiz_title, score, total_questions, xp_awarded)
         VALUES (?, ?, ?, ?, ?, ?, 1)
         ON CONFLICT(user_email, course_name, topic_id) 
         DO UPDATE SET score = ?, total_questions = ?, completed_at = CURRENT_TIMESTAMP, xp_awarded = 1`,
        [userEmail, courseName, topicId, quizTitle, score, totalQuestions, score, totalQuestions],
        function (err) {
          if (err) {
            console.error('Error saving quiz progress:', err);
            return res.status(500).json({ error: 'Error saving progress' });
          }

          // Update user XP
          db.run(
            'UPDATE users SET xp = xp + ? WHERE email = ?',
            [xpToAward, userEmail],
            function (err) {
              if (err) {
                console.error('Error updating XP:', err);
                return res.status(500).json({ error: 'Error updating XP' });
              }

              // Get updated user data
              db.get('SELECT id, name, email, xp FROM users WHERE email = ?', [userEmail], (err, user) => {
                if (err || !user) {
                  return res.status(500).json({ error: 'Error fetching user' });
                }

                // Generate new token with updated XP
                const token = jwt.sign(
                  { id: user.id, email: user.email, name: user.name, xp: user.xp },
                  JWT_SECRET,
                  { expiresIn: '7d' }
                );

                res.json({
                  message: 'Quiz completed successfully',
                  xpAwarded: xpToAward,
                  totalXp: user.xp,
                  token
                });
              });
            }
          );
        }
      );
    }
  );
});

// Get user's quiz progress for a course
router.get('/quiz-progress/:courseName', authenticate, (req, res) => {
  const { courseName } = req.params;
  const userEmail = req.user.email;

  db.all(
    'SELECT * FROM quiz_progress WHERE user_email = ? AND course_name = ?',
    [userEmail, courseName],
    (err, progress) => {
      if (err) {
        console.error('Error fetching progress:', err);
        return res.status(500).json({ error: 'Error fetching progress' });
      }
      res.json({ progress: progress || [] });
    }
  );
});

// Middleware to verify token (duplicate - will be removed)
const authenticateDuplicate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Submit VARK questionnaire responses
router.post('/vark-submit', authenticate, (req, res) => {
  const { responses } = req.body;
  const userEmail = req.user.email;

  if (!responses || typeof responses !== 'object') {
    return res.status(400).json({ error: 'Invalid responses format' });
  }

  // Calculate scores
  const varkMapping = {
    q1: { a: 'K', b: 'A', c: 'R', d: 'V' }, q2: { a: 'V', b: 'A', c: 'R', d: 'K' },
    q3: { a: 'K', b: 'V', c: 'R', d: 'A' }, q4: { a: 'K', b: 'A', c: 'V', d: 'R' },
    q5: { a: 'A', b: 'V', c: 'K', d: 'R' }, q6: { a: 'R', b: 'V', c: 'A', d: 'K' },
    q7: { a: 'K', b: 'A', c: 'V', d: 'R' }, q8: { a: 'V', b: 'R', c: 'A', d: 'K' },
    q9: { a: 'R', b: 'A', c: 'K', d: 'V' }, q10: { a: 'K', b: 'V', c: 'R', d: 'A' },
    q11: { a: 'A', b: 'K', c: 'V', d: 'R' }, q12: { a: 'V', b: 'R', c: 'A', d: 'K' },
    q13: { a: 'R', b: 'K', c: 'V', d: 'A' }, q14: { a: 'A', b: 'V', c: 'K', d: 'R' },
    q15: { a: 'K', b: 'R', c: 'A', d: 'V' }, q16: { a: 'V', b: 'A', c: 'R', d: 'K' }
  };

  const scores = { visual: 0, aural: 0, readWrite: 0, kinesthetic: 0 };
  Object.keys(responses).forEach(qKey => {
    const style = varkMapping[qKey]?.[responses[qKey]];
    if (style === 'V') scores.visual++;
    else if (style === 'A') scores.aural++;
    else if (style === 'R') scores.readWrite++;
    else if (style === 'K') scores.kinesthetic++;
  });

  // Determine dominant learning style
  const maxScore = Math.max(scores.visual, scores.aural, scores.readWrite, scores.kinesthetic);
  let dominantStyle = 'Multimodal';
  if (scores.visual === maxScore && scores.visual > scores.aural && scores.visual > scores.readWrite && scores.visual > scores.kinesthetic) {
    dominantStyle = 'Visual';
  } else if (scores.aural === maxScore && scores.aural > scores.visual && scores.aural > scores.readWrite && scores.aural > scores.kinesthetic) {
    dominantStyle = 'Aural';
  } else if (scores.readWrite === maxScore && scores.readWrite > scores.visual && scores.readWrite > scores.aural && scores.readWrite > scores.kinesthetic) {
    dominantStyle = 'ReadWrite';
  } else if (scores.kinesthetic === maxScore && scores.kinesthetic > scores.visual && scores.kinesthetic > scores.aural && scores.kinesthetic > scores.readWrite) {
    dominantStyle = 'Kinesthetic';
  }

  db.run(
    `INSERT INTO vark_responses (user_email, responses, visual_score, aural_score, read_write_score, kinesthetic_score)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_email) DO UPDATE SET responses = ?, visual_score = ?, aural_score = ?, read_write_score = ?, kinesthetic_score = ?, updated_at = CURRENT_TIMESTAMP`,
    [userEmail, JSON.stringify(responses), scores.visual, scores.aural, scores.readWrite, scores.kinesthetic,
      JSON.stringify(responses), scores.visual, scores.aural, scores.readWrite, scores.kinesthetic],
    function (err) {
      if (err) return res.status(500).json({ error: 'Error saving responses' });

      // Update user's vark_completed AND learning_style
      db.run('UPDATE users SET vark_completed = 1, learning_style = ? WHERE email = ?', [dominantStyle, userEmail], function (err) {
        if (err) return res.status(500).json({ error: 'Error updating status' });

        db.get('SELECT * FROM users WHERE email = ?', [userEmail], (err, user) => {
          if (err || !user) return res.status(500).json({ error: 'Error fetching user' });

          const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, xp: user.xp, varkCompleted: true, learningStyle: dominantStyle },
            JWT_SECRET,
            { expiresIn: '7d' }
          );
          res.json({ message: 'Questionnaire completed', token, scores, learningStyle: dominantStyle });
        });
      });
    }
  );
});

// Get VARK responses
router.get('/vark-responses', authenticate, (req, res) => {
  db.get('SELECT * FROM vark_responses WHERE user_email = ?', [req.user.email], (err, data) => {
    if (err) return res.status(500).json({ error: 'Error fetching responses' });
    if (!data) return res.json({ responses: null });
    res.json({ responses: JSON.parse(data.responses) });
  });
});

// =============== CODING CHALLENGE ENDPOINTS ===============

// Create coding_challenges table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS coding_challenge_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    challenge_id TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    xp_awarded INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 1,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,
    UNIQUE(user_email, challenge_id)
  )
`, (err) => {
  if (err && !err.message.includes('already exists')) {
    console.error('Error creating coding_challenge_progress table:', err.message);
  }
});

// Complete coding challenge - awards XP
router.post('/complete-challenge', authenticate, (req, res) => {
  const { challengeId, topicId, points } = req.body;
  const userEmail = req.user.email;

  if (!challengeId || !topicId || points === undefined) {
    return res.status(400).json({ error: 'Missing required fields: challengeId, topicId, points' });
  }

  // Check if challenge already completed
  db.get(
    'SELECT * FROM coding_challenge_progress WHERE user_email = ? AND challenge_id = ?',
    [userEmail, challengeId],
    (err, existing) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      // Only award XP if not already completed
      const xpToAward = existing ? 0 : points;
      const isFirstCompletion = !existing;

      if (existing) {
        // Update attempts count
        db.run(
          'UPDATE coding_challenge_progress SET attempts = attempts + 1 WHERE user_email = ? AND challenge_id = ?',
          [userEmail, challengeId],
          (err) => {
            if (err) console.error('Error updating attempts:', err);
          }
        );

        return res.json({
          message: 'Challenge already completed',
          xpAwarded: 0,
          totalXp: req.user.xp,
          alreadyCompleted: true
        });
      }

      // Insert new completion record
      db.run(
        `INSERT INTO coding_challenge_progress (user_email, challenge_id, topic_id, xp_awarded)
         VALUES (?, ?, ?, ?)`,
        [userEmail, challengeId, topicId, xpToAward],
        function (err) {
          if (err) {
            console.error('Error saving challenge progress:', err);
            return res.status(500).json({ error: 'Error saving progress' });
          }

          // Update user XP
          db.run(
            'UPDATE users SET xp = xp + ? WHERE email = ?',
            [xpToAward, userEmail],
            function (err) {
              if (err) {
                console.error('Error updating XP:', err);
                return res.status(500).json({ error: 'Error updating XP' });
              }

              // Get updated user data
              db.get('SELECT id, name, email, xp, learning_style FROM users WHERE email = ?', [userEmail], (err, user) => {
                if (err || !user) {
                  return res.status(500).json({ error: 'Error fetching user' });
                }

                // Generate new token with updated XP
                const token = jwt.sign(
                  { 
                    id: user.id, 
                    email: user.email, 
                    name: user.name, 
                    xp: user.xp,
                    learningStyle: user.learning_style
                  },
                  JWT_SECRET,
                  { expiresIn: '7d' }
                );

                res.json({
                  message: 'Challenge completed successfully!',
                  xpAwarded: xpToAward,
                  totalXp: user.xp,
                  token,
                  isFirstCompletion: true
                });
              });
            }
          );
        }
      );
    }
  );
});

// Get user's coding challenge progress
router.get('/challenge-progress', authenticate, (req, res) => {
  const userEmail = req.user.email;

  db.all(
    'SELECT challenge_id, topic_id, xp_awarded, completed_at, attempts FROM coding_challenge_progress WHERE user_email = ?',
    [userEmail],
    (err, progress) => {
      if (err) {
        console.error('Error fetching challenge progress:', err);
        return res.status(500).json({ error: 'Error fetching progress' });
      }
      
      // Return as a map for easy lookup
      const progressMap = {};
      (progress || []).forEach(p => {
        progressMap[p.challenge_id] = {
          topicId: p.topic_id,
          xpAwarded: p.xp_awarded,
          completedAt: p.completed_at,
          attempts: p.attempts
        };
      });
      
      res.json({ progress: progressMap });
    }
  );
});

// Get challenge progress for a specific topic
router.get('/challenge-progress/:topicId', authenticate, (req, res) => {
  const { topicId } = req.params;
  const userEmail = req.user.email;

  db.all(
    'SELECT * FROM coding_challenge_progress WHERE user_email = ? AND topic_id = ?',
    [userEmail, topicId],
    (err, progress) => {
      if (err) {
        console.error('Error fetching progress:', err);
        return res.status(500).json({ error: 'Error fetching progress' });
      }
      res.json({ progress: progress || [] });
    }
  );
});

export { authenticate };
export default router;

