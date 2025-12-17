import { X, Search, Star, Lightbulb, Sparkles, Clock } from 'lucide-react';
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
        return 'Premium Coach';
      case 'specialist':
        return 'Specialist';
      case 'standard':
        return 'Standard';
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
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-slate-900 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-700/50"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Enhanced Header */}
        <div 
          className={`bg-gradient-to-br ${category.color} p-5 text-white relative overflow-hidden`}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-10 h-10 bg-black/20 hover:bg-black/30 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3 mb-2 pr-16">
            <span className="text-4xl">{category.emoji}</span>
            <div>
              <h2 className="text-white mb-1 text-xl">{category.title}</h2>
              <p className="text-white/90 text-sm">{category.description}</p>
            </div>
          </div>
          <p className="text-white/95 italic text-base">{category.tagline}</p>
        </div>

        {/* Content Area */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-280px)] bg-slate-900">
          {/* Enhanced Collapsible Info Section */}
          <div className="mb-8 space-y-3">
            <Accordion type="multiple" className="space-y-3" defaultValue={[]}>
          {/* Match Score Explanation */}
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-500/30 flex-shrink-0 self-start">
                  <Lightbulb className="w-6 h-6 text-orange-400" />
                </div>
                <AccordionItem value="match-scores" className="flex-1 border-2 border-blue-400/60 rounded-2xl bg-blue-800/80 border-solid overflow-hidden shadow-xl shadow-black/40">
                  <AccordionTrigger className="text-white hover:no-underline py-4 px-6 [&>svg]:text-slate-400">
                    <span className="font-semibold text-base" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Understanding Match Scores</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300 text-sm pb-6 px-6 leading-relaxed">
                    Match percentages are based on your profile and help identify strong initial compatibility — but they're <span className="text-orange-400 font-semibold">not the final word</span>. If a coach's story, expertise, or journey resonates with you, that matters more than any algorithm. Trust your instincts! A <span className="text-orange-400 font-semibold">Try Out</span> is always a great way to explore the connection, regardless of the score. Sometimes the best mentorships come from unexpected pairings.
                  </AccordionContent>
                </AccordionItem>
          </div>

              {/* Try Outs - Quick Chat */}
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 flex-shrink-0 self-start">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
                <AccordionItem value="try-outs" className="flex-1 border-2 border-blue-400/60 rounded-2xl bg-blue-800/80 border-solid overflow-hidden shadow-xl shadow-black/40">
                  <AccordionTrigger className="text-white hover:no-underline py-4 px-6 [&>svg]:text-slate-400">
                    <span className="font-semibold text-base" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Try Outs</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300 pb-6 px-6 leading-relaxed">
                Not ready to commit yet? Start with a quick, no-pressure conversation. Think of it as a first consultation — just you and a coach, exploring what's possible.
                  </AccordionContent>
                </AccordionItem>
            </div>

            {/* Call an ISO - Full Commitment */}
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/30 rounded-xl border-2 border-orange-500/40 flex-shrink-0 self-start shadow-lg shadow-orange-500/20">
                  <Sparkles className="w-6 h-6 text-orange-400" />
                </div>
                <AccordionItem value="call-iso" className="flex-1 border-2 border-orange-500/50 rounded-2xl bg-slate-700/80 backdrop-blur-sm overflow-hidden shadow-lg shadow-orange-500/20">
                  <AccordionTrigger className="text-white hover:no-underline py-4 px-6 [&>svg]:text-orange-400">
                    <span className="font-semibold text-base text-orange-400" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Call an ISO</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300 pb-6 px-6 leading-relaxed">
                When you're ready to dive in fully, call an ISO. Get matched with coaches who align with your goals and values. Get access to exclusive mentorship nights, inspiring events, and local initiatives.
                  </AccordionContent>
                </AccordionItem>
            </div>
            </Accordion>
          </div>

          {/* Section Header */}
          <div className="mb-6 flex items-center justify-between">
            <h3 
              className="text-white text-3xl font-bold flex items-center gap-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: '800' }}
            >
              <span className="text-white">Coaches</span>
              <span className="text-slate-500 text-lg font-normal">({filteredMentors.length})</span>
            </h3>
            </div>
            
          {/* Enhanced Search and Filters */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            {/* Search Bar with Box */}
            <div className="relative flex-1 bg-slate-700/90 backdrop-blur-sm rounded-xl border-2 border-slate-500/80 shadow-lg hover:border-slate-400/80 focus-within:border-orange-500/60 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
              <input
                type="text"
                placeholder="Search by Coach Name, Title, or Expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white pl-4 pr-4 py-4 rounded-xl border-0 focus:outline-none focus:ring-0 transition-all placeholder:text-slate-400"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-800/80 backdrop-blur-sm text-white px-5 py-3 rounded-xl border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              <option value="match">Sort by: Best Match</option>
              <option value="overall">Sort by: Overall</option>
              <option value="experience">Sort by: Experience</option>
              <option value="availability">Sort by: Availability</option>
            </select>
          </div>
          
          {/* Modern Card-Based Coach Grid */}
          <div className="grid grid-cols-1 gap-4">
            {filteredMentors.map((mentor, index) => {
              const matchResult = getMatchScore(mentor.name);
              const overall = getOverall(mentor.name);
              const availabilityStatus = getAvailabilityStatus(mentor.name);
              
              return (
                <motion.div
                key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="group bg-blue-800/80 rounded-2xl border-2 border-blue-400/60 hover:border-blue-300/70 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 shadow-xl shadow-black/40"
                >
                  <div className="flex items-start gap-6">
                    {/* Photo */}
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-700 border-2 border-slate-600 group-hover:border-orange-500/50 transition-colors shadow-lg">
                  <ImageWithFallback
                          src={getImageSrc(mentor.name)}
                    alt={mentor.name}
                    className={`w-full h-full ${mentor.name === 'Anis Benyoucef' ? 'object-contain' : 'object-cover'}`}
                  />
                </div>
                      {mentor.tier && (
                        <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-lg text-xs font-bold ${getTierBadgeStyle(mentor.tier)} border-2 shadow-lg`}>
                          {getTierLabel(mentor.tier)}
                        </div>
                      )}
                    </div>

                    {/* Coach Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-white text-xl font-bold mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                            {mentor.name}
                          </h4>
                          <p className="text-slate-400 text-sm mb-3">{mentor.role}</p>
                        </div>
                        
                        {/* Match Score Badge */}
                        {matchResult && (
                          <Badge className={`${getMatchColor(matchResult.score)} border text-sm px-4 py-1.5 font-semibold shadow-lg`}>
                            {matchResult.score}% Match
                          </Badge>
                        )}
                </div>
                
                      {/* Stats Row */}
                      <div className="flex items-center gap-6 mb-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-white font-semibold text-sm">{overall}</span>
                          <span className="text-slate-500 text-xs">Overall</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="text-slate-300 text-sm font-medium capitalize">{availabilityStatus}</span>
                          <span className="text-slate-500 text-xs">Availability</span>
                        </div>
                        {mentor.successRate && (
                          <div className="text-slate-400 text-xs">
                            {mentor.successRate}
                          </div>
                        )}
                      </div>
                  
                  {/* Specialization Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.specialization.slice(0, 3).map((spec, idx) => (
                      <span
                        key={idx}
                            className="px-3 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg border border-slate-600/50"
                      >
                        {spec}
                      </span>
                    ))}
                        {mentor.specialization.length > 3 && (
                          <span className="px-3 py-1 text-slate-400 text-xs">
                            +{mentor.specialization.length - 3} more
                          </span>
                        )}
                  </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 flex-shrink-0">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCalendarForMentor(mentor.name);
                          setSelectedDate(undefined);
                          setSelectedTimeSlot(null);
                        }}
                        className="group/btn bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 relative overflow-hidden"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Book a Try Out
                        </span>
                      </motion.button>
                      
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAnimatingCardId(mentor.name);
                          setTimeout(() => {
                            setViewingCard(mentor);
                            setAnimatingCardId(null);
                          }, 400);
                        }}
                        className="group/btn bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl transition-all text-sm font-bold shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 relative overflow-hidden border-2 border-orange-400/50 hover:border-orange-300/70"
                        style={{ 
                          fontFamily: "'Bebas Neue', sans-serif",
                          boxShadow: '0 0 25px rgba(249, 115, 22, 0.6), 0 0 50px rgba(249, 115, 22, 0.3), 0 8px 16px rgba(0, 0, 0, 0.3)',
                          animation: 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                        }}
                        whileHover={{ scale: 1.08, boxShadow: '0 0 40px rgba(249, 115, 22, 0.9), 0 0 80px rgba(249, 115, 22, 0.5), 0 12px 24px rgba(0, 0, 0, 0.4)' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {/* Animated glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-orange-300/30 to-orange-400/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-xl"></div>
                        
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        
                        <span className="relative z-10 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 drop-shadow-lg" />
                          <span className="drop-shadow-md">View Card</span>
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {filteredMentors.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
                <p className="text-slate-400 text-lg font-medium mb-2">No coaches found</p>
                <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
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
            ],
            photo:
              typeof window !== 'undefined' &&
              viewingCard.name === 'Imam Abdullah Rahman'
                ? localStorage.getItem('coach_profile_picture') || undefined
                : undefined
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