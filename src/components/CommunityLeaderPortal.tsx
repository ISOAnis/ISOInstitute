import { useState } from 'react';
import { Calendar, Users, TrendingUp, Clock, MessageSquare, Phone, Video, CheckCircle2, AlertCircle, Heart, Filter, Search, Plus, Edit3, X, Building2, HandshakeIcon, CalendarCheck, DollarSign, Download } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Note {
  id: string;
  text: string;
  createdAt: string;
  isPrivate: boolean;
}

interface Session {
  id: string;
  type: 'counseling' | 'ruqya' | 'mediation' | 'convert-support' | 'mental-health' | 'dispute';
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  date: string;
  time: string;
  duration: number;
  format: 'in-person' | 'phone' | 'video';
  notes: Note[];
  followUpNeeded?: boolean;
}

interface CommunityMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  sessions: Session[];
  avatar?: string;
  status: 'active' | 'inactive' | 'needs-followup';
  tags: string[];
}

interface Partner {
  id: string;
  name: string;
  type: 'humanitarian' | 'education' | 'local' | 'youth';
  contactName: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'inactive';
  since: string;
  logo?: string;
}

interface Event {
  id: string;
  title: string;
  type: 'fundraiser' | 'workshop' | 'youth-event' | 'community-iftar' | 'education' | 'dawah';
  partnerId: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'completed' | 'pending-approval';
  expectedAttendees?: number;
  actualAttendees?: number;
  donationGoal?: number;
  donationsRaised?: number;
  volunteers?: number;
  description: string;
}

// Mock partner organizations
const mockPartners: Partner[] = [
  {
    id: 'p1',
    name: 'Islamic Relief USA',
    type: 'humanitarian',
    contactName: 'Sarah Ahmed',
    email: 'sarah.ahmed@islamicrelief.org',
    phone: '(555) 100-0001',
    status: 'active',
    since: '2023-01-15'
  },
  {
    id: 'p2',
    name: 'ICNA Relief',
    type: 'humanitarian',
    contactName: 'Ahmed Khan',
    email: 'ahmed.khan@icnarelief.org',
    phone: '(555) 100-0002',
    status: 'active',
    since: '2022-08-20'
  },
  {
    id: 'p3',
    name: 'Helping Hand for Relief',
    type: 'humanitarian',
    contactName: 'Fatima Ali',
    email: 'fatima@hhrd.org',
    phone: '(555) 100-0003',
    status: 'active',
    since: '2023-03-10'
  },
  {
    id: 'p4',
    name: 'Muslim Youth Center',
    type: 'youth',
    contactName: 'Ibrahim Hassan',
    email: 'ibrahim@myc.org',
    phone: '(555) 100-0004',
    status: 'active',
    since: '2023-06-01'
  },
  {
    id: 'p5',
    name: 'Al-Maghrib Institute',
    type: 'education',
    contactName: 'Ustadh Yasir',
    email: 'yasir@almaghrib.org',
    phone: '(555) 100-0005',
    status: 'pending',
    since: '2024-11-01'
  }
];

// Mock events
const mockEvents: Event[] = [
  {
    id: 'e1',
    title: 'Palestine Emergency Fundraiser',
    type: 'fundraiser',
    partnerId: 'p1',
    date: '2024-11-20',
    time: '19:00',
    location: 'Main Prayer Hall',
    status: 'upcoming',
    expectedAttendees: 250,
    donationGoal: 50000,
    volunteers: 15,
    description: 'Emergency fundraising event for humanitarian aid in Palestine. Featuring guest speaker and dinner.'
  },
  {
    id: 'e2',
    title: 'Youth Leadership Workshop',
    type: 'workshop',
    partnerId: 'p4',
    date: '2024-11-18',
    time: '14:00',
    location: 'Community Center',
    status: 'upcoming',
    expectedAttendees: 50,
    volunteers: 8,
    description: 'Interactive workshop teaching Islamic leadership principles to youth ages 13-18.'
  },
  {
    id: 'e3',
    title: 'Community Iftar & Fundraiser',
    type: 'community-iftar',
    partnerId: 'p2',
    date: '2024-03-15',
    time: '18:30',
    location: 'Main Prayer Hall',
    status: 'completed',
    expectedAttendees: 300,
    actualAttendees: 320,
    donationGoal: 30000,
    donationsRaised: 35500,
    volunteers: 25,
    description: 'Community iftar with ICNA Relief to raise funds for orphan sponsorship program.'
  },
  {
    id: 'e4',
    title: 'Fiqh of Worship Seminar',
    type: 'education',
    partnerId: 'p5',
    date: '2024-11-25',
    time: '10:00',
    location: 'Education Wing',
    status: 'pending-approval',
    expectedAttendees: 100,
    volunteers: 5,
    description: 'Full-day seminar on the fiqh of prayer, fasting, and zakat with Al-Maghrib Institute.'
  },
  {
    id: 'e5',
    title: 'Thanksgiving Food Drive',
    type: 'fundraiser',
    partnerId: 'p3',
    date: '2024-10-28',
    time: '09:00',
    location: 'Parking Lot',
    status: 'completed',
    actualAttendees: 45,
    volunteers: 12,
    description: 'Food collection drive with Helping Hand for local families in need.'
  }
];

