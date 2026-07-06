# ISO Backend Migration — Internal Summary

**Branch:** `onboarding-backend`  
**Stack:** Vite + React (no React Router) + Supabase (PostgreSQL)  
**Supabase project:** `https://ifjpdygbyusmyabtercf.supabase.co`  
**Admin account:** `yhamu27@gmail.com` (`is_admin = true` on signup)

---

## What we were trying to do

The app started as a **demo/prototype**. Login was fake, and most data lived in the browser (`localStorage`) or hardcoded arrays. We are moving it to **Supabase** so real users can sign up, get saved to a database, and use the app like a real product.

---

## Business rules we locked in

| Topic | Decision |
|-------|----------|
| Auth | Email/password + Google + Apple |
| Coach approval | Always manual (board/admin) before coaches appear |
| Coach roster | Starts empty; only real onboarded + approved coaches show |
| Gender filter | Removed — show all coaches |
| Multi-role | One email can be both player and coach |
| Plan upgrades | Admin-only via `subscriptions.plan` until Stripe exists |
| Pathway changes | Auto-approve after 7 days (schema ready, UI partial) |
| Stripe / payments | Not built yet |
| Try-outs | In-app calendar only; 30 min sessions |
| Demo coach | **Anis Benyoucef** on Builder pathway (`engineering`) |

---

## Phases completed

### Phase 0 — Foundation

- Installed `@supabase/supabase-js`
- `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- `src/lib/supabase.ts` — Supabase client
- `src/types/database.ts` — TypeScript types
- `src/contexts/AuthContext.tsx` — session, profile, subscription, sign in/out, OAuth
- **Migration 001** — core schema: `profiles`, `subscriptions`, onboarding, assessments, player/coach profiles, pathways, RLS, storage, `handle_new_user` trigger
- **Migration 002** — INSERT policies for profiles/subscriptions fallback

### Phase 1 — Auth & onboarding

- `JoinISOPage` — real Supabase sign-up, sign-in, OAuth
- Email confirmation flow + redirect back to join page
- Player/coach/explorer onboarding saves to DB (`onboardingService`)
- Coach applications → `pending` until admin approves
- `App.tsx` + `Navigation.tsx` — portal gates, multi-role switching, real sign-out
- Portal routing — returning users skip onboarding and go straight to portal
- Loading gate fixes — no onboarding UI flash on sign-in

### Phase 3 — Coach discovery & try-outs

*(Phase 2 membership wiring was deferred — see “Not yet done” below.)*

- **Migration 003** — `discovery_bookings`, `usage_counters`, coach listing columns, `discoverable_coaches` view, seed coach Anis
- `src/services/coaches.ts` — fetch approved discoverable coaches by pathway
- `src/services/discoveryService.ts` — bookings + monthly usage limits
- `src/hooks/useDiscoverableCoaches.ts`
- **CoachModal** — loads coaches from Supabase (not hardcoded list)
- **CallIsoPage** — fetches coach by name from DB
- **PlayerPortal Explorer** — coach list from DB; try-out limits from `usage_counters`
- **ConsultationModal** — saves real bookings with date/time picker
- Explorer **BOOK TRY OUT** wired to same calendar modal as home court
- Admin **Reset try-outs** button + `supabase/scripts/reset_tryout_usage.sql` for testing

---

## Database tables in use

| Table / view | Purpose |
|--------------|---------|
| `profiles` | User identity, roles, onboarding flags, admin flag |
| `subscriptions` | Plan (`walk-on`, `locker-room`, `varsity`) |
| `onboarding_sessions` | In-progress onboarding answers |
| `player_assessments` / `coach_assessments` | ISO evaluation results |
| `player_profiles` / `coach_profiles` | Role-specific profile data |
| `player_pathways` | Exploring vs locked pathway *(schema exists, UI still partly localStorage)* |
| `discovery_bookings` | Scheduled try-out sessions |
| `usage_counters` | Monthly try-out limits per user |
| `discoverable_coaches` | View of approved, visible coaches |

---

## Key files

```
src/lib/supabase.ts
src/contexts/AuthContext.tsx
src/services/profileService.ts
src/services/onboardingService.ts
src/services/coaches.ts
src/services/discoveryService.ts
src/hooks/useDiscoverableCoaches.ts
src/types/database.ts
src/types/discoverableCoach.ts
src/utils/portalRouting.ts
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_profile_insert_policies.sql
supabase/migrations/003_phase3_discovery.sql
supabase/scripts/reset_tryout_usage.sql
```

---

## What still uses mocks / localStorage

- Membership plan (`iso_demo_plan`)
- Pathway lock / explore state
- Games & buckets
- Coach–player chat
- Locker Room chat & videos
- ISO Community forum
- AI matching / varsity pairing
- ISO Store catalog & orders
- Coach real availability (time slots are fake)
- Stripe payments

---

## Demo coach (testing)

| Field | Value |
|-------|-------|
| Name | Anis Benyoucef |
| Pathway | Builder (`engineering`) |
| Email | `anis.benyoucef@iso.demo` |
| Password | `IsoDemoCoach1!` |
| UUID | `a0000001-0000-4000-8000-000000000001` |

---

## Migrations to run (Supabase SQL Editor)

Run in order:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_profile_insert_policies.sql`
3. `supabase/migrations/003_phase3_discovery.sql`

