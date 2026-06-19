import { useState } from 'react';
import { Sparkles, TrendingUp, CheckCircle2, X, User, Target, MessageSquare, Clock, Award } from 'lucide-react';
import {
  PORTAL_ACCENT, PORTAL_PANEL_BG, PORTAL_PANEL_BORDER,
  PORTAL_INPUT_BG, PORTAL_TEXT_PRIMARY, PORTAL_TEXT_MUTED, PORTAL_TEXT_DIM,
} from '../utils/portalTheme';

interface PlayerRequest {
  id: string;
  name: string;
  email: string;
  category: string;
  categoryIcon: string;
  submittedDate: string;
  plan: 'walk-on' | 'varsity';
  commitment: string;
  goals: string;
  timeframe: string;
  challenges: string;
  matchScore: number;
  matchReasons: string[];
  potentialChallenges?: string[];
}

interface MatchInsight {
  category: string;
  score: number;
  details: string;
  icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
}

const mockRequests: PlayerRequest[] = [
  {
    id: '1', name: 'Sarah Johnson', email: 'sarah.j@email.com', category: 'Software Engineering',
    categoryIcon: '💻', submittedDate: '2024-11-10', plan: 'varsity',
    commitment: 'I want to transition from a marketing role into software engineering. I have been learning to code for 6 months and need guidance on breaking into the industry.',
    goals: 'Land my first software engineering role within 12 months, build a strong portfolio, and develop interview skills.',
    timeframe: '5-10-hours', challenges: 'No computer science degree, lack of professional network in tech, imposter syndrome.',
    matchScore: 92,
    matchReasons: [
      'Strong alignment with your career transition expertise',
      'Commitment level matches your preferred player intensity',
      'Goals align with your structured approach to skill-building',
      'Availability fits your preferred meeting times',
      'Demonstrates growth mindset and coachability',
    ],
    potentialChallenges: ['May need extra support building technical confidence', 'Career transition timeline is ambitious'],
  },
  {
    id: '2', name: 'Marcus Williams', email: 'marcus.w@email.com', category: 'Entrepreneurship',
    categoryIcon: '🚀', submittedDate: '2024-11-09', plan: 'walk-on',
    commitment: 'I have a business idea for a halal food delivery service and want to learn how to validate and launch it while keeping my full-time job.',
    goals: 'Validate my business idea, build an MVP, and potentially launch within 6 months.',
    timeframe: '1-2-hours', challenges: 'Limited time due to full-time job, no business background, need to manage finances carefully.',
    matchScore: 68,
    matchReasons: ['Business idea aligns with faith-centered entrepreneurship', 'Realistic about time constraints', 'Clear validation-first approach'],
    potentialChallenges: ['Limited weekly availability may slow progress', 'May need more hands-on guidance than Walk-On program provides', 'Business domain outside your primary expertise'],
  },
  {
    id: '3', name: 'Aisha Rahman', email: 'aisha.r@email.com', category: 'Healthcare',
    categoryIcon: '🏥', submittedDate: '2024-11-08', plan: 'varsity',
    commitment: 'As a pre-med student, I want guidance on standing out in medical school applications and developing leadership skills.',
    goals: 'Get into top medical school, build clinical experience, and develop a specialty focus.',
    timeframe: '5-10-hours', challenges: 'Balancing academics with extracurriculars, financial stress, family pressure.',
    matchScore: 85,
    matchReasons: ['High commitment level matches your coaching style', 'Goal-oriented and action-focused traits', 'Values alignment around service and excellence', 'Clear timeline and structured approach preference'],
    potentialChallenges: ['Medical field specifics may require additional research', 'High-pressure environment needs supportive communication'],
  },
];

function getMatchStyle(score: number) {
  if (score >= 85) return { color: PORTAL_ACCENT, bg: `${PORTAL_ACCENT}15`, border: `${PORTAL_ACCENT}35`, label: 'Excellent Match' };
  if (score >= 70) return { color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)', label: 'Good Match' };
  return { color: PORTAL_TEXT_DIM, bg: 'rgba(255,255,255,0.04)', border: PORTAL_PANEL_BORDER, label: 'Fair Match' };
}

function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: PORTAL_PANEL_BG, border: `1px solid ${PORTAL_PANEL_BORDER}`, borderRadius: 14, ...style }}>
      {children}
    </div>
  );
}

