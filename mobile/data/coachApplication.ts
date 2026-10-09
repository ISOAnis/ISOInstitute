import AsyncStorage from '@react-native-async-storage/async-storage';

import { now } from './clock';
import { db, rules } from './db';
import { verifyIdentity, type IdCheckInput } from './idVerification';
import { MAX_TAGS } from './tags';
import type {
  Availability,
  Coach,
  CoachApplicationDraft,
  CoachApplyStep,
  CoachBackground,
  CoachBasics,
  CoachExtras,
  CoachHosting,
  CoachPath,
  CoachWhy,
  HostFrequency,
  IdCheck,
  PathwayId,
} from './types';

const KEY = 'iso.coachApplication.v1';

/** Every step and roughly how long it takes. Adds up to about 10 minutes. */
export const COACH_APPLY_STEPS: { id: CoachApplyStep; title: string; minutes: number }[] = [
  { id: 'basics', title: 'The basics', minutes: 1 },
  { id: 'path', title: 'Your path', minutes: 1 },
  { id: 'experience', title: 'Your experience', minutes: 1.5 },
  { id: 'why', title: 'Why you coach', minutes: 1.5 },
  { id: 'topics', title: 'What you’re open to talking about', minutes: 1 },
  { id: 'hosting', title: 'When and where', minutes: 1 },
  { id: 'guidelines', title: 'Community guidelines', minutes: 0.5 },
  { id: 'verify', title: 'Verify your ID', minutes: 1.5 },
  { id: 'extras', title: 'Almost done', minutes: 0.5 },
  { id: 'review', title: 'Review and submit', minutes: 0.5 },
];

/** Whole minutes left, counting the given step. With no step, the full application. */
export function coachApplyMinutesLeft(step?: CoachApplyStep): number {
  const from = step ? COACH_APPLY_STEPS.findIndex((s) => s.id === step) : 0;
  const left = COACH_APPLY_STEPS.slice(Math.max(0, from)).reduce((sum, s) => sum + s.minutes, 0);
  return Math.max(1, Math.ceil(left));
}

const emptyDraft = (): CoachApplicationDraft => ({ saved: [] });

async function readDraft(): Promise<CoachApplicationDraft> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? { ...emptyDraft(), ...(JSON.parse(raw) as CoachApplicationDraft) } : emptyDraft();
  } catch {
    return emptyDraft();
  }
}

