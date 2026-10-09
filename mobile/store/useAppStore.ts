import { create } from 'zustand';

import * as api from '@/data';
import type {
  CancelReason,
  CheckInResult,
  CoachBackground,
  CoachBasics,
  CoachExtras,
  CoachHosting,
  CoachPath,
  CoachWhy,
  IdCheck,
  IdCheckInput,
  IsoSummary,
  MatchPrefs,
  MatchProfile,
  MatchSection,
  Mode,
  NewIsoInput,
  PathwayId,
  Player,
  ProfileOwner,
  Seat,
  SeatStatus,
} from '@/data';

export interface MySeat {
  status: SeatStatus;
  checkinCode?: string;
}

/** How long the mock coach takes to approve a request in the prototype. */
const DEMO_APPROVAL_MS = 2200;

interface AppState {
  ready: boolean;
  onboarded: boolean;
  mode: Mode;
  pathway: PathwayId;
  switchesLeft: number;
  lateCancelsLeft: number;
  coachStatus: Player['coachStatus'];
  coachId?: string;
  follows: string[];
  rsvps: string[];
  seats: Record<string, MySeat>;
  /** Bumps after every write so screens can refetch derived data. */
  revision: number;
  /** Show the coach tab tour on the next visit to the coach side. Set once, right after approval. */
  coachTour: boolean;
  setCoachTour: (on: boolean) => void;

  hydrate: () => Promise<void>;
  completeOnboarding: () => void;
  /** Signs into the app in one update, so the gate can't send a coach to the player map in between. */
  enterApp: (mode: Mode) => void;
  logOut: () => void;
  setMode: (mode: Mode) => void;
  choosePathway: (pathway: PathwayId, opts?: { initial?: boolean }) => Promise<void>;
  saveAnswers: (answers: string[]) => Promise<void>;
  toggleFollow: (coachId: string) => Promise<void>;
  toggleRsvp: (eventId: string) => Promise<void>;
  gotNext: (isoId: string) => Promise<MySeat>;
  confirmSeat: (isoId: string, playerId: string) => Promise<Seat>;
  declineSeat: (isoId: string, playerId: string) => Promise<Seat>;
  giveUpSeat: (isoId: string, reason?: CancelReason, note?: string) => Promise<api.CancelResult>;
  checkIn: (isoId: string, code: string) => Promise<CheckInResult>;
  saveCoachBasics: (basics: CoachBasics) => Promise<void>;
  saveCoachPath: (path: CoachPath) => Promise<void>;
  saveCoachBackground: (background: CoachBackground) => Promise<void>;
  saveCoachWhy: (why: CoachWhy) => Promise<void>;
  saveCoachTopics: (topics: string[]) => Promise<void>;
  saveCoachHosting: (hosting: CoachHosting) => Promise<void>;
  agreeCoachGuidelines: () => Promise<void>;
  verifyCoachId: (input: IdCheckInput) => Promise<IdCheck>;
  saveCoachExtras: (extras: CoachExtras) => Promise<void>;
  submitCoachApplication: () => Promise<void>;
  approveCoachDemo: () => Promise<void>;
  dropPin: (input: NewIsoInput) => Promise<IsoSummary>;
  moveIso: (isoId: string, days: number) => Promise<IsoSummary>;
  cancelShortIso: (isoId: string) => Promise<void>;
  requestAreaReview: (areaName: string) => Promise<void>;
  updateBasics: (input: { name: string; neighborhood: string; stage: string }) => Promise<void>;
  saveMatchSection: (who: ProfileOwner, section: MatchSection, patch: Partial<MatchProfile>) => Promise<void>;
  clearMatchSection: (who: ProfileOwner, section: MatchSection | 'all') => Promise<void>;
  setMatchPrefs: (patch: Partial<MatchPrefs>) => Promise<void>;
}

const toMySeat = (s: Seat): MySeat => ({ status: s.status, checkinCode: s.checkinCode });

