-- Run this in Supabase SQL Editor to create the weak_areas table
-- Dashboard > SQL Editor > New Query

CREATE TABLE IF NOT EXISTS weak_areas (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_name TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    topic_label TEXT NOT NULL,
    wrong_count INTEGER DEFAULT 1,
    wrong_questions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    UNIQUE(user_id, topic_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_weak_areas_user_id ON weak_areas(user_id);

-- Enable Row Level Security
ALTER TABLE weak_areas ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to see only their own weak areas
CREATE POLICY "Users can view own weak areas" ON weak_areas
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own weak areas" ON weak_areas
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own weak areas" ON weak_areas
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete own weak areas" ON weak_areas
    FOR DELETE USING (true);
