// AI Matching Algorithm for Mentor-Mentee Compatibility

export interface MenteeProfile {
  // From questionnaire
  commitment: string;
  goals: string;
  timeframe: string;
  challenges: string;
  
  // Additional matching data
  learningStyle: 'visual' | 'hands-on' | 'reading' | 'discussion' | '';
  communicationPreference: 'direct' | 'supportive' | 'balanced' | '';
  structurePreference: 'structured' | 'flexible' | 'adaptive' | '';
  workStyle: 'independent' | 'collaborative' | 'mixed' | '';
  primaryGoalType: 'career-change' | 'skill-building' | 'leadership' | 'entrepreneurship' | 'academic' | '';
  motivationLevel: 'exploring' | 'committed' | 'all-in' | '';
  
  // Values
  topValues: string[];
  faithImportance: 'central' | 'moderate' | 'flexible' | '';
}

export interface MentorProfile {
  // Basic Info
  bio: string;
  yearsOfExperience: string;
  currentRole: string;
  
  // Expertise Areas
  expertiseAreas: string[];
  specificSkills: string[];
  industryExperience: string[];
  
  // Mentoring Style
  mentoringStyle: 'hands-on' | 'advisory' | 'balanced' | '';
  communicationStyle: 'direct' | 'supportive' | 'balanced' | '';
  structurePreference: 'structured' | 'flexible' | 'adaptive' | '';
  
  // Availability
  weeklyHoursAvailable: string;
  preferredMeetingTimes: string[];
  maxMentees: string;
  
  // Mentee Preferences
  idealMenteeTraits: string[];
  mentoringGoals: string;
  successStories: string;
  
  // Values & Approach
  coreValues: string[];
  faithIntegration: string;
  motivations: string;
}

export interface MatchResult {
  score: number;
  topReasons: string[];
  styleAlignment: {
    mentoring: string;
    communication: string;
    structure: string;
  };
  availabilityMatch: string;
  confidenceLevel: 'high' | 'medium' | 'low';
}

export function calculateMatch(mentee: MenteeProfile, mentor: MentorProfile): MatchResult {
  let totalScore = 0;
  const reasons: string[] = [];
  const maxScore = 100;
  
  // 1. Communication Style Match (20 points)
  if (mentee.communicationPreference && mentor.communicationStyle) {
    if (mentee.communicationPreference === mentor.communicationStyle) {
      totalScore += 20;
      reasons.push('Communication styles perfectly align');
    } else if (mentor.communicationStyle === 'balanced') {
      totalScore += 15;
      reasons.push('Mentor adapts communication style to your needs');
    } else {
      totalScore += 10;
    }
  } else {
    totalScore += 10; // neutral score if data missing
  }
  
  // 2. Structure Preference Match (15 points)
  if (mentee.structurePreference && mentor.structurePreference) {
    if (mentee.structurePreference === mentor.structurePreference) {
      totalScore += 15;
      reasons.push('Both prefer the same learning structure');
    } else if (mentor.structurePreference === 'adaptive') {
      totalScore += 12;
      reasons.push('Mentor adapts structure to your pace');
    } else {
      totalScore += 7;
    }
  } else {
    totalScore += 7;
  }
  
  // 3. Time Commitment Match (15 points)
  if (mentee.timeframe && mentor.weeklyHoursAvailable) {
    const menteeHours = parseTimeframe(mentee.timeframe);
    const mentorHours = parseTimeframe(mentor.weeklyHoursAvailable);
    
    if (menteeHours <= mentorHours) {
      totalScore += 15;
      reasons.push('Your time commitment fits their availability');
    } else {
      totalScore += 8;
    }
  } else {
    totalScore += 8;
  }
  
  // 4. Values Alignment (15 points)
  if (mentee.topValues.length > 0 && mentor.coreValues.length > 0) {
    const sharedValues = mentee.topValues.filter(v => mentor.coreValues.includes(v));
    const valueScore = Math.min(15, (sharedValues.length / Math.min(mentee.topValues.length, 3)) * 15);
    totalScore += valueScore;
    
    if (sharedValues.length > 0) {
      reasons.push(`Shared core values: ${sharedValues.slice(0, 2).join(', ')}`);
    }
  } else {
    totalScore += 7;
  }
  
  // 5. Expertise Match (20 points)
  const goalKeywords = extractKeywords(mentee.goals);
  const mentorKeywords = [
    ...mentor.expertiseAreas,
    ...mentor.specificSkills,
    ...extractKeywords(mentor.bio)
  ].map(k => k.toLowerCase());
  
  let expertiseMatches = 0;
  goalKeywords.forEach(keyword => {
    if (mentorKeywords.some(mk => mk.includes(keyword) || keyword.includes(mk))) {
      expertiseMatches++;
    }
  });
  
  if (expertiseMatches > 0) {
    totalScore += Math.min(20, expertiseMatches * 5);
    reasons.push('Strong expertise alignment with your goals');
  } else {
    totalScore += 10;
  }
  
  // 6. Motivation & Commitment Match (15 points)
  if (mentee.motivationLevel) {
    if (mentee.motivationLevel === 'all-in' && mentor.mentoringStyle === 'hands-on') {
      totalScore += 15;
      reasons.push('Your high commitment matches their hands-on approach');
    } else if (mentee.motivationLevel === 'committed') {
      totalScore += 12;
      reasons.push('Good commitment level for this mentorship');
    } else {
      totalScore += 8;
    }
  } else {
    totalScore += 8;
  }
  
  // Normalize score to 0-100
  const normalizedScore = Math.min(100, Math.round(totalScore));
  
  // Get top 3 reasons
  const topReasons = reasons.slice(0, 3);
  
  // Build style alignment summary
  const styleAlignment = {
    mentoring: getMentoringStyleDescription(mentor.mentoringStyle),
    communication: getCommunicationStyleDescription(mentor.communicationStyle),
    structure: getStructureDescription(mentor.structurePreference)
  };
  
  // Availability match description
  const availabilityMatch = getAvailabilityDescription(mentee.timeframe, mentor.weeklyHoursAvailable);
  
  // Confidence level
  let confidenceLevel: 'high' | 'medium' | 'low' = 'medium';
  if (normalizedScore >= 85) confidenceLevel = 'high';
  else if (normalizedScore < 70) confidenceLevel = 'low';
  
  return {
    score: normalizedScore,
    topReasons,
    styleAlignment,
    availabilityMatch,
    confidenceLevel
  };
}