function RequestAvatar({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  return (
    <div style={{
      width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
      background: `${PORTAL_ACCENT}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, color: PORTAL_ACCENT,
    }}>
      {initials}
    </div>
  );
}

function Pill({ children, color, bg, border }: { children: React.ReactNode; color: string; bg: string; border: string }) {
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 100, fontSize: 11,
      fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: 0.5,
      color, background: bg, border: `1px solid ${border}`,
    }}>
      {children}
    </span>
  );
}

export function AIMatchingDashboard() {
  const [requests, setRequests] = useState<PlayerRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<PlayerRequest | null>(null);

  const calculateInsights = (request: PlayerRequest): MatchInsight[] => [
    { category: 'Goals Alignment', score: 90, details: 'Their goals strongly align with your expertise areas', icon: Target },
    { category: 'Commitment Level', score: 95, details: `${request.timeframe} weekly matches your coaching capacity`, icon: Clock },
    { category: 'Communication Style', score: 85, details: 'Their learning style fits your coaching approach', icon: MessageSquare },
    { category: 'Growth Potential', score: 88, details: 'High likelihood of success based on profile analysis', icon: TrendingUp },
  ];

  const acceptRequest = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
    setSelectedRequest(null);
  };

  const declineRequest = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
    setSelectedRequest(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Info banner */}
      <Panel style={{ padding: 24 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, flexShrink: 0,
            background: `${PORTAL_ACCENT}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={20} style={{ color: PORTAL_ACCENT }} />
          </div>
          <div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: PORTAL_TEXT_PRIMARY, margin: '0 0 8px', letterSpacing: 0.5 }}>
              AI-Powered Matching
            </h3>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: PORTAL_TEXT_MUTED, margin: '0 0 16px', lineHeight: 1.6 }}>
              Our AI analyzes coach profiles and player questionnaires to suggest optimal matches based on goals,
              availability, communication styles, and success patterns.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {[
                { dot: PORTAL_ACCENT, label: '85%+ = Excellent Match' },
                { dot: '#f97316', label: '70–84% = Good Match' },
                { dot: PORTAL_TEXT_DIM, label: '<70% = Fair Match' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.dot }} />
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: PORTAL_TEXT_DIM }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 1fr) minmax(0, 2fr)', gap: 20 }}>
        {/* Request list */}
        <Panel style={{ padding: 20 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: 2, color: PORTAL_TEXT_DIM, textTransform: 'uppercase', marginBottom: 16 }}>
            Pending Requests ({requests.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {requests.map(request => {
              const match = getMatchStyle(request.matchScore);
              const isSelected = selectedRequest?.id === request.id;
              return (
                <button
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  style={{
                    width: '100%', textAlign: 'left', padding: 14, borderRadius: 12, cursor: 'pointer',
                    background: isSelected ? `${PORTAL_ACCENT}10` : 'rgba(255,255,255,0.02)',
                    border: isSelected ? `1px solid ${PORTAL_ACCENT}40` : `1px solid ${PORTAL_PANEL_BORDER}`,
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <RequestAvatar name={request.name} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: PORTAL_TEXT_PRIMARY }}>{request.name}</div>
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: PORTAL_TEXT_DIM }}>
                        {request.categoryIcon} {request.category}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Pill color={match.color} bg={match.bg} border={match.border}>{request.matchScore}% Match</Pill>
                    <Pill
                      color={request.plan === 'varsity' ? PORTAL_ACCENT : PORTAL_TEXT_MUTED}
                      bg={request.plan === 'varsity' ? `${PORTAL_ACCENT}12` : 'rgba(255,255,255,0.04)'}
                      border={request.plan === 'varsity' ? `${PORTAL_ACCENT}30` : PORTAL_PANEL_BORDER}
                    >
                      {request.plan === 'varsity' ? 'ISO Pass' : 'Walk-On'}
                    </Pill>
                  </div>
                </button>
              );
            })}
            {requests.length === 0 && (
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: PORTAL_TEXT_DIM, textAlign: 'center', padding: '24px 0' }}>
                No pending requests
              </p>
            )}
          </div>
        </Panel>

        {/* Detail */}
        <div>
          {selectedRequest ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(() => {
                const match = getMatchStyle(selectedRequest.matchScore);
                return (
                  <Panel style={{ padding: 24, background: match.bg, border: `1px solid ${match.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                          width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Sparkles size={24} style={{ color: match.color }} />
                        </div>
                        <div>
                          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: match.color, lineHeight: 1 }}>{selectedRequest.matchScore}%</div>
                          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: PORTAL_TEXT_MUTED }}>{match.label}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: PORTAL_TEXT_DIM, marginBottom: 4 }}>Submitted</div>
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: PORTAL_TEXT_MUTED }}>
                          {new Date(selectedRequest.submittedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Panel>
                );
              })()}

              <Panel style={{ padding: 24 }}>
                <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                  <RequestAvatar name={selectedRequest.name} />
                  <div>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: PORTAL_TEXT_PRIMARY, margin: '0 0 4px' }}>{selectedRequest.name}</h3>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: PORTAL_TEXT_DIM, margin: '0 0 10px' }}>{selectedRequest.email}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Pill color={PORTAL_TEXT_MUTED} bg="rgba(255,255,255,0.04)" border={PORTAL_PANEL_BORDER}>
                        {selectedRequest.categoryIcon} {selectedRequest.category}
                      </Pill>
                      <Pill
                        color={selectedRequest.plan === 'varsity' ? PORTAL_ACCENT : PORTAL_TEXT_MUTED}
                        bg={selectedRequest.plan === 'varsity' ? `${PORTAL_ACCENT}12` : 'rgba(255,255,255,0.04)'}
                        border={selectedRequest.plan === 'varsity' ? `${PORTAL_ACCENT}30` : PORTAL_PANEL_BORDER}
                      >
                        {selectedRequest.plan === 'varsity' ? 'ISO Pass' : 'Walk-On Program'}
                      </Pill>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 8 }}>
                  {calculateInsights(selectedRequest).map(insight => (
                    <div key={insight.category} style={{ padding: 14, background: PORTAL_INPUT_BG, borderRadius: 10, border: `1px solid ${PORTAL_PANEL_BORDER}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <insight.icon size={16} style={{ color: PORTAL_ACCENT }} />
                        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: PORTAL_TEXT_MUTED }}>{insight.category}</span>
                      </div>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: PORTAL_ACCENT, marginBottom: 4 }}>{insight.score}%</div>
                      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: PORTAL_TEXT_DIM, margin: 0 }}>{insight.details}</p>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel style={{ padding: 24 }}>
                <h4 style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: PORTAL_TEXT_PRIMARY, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={16} style={{ color: PORTAL_ACCENT }} /> Why This Match Works
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedRequest.matchReasons.map((reason, idx) => (
                    <li key={idx} style={{ display: 'flex', gap: 8, fontFamily: "'Barlow', sans-serif", fontSize: 13, color: PORTAL_TEXT_MUTED }}>
                      <span style={{ color: PORTAL_ACCENT }}>✓</span> {reason}
                    </li>
                  ))}
                </ul>
                {selectedRequest.potentialChallenges && selectedRequest.potentialChallenges.length > 0 && (
                  <>
                    <h4 style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: PORTAL_TEXT_PRIMARY, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Award size={16} style={{ color: '#f97316' }} /> Potential Growth Areas
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {selectedRequest.potentialChallenges.map((c, idx) => (
                        <li key={idx} style={{ display: 'flex', gap: 8, fontFamily: "'Barlow', sans-serif", fontSize: 13, color: PORTAL_TEXT_MUTED }}>
                          <span style={{ color: '#f97316' }}>!</span> {c}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Panel>

              <Panel style={{ padding: 24 }}>
                <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: PORTAL_TEXT_PRIMARY, margin: '0 0 16px', letterSpacing: 0.5 }}>
                  Questionnaire Responses
                </h4>
                {[
                  { label: 'Why do they want a coach?', value: selectedRequest.commitment },
                  { label: 'Their goals', value: selectedRequest.goals },
                  { label: 'Time commitment', value: `${selectedRequest.timeframe.replace('-', ' to ').replace('plus', '+')} per week` },
                  { label: 'Current challenges', value: selectedRequest.challenges },
                ].map(field => (
                  <div key={field.label} style={{ marginBottom: 16 }}>
                    <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: 1.5, color: PORTAL_TEXT_DIM, textTransform: 'uppercase', margin: '0 0 6px' }}>{field.label}</p>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: PORTAL_TEXT_MUTED, margin: 0, lineHeight: 1.6 }}>{field.value}</p>
                  </div>
                ))}
              </Panel>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => acceptRequest(selectedRequest.id)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: PORTAL_ACCENT, color: '#fff', border: 'none', borderRadius: 10,
                    padding: '14px 20px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13,
                    fontWeight: 700, letterSpacing: 1, cursor: 'pointer',
                  }}
                >
                  <CheckCircle2 size={16} /> Accept & Schedule Consultation
                </button>
                <button
                  onClick={() => declineRequest(selectedRequest.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: 'transparent', color: PORTAL_TEXT_DIM, border: `1px solid ${PORTAL_PANEL_BORDER}`,
                    borderRadius: 10, padding: '14px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, cursor: 'pointer',
                  }}
                >
                  <X size={16} /> Decline
                </button>
              </div>
            </div>
          ) : (
            <Panel style={{ padding: 48, textAlign: 'center' }}>
              <User size={40} style={{ color: 'rgba(255,255,255,0.12)', marginBottom: 16 }} />
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: PORTAL_TEXT_PRIMARY, margin: '0 0 8px' }}>Select a Request</h3>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: PORTAL_TEXT_DIM, margin: 0 }}>
                Choose a pending ISO request to see AI-powered matching insights
              </p>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
