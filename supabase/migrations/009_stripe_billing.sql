-- Phase 9: Stripe billing schema + webhook helpers (stubs)
-- Run in Supabase SQL Editor after 001-008
--
-- Does NOT charge money yet. Tables + RPCs are ready for Edge Functions
-- that verify Stripe signatures and update subscriptions / orders.
-- Keep set_own_plan for demo until live Checkout + webhooks replace it.

-- ---------------------------------------------------------------------------
-- Extend subscriptions for Stripe lifecycle
-- ---------------------------------------------------------------------------
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
  ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS billing_provider TEXT NOT NULL DEFAULT 'manual';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'subscriptions_billing_provider_check'
  ) THEN
    ALTER TABLE public.subscriptions
      ADD CONSTRAINT subscriptions_billing_provider_check
      CHECK (billing_provider IN ('manual', 'stripe'));
  END IF;
END $$;

COMMENT ON COLUMN public.subscriptions.billing_provider IS
  'manual = set_own_plan / admin; stripe = webhook-driven. Prefer stripe when both exist.';

-- ---------------------------------------------------------------------------
-- Idempotent webhook event log (Stripe event.id is the PK)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
  id TEXT PRIMARY KEY, -- evt_...
  type TEXT NOT NULL,
  livemode BOOLEAN NOT NULL DEFAULT FALSE,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  processed_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS stripe_webhook_events_type_idx
  ON public.stripe_webhook_events(type, created_at DESC);

ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- No client access — Edge Functions use the service role
DROP POLICY IF EXISTS "stripe_webhook_events_admin_select" ON public.stripe_webhook_events;
CREATE POLICY "stripe_webhook_events_admin_select"
  ON public.stripe_webhook_events FOR SELECT
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- Checkout sessions we initiate (membership, ISO Pass, store)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stripe_checkout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  purpose TEXT NOT NULL
    CHECK (purpose IN ('locker-room', 'varsity', 'iso-pass', 'store')),
  target_plan TEXT
    CHECK (target_plan IS NULL OR target_plan IN ('walk-on', 'locker-room', 'varsity')),
  coach_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount_cents INTEGER,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'created'
    CHECK (status IN ('created', 'open', 'completed', 'expired', 'canceled')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS stripe_checkout_sessions_user_idx
  ON public.stripe_checkout_sessions(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS stripe_checkout_sessions_status_idx
  ON public.stripe_checkout_sessions(status)
  WHERE status IN ('created', 'open');

ALTER TABLE public.stripe_checkout_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "stripe_checkout_sessions_select_own" ON public.stripe_checkout_sessions;
CREATE POLICY "stripe_checkout_sessions_select_own"
  ON public.stripe_checkout_sessions FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- Inserts/updates go through service role (Edge Function) or SECURITY DEFINER RPCs
DROP POLICY IF EXISTS "stripe_checkout_sessions_insert_own" ON public.stripe_checkout_sessions;
CREATE POLICY "stripe_checkout_sessions_insert_own"
  ON public.stripe_checkout_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Store orders (merch) — schema stub; catalog still client-side for now
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.store_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'fulfilled', 'canceled', 'refunded')),
  total_cents INTEGER NOT NULL DEFAULT 0 CHECK (total_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'usd',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  shipping JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS store_orders_user_idx
  ON public.store_orders(user_id, created_at DESC);

DROP TRIGGER IF EXISTS store_orders_updated_at ON public.store_orders;
CREATE TRIGGER store_orders_updated_at
  BEFORE UPDATE ON public.store_orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.store_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "store_orders_select_own" ON public.store_orders;
CREATE POLICY "store_orders_select_own"
  ON public.store_orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- ---------------------------------------------------------------------------
-- Record a checkout intent from the client (before Edge Function creates Stripe session)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_checkout_intent(
  p_purpose TEXT,
  p_target_plan TEXT DEFAULT NULL,
  p_coach_id UUID DEFAULT NULL,
  p_amount_cents INTEGER DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_purpose NOT IN ('locker-room', 'varsity', 'iso-pass', 'store') THEN
    RAISE EXCEPTION 'Invalid purpose: %', p_purpose;
  END IF;

  IF p_target_plan IS NOT NULL AND p_target_plan NOT IN ('walk-on', 'locker-room', 'varsity') THEN
    RAISE EXCEPTION 'Invalid target_plan: %', p_target_plan;
  END IF;

  INSERT INTO public.stripe_checkout_sessions (
    user_id, purpose, target_plan, coach_id, amount_cents, metadata, status
  )
  VALUES (
    auth.uid(),
    p_purpose,
    p_target_plan,
    p_coach_id,
    p_amount_cents,
    COALESCE(p_metadata, '{}'::jsonb),
    'created'
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_checkout_intent(TEXT, TEXT, UUID, INTEGER, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_checkout_intent(TEXT, TEXT, UUID, INTEGER, JSONB) TO authenticated;

-- ---------------------------------------------------------------------------
-- Apply subscription state from Stripe webhooks (service role only)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.apply_stripe_subscription(
  p_user_id UUID,
  p_plan TEXT,
  p_status TEXT,
  p_stripe_customer_id TEXT DEFAULT NULL,
  p_stripe_subscription_id TEXT DEFAULT NULL,
  p_stripe_price_id TEXT DEFAULT NULL,
  p_current_period_end TIMESTAMPTZ DEFAULT NULL,
  p_cancel_at_period_end BOOLEAN DEFAULT FALSE
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Called from Edge Functions with the service role (auth.uid() is null).
  -- Block accidental calls from the browser anon/authenticated clients.
  IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'apply_stripe_subscription is service-role only';
  END IF;

  IF p_plan NOT IN ('walk-on', 'locker-room', 'varsity') THEN
    RAISE EXCEPTION 'Invalid plan: %', p_plan;
  END IF;

  IF p_status NOT IN ('active', 'canceled', 'past_due', 'trialing') THEN
    RAISE EXCEPTION 'Invalid status: %', p_status;
  END IF;

  INSERT INTO public.subscriptions (
    user_id, plan, status,
    stripe_customer_id, stripe_subscription_id, stripe_price_id,
    current_period_end, cancel_at_period_end, billing_provider
  )
  VALUES (
    p_user_id, p_plan, p_status,
    p_stripe_customer_id, p_stripe_subscription_id, p_stripe_price_id,
    p_current_period_end, COALESCE(p_cancel_at_period_end, FALSE), 'stripe'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    plan = EXCLUDED.plan,
    status = EXCLUDED.status,
    stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, public.subscriptions.stripe_customer_id),
    stripe_subscription_id = COALESCE(EXCLUDED.stripe_subscription_id, public.subscriptions.stripe_subscription_id),
    stripe_price_id = COALESCE(EXCLUDED.stripe_price_id, public.subscriptions.stripe_price_id),
    current_period_end = COALESCE(EXCLUDED.current_period_end, public.subscriptions.current_period_end),
    cancel_at_period_end = EXCLUDED.cancel_at_period_end,
    billing_provider = 'stripe',
    updated_at = NOW();
END;
$$;

REVOKE EXECUTE ON FUNCTION public.apply_stripe_subscription(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TIMESTAMPTZ, BOOLEAN) FROM PUBLIC;
-- service_role bypasses RLS and can execute; grant explicitly for clarity
GRANT EXECUTE ON FUNCTION public.apply_stripe_subscription(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TIMESTAMPTZ, BOOLEAN) TO service_role;

-- ---------------------------------------------------------------------------
-- Mark webhook event processed (idempotency helper)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.record_stripe_webhook_event(
  p_event_id TEXT,
  p_type TEXT,
  p_livemode BOOLEAN,
  p_payload JSONB,
  p_error TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  already BOOLEAN;
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'record_stripe_webhook_event is service-role only';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.stripe_webhook_events WHERE id = p_event_id AND processed_at IS NOT NULL AND error IS NULL
  ) INTO already;

  IF already THEN
    RETURN FALSE; -- already successfully processed
  END IF;

  INSERT INTO public.stripe_webhook_events (id, type, livemode, payload, processed_at, error)
  VALUES (
    p_event_id,
    p_type,
    COALESCE(p_livemode, FALSE),
    COALESCE(p_payload, '{}'::jsonb),
    CASE WHEN p_error IS NULL THEN NOW() ELSE NULL END,
    p_error
  )
  ON CONFLICT (id) DO UPDATE SET
    type = EXCLUDED.type,
    payload = EXCLUDED.payload,
    processed_at = CASE WHEN EXCLUDED.error IS NULL THEN NOW() ELSE public.stripe_webhook_events.processed_at END,
    error = EXCLUDED.error;

  RETURN TRUE;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.record_stripe_webhook_event(TEXT, TEXT, BOOLEAN, JSONB, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_stripe_webhook_event(TEXT, TEXT, BOOLEAN, JSONB, TEXT) TO service_role;

-- ---------------------------------------------------------------------------
-- Complete a checkout session row after Stripe confirms payment
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.complete_stripe_checkout_session(
  p_stripe_session_id TEXT,
  p_checkout_intent_id UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'complete_stripe_checkout_session is service-role only';
  END IF;

  UPDATE public.stripe_checkout_sessions
  SET
    status = 'completed',
    completed_at = NOW(),
    stripe_session_id = COALESCE(stripe_session_id, p_stripe_session_id)
  WHERE stripe_session_id = p_stripe_session_id
     OR (p_checkout_intent_id IS NOT NULL AND id = p_checkout_intent_id);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.complete_stripe_checkout_session(TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.complete_stripe_checkout_session(TEXT, UUID) TO service_role;
