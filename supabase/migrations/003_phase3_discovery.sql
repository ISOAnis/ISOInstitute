-- Phase 3: Coach discovery, bookings, usage counters + demo Builder coach
-- Run in Supabase SQL Editor after 001 and 002

-- ---------------------------------------------------------------------------
-- Coach listing fields
-- ---------------------------------------------------------------------------
ALTER TABLE public.coach_profiles
  ADD COLUMN IF NOT EXISTS varsity_price_cents INTEGER NOT NULL DEFAULT 4000,
  ADD COLUMN IF NOT EXISTS listing_tier TEXT NOT NULL DEFAULT 'specialist'
    CHECK (listing_tier IN ('standard', 'specialist', 'premium')),
  ADD COLUMN IF NOT EXISTS success_rate TEXT,
  ADD COLUMN IF NOT EXISTS additional_perks TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS accepts_shadowing BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS shadowing_cadence_months INTEGER NOT NULL DEFAULT 1;

-- ---------------------------------------------------------------------------
-- Discovery bookings (try-outs / consultations)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.discovery_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pathway_id TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('walk-on', 'locker-room', 'varsity')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'completed', 'canceled', 'no_show')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS discovery_bookings_player_month_idx
  ON public.discovery_bookings(player_id, scheduled_at);

CREATE INDEX IF NOT EXISTS discovery_bookings_coach_idx
  ON public.discovery_bookings(coach_id);

-- ---------------------------------------------------------------------------
-- Explorer usage counters (monthly try-out limits)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.usage_counters (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  pathway_chats JSONB NOT NULL DEFAULT '{}',
  coach_chat_ids UUID[] NOT NULL DEFAULT '{}',
  shadow_used BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, month)
);

-- ---------------------------------------------------------------------------
-- Discoverable coaches view
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.discoverable_coaches AS
SELECT
  cp.user_id AS id,
  cp.user_id,
  p.first_name,
  p.last_name,
  p.gender,
  cp.pathway_id,
  cp.bio,
  cp.current_role,
  cp.years_of_experience,
  cp.expertise_areas,
  cp.photo_url,
  cp.varsity_price_cents,
  cp.listing_tier,
  cp.success_rate,
  cp.additional_perks,
  cp.accepts_shadowing,
  cp.shadowing_cadence_months,
  cp.card_display,
  ca.overall_rating,
  ca.tier AS assessment_tier
FROM public.coach_profiles cp
JOIN public.profiles p ON p.id = cp.user_id
JOIN public.coach_assessments ca ON ca.user_id = cp.user_id
WHERE cp.is_discoverable = TRUE
  AND ca.application_status = 'approved'
  AND p.coach_onboarding_complete = TRUE;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.discovery_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "discovery_bookings_select_own"
  ON public.discovery_bookings FOR SELECT
  USING (
    auth.uid() = player_id
    OR auth.uid() = coach_id
    OR public.is_admin()
  );

CREATE POLICY "discovery_bookings_insert_own"
  ON public.discovery_bookings FOR INSERT
  WITH CHECK (auth.uid() = player_id);

CREATE POLICY "discovery_bookings_update_own_or_admin"
  ON public.discovery_bookings FOR UPDATE
  USING (auth.uid() = player_id OR auth.uid() = coach_id OR public.is_admin());

CREATE POLICY "usage_counters_own"
  ON public.usage_counters FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT ON public.discoverable_coaches TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- Demo coach: Anis Benyoucef — The Builder Pathway (engineering)
-- Login: anis.benyoucef@iso.demo / IsoDemoCoach1!
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  coach_id UUID := 'a0000001-0000-4000-8000-000000000001';
  inst_id UUID := '00000000-0000-0000-0000-000000000000';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = coach_id) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      inst_id,
      coach_id,
      'authenticated',
      'authenticated',
      'anis.benyoucef@iso.demo',
      crypt('IsoDemoCoach1!', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"first_name":"Anis","last_name":"Benyoucef"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );

    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      coach_id,
      coach_id,
      jsonb_build_object('sub', coach_id::text, 'email', 'anis.benyoucef@iso.demo'),
      'email',
      coach_id::text,
      NOW(),
      NOW(),
      NOW()
    );
  END IF;

  INSERT INTO public.profiles (
    id, email, first_name, last_name, gender, roles, active_role,
    player_onboarding_complete, coach_onboarding_complete,
    coach_application_status, is_admin
  ) VALUES (
    coach_id,
    'anis.benyoucef@iso.demo',
    'Anis',
    'Benyoucef',
    'male',
    ARRAY['coach']::TEXT[],
    'coach',
    FALSE,
    TRUE,
    'approved',
    FALSE
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    roles = EXCLUDED.roles,
    active_role = EXCLUDED.active_role,
    coach_onboarding_complete = TRUE,
    coach_application_status = 'approved';

  INSERT INTO public.subscriptions (user_id, plan)
  VALUES (coach_id, 'walk-on')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.coach_assessments (
    user_id,
    overall_rating,
    tier,
    tier_label,
    strengths,
    opportunities,
    reasoning,
    application_status,
    reviewed_at
  ) VALUES (
    coach_id,
    94,
    'gold',
    'Gold',
    ARRAY['Big Tech Recruiting', 'Hardware Engineering', 'Community Building'],
    ARRAY['Expand group coaching offerings'],
    'Strong internship pedigree across Apple and Zoox with clear player outcomes in tech recruiting.',
    'approved',
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    overall_rating = EXCLUDED.overall_rating,
    tier = EXCLUDED.tier,
    application_status = 'approved',
    reviewed_at = NOW();

  INSERT INTO public.coach_profiles (
    user_id,
    pathway_id,
    bio,
    years_of_experience,
    current_role,
    expertise_areas,
    varsity_price_cents,
    listing_tier,
    success_rate,
    additional_perks,
    accepts_shadowing,
    shadowing_cadence_months,
    is_discoverable,
    completion_pct,
    card_display
  ) VALUES (
    coach_id,
    'engineering',
    'I have 2+ years of internship experience across leading companies such as Apple and Zoox, giving me diverse experience in product design, hardware testing and validation, manufacturing, and quality. Passionate about community building and leadership.',
    '5',
    '5x Intern - Apple, Zoox, Stanford Research',
    ARRAY['Big Tech Recruiting', 'Hardware Engineering', 'Product Design', 'Interview Prep'],
    4000,
    'specialist',
    '20+ players placed at top tech companies',
    ARRAY['Resume review within 48hrs', 'Referral opportunities at Apple/Zoox'],
    TRUE,
    1,
    TRUE,
    100,
    jsonb_build_object(
      'name', 'Anis Benyoucef',
      'pathwayName', 'The Builder Pathway',
      'role', '5x Intern - Apple, Zoox, Stanford Research',
      'years', 5
    )
  )
  ON CONFLICT (user_id) DO UPDATE SET
    pathway_id = EXCLUDED.pathway_id,
    bio = EXCLUDED.bio,
    current_role = EXCLUDED.current_role,
    expertise_areas = EXCLUDED.expertise_areas,
    varsity_price_cents = EXCLUDED.varsity_price_cents,
    listing_tier = EXCLUDED.listing_tier,
    success_rate = EXCLUDED.success_rate,
    additional_perks = EXCLUDED.additional_perks,
    is_discoverable = TRUE;
END $$;
