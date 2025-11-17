import { X, Search, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar } from './ui/calendar';
import { ISOEvaluationModal } from './ISOEvaluationModal';
import { calculateMatch, type MenteeProfile, type MentorProfile } from '../utils/matching';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { CoachTradingCard } from './CoachTradingCard';

// Mock availability data - in production, this would come from a backend/database
const mentorAvailability: Record<string, Array<{date: string, slots: Array<{id: string, start: string, end: string, booked?: boolean}>}>> = {
  'Imam Abdullah Rahman': [
    { 
      date: '2024-11-15', 
      slots: [
        { id: '1', start: '09:00', end: '10:00' },
        { id: '2', start: '14:00', end: '15:00' },
        { id: '3', start: '16:00', end: '17:00' }
      ]
    },
    { 
      date: '2024-11-16', 
      slots: [
        { id: '4', start: '10:00', end: '11:00' },
        { id: '5', start: '15:00', end: '16:00' }
      ]
    }
  ],
  'Sister Amina Khalid': [
    { 
      date: '2024-11-15', 
      slots: [
        { id: '6', start: '11:00', end: '12:00' },
        { id: '7', start: '13:00', end: '14:00' }
      ]
    }
  ],
  'Coach Marcus Thompson': [
    { 
      date: '2024-11-17', 
      slots: [
        { id: '8', start: '08:00', end: '09:00' },
        { id: '9', start: '17:00', end: '18:00' }
      ]
    }
  ],
  'Dr. Sarah Mitchell': [
    { 
      date: '2024-11-18', 
      slots: [
        { id: '10', start: '10:00', end: '11:00' },
        { id: '11', start: '14:00', end: '15:00' },
        { id: '12', start: '15:00', end: '16:00' }
      ]
    }
  ]
};

interface MentorModalProps {
  category: {
    id: string;
    title: string;
    emoji: string;
    description: string;
    tagline: string;
    color: string;
  };
  onClose: () => void;
  onNavigateToCallIso?: (coachName: string) => void;
}

