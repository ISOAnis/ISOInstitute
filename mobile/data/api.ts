/**
 * The data layer. Screens call these functions and nothing else.
 * Every function is async so a real backend can replace the mock db
 * without changing call sites.
 */
import { hoursUntil, now } from './clock';
import { getCoachCardPreview } from './coachApplication';
import { COACH_HOME, db, DEMO_COACH_ID, rules } from './db';
import { emptyMatch, MATCH_SECTIONS, scoreIso, SECTION_RESET } from './matching';
import { makeCheckinCode, offsetLocation } from './privacy';
import { rankFor, type RankStatus } from './ranks';
import type {
  AdvisoryNote,
  CancelReason,
  Coach,
  CoachApplication,
  CoachFeedback,
  CoachMonth,
  CoachRequest,
  LockerItem,
  MatchPrefs,
  MatchProfile,
  MatchSection,
  NewIsoInput,
  PastIso,
  Regular,
  CoachPost,
  HuddleMessage,
  Iso,
  IsoEvent,
  IsoSummary,
  Pathway,
  PathwayId,
  Photo,
  Player,
  Rank,
  Recommendation,
  Seat,
  Venue,
} from './types';

const ok = <T>(value: T): Promise<T> => Promise.resolve(value);

class DataError extends Error {}

function coachOrThrow(id: string): Coach {
  const coach = db.coaches.find((c) => c.id === id);
  if (!coach) throw new DataError(`Unknown coach ${id}`);
  return coach;
}

function venueOrThrow(id: string): Venue {
  const venue = db.venues.find((v) => v.id === id);
  if (!venue) throw new DataError(`Unknown venue ${id}`);
  return venue;
}

function isoRecord(id: string): Iso {
  const seed = db.isos.find((i) => i.id === id);
  if (!seed) throw new DataError(`Unknown ISO ${id}`);
  const venue = venueOrThrow(seed.venueId);
  const display = offsetLocation(seed.id, venue.lat, venue.lng);
  return { ...seed, displayLat: display.lat, displayLng: display.lng };
}

const holdsSeat = (s: Seat) => s.status === 'confirmed' || s.status === 'checked_in';

const hostingIso = (isoId: string) => !!db.me.coachId && isoRecord(isoId).coachId === db.me.coachId;

/** Host, or a confirmed player inside 24h of start. That's when names of who's in become visible. */
function namesVisible(isoId: string): boolean {
  if (hostingIso(isoId)) return true;
  const mine = mySeat(isoId);
  return !!(mine && holdsSeat(mine) && hoursUntil(isoRecord(isoId).startsAt) <= 24);
}

function summarize(iso: Iso): IsoSummary {
  const taken = db.seats.filter((s) => s.isoId === iso.id && holdsSeat(s)).length;
  return {
    ...iso,
    coach: coachOrThrow(iso.coachId),
    areaName: venueOrThrow(iso.venueId).areaName,
    seatsTaken: taken,
    seatsOpen: Math.max(0, iso.seats - taken),
  };
}

function mySeat(isoId: string): Seat | undefined {
  return db.seats.find((s) => s.isoId === isoId && s.playerId === db.me.id);
}

// ---------------------------------------------------------------- reference

export const getPathways = (): Promise<Pathway[]> => ok(db.pathways);
export const getRanks = (): Promise<Rank[]> => ok(db.ranks);
export const getRules = () => ok({ ...rules });
export const getQuickReplies = (): Promise<string[]> => ok(db.quickReplies);
export const getSavedCard = () => ok(db.savedCard);

// ---------------------------------------------------------------- ISOs

export type IsoFilter = { kind: 'recommended' } | { kind: 'following' } | { kind: 'pathway'; pathway: PathwayId } | { kind: 'all' };

export interface IsoListItem extends IsoSummary {
  recommendation?: Recommendation;
}

