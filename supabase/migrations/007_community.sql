-- Phase 7: ISO Community forum + Locker Room pathway chat
-- Run in Supabase SQL Editor after 001-006

-- ---------------------------------------------------------------------------
-- Community forum posts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL DEFAULT 'player' CHECK (author_role IN ('player', 'coach')),
  pathway_id TEXT NOT NULL,
  post_type TEXT NOT NULL DEFAULT 'win'
    CHECK (post_type IN ('goal', 'win', 'encourage', 'milestone')),
  content TEXT NOT NULL,
  goal_title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS community_posts_created_idx
  ON public.community_posts(created_at DESC);

-- ---------------------------------------------------------------------------
-- Post encouragements (one per user per post)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.post_encouragements (
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS post_encouragements_post_idx
  ON public.post_encouragements(post_id);

-- ---------------------------------------------------------------------------
-- Locker Room pathway channel messages
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.locker_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL DEFAULT 'player' CHECK (sender_role IN ('player', 'coach')),
  sender_pathway_id TEXT NOT NULL,
  channel_pathway_id TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS locker_messages_channel_idx
  ON public.locker_messages(channel_pathway_id, created_at);

-- ---------------------------------------------------------------------------
-- RLS: any signed-in member can read; you can only write as yourself.
-- Plan gating (Locker Room / Varsity only) is enforced in the app.
-- ---------------------------------------------------------------------------
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_encouragements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locker_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "community_posts_select_authenticated"
  ON public.community_posts FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "community_posts_insert_own"
  ON public.community_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "community_posts_delete_own_or_admin"
  ON public.community_posts FOR DELETE
  USING (auth.uid() = author_id OR public.is_admin());

CREATE POLICY "post_encouragements_select_authenticated"
  ON public.post_encouragements FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "post_encouragements_insert_own"
  ON public.post_encouragements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "post_encouragements_delete_own"
  ON public.post_encouragements FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "locker_messages_select_authenticated"
  ON public.locker_messages FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "locker_messages_insert_own"
  ON public.locker_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "locker_messages_delete_own_or_admin"
  ON public.locker_messages FOR DELETE
  USING (auth.uid() = sender_id OR public.is_admin());

-- ---------------------------------------------------------------------------
-- Realtime for the channel chat
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.locker_messages;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
