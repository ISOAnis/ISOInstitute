import * as React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Trophy, Target, CheckCircle2, Circle, Award, TrendingUp, Calendar, MessageSquare, Plus, Lock, Clock, User, UserCircle, Users, X, Moon, Sprout, BookOpen, Star as StarIcon, Gem, Sparkles, AlertCircle, ArrowRight, Dumbbell, Activity, Settings, Rocket, Globe, LucideIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MenteeProfileSection } from './MenteeProfileSection';
import { LockerRoom } from './LockerRoom';
import { MentorMenteeChat } from './MentorMenteeChat';
import { PortalTutorial } from './PortalTutorial';
import { ProfileCompletionModal } from './ProfileCompletionModal';
import { PathwaySelectionModal } from './PathwaySelectionModal';
import { PATHWAYS } from '../data/pathways';

interface Bucket {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
}

interface Game {
  id: string;
  title: string;
  buckets: Bucket[];
  completed: boolean;
  completedDate?: string;
}

// Mock data - in production this would come from backend
const mockGames: Game[] = [
  {
    id: '1',
    title: 'Establish Daily Prayer Routine',
    completed: true,
    completedDate: '2024-10-15',
    buckets: [
      { id: '1-1', title: 'Pray Fajr on time for 7 days', description: 'Build consistency with morning prayer', completed: true },
      { id: '1-2', title: 'Learn proper wudu technique', description: 'Master the ablution process', completed: true },
      { id: '1-3', title: 'Memorize Al-Fatiha perfectly', description: 'Essential surah for every prayer', completed: true },
      { id: '1-4', title: 'Set up prayer space at home', description: 'Create dedicated worship area', completed: true },
    ]
  },
  {
    id: '2',
    title: 'Build Spiritual Foundation',
    completed: false,
    buckets: [
      { id: '2-1', title: 'Read 10 pages of Quran daily', description: 'Consistent engagement with scripture', completed: true },
      { id: '2-2', title: 'Attend Friday Jummah for 4 weeks', description: 'Connect with community', completed: true },
      { id: '2-3', title: 'Complete tafsir course on Surah Yusuf', description: 'Deepen understanding', completed: true },
      { id: '2-4', title: 'Start daily dhikr practice', description: 'Remembrance after each prayer', completed: false, dueDate: '2024-11-20' },
      { id: '2-5', title: 'Journal spiritual reflections weekly', description: 'Track your journey', completed: false, dueDate: '2024-11-25' },
    ]
  },
  {
    id: '3',
    title: 'Academic Excellence',
    completed: false,
    buckets: [
      { id: '3-1', title: 'Achieve 3.5 GPA this semester', description: 'Improve academic performance', completed: false, dueDate: '2024-12-15' },
      { id: '3-2', title: 'Complete 2 practice SAT tests', description: 'Prepare for standardized testing', completed: false, dueDate: '2024-11-30' },
      { id: '3-3', title: 'Meet with guidance counselor', description: 'Plan college pathway', completed: false, dueDate: '2024-11-18' },
    ]
  }
];

const PLAYER_TUTORIAL_KEY = 'iso_tutorial_completed_player_page';
const PATHWAY_SELECTION_KEY = 'iso_pathway_selection_completed';
type PlayerTab = 'progress' | 'messages' | 'profile';

interface MenteePortalProps {
  onNavigate?: (page: 'home' | 'pathways' | 'about' | 'community' | 'coach-portal' | 'player-portal' | 'call-iso' | 'store') => void;
}

