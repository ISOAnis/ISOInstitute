/**
 * Create Stripe Checkout Session stub (Supabase Edge Function).
 *
 * Deploy:
 *   supabase functions deploy create-checkout-session
 *
 * Secrets:
 *   STRIPE_SECRET_KEY
 *   STRIPE_PRICE_LOCKER_ROOM   (price_...)
 *   STRIPE_PRICE_VARSITY       (price_...)
 *   SITE_URL                   (e.g. https://isoinstitute.com or http://localhost:3000)
 *
 * Client calls via supabase.functions.invoke('create-checkout-session', { body }).
 * Until STRIPE_SECRET_KEY is set, returns 501 with a clear hint.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type Purpose = 'locker-room' | 'varsity' | 'iso-pass' | 'store';

type Body = {
  purpose: Purpose;
  targetPlan?: 'walk-on' | 'locker-room' | 'varsity';
  coachId?: string;
  amountCents?: number;
  successPath?: string;
  cancelPath?: string;
  metadata?: Record<string, string>;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
  const siteUrl = Deno.env.get('SITE_URL') ?? 'http://localhost:3000';
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !anonKey) {
    return json({ error: 'Missing Supabase env on Edge Function' }, 500);
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return json({ error: 'Missing Authorization' }, 401);
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) {
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  if (!body.purpose) {
    return json({ error: 'purpose is required' }, 400);
  }

  const targetPlan =
    body.targetPlan ??
    (body.purpose === 'locker-room' || body.purpose === 'varsity' ? body.purpose : null);

  const { data: intentId, error: intentError } = await userClient.rpc('create_checkout_intent', {
    p_purpose: body.purpose,
    p_target_plan: targetPlan,
    p_coach_id: body.coachId ?? null,
    p_amount_cents: body.amountCents ?? null,
    p_metadata: {
      ...(body.metadata ?? {}),
      supabase_user_id: userData.user.id,
    },
  });

  if (intentError) {
    return json({ error: intentError.message }, 400);
  }

  if (!stripeKey) {
    return json({
      stub: true,
      error: 'Stripe Checkout not configured',
      hint: 'Set STRIPE_SECRET_KEY (and price IDs) on this Edge Function, then wire stripe.checkout.sessions.create.',
      checkoutIntentId: intentId,
      userId: userData.user.id,
      purpose: body.purpose,
      targetPlan,
    }, 501);
  }

  // When Stripe SDK is wired:
  // const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' })
  // const priceId = Deno.env.get(targetPlan === 'varsity' ? 'STRIPE_PRICE_VARSITY' : 'STRIPE_PRICE_LOCKER_ROOM')
  // const session = await stripe.checkout.sessions.create({
  //   mode: 'subscription',
  //   line_items: [{ price: priceId, quantity: 1 }],
  //   success_url: `${siteUrl}${body.successPath ?? '/?billing=success'}`,
  //   cancel_url: `${siteUrl}${body.cancelPath ?? '/?billing=cancel'}`,
  //   client_reference_id: userData.user.id,
  //   metadata: {
  //     supabase_user_id: userData.user.id,
  //     checkout_intent_id: String(intentId),
  //     target_plan: targetPlan ?? '',
  //     purpose: body.purpose,
  //   },
  //   subscription_data: { metadata: { supabase_user_id: userData.user.id, target_plan: targetPlan ?? '' } },
  // })
  // Then persist session.id onto stripe_checkout_sessions and return { url: session.url }.

  return json({
    stub: true,
    message: 'Stripe secret is set, but Checkout Session creation is still a stub. Wire stripe.checkout.sessions.create next.',
    checkoutIntentId: intentId,
    userId: userData.user.id,
    purpose: body.purpose,
    targetPlan,
    successUrl: `${siteUrl}${body.successPath ?? '/?billing=success'}`,
    cancelUrl: `${siteUrl}${body.cancelPath ?? '/?billing=cancel'}`,
    priceEnvHint:
      body.purpose === 'varsity' || targetPlan === 'varsity'
        ? 'STRIPE_PRICE_VARSITY'
        : body.purpose === 'locker-room' || targetPlan === 'locker-room'
          ? 'STRIPE_PRICE_LOCKER_ROOM'
          : 'custom line items / store',
  }, 501);
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
