-- Phase 8: AI matching / varsity pairing requests
-- Run in Supabase SQL Editor after 001-007

-- ---------------------------------------------------------------------------
-- Match requests: player asks a specific coach for ISO Pass / pairing
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.match_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'varsity'
    CHECK (plan IN ('walk-on', 'locker-room', 'varsity')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'declined', 'expired', 'canceled')),
  match_score INTEGER NOT NULL DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 100),
  match_reasons TEXT[] NOT NULL DEFAULT '{}',
  questionnaire JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS match_requests_coach_pending_idx
  ON public.match_requests(coach_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS match_requests_player_idx
  ON public.match_requests(player_id, created_at DESC);

-- One open request per player→coach pair
CREATE UNIQUE INDEX IF NOT EXISTS match_requests_one_pending_idx
  ON public.match_requests(player_id, coach_id)
  WHERE status = 'pending';

ALTER TABLE public.match_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "match_requests_select_participants"
  ON public.match_requests FOR SELECT
  USING (
    auth.uid() = player_id
    OR auth.uid() = coach_id
    OR public.is_admin()
  );

CREATE POLICY "match_requests_insert_player"
  ON public.match_requests FOR INSERT
  WITH CHECK (auth.uid() = player_id);

CREATE POLICY "match_requests_update_coach_or_player"
  ON public.match_requests FOR UPDATE
  USING (
    auth.uid() = coach_id
    OR auth.uid() = player_id
    OR public.is_admin()
  );

-- ---------------------------------------------------------------------------
-- Coach responds: accept creates a starter game so roster/chat unlock;
-- decline only updates status.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.respond_to_match(
  request_id UUID,
  decision TEXT
)
RETURNS VOID AS $$
DECLARE
  req public.match_requests%ROWTYPE;
BEGIN
  IF decision NOT IN ('accepted', 'declined') THEN
    RAISE EXCEPTION 'decision must be accepted or declined';
  END IF;

  SELECT * INTO req
  FROM public.match_requests
  WHERE id = request_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Match request not found';
  END IF;

  IF req.coach_id <> auth.uid() AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only the assigned coach can respond';
  END IF;

  IF req.status <> 'pending' THEN
    RAISE EXCEPTION 'Request is no longer pending';
  END IF;

  UPDATE public.match_requests
  SET status = decision,
      responded_at = NOW()
  WHERE id = request_id;

  IF decision = 'accepted' THEN
    -- Seed a first game so the player appears on the coach roster / can message.
    IF NOT EXISTS (
      SELECT 1 FROM public.games g
      WHERE g.coach_id = req.coach_id AND g.player_id = req.player_id
    ) THEN
      INSERT INTO public.games (coach_id, player_id, title, description)
      VALUES (
        req.coach_id,
        req.player_id,
        'Kickoff — First ISO Goals',
        'Welcome game created when your coach accepted the ISO Pass match. Add buckets together.'
      );
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.respond_to_match(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.respond_to_match(UUID, TEXT) TO authenticated;

-- ---------------------------------------------------------------------------
-- Coach inbox: pending requests with player names (bypasses profiles RLS)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_coach_match_requests()
RETURNS TABLE (
  id UUID,
  player_id UUID,
  coach_id UUID,
  plan TEXT,
  status TEXT,
  match_score INTEGER,
  match_reasons TEXT[],
  questionnaire JSONB,
  created_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  player_first_name TEXT,
  player_last_name TEXT,
  player_email TEXT,
  player_avatar_url TEXT,
  pathway_id TEXT
) AS $$
  SELECT
    mr.id,
    mr.player_id,
    mr.coach_id,
    mr.plan,
    mr.status,
    mr.match_score,
    mr.match_reasons,
    mr.questionnaire,
    mr.created_at,
    mr.responded_at,
    p.first_name,
    p.last_name,
    p.email,
    p.avatar_url,
    COALESCE(pp.locked_pathway_id, pp.exploring_pathway_id)
  FROM public.match_requests mr
  JOIN public.profiles p ON p.id = mr.player_id
  LEFT JOIN public.player_pathways pp ON pp.user_id = mr.player_id
  WHERE mr.coach_id = auth.uid()
    AND mr.status = 'pending'
  ORDER BY mr.created_at DESC;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.get_coach_match_requests() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_coach_match_requests() TO authenticated;
