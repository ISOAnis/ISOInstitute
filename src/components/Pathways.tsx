import * as React from 'react';
import { useState, useEffect } from 'react';
import { Moon, Dumbbell, Activity, Settings, Rocket, Globe, Sprout, BookOpen, Star, Trophy, Gem, Target, Clock, ArrowUp, Circle, Sparkles, ArrowLeft, ArrowRight, LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { MentorModal } from './MentorModal';
import { SignupModal } from './SignupModal';
import { PATHWAYS } from '../data/pathways';

// =============================================================================
// UNIFIED PATHWAY CARD COMPONENT - Single consistent style for all cards
// =============================================================================

// Map gradient strings to solid hex colors for icons
export const getAccentColor = (gradientString: string): string => {
  const colorMap: Record<string, string> = {
    'from-emerald-500 to-teal-600': '#10b981', // emerald-500
    'from-red-500 to-rose-600': '#ef4444', // red-500
    'from-blue-500 to-cyan-600': '#3b82f6', // blue-500
    'from-purple-500 to-indigo-600': '#a855f7', // purple-500
    'from-orange-500 to-amber-600': '#f97316', // orange-500
    'from-cyan-500 to-blue-600': '#06b6d4', // cyan-500
  };
  return colorMap[gradientString] || '#3b82f6'; // Default to blue
};

type PathwayData = {
  id: string;
  icon: LucideIcon;
  name: string;
  legacyName: string;
  description: string;
  tagline: string;
  color: string; // Gradient string - converted to hex for icon
};

interface PathwayCardProps {
  pathway: PathwayData;
  isSelected: boolean;
  onClick: () => void;
  key?: string;
}

// Base card surface - same structure for ALL cards
const CARD_SURFACE_BASE = "relative overflow-hidden rounded-3xl border border-white/10 backdrop-blur-md shadow-[0_0_60px_rgba(0,0,0,0.55)] p-12 cursor-pointer transition-all duration-300";

function PathwayCard({ pathway, isSelected, onClick }: PathwayCardProps) {
  const IconComponent = pathway.icon;
  const accentColor = getAccentColor(pathway.color);
  
  // Convert hex to rgba for background overlay
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  return (
    <motion.div
      className={`${CARD_SURFACE_BASE} ${isSelected ? 'ring-4 ring-orange-500/50' : ''}`}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
      }}
      onClick={onClick}
      whileHover={{ 
        scale: 1.02, 
        borderColor: 'rgba(255, 255, 255, 0.2)',
      }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 40px ${hexToRgba(accentColor, 0.4)}, 0 0 80px ${hexToRgba(accentColor, 0.2)}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 60px rgba(0,0,0,0.55)';
      }}
    >
      {/* Colored background overlay - pathway-specific accent color */}
      <div 
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{ 
          backgroundColor: hexToRgba(accentColor, 0.15),
        }}
      />
      
      {/* Optional thin accent line */}
      <div
        className="absolute left-0 top-0 h-full w-[2px] opacity-60"
        style={{ backgroundColor: accentColor }}
      />
      
      <div className="flex flex-col items-center justify-center gap-6 relative z-10 text-center">
        {/* Icon with solid accent color - ONLY place where color varies */}
        <div
          className="flex h-24 w-24 items-center justify-center rounded-2xl shadow-lg"
          style={{ backgroundColor: accentColor }}
        >
          {IconComponent && <IconComponent className="w-10 h-10 text-white" />}
        </div>
        <h3 
          className="text-white text-3xl"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {pathway.name}
        </h3>
        <p className="text-sm tracking-wide !text-white" style={{ color: '#ffffff' }}>{pathway.legacyName}</p>
      </div>
    </motion.div>
  );
}

type Page = 'home' | 'pathways' | 'about' | 'community' | 'call-iso';

interface PathwaysProps {
  onNavigate: (page: Page) => void;
  onNavigateToCallIso?: (coachName: string, categoryId?: string) => void;
  commitmentStatus?: {
    isCommitted: boolean;
    mentorName?: string;
    category?: string;
    daysRemaining?: number;
  } | null;
}

