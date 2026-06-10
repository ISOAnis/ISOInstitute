// ====================================================================
// ISO — Join Onboarding Page
// Premium guided assessment experience for players and coaches
// ====================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Moon, Dumbbell, Activity, Settings, Rocket, Globe } from 'lucide-react';
import './JoinISOPage.css';

// ====================================================================
// TYPES
// ====================================================================

type Screen =
  | 'create-account'
  | 'join'
  | 'player'
  | 'player-proc'
  | 'player-result'
  | 'success-player'
  | 'coach'
  | 'coach-proc'
  | 'coach-result'
  | 'success-coach';

type PlayerLevel = 'freshman' | 'jv' | 'varsity';
type CoachTier = 'bronze' | 'silver';
type QType = 'name' | 'mc' | 'multi' | 'slider' | 'text' | 'textarea' | 'pathway' | 'scenario' | 'checklist' | 'input';

type AnswerVal = string | string[] | number | null;
type Answers = Record<string, AnswerVal>;

interface Question {
  id: string;
  type: QType;
  question: string;
  sub?: string;
  options?: string[];
  hasOther?: boolean;
  min?: number;
  max?: number;
  unit?: string;
  labels?: [string, string];
  descs?: (string | null)[];
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  sectionLabel?: string;
  multiMin?: number;
}

interface PlayerResult {
  level: PlayerLevel;
  levelLabel: string;
  score: number;
  reasoning: string;
  breakthrough: string;
}

interface CoachResult {
  overall: number;
  tier: CoachTier;
  tierLabel: string;
  strengths: string[];
  opportunities: string[];
  reasoning: string;
}

// ====================================================================
// CONSTANTS
// ====================================================================

const PATHWAYS = [
  {
    id: 'builder',  Icon: Settings, name: 'Builder',  tagline: 'Create & engineer',  color: '#a855f7',
    desc: 'Building and solving — for innovators in STEM and design who want to leave a real-world impact. If you see a problem, you\'re already thinking about how to fix it.',
  },
  {
    id: 'seeker',   Icon: Moon,     name: 'Seeker',   tagline: 'Grow in faith',       color: '#10b981',
    desc: 'Spiritual development, reflection, and finding balance between purpose and progress. Everything flows from this center — this is the core of all growth.',
  },
  {
    id: 'healer',   Icon: Activity, name: 'Healer',   tagline: 'Serve through care',  color: '#3b82f6',
    desc: 'Serving through healing — for those in pre-med, nursing, public health, or any medical field. Your calling is to restore people, and ISO helps you sharpen that purpose.',
  },
  {
    id: 'reformer', Icon: Globe,    name: 'Reformer', tagline: 'Change systems',      color: '#06b6d4',
    desc: 'For those navigating global impact — law, economics, diplomacy, and ethical leadership. You\'re not just playing the game; you\'re changing the rules.',
  },
  {
    id: 'founder',  Icon: Rocket,   name: 'Founder',  tagline: 'Build ventures',      color: '#f97316',
    desc: 'For builders, dreamers, and leaders turning ideas into reality — from startups to social ventures. You see opportunity where others see obstacles.',
  },
  {
    id: 'warrior',  Icon: Dumbbell, name: 'Warrior',  tagline: 'Master the physical', color: '#ef4444',
    desc: 'Discipline through the body — physical wellness, mental toughness, nutrition, and self-mastery. The warrior understands that how you train your body shapes how you move through the world.',
  },
];

const PLAYER_LEVELS = [
  { id: 'freshman',     label: 'Freshman', locked: false },
  { id: 'jv',           label: 'JV',       locked: false },
  { id: 'varsity',      label: 'Varsity',  locked: false },
  { id: 'd1',           label: 'D1',       locked: true  },
  { id: 'professional', label: 'Pro',      locked: true  },
];

const COACH_TIERS = [
  { id: 'bronze',  label: 'Bronze',  range: '60–69', locked: false },
  { id: 'silver',  label: 'Silver',  range: '70–79', locked: false },
  { id: 'gold',    label: 'Gold',    range: '80–89', locked: true  },
  { id: 'premium', label: 'Premium', range: '90–99', locked: true  },
];

// ====================================================================
// QUESTION DATA — PLAYER
// ====================================================================

const PLAYER_BASE: Question[] = [
  {
    id: 'name',
    type: 'name',
    question: 'Who are you?',
    sub: 'Your name personalizes your ISO profile.',
    sectionLabel: 'Getting Started',
    required: true,
  },
  {
    id: 'pathway',
    type: 'pathway',
    question: 'Which path calls to you?',
    sub: 'Choose the archetype that best reflects where you\'re headed.',
    sectionLabel: 'Your Path',
    required: true,
  },
];

const PATHWAY_QS: Record<string, Question[]> = {
  builder: [
    {
      id: 'pw1',
      type: 'mc',
      question: 'Where are you in your building journey?',
      sectionLabel: 'Builder',
      options: ["I have ideas but haven't shipped anything yet", "I've built personal projects", "I've shipped something with real users", "I work professionally in this space"],
      hasOther: true, required: true,
    },
    {
      id: 'pw2',
      type: 'multi',
      question: 'Which areas have you developed in?',
      sub: 'Select all that apply.',
      sectionLabel: 'Builder',
      options: ['Software or coding', 'Hardware or engineering', 'Product design', 'Data or AI', 'Research or academia'],
      hasOther: true, multiMin: 1, required: true,
    },
  ],
  seeker: [
    {
      id: 'pw1',
      type: 'mc',
      question: 'How consistent is your spiritual practice right now?',
      sectionLabel: 'Seeker',
      options: ["Not very consistent yet", "Working on building it", "Fairly consistent", "It's a daily priority"],
      required: true,
    },
    {
      id: 'pw2',
      type: 'mc',
      question: 'Where do you most want to grow?',
      sectionLabel: 'Seeker',
      options: ['Deepening my knowledge', 'Building daily habits', 'Connecting faith to my career', 'Finding community', 'Understanding my purpose'],
      hasOther: true, required: true,
    },
  ],
  healer: [
    {
      id: 'pw1',
      type: 'mc',
      question: 'Where are you in your journey toward healing and care?',
      sectionLabel: 'Healer',
      options: ['Exploring the field', 'In a pre-health program', 'Currently in a healthcare program', 'Working in healthcare', 'Pivoting into healthcare'],
      hasOther: true, required: true,
    },
    {
      id: 'pw2',
      type: 'mc',
      question: 'What drives you toward this pathway?',
      sectionLabel: 'Healer',
      options: ['Personal or family experience', 'Faith and calling to serve', 'Passion for science and medicine', 'Desire for meaningful impact', 'Still discovering my why'],
      hasOther: true, required: true,
    },
  ],
  reformer: [
    {
      id: 'pw1',
      type: 'mc',
      question: 'Which area pulls you most right now?',
      sectionLabel: 'Reformer',
      options: ['Law and legal advocacy', 'Policy and government', 'Economics and development', 'Social justice and organizing', 'International affairs', 'Still exploring'],
      hasOther: true, required: true,
    },
    {
      id: 'pw2',
      type: 'mc',
      question: 'What kind of change do you most want to make?',
      sectionLabel: 'Reformer',
      options: ['Reform systems from within', 'Advocate for underrepresented communities', 'Build policy that prevents harm', 'Represent people who cannot represent themselves'],
      hasOther: true, required: true,
    },
  ],
  founder: [
    {
      id: 'pw1',
      type: 'mc',
      question: 'Where are you in your entrepreneurial journey?',
      sectionLabel: 'Founder',
      options: ['Just have an idea', 'Validated the concept', 'Built an MVP or prototype', 'Have early customers or revenue', 'Scaling an existing venture'],
      required: true,
    },
    {
      id: 'pw2',
      type: 'mc',
      question: 'What holds you back the most right now?',
      sectionLabel: 'Founder',
      options: ['Fear of failure or judgment', 'Lack of capital or resources', "Not knowing where to start", 'Imposter syndrome', 'Doing it alone'],
      hasOther: true, required: true,
    },
  ],
  warrior: [
    {
      id: 'pw1',
      type: 'mc',
      question: 'Where is your fitness and training right now?',
      sectionLabel: 'Warrior',
      options: ['Just starting out', 'Some consistency, not structured', 'Active but needs more structure', 'Highly consistent', 'Competing or training seriously'],
      required: true,
    },
    {
      id: 'pw2',
      type: 'mc',
      question: 'What is your primary goal right now?',
      sectionLabel: 'Warrior',
      options: ['Build a consistent routine', 'Improve body composition', 'Build strength and muscle', 'Mental health through movement', 'Compete or perform athletically', 'Recover from a setback'],
      hasOther: true, required: true,
    },
  ],
};

