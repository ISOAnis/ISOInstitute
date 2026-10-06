/**
 * Domain types: the contract between screens and the data layer.
 * Shapes follow the Supabase model in docs 2/ISO_BUILD_SPEC.md §5 so the
 * mock implementation can be swapped for real queries without touching screens.
 */

export type PathwayId = 'founder' | 'builder' | 'healer' | 'reformer' | 'warrior' | 'seeker';

export type Mode = 'player' | 'coach';

/** A bundled asset (mocks) or a remote image (backend). */
export type Photo = number | { uri: string };

export interface Pathway {
  id: PathwayId;
  name: string;
  field: string;
}

export type CoachTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface Credential {
  value: string;
  label: string;
  /** Renders the value in gold (used for the ISO tier box). */
  highlight?: boolean;
}

export interface Coach {
  id: string;
  name: string;
  firstName: string;
  initials: string;
  pathway: PathwayId;
  subtitle: string;
  credentials: [Credential, Credential, Credential];
  tags: string[];
  photo?: Photo;
  overall: number;
  tier: CoachTier;
  isosHosted: number;
  playersMet: number;
  rating: number;
  showUpRate: number;
  eventsCoHosted: number;
  followers: number;
}

export interface CoachPost {
  id: string;
  coachId: string;
  body: string;
  createdAt: string;
  reactions: number;
}

export type VenueType = 'cafe' | 'coworking' | 'library' | 'gym' | 'restaurant';

export interface Venue {
  id: string;
  name: string;
  areaName: string;
  lat: number;
  lng: number;
  type: VenueType;
  isPartner: boolean;
  notes: string;
  /** Venue picker badge for coaches ("CLOSEST TO YOU", "FREE"). */
  badge?: string;
  /** Distance from the signed-in coach, for "closest first" sorting. */
  distanceMi?: number;
  photo?: Photo;
}

export interface CoachMonth {
  coachId: string;
  overallDelta: number;
  isosHosted: number;
  playersMet: number;
  showUpRate: number;
  newFollowers: number;
  nextTier: CoachTier;
  nextTierAt: number;
  nextTierNote: string;
}

export interface AdvisoryNote {
  coachId: string;
  body: string;
  eventId?: string;
}

export interface Regular {
  coachId: string;
  playerId: string;
  name: string;
  initials: string;
  pathway: PathwayId;
  rank: RankLevel;
  isosWithCoach: number;
}

export interface PastIso {
  id: string;
  title: string;
  pathway: PathwayId;
  coachInitials: string;
  date: string;
  status: 'checked_in' | 'no_show' | 'cancelled';
}

export interface LockerItem {
  id: string;
  name: string;
  status: 'owned' | 'unlocked' | 'locked';
  note: string;
}

export interface NewIsoInput {
  title: string;
  venueId: string;
  /** Local date, e.g. 2026-10-06. */
  date: string;
  /** 24h local times, e.g. "12:00". */
  start: string;
  end: string;
  seats: number;
  approveRequests: boolean;
  revealSpot24h: boolean;
}

export interface CoachApplication {
  pathway: PathwayId;
  currentRole: string;
  story: string;
  hostArea: string;
  link: string;
}

export interface CoachRequest extends Seat {
  iso: IsoSummary;
}

export interface CoachFeedback {
  id: string;
  coachId: string;
  quote: string;
  fromLabel: string;
  rating: number;
}

export interface Recommendation {
  isoId: string;
  match: number;
  reasons: string[];
}

export type IsoStatus = 'live' | 'full' | 'started' | 'done' | 'cancelled';

export interface Iso {
  id: string;
  coachId: string;
  venueId: string;
  pathway: PathwayId;
  title: string;
  topics: string[];
  startsAt: string;
  endsAt: string;
  seats: number;
  approveRequests: boolean;
  revealSpot24h: boolean;
  /** Circle center shown before confirmation, offset ~1 mi from the venue. */
  displayLat: number;
  displayLng: number;
  status: IsoStatus;
  /** Where to find the coach once you're in (shown in the Huddle). */
  findMe?: string;
}

export type SeatStatus = 'requested' | 'confirmed' | 'declined' | 'cancelled' | 'checked_in' | 'no_show';

export interface Seat {
  isoId: string;
  playerId: string;
  playerName: string;
  playerInitials: string;
  playerPathway: PathwayId;
  playerRank: RankLevel;
  /** True when the player is a coach in player mode (never gets priority). */
  isCoach: boolean;
  status: SeatStatus;
  checkinCode?: string;
  note?: string;
  cancelReason?: CancelReason;
  cancelNote?: string;
}

export type CancelReason = 'Sick' | 'Work' | 'Family' | 'Emergency' | 'Other';

export interface HuddleMessage {
  id: string;
  isoId: string;
  userId: string;
  body: string;
  pinned: boolean;
  photoUrl?: string;
  createdAt: string;
}

export interface IsoEvent {
  id: string;
  pathway: PathwayId;
  title: string;
  description: string;
  /** Short date label while dates are TBD ("DEC", "TBA"). */
  monthLabel: string;
  startsAt?: string;
  venueLabel: string;
  ticketLabel: string;
  prize?: string;
  sponsor?: string;
  featured: boolean;
}

export type RankLevel = 'Freshman' | 'JV' | 'Varsity' | 'D1' | 'Pro' | 'Hall of Fame';

export interface Rank {
  level: RankLevel;
  minIsos: number;
  unlock: string;
}

export interface Player {
  id: string;
  name: string;
  initials: string;
  phone: string;
  city: string;
  birthday: string;
  pathway: PathwayId;
  pathwaySwitchesThisMonth: number;
  coachStatus: 'none' | 'applied' | 'approved' | 'paused';
  /** Coach profile tied to this account once approved. */
  coachId?: string;
  appliedAt?: string;
  matchAnswers: string[];
  /** Checked-in ISO count per pathway. Switching keeps old progress. */
  rankProgress: Partial<Record<PathwayId, number>>;
  coachesMet: number;
  eventsAttended: number;
  lateCancelsUsedThisMonth: number;
}

/** View model for an ISO with its coach, venue (if revealed) and seat counts resolved. */
export interface IsoSummary extends Iso {
  coach: Coach;
  areaName: string;
  seatsTaken: number;
  seatsOpen: number;
}
