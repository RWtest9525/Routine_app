-- ==============================================================================
-- YASH BCA LEARNING OS — SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Yash Vishal',
  college TEXT NOT NULL DEFAULT 'Ganpat University',
  degree TEXT NOT NULL DEFAULT 'BCA (Bachelor of Computer Applications)',
  current_semester TEXT NOT NULL DEFAULT 'Semester I',
  plan_start_date DATE NOT NULL DEFAULT '2026-08-28',
  plan_end_date DATE NOT NULL DEFAULT '2027-02-28',
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  study_start_time TEXT NOT NULL DEFAULT '14:00',
  study_end_time TEXT NOT NULL DEFAULT '00:00',
  breakfast_time TEXT NOT NULL DEFAULT '07:00 - 08:00',
  lunch_time TEXT NOT NULL DEFAULT '13:00 - 14:00',
  dinner_time TEXT NOT NULL DEFAULT '19:00 - 20:00',
  is_exam_mode BOOLEAN NOT NULL DEFAULT false,
  gamification_enabled BOOLEAN NOT NULL DEFAULT true,
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  min_daily_success_percent INT NOT NULL DEFAULT 70,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SEMESTERS TABLE
CREATE TABLE IF NOT EXISTS public.semesters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  number INT NOT NULL,
  title TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  syllabus_pdf_url TEXT,
  syllabus_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  semester_id UUID REFERENCES public.semesters ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('university', 'industry')),
  credits INT NOT NULL DEFAULT 4,
  color TEXT NOT NULL DEFAULT '#6366f1',
  icon_name TEXT NOT NULL DEFAULT 'Code',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. UNITS TABLE
CREATE TABLE IF NOT EXISTS public.units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES public.subjects ON DELETE CASCADE,
  unit_number INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TOPICS TABLE (WITH 4-STAGE MASTERY CHECKLIST)
CREATE TABLE IF NOT EXISTS public.topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES public.units ON DELETE CASCADE,
  title TEXT NOT NULL,
  estimated_hours NUMERIC(4,1) NOT NULL DEFAULT 2.0,
  status TEXT NOT NULL DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'NEEDS_REVISION')),
  confidence INT NOT NULL DEFAULT 3 CHECK (confidence BETWEEN 1 AND 5),
  order_index INT NOT NULL DEFAULT 1,
  learned_done BOOLEAN NOT NULL DEFAULT false,
  practice_done BOOLEAN NOT NULL DEFAULT false,
  recall_done BOOLEAN NOT NULL DEFAULT false,
  test_done BOOLEAN NOT NULL DEFAULT false,
  notes_markdown TEXT,
  completed_at TIMESTAMPTZ,
  last_studied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DAILY TASKS TABLE
CREATE TABLE IF NOT EXISTS public.daily_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  date DATE NOT NULL,
  time_block TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('university', 'coding', 'industry', 'project', 'revision')),
  title TEXT NOT NULL,
  subject_code TEXT,
  topic_id UUID REFERENCES public.topics ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'skipped')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  xp_awarded INT NOT NULL DEFAULT 20,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. STUDY SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects ON DELETE SET NULL,
  subject_code TEXT NOT NULL,
  topic_id UUID REFERENCES public.topics ON DELETE SET NULL,
  duration_minutes INT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. DSA PROBLEMS TABLE
CREATE TABLE IF NOT EXISTS public.dsa_problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NOT_ATTEMPTED' CHECK (status IN ('NOT_ATTEMPTED', 'ATTEMPTED', 'SOLVED', 'NEEDS_REVISION')),
  attempts INT NOT NULL DEFAULT 0,
  confidence INT NOT NULL DEFAULT 3,
  solved_date TIMESTAMPTZ,
  notes TEXT,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'Idea' CHECK (status IN ('Idea', 'Planning', 'Development', 'Testing', 'Deployed', 'Completed')),
  start_date DATE NOT NULL,
  target_date DATE NOT NULL,
  github_url TEXT,
  live_url TEXT,
  progress_percent INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PROJECT TASKS TABLE
CREATE TABLE IF NOT EXISTS public.project_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. NOTES TABLE
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  subject_code TEXT NOT NULL,
  topic_id UUID REFERENCES public.topics ON DELETE SET NULL,
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. WEEKLY REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.weekly_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  study_hours NUMERIC(5,1) NOT NULL,
  coding_hours NUMERIC(5,1) NOT NULL,
  topics_completed INT NOT NULL,
  problems_solved INT NOT NULL,
  university_progress INT NOT NULL,
  industry_progress INT NOT NULL,
  what_went_well TEXT,
  what_was_difficult TEXT,
  what_should_improve TEXT,
  next_week_priorities TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dsa_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage their daily tasks" ON public.daily_tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their study sessions" ON public.study_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their dsa problems" ON public.dsa_problems FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their projects" ON public.projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their notes" ON public.notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their weekly reviews" ON public.weekly_reviews FOR ALL USING (auth.uid() = user_id);