const PLAYER_CORE: Question[] = [
  {
    id: 'situation',
    type: 'mc',
    question: 'Where are you right now in your life?',
    sectionLabel: 'Background',
    options: ['Still in school or training', 'Just graduated', 'Early career (0–3 years)', 'Mid-career (3+ years)', 'Making a significant change'],
    hasOther: true, required: true,
  },
  {
    id: 'experience',
    type: 'slider',
    question: 'How many years have you been working in your pathway?',
    sectionLabel: 'Experience',
    min: 0, max: 15, unit: ' yrs',
    labels: ['Just starting', '15+ years'],
    descs: ['No experience yet','Just starting','About 1 year','2 years','3–4 years','5 years','6 years','7 years','8 years','9 years','10 years','11–12 years','13 years','14 years','15 years','15+ years'],
    required: true,
  },
  {
    id: 'goals',
    type: 'multi',
    question: 'What does growth look like for you?',
    sub: 'Select everything that resonates.',
    sectionLabel: 'Goals',
    options: ['Build real skills and expertise', 'Earn recognition or opportunity', 'Develop confidence and self-belief', 'Find meaningful community', 'Clarify my direction', 'Lead and influence others', 'Build something lasting', 'Explore elite-level development'],
    hasOther: true, multiMin: 1, required: true,
  },
  {
    id: 'drive',
    type: 'slider',
    question: 'How driven are you to grow right now?',
    sub: 'Be honest with yourself.',
    sectionLabel: 'Commitment',
    min: 1, max: 10, unit: '/10',
    labels: ['Just exploring', 'Fully all in'],
    descs: [null,'Just exploring','Curious','Getting warmed up','Building momentum','Getting serious','Committed','Very driven','Highly driven','Motivated','Fully all in'],
    required: true,
  },
  {
    id: 'train_days',
    type: 'slider',
    question: 'How many days per week do you intentionally invest in your growth?',
    sectionLabel: 'Habits',
    min: 0, max: 7, unit: ' days',
    labels: ['None yet', 'Every day'],
    descs: ['Not yet','Once a week','A couple times','Three days','Four days','Five days','Six days','Every day'],
    required: true,
  },
  {
    id: 'motivation',
    type: 'mc',
    question: 'When motivation disappears, what usually happens?',
    sectionLabel: 'Mindset',
    options: ['I show up anyway — discipline carries me', 'I take a short break then return stronger', 'I lose weeks before finding my way back', 'I need someone else to remind me why'],
    required: true,
  },
  {
    id: 'growth_scenario',
    type: 'scenario',
    question: 'You\'ve been putting in real work for months — but results are slower than expected. What do you do?',
    sectionLabel: 'Growth Mindset',
    options: [
      'Stay the course — trust the process and stay consistent',
      'Audit my approach and make targeted adjustments',
      'Seek feedback from a mentor or someone further along',
      'Step back and recalibrate my goals and timeline',
    ],
    required: true,
  },
  {
    id: 'identity',
    type: 'mc',
    question: 'Which best describes how you currently operate?',
    sectionLabel: 'Self-Awareness',
    options: [
      'I set clear goals and hold myself accountable',
      "I work best with structure and a mentor's guidance",
      'I give strong effort when reminded or held accountable',
      "I'm still figuring out my rhythm and approach",
    ],
    required: true,
  },
  {
    id: 'support',
    type: 'multi',
    question: 'Who supports your growth?',
    sub: 'Select all that apply.',
    sectionLabel: 'Support System',
    options: ['Parents or family', 'Coach or mentor', 'Friends or peers', 'Community or faith community', 'Teammates or colleagues', 'No strong support system yet'],
    hasOther: true, multiMin: 0, required: false,
  },
  {
    id: 'why_iso',
    type: 'mc',
    question: 'What brought you to ISO?',
    sectionLabel: 'Joining ISO',
    options: ['The Assist talk series or content', 'A recommendation from someone I trust', 'Looking for mentorship and accountability', 'I want to be part of something bigger', 'I want structured development, not just inspiration'],
    hasOther: true, required: true,
  },
  {
    id: 'commit_iso',
    type: 'slider',
    question: 'How committed are you to actually showing up on ISO?',
    sub: 'Consistency over perfection. Be real.',
    sectionLabel: 'Commitment',
    min: 1, max: 10, unit: '/10',
    labels: ['Just browsing', 'Fully committed'],
    descs: [null,'Just browsing','Curious','Somewhat interested','Getting there','Getting serious','Committed','Very committed','Highly committed','Extremely committed','Fully committed'],
    required: true,
  },
  {
    id: 'reflection',
    type: 'textarea',
    question: 'What excites you most about your future?',
    sub: 'Optional. This is your space — share as much or as little as you like.',
    sectionLabel: 'Reflection',
    placeholder: 'Share your thoughts...',
    optional: true, required: false,
  },
];

// ====================================================================
// QUESTION DATA — COACH
// ====================================================================

const COACH_QS: Question[] = [
  {
    id: 'c_name',
    type: 'name',
    question: 'Who are you?',
    sub: 'Your name will appear on your coach profile.',
    sectionLabel: 'Getting Started',
    required: true,
  },
  {
    id: 'c_email',
    type: 'input',
    question: 'Your professional email?',
    sub: 'Used for Advisory Board communication.',
    sectionLabel: 'Identity',
    placeholder: 'you@organization.com',
    required: true,
  },
  {
    id: 'c_pathway',
    type: 'pathway',
    question: 'Which pathway are you coaching in?',
    sub: 'Select the archetype that best matches your area of expertise.',
    sectionLabel: 'Your Pathway',
    required: true,
  },
  {
    id: 'c_role',
    type: 'mc',
    question: 'What best describes your current role?',
    sectionLabel: 'Identity',
    options: ['Active coach or mentor', 'Educator or professor', 'Industry professional pivoting to coaching', 'Entrepreneur or founder', 'Retired professional now mentoring', 'Recently transitioned into coaching'],
    hasOther: true, required: true,
  },
  {
    id: 'c_years',
    type: 'slider',
    question: 'Years of coaching or mentoring experience?',
    sectionLabel: 'Experience',
    min: 0, max: 25, unit: ' yrs',
    labels: ['Under 1 year', '25+ years'],
    descs: ['Under 1 year','~1 year','2 years','3 years','4 years','5 years','6 years','7 years','8 years','9 years','10 years','11 years','12 years','13 years','14 years','15 years','16 years','17 years','18 years','19 years','20 years','21 years','22 years','23 years','24 years','25+ years'],
    required: true,
  },
  {
    id: 'c_credentials',
    type: 'multi',
    question: 'Which credentials or qualifications do you hold?',
    sub: 'Select all that apply.',
    sectionLabel: 'Credentials',
    options: ["Bachelor's degree or equivalent", "Master's degree or higher", 'Professional license or certification', 'Industry-specific certification', 'Specialized coaching training', 'Professional membership or affiliation'],
    hasOther: true, multiMin: 0, required: false,
  },
  {
    id: 'c_coached_count',
    type: 'mc',
    question: 'Approximately how many individuals have you formally coached or mentored?',
    sectionLabel: 'Experience',
    options: ['1–5 individuals', '6–20 individuals', '21–50 individuals', '51–100 individuals', '100+ individuals'],
    required: true,
  },
  {
    id: 'c_coached_level',
    type: 'mc',
    question: 'What is the highest level you have coached at?',
    sectionLabel: 'Experience',
    options: ['Beginner or introductory', 'Intermediate development', 'Advanced or competitive', 'College or elite amateur', 'Professional or industry-leading'],
    required: true,
  },
  {
    id: 'c_outcomes',
    type: 'multi',
    question: 'What outcomes have you produced for the people you\'ve coached?',
    sub: 'Specific, documented outcomes score significantly higher.',
    sectionLabel: 'Demonstrated Impact',
    options: ['Academic or scholarship advancement', 'Career placement or promotion', 'Entrepreneurial or business success', 'Leadership or community recognition', 'Significant personal development', 'Performance or measurable skill growth'],
    hasOther: true, multiMin: 0, required: false,
  },
  {
    id: 'c_s1',
    type: 'scenario',
    question: 'A parent publicly challenges your coaching approach on social media, claiming you are not developing their child properly. You...',
    sectionLabel: 'Professionalism',
    options: [
      'Request a private conversation to address their concerns directly',
      'Acknowledge their frustration publicly while redirecting to a private conversation',
      'Let your track record speak and decline to engage publicly',
      'Consult with ISO leadership first before responding',
    ],
    required: true,
  },
  {
    id: 'c_s2',
    type: 'scenario',
    question: 'A talented player you\'re coaching consistently misses sessions and doesn\'t complete assigned work. You...',
    sectionLabel: 'Accountability',
    options: [
      'First reach out to understand what is truly going on in their life',
      'Have a direct, honest conversation about whether they\'re ready to commit',
      'Give them more time — development happens on different timelines',
      'Refer them to a coach whose style might be a better fit',
    ],
    required: true,
  },
  {
    id: 'c_values',
    type: 'mc',
    question: '"Pull as you climb." What does this mean to you?',
    sectionLabel: 'Values',
    options: [
      'The more you grow, the more responsibility you carry to bring others with you',
      'You should not wait until you\'ve "made it" to give back',
      'Real success is measured by how many people you helped get there',
      'All of the above — it\'s how I try to live and coach',
    ],
    required: true,
  },
  {
    id: 'c_humility',
    type: 'mc',
    question: 'A player you mentor earns an opportunity you also applied for. How do you respond?',
    sectionLabel: 'Character',
    options: [
      'Genuinely celebrate them — that outcome is what mentorship is for',
      'Celebrate them fully, though it would take me a moment to process',
      'Focus on what I can do differently and keep building',
      'Recognize it as confirmation that my coaching is working',
    ],
    required: true,
  },
  {
    id: 'c_references',
    type: 'textarea',
    question: 'List 1–2 professional or community references.',
    sub: 'Include name, title, relationship, and contact. Verified references score significantly higher.',
    sectionLabel: 'References',
    placeholder: 'e.g. Dr. James Carter, Director of Athletics, longtime mentor — jcarter@university.edu',
    optional: true, required: false,
  },
  {
    id: 'c_linkedin',
    type: 'input',
    question: 'Your LinkedIn profile?',
    sub: 'Helps the Advisory Board verify your background.',
    sectionLabel: 'Verification',
    placeholder: 'linkedin.com/in/yourprofile',
    optional: true, required: false,
  },
  {
    id: 'c_readiness',
    type: 'checklist',
    question: 'Before submitting, please confirm the following.',
    sub: 'All items must be acknowledged to proceed.',
    sectionLabel: 'Platform Readiness',
    options: [
      'I have read and agree to the ISO Coach Code of Conduct',
      'I understand that ISO is a faith-informed, values-driven platform',
      'I understand that my Overall Rating is a starting point, not a final evaluation',
      'I commit to showing up consistently for the players I coach on this platform',
    ],
    required: true,
  },
];

