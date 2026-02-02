// Migration script to add XP column to existing users table
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath);

console.log('Running database migration...');

// Add XP column if it doesn't exist
db.run(`ALTER TABLE users ADD COLUMN xp INTEGER DEFAULT 0`, (err) => {
    if (err) {
        if (err.message.includes('duplicate column')) {
            console.log('✓ XP column already exists');
        } else {
            console.error('Error adding XP column:', err.message);
        }
    } else {
        console.log('✓ Added XP column to users table');
    }

    // Create quiz_progress table if it doesn't exist
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
            console.log('✓ Quiz progress table ready');
        }

        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('✓ Migration complete!');
            }
        });
    });
});