export function MenteePortal({ onNavigate }: MenteePortalProps) {
  const [games, setGames] = useState<Game[]>(mockGames);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showLockerRoom, setShowLockerRoom] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showProfileCompletionModal, setShowProfileCompletionModal] = useState(false);
  const [showPathwaySelectionModal, setShowPathwaySelectionModal] = useState(false);
  const [playerProfileCompletion, setPlayerProfileCompletion] = useState(() => {
    const saved = localStorage.getItem('player_profile_completion');
    return saved ? Number(saved) : 0;
  });
  const [activeTab, setActiveTab] = useState<PlayerTab>('progress');
  const profileSectionRef = useRef<HTMLDivElement | null>(null);
  const showProfileCompletion = playerProfileCompletion < 100;

  // Check if tutorial should be shown
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem(PLAYER_TUTORIAL_KEY);
    if (tutorialCompleted === 'true') {
      setShowTutorial(false);
    } else {
      setTimeout(() => {
        setShowTutorial(true);
      }, 150);
    }
  }, []);

  const playerTutorialSteps = [
    {
      title: 'Welcome to Your Player Portal!',
      description: 'This is your personal dashboard where you\'ll track your progress, communicate with your coach, and work toward your goals. Let\'s get you started!'
    },
    {
      title: 'Your Games & Progress',
      description: 'View all your games (goals) and buckets (actionable steps) in the "My Progress" tab. Complete buckets to win games and level up!',
      targetId: 'tutorial-games-section'
    },
    {
      title: 'Progress Level Bar',
      description: 'Track your advancement through tiers: Freshman → JV → Varsity → D1 → Professional. Complete games to level up!',
      targetId: 'tutorial-progress-bar'
    },
    {
      title: 'Messages with Your Coach',
      description: 'Use the Messages tab to communicate with your coach. Ask questions, get feedback, and stay connected.',
      targetId: 'tutorial-messages-tab'
    },
    {
      title: 'Locker Room',
      description: 'Access the Locker Room to connect with other players in your pathway and build your community.',
      targetId: 'tutorial-locker-room-btn'
    },
    {
      title: 'Complete Your Profile',
      description: 'Finish setting up your player profile to get the most out of ISO! Add your goals, preferences, and information.',
      targetId: 'tutorial-profile-completion'
    }
  ];

  // Pathway mapping - maps pathway ID to category name and icon
  const pathwayIcons: Record<string, LucideIcon> = {
    deen: Moon,
    health: Dumbbell,
    medicine: Activity,
    engineering: Settings,
    entrepreneurship: Rocket,
    global: Globe,
  };

  const pathwayMap = Object.fromEntries(
    PATHWAYS.map((pathway) => [
      pathway.id,
      { name: pathway.name, legacyName: pathway.legacyName, icon: pathwayIcons[pathway.id] },
    ]),
  ) as Record<string, { name: string; legacyName: string; icon: LucideIcon }>;

  // Get selected pathway from localStorage (with state to track changes)
  const [selectedPathwayId, setSelectedPathwayId] = useState(() => {
    try {
      return localStorage.getItem('iso_selected_pathway') || 'deen'; // Default to deen if not set
    } catch {
      return 'deen';
    }
  });

  // Sync selected pathway with localStorage changes
  useEffect(() => {
    const checkPathway = () => {
      try {
        const saved = localStorage.getItem('iso_selected_pathway');
        if (saved) {
          setSelectedPathwayId(saved);
        }
      } catch (error) {
        console.error('Failed to read selected pathway:', error);
      }
    };
    
    checkPathway();
    window.addEventListener('storage', checkPathway);
    const interval = setInterval(checkPathway, 500);
    
    return () => {
      window.removeEventListener('storage', checkPathway);
      clearInterval(interval);
    };
  }, []);

  // Get pathway info based on selected pathway
  const selectedPathway = pathwayMap[selectedPathwayId] || pathwayMap['deen'];

  // Mock current mentorship data - in production would come from backend
  // Uses selected pathway to determine category
  const currentMentor = useMemo(() => ({
    name: 'Imam Abdullah Rahman',
    category: selectedPathway.name,
    categoryIcon: selectedPathway.icon,
    startDate: '2024-10-15', // Date mentee started with this mentor
  }), [selectedPathway]);

  // Get active pathways (pathways where user has a coach)
  const activePathways: Array<'deen' | 'health' | 'medicine' | 'engineering' | 'entrepreneurship' | 'global'> = 
    [selectedPathwayId as 'deen' | 'health' | 'medicine' | 'engineering' | 'entrepreneurship' | 'global'];

  // Calculate commitment progress (30 days = 1 month)
  const startDate = new Date(currentMentor.startDate);
  const today = new Date();
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const commitmentDays = 30;
  const daysRemaining = Math.max(0, commitmentDays - daysSinceStart);
  const commitmentProgress = Math.min(100, (daysSinceStart / commitmentDays) * 100);
  const canExploreNewPathway = daysSinceStart >= commitmentDays;

  // Calculate statistics
  const totalGames = games.length;
  const gamesWon = games.filter(g => g.completed).length;
  const totalBuckets = games.reduce((sum, game) => sum + game.buckets.length, 0);
  const bucketsScored = games.reduce((sum, game) => sum + game.buckets.filter(b => b.completed).length, 0);
  const winPercentage = totalGames > 0 ? Math.round((gamesWon / totalGames) * 100) : 0;
  
  // Check if eligible for championship (6+ games won)
  const isChampion = gamesWon >= 6;
  
  // Calculate current tier based on games won and progress
  const getCurrentTier = () => {
    if (gamesWon >= 15) return { tier: 'professional', level: 5, progress: 100 };
    if (gamesWon >= 10) return { tier: 'd1', level: 4, progress: Math.min(100, ((gamesWon - 10) / 5) * 100) };
    if (gamesWon >= 6) return { tier: 'varsity', level: 3, progress: Math.min(100, ((gamesWon - 6) / 4) * 100) };
    if (gamesWon >= 3) return { tier: 'jv', level: 2, progress: Math.min(100, ((gamesWon - 3) / 3) * 100) };
    return { tier: 'freshman', level: 1, progress: Math.min(100, (gamesWon / 3) * 100) };
  };

  const currentTier = getCurrentTier();
  
  // Calculate overall progress as percentage of full bar (0-100%)
  const overallProgress = Math.min(100, (gamesWon / 15) * 100); // 15 games = 100%
  
  const tiers = [
    { id: 'freshman', name: 'Freshman', icon: Sprout, minGames: 0, color: 'bg-gradient-to-r from-green-500 to-emerald-600', darkColor: 'bg-green-700' },
    { id: 'jv', name: 'JV', icon: BookOpen, minGames: 3, color: 'bg-gradient-to-r from-blue-500 to-cyan-600', darkColor: 'bg-blue-700' },
    { id: 'varsity', name: 'Varsity', icon: StarIcon, minGames: 6, color: 'bg-gradient-to-r from-purple-500 to-indigo-600', darkColor: 'bg-purple-700' },
    { id: 'd1', name: 'D1', icon: Trophy, minGames: 10, color: 'bg-gradient-to-r from-orange-500 to-amber-600', darkColor: 'bg-orange-700' },
    { id: 'professional', name: 'Professional', icon: Gem, minGames: 15, color: 'bg-gradient-to-r from-orange-500 to-orange-600', darkColor: 'bg-orange-700' },
  ];
  
  const toggleBucket = (gameId: string, bucketId: string) => {
    setGames(games.map(game => {
      if (game.id === gameId) {
        const updatedBuckets = game.buckets.map(bucket =>
          bucket.id === bucketId ? { ...bucket, completed: !bucket.completed } : bucket
        );
        const allBucketsComplete = updatedBuckets.every(b => b.completed);
        return {
          ...game,
          buckets: updatedBuckets,
          completed: allBucketsComplete,
          completedDate: allBucketsComplete ? new Date().toISOString().split('T')[0] : game.completedDate
        };
      }
      return game;
    }));
  };

  const handleProfileComplete = (profileData: any) => {
    // Save profile data to localStorage
    localStorage.setItem('player_profile_data', JSON.stringify(profileData));
    setShowProfileCompletionModal(false);
    setPlayerProfileCompletion(100);
  };

  useEffect(() => {
    localStorage.setItem('player_profile_completion', String(playerProfileCompletion));
  }, [playerProfileCompletion]);

  const handleStartTutorial = () => {
    localStorage.removeItem(PLAYER_TUTORIAL_KEY);
    localStorage.removeItem('iso_tutorial_completed_player');
    setShowTutorial(true);
  };

  const focusProfileSection = () => {
    setActiveTab('profile');
    setTimeout(() => {
      profileSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  return (
    <div className="min-h-screen text-white" style={{ background: '#030305' }}>
      {/* Tutorial */}
      {showTutorial && (
        <PortalTutorial
          steps={playerTutorialSteps}
          onComplete={() => {
            setShowTutorial(false);
            localStorage.setItem(PLAYER_TUTORIAL_KEY, 'true');
            // Show pathway selection modal after tutorial
            const pathwaySelectionCompleted = localStorage.getItem(PATHWAY_SELECTION_KEY);
            if (!pathwaySelectionCompleted) {
              setTimeout(() => setShowPathwaySelectionModal(true), 300);
            }
          }}
          role="player"
        />
      )}

      {/* Pathway Selection Modal */}
      {showPathwaySelectionModal && (
        <PathwaySelectionModal
          onClose={() => setShowPathwaySelectionModal(false)}
          onPathwaySelect={(pathwayId) => {
            setShowPathwaySelectionModal(false);
            // Show profile completion modal after pathway selection
            setTimeout(() => setShowProfileCompletionModal(true), 300);
          }}
        />
      )}

      {/* Profile Completion Modal */}
      {showProfileCompletionModal && (
        <ProfileCompletionModal
          onClose={() => setShowProfileCompletionModal(false)}
          onComplete={handleProfileComplete}
        />
      )}

      <div className="max-w-7xl mx-auto pt-32 px-8 pb-24">
        {/* Profile Completion Banner */}
        {showProfileCompletion && (
          <div id="tutorial-profile-completion" className="mb-6 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-2 border-orange-500/50 rounded-2xl p-6 flex items-center justify-between relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <AlertCircle className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Complete Your Player Profile</h3>
                <p className="text-slate-300 text-sm">
                  Finish setting up your account to get the most out of ISO and connect with the right coach.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                focusProfileSection();
                setShowProfileCompletionModal(true);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
            >
              Complete Profile
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-white mb-2">Your Season</h1>
              <div className="flex items-center gap-2 text-slate-400">
              {React.createElement(currentMentor.categoryIcon, { className: 'w-6 h-6 text-white' })}
                <div>
                  <span className="text-orange-400">{currentMentor.category}</span>
                  <span> with {currentMentor.name}</span>
                </div>
              </div>
            </div>
          <button
            onClick={handleStartTutorial}
            className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl text-white hover:bg-white/10 transition-colors"
          >
            Start Tutorial
          </button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PlayerTab)} className="space-y-6 relative z-10">
          <div className="flex items-center justify-between">
            <TabsList className="bg-slate-900 border border-slate-800 p-1 relative z-10">
            <TabsTrigger value="progress" className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white">
              <Trophy className="w-4 h-4 mr-2" />
              My Progress
            </TabsTrigger>
              <TabsTrigger id="tutorial-messages-tab" value="messages" className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </TabsTrigger>
            <TabsTrigger value="profile" className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white">
              <UserCircle className="w-4 h-4 mr-2" />
              My Profile
            </TabsTrigger>
          </TabsList>
            <button
              id="tutorial-locker-room-btn"
              onClick={() => setShowLockerRoom(true)}
              className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Locker Room
            </button>
          </div>

          {/* Locker Room Modal */}
          {showLockerRoom && (
            <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="relative w-full h-full max-w-7xl max-h-[90vh] rounded-2xl overflow-hidden">
                <LockerRoom 
                  userRole="player" 
                  isPaidMember={true} 
                  activePathways={activePathways}
                  onClose={() => setShowLockerRoom(false)}
                />
              </div>
            </div>
          )}

          {/* My Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            {/* Progress Tier System */}
            <div id="tutorial-progress-bar" className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-2xl border border-orange-500/30 p-6 mb-8">
              <h2 className="text-white text-center mb-2">Your Progress Level</h2>
              <p className="text-slate-400 text-center mb-6 text-sm">
                Level up by completing games and achieving your goals
              </p>
              
              {/* Progress Bar */}
              <div className="relative mb-6" style={{ width: '100%' }}>
                {/* Background Bar - dark background for entire bar */}
                <div className="h-6 bg-slate-800 rounded-full overflow-hidden" style={{ position: 'relative', width: '100%' }}>
                  {/* Progress Fill - gradient bar matching tier colors */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${overallProgress}%`,
                      background: overallProgress <= 20 
                        ? 'linear-gradient(to right, #10b981, #059669)' // Freshman - green
                        : overallProgress <= 40
                        ? 'linear-gradient(to right, #3b82f6, #0891b2)' // JV - blue
                        : overallProgress <= 60
                        ? 'linear-gradient(to right, #a855f7, #6366f1)' // Varsity - purple
                        : overallProgress <= 80
                        ? 'linear-gradient(to right, #f97316, #f59e0b)' // D1 - orange
                        : 'linear-gradient(to right, #f97316, #ea580c)', // Professional - reddish-orange
                      transition: 'width 0.3s ease',
                      zIndex: 5
                    }}
                  ></div>
                  {/* Completed tiers - show in full solid color (render first) */}
                  {tiers.map((tier, index) => {
                    const isCompleted = gamesWon >= tier.minGames && currentTier.level > index + 1;
                    if (!isCompleted) return null;
                    
                    return (
                      <div
                        key={`completed-${tier.id}`}
                        className={`absolute top-0 h-full ${tier.color}`}
                        style={{
                          left: `${index * 20}%`,
                          width: '20%',
                          zIndex: 10,
                        }}
                      ></div>
                    );
                  })}
                  
                  {/* Current tier - show progress with darker background and lighter fill */}
                  {(() => {
                    const currentTierData = tiers.find(t => t.id === currentTier.tier);
                    if (!currentTierData) return null;
                    const tierIndex = currentTier.level - 1;
                    const tierWidthPercent = 20; // 20% per tier
                    const filledWidthPercent = currentTier.progress / 100;
                    const filledWidthPercentOfBar = filledWidthPercent * tierWidthPercent;
                    
                    return (
                      <React.Fragment key="current-tier">
                        {/* Unfilled portion - darker solid color (full tier width) */}
                        <div
                          className={`absolute top-0 h-full ${currentTierData.darkColor}`}
                          style={{
                            left: `${tierIndex * tierWidthPercent}%`,
                            width: `${tierWidthPercent}%`,
                            zIndex: 10,
                          }}
                        ></div>
                        {/* Filled portion - lighter solid color with sharp vertical edge */}
                        {currentTier.progress > 0 && (
                          <div
                            className={`absolute top-0 h-full ${currentTierData.color}`}
                            style={{
                              left: `${tierIndex * tierWidthPercent}%`,
                              width: `${Math.max(filledWidthPercentOfBar, 2)}%`,
                              zIndex: 35,
                            }}
                          ></div>
                        )}
                      </React.Fragment>
                    );
                  })()}
                  
                  {/* Tier dividers - clear vertical lines (render last so they're on top) */}
                  {tiers.map((tier, index) => {
                    if (index === 0) return null; // Skip first divider
                    return (
                      <div
                        key={`divider-${tier.id}`}
                        className="absolute top-0 h-full bg-white"
                        style={{
                          left: `${index * 20}%`,
                          width: '2px',
                          zIndex: 30,
                        }}
                      ></div>
                    );
                  })}
                </div>
                
                {/* Visual percentage indicator */}
                {(() => {
                  const currentTierData = tiers.find(t => t.id === currentTier.tier);
                  if (!currentTierData) return null;
                  
                  // Only show if progress is less than 100%
                  if (currentTier.progress >= 100) return null;
                  
                  const progressPercent = Math.round(currentTier.progress);
                  
                  return (
                    <div className="mt-3 text-center">
                      <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-slate-800 rounded-full border border-slate-700 shadow-lg">
                        <div className={`w-2.5 h-2.5 rounded-full ${currentTierData.color} shadow-sm`}></div>
                        <span className="text-white text-sm font-semibold">
                          {progressPercent}% Complete
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Level Labels */}
                <div className="flex justify-between mt-3">
                  {tiers.map((tier, index) => {
                    const isCompleted = gamesWon >= tier.minGames;
                    const isCurrent = currentTier.tier === tier.id;
                    const nextTier = tiers[index + 1];
                    const gamesNeeded = nextTier ? nextTier.minGames - gamesWon : 0;
                    
                    const TierIcon = tier.icon;
                    return (
                      <div key={tier.id} className="flex flex-col items-center flex-1">
                        <div className={`mb-1 ${isCurrent ? 'scale-125' : ''} transition-transform`}>
                          {TierIcon && <TierIcon className="w-6 h-6 text-white" />}
                        </div>
                        <div className={`text-xs font-semibold text-center ${
                          isCurrent ? 'text-orange-400' : isCompleted ? 'text-white' : 'text-slate-500'
                        }`}>
                          {tier.name}
                        </div>
                        {isCurrent && gamesNeeded > 0 && (
                          <div className="text-orange-400 text-xs mt-0.5">
                            {gamesNeeded} more
                          </div>
                        )}
                        {isCurrent && gamesNeeded === 0 && (
                          <div className="text-yellow-400 text-xs mt-0.5 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Max Level
                          </div>
                        )}
                        {!isCurrent && !isCompleted && index === currentTier.level && (
                          <div className="text-slate-500 text-xs mt-0.5">
                            {tier.minGames - gamesWon} to unlock
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Tier Info */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full">
                  {(() => {
                    const CurrentTierIcon = tiers.find(t => t.id === currentTier.tier)?.icon;
                    return CurrentTierIcon ? <CurrentTierIcon className="w-5 h-5 text-white" /> : null;
                  })()}
                  <span className="text-white font-semibold">
                    Current Level: {tiers.find(t => t.id === currentTier.tier)?.name}
                  </span>
                  {currentTier.progress > 0 && currentTier.progress < 100 && (
                    <span className="text-orange-400 text-sm">
                      ({Math.round(currentTier.progress)}% to next level)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Buckets Scored */}
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Target className="w-8 h-8 text-orange-500" />
                  <span className="text-orange-400">Buckets</span>
                </div>
                <div className="text-white mb-1">{bucketsScored}/{totalBuckets}</div>
                <p className="text-slate-400 text-sm">Goals Completed</p>
              </div>

              {/* Games Won */}
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Trophy className="w-8 h-8 text-blue-500" />
                  <span className="text-blue-400">Games</span>
                </div>
                <div className="text-white mb-1">{gamesWon}/{totalGames}</div>
                <p className="text-slate-400 text-sm">Milestones Reached</p>
              </div>

              {/* Win Percentage */}
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                  <span className="text-green-400">Win Rate</span>
                </div>
                <div className="text-white mb-1">{winPercentage}%</div>
                <p className="text-slate-400 text-sm">Success Rate</p>
              </div>

              {/* Championship Status */}
              <div className={`bg-gradient-to-br ${isChampion ? 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/50' : 'from-slate-700/10 to-slate-800/10 border-slate-600/30'} border rounded-2xl p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <Award className={`w-8 h-8 ${isChampion ? 'text-yellow-500' : 'text-slate-500'}`} />
                  <span className={isChampion ? 'text-yellow-400' : 'text-slate-500'}>Ring</span>
                </div>
                <div className="text-white mb-1">{isChampion ? 'Earned!' : `${Math.max(0, 6 - gamesWon)} to go`}</div>
                <p className="text-slate-400 text-sm">{isChampion ? 'Champion' : 'Championship Status'}</p>
              </div>
            </div>

            {/* Championship Banner */}
            {isChampion && (
              <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 border-2 border-yellow-500/50 rounded-2xl p-8 mb-8 text-center">
                <div className="mb-4 flex justify-center">
                  <Trophy className="w-16 h-16 text-yellow-400" />
                </div>
                <h2 className="text-white mb-3">Championship Ring Earned!</h2>
                <p className="text-slate-300 mb-4 max-w-2xl mx-auto">
                  You've demonstrated exceptional growth, consistency, and commitment over your coaching journey. 
                  Your coach recognizes your achievements and considers you ready to graduate to the next level.
                </p>
                <button className="bg-yellow-500 text-slate-900 px-8 py-3 rounded-full hover:bg-yellow-400 transition-colors">
                  View Achievement Certificate
                </button>
              </div>
            )}

            {/* Games List */}
            <div id="tutorial-games-section" className="space-y-6">
              <h3 className="text-white">Your Games</h3>
              
              {games.map((game) => {
                const bucketsCompleted = game.buckets.filter(b => b.completed).length;
                const totalBucketsInGame = game.buckets.length;
                const progress = Math.round((bucketsCompleted / totalBucketsInGame) * 100);

                return (
                  <div key={game.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                    {/* Game Header */}
                    <div 
                      className={`p-6 cursor-pointer transition-colors ${
                        game.completed 
                          ? 'bg-gradient-to-r from-green-900/30 to-green-800/20' 
                          : 'bg-slate-800/50 hover:bg-slate-800'
                      }`}
                      onClick={() => setSelectedGame(selectedGame?.id === game.id ? null : game)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {game.completed ? (
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                              <Trophy className="w-6 h-6 text-green-500" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                              <Target className="w-6 h-6 text-orange-500" />
                            </div>
                          )}
                          <div>
                            <h4 className="text-white mb-1">{game.title}</h4>
                            <p className="text-slate-400 text-sm">
                              {bucketsCompleted}/{totalBucketsInGame} buckets scored
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {game.completed ? (
                            <div className="text-green-400 flex items-center gap-1">
                              Game Won! <Target className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="text-orange-400">{progress}% Complete</div>
                          )}
                          {game.completedDate && (
                            <p className="text-slate-500 text-sm mt-1">{new Date(game.completedDate).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {!game.completed && (
                        <div className="mt-4 bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-orange-400 h-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Buckets List (Expandable) */}
                    {selectedGame?.id === game.id && (
                      <div className="p-6 bg-slate-900 border-t border-slate-800">
                        <h5 className="text-white mb-4">Get These Buckets:</h5>
                        <div className="space-y-3">
                          {game.buckets.map((bucket) => (
                            <div
                              key={bucket.id}
                              className={`p-4 rounded-xl border transition-all ${
                                bucket.completed
                                  ? 'bg-green-900/20 border-green-700/50'
                                  : 'bg-slate-800 border-slate-700 hover:border-orange-500/50'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <button
                                  onClick={() => toggleBucket(game.id, bucket.id)}
                                  className="flex-shrink-0 mt-1"
                                >
                                  {bucket.completed ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                  ) : (
                                    <Circle className="w-6 h-6 text-slate-500 hover:text-orange-500 transition-colors" />
                                  )}
                                </button>
                                <div className="flex-1">
                                  <h6 className={`${bucket.completed ? 'text-slate-400 line-through' : 'text-white'} mb-1`}>
                                    {bucket.title}
                                  </h6>
                                  <p className="text-slate-500 text-sm">{bucket.description}</p>
                                  {bucket.dueDate && !bucket.completed && (
                                    <div className="flex items-center gap-2 mt-2 text-orange-400 text-sm">
                                      <Calendar className="w-4 h-4" />
                                      Due: {new Date(bucket.dueDate).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h4 className="text-white mb-4">Upcoming Sessions</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="text-white">Weekly Check-in</p>
                        <p className="text-slate-400 text-sm">with {currentMentor.name}</p>
                      </div>
                    </div>
                    <span className="text-slate-400 text-sm">Nov 15, 2:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h4 className="text-white mb-4">Message Your Coach</h4>
                <button className="w-full bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Send Message
                </button>
              </div>
            </div>

            {/* Expand to Other Pathways */}
            <div className={`mt-8 rounded-2xl p-8 border-2 ${
              canExploreNewPathway 
                ? 'bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border-emerald-500/50' 
                : 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'
            }`}>
              <div className="flex items-start gap-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                  canExploreNewPathway 
                    ? 'bg-emerald-500/20' 
                    : 'bg-slate-700/50'
                }`}>
                  {canExploreNewPathway ? (
                    <Plus className="w-8 h-8 text-emerald-400" />
                  ) : (
                    <Lock className="w-8 h-8 text-slate-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-white">
                      {canExploreNewPathway ? 'Ready to Explore Another Pathway?' : 'Commitment Period'}
                    </h3>
                    {!canExploreNewPathway && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{daysRemaining} days remaining</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-slate-400 mb-6">
                    {canExploreNewPathway ? (
                      <>
                        Congratulations! You've completed your 30-day commitment period with {currentMentor.name}. 
                        You can now explore other pathways and work with additional coaches if you'd like to grow in multiple areas of your life.
                      </>
                    ) : (
                      <>
                        We require a <span className="text-orange-400">30-day minimum commitment</span> to your current coach 
                        before you can explore other pathways. This ensures you take your coaching seriously and give it the focus it deserves. 
                        Stay committed to <span className="text-orange-400">{currentMentor.category}</span> with {currentMentor.name} — 
                        you started on <span className="text-slate-300">{startDate.toLocaleDateString()}</span>.
                      </>
                    )}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">Commitment Progress</span>
                      <span className="text-slate-300 text-sm">{Math.round(commitmentProgress)}%</span>
                    </div>
                    <div className="bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          canExploreNewPathway 
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                            : 'bg-gradient-to-r from-orange-500 to-orange-400'
                        }`}
                        style={{ width: `${commitmentProgress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-slate-500 text-xs">Day 1</span>
                      <span className="text-slate-500 text-xs">Day {daysSinceStart}/{commitmentDays}</span>
                      <span className="text-slate-500 text-xs">Day 30</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button 
                      className={`px-6 py-3 rounded-full transition-all flex items-center gap-2 ${
                        canExploreNewPathway
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                          : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50'
                      }`}
                      disabled={!canExploreNewPathway}
                    >
                      {canExploreNewPathway ? (
                        <>
                          <Plus className="w-5 h-5" />
                          Explore Other Pathways
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Locked Until {new Date(startDate.getTime() + commitmentDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </>
                      )}
                    </button>
                    {canExploreNewPathway && (
                      <p className="text-slate-400 text-sm">
                        Each coaching relationship is separate and focused on one field
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="h-[calc(100vh-400px)] min-h-[500px] max-h-[800px]">
              <MentorMenteeChat
                currentUserId="mentee-1"
                currentUserName="You"
                currentUserRole="mentee"
                otherUserId="mentor-1"
                otherUserName={currentMentor.name}
                otherUserRole="mentor"
                category={currentMentor.category}
                categoryIcon={currentMentor.categoryIcon}
              />
            </div>
          </TabsContent>

          {/* My Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div ref={profileSectionRef} id="player-profile-section">
              <MenteeProfileSection onProfileCompletionChange={setPlayerProfileCompletion} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}