export type MembershipPlan = 'walk-on' | 'locker-room' | 'varsity';
export type UserGender = 'male' | 'female';
export type AssessedLevel = 'freshman' | 'jv' | 'varsity' | 'd1' | 'professional';

export interface DemoUser {
  email: string;
  roles?: string[];
  gender?: UserGender;
}

export function getUserGender(): UserGender | null {
  try {
    const saved = localStorage.getItem('iso_demo_user');
    if (!saved) return null;
    const user = JSON.parse(saved) as DemoUser;
    return user.gender === 'male' || user.gender === 'female' ? user.gender : null;
  } catch {
    return null;
  }
}

export function getUserPlan(): MembershipPlan {
  try {
    const saved = localStorage.getItem('iso_demo_plan');
    if (saved === 'locker-room' || saved === 'varsity' || saved === 'walk-on') {
      return saved;
    }
  } catch {}
  return 'walk-on';
}

export function setUserPlan(plan: MembershipPlan) {
  localStorage.setItem('iso_demo_plan', plan);
}

export function saveUserGender(gender: UserGender) {
  try {
    const saved = localStorage.getItem('iso_demo_user');
    const user = saved ? (JSON.parse(saved) as DemoUser) : { email: '', roles: [] };
    user.gender = gender;
    localStorage.setItem('iso_demo_user', JSON.stringify(user));
  } catch {}
}

export function filterByGender<T extends { gender: UserGender }>(
  items: T[],
  playerGender: UserGender | null,
): T[] {
  if (!playerGender) return [];
  return items.filter(item => item.gender === playerGender);
}

export function usesExplorerPortal(plan: MembershipPlan): boolean {
  return plan === 'walk-on' || plan === 'locker-room';
}

export function canAccessOnlineStore(plan: MembershipPlan): boolean {
  return plan === 'locker-room' || plan === 'varsity';
}

export function canAccessLockerRoomChat(plan: MembershipPlan): boolean {
  return plan === 'locker-room' || plan === 'varsity';
}

export function getAssessedLevel(): AssessedLevel {
  try {
    const saved = localStorage.getItem('iso_assessed_level');
    if (saved === 'freshman' || saved === 'jv' || saved === 'varsity' || saved === 'd1' || saved === 'professional') {
      return saved;
    }
  } catch {}
  return 'jv';
}

export function setAssessedLevel(level: AssessedLevel) {
  localStorage.setItem('iso_assessed_level', level);
}

export const PLAN_LABELS: Record<MembershipPlan, string> = {
  'walk-on': 'Walk-On',
  'locker-room': 'Locker Room',
  varsity: 'Varsity Program',
};

export const LEVEL_LABELS: Record<AssessedLevel, string> = {
  freshman: 'Freshman',
  jv: 'JV',
  varsity: 'Varsity',
  d1: 'D1',
  professional: 'Pro',
};

// ─── PATHWAY LOCKING ─────────────────────────────────────────────────────────

export interface PathwayChangeRequest {
  currentPathway: string;
  requestedPathway: string;
  justification: string;
  status: 'pending' | 'approved' | 'denied';
  submittedAt: string;
}

export function isPathwayLocked(plan: MembershipPlan): boolean {
  return plan === 'locker-room' || plan === 'varsity';
}

/** Walk-On exploratory pathway — changes freely */
export function getExploringPathway(): string {
  try {
    return localStorage.getItem('iso_exploring_pathway')
      || localStorage.getItem('iso_selected_pathway')
      || '';
  } catch {
    return '';
  }
}

export function setExploringPathway(pathwayId: string) {
  localStorage.setItem('iso_exploring_pathway', pathwayId);
  localStorage.setItem('iso_selected_pathway', pathwayId);
}

/** Locker Room / Varsity committed pathway — frozen until advisory approval */
export function getLockedPathway(): string | null {
  try {
    const locked = localStorage.getItem('iso_locked_pathway');
    return locked || null;
  } catch {
    return null;
  }
}

export function lockPathway(pathwayId: string) {
  localStorage.setItem('iso_locked_pathway', pathwayId);
  localStorage.setItem('iso_selected_pathway', pathwayId);
}

export function getActivePathway(plan: MembershipPlan): string {
  if (isPathwayLocked(plan)) {
    return getLockedPathway() || getExploringPathway() || '';
  }
  return getExploringPathway();
}

export function getPathwayChangeRequest(): PathwayChangeRequest | null {
  try {
    const saved = localStorage.getItem('iso_pathway_change_request');
    if (!saved) return null;
    return JSON.parse(saved) as PathwayChangeRequest;
  } catch {
    return null;
  }
}

export function submitPathwayChangeRequest(
  currentPathway: string,
  requestedPathway: string,
  justification: string,
): PathwayChangeRequest {
  const req: PathwayChangeRequest = {
    currentPathway,
    requestedPathway,
    justification,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };
  localStorage.setItem('iso_pathway_change_request', JSON.stringify(req));
  return req;
}

/** Demo helper — advisory board approves request */
export function approvePathwayChangeRequest(): boolean {
  const req = getPathwayChangeRequest();
  if (!req || req.status !== 'pending') return false;
  lockPathway(req.requestedPathway);
  localStorage.setItem('iso_pathway_change_request', JSON.stringify({ ...req, status: 'approved' }));
  return true;
}

export function clearPathwayChangeRequest() {
  localStorage.removeItem('iso_pathway_change_request');
}
