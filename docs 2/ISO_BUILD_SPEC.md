# ISO — Build Spec for Cursor (v2: community coaching)

> Paste the "Prompt for Cursor" section into Cursor Agent. Keep this whole file in the repo at `/docs/ISO_BUILD_SPEC.md` so Cursor can re-read it. The `/docs/screens/*.dc.html` files are the visual reference: open them to see exact layout, copy, spacing and colors. They are prototype files, **not** code to copy — rebuild them as React Native components.

---

## Prompt for Cursor

```
We are rebuilding the ISO mobile app from a new design. Read /docs/ISO_BUILD_SPEC.md fully before writing code, and use the HTML files in /docs/screens/ as the visual reference for every screen (layout, copy, colors, spacing).

Rules:
- Work on the branch `iso-v2`. Do not touch `main`.
- Expo + React Native + TypeScript, Expo Router for navigation. There is NO backend yet: this is front end only.
- All data comes from mock files in /mobile/mocks, read through a small data layer in /mobile/data (e.g. getIsos(), getCoach(id), confirmSeat()). Screens never import mocks directly, so a real backend can be plugged in later without touching screens.
- Keep app state (selected pathway, seat status, check-in codes, follows) in a simple store (Zustand or React context) so the prototype flows work end to end.
- Put design tokens in /mobile/theme (colors, pathway palette, type, spacing) and use them everywhere. No hard-coded colors in screens.
- Build reusable components first: Pill, PathwayDot, CoachCardFull, IsoCard, AreaBubble, BottomSheet, CodeDisplay, TabBar, ModeSwitch.
- Build in the phase order in the spec. Stop at the end of each phase, summarize what you built, and wait for me.
- Start with Phase 1 now.
```

---

## 1. What ISO is

