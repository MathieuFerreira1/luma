-- ============================================================
-- Luma - Initialization Script for Supabase
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Table: profiles
-- Stores user data linked to Supabase Auth
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT,
    avatar_url TEXT,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    max_streak INTEGER DEFAULT 0,
    last_lesson_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function: Auto-create profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: On auth.user created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Table: categories
-- Content categories (Sleep, Nutrition, Brain, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    color TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, icon, color, description, sort_order) VALUES
    ('Sommeil', 'sleep', 'moon-o', '#AFCBFF', 'Comprendre votre cycle de sommeil et comment l''améliorer', 1),
    ('Nutrition', 'nutrition', 'apple', '#9DB8A1', 'Les bases de l''alimentation pour une santé optimale', 2),
    ('Cerveau & Énergie', 'brain', 'bolt', '#F4C95D', 'Focus, motivation et compréhension de votre esprit', 3),
    ('Mouvement', 'movement', 'heartbeat', '#E8A87C', 'Activité physique et bien-être corporel', 4),
    ('Longévité', 'longevity', 'leaf', '#B8A9C9', 'Vieillir en bonne santé et prévention', 5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Table: lessons
-- Individual lessons with JSON content blocks
-- ============================================================
CREATE TABLE IF NOT EXISTS lessons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    hook TEXT NOT NULL,
    description TEXT,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    estimated_time INTEGER DEFAULT 3,
    xp_reward INTEGER DEFAULT 20,
    blocks JSONB DEFAULT '[]'::jsonb,
    order_index INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Table: quizzes
-- Quiz questions linked to lessons
-- ============================================================
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0),
    explanation TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Table: user_progress
-- Tracks which lessons users have completed
-- ============================================================
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    xp_earned INTEGER DEFAULT 0,
    quiz_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- ============================================================
-- Table: achievements
-- Badge/achievement definitions
-- ============================================================
CREATE TABLE IF NOT EXISTS achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon TEXT,
    condition_type TEXT NOT NULL,
    condition_value INTEGER DEFAULT 1,
    xp_reward INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default achievements
INSERT INTO achievements (name, slug, description, icon, condition_type, condition_value, xp_reward) VALUES
    ('Première leçon', 'first-lesson', 'Complétez votre première leçon', 'star', 'lessons_completed', 1, 10),
    ('5 leçons', 'five-lessons', 'Complétez 5 leçons', 'book', 'lessons_completed', 5, 25),
    ('10 leçons', 'ten-lessons', 'Complétez 10 leçons', 'book', 'lessons_completed', 10, 50),
    ('Explorateur Sommeil', 'sleep-explorer', 'Complétez 3 leçons sur le sommeil', 'moon-o', 'category_lessons', 3, 30),
    ('Explorateur Nutrition', 'nutrition-explorer', 'Complétez 3 leçons sur la nutrition', 'apple', 'category_lessons', 3, 30),
    ('3 jours de suite', 'streak-3', 'Maintenez une série de 3 jours', 'fire', 'streak', 3, 20),
    ('7 jours de suite', 'streak-7', 'Maintenez une série de 7 jours', 'fire', 'streak', 7, 50),
    ('Quiz Parfait', 'perfect-quiz', 'Obtenez 100% à un quiz', 'star-o', 'perfect_quiz', 1, 15),
    ('Niveau 3', 'level-3', 'Atteignez le niveau 3', 'trophy', 'level', 3, 30),
    ('Niveau 5', 'level-5', 'Atteignez le niveau 5', 'trophy', 'level', 5, 50)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Table: user_achievements
-- Tracks which achievements users have unlocked
-- ============================================================
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, only update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Categories: Everyone can read
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

-- Lessons: Everyone can read published lessons
CREATE POLICY "Published lessons are viewable by everyone" ON lessons
    FOR SELECT USING (is_published = true);

-- Quizzes: Everyone can read (linked to published lessons)
CREATE POLICY "Quizzes are viewable by everyone" ON quizzes
    FOR SELECT USING (true);

-- User Progress: Users can only see/modify their own
CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Achievements: Everyone can read
CREATE POLICY "Achievements are viewable by everyone" ON achievements
    FOR SELECT USING (true);

-- User Achievements: Users can only see their own
CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Function: Update XP and check level up
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_lesson_completion()
RETURNS TRIGGER AS $$
DECLARE
    xp_threshold INTEGER;
BEGIN
    -- Only process if newly completed
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.completed = true AND OLD.completed = false) THEN
        -- Update user XP
        UPDATE profiles
        SET xp = xp + NEW.xp_earned
        WHERE id = NEW.user_id;
        
        -- Check and update level (simple threshold system)
        UPDATE profiles
        SET level = CASE
            WHEN xp >= 2500 THEN 8
            WHEN xp >= 1850 THEN 7
            WHEN xp >= 1300 THEN 6
            WHEN xp >= 850 THEN 5
            WHEN xp >= 500 THEN 4
            WHEN xp >= 250 THEN 3
            WHEN xp >= 100 THEN 2
            ELSE 1
        END
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on user_progress changes
DROP TRIGGER IF EXISTS on_lesson_completed ON user_progress;
CREATE TRIGGER on_lesson_completed
    AFTER INSERT OR UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION public.handle_lesson_completion();

-- ============================================================
-- Function: Auto-update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons;
CREATE TRIGGER update_lessons_updated_at
    BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- Storage: Create bucket for avatars if needed
-- ============================================================
-- Note: Run this in Supabase Dashboard > Storage > New Bucket
-- Bucket name: "avatars"
-- Public: true
-- Allowed file types: image/*
-- Max file size: 2MB
