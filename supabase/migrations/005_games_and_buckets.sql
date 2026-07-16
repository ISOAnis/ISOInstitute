-- Phase 5: Games & buckets (coach-assigned goals with approval flow)
-- Run in Supabase SQL Editor after 001-004

-- ---------------------------------------------------------------------------
-- Games: a goal a coach assigns to one of their players
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS games_player_idx ON public.games(player_id);
CREATE INDEX IF NOT EXISTS games_coach_idx ON public.games(coach_id);

DROP TRIGGER IF EXISTS games_updated_at ON public.games;
CREATE TRIGGER games_updated_at
  BEFORE UPDATE ON public.games
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Buckets: individual tasks inside a game
-- status flow: open -> pending_approval (player marks done) -> approved (coach)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.buckets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'pending_approval', 'approved')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS buckets_game_idx ON public.buckets(game_id);

-- ---------------------------------------------------------------------------
-- Bucket comments (coach feedback / encouragement)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bucket_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id UUID NOT NULL REFERENCES public.buckets(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS bucket_comments_bucket_idx ON public.bucket_comments(bucket_id);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bucket_comments ENABLE ROW LEVEL SECURITY;

-- Games: player + coach can read; only the coach manages them
CREATE POLICY "games_select_participants"
  ON public.games FOR SELECT
  USING (auth.uid() = player_id OR auth.uid() = coach_id OR public.is_admin());

CREATE POLICY "games_insert_coach"
  ON public.games FOR INSERT
  WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "games_update_coach_or_admin"
  ON public.games FOR UPDATE
  USING (auth.uid() = coach_id OR public.is_admin());

CREATE POLICY "games_delete_coach_or_admin"
  ON public.games FOR DELETE
  USING (auth.uid() = coach_id OR public.is_admin());

-- Buckets: visible to game participants; coach has full control;
-- player may only move a non-approved bucket between open/pending_approval
CREATE POLICY "buckets_select_participants"
  ON public.buckets FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.games g
    WHERE g.id = game_id
      AND (g.player_id = auth.uid() OR g.coach_id = auth.uid() OR public.is_admin())
  ));

CREATE POLICY "buckets_insert_coach"
  ON public.buckets FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.games g
    WHERE g.id = game_id AND (g.coach_id = auth.uid() OR public.is_admin())
  ));

CREATE POLICY "buckets_update_coach"
  ON public.buckets FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.games g
    WHERE g.id = game_id AND (g.coach_id = auth.uid() OR public.is_admin())
  ));

CREATE POLICY "buckets_update_player"
  ON public.buckets FOR UPDATE
  USING (
    status <> 'approved'
    AND EXISTS (
      SELECT 1 FROM public.games g
      WHERE g.id = game_id AND g.player_id = auth.uid()
    )
  )
  WITH CHECK (
    status IN ('open', 'pending_approval')
    AND EXISTS (
      SELECT 1 FROM public.games g
      WHERE g.id = game_id AND g.player_id = auth.uid()
    )
  );

CREATE POLICY "buckets_delete_coach"
  ON public.buckets FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.games g
    WHERE g.id = game_id AND (g.coach_id = auth.uid() OR public.is_admin())
  ));

-- Comments: participants read; participants write as themselves
CREATE POLICY "bucket_comments_select_participants"
  ON public.bucket_comments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.buckets b
    JOIN public.games g ON g.id = b.game_id
    WHERE b.id = bucket_id
      AND (g.player_id = auth.uid() OR g.coach_id = auth.uid() OR public.is_admin())
  ));

CREATE POLICY "bucket_comments_insert_participants"
  ON public.bucket_comments FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (
      SELECT 1 FROM public.buckets b
      JOIN public.games g ON g.id = b.game_id
      WHERE b.id = bucket_id
        AND (g.player_id = auth.uid() OR g.coach_id = auth.uid())
    )
  );

CREATE POLICY "bucket_comments_delete_own_or_admin"
  ON public.bucket_comments FOR DELETE
  USING (auth.uid() = author_id OR public.is_admin());

-- ---------------------------------------------------------------------------
-- Coach roster: players who booked a try-out with this coach or already have
-- games assigned by them. SECURITY DEFINER so the coach can see player names
-- without opening up the profiles table.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_coach_roster()
RETURNS TABLE (
  player_id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  avatar_url TEXT,
  pathway_id TEXT,
  joined_at TIMESTAMPTZ
) AS $$
  SELECT
    p.id,
    p.first_name,
    p.last_name,
    p.email,
    p.avatar_url,
    COALESCE(pp.locked_pathway_id, src.pathway_id),
    src.joined_at
  FROM (
    SELECT u.player_id, MIN(u.created_at) AS joined_at, MAX(u.pathway_id) AS pathway_id
    FROM (
      SELECT db.player_id, db.created_at, db.pathway_id
      FROM public.discovery_bookings db
      WHERE db.coach_id = auth.uid() AND db.status IN ('scheduled', 'completed')
      UNION ALL
      SELECT gm.player_id, gm.created_at, NULL::TEXT
      FROM public.games gm
      WHERE gm.coach_id = auth.uid()
    ) u
    GROUP BY u.player_id
  ) src
  JOIN public.profiles p ON p.id = src.player_id
  LEFT JOIN public.player_pathways pp ON pp.user_id = src.player_id
  ORDER BY src.joined_at;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.get_coach_roster() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_coach_roster() TO authenticated;
