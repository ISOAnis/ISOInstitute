-- Reset try-out usage for your account (run in Supabase SQL Editor)
-- Clears "Chatted" / booked state so you can book again this month.

DO $$
DECLARE
  uid uuid;
  anis_id uuid := 'a0000001-0000-4000-8000-000000000001';
BEGIN
  SELECT id INTO uid FROM public.profiles WHERE email = 'yhamu27@gmail.com';

  IF uid IS NULL THEN
    RAISE EXCEPTION 'No profile found for yhamu27@gmail.com';
  END IF;

  UPDATE public.discovery_bookings
  SET status = 'canceled'
  WHERE player_id = uid
    AND status = 'scheduled';

  DELETE FROM public.usage_counters
  WHERE user_id = uid
    AND month = to_char(now(), 'YYYY-MM');
END $$;
