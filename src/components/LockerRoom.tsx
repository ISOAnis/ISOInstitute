import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Video, Users, MapPin, Send, Lock, Play, AlertTriangle, X } from 'lucide-react';
import { PATHWAYS, PATHWAY_BY_ID, type PathwayId } from '../data/pathways';

type UserRole = 'player' | 'coach';

interface Message {
  id: string;
  userId: string;
  userName: string;
  userLocation?: string;
  content: string;
  timestamp: Date;
  pathwayId: PathwayId;
}

interface User {
  id: string;
  name: string;
  location?: string;
  state?: string;
  pathwayId: PathwayId;
  role: UserRole;
  isOnline: boolean;
}

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  pathwayId?: PathwayId;
  isExclusive: boolean;
}

const pathwayIcons: Record<PathwayId, string> = {
  deen: '☪️',
  health: '💪🏽',
  medicine: '⚕️',
  engineering: '⚙️',
  entrepreneurship: '🚀',
  global: '🌍',
};

const pathways = PATHWAYS.map((pathway) => ({
  id: pathway.id,
  name: pathway.name,
  legacyName: pathway.legacyName,
  icon: pathwayIcons[pathway.id],
  color: pathway.color,
}));

interface LockerRoomProps {
  userRole: UserRole;
  isPaidMember?: boolean;
  onClose?: () => void;
  activePathways?: PathwayId[]; // Pathways where user has an active coach
}