// Mock data
const mockMembers: CommunityMember[] = [
  {
    id: '1',
    name: 'Omar Abdullah',
    email: 'omar.abdullah@email.com',
    phone: '(555) 123-4567',
    joinedDate: '2024-08-15',
    status: 'needs-followup',
    tags: ['Marriage Counseling', 'Regular'],
    sessions: [
      {
        id: 's1',
        type: 'mediation',
        status: 'completed',
        date: '2024-11-05',
        time: '14:00',
        duration: 60,
        format: 'in-person',
        followUpNeeded: true,
        notes: [
          { id: 'n1', text: 'First mediation session. Both parties willing to reconcile. Scheduled follow-up.', createdAt: '2024-11-05', isPrivate: true }
        ]
      },
      {
        id: 's2',
        type: 'mediation',
        status: 'scheduled',
        date: '2024-11-15',
        time: '15:00',
        duration: 60,
        format: 'in-person',
        notes: []
      }
    ]
  },
  {
    id: '2',
    name: 'Aisha Rahman',
    email: 'aisha.rahman@email.com',
    phone: '(555) 234-5678',
    joinedDate: '2024-10-20',
    status: 'active',
    tags: ['New Convert', 'Learning'],
    sessions: [
      {
        id: 's3',
        type: 'convert-support',
        status: 'completed',
        date: '2024-10-25',
        time: '18:00',
        duration: 45,
        format: 'video',
        notes: [
          { id: 'n2', text: 'New shahada. Discussed prayer basics and connected with sister mentor.', createdAt: '2024-10-25', isPrivate: false }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Yusuf Hassan',
    email: 'yusuf.hassan@email.com',
    phone: '(555) 345-6789',
    joinedDate: '2024-09-01',
    status: 'active',
    tags: ['Ruqya', 'Spiritual Health'],
    sessions: [
      {
        id: 's4',
        type: 'ruqya',
        status: 'pending',
        date: '2024-11-12',
        time: '16:00',
        duration: 90,
        format: 'in-person',
        notes: []
      }
    ]
  }
];

const sessionTypeConfig = {
  'counseling': { label: 'Spiritual Counseling', emoji: '🤲', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  'ruqya': { label: 'Ruqya Session', emoji: '📿', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  'mediation': { label: 'Marriage/Divorce', emoji: '💔', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  'convert-support': { label: 'Convert Support', emoji: '🕌', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  'mental-health': { label: 'Mental Health', emoji: '💭', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  'dispute': { label: 'Community Dispute', emoji: '⚖️', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' }
};

export function CommunityLeaderPortal() {
  const [members, setMembers] = useState<CommunityMember[]>(mockMembers);
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(members[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newNote, setNewNote] = useState('');
  const [editingSession, setEditingSession] = useState<string | null>(null);

  // Mock imam data
  const currentImam = {
    name: 'Imam Khalid Ibrahim',
    masjid: 'Islamic Center of Excellence',
    location: 'Chicago, IL'
  };

  // Calculate statistics
  const stats = {
    totalMembers: members.length,
    activeCases: members.filter(m => m.status === 'needs-followup').length,
    upcomingSessions: members.reduce((sum, member) => 
      sum + member.sessions.filter(s => s.status === 'scheduled' || s.status === 'pending').length, 0
    ),
    thisWeekSessions: members.reduce((sum, member) => {
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return sum + member.sessions.filter(s => {
        const sessionDate = new Date(s.date);
        return sessionDate >= new Date() && sessionDate <= weekFromNow;
      }).length;
    }, 0)
  };

  const sessionStats = {
    counseling: 0,
    ruqya: 0,
    mediation: 0,
    'convert-support': 0,
    'mental-health': 0,
    dispute: 0
  };

  members.forEach(member => {
    member.sessions.forEach(session => {
      if (session.status === 'completed') {
        sessionStats[session.type]++;
      }
    });
  });

  const addNote = (memberId: string, sessionId: string) => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: `n-${Date.now()}`,
      text: newNote,
      createdAt: new Date().toISOString().split('T')[0],
      isPrivate: true
    };

    setMembers(members.map(member => {
      if (member.id === memberId) {
        return {
          ...member,
          sessions: member.sessions.map(session =>
            session.id === sessionId
              ? { ...session, notes: [...session.notes, note] }
              : session
          )
        };
      }
      return member;
    }));

    setNewNote('');
    setEditingSession(null);
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white mb-2">Community Leader Portal</h1>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-2xl">🕌</span>
            <div>
              <span className="text-orange-400">{currentImam.masjid}</span>
              <span> • {currentImam.name} • {currentImam.location}</span>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-500" />
              <span className="text-blue-400">Members</span>
            </div>
            <div className="text-white mb-1">{stats.totalMembers}</div>
            <p className="text-slate-400 text-sm">Community Members</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="w-8 h-8 text-orange-500" />
              <span className="text-orange-400">Follow-ups</span>
            </div>
            <div className="text-white mb-1">{stats.activeCases}</div>
            <p className="text-slate-400 text-sm">Need Attention</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-green-500" />
              <span className="text-green-400">Upcoming</span>
            </div>
            <div className="text-white mb-1">{stats.upcomingSessions}</div>
            <p className="text-slate-400 text-sm">Sessions Scheduled</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-purple-500" />
              <span className="text-purple-400">This Week</span>
            </div>
            <div className="text-white mb-1">{stats.thisWeekSessions}</div>
            <p className="text-slate-400 text-sm">Sessions</p>
          </div>
        </div>

        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger 
              value="members" 
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-slate-300"
            >
              Community Members
            </TabsTrigger>
            <TabsTrigger 
              value="partnerships" 
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-slate-300"
            >
              Partnerships & Events
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-slate-300"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Members Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-800 text-white rounded-lg pl-10 pr-4 py-2 border border-slate-700 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 border border-slate-700 focus:border-orange-500 focus:outline-none"
                    >
                      <option value="all">All Members</option>
                      <option value="active">Active</option>
                      <option value="needs-followup">Needs Follow-up</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {filteredMembers.map((member) => (
                      <button
                        key={member.id}
                        onClick={() => setSelectedMember(member)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          selectedMember?.id === member.id
                            ? 'bg-orange-500/10 border-orange-500/50'
                            : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-orange-500 text-white">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white truncate">{member.name}</h4>
                            <p className="text-slate-400 text-sm">
                              {member.sessions.length} session{member.sessions.length !== 1 ? 's' : ''}
                            </p>
                            {member.status === 'needs-followup' && (
                              <Badge className="mt-2 bg-orange-500/20 text-orange-400 border-orange-500/30">
                                Follow-up needed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Member Details */}
              <div className="lg:col-span-2">
                {selectedMember ? (
                  <div className="space-y-6">
                    {/* Member Header */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={selectedMember.avatar} />
                            <AvatarFallback className="bg-orange-500 text-white text-xl">
                              {selectedMember.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h2 className="text-white mb-1">{selectedMember.name}</h2>
                            <p className="text-slate-400 text-sm">{selectedMember.email}</p>
                            <p className="text-slate-400 text-sm">{selectedMember.phone}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button className="bg-green-600 text-white hover:bg-green-700" size="sm">
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </Button>
                          <Button className="bg-blue-600 text-white hover:bg-blue-700" size="sm">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedMember.tags.map((tag, index) => (
                          <Badge key={index} className="bg-slate-800 text-slate-300 border-slate-700">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                        <div>
                          <p className="text-slate-500 text-sm mb-1">Member Since</p>
                          <p className="text-white">{new Date(selectedMember.joinedDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm mb-1">Total Sessions</p>
                          <p className="text-white">{selectedMember.sessions.length}</p>
                        </div>
                      </div>
                    </div>

                    {/* Sessions */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white">Session History</h3>
                        <Button className="bg-orange-500 text-white hover:bg-orange-600" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Schedule Session
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {selectedMember.sessions.map((session) => {
                          const config = sessionTypeConfig[session.type];
                          return (
                            <div
                              key={session.id}
                              className={`bg-slate-800 rounded-xl border ${
                                session.status === 'scheduled' 
                                  ? 'border-orange-500/50' 
                                  : session.status === 'pending'
                                  ? 'border-blue-500/50'
                                  : 'border-slate-700'
                              } p-4`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3">
                                  <div className="text-2xl">{config.emoji}</div>
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="text-white">{config.label}</h4>
                                      <Badge className={config.color}>
                                        {session.status}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-400 text-sm">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(session.date).toLocaleDateString()}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {session.time} ({session.duration} min)
                                      </span>
                                      <span className="flex items-center gap-1">
                                        {session.format === 'video' ? <Video className="w-4 h-4" /> : 
                                         session.format === 'phone' ? <Phone className="w-4 h-4" /> : 
                                         <Users className="w-4 h-4" />}
                                        {session.format}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {session.followUpNeeded && (
                                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                                    Follow-up needed
                                  </Badge>
                                )}
                              </div>

                              {/* Notes */}
                              {session.notes.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  <p className="text-slate-400 text-sm">Notes:</p>
                                  {session.notes.map((note) => (
                                    <div key={note.id} className="bg-slate-900/50 rounded p-3 text-sm">
                                      <div className="flex items-start justify-between mb-1">
                                        <span className="text-slate-500 text-xs">
                                          {new Date(note.createdAt).toLocaleDateString()}
                                        </span>
                                        {note.isPrivate && (
                                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                                            Private
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-slate-300">{note.text}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Add Note Form */}
                              {editingSession === session.id ? (
                                <div className="mt-3 space-y-2">
                                  <Textarea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="Add confidential notes about this session..."
                                    className="bg-slate-900 border-slate-600 text-white"
                                    rows={3}
                                  />
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => addNote(selectedMember.id, session.id)}
                                      className="bg-orange-500 text-white hover:bg-orange-600"
                                      size="sm"
                                    >
                                      <CheckCircle2 className="w-4 h-4 mr-2" />
                                      Save Note
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setEditingSession(null);
                                        setNewNote('');
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
                                  onClick={() => setEditingSession(session.id)}
                                  variant="outline"
                                  className="mt-3 border-slate-600 text-slate-400 hover:bg-slate-800"
                                  size="sm"
                                >
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Add Note
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center">
                    <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-white mb-2">Select a Community Member</h3>
                    <p className="text-slate-400">Choose a member from the sidebar to view their session history</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="partnerships" className="space-y-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <h3 className="text-white mb-6">Partnerships</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockPartners.map((partner) => {
                  return (
                    <div key={partner.id} className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🤝</span>
                        <h4 className="text-white">{partner.name}</h4>
                      </div>
                      <div className="text-orange-400 text-sm">{partner.type}</div>
                      <p className="text-slate-500 text-sm">Since {new Date(partner.since).toLocaleDateString()}</p>
                      <p className="text-slate-500 text-sm">Status: {partner.status}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <h3 className="text-white mb-4">Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockEvents.map((event) => {
                  return (
                    <div key={event.id} className="text-center p-6 bg-slate-800 rounded-xl">
                      <div className="text-3xl mb-2">📅</div>
                      <div className="text-white text-2xl mb-1">
                        {event.title}
                      </div>
                      <p className="text-slate-400 text-sm">Type: {event.type}</p>
                      <p className="text-slate-400 text-sm">Date: {new Date(event.date).toLocaleDateString()}</p>
                      <p className="text-slate-400 text-sm">Status: {event.status}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <h3 className="text-white mb-6">Session Type Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(sessionStats).map(([type, count]) => {
                  const config = sessionTypeConfig[type as keyof typeof sessionTypeConfig];
                  return (
                    <div key={type} className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{config.emoji}</span>
                        <h4 className="text-white">{config.label}</h4>
                      </div>
                      <div className="text-orange-400 text-2xl">{count}</div>
                      <p className="text-slate-500 text-sm">Completed Sessions</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <h3 className="text-white mb-4">Community Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-slate-800 rounded-xl">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-white text-2xl mb-1">
                    {members.reduce((sum, m) => sum + m.sessions.filter(s => s.status === 'completed').length, 0)}
                  </div>
                  <p className="text-slate-400 text-sm">Total Sessions Completed</p>
                </div>
                <div className="text-center p-6 bg-slate-800 rounded-xl">
                  <div className="text-3xl mb-2">⏱️</div>
                  <div className="text-white text-2xl mb-1">
                    {members.reduce((sum, m) => 
                      sum + m.sessions.filter(s => s.status === 'completed')
                        .reduce((total, s) => total + s.duration, 0), 0
                    )} min
                  </div>
                  <p className="text-slate-400 text-sm">Time Serving Community</p>
                </div>
                <div className="text-center p-6 bg-slate-800 rounded-xl">
                  <div className="text-3xl mb-2">💚</div>
                  <div className="text-white text-2xl mb-1">
                    {members.filter(m => m.status === 'active').length}
                  </div>
                  <p className="text-slate-400 text-sm">Active Community Members</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}