// ====================================================================
// AI SCORING FUNCTIONS (MOCK — placeholder for future AI integration)
// ====================================================================

function scorePlayer(answers: Answers): PlayerResult {
  let score = 0;

  // Experience depth
  const experience = (answers.experience as number) ?? 0;
  if (experience >= 8) score += 3;
  else if (experience >= 4) score += 2;
  else if (experience >= 1) score += 1;

  // Drive / intrinsic motivation
  const drive = (answers.drive as number) ?? 1;
  if (drive >= 8) score += 3;
  else if (drive >= 6) score += 2;
  else if (drive >= 4) score += 1;

  // Intentional practice frequency
  const trainDays = (answers.train_days as number) ?? 0;
  if (trainDays >= 5) score += 2;
  else if (trainDays >= 3) score += 1;

  // Intrinsic discipline vs dependency
  const motivation = (answers.motivation as string) ?? '';
  if (motivation.includes('discipline')) score += 3;
  else if (motivation.includes('short break')) score += 2;
  else if (motivation.includes('reminder')) score += 1;

  // Growth mindset resilience
  const growth = (answers.growth_scenario as string) ?? '';
  if (growth.includes('Stay the course') || growth.includes('Audit')) score += 3;
  else if (growth.includes('Seek feedback')) score += 2;
  else if (growth.includes('recalibrate')) score += 1;

  // Self-ownership
  const identity = (answers.identity as string) ?? '';
  if (identity.includes('set clear goals')) score += 2;
  else if (identity.includes("mentor's")) score += 1;

  // Platform commitment signal
  const commitISO = (answers.commit_iso as number) ?? 1;
  if (commitISO >= 8) score += 2;
  else if (commitISO >= 6) score += 1;

  // Pathway-specific depth signals
  const pathway = (answers.pathway as string) ?? '';
  const pw1 = (answers.pw1 as string) ?? '';
  if (pathway === 'founder' && (pw1.includes('revenue') || pw1.includes('Scaling'))) score += 1;
  if (pathway === 'warrior' && (pw1.includes('Highly') || pw1.includes('Competing'))) score += 1;
  if (pathway === 'builder' && (pw1.includes('shipped') || pw1.includes('professionally'))) score += 1;

  // Max possible: ~19
  let level: PlayerLevel;
  let levelLabel: string;
  let reasoning: string;
  let breakthrough: string;

  if (score >= 14) {
    level = 'varsity';
    levelLabel = 'Varsity';
    reasoning = `Your intake reflects strong, consistent commitment habits and meaningful depth in your pathway. You've demonstrated the kind of intentional development and resilient growth mindset that aligns with Varsity readiness on ISO.`;
    breakthrough = `Continued consistency, documented outcomes, and seeking high-quality mentorship may accelerate your path toward D1 designation. The next level is about depth of impact, not just effort.`;
  } else if (score >= 7) {
    level = 'jv';
    levelLabel = 'JV';
    reasoning = `You're showing real momentum. Your commitment signals and foundational experience in your pathway indicate someone genuinely invested in building toward something greater. You have the ingredients — now it's about consistency.`;
    breakthrough = `Strengthening your daily habits, increasing intentional training frequency, and engaging actively with ISO mentors may accelerate your progression toward Varsity.`;
  } else {
    level = 'freshman';
    levelLabel = 'Freshman';
    reasoning = `Every major journey starts here. Your placement reflects where you are right now — not where you're going. ISO recognizes your willingness to step up and start. That alone takes real courage.`;
    breakthrough = `Building a consistent daily practice, engaging with your pathway community, and finding a mentor will set the foundation for your progression toward JV. The foundation matters.`;
  }

  return { level, levelLabel, score, reasoning, breakthrough };
}

function scoreCoach(answers: Answers): CoachResult {
  let raw = 0;

  // Credentials: up to 20 pts
  const credentials = (answers.c_credentials as string[]) ?? [];
  const hasAdvanced = credentials.some(c => c.includes("Master") || c.includes('license') || c.includes('certification'));
  raw += Math.min(20, credentials.length * 4 + (hasAdvanced ? 4 : 0));

  // Years experience: up to 15 pts
  const years = (answers.c_years as number) ?? 0;
  if (years >= 15) raw += 15;
  else if (years >= 8) raw += 12;
  else if (years >= 4) raw += 8;
  else if (years >= 2) raw += 5;
  else raw += 2;

  // Scale coached: up to 8 pts
  const cCount = (answers.c_coached_count as string) ?? '';
  if (cCount.includes('100+')) raw += 8;
  else if (cCount.includes('51')) raw += 6;
  else if (cCount.includes('21')) raw += 4;
  else if (cCount.includes('6')) raw += 2;
  else raw += 1;

  // Highest level: up to 7 pts
  const cLevel = (answers.c_coached_level as string) ?? '';
  if (cLevel.includes('Professional')) raw += 7;
  else if (cLevel.includes('College')) raw += 5;
  else if (cLevel.includes('Advanced')) raw += 3;
  else if (cLevel.includes('Intermediate')) raw += 2;
  else raw += 1;

  // Demonstrated outcomes: up to 15 pts
  const outcomes = (answers.c_outcomes as string[]) ?? [];
  raw += Math.min(15, outcomes.length * 3);

  // Professionalism scenarios: up to 10 pts
  const s1 = (answers.c_s1 as string) ?? '';
  const s2 = (answers.c_s2 as string) ?? '';
  if (s1.includes('private')) raw += 5;
  else if (s1.includes('publicly')) raw += 3;
  else raw += 1;
  if (s2.includes('understand')) raw += 5;
  else if (s2.includes('direct')) raw += 4;
  else raw += 1;

  // Values alignment: up to 10 pts
  const vals = (answers.c_values as string) ?? '';
  const humility = (answers.c_humility as string) ?? '';
  if (vals.includes('All of the above')) raw += 6;
  else if (vals.includes('Real success')) raw += 4;
  else raw += 2;
  if (humility.includes('Genuinely celebrate')) raw += 4;
  else if (humility.includes('moment to process')) raw += 2;
  else raw += 1;

  // References: up to 5 pts
  const refs = (answers.c_references as string) ?? '';
  if (refs.length > 60) raw += 5;
  else if (refs.length > 20) raw += 3;

  // Verification / LinkedIn: up to 2 pts
  const linkedin = (answers.c_linkedin as string) ?? '';
  if (linkedin.length > 5) raw += 2;

  // Completion: 3 pts for reaching the end
  raw += 3;

  // Compress to 60–79
  const capped = Math.min(raw, 100);
  const overall = Math.max(60, Math.min(79, Math.round(60 + (capped / 100) * 19)));
  const tier: CoachTier = overall >= 70 ? 'silver' : 'bronze';
  const tierLabel = tier === 'silver' ? 'Silver' : 'Bronze';

  const strengths: string[] = [];
  const opportunities: string[] = [];

  if (years >= 5) strengths.push('Meaningful coaching experience');
  else opportunities.push('Continue building your coaching track record');

  if (credentials.length >= 2) strengths.push('Strong credentials and qualifications');
  else opportunities.push('Pursue additional certifications to strengthen your profile');

  if (outcomes.length >= 3) strengths.push('Documented impact and outcomes');
  else opportunities.push('Document your coaching outcomes more concretely');

  if (s2.includes('understand')) strengths.push('Empathetic, player-centered approach');
  if (vals.includes('All of the above')) strengths.push('Strong alignment with ISO values');
  else opportunities.push('Deepen your understanding of the "Pull as you climb" model');

  if (refs.length > 60) strengths.push('Professional references provided');
  else opportunities.push('Verified references would strengthen your application');

  if (strengths.length === 0) strengths.push('Commitment to the ISO process and standards');

  const reasoning = `Your intake reflects ${tier === 'silver' ? 'solid credentials and meaningful coaching experience' : 'a genuine commitment to development and early-stage coaching impact'}. ${strengths[0] ?? 'Your application'} stands out. ${opportunities[0] ? opportunities[0] + ' would further elevate your profile.' : 'Continue building on your strong foundation.'}`;

  return { overall, tier, tierLabel, strengths, opportunities, reasoning };
}

