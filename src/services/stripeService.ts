import { supabase } from '../lib/supabase';
import type { MembershipPlan } from '../types/database';

export type CheckoutPurpose = 'locker-room' | 'varsity' | 'iso-pass' | 'store';

export interface CheckoutIntentResult {
  checkoutIntentId: string;
}

export interface StartCheckoutInput {
  purpose: CheckoutPurpose;
  targetPlan?: MembershipPlan;
  coachId?: string;
  amountCents?: number;
  successPath?: string;
  cancelPath?: string;
  metadata?: Record<string, string>;
}

export interface StartCheckoutResult {
  /** Present when Stripe Checkout is fully wired */
  url?: string;
  sessionId?: string;
  checkoutIntentId?: string;
  stub: boolean;
  message?: string;
}

/** Record a local checkout intent row (works even before Edge Functions are deployed). */
export async function createCheckoutIntent(input: StartCheckoutInput): Promise<CheckoutIntentResult> {
  const { data, error } = await supabase.rpc('create_checkout_intent', {
    p_purpose: input.purpose,
    p_target_plan: input.targetPlan ?? null,
    p_coach_id: input.coachId ?? null,
    p_amount_cents: input.amountCents ?? null,
    p_metadata: input.metadata ?? {},
  });

  if (error) throw error;
  if (!data) throw new Error('No checkout intent id returned');
  return { checkoutIntentId: data };
}

/**
 * Ask the Edge Function to open a Stripe Checkout Session.
 * Returns stub: true until STRIPE_SECRET_KEY + session creation are live.
 */
export async function startCheckout(input: StartCheckoutInput): Promise<StartCheckoutResult> {
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: {
      purpose: input.purpose,
      targetPlan: input.targetPlan,
      coachId: input.coachId,
      amountCents: input.amountCents,
      successPath: input.successPath,
      cancelPath: input.cancelPath,
      metadata: input.metadata,
    },
  });

  if (error) {
    // Function missing / 501 — surface a clear stub result instead of crashing UI
    return {
      stub: true,
      message:
        error.message ||
        'Checkout Edge Function unavailable. Run migration 009 and deploy create-checkout-session.',
    };
  }

  const payload = (data ?? {}) as StartCheckoutResult & { error?: string; hint?: string };
  if (payload.url) {
    return {
      stub: false,
      url: payload.url,
      sessionId: payload.sessionId,
      checkoutIntentId: payload.checkoutIntentId,
    };
  }

  return {
    stub: true,
    checkoutIntentId: payload.checkoutIntentId,
    message: payload.message || payload.error || payload.hint || 'Stripe Checkout is not live yet.',
  };
}

/** Convenience: start membership upgrade checkout (Locker Room / Varsity). */
export async function startPlanCheckout(plan: 'locker-room' | 'varsity'): Promise<StartCheckoutResult> {
  return startCheckout({
    purpose: plan,
    targetPlan: plan,
    successPath: '/?billing=success',
    cancelPath: '/?billing=cancel',
  });
}

export async function fetchOwnCheckoutSessions(limit = 10) {
  const { data, error } = await supabase
    .from('stripe_checkout_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function fetchOwnStoreOrders(limit = 10) {
  const { data, error } = await supabase
    .from('store_orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}
