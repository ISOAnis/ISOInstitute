import { saveUserGender, type AssessedLevel, type UserGender } from './membership';

export interface PlayerProfileData {
  name: string;
  email: string;
  gender: UserGender | '';
  age: string;
  schoolYear: string;
  locations: { lat: number; lng: number; label: string }[];
  prefersSameBackground: boolean;
  goals: string;
  timeframe: string;
  communicationPreference: 'direct' | 'supportive' | 'balanced' | '';
  structurePreference: 'structured' | 'flexible' | 'adaptive' | '';
  motivationLevel: 'exploring' | 'committed' | 'all-in' | '';
  topValues: string[];
}

type Answers = Record<string, unknown>;

function mapSituationToSchoolYear(situation: string): string {
  const map: Record<string, string> = {
    'Still in school or training': 'In School',
    'Just graduated': 'Recent Graduate',
    'Early career (0–3 years)': 'Early Career',
    'Mid-career (3+ years)': 'Mid-Career',
    'Making a significant change': 'Career Transition',
  };
  return map[situation] ?? situation;
}

function mapDriveToMotivation(drive: number): PlayerProfileData['motivationLevel'] {
  if (drive >= 8) return 'all-in';
  if (drive >= 5) return 'committed';
  return 'exploring';
}

function mapIdentityToStructure(identity: string): PlayerProfileData['structurePreference'] {
  if (identity.includes('structure') || identity.includes('coach')) return 'structured';
  if (identity.includes('accountable')) return 'adaptive';
  return 'flexible';
}

function mapMotivationToCommunication(motivation: string): PlayerProfileData['communicationPreference'] {
  if (motivation.includes('discipline')) return 'direct';
  if (motivation.includes('someone else')) return 'supportive';
  return 'balanced';
}

function mapGrowthScenarioToTimeframe(scenario: string): string {
  if (scenario.includes('Stay the course')) return 'Long-term — trusting the process';
  if (scenario.includes('Audit')) return 'Short-term — refining my approach';
  if (scenario.includes('feedback')) return 'Ongoing — seeking guidance';
  return 'Recalibrating — reassessing goals';
}

export function hydrateProfileFromAssessment(
  answers: Answers,
  email?: string,
): PlayerProfileData {
  const fname = (answers.fname as string)?.trim() ?? '';
  const lname = (answers.lname as string)?.trim() ?? '';
  const name = `${fname} ${lname}`.trim();
  const genderRaw = (answers.gender as string) ?? '';
  const gender: UserGender | '' = genderRaw.toLowerCase() === 'female' ? 'female'
    : genderRaw.toLowerCase() === 'male' ? 'male' : '';

  const goalsArr = Array.isArray(answers.goals) ? (answers.goals as string[]) : [];
  const situation = (answers.situation as string) ?? '';
  const drive = (answers.drive as number) ?? 5;
  const identity = (answers.identity as string) ?? '';
  const motivation = (answers.motivation as string) ?? '';
  const growthScenario = (answers.growth_scenario as string) ?? '';

  return {
    name,
    email: email ?? '',
    gender,
    age: '',
    schoolYear: mapSituationToSchoolYear(situation),
    locations: [],
    prefersSameBackground: false,
    goals: goalsArr.join(', '),
    timeframe: mapGrowthScenarioToTimeframe(growthScenario),
    communicationPreference: mapMotivationToCommunication(motivation),
    structurePreference: mapIdentityToStructure(identity),
    motivationLevel: mapDriveToMotivation(drive),
    topValues: goalsArr.slice(0, 4),
  };
}

export function savePlayerProfileFromAssessment(answers: Answers, email?: string) {
  const profile = hydrateProfileFromAssessment(answers, email);
  localStorage.setItem('player_profile_data', JSON.stringify(profile));
  localStorage.setItem('player_profile_completion', '100');
  if (profile.gender) saveUserGender(profile.gender);
  return profile;
}
