import * as React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from 'recharts';
import {
  Sparkles, Star, Target, Trophy, Calendar, Video, MessageSquare,
  UserCircle, GitBranch, ChevronRight, TrendingUp, CheckCircle2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PortalGreeting } from './PortalGreeting';
import { PlayerTierProgressBar } from './PlayerTierProgressBar';
import { getPlayerProgressSnapshot } from '../utils/playerProgress';
import { getCompassRadarLabels } from '../utils/playerGrowthCompass';

interface PlayerISODashboardProps {
  gamesWon: number;
  totalGames: number;
  bucketsScored: number;
  totalBuckets: number;
  winPercentage: number;
  coachName: string;
  pathway: string;
  pathwayId: string;
  accentColor: string;
  skillNodesUnlocked: number;
  totalSkillNodes: number;
  activeGameTitle?: string;
  openBuckets: number;
  onNavigate: (section: string) => void;
  playerName?: string;
}

interface Opportunity {
  id: string;
  icon: LucideIcon;
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
      flex: 1, minWidth: 100,
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
  opp: Opportunity; accentColor: string; onNavigate: (s: string) => void;
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

function buildOpportunities(props: PlayerISODashboardProps, progress: ReturnType<typeof getPlayerProgressSnapshot>): Opportunity[] {
  const opps: Opportunity[] = [];
  const coachFirst = props.coachName.split(' ')[0];

  if (props.openBuckets > 0 && props.activeGameTitle) {
    opps.push({
      id: 'buckets',
      icon: CheckCircle2,
      title: `Score ${props.openBuckets} open bucket${props.openBuckets > 1 ? 's' : ''}`,
      subtitle: `On "${props.activeGameTitle}" — finish strong to win the game`,
      impact: '+tier progress',
      section: 'progress',
      highlight: true,
    });
  }

  if (progress.gamesToNext !== null && progress.gamesToNext > 0) {
    opps.push({
      id: 'next-tier',
      icon: Trophy,
      title: `Win ${progress.gamesToNext} more game${progress.gamesToNext !== 1 ? 's' : ''}`,
      subtitle: `Reach ${progress.nextTier?.name} on your Freshman → Pro bar`,
      impact: '+level up',
      section: 'progress',
      highlight: opps.length === 0,
    });
  }

  opps.push(
    {
      id: 'skill-tree',
      icon: GitBranch,
      title: 'Unlock your next skill node',
      subtitle: `${props.skillNodesUnlocked}/${props.totalSkillNodes} nodes live on your pathway tree`,
      impact: '+skill growth',
      section: 'skill-tree',
    },
    {
      id: 'coach',
      icon: MessageSquare,
      title: `Check in with ${coachFirst}`,
      subtitle: 'Share a win or ask for guidance on your active game',
      impact: '+coach sync',
      section: 'messages',
    },
    {
      id: 'locker-room',
      icon: Video,
      title: 'Drop into the Locker Room',
      subtitle: 'Connect with ISO Pass players in your pathway channel',
      impact: '+community',
      section: 'locker-room',
    },
    {
      id: 'profile',
      icon: UserCircle,
      title: 'Sharpen your player profile',
      subtitle: 'Keep your story current so your coach knows your goals',
      impact: '+presence',
      section: 'profile',
    },
  );

  return opps;
}

export function PlayerISODashboard({
  gamesWon, totalGames, bucketsScored, totalBuckets, winPercentage,
  coachName, pathway, pathwayId, accentColor, skillNodesUnlocked, totalSkillNodes,
  activeGameTitle, openBuckets, onNavigate, playerName,
}: PlayerISODashboardProps) {
  const progress = React.useMemo(
    () => getPlayerProgressSnapshot(
      gamesWon, bucketsScored, totalBuckets, winPercentage, skillNodesUnlocked, totalSkillNodes, pathwayId,
    ),
    [gamesWon, bucketsScored, totalBuckets, winPercentage, skillNodesUnlocked, totalSkillNodes, pathwayId],
  );

  const opportunities = React.useMemo(
    () => buildOpportunities(
      {
        gamesWon, totalGames, bucketsScored, totalBuckets, winPercentage, coachName, pathway, pathwayId,
        accentColor, skillNodesUnlocked, totalSkillNodes, activeGameTitle, openBuckets, onNavigate,
      },
      progress,
    ),
    [gamesWon, totalGames, bucketsScored, totalBuckets, winPercentage, coachName, pathway, pathwayId, accentColor, skillNodesUnlocked, totalSkillNodes, activeGameTitle, openBuckets, onNavigate, progress],
  );

  const compassLabels = getCompassRadarLabels(progress.growthCompass);

  const radarData = Object.entries(progress.radarScores).map(([subject, score]) => ({
    subject,
    score,
    fullMark: 100,
  }));

  const weakest = radarData
    .slice()
    .sort((a, b) => a.score - b.score)
    .slice(0, 2);

  const aiSuggestion = progress.topOpportunity
    ? `Your **${progress.topOpportunity.label}** has the most room to grow. ${progress.topOpportunity.tip}`
    : 'You are climbing fast — keep your streak alive and push for the next tier.';

  const coachInitials = coachName.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div style={{ padding: '24px 28px 60px', maxWidth: 1280, margin: '0 auto' }}>
      <PortalGreeting
        role="player"
        name={playerName}
        accentColor={accentColor}
        subline={`${pathway} · ISO Pass · ${progress.tierName} · with ${coachName}`}
      />

      <div style={{ marginBottom: 24 }}>
        <PlayerTierProgressBar
          gamesWon={gamesWon}
          contributors={progress.contributors}
          accentColor={accentColor}
          expandable
        />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 20,
        alignItems: 'start',
      }}>
        {/* Left — season panel (replaces player card) */}
        <div>
          <div style={{
            background: `linear-gradient(145deg, ${accentColor}14 0%, rgba(255,255,255,0.03) 100%)`,
            border: `1px solid ${accentColor}35`,
            borderRadius: 16, padding: '22px 20px',
          }}>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
              marginBottom: 12,
            }}>
              Your Season
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                background: `${progress.tierHex}22`, border: `2px solid ${progress.tierHex}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: progress.tierHex,
              }}>
                {progress.tierName.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: '#F2F2F2', lineHeight: 1, marginBottom: 4 }}>
                  {pathway}
                </div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                  {progress.gamesWon} games won · {winPercentage}% win rate
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(0,0,0,0.25)', borderRadius: 12, padding: '12px 14px',
              marginBottom: 14,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: `${accentColor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, color: accentColor,
              }}>
                {coachInitials}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: '#F2F2F2' }}>
                  {coachName}
                </div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                  Your ISO Pass coach
                </div>
              </div>
            </div>

            {activeGameTitle && (
              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14,
              }}>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700,
                  letterSpacing: 1.5, textTransform: 'uppercase', color: accentColor, marginBottom: 6,
                }}>
                  Active Game
                </div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: '#F2F2F2', marginBottom: 4 }}>
                  {activeGameTitle}
                </div>
                {openBuckets > 0 && (
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                    {openBuckets} bucket{openBuckets !== 1 ? 's' : ''} left to score
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <StatChip label="Buckets" value={`${bucketsScored}/${totalBuckets}`} sub="scored this season" accentColor={accentColor} />
            <StatChip label="Games" value={`${gamesWon}/${totalGames}`} sub="won / active" accentColor={accentColor} />
          </div>

          <div style={{
            marginTop: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <Calendar size={16} style={{ color: accentColor, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: '#F2F2F2' }}>
                  Weekly Check-in
                </div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                  with {coachName.split(' ')[0]} · Nov 15, 2:00 PM
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('messages')}
              style={{
                background: `${accentColor}20`, border: `1px solid ${accentColor}40`, borderRadius: 8,
                padding: '6px 12px', color: accentColor, fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 11, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', flexShrink: 0,
              }}
            >
              MESSAGE
            </button>
          </div>
        </div>

        {/* Middle — opportunities */}
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
              Level Up Your Season
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {opportunities.map(opp => (
                <OpportunityCard key={opp.id} opp={opp} accentColor={accentColor} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        </div>

        {/* Right — growth compass */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: '20px 14px 8px',
        }}>
          <h3 style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
            margin: '0 0 4px', paddingLeft: 8,
          }}>
            ISO Growth Compass
          </h3>
          <p style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)',
            margin: '0 0 8px', paddingLeft: 8, lineHeight: 1.4,
          }}>
            {pathway} · {compassLabels.join(' · ')}
          </p>
          {progress.growthCompass.source === 'ai' && (
            <p style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.28)',
              margin: '0 0 8px', paddingLeft: 8, lineHeight: 1.4, fontStyle: 'italic',
            }}>
              Tailored to your goals and assessment
            </p>
          )}
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
              <PolarGrid stroke="rgba(255,255,255,0.12)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 10, fontFamily: 'Barlow, sans-serif' }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Growth"
                dataKey="score"
                stroke={accentColor}
                fill={accentColor}
                fillOpacity={0.35}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ padding: '0 8px 12px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {weakest.map(item => (
              <span key={item.subject} style={{
                fontFamily: "'Barlow', sans-serif", fontSize: 11, color: accentColor,
                background: `${accentColor}15`, border: `1px solid ${accentColor}35`,
                borderRadius: 100, padding: '4px 10px',
              }}>
                Grow: {item.subject}
              </span>
            ))}
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
            padding: '4px 8px 12px',
          }}>
            {[
              { label: 'Games Won', value: gamesWon, Icon: Trophy },
              { label: 'Buckets', value: bucketsScored, Icon: Target },
              { label: 'Win Rate', value: `${winPercentage}%`, Icon: TrendingUp },
              { label: 'Next Tier', value: progress.nextTier?.name ?? 'PRO', Icon: Star },
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
