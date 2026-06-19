import * as React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from 'recharts';
import {
  Sparkles, Star, Users, Calendar, Video, MessageSquare, UserCircle,
  CheckCircle2, ChevronRight, TrendingUp, Trophy,
} from 'lucide-react';
import { PortalGreeting } from './PortalGreeting';
import { CoachISOCard } from './CoachISOCard';
import { CoachOverallProgressBar } from './CoachOverallProgressBar';
import { getCoachProgressSnapshot } from '../utils/coachProgress';
import type { CoachCardDisplay, CoachIdentity } from '../utils/coachProfile';

const RADAR_METRICS: Record<string, string> = {
  sessions: 'Player Dev',
  reviews: 'Communication',
  profile: 'Presence',
  impact: 'Impact',
  community: 'Community',
  content: 'Content',
  consistency: 'Consistency',
};

interface CoachISODashboardProps {
  coachIdentity: CoachIdentity;
  coachCard: CoachCardDisplay | null;
  pendingReview: boolean;
  accentColor: string;
  stats: {
    totalPlayers: number;
    totalPendingApprovals: number;
    totalActiveGames: number;
    champions: number;
  };
  onNavigate: (section: string) => void;
}

interface XPOpportunity {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  impact: string;
  section: string;
  highlight?: boolean;
}

