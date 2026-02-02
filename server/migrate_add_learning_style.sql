-- ========================================
-- VARK Learning Style System - Manual Migration
-- ========================================
-- Run this ONLY if automatic migration fails
-- Execute: sqlite3 server/users.db < migrate_add_learning_style.sql

-- Add learning_style column to users table
ALTER TABLE users ADD COLUMN learning_style TEXT DEFAULT 'ReadWrite';

-- Verify the column was added
SELECT sql FROM sqlite_master WHERE type='table' AND name='users';

-- Show all columns in users table
PRAGMA table_info(users);

-- Optional: Set all existing NULL values to default (should not be necessary)
UPDATE users SET learning_style = 'ReadWrite' WHERE learning_style IS NULL;

-- Verification query: Show all users with their learning styles
SELECT id, name, email, learning_style FROM users LIMIT 5;

-- Success message
SELECT '✅ Migration complete! learning_style column added.' AS status;
