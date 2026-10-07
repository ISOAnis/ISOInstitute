import type { Drive, FeedbackStyle, FirstGen, Gender, IsoSummary, MatchProfile, MatchSection, PaceStyle, Player, Recommendation } from './types';

/** The "Refine your ISO profile" sections, in order. */
export const MATCH_SECTIONS: { id: MatchSection; title: string; identity: boolean }[] = [
  { id: 'style', title: 'How you show up', identity: false },
  { id: 'values', title: 'What you stand on', identity: false },
  { id: 'from', title: 'Where you’re from', identity: true },
  { id: 'story', title: 'Your story', identity: true },
  { id: 'faith', title: 'Faith', identity: true },
  { id: 'gender', title: 'Gender', identity: true },
];

export const FEEDBACK_OPTIONS: { id: FeedbackStyle; label: string }[] = [
  { id: 'straight', label: 'Straight up' },
  { id: 'encourage', label: 'Encourage me' },
  { id: 'mix', label: 'Mix it' },
];

export const PACE_OPTIONS: { id: PaceStyle; label: string }[] = [
  { id: 'plan', label: 'Give me a plan' },
  { id: 'flow', label: 'Let it flow' },
];

export const DRIVE_OPTIONS: { id: Drive; label: string; sub: string }[] = [
  { id: 'exploring', label: 'Exploring', sub: 'Seeing what fits' },
  { id: 'committed', label: 'Committed', sub: 'Ready to put in work' },
  { id: 'all-in', label: 'All-in', sub: 'This is the priority' },
];

export const VALUE_OPTIONS = ['Integrity', 'Excellence', 'Service', 'Growth', 'Accountability', 'Faith', 'Community', 'Discipline', 'Family', 'Creativity'];

export const FROM_SUGGESTIONS = ['Denver', 'Aurora', 'Mexico', 'Ethiopia', 'Nigeria', 'Somalia', 'Vietnam', 'El Salvador', 'Puerto Rico', 'Philippines'];

export const FIRST_GEN_OPTIONS: { id: FirstGen; label: string }[] = [
  { id: 'college', label: 'Go to college' },
  { id: 'business', label: 'Start a business' },
  { id: 'field', label: 'Work in my field' },
];

export const LANGUAGE_OPTIONS = ['Spanish', 'Amharic', 'Somali', 'Arabic', 'Vietnamese', 'Tagalog', 'French', 'Yoruba', 'Mandarin', 'Korean'];

export const FAITH_OPTIONS = ['Christian', 'Muslim', 'Jewish', 'Hindu', 'Buddhist', 'Spiritual', 'Not religious'];

export const GENDER_OPTIONS: { id: Gender; label: string }[] = [
  { id: 'woman', label: 'Woman' },
  { id: 'man', label: 'Man' },
];

export const STAGE_OPTIONS = ['In school', 'Early career', 'Switching paths', 'Starting something', 'Established'];

export const emptyMatch = (): MatchProfile => ({ values: [], from: [], firstGen: [], languages: [], done: [] });

/** Fields each section owns, reset when someone clears it. */
export const SECTION_RESET: Record<MatchSection, Partial<MatchProfile>> = {
  style: { feedback: undefined, pace: undefined, drive: undefined },
  values: { values: [] },
  from: { from: [] },
  story: { firstGen: [], immigrantFamily: undefined, languages: [] },
  faith: { faith: undefined },
  gender: { gender: undefined },
};