const mentorData: Record<string, Array<{
  name: string;
  role: string;
  bio: string;
  varsityPrice: number;
  yearsExperience: number;
  specialization: string[];
  successRate?: string;
  tier: 'standard' | 'specialist' | 'premium';
  additionalPerks?: string[];
}>> = {
  deen: [
    { 
      name: 'Imam Abdullah Rahman', 
      role: 'Islamic Scholar & Youth Mentor', 
      bio: 'Dedicated to helping young Muslims navigate faith in modern society. 15+ years of experience in youth development and Islamic education.',
      varsityPrice: 45,
      yearsExperience: 15,
      specialization: ['Quran Study', 'Youth Development', 'Spiritual Counseling'],
      successRate: '95% player satisfaction',
      tier: 'premium',
      additionalPerks: ['Direct access to Islamic scholars network', 'Monthly group spiritual sessions']
    },
    { 
      name: 'Sister Amina Khalid', 
      role: 'Spiritual Counselor', 
      bio: 'Certified counselor specializing in faith-based mental wellness and personal development for student athletes.',
      varsityPrice: 25,
      yearsExperience: 7,
      specialization: ['Mental Wellness', 'Faith Integration', 'Student Athletes'],
      tier: 'standard'
    },
  ],
  health: [
    { 
      name: 'Osaid Sasi', 
      role: 'Strength & Conditioning Coach', 
      bio: 'CEO of Iron Fortress, a calesthenics training brand for athletes and fitness enthusiasts. Passionate about building discipline through physical excellence.',
      varsityPrice: 35,
      yearsExperience: 5,
      specialization: ['Calesthenics Training', 'Athletic Performance', 'Nutrition','Entrepreneurship'],
      successRate: '15+ athletes trained',
      tier: 'specialist',
      additionalPerks: ['Custom workout video library', 'Form check videos within 24hrs']
    },
    { 
      name: 'Dr. Sarah Mitchell', 
      role: 'Sports Psychologist', 
      bio: 'Specializes in mental health and peak performance for young athletes. Licensed clinical psychologist.',
      varsityPrice: 65,
      yearsExperience: 12,
      specialization: ['Sports Psychology', 'Mental Performance', 'Clinical Therapy'],
      successRate: 'Licensed therapist',
      tier: 'premium',
      additionalPerks: ['Access to mental health resources library', 'Crisis support availability']
    },
  ],
  medicine: [
    { 
      name: 'Dr. Hassan Ahmed', 
      role: 'Emergency Medicine Physician', 
      bio: 'Practicing ER doctor and pre-med advisor. Committed to coaching the next generation of healthcare professionals.',
      varsityPrice: 55,
      yearsExperience: 14,
      specialization: ['Medical School Prep', 'Clinical Experience', 'MCAT Strategy'],
      successRate: '85% med school acceptance rate',
      tier: 'premium',
      additionalPerks: ['Clinical shadowing opportunities', 'Medical school interview prep']
    },
    { 
      name: 'Wacim Benyoucef', 
      role: '3rd Year Medical Student at the University of Missouri Columbia', 
      bio: 'Dedicated to compassionate care and coaching students interested in healthcare careers.',
      varsityPrice: 0,
      yearsExperience: 1,
      specialization: ['Public and Global Health', 'Policy', 'Medical Education'],
      tier: 'standard'
    },
  ],
  engineering: [
    { 
      name: 'Anis Benyoucef', 
      role: '5x Intern - Apple, Zoox, Stanford Research', 
      bio: 'I have 2+ years of internship experience across leading companies such as Apple and Zoox, giving me diverse experience in product design, hardware testing and validation, manufacturing, and quality. Passionate about community building and leadership',
      varsityPrice: 40,
      yearsExperience: 5,
      specialization: ['Big Tech Recruiting', 'Hardware Engineering', 'Product Design', 'Interview Prep'],
      successRate: '20+ players placed at top tech companies',
      tier: 'specialist',
      additionalPerks: ['Resume review within 48hrs', 'Referral opportunities at Apple/Zoox']
    },
    { 
      name: 'Dr. Layla Chen', 
      role: 'Mechanical Engineer & Researcher', 
      bio: 'PhD in Robotics. Focused on innovation and coaching underrepresented students in STEM fields.',
      varsityPrice: 50,
      yearsExperience: 12,
      specialization: ['Robotics', 'Research Methods', 'Graduate School Prep'],
      successRate: 'PhD advisor',
      tier: 'premium',
      additionalPerks: ['Research lab connections', 'Academic publication guidance']
    },
  ],
  entrepreneurship: [
    { 
      name: 'Jamal Williams', 
      role: 'Social Entrepreneur & Founder', 
      bio: 'Founded three successful startups. Now dedicated to helping young entrepreneurs build sustainable businesses.',
      varsityPrice: 75,
      yearsExperience: 18,
      specialization: ['Startup Strategy', 'Fundraising', 'Social Impact'],
      successRate: '3 exits, $50M+ raised',
      tier: 'premium',
      additionalPerks: ['Investor introductions', 'Pitch deck teardowns', 'Founder community access']
    },
    { 
      name: 'Aisha Mohammed', 
      role: 'Venture Capitalist', 
      bio: 'Investing in purpose-driven startups. Coach to aspiring founders looking to create meaningful impact.',
      varsityPrice: 60,
      yearsExperience: 10,
      specialization: ['Venture Capital', 'Investment Strategy', 'Pitch Preparation'],
      successRate: '$100M+ invested',
      tier: 'premium',
      additionalPerks: ['VC network access', 'Investment readiness assessment']
    },
  ],
  global: [
    { 
      name: 'Ambassador David Chen', 
      role: 'Former Diplomat & Policy Advisor', 
      bio: '20 years in international relations. Now coaching students interested in global affairs and diplomacy.',
      varsityPrice: 70,
      yearsExperience: 20,
      specialization: ['International Relations', 'Diplomacy', 'Policy Analysis'],
      successRate: 'Former US Ambassador',
      tier: 'premium',
      additionalPerks: ['UN/State Dept connections', 'Policy writing workshops']
    },
    { 
      name: 'Nadia Ibrahim', 
      role: 'International Business Consultant', 
      bio: 'Advising Fortune 500 companies on global strategy. Passionate about ethical leadership development.',
      varsityPrice: 45,
      yearsExperience: 12,
      specialization: ['Global Business', 'Strategy Consulting', 'Leadership'],
      successRate: 'Fortune 500 consultant',
      tier: 'specialist',
      additionalPerks: ['Corporate strategy frameworks', 'Executive presence training']
    },
  ],
};

