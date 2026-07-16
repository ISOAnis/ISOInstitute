-- Phase 6: Coach-player messaging
-- Run in Supabase SQL Editor after 001-005

-- ---------------------------------------------------------------------------
-- Coaching relationship helper: a coach and player are connected once there
-- is a try-out booking or an assigned game between them.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_coaching_relationship(user_a UUID, user_b UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.discovery_bookings db
    WHERE db.status IN ('scheduled', 'completed')
      AND ((db.coach_id = user_a AND db.player_id = user_b)
        OR (db.coach_id = user_b AND db.player_id = user_a))
  ) OR EXISTS (
    SELECT 1 FROM public.games g
    WHERE (g.coach_id = user_a AND g.player_id = user_b)
       OR (g.coach_id = user_b AND g.player_id = user_a)
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- ---------------------------------------------------------------------------
-- Messages (direct coach <-> player)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS messages_sender_recipient_idx
  ON public.messages(sender_id, recipient_id, created_at);

CREATE INDEX IF NOT EXISTS messages_recipient_idx
  ON public.messages(recipient_id, read_at);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_select_own"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id OR public.is_admin());

-- Sending requires an actual coaching relationship (booking or game)
CREATE POLICY "messages_insert_related"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND public.has_coaching_relationship(sender_id, recipient_id)
  );

-- Recipient can mark messages read
CREATE POLICY "messages_update_recipient"
  ON public.messages FOR UPDATE
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- ---------------------------------------------------------------------------
-- Realtime: stream new messages to connected clients
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Player's coaches: mirror of get_coach_roster for the player side.
-- Coaches the player booked a try-out with or has games from.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_player_coaches()
RETURNS TABLE (
  coach_id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  avatar_url TEXT,
  pathway_id TEXT,
  connected_at TIMESTAMPTZ
) AS $$
  SELECT
    p.id,
    p.first_name,
    p.last_name,
    p.email,
    p.avatar_url,
    cp.pathway_id,
    src.connected_at
  FROM (
    SELECT u.coach_id, MIN(u.created_at) AS connected_at
    FROM (
      SELECT db.coach_id, db.created_at
      FROM public.discovery_bookings db
      WHERE db.player_id = auth.uid() AND db.status IN ('scheduled', 'completed')
      UNION ALL
      SELECT gm.coach_id, gm.created_at
      FROM public.games gm
      WHERE gm.player_id = auth.uid()
    ) u
    GROUP BY u.coach_id
  ) src
  JOIN public.profiles p ON p.id = src.coach_id
  LEFT JOIN public.coach_profiles cp ON cp.user_id = src.coach_id
  ORDER BY src.connected_at;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.get_player_coaches() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_player_coaches() TO authenticated;