/** Upcoming ISOs for the map and lists. */
export async function getIsos(filter: IsoFilter = { kind: 'all' }): Promise<IsoListItem[]> {
  const upcoming = db.isos
    .filter((i) => i.status !== 'cancelled' && i.status !== 'done')
    .map((i) => summarize(isoRecord(i.id)))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  switch (filter.kind) {
    case 'recommended':
      return upcoming
        .flatMap((iso) => {
          const recommendation = scoreIso(iso, db.me);
          return recommendation ? [{ ...iso, recommendation }] : [];
        })
        .sort((a, b) => b.recommendation.match - a.recommendation.match)
        .slice(0, 5);
    case 'following':
      return upcoming.filter((i) => db.follows.has(i.coachId));
    case 'pathway':
      return upcoming.filter((i) => i.pathway === filter.pathway);
    default:
      return upcoming;
  }
}

export async function getIso(id: string): Promise<IsoSummary> {
  return summarize(isoRecord(id));
}

export async function getCoachIsos(coachId: string): Promise<IsoSummary[]> {
  return (await getIsos()).filter((i) => i.coachId === coachId);
}

/** The exact venue, or null while it's still hidden from this player. */
export async function getRevealedVenue(isoId: string): Promise<Venue | null> {
  const iso = isoRecord(isoId);
  const seat = mySeat(isoId);
  if (!seat || !holdsSeat(seat)) return null;
  if (iso.revealSpot24h && hoursUntil(iso.startsAt) > 24) return null;
  return venueOrThrow(iso.venueId);
}

/**
 * The table photo for a confirmed seat. `revealed` says whether the spot itself is out yet,
 * so screens can blur the photo until then.
 */
export async function getTablePhoto(isoId: string): Promise<{ photo: Photo; revealed: boolean } | null> {
  const seat = mySeat(isoId);
  if (!seat || !holdsSeat(seat)) return null;
  const photo = venueOrThrow(isoRecord(isoId).venueId).photo;
  if (!photo) return null;
  return { photo, revealed: (await getRevealedVenue(isoId)) !== null };
}

export async function getVenues(): Promise<Venue[]> {
  return db.venues.filter((v) => v.isPartner);
}

// ---------------------------------------------------------------- coaches

export const getCoaches = (): Promise<Coach[]> => ok(db.coaches);
export const getCoach = async (id: string): Promise<Coach> => coachOrThrow(id);

export async function getCoachPosts(coachId: string): Promise<CoachPost[]> {
  return db.coachPosts.filter((p) => p.coachId === coachId);
}

export async function getCoachFeedback(coachId: string): Promise<CoachFeedback[]> {
  return db.coachFeedback.filter((f) => f.coachId === coachId);
}

export async function getFollows(): Promise<string[]> {
  return [...db.follows];
}

export async function setFollow(coachId: string, following: boolean): Promise<string[]> {
  coachOrThrow(coachId);
  if (following) db.follows.add(coachId);
  else db.follows.delete(coachId);
  return [...db.follows];
}

// ---------------------------------------------------------------- seats

function seatsFor(isoId: string): Seat[] {
  const iso = isoRecord(isoId);
  const priority = (s: Seat) => (s.isCoach ? 2 : s.playerPathway === iso.pathway ? 0 : 1);
  return db.seats.filter((s) => s.isoId === isoId).sort((a, b) => priority(a) - priority(b));
}

const redactSeat = (s: Seat, i: number): Seat => ({
  ...s,
  playerId: s.playerId === db.me.id ? s.playerId : `hidden-${s.isoId}-${i}`,
  playerName: '',
  playerInitials: '',
  checkinCode: undefined,
  note: undefined,
});

/**
 * Seats for an ISO. Other players' names stay hidden unless you're the host
 * or you're confirmed and it's 24 hours out.
 */
export async function getSeats(isoId: string): Promise<Seat[]> {
  const seats = seatsFor(isoId);
  if (namesVisible(isoId)) return seats;
  return seats.map((s, i) => (s.playerId === db.me.id ? s : redactSeat(s, i)));
}

/** Whether this player can see who else is in the ISO. */
export async function getNamesVisible(isoId: string): Promise<boolean> {
  return namesVisible(isoId);
}

export async function getMySeat(isoId: string): Promise<Seat | null> {
  return mySeat(isoId) ?? null;
}

/**
 * "I got next". Creates a request; when the coach doesn't approve requests
 * the seat is confirmed straight away.
 */
