-- ISO Institute — initial Supabase schema (Phase 0–2)
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (extends auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  gender TEXT CHECK (gender IN ('male', 'female')),
  avatar_url TEXT,
  roles TEXT[] NOT NULL DEFAULT '{}',
  active_role TEXT CHECK (active_role IN ('player', 'coach')),
  player_onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
  coach_onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
  coach_application_status TEXT CHECK (coach_application_status IN ('pending', 'approved', 'rejected')),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);

-- ---------------------------------------------------------------------------
-- Subscriptions (plan changes admin-only until Stripe)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'walk-on' CHECK (plan IN ('walk-on', 'locker-room', 'varsity')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Onboarding
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.onboarding_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('player', 'coach', 'explorer')),
  screen TEXT,
  answers JSONB NOT NULL DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS onboarding_sessions_user_role_idx
  ON public.onboarding_sessions(user_id, role);

CREATE TABLE IF NOT EXISTS public.player_assessments (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  assessed_level TEXT NOT NULL CHECK (assessed_level IN ('freshman', 'jv', 'varsity', 'd1', 'professional')),
  score INTEGER NOT NULL DEFAULT 0,
  reasoning TEXT,
  breakthrough TEXT,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coach_assessments (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  overall_rating INTEGER NOT NULL DEFAULT 0,
  tier TEXT NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold', 'premium')),
  tier_label TEXT,
  strengths TEXT[] NOT NULL DEFAULT '{}',
  opportunities TEXT[] NOT NULL DEFAULT '{}',
  reasoning TEXT,
  application_status TEXT NOT NULL DEFAULT 'pending' CHECK (application_status IN ('pending', 'approved', 'rejected')),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id),
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Extended profiles
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.player_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  school_year TEXT,
  age TEXT,
  locations JSONB NOT NULL DEFAULT '[]',
  prefers_same_background BOOLEAN NOT NULL DEFAULT FALSE,
  goals TEXT,
  timeframe TEXT,
  communication_preference TEXT,
  structure_preference TEXT,
  motivation_level TEXT,
  top_values TEXT[] NOT NULL DEFAULT '{}',
  completion_pct INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coach_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  pathway_id TEXT,
  bio TEXT,
  years_of_experience TEXT,
  current_role TEXT,
  locations JSONB NOT NULL DEFAULT '[]',
  expertise_areas TEXT[] NOT NULL DEFAULT '{}',
  specific_skills TEXT[] NOT NULL DEFAULT '{}',
  industry_experience TEXT[] NOT NULL DEFAULT '{}',
  coaching_style TEXT,
  communication_style TEXT,
  structure_preference TEXT,
  weekly_hours_available TEXT,
  preferred_meeting_times TEXT[] NOT NULL DEFAULT '{}',
  max_players INTEGER,
  ideal_player_traits TEXT[] NOT NULL DEFAULT '{}',
  coaching_goals TEXT,
  success_stories TEXT,
  core_values TEXT[] NOT NULL DEFAULT '{}',
  faith_integration TEXT,
  motivations TEXT,
  linkedin TEXT,
  photo_url TEXT,
  photo_frame JSONB,
  card_display JSONB,
  is_discoverable BOOLEAN NOT NULL DEFAULT FALSE,
  completion_pct INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Pathways
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.player_pathways (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  exploring_pathway_id TEXT,
  locked_pathway_id TEXT,
  pathway_selection_completed BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pathway_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_pathway TEXT NOT NULL,
  requested_pathway TEXT NOT NULL,
  justification TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  auto_approve_at TIMESTAMPTZ NOT NULL,
  reviewed_by UUID REFERENCES public.profiles(id),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- ---------------------------------------------------------------------------
-- Updated-at trigger
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS onboarding_sessions_updated_at ON public.onboarding_sessions;
CREATE TRIGGER onboarding_sessions_updated_at
  BEFORE UPDATE ON public.onboarding_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- New user bootstrap
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.email, '') = 'yhamu27@gmail.com'
  );

  INSERT INTO public.subscriptions (user_id, plan)
  VALUES (NEW.id, 'walk-on');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pathway_change_requests ENABLE ROW LEVEL SECURITY;

-- Helper: admin check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    FALSE
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- Profiles
CREATE POLICY "profiles_select_own_or_admin"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Subscriptions: users read own; only admins update plan
CREATE POLICY "subscriptions_select_own_or_admin"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "subscriptions_update_admin"
  ON public.subscriptions FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "subscriptions_insert_own"
  ON public.subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Onboarding sessions
CREATE POLICY "onboarding_sessions_own"
  ON public.onboarding_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Assessments
CREATE POLICY "player_assessments_own"
  ON public.player_assessments FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "coach_assessments_select"
  ON public.coach_assessments FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.is_admin()
    OR application_status = 'approved'
  );

CREATE POLICY "coach_assessments_insert_own"
  ON public.coach_assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "coach_assessments_update_own_or_admin"
  ON public.coach_assessments FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

-- Player profiles
CREATE POLICY "player_profiles_own"
  ON public.player_profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Coach profiles: discoverable approved coaches are public read
CREATE POLICY "coach_profiles_select"
  ON public.coach_profiles FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.is_admin()
    OR is_discoverable = TRUE
  );

CREATE POLICY "coach_profiles_write_own"
  ON public.coach_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "coach_profiles_update_own"
  ON public.coach_profiles FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

-- Player pathways
CREATE POLICY "player_pathways_own"
  ON public.player_pathways FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Pathway change requests
CREATE POLICY "pathway_change_requests_own"
  ON public.pathway_change_requests FOR SELECT
  USING (auth.uid() = player_id OR public.is_admin());

CREATE POLICY "pathway_change_requests_insert_own"
  ON public.pathway_change_requests FOR INSERT
  WITH CHECK (auth.uid() = player_id);

CREATE POLICY "pathway_change_requests_update_admin"
  ON public.pathway_change_requests FOR UPDATE
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- Event waitlist
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.waitlist_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "waitlist_insert_public"
  ON public.waitlist_entries FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "waitlist_select_admin"
  ON public.waitlist_entries FOR SELECT
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage bucket for profile photos
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "avatars_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_upload_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_update_own"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
