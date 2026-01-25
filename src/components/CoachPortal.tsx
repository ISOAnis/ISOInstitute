import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Trophy, Target, CheckCircle2, Circle, Award, TrendingUp, Calendar, MessageSquare, Plus, Edit3, Save, X, User, Clock, AlertCircle, Users, Sparkles, UserCircle, Moon, ArrowRight } from 'lucide-react';
import { PortalTutorial } from './PortalTutorial';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MentorProfileSection } from './MentorProfileSection';
import { AIMatchingDashboard } from './AIMatchingDashboard';
import { LockerRoom } from './LockerRoom';
import { MentorMenteeChat } from './MentorMenteeChat';
import { CoachProfileCompletionModal } from './CoachProfileCompletionModal';

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  coachName: string;
}

interface Bucket {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  coachApproved: boolean;
  comments: Comment[];
  pendingApproval?: boolean;
}

interface Game {
  id: string;
  title: string;
  buckets: Bucket[];
  completed: boolean;
  completedDate?: string;
  description?: string;
}

interface Player {
  id: string;
  name: string;
  email: string;
  category: string;
  categoryIcon: string | typeof Moon;
  joinedDate: string;
  games: Game[];
  avatar?: string;
}

// Mock data - in production this would come from backend
const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    category: 'Deen & Purpose',
    categoryIcon: Moon,
    joinedDate: '2024-09-01',
    games: [
      {
        id: '1',
        title: 'Establish Daily Prayer Routine',
        description: 'Build foundational prayer habits',
        completed: true,
        completedDate: '2024-10-15',
        buckets: [
          { 
            id: '1-1', 
            title: 'Pray Fajr on time for 7 days', 
            description: 'Build consistency with morning prayer', 
            completed: true, 
            coachApproved: true,
            comments: [
              { id: 'c1', text: 'Excellent work! Your consistency is inspiring.', createdAt: '2024-10-14', coachName: 'Imam Abdullah' }
            ]
          },
          { 
            id: '1-2', 
            title: 'Learn proper wudu technique', 
            description: 'Master the ablution process', 
            completed: true, 
            coachApproved: true,
            comments: []
          },
        ]
      },
      {
        id: '2',
        title: 'Build Spiritual Foundation',
        description: 'Deepen understanding of faith',
        completed: false,
        buckets: [
          { 
            id: '2-1', 
            title: 'Read 10 pages of Quran daily', 
            description: 'Consistent engagement with scripture', 
            completed: true, 
            coachApproved: false,
            pendingApproval: true,
            comments: []
          },
          { 
            id: '2-2', 
            title: 'Attend Friday Jummah for 4 weeks', 
            description: 'Connect with community', 
            completed: false, 
            coachApproved: false,
            dueDate: '2024-11-22',
            comments: []
          },
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Fatima Ali',
    email: 'fatima.ali@email.com',
    category: 'Deen & Purpose',
    categoryIcon: Moon,
    joinedDate: '2024-10-01',
    games: [
      {
        id: '1',
        title: 'Quranic Memorization',
        description: 'Begin memorizing key surahs',
        completed: false,
        buckets: [
          { 
            id: '1-1', 
            title: 'Memorize Surah Al-Mulk', 
            description: 'Complete memorization with tajweed', 
            completed: false, 
            coachApproved: false,
            dueDate: '2024-12-01',
            comments: []
          },
        ]
      }
    ]
  }
];

const COACH_TUTORIAL_KEY = 'iso_tutorial_completed_coach_page';

type CoachTab = 'players' | 'messages' | 'matching' | 'profile';

export function CoachPortal() {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(players[0]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [newGameTitle, setNewGameTitle] = useState('');
  const [newGameDescription, setNewGameDescription] = useState('');
  const [showNewGameForm, setShowNewGameForm] = useState(false);
  const [selectedPlayerForChat, setSelectedPlayerForChat] = useState<Player | null>(players[0]);
  const [showLockerRoom, setShowLockerRoom] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showCoachProfileCompletionModal, setShowCoachProfileCompletionModal] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(() => {
    const saved = localStorage.getItem('coach_profile_completion');
    return saved ? Number(saved) : 0;
  });
  const [coachProfilePicture, setCoachProfilePicture] = useState<string | null>(() => {
    return localStorage.getItem('coach_profile_picture');
  });
  const [activeTab, setActiveTab] = useState<CoachTab>('players');
  const profileSectionRef = useRef<HTMLDivElement | null>(null);
  const showProfileCompletion = profileCompletion < 100;

  // Check if tutorial should be shown
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem(COACH_TUTORIAL_KEY);
    if (!tutorialCompleted) {
      setTimeout(() => setShowTutorial(true), 150);
    }
  }, []);

  const handleStartTutorial = () => {
    localStorage.removeItem(COACH_TUTORIAL_KEY);
    localStorage.removeItem('iso_tutorial_completed_coach');
    setShowTutorial(true);
  };

  useEffect(() => {
    localStorage.setItem('coach_profile_completion', String(profileCompletion));
  }, [profileCompletion]);

  useEffect(() => {
    if (coachProfilePicture) {
      localStorage.setItem('coach_profile_picture', coachProfilePicture);
    } else {
      localStorage.removeItem('coach_profile_picture');
    }
  }, [coachProfilePicture]);

  const focusProfileSection = () => {
    setActiveTab('profile');
    setTimeout(() => {
      profileSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleCoachProfileComplete = (profileData: any) => {
    // Save profile data to localStorage
    localStorage.setItem('coach_profile_data', JSON.stringify(profileData));
    setShowCoachProfileCompletionModal(false);
    setProfileCompletion(100);
  };

  const coachTutorialSteps = [
    {
      title: 'Welcome to Your Coach Portal!',
      description: 'This is your coaching dashboard where you\'ll manage players, track their progress, and build your coaching brand. Let\'s get you started!'
    },
    {
      title: 'Player Management',
      description: 'View all your players in the "Your Players" section. Click on a player to see their games, progress, and communicate directly with them.'
    },
    {
      title: 'Games & Buckets',
      description: 'Create games (goals) for your players and break them down into buckets (actionable steps). Track completion and provide feedback through comments.'
    },
    {
      title: 'Communication',
      description: 'Use the Messages tab to chat with your players. Provide guidance, answer questions, and build meaningful coaching relationships.'
    },
    {
      title: 'AI Matching Dashboard',
      description: 'The AI Matching Dashboard helps you find new players who match your expertise and coaching style. Review match scores and accept requests.'
    },
    {
      title: 'Complete Your Profile',
      description: 'Finish setting up your coach profile to get published on ISO! Add your bio, expertise, and availability to start attracting players.'
    }
  ];

  // Mock current coach data
  const currentCoach = {
    name: 'Imam Abdullah Rahman',
    category: 'Deen & Purpose',
    categoryIcon: Moon,
    profilePicture: coachProfilePicture
  };

  const addComment = (playerId: string, gameId: string, bucketId: string) => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      text: commentText,
      createdAt: new Date().toISOString(),
      coachName: currentCoach.name
    };

    setPlayers(players.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          games: player.games.map(game => {
            if (game.id === gameId) {
              return {
                ...game,
                buckets: game.buckets.map(bucket =>
                  bucket.id === bucketId
                    ? { ...bucket, comments: [...bucket.comments, newComment] }
                    : bucket
                )
              };
            }
            return game;
          })
        };
      }
      return player;
    }));

    setCommentText('');
    setEditingComment(null);
  };

  const approveBucket = (playerId: string, gameId: string, bucketId: string) => {
    setPlayers(players.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          games: player.games.map(game => {
            if (game.id === gameId) {
              const updatedBuckets = game.buckets.map(bucket =>
                bucket.id === bucketId
                  ? { ...bucket, coachApproved: true, pendingApproval: false }
                  : bucket
              );
              const allBucketsApproved = updatedBuckets.every(b => b.completed && b.coachApproved);
              return {
                ...game,
                buckets: updatedBuckets,
                completed: allBucketsApproved,
                completedDate: allBucketsApproved ? new Date().toISOString().split('T')[0] : game.completedDate
              };
            }
            return game;
          })
        };
      }
      return player;
    }));
  };

  const addNewGame = (playerId: string) => {
    if (!newGameTitle.trim()) return;

    const newGame: Game = {
      id: `g-${Date.now()}`,
      title: newGameTitle,
      description: newGameDescription,
      completed: false,
      buckets: []
    };

    setPlayers(players.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          games: [...player.games, newGame]
        };
      }
      return player;
    }));

    setNewGameTitle('');
    setNewGameDescription('');
    setShowNewGameForm(false);
  };

  const calculatePlayerStats = (player: Player) => {
    const totalGames = player.games.length;
    const gamesWon = player.games.filter(g => g.completed).length;
    const totalBuckets = player.games.reduce((sum, game) => sum + game.buckets.length, 0);
    const bucketsScored = player.games.reduce((sum, game) => 
      sum + game.buckets.filter(b => b.completed && b.coachApproved).length, 0
    );
    const pendingApprovals = player.games.reduce((sum, game) => 
      sum + game.buckets.filter(b => b.pendingApproval).length, 0
    );
    const isChampion = gamesWon >= 6;

    return { totalGames, gamesWon, totalBuckets, bucketsScored, pendingApprovals, isChampion };
  };

  const allStats = {
    totalPlayers: players.length,
    totalPendingApprovals: players.reduce((sum, player) => 
      sum + player.games.reduce((gameSum, game) => 
        gameSum + game.buckets.filter(b => b.pendingApproval).length, 0
      ), 0
    ),
    totalActiveGames: players.reduce((sum, player) => 
      sum + player.games.filter(g => !g.completed).length, 0
    ),
    champions: players.filter(player => 
      player.games.filter(g => g.completed).length >= 6
    ).length
  };

  return (
    <div className="px-4 sm:px-8">
      {/* Tutorial */}
      {showTutorial && (
        <PortalTutorial
          steps={coachTutorialSteps}
          onComplete={() => {
            localStorage.setItem(COACH_TUTORIAL_KEY, 'true');
            setShowTutorial(false);
          }}
          role="coach"
        />
      )}

      {/* Coach Profile Completion Modal */}
      {showCoachProfileCompletionModal && (
        <CoachProfileCompletionModal
          onClose={() => setShowCoachProfileCompletionModal(false)}
          onComplete={handleCoachProfileComplete}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Profile Completion Banner */}
        {showProfileCompletion && (
          <div className="mb-6 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-2 border-orange-500/50 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <AlertCircle className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Complete Your Coach Profile</h3>
                <p className="text-slate-300 text-sm">
                  Finish setting up your account to get published on ISO and start attracting players.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCoachProfileCompletionModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
            >
              Complete Profile
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14 border border-slate-700">
              {currentCoach.profilePicture ? (
                <AvatarImage src={currentCoach.profilePicture} alt={currentCoach.name} />
              ) : (
                <AvatarFallback className="bg-orange-500 text-white text-lg">
                  {currentCoach.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h1 className="text-white mb-1">Coach Portal</h1>
          <div className="flex items-center gap-2 text-slate-400">
                {React.createElement(currentCoach.categoryIcon, { className: 'w-5 h-5 text-white' })}
            <span className="text-orange-400">{currentCoach.category}</span>
            <span> • {currentCoach.name}</span>
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
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as CoachTab)} className="space-y-6">
          <div className="flex items-center justify-between">
          <TabsList className="bg-slate-900 border border-slate-800 p-1">
            <TabsTrigger value="players" className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              My Players
            </TabsTrigger>
              <TabsTrigger value="messages" className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
            </TabsTrigger>
            <TabsTrigger value="matching" className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Matching
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
                  userRole="coach" 
                  isPaidMember={true}
                  onClose={() => setShowLockerRoom(false)}
                />
              </div>
            </div>
          )}

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Players List */}
              <div className="lg:col-span-1">
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4">
                  <h3 className="text-white font-semibold mb-4">Your Players</h3>
                  <div className="space-y-2">
                            {players.map((player) => {
                        const PlayerCategoryIcon = typeof player.categoryIcon === 'string' && player.categoryIcon === '☪️' ? Moon : (typeof player.categoryIcon !== 'string' ? player.categoryIcon : null);
                        return (
                      <button
                        key={player.id}
                        onClick={() => setSelectedPlayerForChat(player)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedPlayerForChat?.id === player.id
                            ? 'bg-orange-500/20 border border-orange-500/50'
                            : 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={player.avatar} alt={player.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                              {player.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{player.name}</p>
                            <p className="text-slate-400 text-xs truncate flex items-center gap-1">
                              {PlayerCategoryIcon && React.createElement(PlayerCategoryIcon, { className: 'w-3 h-3' })}
                              {player.category}
                            </p>
                          </div>
                        </div>
                      </button>
                    )})}
                  </div>
                </div>
              </div>

              {/* Chat Area */}
              <div className="lg:col-span-3">
                {selectedPlayerForChat ? (
                  <div className="h-[calc(100vh-300px)] min-h-[600px]">
                    <MentorMenteeChat
                      currentUserId="mentor-1"
                      currentUserName={currentCoach.name}
                      currentUserRole="mentor"
                      otherUserId={selectedPlayerForChat.id}
                      otherUserName={selectedPlayerForChat.name}
                      otherUserRole="mentee"
                      otherUserAvatar={selectedPlayerForChat.avatar}
                      category={selectedPlayerForChat.category}
                      categoryIcon={selectedPlayerForChat.categoryIcon}
                    />
                  </div>
                ) : (
                  <div className="h-[calc(100vh-300px)] min-h-[600px] flex items-center justify-center bg-slate-900 rounded-2xl border border-slate-800">
                    <div className="text-center">
                      <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <h3 className="text-white font-semibold mb-2">Select a Player</h3>
                      <p className="text-slate-400 text-sm">Choose a player from the list to start chatting</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* My Players Tab */}
          <TabsContent value="players" className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <User className="w-8 h-8 text-blue-500" />
                  <span className="text-blue-400">Players</span>
                </div>
                <div className="text-white mb-1">{allStats.totalPlayers}</div>
                <p className="text-slate-400 text-sm">Active Players</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <AlertCircle className="w-8 h-8 text-orange-500" />
                  <span className="text-orange-400">Pending</span>
                </div>
                <div className="text-white mb-1">{allStats.totalPendingApprovals}</div>
                <p className="text-slate-400 text-sm">Awaiting Review</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Target className="w-8 h-8 text-green-500" />
                  <span className="text-green-400">Games</span>
                </div>
                <div className="text-white mb-1">{allStats.totalActiveGames}</div>
                <p className="text-slate-400 text-sm">In Progress</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Award className="w-8 h-8 text-yellow-500" />
                  <span className="text-yellow-400">Champions</span>
                </div>
                <div className="text-white mb-1">{allStats.champions}</div>
                <p className="text-slate-400 text-sm">Graduated</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Players Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                  <h3 className="text-white mb-4">Your Players</h3>
                  <div className="space-y-3">
                    {players.map((player) => {
                      const stats = calculatePlayerStats(player);
                      return (
                        <button
                          key={player.id}
                          onClick={() => {
                            setSelectedPlayer(player);
                            setSelectedGame(null);
                          }}
                          className={`w-full text-left p-4 rounded-xl border transition-all ${
                            selectedPlayer?.id === player.id
                              ? 'bg-orange-500/10 border-orange-500/50'
                              : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={player.avatar} />
                              <AvatarFallback className="bg-orange-500 text-white">
                                {player.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white truncate">{player.name}</h4>
                              <p className="text-slate-400 text-sm">
                                {stats.gamesWon}/{stats.totalGames} games won
                              </p>
                              {stats.pendingApprovals > 0 && (
                                <Badge className="mt-2 bg-orange-500/20 text-orange-400 border-orange-500/30">
                                  {stats.pendingApprovals} pending
                                </Badge>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Player Details */}
              <div className="lg:col-span-2">
                {selectedPlayer ? (
                  <div className="space-y-6">
                    {/* Player Header */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={selectedPlayer.avatar} />
                            <AvatarFallback className="bg-orange-500 text-white text-xl">
                              {selectedPlayer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h2 className="text-white mb-1">{selectedPlayer.name}</h2>
                            <p className="text-slate-400 text-sm">{selectedPlayer.email}</p>
                            <p className="text-slate-500 text-sm mt-1">
                              Joined {new Date(selectedPlayer.joinedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button className="bg-orange-500 text-white hover:bg-orange-600">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </div>

                      {/* Player Stats */}
                      {(() => {
                        const stats = calculatePlayerStats(selectedPlayer);
                        return (
                          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                            <div className="text-center">
                              <div className="text-orange-400 mb-1">{stats.bucketsScored}/{stats.totalBuckets}</div>
                              <p className="text-slate-400 text-sm">Buckets</p>
                            </div>
                            <div className="text-center">
                              <div className="text-blue-400 mb-1">{stats.gamesWon}/{stats.totalGames}</div>
                              <p className="text-slate-400 text-sm">Games</p>
                            </div>
                            <div className="text-center">
                              <div className={stats.isChampion ? 'text-yellow-400 mb-1 flex items-center justify-center' : 'text-slate-500 mb-1'}>
                                {stats.isChampion ? <Trophy className="w-5 h-5" /> : `${6 - stats.gamesWon} to go`}
                              </div>
                              <p className="text-slate-400 text-sm">Champion</p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Games & Goals */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white">Games & Goals</h3>
                        <Button 
                          onClick={() => setShowNewGameForm(!showNewGameForm)}
                          className="bg-orange-500 text-white hover:bg-orange-600"
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          New Game
                        </Button>
                      </div>

                      {/* New Game Form */}
                      {showNewGameForm && (
                        <div className="mb-6 p-4 bg-slate-800 rounded-xl border border-slate-700">
                          <h4 className="text-white mb-3">Create New Game</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-slate-400 mb-1 text-sm">Game Title</label>
                              <input
                                type="text"
                                value={newGameTitle}
                                onChange={(e) => setNewGameTitle(e.target.value)}
                                placeholder="e.g., Establish Daily Prayer Routine"
                                className="w-full bg-slate-900 text-white rounded-lg p-2 border border-slate-600 focus:border-orange-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1 text-sm">Description</label>
                              <input
                                type="text"
                                value={newGameDescription}
                                onChange={(e) => setNewGameDescription(e.target.value)}
                                placeholder="Brief description of this milestone"
                                className="w-full bg-slate-900 text-white rounded-lg p-2 border border-slate-600 focus:border-orange-500 focus:outline-none"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => addNewGame(selectedPlayer.id)}
                                className="bg-orange-500 text-white hover:bg-orange-600"
                              >
                                Create Game
                              </Button>
                              <Button 
                                onClick={() => {
                                  setShowNewGameForm(false);
                                  setNewGameTitle('');
                                  setNewGameDescription('');
                                }}
                                variant="outline"
                                className="border-slate-600 text-slate-400 hover:bg-slate-800"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Games List */}
                      <div className="space-y-4">
                        {selectedPlayer.games.map((game) => {
                          const bucketsCompleted = game.buckets.filter(b => b.completed && b.coachApproved).length;
                          const totalBucketsInGame = game.buckets.length;
                          const progress = totalBucketsInGame > 0 ? Math.round((bucketsCompleted / totalBucketsInGame) * 100) : 0;
                          const pendingInGame = game.buckets.filter(b => b.pendingApproval).length;

                          return (
                            <div key={game.id} className="bg-slate-800 rounded-xl border border-slate-700">
                              {/* Game Header */}
                              <div 
                                className={`p-4 cursor-pointer transition-colors ${
                                  game.completed 
                                    ? 'bg-gradient-to-r from-green-900/30 to-green-800/20' 
                                    : 'hover:bg-slate-800/80'
                                }`}
                                onClick={() => setSelectedGame(selectedGame?.id === game.id ? null : game)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    {game.completed ? (
                                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                        <Trophy className="w-5 h-5 text-green-500" />
                                      </div>
                                    ) : (
                                      <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                        <Target className="w-5 h-5 text-orange-500" />
                                      </div>
                                    )}
                                    <div>
                                      <h4 className="text-white">{game.title}</h4>
                                      {game.description && (
                                        <p className="text-slate-500 text-sm">{game.description}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-white text-sm">
                                      {bucketsCompleted}/{totalBucketsInGame} buckets
                                    </div>
                                    {pendingInGame > 0 && (
                                      <Badge className="mt-1 bg-orange-500/20 text-orange-400 border-orange-500/30">
                                        {pendingInGame} pending
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                {!game.completed && totalBucketsInGame > 0 && (
                                  <div className="mt-3 bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                      className="bg-gradient-to-r from-orange-500 to-orange-400 h-full transition-all duration-500"
                                      style={{ width: `${progress}%` }}
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Buckets List (Expandable) */}
                              {selectedGame?.id === game.id && (
                                <div className="p-4 border-t border-slate-700">
                                  <div className="space-y-3">
                                    {game.buckets.map((bucket) => (
                                      <div
                                        key={bucket.id}
                                        className={`p-4 rounded-lg border ${
                                          bucket.coachApproved
                                            ? 'bg-green-900/20 border-green-700/50'
                                            : bucket.pendingApproval
                                            ? 'bg-orange-900/20 border-orange-700/50'
                                            : 'bg-slate-900 border-slate-600'
                                        }`}
                                      >
                                        <div className="flex items-start gap-3 mb-3">
                                          <div className="flex-shrink-0 mt-1">
                                            {bucket.coachApproved ? (
                                              <CheckCircle2 className="w-6 h-6 text-green-500" />
                                            ) : bucket.completed ? (
                                              <Clock className="w-6 h-6 text-orange-500" />
                                            ) : (
                                              <Circle className="w-6 h-6 text-slate-500" />
                                            )}
                                          </div>
                                          <div className="flex-1">
                                            <h5 className={`${bucket.coachApproved ? 'text-slate-400 line-through' : 'text-white'} mb-1`}>
                                              {bucket.title}
                                            </h5>
                                            <p className="text-slate-500 text-sm mb-2">{bucket.description}</p>
                                            
                                            {bucket.dueDate && !bucket.completed && (
                                              <div className="flex items-center gap-2 text-orange-400 text-sm mb-2">
                                                <Calendar className="w-4 h-4" />
                                                Due: {new Date(bucket.dueDate).toLocaleDateString()}
                                              </div>
                                            )}

                                            {bucket.pendingApproval && (
                                              <div className="mt-3">
                                                <Button
                                                  onClick={() => approveBucket(selectedPlayer.id, game.id, bucket.id)}
                                                  className="bg-green-600 text-white hover:bg-green-700"
                                                  size="sm"
                                                >
                                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                                  Approve Completion
                                                </Button>
                                              </div>
                                            )}

                                            {/* Comments Section */}
                                            {bucket.comments.length > 0 && (
                                              <div className="mt-3 space-y-2">
                                                {bucket.comments.map((comment) => (
                                                  <div key={comment.id} className="bg-slate-800/50 rounded p-3 text-sm">
                                                    <div className="flex items-start justify-between mb-1">
                                                      <span className="text-orange-400">{comment.coachName}</span>
                                                      <span className="text-slate-500 text-xs">
                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                      </span>
                                                    </div>
                                                    <p className="text-slate-300">{comment.text}</p>
                                                  </div>
                                                ))}
                                              </div>
                                            )}

                                            {/* Add Comment Form */}
                                            {editingComment === bucket.id ? (
                                              <div className="mt-3 space-y-2">
                                                <Textarea
                                                  value={commentText}
                                                  onChange={(e) => setCommentText(e.target.value)}
                                                  placeholder="Write feedback or encouragement..."
                                                  className="bg-slate-800 border-slate-600 text-white"
                                                  rows={3}
                                                />
                                                <div className="flex gap-2">
                                                  <Button
                                                    onClick={() => addComment(selectedPlayer.id, game.id, bucket.id)}
                                                    className="bg-orange-500 text-white hover:bg-orange-600"
                                                    size="sm"
                                                  >
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Post Comment
                                                  </Button>
                                                  <Button
                                                    onClick={() => {
                                                      setEditingComment(null);
                                                      setCommentText('');
                                                    }}
                                                    variant="outline"
                                                    className="border-slate-600 text-slate-400 hover:bg-slate-800"
                                                    size="sm"
                                                  >
                                                    <X className="w-4 h-4 mr-2" />
                                                    Cancel
                                                  </Button>
                                                </div>
                                              </div>
                                            ) : (
                                              <Button
                                                onClick={() => setEditingComment(bucket.id)}
                                                variant="outline"
                                                className="mt-3 border-slate-600 text-slate-400 hover:bg-slate-800"
                                                size="sm"
                                              >
                                                <Edit3 className="w-4 h-4 mr-2" />
                                                Add Comment
                                              </Button>
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
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center">
                    <User className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-white mb-2">Select a Player</h3>
                    <p className="text-slate-400">Choose a player from the sidebar to view their progress and manage their goals</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* AI Matching Tab */}
          <TabsContent value="matching" className="space-y-6">
            <AIMatchingDashboard />
          </TabsContent>

          {/* My Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div ref={profileSectionRef} id="coach-profile-section">
              <MentorProfileSection
                onProfileCompletionChange={setProfileCompletion}
                onProfilePictureChange={setCoachProfilePicture}
                initialProfilePicture={coachProfilePicture}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}