export async function requestSeat(isoId: string): Promise<Seat> {
  const iso = summarize(isoRecord(isoId));
  if (iso.seatsOpen === 0) throw new DataError('This ISO is full.');
  if (iso.coachId === db.me.coachId) throw new DataError('You’re hosting this one.');

  const existing = mySeat(isoId);
  if (existing && existing.status !== 'cancelled' && existing.status !== 'declined') return existing;
  if (existing) db.seats = db.seats.filter((s) => s !== existing);

  const seat: Seat = {
    isoId,
    playerId: db.me.id,
    playerName: db.me.name,
    playerInitials: db.me.initials,
    playerPathway: db.me.pathway,
    playerRank: rankFor(db.me.rankProgress[db.me.pathway] ?? 0, db.ranks).current?.level ?? 'Freshman',
    isCoach: db.me.coachStatus === 'approved',
    status: 'requested',
  };
  db.seats.push(seat);
  return iso.approveRequests ? seat : confirmSeat(isoId, db.me.id);
}

/** Coach approves a request: the seat is confirmed, a $5 hold is placed, a code is issued. */
export async function confirmSeat(isoId: string, playerId: string): Promise<Seat> {
  const seat = db.seats.find((s) => s.isoId === isoId && s.playerId === playerId);
  if (!seat) throw new DataError('No request for this player.');
  if (summarize(isoRecord(isoId)).seatsOpen === 0) throw new DataError('No seats left.');
  const taken = new Set(db.seats.filter((s) => s.isoId === isoId && s.checkinCode).map((s) => s.checkinCode!));
  seat.status = 'confirmed';
  seat.checkinCode = seat.checkinCode ?? makeCheckinCode(`${isoId}:${playerId}`, taken);
  return { ...seat };
}

export async function declineSeat(isoId: string, playerId: string): Promise<Seat> {
  const seat = db.seats.find((s) => s.isoId === isoId && s.playerId === playerId);
  if (!seat) throw new DataError('No request for this player.');
  seat.status = 'declined';
  return { ...seat };
}

export interface CancelResult {
  seat: Seat;
  late: boolean;
  holdReleased: boolean;
  usedLatePass: boolean;
}

/** Whether cancelling now counts as a late cancel (< 24h before start). */
export async function isLateCancel(isoId: string): Promise<boolean> {
  return hoursUntil(isoRecord(isoId).startsAt) < 24;
}

/**
 * Player gives up their spot. 24h+ out: hold released. Inside 24h a reason is
 * required; the monthly late-cancel pass releases the hold, otherwise it's
 * captured to the Community Pool.
 */
export async function cancelSeat(isoId: string, input: { reason?: CancelReason; note?: string } = {}): Promise<CancelResult> {
  const seat = mySeat(isoId);
  if (!seat || seat.status === 'cancelled') throw new DataError('You don’t have a seat here.');

  const late = await isLateCancel(isoId);
  const hadHold = seat.status === 'confirmed';
  if (late && hadHold && !input.reason) throw new DataError('Pick a reason for the late cancel.');

  let usedLatePass = false;
  let holdReleased = true;
  if (late && hadHold) {
    if (db.me.lateCancelsUsedThisMonth < rules.freeLateCancelsPerMonth) {
      db.me.lateCancelsUsedThisMonth += 1;
      usedLatePass = true;
    } else {
      holdReleased = false;
      db.communityPoolUsd += rules.holdUsd;
    }
  }

  seat.status = 'cancelled';
  seat.cancelReason = input.reason;
  seat.cancelNote = input.note;
  seat.checkinCode = undefined;
  return { seat: { ...seat }, late: late && hadHold, holdReleased, usedLatePass };
}

export type CheckInResult = { ok: true; seat: Seat } | { ok: false; reason: 'no_rsvp' | 'already_in' };

/** Coach enters a player's code at the table. Releases the hold and counts toward rank. */
export async function checkInCode(isoId: string, code: string): Promise<CheckInResult> {
  const seat = db.seats.find((s) => s.isoId === isoId && s.checkinCode === code);
  if (!seat || (seat.status !== 'confirmed' && seat.status !== 'checked_in')) return { ok: false, reason: 'no_rsvp' };
  if (seat.status === 'checked_in') return { ok: false, reason: 'already_in' };
  seat.status = 'checked_in';
  if (seat.playerId === db.me.id) {
    const p = isoRecord(isoId).pathway;
    db.me.rankProgress[p] = (db.me.rankProgress[p] ?? 0) + 1;
  }
  return { ok: true, seat: { ...seat } };
}