// ====================================================================
// PATHWAY GRID — colored hover cards
// ====================================================================

function PathwayGrid({ val, onAnswer }: { val: string; onAnswer: (v: string) => void }) {
  const [hovered, setHovered] = React.useState<string | null>(null);
  const activeId = hovered ?? val ?? null;
  const hoveredPathway = PATHWAYS.find(p => p.id === activeId) ?? null;

  return (
    <div className="iso-join__pw-wrap">
      <div className="iso-join__pathway-grid">
        {PATHWAYS.map(p => {
          const active = val === p.id;
          const isHov = hovered === p.id;
          const lit = active || isHov;

          return (
            <button
              key={p.id}
              className="iso-join__pw-card"
              onClick={() => onAnswer(p.id)}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                borderColor: lit ? `${p.color}66` : `${p.color}22`,
                background: lit
                  ? `radial-gradient(ellipse at 50% 0%, ${p.color}18 0%, rgba(18,18,18,0.95) 70%)`
                  : `radial-gradient(ellipse at 50% 0%, ${p.color}08 0%, rgba(14,14,14,0.9) 80%)`,
                boxShadow: lit
                  ? `0 0 28px ${p.color}28, inset 0 1px 0 ${p.color}33`
                  : `inset 0 1px 0 ${p.color}14`,
                transition: 'all 0.22s ease',
              }}
            >
              <span
                className="iso-join__pw-icon"
                style={{
                  color: lit ? p.color : `${p.color}88`,
                  opacity: 1,
                  transition: 'color 0.22s ease',
                }}
              >
                <p.Icon size={26} strokeWidth={1.5} />
              </span>
              <span
                className="iso-join__pw-name"
                style={{ color: lit ? '#e8e8e8' : undefined, transition: 'color 0.22s ease' }}
              >
                {p.name}
              </span>
              <span className="iso-join__pw-tagline">{p.tagline}</span>
            </button>
          );
        })}
      </div>

      {/* Pathway description panel */}
      <div
        className="iso-join__pw-desc-panel"
        style={{
          opacity: hoveredPathway ? 1 : 0,
          transform: hoveredPathway ? 'translateY(0)' : 'translateY(6px)',
          borderColor: hoveredPathway ? `${hoveredPathway.color}33` : 'transparent',
          background: hoveredPathway
            ? `linear-gradient(135deg, ${hoveredPathway.color}0d 0%, rgba(16,16,16,0.9) 60%)`
            : 'rgba(16,16,16,0.0)',
          pointerEvents: 'none',
          transition: 'opacity 0.25s ease, transform 0.25s ease, border-color 0.25s ease, background 0.25s ease',
        }}
      >
        {hoveredPathway && (
          <>
            <span
              className="iso-join__pw-desc-label"
              style={{ color: hoveredPathway.color }}
            >
              <hoveredPathway.Icon size={13} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
              The {hoveredPathway.name} Pathway
            </span>
            <p className="iso-join__pw-desc-text">{hoveredPathway.desc}</p>
          </>
        )}
      </div>
    </div>
  );
}

// ====================================================================
// QUESTION INPUT RENDERER
// ====================================================================

interface InputProps {
  q: Question;
  answers: Answers;
  otherText: Record<string, string>;
  onAnswer: (id: string, val: AnswerVal) => void;
  onOther: (id: string, val: string) => void;
}

