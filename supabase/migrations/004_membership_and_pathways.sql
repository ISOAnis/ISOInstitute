-- Phase 4: Membership plan + pathway state in DB
-- Run in Supabase SQL Editor after 001, 002, 003

-- ---------------------------------------------------------------------------
-- Self-service plan changes (TEMPORARY until Stripe).
-- RLS only lets admins UPDATE subscriptions; this SECURITY DEFINER function
-- lets a signed-in user change their own plan so the demo checkout flows work.
-- When Stripe lands, replace this with webhook-driven updates and drop it.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_own_plan(new_plan TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF new_plan NOT IN ('walk-on', 'locker-room', 'varsity') THEN
    RAISE EXCEPTION 'Invalid plan: %', new_plan;
  END IF;

  UPDATE public.subscriptions
  SET plan = new_plan
  WHERE user_id = auth.uid();

  IF NOT FOUND THEN
    INSERT INTO public.subscriptions (user_id, plan)
    VALUES (auth.uid(), new_plan);
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_own_plan(TEXT) TO authenticated;

-- ---------------------------------------------------------------------------
-- Pathway change auto-approval (7 days).
-- Callers invoke this on load; if their pending request is past
-- auto_approve_at, it is approved and their locked pathway is switched.
-- Returns the new locked pathway id, or NULL if nothing was resolved.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.resolve_due_pathway_change()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  req RECORD;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO req
  FROM public.pathway_change_requests
  WHERE player_id = auth.uid()
    AND status = 'pending'
    AND auto_approve_at <= NOW()
  ORDER BY submitted_at DESC
  LIMIT 1;

  IF req IS NULL THEN
    RETURN NULL;
  END IF;

  UPDATE public.pathway_change_requests
  SET status = 'approved',
      resolved_at = NOW()
  WHERE id = req.id;

  UPDATE public.player_pathways
  SET locked_pathway_id = req.requested_pathway,
      updated_at = NOW()
  WHERE user_id = auth.uid();

  RETURN req.requested_pathway;
END;
$$;

GRANT EXECUTE ON FUNCTION public.resolve_due_pathway_change() TO authenticated;

-- ---------------------------------------------------------------------------
-- Admin approve/deny helper for pathway change requests.
-- Applies the pathway switch atomically with the status update.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.review_pathway_change(request_id UUID, decision TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  req RECORD;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can review pathway change requests';
  END IF;

  IF decision NOT IN ('approved', 'denied') THEN
    RAISE EXCEPTION 'Invalid decision: %', decision;
  END IF;

  SELECT * INTO req
  FROM public.pathway_change_requests
  WHERE id = request_id AND status = 'pending';

  IF req IS NULL THEN
    RAISE EXCEPTION 'No pending request with id %', request_id;
  END IF;

  UPDATE public.pathway_change_requests
  SET status = decision,
      reviewed_by = auth.uid(),
      resolved_at = NOW()
  WHERE id = request_id;

  IF decision = 'approved' THEN
    UPDATE public.player_pathways
    SET locked_pathway_id = req.requested_pathway,
        updated_at = NOW()
    WHERE user_id = req.player_id;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.review_pathway_change(UUID, TEXT) TO authenticated;