export const getCommunityPool = () => ok(db.communityPoolUsd);

// ---------------------------------------------------------------- huddle

export async function getHuddle(isoId: string): Promise<HuddleMessage[]> {
  return db.huddle.filter((m) => m.isoId === isoId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function sendHuddleMessage(isoId: string, body: string): Promise<HuddleMessage> {
  const text = body.trim();
  if (!text) throw new DataError('Message is empty.');
  const hosting = isoRecord(isoId).coachId === db.me.coachId;
  const msg: HuddleMessage = {
    id: `hm-${Date.now()}`,
    isoId,
    userId: hosting && db.me.coachId ? db.me.coachId : db.me.id,
    body: text,
    pinned: false,
    createdAt: now().toISOString().slice(0, 19),
  };
  db.huddle.push(msg);
  return msg;
}

// ---------------------------------------------------------------- events

export const getEvents = (): Promise<IsoEvent[]> => ok(db.events);

// ---------------------------------------------------------------- player

export async function getMe(): Promise<Player> {
  return { ...db.me, rankProgress: { ...db.me.rankProgress } };
}

export async function getRankStatus(pathway: PathwayId = db.me.pathway): Promise<RankStatus> {
  return rankFor(db.me.rankProgress[pathway] ?? 0, db.ranks);
}

/**
 * Switch pathways (once a month). The old pathway's count is kept. Players can still
 * say "I got next" on any pathway's ISOs; they just don't get priority there.
 * The first pick during onboarding doesn't count as a switch.
 */
export async function setPathway(pathway: PathwayId, opts: { initial?: boolean } = {}): Promise<Player> {
  if (pathway === db.me.pathway) return getMe();
  if (opts.initial) {
    db.me.pathway = pathway;
    return getMe();
  }
  if (db.me.pathwaySwitchesThisMonth >= rules.maxPathwaySwitchesPerMonth) {
    throw new DataError('You’ve used your pathway switch this month.');
  }
  db.me.pathway = pathway;
  db.me.pathwaySwitchesThisMonth += 1;
  return getMe();
}

export async function saveMatchAnswers(answers: string[]): Promise<Player> {
  db.me.matchAnswers = answers;
  if (!db.me.stage && answers[2]) db.me.stage = answers[2];
  return getMe();
}

// ---------------------------------------------------------------- profile + matching

export type ProfileOwner = 'player' | 'coach';

const PLACEHOLDER_NAME = '[Your name]';

function matchOf(who: ProfileOwner): MatchProfile {
  if (who === 'player') return db.me.match;
  const coach = coachOrThrow(db.me.coachId ?? '');
  coach.match ??= emptyMatch();
  return coach.match;
}

export interface ProfileStatus {
  /** Name, neighborhood and stage are filled in. */
  basicsDone: boolean;
  done: number;
  total: number;
  /** First section not answered yet. */
  next?: MatchSection;
}

export async function getProfileStatus(who: ProfileOwner = 'player'): Promise<ProfileStatus> {
  const m = matchOf(who);
  const me = db.me;
  return {
    basicsDone: me.name !== PLACEHOLDER_NAME && !!me.name.trim() && !!me.neighborhood && !!me.stage,
    done: MATCH_SECTIONS.filter((s) => m.done.includes(s.id)).length,
    total: MATCH_SECTIONS.length,
    next: MATCH_SECTIONS.find((s) => !m.done.includes(s.id))?.id,
  };
}

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);

/** "Complete onboarding": name, where they'd pull up from, and where they're at. */
export async function updateBasics(input: { name: string; neighborhood: string; stage: string }): Promise<Player> {
  const name = input.name.trim();
  if (!name) throw new DataError('Add your name.');
  if (!input.neighborhood) throw new DataError('Pick where you’d pull up from.');
  if (!input.stage) throw new DataError('Pick where you’re at right now.');
  db.me.name = name;
  db.me.initials = initialsOf(name) || 'YOU';
  db.me.neighborhood = input.neighborhood;
  db.me.stage = input.stage;
  return getMe();
}

/** Areas with partner spots, for the neighborhood picker. */
export async function getAreas(): Promise<string[]> {
  return [...new Set(db.venues.map((v) => v.areaName))].sort();
}

export async function getMatch(who: ProfileOwner = 'player'): Promise<{ match: MatchProfile; prefs: MatchPrefs }> {
  return { match: { ...matchOf(who) }, prefs: { ...db.me.prefs } };
}

/** Saves one section. Passing no fields records "Prefer not to say". */
export async function saveMatchSection(who: ProfileOwner, section: MatchSection, patch: Partial<MatchProfile>): Promise<void> {
  const m = matchOf(who);
  Object.assign(m, SECTION_RESET[section], patch);
  if (m.values.length > 3) m.values = m.values.slice(0, 3);
  if (m.from.length > 3) m.from = m.from.slice(0, 3);
  if (!m.done.includes(section)) m.done.push(section);
  if (who === 'player' && section === 'gender' && !m.gender) db.me.prefs.sameGender = false;
}

/** Deletes a section's answers. */
export async function clearMatchSection(who: ProfileOwner, section: MatchSection | 'all'): Promise<void> {
  const m = matchOf(who);
  const sections = section === 'all' ? MATCH_SECTIONS.map((s) => s.id) : [section];
  for (const s of sections) Object.assign(m, SECTION_RESET[s]);
  m.done = m.done.filter((d) => !sections.includes(d));
  if (who === 'player' && sections.includes('gender')) db.me.prefs.sameGender = false;
}

export async function setMatchPrefs(patch: Partial<MatchPrefs>): Promise<MatchPrefs> {
  if (patch.sameGender && !db.me.match.gender) throw new DataError('Add your gender first. It’s only used for this.');
  Object.assign(db.me.prefs, patch);
  return { ...db.me.prefs };
}

export async function getPastIsos(): Promise<PastIso[]> {
  return [...db.pastIsos].sort((a, b) => b.date.localeCompare(a.date));
}

export const getLocker = (): Promise<LockerItem[]> => ok(db.locker);

// ---------------------------------------------------------------- events

export async function getRsvps(): Promise<string[]> {
  return [...db.rsvps];
}

export async function setRsvp(eventId: string, going: boolean): Promise<string[]> {
  if (going) db.rsvps.add(eventId);
  else db.rsvps.delete(eventId);
  return [...db.rsvps];
}

// ---------------------------------------------------------------- huddle members

export interface HuddleMember {
  id: string;
  name: string;
  initials: string;
  isCoach: boolean;
  isMe: boolean;
}

/** The coach plus confirmed players. Only they can read the Huddle. Other players' names wait until 24h out. */
export async function getHuddleMembers(isoId: string): Promise<HuddleMember[]> {
  const iso = isoRecord(isoId);
  const coach = coachOrThrow(iso.coachId);
  const show = namesVisible(isoId);
  const players = db.seats
    .filter((s) => s.isoId === isoId && holdsSeat(s))
    .map((s, i) => {
      const me = s.playerId === db.me.id;
      const hide = !show && !me;
      return {
        id: hide ? `hidden-${isoId}-${i}` : s.playerId,
        name: me ? 'You' : hide ? 'Player' : s.playerName.split(' ')[0],
        initials: hide ? '' : s.playerInitials,
        isCoach: false,
        isMe: me,
      };
    });
  return [{ id: coach.id, name: coach.firstName, initials: coach.initials, isCoach: true, isMe: false }, ...players];
}

// ---------------------------------------------------------------- coach side

/** Prototype only: stands in for the advisory board approving the application. The demo coach account is already ID-verified. */
export async function approveCoachForDemo(): Promise<Player> {
  db.me.coachStatus = 'approved';
  db.me.coachId = DEMO_COACH_ID;
  db.me.idCheck ??= { status: 'verified', referenceId: 'demo', provider: 'mock', checkedAt: now().toISOString().slice(0, 19) };
  return getMe();
}

/** Why this account can't drop a pin yet, or null when it can. */
export async function getPinBlocker(): Promise<string | null> {
  if (db.me.coachStatus !== 'approved') return 'Your coach application has to be approved before you can drop a pin.';
  if (db.me.idCheck?.status !== 'verified') return 'Verify your ID before you drop your first pin.';
  return null;
}

export async function getMyCoach(): Promise<Coach | null> {
  return db.me.coachId ? coachOrThrow(db.me.coachId) : null;
}

/** Pending "I got next" requests across a coach's ISOs, in priority order. */
export async function getCoachRequests(coachId: string): Promise<CoachRequest[]> {
  const mine = await getCoachIsos(coachId);
  const out: CoachRequest[] = [];
  for (const iso of mine) {
    const seats = seatsFor(iso.id).filter((s) => s.status === 'requested');
    out.push(...seats.map((s) => ({ ...s, iso })));
  }
  return out;
}

/** Confirmed and checked-in players for the host's check-in screen. Always named. */
export async function getTable(isoId: string): Promise<Seat[]> {
  return seatsFor(isoId).filter(holdsSeat);
}

export async function getNextHostedIso(coachId: string): Promise<IsoSummary | null> {
  return (await getCoachIsos(coachId))[0] ?? null;
}

export async function getCoachMonth(coachId: string): Promise<CoachMonth | null> {
  return db.coachMonths.find((m) => m.coachId === coachId) ?? null;
}

export async function getAdvisoryNote(coachId: string): Promise<AdvisoryNote | null> {
  return db.advisoryNotes.find((n) => n.coachId === coachId) ?? null;
}

export async function getRegulars(coachId: string): Promise<Regular[]> {
  return db.regulars.filter((r) => r.coachId === coachId);
}

/** Straight-line miles between two points. */
function milesBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 3959 * 2 * Math.asin(Math.sqrt(h));
}