---

## Known fixes during build

1. Email confirm — no session until confirmed → added check-email UX
2. Sign-out only cleared localStorage → now calls Supabase `signOut()`
3. Same account blocked coach onboarding → `iso_join_add_role` intent
4. Onboarding flash on login → loading gate in App + JoinISOPage
5. Explorer try-out had no calendar → wired `ConsultationModal`
6. “Chatted” stuck after test booking → admin reset + SQL script

---

## Next planned phase

**Phase 4** — Wire `subscriptions` and `player_pathways` from Supabase instead of localStorage, so plan and pathway lock are real in the database.

---

## ELI5 summary

Imagine ISO is a **basketball club house**.

### Before (the old app)

- You could *pretend* to sign in — the door didn’t really check who you were.
- Your name, your team, and your coaches were written on **sticky notes** in your pocket (the browser). Close the tab or use another computer and things got weird.
- The coaches on the wall were **fake pictures** someone glued there — not real people who joined the club.

### What we built (the new stuff)

**1. A real front door (Supabase Auth)**  
Now you need a real key — email/password or Google/Apple. The club knows who you are.

**2. A filing cabinet (the database)**  
When you sign up and finish onboarding, your info goes into a **filing cabinet** that stays at the club — not just in your pocket. Your name, whether you’re a player or coach, and if you finished setup all get saved there.

**3. Rules for coaches**  
If someone wants to be a coach, they fill out a form. A grown-up (the admin) has to say **“yes, approved”** before kids can see them. No approval = they stay hidden.

**4. A real coach on the wall**  
We put **one real coach** in the cabinet — **Anis**, on the **Builder** team. When you look for Builder coaches, you see him because he’s really in the system.

**5. Booking a try-out (like scheduling playtime)**  
When you want to meet a coach, you pick a **day and time** on a calendar. That gets written in the cabinet too: “Player wants to try out with Anis on Tuesday at 3pm.”

**6. Fair rules for try-outs**  
The club remembers how many try-outs you used this month so you can’t book unlimited free meetings. Walk-On = one per pathway; Locker Room = a few different coaches.

### What’s still pretend

- Picking your paid plan (Walk-On → Locker Room) — still mostly sticky notes
- Games, homework buckets, chat, forum, store — still toy versions
- Paying with money (Stripe) — not hooked up yet

### Simple picture

```
Old app:  You → sticky notes in pocket → fake coaches

New app:  You → real login → filing cabinet (Supabase)
                → real coaches (if approved)
                → real try-out bookings on calendar
```

**In one sentence:** We gave the club a real door, a real filing cabinet, real sign-up for players and coaches, one real coach you can find and book — and lots of other stuff is still the pretend version until we build the next phases.