/** One-line summary of a section's answers, or undefined if it hasn't been touched. */
export function sectionSummary(section: MatchSection, m: MatchProfile): string | undefined {
  if (!m.done.includes(section)) return undefined;
  const list = (xs: string[]) => (xs.length ? xs.join(', ') : 'Prefer not to say');
  switch (section) {
    case 'style':
      return [FEEDBACK_OPTIONS.find((o) => o.id === m.feedback)?.label, PACE_OPTIONS.find((o) => o.id === m.pace)?.label, DRIVE_OPTIONS.find((o) => o.id === m.drive)?.label]
        .filter(Boolean)
        .join(' · ');
    case 'values':
      return list(m.values);
    case 'from':
      return list(m.from);
    case 'story': {
      const parts = [
        ...m.firstGen.map((f) => `First-gen ${f === 'college' ? 'college' : f === 'business' ? 'business' : 'in my field'}`),
        ...(m.immigrantFamily ? ['Immigrant family'] : []),
        ...m.languages,
      ];
      return list(parts);
    }
    case 'faith':
      return m.faith ?? 'Prefer not to say';
    case 'gender':
      return GENDER_OPTIONS.find((o) => o.id === m.gender)?.label ?? 'Prefer not to say';
  }
}

const FEEDBACK_REASON: Record<FeedbackStyle, string> = {
  straight: 'Coach gives it to you straight',
  encourage: 'Coach leads with encouragement',
  mix: 'Coach mixes it up',
};
const FIRST_GEN_REASON: Record<FirstGen, string> = {
  college: 'First-gen college, like you',
  business: 'First-gen in business, like you',
  field: 'First in the field, like you',
};

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/**
 * Scores an ISO for the player. Preferences boost; they never hide anything except
 * women's or men's ISOs the player isn't eligible for. Returns null when it shouldn't be suggested.
 */
export function scoreIso(iso: IsoSummary, me: Player): Recommendation | null {
  if (iso.seatsOpen === 0 || (me.coachId && iso.coachId === me.coachId)) return null;
  const mine = me.match;
  const coach = iso.coach.match;
  const forGender = iso.groupFor === 'women' ? 'woman' : iso.groupFor === 'men' ? 'man' : undefined;
  if (forGender && mine.gender && mine.gender !== forGender) return null;

  const reasons: { text: string; weight: number }[] = [];
  const add = (weight: number, text: string) => reasons.push({ text, weight });
  const k = me.prefs.similarBackground ? 2 : 1;

  if (iso.pathway === me.pathway) add(25, 'Your pathway · priority seat');
  if (forGender && mine.gender === forGender) add(me.prefs.sameGender ? 14 : 8, iso.groupFor === 'women' ? 'Women’s ISO' : 'Men’s ISO');

  if (coach) {
    if (mine.feedback && coach.feedback === mine.feedback) add(10, FEEDBACK_REASON[coach.feedback]);
    else if (mine.feedback && coach.feedback === 'mix') add(5, FEEDBACK_REASON.mix);
    if (mine.pace && coach.pace === mine.pace) add(5, mine.pace === 'plan' ? 'Comes with a plan' : 'Lets the talk flow');

    const values = mine.values.filter((v) => coach.values.includes(v));
    if (values.length) add(4 * values.length, `You both value ${values[0]}`);

    const place = mine.from.find((p) => coach.from.some((c) => same(c, p)));
    if (place) add(6 * k, `Both have roots in ${place}`);
    const gen = mine.firstGen.find((g) => coach.firstGen.includes(g));
    if (gen) add(5 * k, FIRST_GEN_REASON[gen]);
    if (mine.immigrantFamily && coach.immigrantFamily) add(4 * k, 'Immigrant family, like you');
    const lang = mine.languages.find((l) => coach.languages.includes(l));
    if (lang) add(4 * k, `Speaks ${lang}`);
    if (mine.faith && coach.faith === mine.faith) add(4 * k, 'Shares your faith');

    if (me.prefs.sameGender && mine.gender && coach.gender === mine.gender) {
      add(10, mine.gender === 'woman' ? 'Coached by a woman' : 'Coached by a man');
    }
  }

  const score = 50 + reasons.reduce((a, r) => a + r.weight, 0);
  if (score < 60) return null;
  if (iso.pathway !== me.pathway) add(0, 'Outside your pathway');
  return {
    isoId: iso.id,
    match: Math.min(99, score),
    reasons: reasons
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .map((r) => r.text),
  };
}