/** Every partner spot with its distance from the coach, closest first. Coaches see exact spots; players never do before confirming. */
export async function getCoachVenues(): Promise<Venue[]> {
  return db.venues
    .filter((v) => v.isPartner)
    .map((v) => ({ ...v, distanceMi: Math.round(milesBetween(COACH_HOME, v) * 10) / 10 }))
    .sort((a, b) => a.distanceMi - b.distanceMi);
}

/** Coach drops a pin. Only approved coaches can create ISOs, in an open table slot, for 2 to 4 players. */
export async function createIso(input: NewIsoInput): Promise<IsoSummary> {
  const coach = await getMyCoach();
  const blocker = await getPinBlocker();
  if (blocker) throw new DataError(blocker);
  if (!coach) throw new DataError('Only approved coaches can drop a pin.');
  const title = input.title.trim();
  if (!title) throw new DataError('Give your ISO a topic.');
  if (input.end <= input.start) throw new DataError('End time has to be after the start.');
  if (input.seats < rules.minSeats || input.seats > rules.maxSeats) throw new DataError(`Pick ${rules.minSeats} to ${rules.maxSeats} players.`);
  const venue = venueOrThrow(input.venueId);
  const startsAt = `${input.date}T${input.start}:00`;
  const endsAt = `${input.date}T${input.end}:00`;
  if (bookedAt(venue.id, startsAt, endsAt).length >= venue.maxTables) throw new DataError('This spot is full at that time.');

  const id = `iso-${coach.id}-${Date.now()}`;
  db.isos.push({
    id,
    coachId: coach.id,
    venueId: input.venueId,
    pathway: coach.pathway,
    title,
    topics: [],
    startsAt,
    endsAt,
    seats: input.seats,
    approveRequests: input.approveRequests,
    revealSpot24h: input.revealSpot24h,
    groupFor: input.groupFor,
    status: 'live',
  });
  return getIso(id);
}