const FlowConnector = () => (
  <div className="flex items-center self-center gap-2 md:gap-3 text-white h-full">
    <div className="h-px w-10 md:w-16 bg-gradient-to-r from-white/0 via-white/40 to-white/0 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.25)]" />
    <div className="flex items-center justify-center w-12 h-12 rounded-full border border-white/25 bg-white/10 shadow-[0_0_18px_rgba(255,255,255,0.35)]">
      <ArrowRight className="w-5 h-5 text-white" strokeWidth={2.5} />
    </div>
    <div className="h-px w-10 md:w-16 bg-gradient-to-r from-white/0 via-white/40 to-white/0 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.25)]" />
  </div>
);

// Level descriptions and gear unlocks
const levelDetails: Record<string, { title: string; description: string; gear: string }> = {
  freshman: {
    title: 'Freshman Level',
    description: 'Your journey begins here. Build foundational habits, complete your first goals, and prove your commitment to growth.',
    gear: 'Unlock: Basic ISO t-shirts, practice shorts, and an official ISO lanyard. Entry-level gear to show you\'re part of the team.'
  },
  jv: {
    title: 'JV Level',
    description: 'You\'ve shown consistency. Now it\'s time to level up your skills and take on bigger challenges with more accountability.',
    gear: 'Unlock: ISO hoodies, joggers, wristbands, and a gym bag. More comfortable gear for dedicated practice sessions.'
  },
  varsity: {
    title: 'Varsity Level',
    description: 'You\'re becoming a leader. Tackle advanced goals, and represent ISO with excellence.',
    gear: 'Unlock: Tracksuits, windbreakers, premium apparel, and exclusive colorways. You\'ve earned the right to look the part.'
  },
  d1: {
    title: 'D1 Level',
    description: 'Elite status. You\'re in the top tier, leading by example, and making significant impact in your pathway community.',
    gear: 'Unlock: Limited edition drops, signature accessories, D1 varsity jacket, and exclusive member-only gear releases.'
  },
  professional: {
    title: 'Professional Level',
    description: 'You\'ve reached the pinnacle. As a mentor, you guide others on their journey while continuing your own mastery.',
    gear: 'Unlock: Custom signature gear with your name, mentor status badge, the legendary ISO tracksuit, and your own colorway collection.'
  }
};

