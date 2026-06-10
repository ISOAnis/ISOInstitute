import { useState } from 'react';
import { Sparkles, TrendingUp, CheckCircle2, X, User, Target, MessageSquare, Clock, Award } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface PlayerRequest {
  id: string;
  name: string;
  email: string;
  category: string;
  categoryIcon: string;
  submittedDate: string;
  plan: 'walk-on' | 'varsity';
  
  // Questionnaire Data
  commitment: string;
  goals: string;
  timeframe: string;
  challenges: string;
  
  // AI Match Data
  matchScore: number;
  matchReasons: string[];
  potentialChallenges?: string[];
}

interface MatchInsight {
  category: string;
  score: number;
  details: string;
  icon: any;
  color: string;
}

// Mock data - would come from AI analysis
const mockRequests: PlayerRequest[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    category: 'Software Engineering',
    categoryIcon: '💻',
    submittedDate: '2024-11-10',
    plan: 'varsity',
    commitment: 'I want to transition from a marketing role into software engineering. I have been learning to code for 6 months and need guidance on breaking into the industry.',
    goals: 'Land my first software engineering role within 12 months, build a strong portfolio, and develop interview skills.',
    timeframe: '5-10-hours',
    challenges: 'No computer science degree, lack of professional network in tech, imposter syndrome.',
    matchScore: 92,
    matchReasons: [
      'Strong alignment with your career transition expertise',
      'Commitment level matches your preferred player intensity',
      'Goals align with your structured approach to skill-building',
      'Availability fits your preferred meeting times',
      'Demonstrates growth mindset and coachability'
    ],
    potentialChallenges: [
      'May need extra support building technical confidence',
      'Career transition timeline is ambitious'
    ]
  },
  {
    id: '2',
    name: 'Marcus Williams',
    email: 'marcus.w@email.com',
    category: 'Entrepreneurship',
    categoryIcon: '🚀',
    submittedDate: '2024-11-09',
    plan: 'walk-on',
    commitment: 'I have a business idea for a halal food delivery service and want to learn how to validate and launch it while keeping my full-time job.',
    goals: 'Validate my business idea, build an MVP, and potentially launch within 6 months.',
    timeframe: '1-2-hours',
    challenges: 'Limited time due to full-time job, no business background, need to manage finances carefully.',
    matchScore: 68,
    matchReasons: [
      'Business idea aligns with faith-centered entrepreneurship',
      'Realistic about time constraints',
      'Clear validation-first approach'
    ],
    potentialChallenges: [
      'Limited weekly availability may slow progress',
      'May need more hands-on guidance than Walk-On program provides',
      'Business domain outside your primary expertise'
    ]
  },
  {
    id: '3',
    name: 'Aisha Rahman',
    email: 'aisha.r@email.com',
    category: 'Healthcare',
    categoryIcon: '🏥',
    submittedDate: '2024-11-08',
    plan: 'varsity',
    commitment: 'As a pre-med student, I want guidance on standing out in medical school applications and developing leadership skills.',
    goals: 'Get into top medical school, build clinical experience, and develop a specialty focus.',
    timeframe: '5-10-hours',
    challenges: 'Balancing academics with extracurriculars, financial stress, family pressure.',
    matchScore: 85,
    matchReasons: [
      'High commitment level matches your coaching style',
      'Goal-oriented and action-focused traits',
      'Values alignment around service and excellence',
      'Clear timeline and structured approach preference'
    ],
    potentialChallenges: [
      'Medical field specifics may require additional research',
      'High-pressure environment needs supportive communication'
    ]
  }
];