export async function updateProfile(patch: Partial<Pick<Player, 'name' | 'phone' | 'city' | 'birthday'>>): Promise<Player> {
  Object.assign(db.me, patch);
  if (patch.name) {
    db.me.initials = patch.name
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
  return getMe();
}

// ---------------------------------------------------------------- venue tables

const isBooked = (i: Pick<Iso, 'status'>) => i.status !== 'cancelled' && i.status !== 'done';

/** ISOs holding a table at this venue for any part of the slot. */
function bookedAt(venueId: string, startsAt: string, endsAt: string, exceptIsoId?: string): IsoSummary[] {
  return db.isos
    .filter((i) => i.venueId === venueId && i.id !== exceptIsoId && isBooked(i) && i.startsAt < endsAt && i.endsAt > startsAt)
    .map((i) => summarize(isoRecord(i.id)));
}

export interface SlotStatus {
  venueId: string;
  maxTables: number;
  /** ISOs already at a table in this slot. */
  booked: IsoSummary[];
  open: number;
}

const slotStatus = (venue: Venue, startsAt: string, endsAt: string): SlotStatus => {
  const booked = bookedAt(venue.id, startsAt, endsAt);
  return { venueId: venue.id, maxTables: venue.maxTables, booked, open: Math.max(0, venue.maxTables - booked.length) };
};

/** Table availability at each of the coach's partner spots for a date and 24h start/end. */
export async function getSlotAvailability(date: string, start: string, end: string): Promise<SlotStatus[]> {
  const venues = await getCoachVenues();
  return venues.map((v) => slotStatus(v, `${date}T${start}:00`, `${date}T${end}:00`));
}

export interface SlotSuggestion {
  venueId: string;
  date: string;
  start: string;
  end: string;
}

const toMin = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));
const toHhmm = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
const LAST_END_MIN = 21 * 60;