export function Pathways({ onNavigate, onNavigateToCallIso, commitmentStatus }: PathwaysProps) {
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showCommitmentWarning, setShowCommitmentWarning] = useState(false);
  const [hoveredLevel, setHoveredLevel] = useState<string | null>(null);
  const [isHoveringProgressBox, setIsHoveringProgressBox] = useState(false);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  // Check localStorage for saved login state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const savedUser = localStorage.getItem('iso_demo_user');
      return savedUser !== null;
    } catch {
      return false;
    }
  });

  // Update login state when localStorage changes
  useEffect(() => {
    const checkLoginState = () => {
      try {
        const savedUser = localStorage.getItem('iso_demo_user');
        setIsLoggedIn(savedUser !== null);
      } catch {
        setIsLoggedIn(false);
      }
    };
    
    checkLoginState();
    window.addEventListener('storage', checkLoginState);
    const interval = setInterval(checkLoginState, 500);
    
    return () => {
      window.removeEventListener('storage', checkLoginState);
      clearInterval(interval);
    };
  }, []);

  const pathwayIcons: Record<string, LucideIcon> = {
    deen: Moon,
    health: Dumbbell,
    medicine: Activity,
    engineering: Settings,
    entrepreneurship: Rocket,
    global: Globe,
  };

  const pathways = PATHWAYS.map((pathway) => ({
    ...pathway,
    icon: pathwayIcons[pathway.id],
  }));

  const handlePathwayClick = (pathwayId: string) => {
    if (commitmentStatus?.isCommitted) {
      setShowCommitmentWarning(true);
    } else if (!isLoggedIn) {
      setShowSignupModal(true);
      // Store the pathway they wanted to see for after signup
      setSelectedPathway(pathwayId);
    } else {
      setSelectedPathway(pathwayId);
    }
  };

  const handleSignupComplete = (userData: any) => {
    console.log('User signed up:', userData);
    
    try {
      const userDataForLogin = { email: userData.email, roles: ['player'] as any[] };
      localStorage.setItem('iso_demo_user', JSON.stringify(userDataForLogin));
      localStorage.setItem('iso_demo_portal', 'player');
    } catch (error) {
      console.error('Failed to save user to localStorage:', error);
    }
    
    setIsLoggedIn(true);
    setShowSignupModal(false);
    // selectedPathway is already set, so the MentorModal will open automatically
  };

  const selectedPathwayData = selectedPathway 
    ? pathways.find(p => p.id === selectedPathway)
    : null;

  // If a pathway is selected and user is logged in, show coach selection
  if (selectedPathwayData && isLoggedIn && !commitmentStatus?.isCommitted) {
    return (
      <>
        <div 
          className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8"
          style={{ background: '#030305' }}
        >
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <motion.button
              onClick={() => setSelectedPathway(null)}
              className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft size={20} />
              <span style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Back to Pathways</span>
            </motion.button>

            {/* Pathway Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-6">
                {selectedPathwayData.icon && (
                  <div className={`w-16 h-16 bg-gradient-to-br ${selectedPathwayData.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <selectedPathwayData.icon className="w-8 h-8 text-white" />
                  </div>
                )}
                <div>
                  <h1 
                    className="text-white text-4xl md:text-5xl"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {selectedPathwayData.name}
                  </h1>
                  <p className="text-lg mt-2 !text-white" style={{ color: '#ffffff' }}>{selectedPathwayData.legacyName}</p>
                </div>
              </div>
              <p className="text-white/70 text-lg max-w-3xl mx-auto mb-4">
                {selectedPathwayData.description}
              </p>
              <p className="text-orange-500 italic text-lg" style={{ color: '#f97316' }}>
                {selectedPathwayData.tagline}
              </p>
            </div>

            {/* Coach Selection Modal */}
            <MentorModal
              category={{
                id: selectedPathwayData.id,
                title: selectedPathwayData.name,
                legacyName: selectedPathwayData.legacyName,
                emoji: '',
                description: selectedPathwayData.description,
                tagline: selectedPathwayData.tagline,
                color: selectedPathwayData.color,
              }}
              onClose={() => setSelectedPathway(null)}
              onNavigateToCallIso={onNavigateToCallIso}
            />
          </div>
        </div>

        {/* Signup Modal */}
        {showSignupModal && (
          <SignupModal
            onClose={() => setShowSignupModal(false)}
            onSignupComplete={handleSignupComplete}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div 
        className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8"
        style={{
          background: '#030305',
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* How It Works - Minimal & Elegant */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 text-white rounded-full backdrop-blur-[10px]" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                The ISO System
              </span>
            </div>
            <h2 
              className="text-white mb-8 text-5xl md:text-6xl"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              How It Works
            </h2>
            
            {/* Clean Step Flow */}
            <div className="max-w-6xl mx-auto">
              <div className="relative flex items-center gap-8 overflow-x-auto pb-4 px-2 md:px-0 md:justify-center text-center">
                <div className="pointer-events-none absolute left-0 right-0 top-1/2 hidden md:block">
                  <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                {/* Step 1 */}
                <motion.div
                  className="relative min-w-[260px] md:min-w-0 md:flex-1 max-w-sm flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <h3 
                    className="text-white mb-4 text-2xl text-center"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    Choose Your Pathway
                  </h3>
                  <p className="text-white/60 text-base leading-relaxed md:text-lg text-center mx-auto" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Select the area where you want to grow. Each pathway has experienced coaches ready to guide you.
                  </p>
                </motion.div>

                {/* Flow arrow */}
                <FlowConnector />
                
                {/* Step 2 */}
                <motion.div
                  className="relative min-w-[260px] md:min-w-0 md:flex-1 max-w-sm flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                  <h3 
                    className="text-white mb-4 text-2xl text-center"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    Connect with a Coach
                  </h3>
                  <p className="text-white/60 text-base leading-relaxed md:text-lg text-center mx-auto" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Browse coach profiles and book a session with a mentor who aligns with your goals and schedule.
                  </p>
                </motion.div>

                {/* Flow arrow */}
                <FlowConnector />
                
                {/* Step 3 */}
                <motion.div
                  className="relative min-w-[260px] md:min-w-0 md:flex-1 max-w-sm flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                  <h3 
                    className="text-white mb-4 text-2xl text-center"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    Start Getting Buckets
                  </h3>
                  <p className="text-white/60 text-base leading-relaxed md:text-lg text-center mx-auto" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Set micro-goals, win games, and work toward your championship ring — all while building discipline and faith.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Progress System Overview */}
          <div 
            className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 mb-16"
            onMouseEnter={() => setIsHoveringProgressBox(true)}
            onMouseLeave={() => setIsHoveringProgressBox(false)}
          >
            <h2 
              className="text-white text-center mb-4 text-5xl md:text-6xl"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              The ISO Progress System
            </h2>
            <p className="text-white/70 text-center mb-6 text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Progress through levels based on your commitment and flex your growth with premium & exclusive ISO apparel. Start where you're ready.
              <br />
              <span 
                style={{ 
                  color: '#f97316',
                  animation: isHoveringProgressBox ? 'blink 1.5s ease-in-out infinite' : 'none'
                }}
              >
                Hover over each level to see the details.
              </span>
            </p>
            <style>{`
              @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
              }
            `}</style>
            
            {/* Progress Bar */}
            <div className="relative mb-6">
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full flex">
                  {[
                    { id: 'freshman', color: 'from-green-500 to-emerald-600', solidColor: '#22c55e' },
                    { id: 'jv', color: 'from-blue-500 to-cyan-600', solidColor: '#3b82f6' },
                    { id: 'varsity', color: 'from-purple-500 to-indigo-600', solidColor: '#a855f7' },
                    { id: 'd1', color: 'from-orange-500 to-amber-600', solidColor: '#f97316' },
                    { id: 'professional', color: 'from-yellow-500 to-orange-600', solidColor: '#eab308' }
                  ].map((segment) => (
                    <div
                      key={segment.id}
                      className={`h-full transition-all duration-300 cursor-pointer ${
                        hoveredLevel === null 
                          ? `bg-gradient-to-r ${segment.color}` 
                          : hoveredLevel === segment.id 
                            ? `bg-gradient-to-r ${segment.color}` 
                            : 'bg-slate-700'
                      }`}
                      style={{ 
                        width: '20%',
                        filter: hoveredLevel === segment.id ? 'brightness(1.3)' : 'none',
                        boxShadow: hoveredLevel === segment.id ? `0 0 20px ${segment.solidColor}80` : 'none'
                      }}
                      onMouseEnter={() => setHoveredLevel(segment.id)}
                      onMouseLeave={() => setHoveredLevel(null)}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between mt-3">
                {[
                  { level: 'Freshman', id: 'freshman', icon: Sprout, minTime: '3mo' },
                  { level: 'JV', id: 'jv', icon: BookOpen, minTime: '3mo' },
                  { level: 'Varsity', id: 'varsity', icon: Star, minTime: '4mo' },
                  { level: 'D1', id: 'd1', icon: Trophy, minTime: '6mo' },
                  { level: 'Professional', id: 'professional', icon: Gem, minTime: 'Ongoing', special: true }
                ].map((stage) => {
                  const IconComponent = stage.icon;
                  const isHovered = hoveredLevel === stage.id;
                  return (
                    <div 
                      key={stage.id} 
                      className={`flex flex-col items-center flex-1 cursor-pointer transition-all duration-300 ${
                        hoveredLevel !== null && !isHovered ? 'opacity-40' : 'opacity-100'
                      }`}
                      onMouseEnter={() => setHoveredLevel(stage.id)}
                      onMouseLeave={() => setHoveredLevel(null)}
                    >
                      {IconComponent && (
                        <IconComponent 
                          className={`w-6 h-6 mb-1 transition-all duration-300 ${
                            isHovered ? 'text-white scale-125' : 'text-white'
                          }`} 
                        />
                      )}
                      <div 
                        className={`text-xs font-semibold text-center transition-all duration-300 ${
                          isHovered ? 'text-white scale-105' : 'text-white'
                        }`}
                      >
                        {stage.level}
                      </div>
                      <div 
                        className="text-orange-400 text-xs mt-0.5" 
                        style={{ color: '#fb923c' }}
                      >
                        {stage.minTime}
                      </div>
                      {stage.special && (
                        <div className="text-yellow-400 text-xs mt-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Mentor
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-700/50">
              {hoveredLevel ? (
                <motion.div
                  key={hoveredLevel}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="flex items-start gap-3">
                    <ArrowUp className="w-5 h-5 text-orange-400 mt-0.5" />
                    <div>
                      <h4 className="text-white text-sm font-semibold mb-1" style={{ color: 'white' }}>
                        {levelDetails[hoveredLevel].title}
                      </h4>
                      <p className="text-white/70 text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {levelDetails[hoveredLevel].description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-orange-400 mt-0.5" />
                    <div>
                      <h4 className="text-white text-sm font-semibold mb-1" style={{ color: 'white' }}>Gear Rewards</h4>
                      <p className="text-white/70 text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {levelDetails[hoveredLevel].gear}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-orange-400 mt-0.5" />
                  <div>
                    <h4 className="text-white text-sm font-semibold mb-1" style={{ color: 'white' }}>Start Where You're Ready</h4>
                    <p className="text-white/70 text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Your initial level is determined by your knowledge base and experience. No need to start from the beginning if you're already advanced.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-400 mt-0.5" />
                  <div>
                    <h4 className="text-white text-sm font-semibold mb-1" style={{ color: 'white' }}>Minimum Timeframes</h4>
                    <p className="text-white/70 text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Each level has a minimum commitment period to ensure proper growth and mastery before advancing.
                    </p>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 text-white rounded-full backdrop-blur-[10px]" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                Six Pathways to Growth
              </span>
            </div>
            <h1 
              className="text-white mb-4 text-5xl md:text-6xl"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Choose Your Pathway
            </h1>
            <p className="text-white/70 text-xl max-w-3xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Select a pathway to browse coaches and begin your ISO journey. Each pathway offers experienced coaches ready to guide you.
            </p>
          </div>

          {/* Pathways Grid - Now Clickable */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {pathways.map((pathway) => (
              <PathwayCard 
                key={pathway.id}
                pathway={pathway as PathwayData}
                isSelected={selectedPathway === pathway.id}
                onClick={() => handlePathwayClick(pathway.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Commitment Warning Modal */}
      {showCommitmentWarning && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setShowCommitmentWarning(false)}
        >
          <div 
            className="bg-slate-900 rounded-3xl max-w-md w-full p-8 border-2 border-orange-500/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔒</span>
            </div>
            <h3 className="text-white text-center mb-4">Already Committed</h3>
            <p className="text-white/70 text-center mb-6">
              You're currently working with {commitmentStatus?.mentorName} in <span className="text-orange-400">{commitmentStatus?.category}</span>. 
              Complete your 30-day commitment period before exploring other pathways.
            </p>
            <button
              onClick={() => setShowCommitmentWarning(false)}
              className="w-full bg-orange-500 text-white py-3 rounded-full hover:bg-orange-600 transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          onSignupComplete={handleSignupComplete}
        />
      )}
    </>
  );
}
