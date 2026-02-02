import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import courseRoutes from './routes/course.js';
import progressRoutes from './routes/progress.js';
import questRoutes from './routes/quest.js';
import subjectsRoutes from './routes/subjects.js';
import sqlRoutes from './routes/sql.js';

// Neo4j
import { initNeo4j, createOSCurriculum } from './neo4j/database.js';
import { OS_CURRICULUM } from '../src/data/operatingSystemsCurriculum.js';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory database (replace with real DB in production)
export const db = {
  users: new Map(),
  courses: new Map(),
  progress: new Map(),
  quests: new Map(),
  sessions: new Map()
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/sql', sqlRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize Neo4j and seed data
const initDatabase = async () => {
  try {
    const driver = initNeo4j();
    if (driver) {
      await createOSCurriculum(OS_CURRICULUM);
      console.log('✅ Neo4j initialized with Operating Systems curriculum');
    } else {
      console.log('ℹ️  Using in-memory data storage (Neo4j not configured)');
    }
  } catch (error) {
    console.log('⚠️  Neo4j error, using in-memory storage:', error.message);
  }
};

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await initDatabase();  await initDatabase();
});

export default app;