/** For a full slot: the same spot at its next open time that day, and the nearest open partner spot at the same time. */
export async function getSlotSuggestions(
  venueId: string,
  date: string,
  start: string,
  end: string,
): Promise<{ later: SlotSuggestion | null; nearby: SlotSuggestion | null }> {
  const venue = venueOrThrow(venueId);
  const length = toMin(end) - toMin(start);
  let later: SlotSuggestion | null = null;
  for (let s = toMin(start) + 30; s + length <= LAST_END_MIN; s += 30) {
    const slot = { venueId, date, start: toHhmm(s), end: toHhmm(s + length) };
    if (slotStatus(venue, `${date}T${slot.start}:00`, `${date}T${slot.end}:00`).open > 0) {
      later = slot;
      break;
    }
  }
  const others = (await getCoachVenues()).filter((v) => v.id !== venueId);
  const open = others.find((v) => slotStatus(v, `${date}T${start}:00`, `${date}T${end}:00`).open > 0);
  return { later, nearby: open ? { venueId: open.id, date, start, end } : null };
}

// ---------------------------------------------------------------- short tables

export interface ShortTable {
  iso: IsoSummary;
  confirmed: number;
  hoursLeft: number;
}

/** A coach's ISOs inside 24h with fewer than 2 confirmed players. An ISO never runs as a one-on-one. */
export async function getShortTables(coachId: string): Promise<ShortTable[]> {
  return (await getCoachIsos(coachId)).flatMap((iso) => {
    const hoursLeft = hoursUntil(iso.startsAt);
    return iso.seatsTaken < rules.minSeats && hoursLeft > 0 && hoursLeft <= 24 ? [{ iso, confirmed: iso.seatsTaken, hoursLeft }] : [];
  });
}

