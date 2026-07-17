/**
 * Stripe webhook stub (Supabase Edge Function).
 *
 * Deploy:
 *   supabase functions deploy stripe-webhook --no-verify-jwt
 *
 * Secrets (Dashboard → Edge Functions → Secrets, or CLI):
 *   STRIPE_SECRET_KEY
 *   STRIPE_WEBHOOK_SECRET
 *   SUPABASE_SERVICE_ROLE_KEY  (auto-injected on hosted Supabase)
 *   SUPABASE_URL               (auto-injected on hosted Supabase)
 *
 * Stripe Dashboard → Webhooks → endpoint:
 *   https://<project-ref>.supabase.co/functions/v1/stripe-webhook
 * Events to enable (minimum):
 *   checkout.session.completed
 *   customer.subscription.updated
 *   customer.subscription.deleted
 *   invoice.paid
 *   invoice.payment_failed
 *
 * Until STRIPE_WEBHOOK_SECRET is set, this returns 501 and does not mutate data.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

type StripeEventLike = {
  id: string;
  type: string;
  livemode?: boolean;
  data?: { object?: Record<string, unknown> };
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!webhookSecret || !stripeKey || !supabaseUrl || !serviceKey) {
    return json({
      error: 'Stripe webhook not configured',
      hint: 'Set STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, and ensure SUPABASE_* service env vars exist.',
    }, 501);
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return json({ error: 'Missing stripe-signature header' }, 400);
  }

  const rawBody = await req.text();

  // Signature verification: plug in stripe SDK when going live.
  // import Stripe from 'https://esm.sh/stripe@14?target=deno'
  // const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' })
  // const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  let event: StripeEventLike;
  try {
    event = JSON.parse(rawBody) as StripeEventLike;
    if (!event?.id || !event?.type) {
      throw new Error('Invalid Stripe event payload');
    }
    // STUB: do not trust unsigned payloads in production — verify with constructEvent above.
    console.warn('[stripe-webhook] STUB MODE: signature not cryptographically verified yet');
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Invalid payload' }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const { data: shouldProcess, error: recordError } = await supabase.rpc('record_stripe_webhook_event', {
    p_event_id: event.id,
    p_type: event.type,
    p_livemode: Boolean(event.livemode),
    p_payload: event,
    p_error: null,
  });

  if (recordError) {
    console.error('record_stripe_webhook_event failed', recordError);
    return json({ error: recordError.message }, 500);
  }

  if (shouldProcess === false) {
    return json({ received: true, duplicate: true });
  }

  try {
    await handleEvent(supabase, event);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Handler failed';
    await supabase.rpc('record_stripe_webhook_event', {
      p_event_id: event.id,
      p_type: event.type,
      p_livemode: Boolean(event.livemode),
      p_payload: event,
      p_error: message,
    });
    console.error('Webhook handler error', message);
    return json({ error: message }, 500);
  }

  return json({ received: true });
});

async function handleEvent(
  supabase: ReturnType<typeof createClient>,
  event: StripeEventLike,
) {
  const obj = (event.data?.object ?? {}) as Record<string, unknown>;

  switch (event.type) {
    case 'checkout.session.completed': {
      const sessionId = String(obj.id ?? '');
      const metadata = (obj.metadata ?? {}) as Record<string, string>;
      const userId = metadata.supabase_user_id;
      const plan = metadata.target_plan;
      const intentId = metadata.checkout_intent_id;

      if (sessionId) {
        await supabase.rpc('complete_stripe_checkout_session', {
          p_stripe_session_id: sessionId,
          p_checkout_intent_id: intentId || null,
        });
      }

      if (userId && plan && ['locker-room', 'varsity', 'walk-on'].includes(plan)) {
        const customerId = typeof obj.customer === 'string' ? obj.customer : null;
        const subscriptionId = typeof obj.subscription === 'string' ? obj.subscription : null;
        await supabase.rpc('apply_stripe_subscription', {
          p_user_id: userId,
          p_plan: plan,
          p_status: 'active',
          p_stripe_customer_id: customerId,
          p_stripe_subscription_id: subscriptionId,
          p_stripe_price_id: metadata.stripe_price_id ?? null,
          p_current_period_end: null,
          p_cancel_at_period_end: false,
        });
      }
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const metadata = (obj.metadata ?? {}) as Record<string, string>;
      const userId = metadata.supabase_user_id;
      if (!userId) {
        console.warn('subscription event missing metadata.supabase_user_id — skip plan update');
        break;
      }
      const statusRaw = String(obj.status ?? 'canceled');
      const status =
        statusRaw === 'active' || statusRaw === 'trialing' || statusRaw === 'past_due'
          ? statusRaw
          : 'canceled';
      const plan = metadata.target_plan || (status === 'canceled' ? 'walk-on' : 'locker-room');
      const periodEnd = typeof obj.current_period_end === 'number'
        ? new Date(obj.current_period_end * 1000).toISOString()
        : null;

      await supabase.rpc('apply_stripe_subscription', {
        p_user_id: userId,
        p_plan: plan,
        p_status: status,
        p_stripe_customer_id: typeof obj.customer === 'string' ? obj.customer : null,
        p_stripe_subscription_id: typeof obj.id === 'string' ? obj.id : null,
        p_stripe_price_id: null,
        p_current_period_end: periodEnd,
        p_cancel_at_period_end: Boolean(obj.cancel_at_period_end),
      });
      break;
    }

    case 'invoice.paid':
    case 'invoice.payment_failed':
      // Stub: logging only — extend to mark past_due / send email later
      console.log(`[stripe-webhook] ${event.type}`, obj.id);
      break;

    default:
      console.log(`[stripe-webhook] ignored event type ${event.type}`);
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