export function MentorModal({ category, onClose, onNavigateToCallIso }: MentorModalProps) {
  const mentors = mentorData[category.id] || [];
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showCalendarForMentor, setShowCalendarForMentor] = useState<string | null>(null);
  const [isISOEvaluationModalOpen, setIsISOEvaluationModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<typeof mentors[0] | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'match' | 'experience' | 'overall' | 'availability'>('match');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingCard, setViewingCard] = useState<typeof mentors[0] | null>(null);
  const [animatingCardId, setAnimatingCardId] = useState<string | null>(null);

  // Get mentee profile from props or context (would come from auth in production)
  // For now, using mock data - in production this would come from logged-in user
  const menteeProfile: MenteeProfile = {
    commitment: '',
    goals: 'Land a software engineering role and build my skills',
    timeframe: '5-10-hours',
    challenges: '',
    learningStyle: '',
    communicationPreference: 'balanced',
    structurePreference: 'adaptive',
    workStyle: '',
    primaryGoalType: '',
    motivationLevel: 'all-in',
    topValues: ['Excellence', 'Growth Mindset', 'Accountability'],
    faithImportance: ''
  };

  // Mock mentor profiles for matching
  const getMentorProfile = (mentorName: string): MentorProfile => {
    // In production, this would come from a database
    const baseProfile = {
      bio: mentors.find(m => m.name === mentorName)?.bio || '',
      yearsOfExperience: '8',
      currentRole: mentors.find(m => m.name === mentorName)?.role || '',
      expertiseAreas: ['Career Transition', 'Interview Prep', 'Leadership Development'],
      specificSkills: [],
      industryExperience: [],
      mentoringStyle: 'balanced' as const,
      communicationStyle: 'balanced' as const,
      structurePreference: 'adaptive' as const,
      weeklyHoursAvailable: '3-5',
      preferredMeetingTimes: ['Weekday Evenings', 'Weekend Afternoons'],
      maxMentees: '3-5',
      idealMenteeTraits: ['Highly Motivated', 'Open to Feedback', 'Goal-Oriented'],
      mentoringGoals: 'Help mentees achieve their career goals',
      successStories: 'Various success stories',
      coreValues: ['Excellence', 'Integrity', 'Growth Mindset', 'Faith-Centered'],
      faithIntegration: 'Integrate faith into all aspects of mentoring',
      motivations: 'Passionate about helping others succeed'
    };
    
    // Customize based on mentor
    if (mentorName === 'Anis Benyoucef') {
      return {
        ...baseProfile,
        mentoringStyle: 'hands-on',
        communicationStyle: 'supportive',
        expertiseAreas: ['Career Transition', 'Technical Skills', 'Interview Prep'],
        coreValues: ['Excellence', 'Community', 'Growth Mindset']
      };
    }
    
    return baseProfile;
  };

  const getMatchScore = (mentorName: string) => {
    if (!menteeProfile) return null;
    const mentorProfile = getMentorProfile(mentorName);
    return calculateMatch(menteeProfile, mentorProfile);
  };

  const getMatchColor = (score: number) => {
    if (score >= 85) return 'text-green-400 bg-green-500/10 border-green-500/30';
    if (score >= 70) return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 85) return 'Excellent Match';
    if (score >= 70) return 'Good Match';
    return 'Fair Match';
  };

  const getAvailableSlots = (mentorName: string, date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    return mentorAvailability[mentorName]?.find(d => d.date === formattedDate)?.slots || [];
  };

  const getTierBadgeStyle = (tier: 'standard' | 'specialist' | 'premium') => {
    switch (tier) {
      case 'premium':
        return 'bg-green-600 text-white border-green-400 shadow-xl';
      case 'specialist':
        return 'bg-blue-600 text-white border-blue-400 shadow-xl';
      case 'standard':
        return 'bg-slate-800 text-white border-slate-400 shadow-xl';
    }
  };

  const getTierLabel = (tier: 'standard' | 'specialist' | 'premium') => {
    switch (tier) {
      case 'premium':
        return '⭐ Premium Coach';
      case 'specialist':
        return '🎯 Specialist';
      case 'standard':
        return '✓ Standard';
    }
  };

  // Get availability status (mock data - in production would come from backend)
  const getAvailabilityStatus = (mentorName: string): string => {
    const availability = mentorAvailability[mentorName];
    if (!availability || availability.length === 0) return 'Unavailable';
    const totalSlots = availability.reduce((sum, day) => sum + day.slots.length, 0);
    if (totalSlots > 10) return 'High';
    if (totalSlots > 5) return 'Medium';
    return 'Low';
  };

  // Get overall score (60-100) from rating (mock data - in production would come from backend)
  const getOverall = (mentorName: string): number => {
    const ratings: Record<string, number> = {
      'Imam Abdullah Rahman': 4.9,
      'Sister Amina Khalid': 4.7,
      'Osaid Sasi': 4.8,
      'Dr. Sarah Mitchell': 4.9,
      'Dr. Hassan Ahmed': 4.8,
      'Wacim Benyoucef': 4.6,
      'Anis Benyoucef': 4.9,
      'Dr. Layla Chen': 4.7,
      'Jamal Williams': 4.9,
      'Aisha Mohammed': 4.8,
      'Ambassador David Chen': 4.9,
      'Nadia Ibrahim': 4.7,
    };
    const rating = ratings[mentorName] || 4.5;
    // Convert 1-5 rating to 60-100 overall scale
    return Math.round(60 + (rating / 5) * 40);
  };

  // Filter and sort mentors
  const getFilteredAndSortedMentors = () => {
    let filtered = mentors;
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(mentor =>
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.specialization.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'experience':
          return b.yearsExperience - a.yearsExperience;
        case 'overall':
          return getOverall(b.name) - getOverall(a.name);
        case 'availability':
          const availA = getAvailabilityStatus(a.name);
          const availB = getAvailabilityStatus(b.name);
          const availOrder = { 'High': 3, 'Medium': 2, 'Low': 1, 'Unavailable': 0 };
          return availOrder[availB as keyof typeof availOrder] - availOrder[availA as keyof typeof availOrder];
        case 'match':
        default:
          const matchA = getMatchScore(a.name)?.score || 0;
          const matchB = getMatchScore(b.name)?.score || 0;
          return matchB - matchA;
      }
    });
  };

  const filteredMentors = getFilteredAndSortedMentors();
  
  const getImageSrc = (mentorName: string) => {
    return `https://images.unsplash.com/photo-1609503842755-77f4a81d69ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50b3IlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYyNjQ0MTgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral`;
  };

  return (
    <>
      {!viewingCard && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
          onClick={onClose}
          style={{ display: viewingCard ? 'none' : 'flex' }}
        >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`bg-gradient-to-br ${category.color} p-8 text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{category.emoji}</span>
            <div>
              <h2 className="text-white mb-2">{category.title}</h2>
              <p className="text-white/90">{category.description}</p>
            </div>
          </div>
          <p className="text-white/95 italic text-lg">{category.tagline}</p>
        </div>

        {/* Mentors */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-280px)] bg-slate-900">
          {/* Collapsible Info Section */}
          <Accordion type="multiple" className="mb-8 space-y-2" defaultValue={[]}>
            {/* Match Score Explanation */}
            <AccordionItem value="match-scores" className="border border-slate-700 rounded-xl bg-slate-800/50 px-4 overflow-hidden">
              <AccordionTrigger className="text-white hover:no-underline py-4 [&>svg]:text-slate-400">
                <div className="flex items-center gap-2">
                  <span>💡</span>
                  <span className="font-medium">Understanding Match Scores</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 text-sm pb-4">
                Match percentages are based on your profile and help identify strong initial compatibility — but they're <span className="text-orange-400">not the final word</span>. If a coach's story, expertise, or journey resonates with you, that matters more than any algorithm. Trust your instincts! A <span className="text-orange-400">Try Out</span> is always a great way to explore the connection, regardless of the score. Sometimes the best mentorships come from unexpected pairings.
              </AccordionContent>
            </AccordionItem>

            {/* Try Outs - Quick Chat */}
            <AccordionItem value="try-outs" className="border border-slate-700 rounded-xl bg-slate-800/50 px-4 overflow-hidden">
              <AccordionTrigger className="text-white hover:no-underline py-4 [&>svg]:text-slate-400">
                <span className="font-medium">Try Outs</span>
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 pb-4">
                Not ready to commit yet? Start with a quick, no-pressure conversation. Think of it as a first consultation — just you and a coach, exploring what's possible.
              </AccordionContent>
            </AccordionItem>

            {/* Call an ISO - Full Commitment */}
            <AccordionItem value="call-iso" className="border border-orange-500/20 rounded-xl bg-slate-800 px-4 overflow-hidden">
              <AccordionTrigger className="text-white hover:no-underline py-4 [&>svg]:text-slate-400">
                <span className="font-medium">Call an ISO</span>
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 pb-4">
                When you're ready to dive in fully, call an ISO. Get matched with coaches who align with your goals and values. Get access to exclusive mentorship nights, inspiring events, and local initiatives.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <h3 className="text-white text-2xl font-bold mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Coaches</h3>
          
          {/* Search and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Coach Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
              <option value="match">Sort by: Best Match</option>
              <option value="overall">Sort by: Overall</option>
              <option value="experience">Sort by: Experience</option>
              <option value="availability">Sort by: Availability</option>
              </select>
          </div>
          
          {/* Coach Roster Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-800 border-b-2 border-slate-700">
                  <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>Photo</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>Title</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>Match Score</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>Overall</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>Availability</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMentors.map((mentor, index) => (
                  <tr 
                key={index}
                    className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700">
                  <ImageWithFallback
                          src={getImageSrc(mentor.name)}
                    alt={mentor.name}
                    className={`w-full h-full ${mentor.name === 'Anis Benyoucef' ? 'object-contain' : 'object-cover'}`}
                  />
                </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-white font-medium">{mentor.name}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-slate-400 text-sm">{mentor.role}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                  {(() => {
                    const matchResult = getMatchScore(mentor.name);
                    if (matchResult) {
                      return (
                          <Badge className={`${getMatchColor(matchResult.score)} border text-sm px-3 py-1`}>
                            {matchResult.score}% Match
                          </Badge>
                      );
                    }
                        return <span className="text-slate-400 text-sm">—</span>;
                  })()}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-semibold">{getOverall(mentor.name)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCalendarForMentor(mentor.name);
                          setSelectedDate(undefined);
                          setSelectedTimeSlot(null);
                        }}
                        className="text-white px-4 py-2 rounded-lg transition-all text-sm font-medium relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                          boxShadow: '0 0 20px rgba(59, 130, 246, 0.5), 0 4px 14px 0 rgba(59, 130, 246, 0.3)',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.7), 0 6px 20px 0 rgba(59, 130, 246, 0.4)';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5), 0 4px 14px 0 rgba(59, 130, 246, 0.3)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <span style={{ position: 'relative', zIndex: 1 }}>Book a Try Out</span>
                      </button>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAnimatingCardId(mentor.name);
                          // Delay opening card to show animation
                          setTimeout(() => {
                            setViewingCard(mentor);
                            setAnimatingCardId(null);
                          }, 400);
                        }}
                        className="text-white px-4 py-2 rounded-lg transition-all text-sm font-medium relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                          boxShadow: '0 0 25px rgba(249, 115, 22, 0.7), 0 4px 14px 0 rgba(249, 115, 22, 0.5)',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: '600',
                          animation: animatingCardId === mentor.name ? 'none' : 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                        }}
                        animate={animatingCardId === mentor.name ? {
                          scale: [1, 1.15, 0.95, 1.1],
                          rotate: [0, 5, -5, 0],
                          boxShadow: [
                            '0 0 25px rgba(249, 115, 22, 0.7), 0 4px 14px 0 rgba(249, 115, 22, 0.5)',
                            '0 0 50px rgba(249, 115, 22, 1), 0 8px 25px 0 rgba(249, 115, 22, 0.8)',
                            '0 0 60px rgba(249, 115, 22, 1.2), 0 12px 30px 0 rgba(249, 115, 22, 1)',
                            '0 0 40px rgba(249, 115, 22, 0.9), 0 6px 20px 0 rgba(249, 115, 22, 0.7)',
                          ]
                        } : {}}
                        transition={{
                          duration: 0.4,
                          ease: [0.34, 1.56, 0.64, 1] // Custom easing for bounce effect
                        }}
                        onMouseEnter={(e) => {
                          if (animatingCardId !== mentor.name) {
                            e.currentTarget.style.boxShadow = '0 0 40px rgba(249, 115, 22, 1), 0 8px 25px 0 rgba(249, 115, 22, 0.7)';
                            e.currentTarget.style.transform = 'scale(1.08)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (animatingCardId !== mentor.name) {
                            e.currentTarget.style.boxShadow = '0 0 25px rgba(249, 115, 22, 0.7), 0 4px 14px 0 rgba(249, 115, 22, 0.5)';
                            e.currentTarget.style.transform = 'scale(1)';
                          }
                        }}
                        disabled={animatingCardId === mentor.name}
                      >
                        <span style={{ 
                          position: 'relative', 
                          zIndex: 1,
                          display: 'inline-block',
                          transform: animatingCardId === mentor.name ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          transition: 'transform 0.2s ease'
                        }}>
                          {animatingCardId === mentor.name ? '✨' : 'View Card'}
                        </span>
                      </motion.button>
                    </td>
                  </tr>
                ))}
                {filteredMentors.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      No coaches found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>
        </div>
      </motion.div>
      </div>
      )}

      {/* Try Out Calendar Modal - Rendered via Portal */}
      {showCalendarForMentor && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" 
          style={{ zIndex: 9999 }}
          onClick={() => {
            setShowCalendarForMentor(null);
            setSelectedDate(undefined);
            setSelectedTimeSlot(null);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-800 rounded-2xl p-6 border border-slate-700 max-w-md w-full max-h-[90vh] overflow-y-auto"
            style={{ zIndex: 10000 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white text-lg font-semibold">
                Book a Try Out with {showCalendarForMentor}
              </h4>
              <button
                onClick={() => {
                  setShowCalendarForMentor(null);
                  setSelectedDate(undefined);
                  setSelectedTimeSlot(null);
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex justify-center mb-6">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                  setSelectedTimeSlot(null);
                          }}
                          className="rounded-md border border-slate-700 bg-slate-800"
                          disabled={(date) => date < new Date()}
                        />
                      </div>
            
                      {selectedDate && (
              <div className="space-y-4">
                          <p className="text-slate-300 text-center">
                            Selected: {selectedDate.toLocaleDateString()}
                          </p>
                          
                          {/* Available Time Slots */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                            <h5 className="text-white mb-3">Available Times</h5>
                            {(() => {
                    const availableSlots = getAvailableSlots(showCalendarForMentor, selectedDate);
                              
                              if (availableSlots.length === 0) {
                                return (
                                  <p className="text-slate-400 italic text-center py-2">
                                    No availability on this date. Please select another date.
                                  </p>
                                );
                              }
                              
                              return (
                                <div className="grid grid-cols-2 gap-2">
                                  {availableSlots.map((slot) => (
                                    <button
                                      key={slot.id}
                                      onClick={() => setSelectedTimeSlot(slot.id)}
                                      className={`px-4 py-2 rounded-lg border transition-colors ${
                                        selectedTimeSlot === slot.id
                                          ? 'bg-orange-500 border-orange-500 text-white'
                                          : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'
                                      }`}
                                    >
                                      {slot.start} - {slot.end}
                                    </button>
                                  ))}
                                </div>
                              );
                            })()}
                          </div>

                <div className="flex gap-3">
                            <button 
                              onClick={() => {
                                setShowCalendarForMentor(null);
                                setSelectedDate(undefined);
                                setSelectedTimeSlot(null);
                              }}
                              className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-full hover:bg-slate-600 transition-colors"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => {
                                if (!selectedTimeSlot) {
                                  alert('Please select a time slot');
                                  return;
                                }
                      const slot = getAvailableSlots(showCalendarForMentor, selectedDate).find(s => s.id === selectedTimeSlot);
                      console.log(`Booking try out with ${showCalendarForMentor} on ${selectedDate.toLocaleDateString()} at ${slot?.start}`);
                      alert(`Try Out with ${showCalendarForMentor} scheduled for ${selectedDate.toLocaleDateString()} at ${slot?.start}! Check your email for confirmation.`);
                                setShowCalendarForMentor(null);
                                setSelectedDate(undefined);
                                setSelectedTimeSlot(null);
                              }}
                              disabled={!selectedTimeSlot}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Confirm Booking
                            </button>
                          </div>
                        </div>
                      )}
          </motion.div>
        </div>,
        document.body
      )}

      {/* Trading Card Modal */}
      {viewingCard && (
        <CoachTradingCard
          mentor={{
            ...viewingCard,
            rating: (getOverall(viewingCard.name) - 60) / 8, // Convert back to 1-5 scale for card compatibility
            sessionsCompleted: 150, // Mock data
            responseTime: '< 24hrs', // Mock data
            education: [
              'BS Computer Science, Stanford University',
              'MS Engineering, MIT'
            ],
            careerTimeline: [
              { year: '2019', role: 'Software Engineer', company: 'Apple' },
              { year: '2021', role: 'Senior Engineer', company: 'Zoox' },
              { year: '2023', role: 'Lead Engineer', company: 'Zoox' },
              { year: '2024', role: 'Mentor & Community Builder', company: 'ISO Institute' }
            ]
          }}
          category={category}
          onClose={() => setViewingCard(null)}
          onBookSession={() => {
            // Navigate to Call ISO page instead of opening modal
            if (onNavigateToCallIso) {
              setViewingCard(null);
              onNavigateToCallIso(viewingCard.name, category.id);
            }
          }}
        />
      )}
    </>
  );
}