function StatChip({ label, value, sub, accentColor }: {
  label: string; value: string | number; sub?: string; accentColor: string;
}) {
  return (
    <div style={{
      flex: 1, minWidth: 120,
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 12, padding: '14px 16px',
    }}>
      <div style={{
        fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700,
        letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
        marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: accentColor, lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function OpportunityCard({
  opp, accentColor, onNavigate,
}: {
  opp: XPOpportunity; accentColor: string; onNavigate: (s: string) => void;
}) {
  const Icon = opp.icon;
  return (
    <button
      type="button"
      onClick={() => onNavigate(opp.section)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 14, width: '100%',
        textAlign: 'left', cursor: 'pointer',
        background: opp.highlight ? `${accentColor}10` : 'rgba(255,255,255,0.03)',
        border: opp.highlight ? `1px solid ${accentColor}35` : '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, padding: '14px 16px',
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: `${accentColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={16} style={{ color: accentColor }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: '#F2F2F2', marginBottom: 3 }}>
          {opp.title}
        </div>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.45 }}>
          {opp.subtitle}
        </div>
        <span style={{
          display: 'inline-block', marginTop: 8,
          fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700,
          letterSpacing: 1, textTransform: 'uppercase', color: accentColor,
        }}>
          {opp.impact}
        </span>
      </div>
      <ChevronRight size={16} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0, marginTop: 4 }} />
    </button>
  );
}

function buildOpportunities(
  stats: CoachISODashboardProps['stats'],
  progress: ReturnType<typeof getCoachProgressSnapshot>,
): XPOpportunity[] {
  const opps: XPOpportunity[] = [];

  if (stats.totalPendingApprovals > 0) {
    opps.push({
      id: 'buckets',
      icon: CheckCircle2,
      title: `Approve ${stats.totalPendingApprovals} pending bucket${stats.totalPendingApprovals > 1 ? 's' : ''}`,
      subtitle: 'Player wins waiting for your sign-off',
      impact: '+documented impact',
      section: 'players',
      highlight: true,
    });
  }

  opps.push(
    {
      id: 'event',
      icon: Calendar,
      title: 'RSVP to next ISO Coaching Night',
      subtitle: 'March Pop-Up · Pull as you climb with your pathway',
      impact: '+community · +consistency',
      section: 'community',
    },
    {
      id: 'video',
      icon: Video,
      title: 'Post a Locker Room video',
      subtitle: 'Share a pathway moment or player breakthrough',
      impact: '+locker room content',
      section: 'locker-room',
    },
    {
      id: 'community',
      icon: MessageSquare,
      title: 'Share a win in ISO Community',
      subtitle: 'Celebrate a player milestone with your pathway',
      impact: '+community contribution',
      section: 'community',
    },
    {
      id: 'profile',
      icon: UserCircle,
      title: 'Complete your coach profile',
      subtitle: progress.contributors.find(c => c.id === 'profile' && c.earned < c.maxPoints)
        ? 'Add success stories or update your bio'
        : 'Keep your card sharp for matching',
      impact: '+profile completeness',
      section: 'profile',
    },
  );

  return opps;
}

export function CoachISODashboard({
  coachIdentity, coachCard, pendingReview, accentColor, stats, onNavigate,
}: CoachISODashboardProps) {
  const progress = React.useMemo(() => getCoachProgressSnapshot(), []);
  const overall = coachCard?.result.overall ?? progress.overall;
  const tierLabel = coachCard?.result.tierLabel ?? progress.tierLabel;
  const pathwayLabel = `${coachIdentity.pathwayName} Pathway`;
  const satisfactionPct = 92;
  const activePlayers = stats.totalPlayers;

  const radarData = progress.contributors.map(c => ({
    subject: RADAR_METRICS[c.id] ?? c.label,
    score: c.maxPoints > 0 ? Math.round((c.earned / c.maxPoints) * 100) : 0,
    fullMark: 100,
  }));

  const weakest = [...progress.contributors]
    .sort((a, b) => (a.earned / a.maxPoints) - (b.earned / b.maxPoints))
    .slice(0, 2);

  const opportunities = React.useMemo(
    () => buildOpportunities(stats, progress),
    [stats, progress],
  );

  const aiSuggestion = progress.topOpportunity
    ? `Your **${progress.topOpportunity.label}** score has the most room to grow. ${progress.topOpportunity.tip}`
    : 'You are maxing out your current contributors — keep your consistency streak alive.';

  return (
    <div style={{ padding: '24px 28px 60px', maxWidth: 1280, margin: '0 auto' }}>
      <PortalGreeting
        role="coach"
        name={coachIdentity.firstName}
        accentColor={accentColor}
        subline={`${pathwayLabel} · ${tierLabel} Coach · OVR ${overall}${pendingReview ? ' · Pending Review' : ''}`}
      />

      {/* Full-width OVR bar — first glance rating */}
      <div style={{ marginBottom: 24 }}>
        <CoachOverallProgressBar accentColor={accentColor} expandable />
      </div>

      {/* 3-column command center */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 20,
        alignItems: 'start',
        marginBottom: 24,
      }}>
        {/* Left — coach card */}
        <div>
          {coachCard ? (
            <CoachISOCard card={coachCard} pendingReview={pendingReview} pathwayColor={accentColor} />
          ) : (
            <div style={{
              background: 'rgba(255,255,255,0.04)', border: `1px dashed ${accentColor}40`,
              borderRadius: 14, padding: 32, textAlign: 'center',
            }}>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 12px' }}>
                Complete your profile to generate your coach card
              </p>
              <button
                type="button"
                onClick={() => onNavigate('profile')}
                style={{
                  background: accentColor, color: '#fff', border: 'none', borderRadius: 8,
                  padding: '8px 16px', fontFamily: "'Barlow', sans-serif", fontSize: 13,
                  fontWeight: 600, cursor: 'pointer',
                }}
              >
                Go to Profile
              </button>
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <StatChip label="Satisfaction" value={`${satisfactionPct}%`} sub="avg. session rating" accentColor={accentColor} />
            <StatChip label="Active Players" value={activePlayers} sub="on your roster" accentColor={accentColor} />
          </div>
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            style={{
              marginTop: 12, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: "'Barlow', sans-serif", fontSize: 12, color: accentColor, opacity: 0.75,
            }}
          >
            Edit profile →
          </button>
        </div>

        {/* Middle — XP opportunities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{
            background: `linear-gradient(135deg, ${accentColor}12, rgba(255,255,255,0.02))`,
            border: `1px solid ${accentColor}30`,
            borderRadius: 14, padding: '18px 20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Sparkles size={16} style={{ color: accentColor }} />
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700,
                letterSpacing: 2, textTransform: 'uppercase', color: accentColor,
              }}>
                ISO Suggestion
              </span>
            </div>
            <p style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.75)',
              margin: 0, lineHeight: 1.55,
            }}>
              {aiSuggestion.split('**').map((part, i) =>
                i % 2 === 1 ? <strong key={i} style={{ color: accentColor }}>{part}</strong> : part,
              )}
            </p>
          </div>

          <div>
            <h3 style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700,
              letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
              margin: '0 0 12px',
            }}>
              Earn Your Next Point
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {opportunities.map(opp => (
                <OpportunityCard key={opp.id} opp={opp} accentColor={accentColor} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        </div>

        {/* Right — performance radar */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: '20px 14px 8px',
        }}>
          <h3 style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
            margin: '0 0 4px', paddingLeft: 8,
          }}>
            ISO Performance Compass
          </h3>
          <p style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)',
            margin: '0 0 8px', paddingLeft: 8, lineHeight: 1.4,
          }}>
            Where you lead · Where to grow
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
              <PolarGrid stroke="rgba(255,255,255,0.12)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 10, fontFamily: 'Barlow, sans-serif' }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Performance"
                dataKey="score"
                stroke={accentColor}
                fill={accentColor}
                fillOpacity={0.35}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ padding: '0 8px 12px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {weakest.map(c => (
              <span key={c.id} style={{
                fontFamily: "'Barlow', sans-serif", fontSize: 11, color: accentColor,
                background: `${accentColor}15`, border: `1px solid ${accentColor}35`,
                borderRadius: 100, padding: '4px 10px',
              }}>
                Grow: {RADAR_METRICS[c.id] ?? c.label}
              </span>
            ))}
          </div>

          {/* Pulse stats — 2×2 under compass */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            padding: '4px 8px 12px',
          }}>
            {[
              { label: 'Active Games', value: stats.totalActiveGames, Icon: TrendingUp },
              { label: 'Champions', value: stats.champions, Icon: Trophy },
              { label: 'Next OVR', value: progress.progressTo ?? 'MAX', Icon: Star },
              { label: 'Roster', value: activePlayers, Icon: Users },
            ].map(item => (
              <div key={item.label} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <item.Icon size={16} style={{ color: accentColor, opacity: 0.7, flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#fff', lineHeight: 1 }}>
                    {item.value}
                  </div>
                  <div style={{
                    fontFamily: "'Barlow', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