async function writeDraft(draft: CoachApplicationDraft): Promise<CoachApplicationDraft> {
  const next = { ...draft, updatedAt: now().toISOString().slice(0, 19) };
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

const markSaved = (draft: CoachApplicationDraft, step: CoachApplyStep): CoachApplyStep[] => (draft.saved.includes(step) ? draft.saved : [...draft.saved, step]);

export async function getCoachDraft(): Promise<CoachApplicationDraft> {
  return readDraft();
}

/** The first step not saved yet, or review once everything is. */
export async function getCoachResumeStep(): Promise<CoachApplyStep | null> {
  const { saved } = await readDraft();
  if (!saved.length) return null;
  return COACH_APPLY_STEPS.find((s) => !saved.includes(s.id))?.id ?? 'review';
}

/** Saved basics, or what the account already knows. */
export async function getCoachBasics(): Promise<CoachBasics> {
  const { basics } = await readDraft();
  if (basics) return basics;
  const me = db.me;
  return {
    fullName: me.name === '[Your name]' ? '' : me.name,
    email: '',
    phone: me.phone,
    city: me.city || 'Denver',
    neighborhood: me.neighborhood,
  };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** First problem with the basics, or null when they're ready to save. */
export function checkCoachBasics(b: CoachBasics): string | null {
  if (b.fullName.trim().split(/\s+/).length < 2) return 'Add your first and last name.';
  if (!b.photoUri) return 'Add a photo for your coach card.';
  if (!EMAIL.test(b.email.trim())) return 'Add an email we can reach you at.';
  if (b.phone.replace(/\D/g, '').length < 10) return 'Add a phone number we can verify.';
  if (!b.city.trim()) return 'Add your city.';
  if (!b.neighborhood) return 'Pick your neighborhood.';
  return null;
}

export async function saveCoachBasics(input: CoachBasics): Promise<CoachApplicationDraft> {
  const problem = checkCoachBasics(input);
  if (problem) throw new Error(problem);
  const basics: CoachBasics = {
    ...input,
    fullName: input.fullName.trim().replace(/\s+/g, ' '),
    email: input.email.trim().toLowerCase(),
    city: input.city.trim(),
  };
  const draft = await readDraft();
  const saved = markSaved(draft, 'basics');

  db.me.name = basics.fullName;
  db.me.initials = basics.fullName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  db.me.phone = basics.phone;
  db.me.city = basics.city;
  db.me.neighborhood = basics.neighborhood;

  return writeDraft({ ...draft, basics, saved });
}
export async function getCoachPath(): Promise<CoachPath> {
  const { path } = await readDraft();
  return path ?? { role: '', organization: '' };
}

export function checkCoachPath(p: CoachPath): string | null {
  if (!p.pathway) return 'Pick the pathway you’ll coach.';
  if (!p.role.trim()) return 'Add your current role or title.';
  if (!p.organization.trim()) return 'Add where you work, or Self-employed.';
  return null;
}

export async function saveCoachPath(input: CoachPath): Promise<CoachApplicationDraft> {
  const problem = checkCoachPath(input);
  if (problem) throw new Error(problem);
  const path: CoachPath = { pathway: input.pathway, role: input.role.trim(), organization: input.organization.trim() };
  const draft = await readDraft();
  return writeDraft({ ...draft, path, saved: markSaved(draft, 'path') });
}

export const MAX_EXPERIENCE = 3;
export const MAX_SKILLS = 8;

/** Skill ideas for the chip picker. Coaches can add their own too. */
export const SKILL_SUGGESTIONS: Record<PathwayId | 'general', string[]> = {
  general: ['Leadership', 'Public speaking', 'Networking', 'Writing', 'Negotiation', 'Hiring'],
  founder: ['Sales', 'Marketing', 'Operations', 'Fundraising', 'Pricing', 'Product'],
  builder: ['Software engineering', 'Product design', 'Data', 'Cloud', 'Mobile apps', 'Technical interviews'],
  healer: ['Patient care', 'Clinical research', 'Med school admissions', 'Nursing', 'Public health'],
  reformer: ['Litigation', 'Legal research', 'Policy', 'Government', 'Advocacy'],
  warrior: ['Strength training', 'Nutrition', 'Personal training', 'Sports performance', 'Habit building'],
  seeker: ['Community building', 'Faith', 'Reflection', 'Counseling', 'Youth work'],
};

/** Saved background, or a first experience entry filled from step 2. */
export async function getCoachBackground(): Promise<CoachBackground> {
  const { background, path } = await readDraft();
  if (background) return background;
  return { experience: path ? [{ role: path.role, organization: path.organization, years: 0 }] : [], skills: [] };
}

export async function getCoachSkillSuggestions(): Promise<string[]> {
  const { path } = await readDraft();
  return [...(path?.pathway ? SKILL_SUGGESTIONS[path.pathway] : []), ...SKILL_SUGGESTIONS.general];
}

export function checkCoachBackground(b: CoachBackground): string | null {
  if (!b.experience.length) return 'Add at least one role.';
  for (const [i, e] of b.experience.entries()) {
    const which = b.experience.length > 1 ? ` for experience ${i + 1}` : '';
    if (!e.role.trim()) return `Add the role${which}.`;
    if (!e.organization.trim()) return `Add the organization${which}.`;
    if (!Number.isInteger(e.years) || e.years < 1 || e.years > 60) return `Add how many years${which}.`;
  }
  if (b.experience.length > MAX_EXPERIENCE) return `Keep it to ${MAX_EXPERIENCE} roles.`;
  if (b.education && !b.education.school.trim()) return 'Add the school, or skip education.';
  if (!b.skills.length) return 'Pick at least one skill.';
  if (b.skills.length > MAX_SKILLS) return `Keep it to ${MAX_SKILLS} skills.`;
  return null;
}

export async function saveCoachBackground(input: CoachBackground): Promise<CoachApplicationDraft> {
  const problem = checkCoachBackground(input);
  if (problem) throw new Error(problem);
  const school = input.education?.school.trim();
  const background: CoachBackground = {
    experience: input.experience.map((e) => ({ role: e.role.trim(), organization: e.organization.trim(), years: e.years })),
    education: school ? { school, field: input.education?.field.trim() ?? '' } : undefined,
    skills: input.skills,
  };
  const draft = await readDraft();
  return writeDraft({ ...draft, background, saved: markSaved(draft, 'experience') });
}

export const MIN_MOTIVATION = 20;
export const MAX_CARD_LINE = 80;

export async function getCoachWhy(): Promise<CoachWhy | null> {
  return (await readDraft()).why ?? null;
}

export function checkCoachWhy(w: CoachWhy): string | null {
  if (w.motivation.trim().length < MIN_MOTIVATION) return 'Tell us a little more about why you want to give back.';
  if (w.showCardLine && !w.cardLine.trim()) return 'Write your one line, or turn it off.';
  if (w.cardLine.trim().length > MAX_CARD_LINE) return `Keep your line under ${MAX_CARD_LINE} characters.`;
  return null;
}

export async function saveCoachWhy(input: CoachWhy): Promise<CoachApplicationDraft> {
  const problem = checkCoachWhy(input);
  if (problem) throw new Error(problem);
  const optional = (s?: string) => (s?.trim() ? s.trim() : undefined);
  const why: CoachWhy = {
    motivation: input.motivation.trim(),
    helpedBy: optional(input.helpedBy),
    wishKnewAt20: optional(input.wishKnewAt20),
    showCardLine: input.showCardLine,
    cardLine: input.showCardLine ? input.cardLine.trim() : '',
  };
  const draft = await readDraft();
  return writeDraft({ ...draft, why, saved: markSaved(draft, 'why') });
}

export const MAX_CUSTOM_TAG = 30;

export async function getCoachTopics(): Promise<{ topics: string[]; pathway?: PathwayId }> {
  const { topics, path } = await readDraft();
  return { topics: topics ?? [], pathway: path?.pathway };
}

export function checkCoachTopics(topics: string[]): string | null {
  if (!topics.length) return 'Pick at least one thing you’re open to talking about.';
  if (topics.length > MAX_TAGS) return `Keep it to ${MAX_TAGS}.`;
  if (topics.some((t) => t.length > MAX_CUSTOM_TAG)) return `Keep each one under ${MAX_CUSTOM_TAG} characters.`;
  return null;
}

export async function saveCoachTopics(topics: string[]): Promise<CoachApplicationDraft> {
  const problem = checkCoachTopics(topics);
  if (problem) throw new Error(problem);
  const draft = await readDraft();
  return writeDraft({ ...draft, topics, saved: markSaved(draft, 'topics') });
}

export const AVAILABILITY_OPTIONS: { id: Availability; label: string }[] = [
  { id: 'weekday-mornings', label: 'Weekday mornings' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'evenings', label: 'Evenings' },
  { id: 'weekends', label: 'Weekends' },
];

export const HOST_FREQUENCY_OPTIONS: { id: HostFrequency; label: string }[] = [
  { id: 'few-a-month', label: 'A few times a month' },
  { id: 'monthly', label: 'Once a month' },
  { id: 'when-i-can', label: 'When I can' },
];

/** Saved hosting, or their home neighborhood from step 1 to start from. */
export async function getCoachHosting(): Promise<CoachHosting> {
  const { hosting, basics } = await readDraft();
  return hosting ?? { areas: basics?.neighborhood ? [basics.neighborhood] : [], venueIds: [], availability: [] };
}

export function checkCoachHosting(h: CoachHosting): string | null {
  if (!h.areas.length && !h.venueIds.length) return 'Pick at least one neighborhood or partner spot.';
  if (!h.availability.length) return 'Pick when you’re usually free.';
  if (!h.frequency) return 'Pick how often you’d host.';
  if (!h.groupSize || h.groupSize < rules.minSeats || h.groupSize > rules.maxSeats) return 'Pick a group size.';
  return null;
}

export async function saveCoachHosting(input: CoachHosting): Promise<CoachApplicationDraft> {
  const problem = checkCoachHosting(input);
  if (problem) throw new Error(problem);
  const draft = await readDraft();
  return writeDraft({ ...draft, hosting: input, saved: markSaved(draft, 'hosting') });
}

export const COACH_GUIDELINES = [
  'I’ll only host at ISO partner spots.',
  'ISOs are always small groups, never one-on-one.',
  'No selling, recruiting, or pitching to players.',
  'I’ll show up when I say I will, or cancel early.',
  'ISO is for real conversations, not a long-term commitment.',
];

export async function getCoachGuidelinesAgreed(): Promise<boolean> {
  return !!(await readDraft()).guidelinesAgreedAt;
}

export async function agreeCoachGuidelines(): Promise<CoachApplicationDraft> {
  const draft = await readDraft();
  return writeDraft({ ...draft, guidelinesAgreedAt: now().toISOString().slice(0, 19), saved: markSaved(draft, 'guidelines') });
}

export async function getCoachIdCheck(): Promise<IdCheck | null> {
  return (await readDraft()).idCheck ?? null;
}

/** Sends both photos to the verification provider and keeps only the outcome. */
export async function verifyCoachId(input: IdCheckInput): Promise<IdCheck> {
  const check = await verifyIdentity(input);
  const draft = await readDraft();
  db.me.idCheck = check;
  await writeDraft({ ...draft, idCheck: check, saved: check.status === 'failed' ? draft.saved : markSaved(draft, 'verify') });
  return check;
}

export const HEARD_FROM_OPTIONS = ['A friend', 'A coach', 'Instagram', 'TikTok', 'An ISO event', 'Somewhere else'];

export async function getCoachExtras(): Promise<CoachExtras | null> {
  return (await readDraft()).extras ?? null;
}

export function checkCoachExtras(e: CoachExtras): string | null {
  const link = e.linkedIn?.trim();
  if (link && !/linkedin\.com\//i.test(link)) return 'That doesn’t look like a LinkedIn link. Fix it or clear it.';
  return null;
}

export async function saveCoachExtras(input: CoachExtras): Promise<CoachApplicationDraft> {
  const problem = checkCoachExtras(input);
  if (problem) throw new Error(problem);
  const optional = (s?: string) => (s?.trim() ? s.trim() : undefined);
  const extras: CoachExtras = { linkedIn: optional(input.linkedIn), invitedBy: optional(input.invitedBy), heardFrom: input.heardFrom };
  const draft = await readDraft();
  return writeDraft({ ...draft, extras, saved: markSaved(draft, 'extras') });
}

/** Steps that still need answers before the application can go in. */
export function missingCoachSteps(draft: CoachApplicationDraft): CoachApplyStep[] {
  return COACH_APPLY_STEPS.filter((s) => s.id !== 'review' && !draft.saved.includes(s.id)).map((s) => s.id);
}

/** The coach card as players would see it once approved, built from the draft. */
export function coachCardFromDraft(draft: CoachApplicationDraft): Coach | null {
  const { basics, path, background } = draft;
  if (!path?.pathway) return null;
  const name = basics?.fullName || db.me.name;
  const years = Math.max(0, ...(background?.experience.map((e) => e.years) ?? []));
  const school = background?.education?.school;
  return {
    id: 'preview',
    name,
    firstName: name.split(/\s+/)[0],
    initials: db.me.initials,
    pathway: path.pathway,
    subtitle: [path.role, path.organization].filter(Boolean).join(' · '),
    credentials: [
      { value: years ? `${years} yrs` : 'New', label: 'Experience' },
      school ? { value: school, label: 'School' } : { value: basics?.neighborhood || db.me.city, label: 'Home base' },
      { value: 'Bronze', label: 'ISO tier', highlight: true },
    ],
    tags: draft.topics ?? [],
    cutout: basics?.photoUri ? { uri: basics.photoUri } : undefined,
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

export async function getCoachCardPreview(): Promise<Coach | null> {
  return coachCardFromDraft(await readDraft());
}

/** Sends the application to the advisory board. Every step must be saved and the ID check can't have failed. */
export async function submitCoachDraft(): Promise<CoachApplicationDraft> {
  const draft = await readDraft();
  const missing = missingCoachSteps(draft);
  if (missing.length) throw new Error(`Finish ${COACH_APPLY_STEPS.find((s) => s.id === missing[0])?.title.toLowerCase()} first.`);
  if (draft.idCheck?.status === 'failed') throw new Error('Your ID check didn’t go through. Try it again first.');
  const { path, why, hosting, extras } = draft;
  db.applications.push({
    pathway: path!.pathway!,
    currentRole: [path!.role, path!.organization].filter(Boolean).join(', '),
    story: why!.motivation,
    hostArea: hosting!.areas.join(', '),
    link: extras?.linkedIn ?? '',
  });
  const at = now().toISOString().slice(0, 19);
  db.me.coachStatus = 'applied';
  db.me.appliedAt = at;
  return writeDraft({ ...draft, submittedAt: at, saved: markSaved(draft, 'review') });
}

/** On launch, puts a saved application's status and ID check back on the account. */
export async function restoreCoachApplication(): Promise<void> {
  const draft = await readDraft();
  if (draft.idCheck && !db.me.idCheck) db.me.idCheck = draft.idCheck;
  if (!draft.submittedAt || db.me.coachStatus !== 'none') return;
  db.me.coachStatus = 'applied';
  db.me.appliedAt = draft.submittedAt;
}

export async function clearCoachDraft(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