ISO is **community coaching, in person**. Coaches (people who've already walked a path) drop a pin for a small meetup, called **an ISO**, at a verified **ISO Partner** spot. A few players claim seats by saying **"I got next."** ISO also curates big pathway events (**The Court**).

- Tagline: *Where culture, community, and ambition intersect.*
- Mission: *Inspire ambition, elevate overlooked talent, and rebuild community pathways to success.*
- Launch market: Denver metro.

## 2. Design tokens

| Token | Value | Use |
|---|---|---|
| bg | `#080808` | app background |
| surface | `#121212` / `#141414` | cards |
| border | `#222` / `#262626` / `#333` | outlines |
| text | `#FFFFFF` / `#E0E0E0` | primary |
| textMuted | `#AAAAAA` / `#8f8f8f` | secondary |
| **gold (brand)** | `#C8873A` | primary buttons, ISO brand, Overall numbers, active tab |

**Pathway palette** (fill = shapes/pins/bars; text = readable text on black):

| Pathway | Field | fill | text |
|---|---|---|---|
| Founder | Entrepreneurship & business | `#e65100` | `#ff8a50` |
| Builder | Engineering & tech | `#8e24aa` | `#c77ddb` |
| Healer | Medicine & healthcare | `#1e88e5` | `#64b5f6` |
| Reformer | Law & public policy | `#00acc1` | `#4dd0e1` |
| Warrior | Health, fitness & athletics | `#e53935` | `#ef7470` |
| Seeker | Deen, purpose & character | `#1db954` | `#4cd47b` |

Color rule: **gold = brand + main actions. Pathway color = identity** (pins, tags, coach card tint, the player's own progress).

Type: headlines Barlow Condensed 800 uppercase; body Manrope; welcome screen headline Bebas Neue. Touch targets ≥ 44px.

## 3. Screens (reference file → what it does)

### Welcome & onboarding
- **Splash.dc.html** — logo + "You're not lost. You're in search of." → after ~1.8s logo moves up, shows tagline + Sign up / Log in.
- **Onboard1** — role (Play / Coach) + name, phone, city, birthday (18+). Coach → CoachApply.
- **Onboard2** — pick pathway; accents recolor live. Max **2 pathway switches per month**.
- **Onboard3** — three quick questions (skippable) used for matching.
- **SpeakISO ("Talk the ISO talk")** — 4 numbered steps: Find an ISO → Say "I got next" → Pull up, check in → Rank up. CTA "It's not you vs you anymore. Jump In." lands on Map with **Recommended** pill selected.

### Player
- **Main (Map)** — Denver metro map. Pills: **Recommended, Following, then 6 pathways**. ISOs show as **~5-mile dashed area circles** in pathway color (no venue names). Bottom sheet card with **‹ › arrows** cycles ISOs in the current pill and pans the map to each. Buttons: Coach card / View ISO.
- **RunDetail (ISO detail)** — pathway tag, title, host row → coach card, date/time, **area only** ("Southeast Aurora"; exact spot after confirmation), topics, seats, pathway priority note.
  - "I got next" → sheet explaining the **$5 hold** → Confirm.
  - Once confirmed: **4-digit check-in code** + **Huddle** card appear.
  - "Give up my spot" → cancel sheet with reason chips + note; shows whether hold is released.
- **Huddle** — group chat for the coach + confirmed players only. Pinned "Find me" message + optional table photo. Quick replies: I'm here / On my way / Running 5 late / Can't find you. Opens when confirmed/24h before, closes 2h after. Saved for safety.
- **Coach (Coach card)** — card styled like the real ISO cards: pathway-tinted card, big Overall top-left, pathway icon top-right, watermark pathway word, cutout photo, name, subtitle, 3 credential boxes, tag pills, "ISO · THE ASSIST". Below: ISO stats, Follow (turns on pin alerts), Coach updates (one-way posts to followers), Upcoming ISOs, What moves the Overall.
- **Events** — curated pathway events (e.g. a Warrior "King of the Court" night). RSVP; list of upcoming events by pathway.
- **Me** — rank + "Your ranks" list in the player's pathway color, pathway switch (with remaining switches), next unlock, Locker, recent ISOs. Gear icon → Playbook.
- **Playbook** — tabs: Mission (mission + Discipline/Humility/Respect + ISO Standard), Lingo, Ranks, Overall.

Language note: players **rank up**. Never use "climb the ladder." ("Pull as you climb" stays as the coach slogan.)

### Coach
- **CoachApply / CoachReview** — application → advisory board review in 24–48h.
- **ModeSwitch** — one account, Player | Coach toggle (badge shows pending requests).
- **CoachMap (Manage your ISOs)** — "Today: check in your table" card, "Who's got next" approve/decline, live pins, Drop a pin button.
- **DropPin** — topic, **pick an ISO Partner venue (closest first)**, day/time, seats (1–6), toggles: approve each request, reveal spot 24h before.
- **CoachCheckIn** — enter each player's 4-digit code; valid → checked in (hold released, rank count +1); invalid → "No RSVP for this code," coach may turn them away. Start ISO.
- **CoachDash** — private metrics: ISOs hosted, players met, show-up rate, followers, tier progress, private feedback, advisory board notes, regulars.
- **CoachExplore** — coach in Player mode: sees all pathways, can take open seats, **no priority**.

## 4. Business rules

**Seats & priority**
- Players in the ISO's pathway get first call; others can request remaining seats. Coaches (in player mode) never get priority.
- Coach approves each request (toggle on by default).

**$5 hold** (authorization hold, not a charge — e.g. Stripe manual capture)
- Place the hold when the coach **confirms** the seat (holds expire after several days).
- Released on check-in (via code).
- Cancel ≥ 24h before → released.
- Cancel < 24h → reason required; **1 free late cancel per month**, otherwise captured.
- No-show → captured. Coach cancels → all holds released, hurts coach show-up rate.
- Captured money goes to the **Community Pool** (funds free Court tickets/gear for students). ISO never keeps it.

**Location privacy**
- Before confirmation, show only area name + ~5 mi circle. **Offset the circle center randomly ~1 mi** from the real venue.
- Exact venue + table shared in the Huddle once confirmed (and at 24h).
- ISOs happen only at verified ISO Partner venues (public, staffed).

**Check-in codes**
- Unique 4-digit code per confirmed player per ISO. Coach enters it; no code = no RSVP. Unchecked players become no-shows 30 min after start.

**Ranks (players)** — counts checked-in ISOs in your pathway:
| ISOs | Level | Unlock |
|---|---|---|
| 1 | Freshman | Player card |
| 5 | JV | Can buy the ISO tee |
| 15 | Varsity | Earned pathway patch + Varsity gear access |
| 35 | D1 | First access to The Court + invite-only dinners |
| 60 | Pro | Eligible to apply as coach |
| 100 | Hall of Fame | Jersey retired, name on the wall |
Switching pathway starts that pathway's count; old progress is kept.

**Overall (coaches)** — moves with ISOs hosted (with check-ins), player feedback, show-up rate, Court co-hosting. Tiers: Bronze, Silver, Gold, Platinum. Hosting raises Overall; attending does not.

**Safety & conduct** — 18+, real names, verified phones. No private DMs between strangers; Huddle only. ISOs stay on the pathway; no political, social, or personal agendas at any ISO; everyone gets the same respect. Coaches approved on conduct, experience, and fit with the ISO Standard — not identity or belief.

## 5. Data model (for later: Supabase)

- `users` (id, name, phone, city, birthday, pathway, pathway_switches_this_month, coach_status: none|applied|approved|paused)
- `coach_profiles` (user_id, pathway, subtitle, credentials jsonb, tags text[], photo_url, overall, tier)
- `venues` (id, name, area_name, lat, lng, type, is_partner, notes)
- `isos` (id, coach_id, venue_id, pathway, title, topics text[], starts_at, ends_at, seats, approve_requests bool, display_lat, display_lng, status)
- `seats` (iso_id, player_id, status: requested|confirmed|declined|cancelled|checked_in|no_show, checkin_code, hold_id, cancel_reason, cancel_note)
- `follows` (player_id, coach_id)
- `huddle_messages` (iso_id, user_id, body, pinned bool, photo_url, created_at)
- `coach_posts` (coach_id, body, created_at)
- `events` (id, pathway, title, starts_at, venue_id, ticket_price, sponsor)
- `rank_progress` (user_id, pathway, checked_in_count)
- `community_pool` (ledger of captured holds and how they were spent)

**Enforce coach-only actions with row-level security**, not just hidden buttons (only approved coaches can create `isos`; only an ISO's coach can confirm seats and enter codes; only confirmed players can read that ISO's venue and Huddle).

## 6. Build phases

**Front end first (no backend):**
1. **Foundation** — theme tokens, fonts, Expo Router tabs (Map, Events, Coaches, Me), shared components, mock data + /mobile/data layer + store.
2. **Player core** — Map (pills, area circles, arrow carousel, pan), ISO detail, I got next + hold sheet (UI only), cancel sheet, check-in code display, Coach card, Huddle (mock messages).
3. **Onboarding + Me** — Splash, Onboard1–3, Talk the ISO talk, Me (ranks, pathway colors, switch limit), Playbook, Events.
4. **Coach side** — ModeSwitch, CoachApply/Review, CoachMap, DropPin with partner venues, CoachCheckIn, CoachDash, CoachExplore (all on mocks).

At this point the whole app is clickable and demo-ready for partners, coaches, and testers.

**Later, when you're ready for real users:**
5. **Backend** — Supabase: phone auth, the tables in section 5, row-level security, then swap /mobile/data from mocks to Supabase.
6. **Payments & realtime** — Stripe holds, Huddle realtime, push notifications (new pin from followed coach, confirmations, Huddle messages), 30-min no-show job, Community Pool ledger.