/** Same local time, `days` later. */
function shiftDays(at: string, days: number): string {
  const d = new Date(at);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${at.slice(11)}`;
}

/** Move an ISO by whole days, same time and spot. Fails if that slot is full. */
export async function moveIso(isoId: string, days: number): Promise<IsoSummary> {
  const iso = db.isos.find((i) => i.id === isoId);
  if (!iso) throw new DataError(`Unknown ISO ${isoId}`);
  const startsAt = shiftDays(iso.startsAt, days);
  const endsAt = shiftDays(iso.endsAt, days);
  if (bookedAt(iso.venueId, startsAt, endsAt, iso.id).length >= venueOrThrow(iso.venueId).maxTables) {
    throw new DataError('That spot is full then. Try another day.');
  }
  iso.startsAt = startsAt;
  iso.endsAt = endsAt;
  return getIso(isoId);
}

/** Whether moving an ISO by `days` lands on an open table. */
export async function canMoveIso(isoId: string, days: number): Promise<boolean> {
  const iso = isoRecord(isoId);
  return bookedAt(iso.venueId, shiftDays(iso.startsAt, days), shiftDays(iso.endsAt, days), iso.id).length < venueOrThrow(iso.venueId).maxTables;
}

/** Coach cancels a short table. No penalty for anyone: holds are released. */
export async function cancelShortIso(isoId: string): Promise<void> {
  const iso = db.isos.find((i) => i.id === isoId);
  if (!iso) throw new DataError(`Unknown ISO ${isoId}`);
  iso.status = 'cancelled';
  db.seats
    .filter((s) => s.isoId === isoId && s.status !== 'cancelled')
    .forEach((s) => {
      s.status = 'cancelled';
      s.checkinCode = undefined;
    });
}

// ---------------------------------------------------------------- coach cohorts

export interface CohortInfo {
  name: string;
  opensOn: string;
  spotsPerPathway: number;
  spotsLeft: Record<PathwayId, number>;
  waitlistPosition: number;
}

export async function getCohortInfo(): Promise<CohortInfo> {
  const { name, opensOn, spotsPerPathway } = db.nextCohort;
  const spotsLeft = Object.fromEntries(db.pathways.map((p) => [p.id, Math.max(0, spotsPerPathway - (db.cohortTaken[p.id] ?? 0))])) as Record<PathwayId, number>;
  return { name, opensOn, spotsPerPathway, spotsLeft, waitlistPosition: db.waitlistPosition };
}

export interface CoachNeed {
  pathway: PathwayId;
  areaName: string;
  openSeats: number;
  needed: boolean;
}

/** Pathway + area pairs from upcoming ISOs. Needed when there's one open seat or fewer across them. */
export async function getCoachNeeds(): Promise<CoachNeed[]> {
  const groups = new Map<string, CoachNeed>();
  for (const iso of await getIsos()) {
    const key = `${iso.pathway}|${iso.areaName}`;
    const g = groups.get(key) ?? { pathway: iso.pathway, areaName: iso.areaName, openSeats: 0, needed: false };
    g.openSeats += iso.seatsOpen;
    groups.set(key, g);
  }
  const order = db.pathways.map((p) => p.id);
  return [...groups.values()]
    .map((g) => ({ ...g, needed: g.openSeats <= 1 }))
    .sort((a, b) => Number(b.needed) - Number(a.needed) || order.indexOf(a.pathway) - order.indexOf(b.pathway));
}

/** The latest application, if any. */
export async function getApplication(): Promise<CoachApplication | null> {
  return db.applications[db.applications.length - 1] ?? null;
}

/** "Your path in": the board's reason and the Play First tracker (ISOs attended in the pathway). */
export async function getPathIn(): Promise<{ category: string; note: string; needed: number; attended: number; pathway: PathwayId }> {
  const pathway = db.applications[db.applications.length - 1]?.pathway ?? db.me.pathway;
  const { category, note, playFirstIsos, decidedAt } = db.pathInReason;
  const attended = db.pastIsos.filter((p) => p.pathway === pathway && p.status === 'checked_in' && p.date > decidedAt).length;
  return { category, note, needed: playFirstIsos, attended: Math.min(playFirstIsos, attended), pathway };
}

/** Ask the board to review the application for a specific area that needs coaches. */
export async function requestAreaReview(areaName: string): Promise<string[]> {
  db.reviewAreaRequests.add(areaName);
  return [...db.reviewAreaRequests];
}

export async function getAreaReviewRequests(): Promise<string[]> {
  return [...db.reviewAreaRequests];
}

/** A rookie card for an approved applicant, built from their application. */
export async function getCoachPreview(): Promise<Coach> {
  const fromDraft = await getCoachCardPreview();
  if (fromDraft) return fromDraft;
  const app = db.applications[db.applications.length - 1];
  const pathway = app?.pathway ?? db.me.pathway;
  const first = db.me.name.split(/\s+/)[0];
  return {
    id: 'preview',
    name: db.me.name,
    firstName: first,
    initials: db.me.initials,
    pathway,
    subtitle: `${app?.currentRole.trim() || 'New coach'} · ${db.me.city}`,
    credentials: [
      { value: `0 of ${rules.rookieIsos}`, label: 'Rookie ISOs' },
      { value: db.nextCohort.name, label: 'Cohort' },
      { value: 'Bronze', label: 'ISO tier', highlight: true },
    ],
    tags: [app?.hostArea.trim() ? `Hosts in ${app.hostArea.trim()}` : `Hosts in ${db.me.city}`, `${db.nextCohort.name} coach`],
    cohort: db.nextCohort.name,
    overall: 60,
    tier: 'Bronze',
    isosHosted: 0,
    playersMet: 0,
    rating: 0,
    showUpRate: 0,
    eventsCoHosted: 0,
    followers: 0,
  };
}

export { DataError };