export const useAppStore = create<AppState>((set, get) => {
  const bump = () => set((s) => ({ revision: s.revision + 1 }));

  const syncMe = async () => {
    const [me, rules] = await Promise.all([api.getMe(), api.getRules()]);
    set({
      pathway: me.pathway,
      coachStatus: me.coachStatus,
      coachId: me.coachId,
      switchesLeft: Math.max(0, rules.maxPathwaySwitchesPerMonth - me.pathwaySwitchesThisMonth),
      lateCancelsLeft: Math.max(0, rules.freeLateCancelsPerMonth - me.lateCancelsUsedThisMonth),
    });
  };

  const syncSeat = async (isoId: string) => {
    const seat = await api.getMySeat(isoId);
    set((s) => {
      const seats = { ...s.seats };
      if (seat) seats[isoId] = toMySeat(seat);
      else delete seats[isoId];
      return { seats };
    });
  };

  return {
    ready: false,
    onboarded: false,
    mode: 'player',
    pathway: 'builder',
    switchesLeft: 0,
    lateCancelsLeft: 0,
    coachStatus: 'none',
    follows: [],
    rsvps: [],
    seats: {},
    revision: 0,
    coachTour: false,
    setCoachTour: (coachTour) => set({ coachTour }),

    hydrate: async () => {
      const [follows, rsvps, isos] = await Promise.all([api.getFollows(), api.getRsvps(), api.getIsos()]);
      const mine = await Promise.all(isos.map((i) => api.getMySeat(i.id)));
      const seats: Record<string, MySeat> = {};
      mine.forEach((s) => s && (seats[s.isoId] = toMySeat(s)));
      await api.restoreCoachApplication();
      await syncMe();
      set({ follows, rsvps, seats, ready: true });
    },

    completeOnboarding: () => set({ onboarded: true }),
    enterApp: (mode) => set({ onboarded: true, mode }),
    logOut: () => set({ onboarded: false, mode: 'player' }),

    setMode: (mode) => set({ mode }),

    choosePathway: async (pathway, opts) => {
      await api.setPathway(pathway, opts);
      await syncMe();
      bump();
    },

    saveAnswers: async (answers) => {
      await api.saveMatchAnswers(answers);
    },

    toggleFollow: async (coachId) => {
      const follows = await api.setFollow(coachId, !get().follows.includes(coachId));
      set({ follows });
      bump();
    },

    toggleRsvp: async (eventId) => {
      const rsvps = await api.setRsvp(eventId, !get().rsvps.includes(eventId));
      set({ rsvps });
    },

    gotNext: async (isoId) => {
      const seat = await api.requestSeat(isoId);
      await syncSeat(isoId);
      bump();
      if (seat.status === 'requested') {
        setTimeout(async () => {
          if (get().seats[isoId]?.status !== 'requested') return;
          try {
            await get().confirmSeat(isoId, seat.playerId);
          } catch {
            // Seat filled up before the mock coach got to it; the request stays pending.
          }
        }, DEMO_APPROVAL_MS);
      }
      return toMySeat(seat);
    },

    confirmSeat: async (isoId, playerId) => {
      const seat = await api.confirmSeat(isoId, playerId);
      await syncSeat(isoId);
      bump();
      return seat;
    },

    declineSeat: async (isoId, playerId) => {
      const seat = await api.declineSeat(isoId, playerId);
      await syncSeat(isoId);
      bump();
      return seat;
    },

    giveUpSeat: async (isoId, reason, note) => {
      const result = await api.cancelSeat(isoId, { reason, note });
      await Promise.all([syncSeat(isoId), syncMe()]);
      bump();
      return result;
    },

    checkIn: async (isoId, code) => {
      const result = await api.checkInCode(isoId, code);
      await syncSeat(isoId);
      bump();
      return result;
    },

    saveCoachBasics: async (basics) => {
      await api.saveCoachBasics(basics);
      bump();
    },

    saveCoachPath: async (path) => {
      await api.saveCoachPath(path);
      bump();
    },

    saveCoachBackground: async (background) => {
      await api.saveCoachBackground(background);
      bump();
    },

    saveCoachWhy: async (why) => {
      await api.saveCoachWhy(why);
      bump();
    },

    saveCoachTopics: async (topics) => {
      await api.saveCoachTopics(topics);
      bump();
    },

    saveCoachHosting: async (hosting) => {
      await api.saveCoachHosting(hosting);
      bump();
    },

    agreeCoachGuidelines: async () => {
      await api.agreeCoachGuidelines();
      bump();
    },

    verifyCoachId: async (input) => {
      const check = await api.verifyCoachId(input);
      bump();
      return check;
    },

    saveCoachExtras: async (extras) => {
      await api.saveCoachExtras(extras);
      bump();
    },

    submitCoachApplication: async () => {
      await api.submitCoachDraft();
      await syncMe();
      bump();
    },

    approveCoachDemo: async () => {
      await api.approveCoachForDemo();
      await syncMe();
      bump();
    },

    dropPin: async (input) => {
      const iso = await api.createIso(input);
      bump();
      return iso;
    },

    moveIso: async (isoId, days) => {
      const iso = await api.moveIso(isoId, days);
      bump();
      return iso;
    },

    cancelShortIso: async (isoId) => {
      await api.cancelShortIso(isoId);
      await syncSeat(isoId);
      bump();
    },

    requestAreaReview: async (areaName) => {
      await api.requestAreaReview(areaName);
      bump();
    },

    updateBasics: async (input) => {
      await api.updateBasics(input);
      bump();
    },

    saveMatchSection: async (who, section, patch) => {
      await api.saveMatchSection(who, section, patch);
      bump();
    },

    clearMatchSection: async (who, section) => {
      await api.clearMatchSection(who, section);
      bump();
    },

    setMatchPrefs: async (patch) => {
      await api.setMatchPrefs(patch);
      bump();
    },
  };
});

/** Current pathway, for screens that theme themselves to the player. */
export const usePathway = () => useAppStore((s) => s.pathway);