export function AIMatchingDashboard() {
  const [requests, setRequests] = useState<PlayerRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<PlayerRequest | null>(null);

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

  const calculateInsights = (request: PlayerRequest): MatchInsight[] => {
    return [
      {
        category: 'Goals Alignment',
        score: 90,
        details: 'Their goals strongly align with your expertise areas',
        icon: Target,
        color: 'text-green-400'
      },
      {
        category: 'Commitment Level',
        score: 95,
        details: `${request.timeframe} weekly matches your coaching capacity`,
        icon: Clock,
        color: 'text-blue-400'
      },
      {
        category: 'Communication Style',
        score: 85,
        details: 'Their learning style fits your coaching approach',
        icon: MessageSquare,
        color: 'text-purple-400'
      },
      {
        category: 'Growth Potential',
        score: 88,
        details: 'High likelihood of success based on profile analysis',
        icon: TrendingUp,
        color: 'text-orange-400'
      }
    ];
  };

  const acceptRequest = (requestId: string) => {
    console.log('Accepting ISO request:', requestId);
    setRequests(requests.filter(r => r.id !== requestId));
    setSelectedRequest(null);
  };

  const declineRequest = (requestId: string) => {
    console.log('Declining ISO request:', requestId);
    setRequests(requests.filter(r => r.id !== requestId));
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-white mb-2">AI-Powered Matching</h2>
            <p className="text-slate-300 mb-4">
              Our AI analyzes coach profiles and player questionnaires to suggest optimal matches based on goals, 
              availability, communication styles, and success patterns.
            </p>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-slate-400">85%+ = Excellent Match</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full" />
                <span className="text-slate-400">70-84% = Good Match</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full" />
                <span className="text-slate-400">{'<'}70% = Fair Match</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests List */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <h3 className="text-white mb-4">Pending Requests ({requests.length})</h3>
            <div className="space-y-3">
              {requests.map((request) => (
                <button
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedRequest?.id === request.id
                      ? 'bg-orange-500/10 border-orange-500/50'
                      : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-orange-500 text-white">
                        {request.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white truncate">{request.name}</h4>
                      <p className="text-slate-400 text-sm flex items-center gap-1">
                        <span>{request.categoryIcon}</span>
                        <span className="truncate">{request.category}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={`${getMatchColor(request.matchScore)} border`}>
                      {request.matchScore}% Match
                    </Badge>
                    <Badge className={request.plan === 'varsity' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}>
                      {request.plan === 'varsity' ? 'Varsity' : 'Walk-On'}
                    </Badge>
                  </div>
                </button>
              ))}

              {requests.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-400">No pending requests</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Request Details */}
        <div className="lg:col-span-2">
          {selectedRequest ? (
            <div className="space-y-6">
              {/* Match Score Card */}
              <Card className={`${getMatchColor(selectedRequest.matchScore)} border-2 p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-3xl mb-1">{selectedRequest.matchScore}%</div>
                      <p className="text-sm">{getMatchLabel(selectedRequest.matchScore)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm mb-1">Submitted</p>
                    <p className="text-sm">{new Date(selectedRequest.submittedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </Card>

              {/* Player Info */}
              <Card className="bg-slate-900 border-slate-800 p-6">
                <div className="flex items-start gap-4 mb-6">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-orange-500 text-white text-xl">
                      {selectedRequest.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-white mb-1">{selectedRequest.name}</h3>
                    <p className="text-slate-400 text-sm mb-2">{selectedRequest.email}</p>
                    <div className="flex gap-2">
                      <Badge className="bg-slate-800 text-slate-300 border-slate-700">
                        <span className="mr-1">{selectedRequest.categoryIcon}</span>
                        {selectedRequest.category}
                      </Badge>
                      <Badge className={selectedRequest.plan === 'varsity' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}>
                        {selectedRequest.plan === 'varsity' ? 'Varsity Program' : 'Walk-On Program'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Detailed Insights */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {calculateInsights(selectedRequest).map((insight) => (
                    <div key={insight.category} className="bg-slate-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <insight.icon className={`w-5 h-5 ${insight.color}`} />
                        <span className="text-white text-sm">{insight.category}</span>
                      </div>
                      <div className={`text-2xl mb-1 ${insight.color}`}>{insight.score}%</div>
                      <p className="text-slate-400 text-xs">{insight.details}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Why This Match Works */}
              <Card className="bg-slate-900 border-slate-800 p-6">
                <h4 className="text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Why This Match Works
                </h4>
                <ul className="space-y-2 mb-6">
                  {selectedRequest.matchReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>

                {selectedRequest.potentialChallenges && selectedRequest.potentialChallenges.length > 0 && (
                  <>
                    <h4 className="text-white mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-orange-400" />
                      Potential Growth Areas
                    </h4>
                    <ul className="space-y-2">
                      {selectedRequest.potentialChallenges.map((challenge, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                          <span className="text-orange-400 mt-0.5">!</span>
                          <span>{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Card>

              {/* Questionnaire Responses */}
              <Card className="bg-slate-900 border-slate-800 p-6">
                <h4 className="text-white mb-4">Questionnaire Responses</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Why do they want a coach?</p>
                    <p className="text-slate-200">{selectedRequest.commitment}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Their goals</p>
                    <p className="text-slate-200">{selectedRequest.goals}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Time commitment</p>
                    <p className="text-slate-200">
                      {selectedRequest.timeframe.replace('-', ' to ').replace('plus', '+')} per week
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Current challenges</p>
                    <p className="text-slate-200">{selectedRequest.challenges}</p>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={() => acceptRequest(selectedRequest.id)}
                  className="flex-1 bg-green-600 text-white hover:bg-green-700"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Accept & Schedule Consultation
                </Button>
                <Button
                  onClick={() => declineRequest(selectedRequest.id)}
                  variant="outline"
                  className="border-slate-600 text-slate-400 hover:bg-slate-800"
                >
                  <X className="w-4 h-4 mr-2" />
                  Decline
                </Button>
              </div>
            </div>
          ) : (
            <Card className="bg-slate-900 border-slate-800 p-12 text-center">
              <User className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-white mb-2">Select a Request</h3>
              <p className="text-slate-400">
                Choose a pending ISO request to see AI-powered matching insights
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}