function QuestionInput({ q, answers, otherText, onAnswer, onOther }: InputProps) {
  const val = answers[q.id];

  // NAME
  if (q.type === 'name') {
    return (
      <div className="iso-join__name-row">
        <input
          className="iso-join__text-input"
          placeholder="First name"
          value={(answers.fname as string) || ''}
          onChange={e => onAnswer('fname', e.target.value)}
        />
        <input
          className="iso-join__text-input"
          placeholder="Last name"
          value={(answers.lname as string) || ''}
          onChange={e => onAnswer('lname', e.target.value)}
        />
      </div>
    );
  }

  // PATHWAY
  if (q.type === 'pathway') {
    return (
      <PathwayGrid val={val as string} onAnswer={(v) => onAnswer(q.id, v)} />
    );
  }

  // MC / SCENARIO — single select
  if (q.type === 'mc' || q.type === 'scenario') {
    const opts = q.options ?? [];
    const hasOther = q.hasOther;
    const otherSelected = (val as string)?.startsWith('__other__');

    return (
      <>
        {q.type === 'scenario' && (
          <div className="iso-join__scenario-box">
            <div className="iso-join__scenario-eyebrow">Scenario</div>
            <p className="iso-join__scenario-text">{q.question}</p>
          </div>
        )}
        <div className="iso-join__mc-list">
          {opts.map(opt => (
            <button
              key={opt}
              className={`iso-join__mc-opt${val === opt ? ' iso-join__mc-opt--sel' : ''}`}
              onClick={() => onAnswer(q.id, opt)}
            >
              <span className="iso-join__mc-dot" />
              {opt}
            </button>
          ))}
          {hasOther && (
            <>
              <button
                className={`iso-join__mc-opt${otherSelected ? ' iso-join__mc-opt--sel' : ''}`}
                onClick={() => onAnswer(q.id, '__other__')}
              >
                <span className="iso-join__mc-dot" />
                Other (type here)
              </button>
              {otherSelected && (
                <div className="iso-join__other-wrap">
                  <input
                    className="iso-join__other-input"
                    placeholder="Your answer..."
                    value={otherText[q.id] || ''}
                    onChange={e => {
                      onOther(q.id, e.target.value);
                      onAnswer(q.id, '__other__' + e.target.value);
                    }}
                    autoFocus
                  />
                </div>
              )}
            </>
          )}
        </div>
      </>
    );
  }

  // MULTI — select all that apply
  if (q.type === 'multi') {
    const selected = (val as string[]) ?? [];
    const toggle = (opt: string) => {
      const next = selected.includes(opt)
        ? selected.filter(s => s !== opt)
        : [...selected, opt];
      onAnswer(q.id, next);
    };
    const hasOtherSelected = selected.some(s => s.startsWith('__other__'));

    return (
      <>
        <p className="iso-join__multi-hint">Select all that apply</p>
        <div className="iso-join__mc-list">
          {(q.options ?? []).map(opt => (
            <button
              key={opt}
              className={`iso-join__mc-opt iso-join__mc-opt--multi${selected.includes(opt) ? ' iso-join__mc-opt--sel' : ''}`}
              onClick={() => toggle(opt)}
            >
              <span className="iso-join__mc-dot" />
              {opt}
            </button>
          ))}
          {q.hasOther && (
            <>
              <button
                className={`iso-join__mc-opt iso-join__mc-opt--multi${hasOtherSelected ? ' iso-join__mc-opt--sel' : ''}`}
                onClick={() => {
                  if (hasOtherSelected) {
                    onAnswer(q.id, selected.filter(s => !s.startsWith('__other__')));
                  } else {
                    onAnswer(q.id, [...selected, '__other__']);
                  }
                }}
              >
                <span className="iso-join__mc-dot" />
                Other (type here)
              </button>
              {hasOtherSelected && (
                <div className="iso-join__other-wrap">
                  <input
                    className="iso-join__other-input"
                    placeholder="Your answer..."
                    value={otherText[q.id] || ''}
                    onChange={e => {
                      onOther(q.id, e.target.value);
                      const withoutOther = selected.filter(s => !s.startsWith('__other__'));
                      onAnswer(q.id, [...withoutOther, '__other__' + e.target.value]);
                    }}
                    autoFocus
                  />
                </div>
              )}
            </>
          )}
        </div>
      </>
    );
  }

  // SLIDER
  if (q.type === 'slider') {
    const min = q.min ?? 0;
    const max = q.max ?? 10;
    const numVal = (val as number) ?? min;
    const desc = q.descs ? (q.descs[numVal] ?? null) : null;

    return (
      <div className="iso-join__slider-wrap">
        <div className="iso-join__slider-big">
          {numVal}{q.unit ?? ''}
        </div>
        {desc && <div className="iso-join__slider-desc">{desc}</div>}
        <input
          type="range"
          className="iso-join__range"
          min={min}
          max={max}
          value={numVal}
          onChange={e => onAnswer(q.id, Number(e.target.value))}
        />
        <div className="iso-join__slider-labels">
          <span>{q.labels?.[0] ?? min}</span>
          <span>{q.labels?.[1] ?? max}</span>
        </div>
      </div>
    );
  }

  // TEXTAREA
  if (q.type === 'textarea') {
    return (
      <div className="iso-join__input-wrap">
        <textarea
          className="iso-join__textarea"
          placeholder={q.placeholder ?? 'Type here...'}
          value={(val as string) ?? ''}
          onChange={e => onAnswer(q.id, e.target.value)}
        />
        {q.optional && <span className="iso-join__optional-label">Optional</span>}
      </div>
    );
  }

  // TEXT / INPUT
  if (q.type === 'text' || q.type === 'input') {
    return (
      <div className="iso-join__input-wrap">
        <input
          className="iso-join__text-input"
          placeholder={q.placeholder ?? ''}
          value={(val as string) ?? ''}
          onChange={e => onAnswer(q.id, e.target.value)}
        />
        {q.optional && <span className="iso-join__optional-label">Optional</span>}
      </div>
    );
  }

  // CHECKLIST
  if (q.type === 'checklist') {
    const checked = (val as string[]) ?? [];
    const toggle = (opt: string) => {
      const next = checked.includes(opt) ? checked.filter(c => c !== opt) : [...checked, opt];
      onAnswer(q.id, next);
    };
    return (
      <div className="iso-join__checklist">
        {(q.options ?? []).map(opt => (
          <div
            key={opt}
            className={`iso-join__check-row${checked.includes(opt) ? ' iso-join__check-row--checked' : ''}`}
            onClick={() => toggle(opt)}
          >
            <div className="iso-join__checkbox">{checked.includes(opt) ? '✓' : ''}</div>
            <span className="iso-join__check-text">{opt}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

// ====================================================================
// LEVEL PROGRESSION VISUAL
// ====================================================================

// Level segment colors matching the player portal
const LEVEL_COLORS: Record<string, string> = {
  freshman:     '#10b981',
  jv:           '#3b82f6',
  varsity:      '#a855f7',
  d1:           '#f97316',
  professional: '#C08038',
};

function LevelViz({ assignedLevel }: { assignedLevel: PlayerLevel }) {
  const assignedIdx = PLAYER_LEVELS.findIndex(l => l.id === assignedLevel);

  return (
    <div className="iso-join__viz">
      <div className="iso-join__viz-label">Your Progression Path</div>

      {/* Segmented bar */}
      <div className="iso-join__viz-bar-wrap">
        {PLAYER_LEVELS.map((l, i) => {
          const filled   = i <= assignedIdx && !l.locked;
          const isActive = i === assignedIdx;
          const color    = LEVEL_COLORS[l.id] ?? '#555';
          return (
            <div
              key={l.id}
              className="iso-join__viz-seg"
              style={{
                background: filled
                  ? color
                  : l.locked
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(255,255,255,0.06)',
                boxShadow: isActive ? `0 0 16px ${color}88` : 'none',
                opacity: l.locked ? 0.4 : 1,
                position: 'relative',
              }}
            >
              {l.locked && (
                <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 10 }}>🔒</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="iso-join__viz-labels">
        {PLAYER_LEVELS.map((l, i) => {
          const isActive = i === assignedIdx;
          const color    = LEVEL_COLORS[l.id] ?? '#555';
          return (
            <div key={l.id} className="iso-join__viz-label-col">
              {isActive && (
                <span className="iso-join__viz-you-marker" style={{ color }}>▲ YOU</span>
              )}
              <span
                className="iso-join__viz-lbl"
                style={{
                  color: isActive ? color : l.locked ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.35)',
                  fontWeight: isActive ? 700 : 400,
                }}
              >
                {l.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ====================================================================
// PLAN RECOMMENDATION
// ====================================================================

const PLANS = [
  {
    id: 'walk-on',
    name: 'Walk-On',
    price: 'Free',
    badge: null,
    color: '#10b981',
    features: [
      '30-minute monthly check-in with a coach',
      'Shadowing opportunity with a coach',
      'Coaching nights & pathway events',
      'Pathway-specific resources & curriculum',
      'Community support network',
    ],
    prediction: 'Get a feel for ISO. One focused check-in a month to start building the habit and see if it clicks.',
  },
  {
    id: 'locker-room',
    name: 'Locker Room',
    price: '$10 / month',
    badge: 'Most Popular',
    color: '#3b82f6',
    features: [
      'Everything in Walk-On',
      'Full Locker Room video library',
      'Community discussions & accountability',
      'Weekly motivational content drops',
      'Early access to events & announcements',
    ],
    prediction: 'Build real momentum. Weekly content + community accountability dramatically increases consistency for players who need more than one monthly touchpoint.',
  },
  {
    id: 'varsity',
    name: 'Varsity Program',
    price: 'Varies by coach',
    badge: 'Premium',
    color: '#a855f7',
    features: [
      'Everything in Locker Room',
      'Weekly check-ins with a dedicated coach',
      'Structured curriculum & personal playbook',
      'Resume, LinkedIn & interview prep',
      'Professional network & referrals',
      'Priority event access',
    ],
    prediction: 'The fastest growth track. Players with a dedicated coach show 3–4x the progression speed — weekly accountability changes everything.',
  },
];

const PLAN_RECS: Record<PlayerLevel, { planId: string; headline: string; reason: string }> = {
  freshman: {
    planId: 'walk-on',
    headline: 'Start with Walk-On — experience ISO first.',
    reason: 'Based on where you are right now, the best move is to join free, experience a check-in, and decide from there. Upgrading before you\'ve felt the value rarely sticks.',
  },
  jv: {
    planId: 'walk-on',
    headline: 'Walk-On to start. Locker Room when you\'re ready.',
    reason: 'You\'re showing real momentum — that\'s great. Start free, lock in a check-in, and if you want community + content to reinforce your habits, Locker Room is a natural next step.',
  },
  varsity: {
    planId: 'locker-room',
    headline: 'Locker Room is your match. Varsity when you find your coach.',
    reason: 'Your assessment shows committed habits and serious intent. Locker Room gives you the community and content to stay sharp while you explore the right coach for your Varsity journey.',
  },
};

function PlanRecommendation({ level }: { level: PlayerLevel }) {
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const rec = PLAN_RECS[level];

  return (
    <div className="iso-join__plans-wrap">

      {/* Section header */}
      <div className="iso-join__plans-header">
        <div className="iso-join__plans-eyebrow">Choose Your Plan</div>
        <h2 className="iso-join__plans-headline">Where Do You Want to Start?</h2>
        <p className="iso-join__plans-sub">
          Every ISO journey begins with Walk-On — free, no commitment. Upgrade whenever it makes sense for you.
        </p>
      </div>

      {/* Recommendation banner */}
      <div className="iso-join__rec-banner">
        <div className="iso-join__rec-tag">Our Recommendation</div>
        <p className="iso-join__rec-headline">{rec.headline}</p>
        <p className="iso-join__rec-reason">{rec.reason}</p>
      </div>

      {/* Plan cards */}
      <div className="iso-join__plan-cards">
        {PLANS.map(plan => {
          const isRec = plan.id === rec.planId;
          const isOpen = expanded === plan.id;
          return (
            <div
              key={plan.id}
              className={`iso-join__plan-card${isRec ? ' iso-join__plan-card--rec' : ''}`}
              style={{
                borderColor: isRec ? `${plan.color}55` : 'var(--border)',
                background: isRec
                  ? `radial-gradient(ellipse at 0% 0%, ${plan.color}12 0%, var(--surface) 60%)`
                  : 'var(--surface)',
              }}
            >
              <div className="iso-join__plan-top">
                <div className="iso-join__plan-top-left">
                  <div className="iso-join__plan-name" style={{ color: isRec ? plan.color : 'var(--silver)' }}>
                    {plan.name}
                    {isRec && <span className="iso-join__plan-rec-chip" style={{ background: `${plan.color}22`, color: plan.color }}>Recommended</span>}
                  </div>
                  <div className="iso-join__plan-price">{plan.price}</div>
                </div>
                {plan.badge && (
                  <span className="iso-join__plan-badge" style={{ background: `${plan.color}18`, color: plan.color, borderColor: `${plan.color}33` }}>
                    {plan.badge}
                  </span>
                )}
              </div>

              <ul className="iso-join__plan-features">
                {plan.features.map(f => (
                  <li key={f} className="iso-join__plan-feature">
                    <span className="iso-join__plan-check" style={{ color: plan.color }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Performance prediction toggle */}
              <button
                className="iso-join__pred-toggle"
                onClick={() => setExpanded(isOpen ? null : plan.id)}
              >
                <span>Performance Prediction</span>
                <span style={{ fontSize: 11, opacity: 0.5 }}>{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div className="iso-join__pred-body" style={{ borderColor: `${plan.color}22` }}>
                  <p className="iso-join__pred-text">{plan.prediction}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="iso-join__plans-footer">
        You can change or upgrade your plan at any time from your player portal.
      </p>
    </div>
  );
}

// ====================================================================
// TIER PROGRESSION VISUAL
// ====================================================================

function TierViz({ assignedTier }: { assignedTier: CoachTier }) {
  const tierIndex = COACH_TIERS.findIndex(t => t.id === assignedTier);

  return (
    <div className="iso-join__viz">
      <div className="iso-join__viz-label">Your Tier Path</div>
      <div className="iso-join__viz-track">
        <div className="iso-join__viz-line" />
        <div className="iso-join__viz-nodes">
          {COACH_TIERS.map((t, i) => {
            const isActive = i === tierIndex;
            const isLocked = t.locked;

            return (
              <div key={t.id} className="iso-join__viz-node">
                <div
                  className={[
                    'iso-join__viz-dot',
                    isActive ? 'iso-join__viz-dot--active' : '',
                    isLocked ? 'iso-join__viz-dot--locked' : '',
                  ].join(' ')}
                />
                <span
                  className={[
                    'iso-join__viz-name',
                    isActive ? 'iso-join__viz-name--active' : '',
                    isLocked ? 'iso-join__viz-name--locked' : '',
                  ].join(' ')}
                >
                  {t.label}
                </span>
                {isLocked && <span className="iso-join__viz-lock">🔒</span>}
                {isActive && <span className="iso-join__viz-you">You</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ====================================================================
// COACH CARD
// ====================================================================

function CoachCard({ result, answers }: { result: CoachResult; answers: Answers }) {
  const fname = (answers.fname as string) ?? '';
  const lname = (answers.lname as string) ?? (answers.c_name as string) ?? '';
  const name = `${fname} ${lname}`.trim() || 'Coach';
  const pathway = PATHWAYS.find(p => p.id === answers.c_pathway);
  const specialty = pathway?.name ?? 'Coaching';
  const role = (answers.c_role as string) ?? '';
  const tierIcon = result.tier === 'silver' ? '⚙️' : '🏅';
  const years = (answers.c_years as number) ?? 0;
  const strengthCount = result.strengths.length;
  const outcomeCount = ((answers.c_outcomes as string[]) ?? []).length;

  return (
    <div className="iso-join__cc-wrap">
      <div className="iso-join__cc">
        <div className="iso-join__cc-topbar" />
        <div className="iso-join__cc-scanlines" />
        <div className="iso-join__cc-sheen" />

        <div className="iso-join__cc-photo-area">
          <div className="iso-join__cc-bg-text">ISO</div>
          <div className="iso-join__cc-ovr">
            <div className="iso-join__cc-ovr-num">{result.overall}</div>
            <div className="iso-join__cc-ovr-lbl">Overall</div>
          </div>
          <div className="iso-join__cc-tier-wrap">
            <div className="iso-join__cc-tier-box">{tierIcon}</div>
            <div className="iso-join__cc-tier-name">{result.tierLabel}</div>
          </div>
          <div className="iso-join__cc-photo-fade" />
        </div>

        <div className="iso-join__cc-body">
          <div className="iso-join__cc-name">{name.toUpperCase()}</div>
          <div className="iso-join__cc-specialty">{specialty} {role ? `· ${role.split(' ').slice(0, 2).join(' ')}` : ''}</div>
          <div className="iso-join__cc-divider" />
          <div className="iso-join__cc-stats">
            <div className="iso-join__cc-stat">
              <span className="iso-join__cc-stat-val">{years}</span>
              <span className="iso-join__cc-stat-key">Years</span>
            </div>
            <div className="iso-join__cc-stat">
              <span className="iso-join__cc-stat-val">{strengthCount}</span>
              <span className="iso-join__cc-stat-key">Strengths</span>
            </div>
            <div className="iso-join__cc-stat">
              <span className="iso-join__cc-stat-val">{outcomeCount}</span>
              <span className="iso-join__cc-stat-key">Outcomes</span>
            </div>
          </div>
          <div className="iso-join__cc-tags">
            {result.strengths.slice(0, 3).map(s => (
              <span key={s} className="iso-join__cc-tag">{s.split(' ').slice(0, 3).join(' ')}</span>
            ))}
          </div>
        </div>

        <div className="iso-join__cc-footer">
          <span className="iso-join__cc-footer-text">ISO · Season 1</span>
          <span className="iso-join__cc-footer-text">{result.tierLabel} Coach</span>
        </div>
      </div>
    </div>
  );
}

// ====================================================================
// MAIN COMPONENT
// ====================================================================

interface JoinISOPageProps {
  onNavigate: (page: string) => void;
}

export function JoinISOPage({ onNavigate }: JoinISOPageProps) {
  const [screen, setScreen] = useState<Screen>('create-account');
  const [exiting, setExiting] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [otherText, setOtherText] = useState<Record<string, string>>({});
  const [playerResult, setPlayerResult] = useState<PlayerResult | null>(null);
  const [coachResult, setCoachResult] = useState<CoachResult | null>(null);
  const [procMsg, setProcMsg] = useState('Reading your intake...');

  // Account creation / sign-in state
  const [authMode, setAuthMode] = useState<'create' | 'signin'>('create');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // --- Build the active questions list based on role + pathway ---
  const questions = useMemo<Question[]>(() => {
    if (screen.startsWith('player') || screen === 'success-player') {
      const pw = (answers.pathway as string) ?? null;
      const pwQs = pw && PATHWAY_QS[pw] ? PATHWAY_QS[pw] : [];
      return [...PLAYER_BASE, ...pwQs, ...PLAYER_CORE];
    }
    if (screen.startsWith('coach') || screen === 'success-coach') {
      return COACH_QS;
    }
    return [];
  }, [screen, answers.pathway]);

  const totalQ = questions.length;
  const currentQuestion = questions[currentQ] ?? null;
  const progress = totalQ > 0 ? (currentQ / totalQ) * 100 : 0;

  // --- Validate current answer ---
  const isValid = useMemo(() => {
    if (!currentQuestion) return true;
    const q = currentQuestion;
    const a = answers[q.id];

    if (!q.required || q.optional) return true;

    switch (q.type) {
      case 'name':
        return !!((answers.fname as string)?.trim()) && !!((answers.lname as string)?.trim());
      case 'mc':
      case 'scenario':
        return !!a;
      case 'multi': {
        if ((q.multiMin ?? 1) === 0) return true;
        return Array.isArray(a) && a.length >= (q.multiMin ?? 1);
      }
      case 'slider':
        return a !== null && a !== undefined;
      case 'text':
      case 'input':
        return !!((a as string)?.trim());
      case 'textarea':
        return true; // optional textarea
      case 'pathway':
        return !!a;
      case 'checklist':
        return Array.isArray(a) && a.length === (q.options?.length ?? 0);
      default:
        return true;
    }
  }, [currentQuestion, answers]);

  // --- Smooth screen transition ---
  const goto = useCallback((next: Screen) => {
    setExiting(true);
    setTimeout(() => {
      setScreen(next);
      setCurrentQ(0);
      setExiting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 280);
  }, []);

  // --- Persist progress ---
  useEffect(() => {
    const nonPersistScreens: Screen[] = ['create-account', 'success-player', 'success-coach'];
    if (!nonPersistScreens.includes(screen)) {
      localStorage.setItem('iso-onboarding', JSON.stringify({ screen, currentQ, answers }));
    }
  }, [screen, currentQ, answers]);

  // --- Init: determine starting screen ---
  useEffect(() => {
    const user = localStorage.getItem('iso_demo_user');
    const onboardingDone = localStorage.getItem('iso_onboarding_complete');

    // Already fully onboarded — redirect to portal
    if (user && onboardingDone) {
      const portal = localStorage.getItem('iso_demo_portal');
      onNavigate(portal === 'coach' ? 'coach-portal' : 'player-portal');
      return;
    }

    // Logged in, onboarding not done — resume or start role selection
    if (user) {
      try {
        const saved = localStorage.getItem('iso-onboarding');
        if (saved) {
          const { screen: s, currentQ: q, answers: a } = JSON.parse(saved);
          if (s === 'player' || s === 'coach') {
            setScreen(s); setCurrentQ(q); setAnswers(a);
            return;
          }
        }
      } catch {}
      setScreen('join');
      return;
    }

    // Not logged in — show create account (default)
    setScreen('create-account');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateAnswer = (id: string, val: AnswerVal) =>
    setAnswers(prev => ({ ...prev, [id]: val }));

  const updateOther = (id: string, val: string) =>
    setOtherText(prev => ({ ...prev, [id]: val }));

  const handleNext = () => {
    if (!isValid) return;
    if (currentQ < totalQ - 1) {
      setCurrentQ(q => q + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      screen === 'player' ? submitPlayer() : submitCoach();
    }
  };

  const handleBack = () => {
    if (currentQ === 0) {
      goto('join');
    } else {
      setCurrentQ(q => q - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const submitPlayer = async () => {
    goto('player-proc');
    const msgs = [
      'Reading your intake...',
      'Analyzing commitment signals...',
      'Mapping your growth mindset...',
      'Placing you on the path...',
    ];
    let i = 0;
    const interval = setInterval(() => { i = (i + 1) % msgs.length; setProcMsg(msgs[i]); }, 1700);
    await new Promise(r => setTimeout(r, 3600));
    clearInterval(interval);
    setPlayerResult(scorePlayer(answers));
    setExiting(true);
    setTimeout(() => { setScreen('player-result'); setExiting(false); window.scrollTo({ top: 0 }); }, 280);
  };

  const submitCoach = async () => {
    goto('coach-proc');
    const msgs = [
      'Evaluating your credentials...',
      'Analyzing professional background...',
      'Scoring scenario responses...',
      'Calculating your Overall Rating...',
    ];
    let i = 0;
    const interval = setInterval(() => { i = (i + 1) % msgs.length; setProcMsg(msgs[i]); }, 1700);
    await new Promise(r => setTimeout(r, 4000));
    clearInterval(interval);
    setCoachResult(scoreCoach(answers));
    setExiting(true);
    setTimeout(() => { setScreen('coach-result'); setExiting(false); window.scrollTo({ top: 0 }); }, 280);
  };

  const clearProgress = () => {
    localStorage.removeItem('iso-onboarding');
    setAnswers({});
    setOtherText({});
    setCurrentQ(0);
  };

  // --- Account creation (mock — stores to localStorage) ---
  const handleCreateAccount = () => {
    if (!authEmail.trim()) { setAuthError('Please enter your email.'); return; }
    if (authPassword.length < 6) { setAuthError('Password must be at least 6 characters.'); return; }
    setAuthError('');
    const userData = { email: authEmail, roles: [] as string[] };
    localStorage.setItem('iso_demo_user', JSON.stringify(userData));
    goto('join');
  };

  // --- Sign in (mock — accepts any email/password) ---
  const handleSignIn = () => {
    if (!authEmail.trim()) { setAuthError('Please enter your email.'); return; }
    setAuthError('');
    const userData = { email: authEmail, roles: [] as string[] };
    localStorage.setItem('iso_demo_user', JSON.stringify(userData));
    const onboardingDone = localStorage.getItem('iso_onboarding_complete');
    if (onboardingDone) {
      const portal = localStorage.getItem('iso_demo_portal');
      onNavigate(portal === 'coach' ? 'coach-portal' : 'player-portal');
    } else {
      goto('join');
    }
  };

  // --- Mark onboarding complete ---
  const completeOnboarding = (role: 'player' | 'coach') => {
    localStorage.setItem('iso_onboarding_complete', 'true');
    localStorage.setItem('iso_demo_portal', role);
    const existing = localStorage.getItem('iso_demo_user');
    if (existing) {
      try {
        const u = JSON.parse(existing);
        u.roles = [role];
        localStorage.setItem('iso_demo_user', JSON.stringify(u));
      } catch {}
    }
    localStorage.removeItem('iso-onboarding');
  };

  const fname = (answers.fname as string) ?? '';
  const displayName = fname ? `, ${fname}` : '';

  // ====================================================================
  // RENDER
  // ====================================================================

  return (
    <div className={`iso-join${exiting ? ' iso-join--exiting' : ''}`}>

      {/* ── CREATE ACCOUNT / SIGN IN ── */}
      {screen === 'create-account' && (
        <div className="iso-join__screen">
          <div className="iso-join__auth">
            <div className="iso-join__auth-form">
              <div className="iso-join__season-tag" style={{ alignSelf: 'flex-start', marginBottom: 28 }}>
                <span className="iso-join__season-dot" />
                ISO · Season 1
              </div>

              <h1 className="iso-join__auth-headline">
                {authMode === 'create' ? 'Create Your Account.' : 'Welcome Back.'}
              </h1>
              <p className="iso-join__auth-sub">
                {authMode === 'create'
                  ? 'Start your ISO journey. Takes less than a minute.'
                  : 'Sign back in to continue your journey.'}
              </p>

              {/* Social buttons */}
              <button className="iso-join__social-btn" onClick={() => { localStorage.setItem('iso_demo_user', JSON.stringify({ email: 'google@user.com', roles: [] })); goto('join'); }}>
                <span className="iso-join__social-icon">G</span>
                Continue with Google
              </button>
              <button className="iso-join__social-btn" onClick={() => { localStorage.setItem('iso_demo_user', JSON.stringify({ email: 'apple@user.com', roles: [] })); goto('join'); }}>
                <span className="iso-join__social-icon">🍎</span>
                Continue with Apple
              </button>

              <div className="iso-join__auth-divider">
                <div className="iso-join__auth-divider-line" />
                <span className="iso-join__auth-divider-text">or with email</span>
                <div className="iso-join__auth-divider-line" />
              </div>

              {/* Email + password form */}
              <div className="iso-join__auth-field">
                <input
                  className="iso-join__text-input"
                  type="email"
                  placeholder="Email address"
                  value={authEmail}
                  onChange={e => { setAuthEmail(e.target.value); setAuthError(''); }}
                  onKeyDown={e => e.key === 'Enter' && (authMode === 'create' ? handleCreateAccount() : handleSignIn())}
                  autoFocus
                />
                <input
                  className="iso-join__text-input"
                  type="password"
                  placeholder={authMode === 'create' ? 'Create a password (6+ chars)' : 'Password'}
                  value={authPassword}
                  onChange={e => { setAuthPassword(e.target.value); setAuthError(''); }}
                  onKeyDown={e => e.key === 'Enter' && (authMode === 'create' ? handleCreateAccount() : handleSignIn())}
                />
              </div>

              {authError && <p className="iso-join__auth-error">{authError}</p>}

              <button
                className="iso-join__auth-cta"
                onClick={authMode === 'create' ? handleCreateAccount : handleSignIn}
                disabled={!authEmail.trim()}
              >
                {authMode === 'create' ? 'Create Account' : 'Sign In'}
              </button>

              <div className="iso-join__auth-toggle">
                {authMode === 'create' ? (
                  <>Already have an account?{' '}
                    <button onClick={() => { setAuthMode('signin'); setAuthError(''); }}>Sign in</button>
                  </>
                ) : (
                  <>New to ISO?{' '}
                    <button onClick={() => { setAuthMode('create'); setAuthError(''); }}>Create an account</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── JOIN / ROLE SELECT ── */}
      {screen === 'join' && (
        <div className="iso-join__screen">
          <div className="iso-join__hero">
            <div className="iso-join__season-tag">
              <span className="iso-join__season-dot" />
              ISO · Season 1
            </div>
            <h1 className="iso-join__headline">Choose Your Path.</h1>
            <p className="iso-join__subhead">Join ISO as a player or coach.</p>
            <div className="iso-join__cards">
              <button
                className="iso-join__card"
                onClick={() => { clearProgress(); setAnswers({}); setCurrentQ(0); goto('player'); }}
                aria-label="Join as Player"
              >
                <div className="iso-join__card-icon-wrap">🏅</div>
                <div className="iso-join__card-label">Join as</div>
                <div className="iso-join__card-title">Player</div>
                <div className="iso-join__card-desc">Develop your pathway. Find your level. Begin your ascent.</div>
                <div className="iso-join__card-cta">
                  Start assessment
                  <span className="iso-join__card-arrow">→</span>
                </div>
              </button>
              <button
                className="iso-join__card"
                onClick={() => { clearProgress(); setAnswers({}); setCurrentQ(0); goto('coach'); }}
                aria-label="Join as Coach"
              >
                <div className="iso-join__card-icon-wrap">⭐</div>
                <div className="iso-join__card-label">Join as</div>
                <div className="iso-join__card-title">Coach</div>
                <div className="iso-join__card-desc">Guide others through theirs. Build your legacy on ISO.</div>
                <div className="iso-join__card-cta">
                  Apply now
                  <span className="iso-join__card-arrow">→</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PLAYER QUESTIONS ── */}
      {screen === 'player' && currentQuestion && (() => {
        const pw = answers.pathway as string | undefined;
        const pwColor = pw ? (PATHWAYS.find(p => p.id === pw)?.color ?? null) : null;
        const pastPathwayQ = currentQuestion.type !== 'pathway' && !!pw;
        const pwIcon = pw ? PATHWAYS.find(p => p.id === pw)?.Icon : null;
        return (
        <div
          className="iso-join__screen iso-join__q-screen"
          style={{
            background: pastPathwayQ && pwColor
              ? `radial-gradient(ellipse at 50% -5%, ${pwColor}1c 0%, #0C0C0C 52%)`
              : '#0C0C0C',
            transition: 'background 0.8s ease',
          }}
        >
          {/* Watermark icon */}
          {pastPathwayQ && pwColor && pwIcon && React.createElement(pwIcon, {
            size: 440,
            strokeWidth: 0.3,
            style: {
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: pwColor,
              opacity: 0.04,
              pointerEvents: 'none',
              zIndex: 0,
              transition: 'opacity 0.8s ease',
            }
          })}
          {/* Progress bar */}
          <div className="iso-join__progress-bar">
            <div className="iso-join__pb-inner">
              <button className="iso-join__pb-back" onClick={handleBack} aria-label="Back">‹</button>
              <div className="iso-join__pb-track">
                <div className="iso-join__pb-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="iso-join__pb-count">{currentQ + 1} / {totalQ}</span>
              {currentQuestion.sectionLabel && (
                <span className="iso-join__pb-section">{currentQuestion.sectionLabel}</span>
              )}
            </div>
          </div>

          {/* Question body */}
          <div className="iso-join__q-body">
            <div key={currentQ} className="iso-join__q-content" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {currentQuestion.type !== 'scenario' && (
                <h2 className="iso-join__q-text">{currentQuestion.question}</h2>
              )}
              {currentQuestion.sub && currentQuestion.type !== 'scenario' && (
                <p className="iso-join__q-sub">{currentQuestion.sub}</p>
              )}
              {currentQuestion.type === 'scenario' && (
                <>
                  <h2 className="iso-join__q-text" style={{ fontSize: 'clamp(18px,3.5vw,28px)', marginBottom: '24px' }}>
                    How would you handle this?
                  </h2>
                </>
              )}
              <QuestionInput
                q={currentQuestion}
                answers={answers}
                otherText={otherText}
                onAnswer={updateAnswer}
                onOther={updateOther}
              />
            </div>
          </div>

          {/* Nav buttons */}
          <div className="iso-join__nav-bar">
            <div className="iso-join__nav-inner">
              <button
                className={`iso-join__btn-next${isValid ? ' iso-join__btn-next--ready' : ''}`}
                onClick={handleNext}
                disabled={!isValid}
              >
                {currentQ === totalQ - 1 ? 'Submit Assessment' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* ── PLAYER PROCESSING ── */}
      {screen === 'player-proc' && (
        <div className="iso-join__screen">
          <div className="iso-join__proc">
            <div className="iso-join__spinner" />
            <p className="iso-join__proc-msg">{procMsg}</p>
            <p className="iso-join__proc-sub">Analyzing your responses</p>
          </div>
        </div>
      )}

      {/* ── PLAYER RESULT ── */}
      {screen === 'player-result' && playerResult && (
        <div className="iso-join__screen">
          <div className="iso-join__result">
            <p className="iso-join__result-eyebrow">Your Placement</p>
            <h1 className="iso-join__result-level">{playerResult.levelLabel}</h1>
            <p className="iso-join__result-subtitle">
              {PATHWAYS.find(p => p.id === answers.pathway)?.name ?? 'ISO'} Pathway
            </p>

            <LevelViz assignedLevel={playerResult.level} />

            <div className="iso-join__result-mantra">
              <em>This is your starting point — not your ceiling.</em>
            </div>

            <div className="iso-join__info-box iso-join__info-box--gold">
              <div className="iso-join__info-box-tag iso-join__info-box-tag--gold">Why You Were Placed Here</div>
              <p className="iso-join__info-box-text">{playerResult.reasoning}</p>
            </div>

            <div className="iso-join__info-box iso-join__info-box--neutral">
              <div className="iso-join__info-box-tag iso-join__info-box-tag--neutral">Your Next Breakthrough</div>
              <p className="iso-join__info-box-text">{playerResult.breakthrough}</p>
            </div>

            <div style={{ height: 40 }} />

            <PlanRecommendation level={playerResult.level} />

            <div style={{ height: 40 }} />

            <button
              className="iso-join__btn-primary"
              onClick={() => goto('success-player')}
            >
              Accept My Placement
            </button>
          </div>
        </div>
      )}

      {/* ── PLAYER SUCCESS ── */}
      {screen === 'success-player' && playerResult && (
        <div className="iso-join__screen">
          <div className="iso-join__success">
            <div className="iso-join__success-mark">🏅</div>
            <h1 className="iso-join__success-title">Welcome{displayName}.</h1>
            <p className="iso-join__success-msg">
              Your ISO profile has been created. You've been placed at <strong style={{ color: '#A8A8A8' }}>{playerResult.levelLabel}</strong> in the {PATHWAYS.find(p => p.id === answers.pathway)?.name ?? 'ISO'} pathway.
              Your journey starts now.
            </p>
            <div className="iso-join__success-badge">ISO {playerResult.levelLabel} · Season 1</div>
            <button className="iso-join__btn-primary" onClick={() => { completeOnboarding('player'); onNavigate('player-portal'); }}>
              Enter My Portal
            </button>
            <button className="iso-join__btn-home" style={{ marginTop: 10 }} onClick={() => { completeOnboarding('player'); onNavigate('home'); }}>
              Back to ISO
            </button>
          </div>
        </div>
      )}

      {/* ── COACH QUESTIONS ── */}
      {screen === 'coach' && currentQuestion && (
        <div className="iso-join__screen iso-join__q-screen">
          <div className="iso-join__progress-bar">
            <div className="iso-join__pb-inner">
              <button className="iso-join__pb-back" onClick={handleBack} aria-label="Back">‹</button>
              <div className="iso-join__pb-track">
                <div className="iso-join__pb-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="iso-join__pb-count">{currentQ + 1} / {totalQ}</span>
              {currentQuestion.sectionLabel && (
                <span className="iso-join__pb-section">{currentQuestion.sectionLabel}</span>
              )}
            </div>
          </div>

          <div className="iso-join__q-body">
            <div key={currentQ} className="iso-join__q-content" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {currentQuestion.type !== 'scenario' && (
                <h2 className="iso-join__q-text">{currentQuestion.question}</h2>
              )}
              {currentQuestion.sub && currentQuestion.type !== 'scenario' && (
                <p className="iso-join__q-sub">{currentQuestion.sub}</p>
              )}
              {currentQuestion.type === 'scenario' && (
                <h2 className="iso-join__q-text" style={{ fontSize: 'clamp(18px,3.5vw,28px)', marginBottom: '24px' }}>
                  How would you respond?
                </h2>
              )}
              <QuestionInput
                q={currentQuestion}
                answers={answers}
                otherText={otherText}
                onAnswer={updateAnswer}
                onOther={updateOther}
              />
            </div>
          </div>

          <div className="iso-join__nav-bar">
            <div className="iso-join__nav-inner">
              <button
                className={`iso-join__btn-next${isValid ? ' iso-join__btn-next--ready' : ''}`}
                onClick={handleNext}
                disabled={!isValid}
              >
                {currentQ === totalQ - 1 ? 'Submit Application' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── COACH PROCESSING ── */}
      {screen === 'coach-proc' && (
        <div className="iso-join__screen">
          <div className="iso-join__proc">
            <div className="iso-join__spinner" />
            <p className="iso-join__proc-msg">{procMsg}</p>
            <p className="iso-join__proc-sub">Reviewing your application</p>
          </div>
        </div>
      )}

      {/* ── COACH RESULT ── */}
      {screen === 'coach-result' && coachResult && (
        <div className="iso-join__screen">
          <div className="iso-join__result">
            <p className="iso-join__result-eyebrow">Your Coach Card</p>
            <h1 className="iso-join__result-level" style={{ fontSize: 'clamp(52px,12vw,88px)', marginBottom: 4 }}>
              {coachResult.overall}
            </h1>
            <p className="iso-join__result-subtitle">{coachResult.tierLabel} Coach · Season 1</p>

            <CoachCard result={coachResult} answers={answers} />

            <TierViz assignedTier={coachResult.tier} />

            <div className="iso-join__info-box iso-join__info-box--gold">
              <div className="iso-join__info-box-tag iso-join__info-box-tag--gold">Your Strengths</div>
              <p className="iso-join__info-box-text">
                {coachResult.strengths.map((s, i) => <span key={i}>{i > 0 && ' · '}<strong>{s}</strong></span>)}
              </p>
            </div>

            {coachResult.opportunities.length > 0 && (
              <div className="iso-join__info-box iso-join__info-box--neutral">
                <div className="iso-join__info-box-tag iso-join__info-box-tag--neutral">Growth Opportunities</div>
                <p className="iso-join__info-box-text">
                  {coachResult.opportunities.join(' · ')}
                </p>
              </div>
            )}

            <div className="iso-join__info-box iso-join__info-box--neutral">
              <div className="iso-join__info-box-tag iso-join__info-box-tag--neutral">What This Rating Means</div>
              <p className="iso-join__info-box-text">
                {coachResult.reasoning}
                {' '}
                <strong>Your intake establishes your starting point. Continued excellence, impact, and contribution determine future advancement.</strong>
              </p>
            </div>

            <div className="iso-join__result-mantra">
              <em>Your Overall reflects who you are on ISO today — not simply your credentials on paper.</em>
            </div>

            <button
              className="iso-join__btn-primary"
              onClick={() => goto('success-coach')}
            >
              Submit to Advisory Board
            </button>
          </div>
        </div>
      )}

      {/* ── COACH SUCCESS ── */}
      {screen === 'success-coach' && coachResult && (
        <div className="iso-join__screen">
          <div className="iso-join__success">
            <div className="iso-join__success-mark">⭐</div>
            <h1 className="iso-join__success-title">Submitted.</h1>
            <p className="iso-join__success-msg">
              Your application has been submitted for ISO Advisory Board review.
              We'll be in touch at the email you provided. In the meantime, your {coachResult.tierLabel} Coach profile is being prepared.
            </p>
            <div className="iso-join__success-badge">
              {coachResult.tierLabel} Coach · Overall {coachResult.overall} · Season 1
            </div>
            <button className="iso-join__btn-primary" onClick={() => { completeOnboarding('coach'); onNavigate('coach-portal'); }}>
              Enter Coach Portal
            </button>
            <button className="iso-join__btn-home" style={{ marginTop: 10 }} onClick={() => { completeOnboarding('coach'); onNavigate('home'); }}>
              Back to ISO
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default JoinISOPage;
