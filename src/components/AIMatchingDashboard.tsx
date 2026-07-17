import { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, CheckCircle2, X, User, Target, MessageSquare, Clock } from 'lucide-react';
import {
  PORTAL_ACCENT, PORTAL_PANEL_BG, PORTAL_PANEL_BORDER,
  PORTAL_TEXT_PRIMARY, PORTAL_TEXT_MUTED, PORTAL_TEXT_DIM,
} from '../utils/portalTheme';
import { useAuth } from '../contexts/AuthContext';
import {
  fetchCoachMatchRequests,
  respondToMatch,
  type MatchRequestWithPlayer,
} from '../services/matchingService';

interface MatchInsight {
  category: string;
  score: number;
  details: string;
  icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
}

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
  const { user } = useAuth();
  const [requests, setRequests] = useState<MatchRequestWithPlayer[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<MatchRequestWithPlayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    if (!user) {
      setRequests([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    void fetchCoachMatchRequests()
      .then((rows) => {
        if (cancelled) return;
        setRequests(rows);
        setSelectedRequest(rows[0] ?? null);
      })
      .catch((err) => console.error('Failed to load match requests:', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [user?.id]);

  const calculateInsights = (request: MatchRequestWithPlayer): MatchInsight[] => {
    const q = request.questionnaire;
    const timeframe = String(q.timeframe || 'flexible');
    return [
      { category: 'Goals Alignment', score: Math.min(98, request.match_score + 2), details: 'Their goals strongly align with your expertise areas', icon: Target },
      { category: 'Commitment Level', score: Math.min(98, request.match_score), details: `${timeframe.replace(/-/g, ' ')} weekly matches your coaching capacity`, icon: Clock },
      { category: 'Communication Style', score: Math.max(70, request.match_score - 5), details: 'Their learning style fits your coaching approach', icon: MessageSquare },
      { category: 'Growth Potential', score: Math.min(96, request.match_score + 1), details: 'Heuristic estimate based on pathway and request signals', icon: TrendingUp },
    ];
  };

  const handleRespond = async (id: string, decision: 'accepted' | 'declined') => {
    setResponding(true);
    try {
      await respondToMatch(id, decision);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      setSelectedRequest(null);
    } catch (err) {
      console.error(`Failed to ${decision} match:`, err);
      alert(err instanceof Error ? err.message : `Could not ${decision} this request`);
    } finally {
      setResponding(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
              Match Score
            </h3>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: PORTAL_TEXT_MUTED, margin: '0 0 16px', lineHeight: 1.6 }}>
              Players who request ISO Pass with you land here. Scores reflect pathway fit and request details
              (not AI yet). Accept to start a kickoff game on your roster and unlock messaging — decline if it is not the right fit.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <Pill color={PORTAL_ACCENT} bg={`${PORTAL_ACCENT}15`} border={`${PORTAL_ACCENT}35`}>
                {loading ? '…' : `${requests.length} pending`}
              </Pill>
            </div>
          </div>
        </div>
      </Panel>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1fr) minmax(0, 2fr)', gap: 20 }}>
        <Panel style={{ padding: 16 }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: 2,
            color: PORTAL_TEXT_DIM, textTransform: 'uppercase', marginBottom: 12,
          }}>
            Pending Requests
          </div>
          {loading ? (
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: PORTAL_TEXT_DIM }}>Loading…</p>
          ) : requests.length === 0 ? (
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: PORTAL_TEXT_DIM, margin: 0, lineHeight: 1.5 }}>
              No pending ISO Pass requests yet. When a player calls an ISO with you, they show up here.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {requests.map((request) => {
                const style = getMatchStyle(request.match_score);
                const isSelected = selectedRequest?.id === request.id;
                return (
                  <button
                    key={request.id}
                    onClick={() => setSelectedRequest(request)}
                    style={{
                      width: '100%', textAlign: 'left', padding: 14, borderRadius: 12, cursor: 'pointer',
                      background: isSelected ? `${PORTAL_ACCENT}12` : 'rgba(255,255,255,0.02)',
                      border: isSelected ? `1px solid ${PORTAL_ACCENT}40` : `1px solid ${PORTAL_PANEL_BORDER}`,
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}
                  >
                    <RequestAvatar name={request.player_name} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: PORTAL_TEXT_PRIMARY }}>
                        {request.player_name}
                      </div>
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: PORTAL_TEXT_DIM }}>
                        {request.pathway_name}
                      </div>
                    </div>
                    <Pill color={style.color} bg={style.bg} border={style.border}>
                      {request.match_score}%
                    </Pill>
                  </button>
                );
              })}
            </div>
          )}
        </Panel>

        <div>
          {selectedRequest ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Panel style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <RequestAvatar name={selectedRequest.player_name} />
                    <div>
                      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: PORTAL_TEXT_PRIMARY, margin: '0 0 4px' }}>
                        {selectedRequest.player_name}
                      </h3>
                      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: PORTAL_TEXT_DIM, margin: 0 }}>
                        {selectedRequest.player_email} · {selectedRequest.pathway_name}
                      </p>
                      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: PORTAL_TEXT_DIM, margin: '4px 0 0' }}>
                        Submitted {new Date(selectedRequest.created_at).toLocaleDateString()} · {selectedRequest.plan}
                      </p>
                    </div>
                  </div>
                  {(() => {
                    const style = getMatchStyle(selectedRequest.match_score);
                    return (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700,
                          letterSpacing: 1.5, textTransform: 'uppercase', color: PORTAL_TEXT_DIM, marginBottom: 4,
                        }}>
                          Match score
                        </div>
                        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: style.color, lineHeight: 1 }}>
                          {selectedRequest.match_score}%
                        </div>
                        <Pill color={style.color} bg={style.bg} border={style.border}>{style.label}</Pill>
                      </div>
                    );
                  })()}
                </div>
              </Panel>

              <Panel style={{ padding: 24 }}>
                <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: PORTAL_TEXT_PRIMARY, margin: '0 0 16px', letterSpacing: 0.5 }}>
                  Match Insights
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
                  {calculateInsights(selectedRequest).map((insight) => (
                    <div key={insight.category} style={{ padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: `1px solid ${PORTAL_PANEL_BORDER}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <insight.icon size={14} style={{ color: PORTAL_ACCENT }} />
                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: 1, color: PORTAL_TEXT_DIM, textTransform: 'uppercase' }}>
                          {insight.category}
                        </span>
                      </div>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: PORTAL_TEXT_PRIMARY }}>{insight.score}</div>
                      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: PORTAL_TEXT_MUTED, margin: '4px 0 0' }}>{insight.details}</p>
                    </div>
                  ))}
                </div>
                <h5 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, letterSpacing: 1.5, color: PORTAL_TEXT_DIM, textTransform: 'uppercase', margin: '0 0 10px' }}>
                  Why this match
                </h5>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedRequest.match_reasons.map((reason, idx) => (
                    <li key={idx} style={{ display: 'flex', gap: 8, fontFamily: "'Barlow', sans-serif", fontSize: 13, color: PORTAL_TEXT_MUTED }}>
                      <CheckCircle2 size={14} style={{ color: PORTAL_ACCENT, flexShrink: 0, marginTop: 2 }} /> {reason}
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel style={{ padding: 24 }}>
                <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: PORTAL_TEXT_PRIMARY, margin: '0 0 16px', letterSpacing: 0.5 }}>
                  Questionnaire Responses
                </h4>
                {[
                  { label: 'Why do they want a coach?', value: String(selectedRequest.questionnaire.commitment || 'Not provided yet') },
                  { label: 'Their goals', value: String(selectedRequest.questionnaire.goals || 'Not provided yet') },
                  { label: 'Time commitment', value: String(selectedRequest.questionnaire.timeframe || 'Not specified') },
                  { label: 'Current challenges', value: String(selectedRequest.questionnaire.challenges || 'Not provided yet') },
                ].map((field) => (
                  <div key={field.label} style={{ marginBottom: 16 }}>
                    <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: 1.5, color: PORTAL_TEXT_DIM, textTransform: 'uppercase', margin: '0 0 6px' }}>{field.label}</p>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: PORTAL_TEXT_MUTED, margin: 0, lineHeight: 1.6 }}>{field.value}</p>
                  </div>
                ))}
              </Panel>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => handleRespond(selectedRequest.id, 'accepted')}
                  disabled={responding}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: PORTAL_ACCENT, color: '#fff', border: 'none', borderRadius: 10,
                    padding: '14px 20px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13,
                    fontWeight: 700, letterSpacing: 1, cursor: responding ? 'wait' : 'pointer', opacity: responding ? 0.7 : 1,
                  }}
                >
                  <CheckCircle2 size={16} /> {responding ? 'Saving…' : 'Accept & Start Coaching'}
                </button>
                <button
                  onClick={() => handleRespond(selectedRequest.id, 'declined')}
                  disabled={responding}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: 'transparent', color: PORTAL_TEXT_DIM, border: `1px solid ${PORTAL_PANEL_BORDER}`,
                    borderRadius: 10, padding: '14px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13,
                    cursor: responding ? 'wait' : 'pointer',
                  }}
                >
                  <X size={16} /> Decline
                </button>
              </div>
            </div>
          ) : (
            <Panel style={{ padding: 48, textAlign: 'center' }}>
              <User size={40} style={{ color: 'rgba(255,255,255,0.12)', marginBottom: 16 }} />
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: PORTAL_TEXT_PRIMARY, margin: '0 0 8px' }}>
                {loading ? 'Loading requests…' : 'No request selected'}
              </h3>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: PORTAL_TEXT_DIM, margin: 0 }}>
                {requests.length === 0
                  ? 'Waiting for players to request ISO Pass with you'
                  : 'Choose a pending ISO request to see matching insights'}
              </p>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
