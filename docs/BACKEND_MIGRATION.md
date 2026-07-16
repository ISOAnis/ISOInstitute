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
| `games` | Coach-assigned goals per player |
| `buckets` | Tasks inside a game (`open` → `pending_approval` → `approved`) |
| `bucket_comments` | Coach feedback on buckets |
| `messages` | Direct coach ↔ player chat (realtime enabled) |

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

- Locker Room **videos** (catalog still demo)
- Forum **comments** (encouragements are real; threaded replies not yet)
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
4. `supabase/migrations/004_membership_and_pathways.sql`
5. `supabase/migrations/005_games_and_buckets.sql`
6. `supabase/migrations/006_messaging.sql`
7. `supabase/migrations/007_community.sql`

---

## Known fixes during build

1. Email confirm — no session until confirmed → added check-email UX
2. Sign-out only cleared localStorage → now calls Supabase `signOut()`
3. Same account blocked coach onboarding → `iso_join_add_role` intent
4. Onboarding flash on login → loading gate in App + JoinISOPage
5. Explorer try-out had no calendar → wired `ConsultationModal`
6. “Chatted” stuck after test booking → admin reset + SQL script
7. Coach Messages showed “Imam Abdullah Rahman” → prefer Auth profile name; render live display names

---

### Phase 4 — Membership & pathways in DB

- **Migration 004** — `set_own_plan` RPC (temporary self-service plan change until Stripe), `resolve_due_pathway_change` (7-day auto-approve), `review_pathway_change` (admin approve/deny)
- `src/services/pathwayService.ts` — pathway + plan reads/writes against Supabase
- `AuthContext` — `updatePlan()`; syncs DB pathway state to legacy localStorage keys on login; resolves due pathway changes automatically
- Plan upgrades in PlayerPortal / PathwayLockConfirmModal persist to `subscriptions`
- Exploring + locked pathways persist to `player_pathways`
- Pathway change requests go to `pathway_change_requests` with real 7-day auto-approve; admin can approve immediately

### Phase 5 — Games & buckets in DB

- **Migration 005** — `games`, `buckets`, `bucket_comments` tables + RLS; `get_coach_roster()` RPC (players who booked a try-out with the coach or already have games)
- `src/services/gamesService.ts` — fetch/create games, add buckets, player mark-done, coach approve, comments
- **PlayerPortal** — logged-in players load real games; checking a bucket sets `pending_approval` in DB (game only "won" when the coach approves everything); guests keep the demo data
- **CoachPortal** — "My Players" roster comes from the DB for logged-in coaches; New Game, new **Add Bucket** form, Approve Completion, and comments all persist
- Bucket lifecycle enforced by RLS: players can only flip between `open`/`pending_approval`; only the coach can approve

### Phase 6 — Coach–player messaging in DB

- **Migration 006** — `messages` table + RLS, realtime publication, `has_coaching_relationship()` helper, `get_player_coaches()` RPC
- Sending requires a real coaching relationship (a try-out booking or an assigned game between the two users) — enforced at the database level
- `src/services/messagesService.ts` — fetch conversation, send, mark read, realtime subscription to incoming messages
- **CoachPlayerChat** — signed-in users get real DB chat with live incoming messages and read receipts; guests keep the demo transcript
- **PlayerPortal Messages** — shows your real coaches (from bookings/games) instead of the hardcoded "Imam Abdullah Rahman"; coach picker appears if you have more than one
- **CoachPortal Messages** — chats use real profile IDs, so coach ↔ player messages actually connect

### Phase 7 — Community forum & Locker Room channels in DB

- **Migration 007** — `community_posts`, `post_encouragements`, `locker_messages` + RLS; realtime on locker channel messages
- `src/services/communityService.ts` — forum CRUD + encouragements; locker fetch/send + realtime subscribe
- **ISOCommunityForum** — signed-in members post wins/goals and encourage peers; guests keep the demo feed
- **LockerRoomChat** — pathway channel messages persist and stream live; videos remain demo for now
- Plan gating (Locker Room / Varsity) stays in the app UI

## Next planned phase

**Phase 8** — AI matching / varsity pairing (match requests + accept/decline → coaching relationship).

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

- Chat, forum, store — still toy versions
- Paying with money (Stripe) — not hooked up yet

*(Since this was written: picking your plan, choosing your pathway, and the coach's games & buckets homework board are now all saved in the filing cabinet too.)*

### Simple picture

```
Old app:  You → sticky notes in pocket → fake coaches

New app:  You → real login → filing cabinet (Supabase)
                → real coaches (if approved)
                → real try-out bookings on calendar
```

**In one sentence:** We gave the club a real door, a real filing cabinet, real sign-up for players and coaches, one real coach you can find and book — and lots of other stuff is still the pretend version until we build the next phases.
