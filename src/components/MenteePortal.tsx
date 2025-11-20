import * as React from 'react';
import { useState } from 'react';
import { Trophy, Target, CheckCircle2, Circle, Award, TrendingUp, Calendar, MessageSquare, Plus, Lock, Clock, User, UserCircle, Users, X, Moon, Sprout, BookOpen, Star as StarIcon, Gem, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MenteeProfileSection } from './MenteeProfileSection';
import { LockerRoom } from './LockerRoom';
import { MentorMenteeChat } from './MentorMenteeChat';

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

export function MenteePortal() {
  const [games, setGames] = useState<Game[]>(mockGames);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showLockerRoom, setShowLockerRoom] = useState(false);

  // Mock current mentorship data - in production would come from backend
  const currentMentor = {
    name: 'Imam Abdullah Rahman',
    category: 'Deen & Purpose',
    categoryIcon: Moon,
    startDate: '2024-10-15', // Date mentee started with this mentor
  };

  // Map category to pathway ID for Locker Room access
  const getPathwayIdFromCategory = (category: string): 'deen' | 'health' | 'medicine' | 'engineering' | 'entrepreneurship' | 'global' | null => {
    const categoryMap: Record<string, 'deen' | 'health' | 'medicine' | 'engineering' | 'entrepreneurship' | 'global'> = {
      'Deen & Purpose': 'deen',
      'Health & Fitness': 'health',
      'Medicine & Healthcare': 'medicine',
      'Engineering & Technology': 'engineering',
      'Entrepreneurship & Innovation': 'entrepreneurship',
      'Entrepreneurship & Business': 'entrepreneurship',
      'Global Affairs & Business': 'global',
      'Global Affairs, Law, & Policy': 'global',
    };
    return categoryMap[category] || null;
  };

  // Get active pathways (pathways where user has a coach)
  const activePathwayId = getPathwayIdFromCategory(currentMentor.category);
  const activePathways: Array<'deen' | 'health' | 'medicine' | 'engineering' | 'entrepreneurship' | 'global'> = 
    activePathwayId ? [activePathwayId] : [];

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
  
  const tiers = [
    { id: 'freshman', name: 'Freshman', icon: Sprout, minGames: 0, color: 'bg-green-500', darkColor: 'bg-green-700' },
    { id: 'jv', name: 'JV', icon: BookOpen, minGames: 3, color: 'bg-blue-500', darkColor: 'bg-blue-700' },
    { id: 'varsity', name: 'Varsity', icon: StarIcon, minGames: 6, color: 'bg-purple-500', darkColor: 'bg-purple-700' },
    { id: 'd1', name: 'D1', icon: Trophy, minGames: 10, color: 'bg-orange-500', darkColor: 'bg-orange-700' },
    { id: 'professional', name: 'Professional', icon: Gem, minGames: 15, color: 'bg-yellow-500', darkColor: 'bg-yellow-700' },
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

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
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
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="progress" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-slate-900 border border-slate-800 p-1">
              <TabsTrigger value="progress" className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white">
                <Trophy className="w-4 h-4 mr-2" />
                My Progress
              </TabsTrigger>
              <TabsTrigger value="messages" className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="profile" className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white">
                <UserCircle className="w-4 h-4 mr-2" />
                My Profile
              </TabsTrigger>
            </TabsList>
            <button
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
            <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-2xl border border-orange-500/30 p-6 mb-8">
              <h2 className="text-white text-center mb-2">Your Progress Level</h2>
              <p className="text-slate-400 text-center mb-6 text-sm">
                Level up by completing games and achieving your goals
              </p>
              
              {/* Progress Bar */}
              <div className="relative mb-6">
                {/* Background Bar - dark background for entire bar */}
                <div className="h-6 bg-slate-800 rounded-full overflow-hidden relative">
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
                        {currentTier.progress > 0 && filledWidthPercentOfBar > 0 && (
                          <div
                            className={`absolute top-0 h-full ${currentTierData.color}`}
                            style={{
                              left: `${tierIndex * tierWidthPercent}%`,
                              width: `${filledWidthPercentOfBar}%`,
                              zIndex: 35,
                              minWidth: '3px', // Ensure minimum visibility
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
            <div className="space-y-6">
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
            <div className="h-[calc(100vh-300px)] min-h-[600px]">
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
            <MenteeProfileSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}