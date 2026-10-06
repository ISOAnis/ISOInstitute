/**
 * The data layer. Screens call these functions and nothing else.
 * Every function is async so a real backend can replace the mock db
 * without changing call sites.
 */
import { hoursUntil, now } from './clock';
import { db, DEMO_COACH_ID, rules } from './db';
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
      return db.recommendations.flatMap((r) => {
        const iso = upcoming.find((i) => i.id === r.isoId);
        return iso ? [{ ...iso, recommendation: r }] : [];
      });
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

/** Seats and requests for an ISO, priority order: pathway players, other players, coaches. */
export async function getSeats(isoId: string): Promise<Seat[]> {
  const iso = isoRecord(isoId);
  const priority = (s: Seat) => (s.isCoach ? 2 : s.playerPathway === iso.pathway ? 0 : 1);
  return db.seats.filter((s) => s.isoId === isoId).sort((a, b) => priority(a) - priority(b));
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
 * Switch pathways (max 2 per month). The old pathway's count is kept.
 * The first pick during onboarding doesn't count as a switch.
 */
export async function setPathway(pathway: PathwayId, opts: { initial?: boolean } = {}): Promise<Player> {
  if (pathway === db.me.pathway) return getMe();
  if (opts.initial) {
    db.me.pathway = pathway;
    return getMe();
  }
  if (db.me.pathwaySwitchesThisMonth >= rules.maxPathwaySwitchesPerMonth) {
    throw new DataError('You’ve used both pathway switches this month.');
  }
  db.me.pathway = pathway;
  db.me.pathwaySwitchesThisMonth += 1;
  return getMe();
}

export async function saveMatchAnswers(answers: string[]): Promise<Player> {
  db.me.matchAnswers = answers;
  return getMe();
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

/** The coach plus confirmed players. Only they can read the Huddle. */
export async function getHuddleMembers(isoId: string): Promise<HuddleMember[]> {
  const iso = isoRecord(isoId);
  const coach = coachOrThrow(iso.coachId);
  const players = db.seats
    .filter((s) => s.isoId === isoId && holdsSeat(s))
    .map((s) => ({
      id: s.playerId,
      name: s.playerId === db.me.id ? 'You' : s.playerName.split(' ')[0],
      initials: s.playerInitials,
      isCoach: false,
      isMe: s.playerId === db.me.id,
    }));
  return [{ id: coach.id, name: coach.firstName, initials: coach.initials, isCoach: true, isMe: false }, ...players];
}

// ---------------------------------------------------------------- coach side

export async function submitCoachApplication(app: CoachApplication): Promise<Player> {
  db.applications.push(app);
  db.me.coachStatus = 'applied';
  db.me.appliedAt = now().toISOString().slice(0, 19);
  return getMe();
}

/** Prototype only: stands in for the advisory board approving the application. */
export async function approveCoachForDemo(): Promise<Player> {
  db.me.coachStatus = 'approved';
  db.me.coachId = DEMO_COACH_ID;
  return getMe();
}

export async function getMyCoach(): Promise<Coach | null> {
  return db.me.coachId ? coachOrThrow(db.me.coachId) : null;
}

/** Pending "I got next" requests across a coach's ISOs, in priority order. */
export async function getCoachRequests(coachId: string): Promise<CoachRequest[]> {
  const mine = await getCoachIsos(coachId);
  const out: CoachRequest[] = [];
  for (const iso of mine) {
    const seats = (await getSeats(iso.id)).filter((s) => s.status === 'requested');
    out.push(...seats.map((s) => ({ ...s, iso })));
  }
  return out;
}

/** Confirmed and checked-in players for check-in at the table. */
export async function getTable(isoId: string): Promise<Seat[]> {
  return (await getSeats(isoId)).filter(holdsSeat);
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

/** Partner venues near the coach, closest first. */
export async function getCoachVenues(): Promise<Venue[]> {
  return db.venues.filter((v) => v.isPartner && v.distanceMi !== undefined).sort((a, b) => (a.distanceMi ?? 0) - (b.distanceMi ?? 0));
}

/** Coach drops a pin. Only approved coaches can create ISOs. */
export async function createIso(input: NewIsoInput): Promise<IsoSummary> {
  const coach = await getMyCoach();
  if (!coach || db.me.coachStatus !== 'approved') throw new DataError('Only approved coaches can drop a pin.');
  const title = input.title.trim();
  if (!title) throw new DataError('Give your ISO a topic.');
  if (input.end <= input.start) throw new DataError('End time has to be after the start.');
  venueOrThrow(input.venueId);

  const id = `iso-${coach.id}-${Date.now()}`;
  db.isos.push({
    id,
    coachId: coach.id,
    venueId: input.venueId,
    pathway: coach.pathway,
    title,
    topics: [],
    startsAt: `${input.date}T${input.start}:00`,
    endsAt: `${input.date}T${input.end}:00`,
    seats: Math.min(6, Math.max(1, input.seats)),
    approveRequests: input.approveRequests,
    revealSpot24h: input.revealSpot24h,
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

export { DataError };
