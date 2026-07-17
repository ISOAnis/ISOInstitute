# Supabase Edge Functions — Stripe (Phase 9 stubs)

## Functions

| Function | JWT | Role |
|----------|-----|------|
| `stripe-webhook` | **Disable** (`--no-verify-jwt`) | Stripe → DB |
| `create-checkout-session` | Enabled | Authenticated client → Stripe Checkout |

## Deploy

```bash
# From repo root (requires supabase CLI + linked project)
supabase functions deploy stripe-webhook --no-verify-jwt
supabase functions deploy create-checkout-session
```

## Secrets

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set STRIPE_PRICE_LOCKER_ROOM=price_...
supabase secrets set STRIPE_PRICE_VARSITY=price_...
supabase secrets set SITE_URL=http://localhost:3000
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically on hosted projects.

## Stripe Dashboard

1. Developers → Webhooks → Add endpoint  
   `https://<project-ref>.supabase.co/functions/v1/stripe-webhook`
2. Subscribe at least to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
3. Copy signing secret → `STRIPE_WEBHOOK_SECRET`

## Status

These handlers are **stubs**: they validate env, log/idempotency-record events, and outline plan updates. They do **not** yet call `stripe.webhooks.constructEvent` or `checkout.sessions.create`. Wire those next after migration `009_stripe_billing.sql` is applied.