// Helper functions
function parseTimeframe(timeframe: string): number {
  if (!timeframe) return 0;
  
  if (timeframe.includes('1-2')) return 1.5;
  if (timeframe.includes('3-5')) return 4;
  if (timeframe.includes('5-10')) return 7.5;
  if (timeframe.includes('10+') || timeframe.includes('10-plus')) return 12;
  
  return 5; // default
}

function extractKeywords(text: string): string[] {
  if (!text) return [];
  
  const keywords = text.toLowerCase()
    .split(/[\s,.-]+/)
    .filter(word => word.length > 3)
    .filter(word => !['this', 'that', 'with', 'from', 'have', 'been', 'want', 'need'].includes(word));
  
  return [...new Set(keywords)];
}

function getMentoringStyleDescription(style: string): string {
  switch (style) {
    case 'hands-on':
      return 'Hands-on coach with active guidance';
    case 'advisory':
      return 'Advisory style with strategic direction';
    case 'balanced':
      return 'Balanced approach, adapts to your needs';
    default:
      return 'Flexible mentoring approach';
  }
}

function getCommunicationStyleDescription(style: string): string {
  switch (style) {
    case 'direct':
      return 'Direct, straightforward feedback';
    case 'supportive':
      return 'Supportive, encouraging approach';
    case 'balanced':
      return 'Balanced communication style';
    default:
      return 'Adaptive communication';
  }
}

function getStructureDescription(preference: string): string {
  switch (preference) {
    case 'structured':
      return 'Structured curriculum with clear milestones';
    case 'flexible':
      return 'Flexible, adapts to your pace';
    case 'adaptive':
      return 'Mix of structure and flexibility';
    default:
      return 'Adaptable structure';
  }
}

function getAvailabilityDescription(menteeTime: string, mentorTime: string): string {
  const menteeHours = parseTimeframe(menteeTime);
  const mentorHours = parseTimeframe(mentorTime);
  
  if (menteeHours <= mentorHours) {
    return 'Excellent - Your schedules align well';
  } else {
    return 'Your time commitment may need adjustment';
  }
}