export function LockerRoom({ userRole, isPaidMember = true, onClose, activePathways = [] }: LockerRoomProps) {
  // For players: show all pathways but only allow access to ones with coaches
  // For coaches: show all pathways (they can access all)
  const availablePathways = pathways; // Show all pathways
  
  // Set initial pathway to first available pathway (or first pathway if none available)
  const initialPathway = activePathways.length > 0 
    ? activePathways[0] 
    : (userRole === 'coach' ? pathways[0].id : pathways[0].id);
  const [selectedPathway, setSelectedPathway] = useState<PathwayId>(initialPathway);
  const [activeTab, setActiveTab] = useState<'chat' | 'videos'>('chat');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showLockedMessage, setShowLockedMessage] = useState(!isPaidMember);
  const [showLockedOverlay, setShowLockedOverlay] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  
  // Check if user can access the selected pathway
  const canAccessPathway = userRole === 'coach' || activePathways.includes(selectedPathway);

  // Update selected pathway if current one is not available
  useEffect(() => {
    const canAccess = userRole === 'coach' || activePathways.includes(selectedPathway);
    if (!canAccess && availablePathways.length > 0) {
      setSelectedPathway(availablePathways[0].id);
    }
  }, [selectedPathway, activePathways, availablePathways, userRole]);

  // Mock messages - in production, this would come from a backend/WebSocket
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'Ahmad K.',
      userLocation: 'California, USA',
      content: 'Hey everyone! Just started my journey in Engineering. Excited to connect with others on this path!',
      timestamp: new Date(Date.now() - 3600000),
      pathwayId: 'engineering'
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Fatima M.',
      userLocation: 'Texas, USA',
      content: 'Welcome Ahmad! I\'ve been in the Engineering pathway for 3 months now. Happy to help!',
      timestamp: new Date(Date.now() - 3300000),
      pathwayId: 'engineering'
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Omar H.',
      userLocation: 'New York, USA',
      content: 'Anyone from NY? Would love to connect at the next ISO event!',
      timestamp: new Date(Date.now() - 3000000),
      pathwayId: 'engineering'
    },
    {
      id: '4',
      userId: 'user4',
      userName: 'Aisha R.',
      userLocation: 'California, USA',
      content: 'Building my spiritual foundation has been transformative. Grateful for this community!',
      timestamp: new Date(Date.now() - 1800000),
      pathwayId: 'deen'
    },
  ]);

  // Mock users - in production, this would come from backend
  const [onlineUsers, setOnlineUsers] = useState<User[]>([
    { id: 'user1', name: 'Ahmad K.', location: 'California, USA', state: 'CA', pathwayId: 'engineering', role: 'player', isOnline: true },
    { id: 'user2', name: 'Fatima M.', location: 'Texas, USA', state: 'TX', pathwayId: 'engineering', role: 'player', isOnline: true },
    { id: 'user3', name: 'Omar H.', location: 'New York, USA', state: 'NY', pathwayId: 'engineering', role: 'player', isOnline: true },
    { id: 'user4', name: 'Aisha R.', location: 'California, USA', state: 'CA', pathwayId: 'deen', role: 'player', isOnline: true },
    { id: 'user5', name: 'Coach Sarah', location: 'Illinois, USA', state: 'IL', pathwayId: 'medicine', role: 'coach', isOnline: true },
  ]);

  // Mock videos - in production, this would come from backend
  const [videos] = useState<Video[]>([
    // General videos (no pathwayId)
    {
      id: '1',
      title: 'Building Your Foundation: First Steps in Coacheship',
      description: 'Learn the fundamentals of starting your coacheship journey',
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
      duration: '15:30',
      isExclusive: true
    },
    {
      id: '2',
      title: 'ISO Community Event Highlights',
      description: 'Recap of our latest community gathering',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      duration: '12:20',
      isExclusive: true
    },
    // Pathway-specific videos
    {
      id: '3',
      title: `${PATHWAY_BY_ID.deen.name}: Building Spiritual Resilience`,
      description: 'Deep dive into integrating faith with daily life and purpose',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      duration: '22:15',
      pathwayId: 'deen',
      isExclusive: true
    },
    {
      id: '4',
      title: `${PATHWAY_BY_ID.health.name}: Discipline Through the Body`,
      description: 'Expert guidance on physical wellness and mental strength',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      duration: '18:30',
      pathwayId: 'health',
      isExclusive: true
    },
    {
      id: '5',
      title: `${PATHWAY_BY_ID.medicine.name}: Serving Through Healing`,
      description: 'Panel discussion with medical professionals on career paths',
      thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      duration: '25:45',
      pathwayId: 'medicine',
      isExclusive: true
    },
    {
      id: '6',
      title: `${PATHWAY_BY_ID.engineering.name}: Building Tomorrow`,
      description: 'Expert panel discussion on careers in tech and innovation',
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
      duration: '28:45',
      pathwayId: 'engineering',
      isExclusive: true
    },
    {
      id: '7',
      title: `${PATHWAY_BY_ID.entrepreneurship.name}: From Idea to Impact`,
      description: 'Stories from successful Muslim entrepreneurs',
      thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop',
      duration: '31:20',
      pathwayId: 'entrepreneurship',
      isExclusive: true
    },
    {
      id: '8',
      title: `${PATHWAY_BY_ID.global.name}: Leading with Purpose`,
      description: 'Navigating international careers and ethical leadership',
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
      duration: '26:10',
      pathwayId: 'global',
      isExclusive: true
    },
  ]);

  const filteredMessages = messages.filter(m => m.pathwayId === selectedPathway);
  const filteredUsers = onlineUsers.filter(u => 
    u.pathwayId === selectedPathway && 
    (userRole === 'coach' ? u.role === 'coach' : u.role === 'player')
  );
  
  // Filter videos: show general videos (no pathwayId) + videos for selected pathway
  const filteredVideos = videos.filter(v => 
    !v.pathwayId || v.pathwayId === selectedPathway
  );

  const handleSendMessage = () => {
    if (!messageInput.trim() || !isPaidMember) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      userLocation: 'Your Location',
      content: messageInput,
      timestamp: new Date(),
      pathwayId: selectedPathway
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
    
    // Scroll to bottom only when user sends a message
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Remove auto-scroll on filteredMessages change - only scroll when user sends a message

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const selectedPathwayData = pathways.find(p => p.id === selectedPathway);

  if (showLockedMessage) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center p-8" style={{ background: '#111111' }}>
        <div className="max-w-md w-full rounded-2xl border border-white/10 p-8 text-center" style={{ background: '#0a0a0f' }}>
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-orange-400" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-4">Locker Room Access</h2>
          <p className="text-slate-400 mb-6">
            The Locker Room is exclusively for paid members. Upgrade to Varsity or Professional to access exclusive content, pathway channels, and connect with your community.
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-colors"
            >
              Got It
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex rounded-2xl overflow-hidden" style={{ background: '#111111' }}>
      {/* Locked Pathway Overlay */}
      {showLockedOverlay && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          onClick={() => setShowLockedOverlay(false)}
        >
          <div 
            className="rounded-2xl border border-white/10 p-8 max-w-md w-full text-center" style={{ background: '#0a0a0f' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Channel Locked</h3>
            <p className="text-slate-400 mb-4">
              You cannot access this chat because you are not in this pathway.
            </p>
            <p className="text-slate-500 text-sm mb-6">
              Connect with a coach in the <span className="text-orange-400">{pathways.find(p => p.id === selectedPathway)?.name}</span> pathway to unlock this channel and connect with others on the same journey.
            </p>
            <button
              onClick={() => setShowLockedOverlay(false)}
              className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Sidebar - Pathway Channels */}
      <div className="w-64 border-r border-white/10 flex flex-col rounded-l-2xl overflow-hidden" style={{ background: '#0a0a0f' }}>
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-white font-bold text-lg mb-1">🏀 Locker Room</h2>
          <p className="text-slate-400 text-xs">
            {userRole === 'coach' ? 'Coach' : 'Player'} Channels
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="mb-4">
            <p className="text-slate-500 text-xs uppercase mb-2 px-2">Pathways</p>
            {pathways.map((pathway) => {
              const isLocked = userRole === 'player' && !activePathways.includes(pathway.id);
              return (
                <button
                  key={pathway.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isLocked) {
                      setSelectedPathway(pathway.id);
                      setShowLockedOverlay(true);
                    } else {
                      setSelectedPathway(pathway.id);
                    }
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors flex items-center gap-2 ${
                    selectedPathway === pathway.id
                      ? 'bg-slate-800 text-white'
                      : isLocked
                      ? 'text-slate-500 hover:bg-slate-800/30 cursor-pointer'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{pathway.icon}</span>
                  <span className="text-sm font-medium flex-1">{pathway.name}</span>
                  {isLocked && <Lock className="w-3 h-3 text-slate-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Exit Button - Always visible at bottom left */}
        <div className="p-4 border-t border-white/10" style={{ background: 'rgba(10, 10, 15, 0.5)' }}>
          {onClose ? (
            <button
              onClick={onClose}
              className="bg-slate-800 text-white px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
            >
              Exit Locker Room
            </button>
          ) : (
            <div className="bg-slate-800/50 text-slate-500 px-4 py-2.5 rounded-lg text-sm font-medium">
              Exit Locker Room
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col rounded-r-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 p-4 rounded-tr-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedPathwayData?.color || 'from-slate-600 to-slate-700'} flex items-center justify-center text-xl`}>
                {selectedPathwayData?.icon}
              </div>
              <div>
                <h3 className="text-white font-semibold">{selectedPathwayData?.name}</h3>
                {selectedPathwayData?.legacyName && (
                  <p className="text-xs !text-white" style={{ color: '#ffffff' }}>{selectedPathwayData.legacyName}</p>
                )}
                <p className="text-slate-400 text-xs">
                  {userRole === 'coach' 
                    ? 'Connect with other coaches' 
                    : 'Connect with fellow players'}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-slate-800 rounded-lg p-1">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveTab('chat');
                }}
                className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                  activeTab === 'chat'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">Chat</span>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveTab('videos');
                }}
                className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                  activeTab === 'videos'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-4 h-4" />
                <span className="text-sm">Videos</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Chat/Videos Area */}
          <div className="flex-1 flex flex-col bg-slate-950">
            {activeTab === 'chat' ? (
              <>
                {!canAccessPathway ? (
                  <>
                    <div className="flex-1 flex items-center justify-center p-8">
                      <div className="text-center max-w-md">
                        <Lock className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
                        <h3 className="text-white text-xl font-semibold mb-2">Channel Locked</h3>
                        <p className="text-slate-400 mb-4">
                          You need an active coach in the <span className="text-orange-400">{selectedPathwayData?.name}</span> pathway to access this channel.
                        </p>
                        <p className="text-slate-500 text-sm">
                          Connect with a coach in this pathway to unlock chat access and connect with others on the same journey.
                        </p>
                      </div>
                    </div>
                    {/* Message Input - Disabled when locked */}
                    <div className="border-t border-slate-800 p-4 bg-slate-900">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          placeholder={`Message #${selectedPathwayData?.name.toLowerCase()}`}
                          disabled={true}
                          className="flex-1 bg-slate-800/50 text-slate-500 rounded-lg px-4 py-2 border border-slate-700 cursor-not-allowed"
                        />
                        <button
                          disabled={true}
                          className="bg-slate-700 text-slate-500 px-6 py-2 rounded-lg cursor-not-allowed flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Send
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Disclaimer Banner */}
                    {showDisclaimer && (
                      <div className="bg-orange-500/10 border-b border-orange-500/30 px-4 py-3 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium mb-1">Community Guidelines</p>
                          <p className="text-slate-300 text-xs leading-relaxed">
                            This chat is meant to discuss relevant information to the program. Any inappropriate discussion, including talking bad about coaches, cursing, or saying inappropriate things, is strictly prohibited and will result in being banned from the program.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowDisclaimer(false)}
                          className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
                          aria-label="Dismiss disclaimer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {filteredMessages.length === 0 ? (
                        <div className="text-center text-slate-500 py-12">
                          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No messages yet. Be the first to start the conversation!</p>
                        </div>
                      ) : (
                        filteredMessages.map((message) => (
                          <div key={message.id} className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm font-semibold">
                                {message.userName.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-semibold text-sm">{message.userName}</span>
                                {message.userLocation && (
                                  <span className="text-slate-500 text-xs flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {message.userLocation}
                                  </span>
                                )}
                                <span className="text-slate-600 text-xs">{formatTime(message.timestamp)}</span>
                              </div>
                              <p className="text-slate-300 text-sm">{message.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-slate-800 p-4 bg-slate-900">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder={`Message #${selectedPathwayData?.name.toLowerCase()}`}
                          className="flex-1 bg-slate-800 text-white rounded-lg px-4 py-2 border border-slate-700 focus:border-orange-500 focus:outline-none"
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!messageInput.trim() || !canAccessPathway}
                          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Send
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              /* Videos Tab */
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-6">
                  <h3 className="text-white text-xl font-bold mb-2">Videos</h3>
                  <p className="text-slate-400 text-sm">
                    {selectedPathwayData 
                      ? `Videos for ${selectedPathwayData.name} and general content`
                      : 'Access workshops, community highlights, and pathway-specific content'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideos.length === 0 ? (
                    <div className="col-span-full text-center text-slate-500 py-12">
                      <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No videos available for this pathway yet.</p>
                    </div>
                  ) : (
                    filteredVideos.map((video) => (
                    <div
                      key={video.id}
                      className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group"
                    >
                      <div className="relative aspect-video bg-slate-800">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <Play className="w-6 h-6 text-white" fill="white" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="text-white font-semibold mb-1">{video.title}</h4>
                        <p className="text-slate-400 text-sm">{video.description}</p>
                      </div>
                    </div>
                  ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Users Sidebar */}
          {activeTab === 'chat' && canAccessPathway && (
            <div className="w-64 bg-slate-900 border-l border-slate-800 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-slate-400" />
                <h4 className="text-white font-semibold text-sm">
                  {userRole === 'coach' ? 'Coaches' : 'Players'} Online
                </h4>
                <span className="text-slate-500 text-xs">({filteredUsers.length})</span>
              </div>

              <div className="space-y-2">
                {filteredUsers.length === 0 ? (
                  <p className="text-slate-500 text-xs italic">No one online in this channel</p>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        {user.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{user.name}</p>
                        {user.location && (
                          <p className="text-slate-500 text-xs flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3" />
                            {user.state || user.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Group by State Section for Players */}
              {userRole === 'player' && filteredUsers.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <h5 className="text-slate-400 text-xs uppercase mb-3">Connect Locally</h5>
                  <div className="space-y-2">
                    {Array.from(new Set(filteredUsers.map(u => u.state).filter(Boolean))).map((state) => {
                      const stateUsers = filteredUsers.filter(u => u.state === state);
                      return (
                        <button
                          key={state}
                          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white text-sm">{state}</span>
                            <span className="text-slate-500 text-xs">{stateUsers.length}</span>
                          </div>
                          <p className="text-slate-500 text-xs mt-0.5">
                            {stateUsers.length === 1 ? 'person' : 'people'} from your state
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

