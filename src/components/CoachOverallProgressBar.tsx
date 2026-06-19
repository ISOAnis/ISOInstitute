import * as React from 'react';
import { TrendingUp, ChevronDown, ChevronRight } from 'lucide-react';
import { getCoachProgressSnapshot, type CoachProgressContributor } from '../utils/coachProgress';
import type { CoachTier } from '../utils/coachProfile';

const TIER_COLORS: Record<CoachTier, string> = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
  premium: '#a855f7',
};

interface CoachOverallProgressBarProps {
  accentColor?: string;
  compact?: boolean;
  expandable?: boolean;
}

function ContributorRow({
  c, accent, showWeight,
}: {
  c: CoachProgressContributor;
  accent: string;
  showWeight?: boolean;
}) {
  const pct = c.maxPoints > 0 ? (c.earned / c.maxPoints) * 100 : 0;
  const gap = c.maxPoints - c.earned;
  const weightPct = c.maxPoints;

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4, gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
          {showWeight && (
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700,
              color: 'rgba(255,255,255,0.35)', letterSpacing: 0.5, flexShrink: 0,
            }}>
              {weightPct}%
            </span>
          )}
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
            {c.label}
          </span>
        </div>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11,
          color: gap > 0 ? accent : '#22c55e', letterSpacing: 0.5, flexShrink: 0,
        }}>
          {c.earned}/{c.maxPoints}{gap > 0 ? ` · +${gap} avail` : ' · maxed'}
        </span>
      </div>
      <div style={{ height: 5, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: gap > 0 ? accent : '#22c55e',
          borderRadius: 100, transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  );
}

export function CoachOverallProgressBar({
  accentColor = '#10b981',
  compact = false,
  expandable = false,
}: CoachOverallProgressBarProps) {
  const snap = React.useMemo(() => getCoachProgressSnapshot(), []);
  const tierColor = TIER_COLORS[snap.tier];
  const [expanded, setExpanded] = React.useState(false);

  if (expandable) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, padding: '20px 24px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16, marginBottom: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, lineHeight: 1 }}>
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>OVR </span>
              <span style={{ color: tierColor }}>{snap.overall}</span>
            </span>
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
              color: tierColor, background: `${tierColor}18`, border: `1px solid ${tierColor}40`,
              borderRadius: 100, padding: '4px 12px', textTransform: 'uppercase',
            }}>
              {snap.tierLabel}
            </span>
          </div>
          {snap.progressTo && (
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                {snap.progressPct}% toward{' '}
              </span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: accentColor, letterSpacing: 1 }}>
                OVR {snap.progressTo}
              </span>
              {snap.nextTierThreshold && snap.overall < snap.nextTierThreshold && (
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                  {snap.nextTierThreshold - snap.overall} pts to {snap.nextTierLabel}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{
          marginBottom: 8, display: 'flex', justifyContent: 'space-between',
          fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)',
        }}>
          <span><span style={{ color: tierColor }}>{snap.progressFrom}</span> OVR</span>
          {snap.progressTo && <span><span style={{ color: tierColor }}>{snap.progressTo}</span> OVR</span>}
        </div>
        <div style={{ height: 10, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${snap.progressPct}%`,
            background: `linear-gradient(90deg, ${tierColor}, ${accentColor})`,
            borderRadius: 100, transition: 'width 0.5s ease',
          }} />
        </div>

        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, marginTop: 16,
            background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
          }}
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          What contributes to your OVR
        </button>

        {expanded && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: '0 8px',
              marginBottom: 10, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10,
              fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
            }}>
              <span>Weight</span>
              <span>Contributor</span>
              <span style={{ textAlign: 'right' }}>Progress</span>
            </div>
            {snap.contributors.map(c => (
              <ContributorRow key={c.id} c={c} accent={accentColor} showWeight />
            ))}
            <p style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)',
              margin: '16px 0 0', lineHeight: 1.6,
            }}>
              Every OVR point is earned one at a time. Weights show how much each area can contribute to your overall rating.
              {snap.nextTierThreshold && snap.overall < snap.nextTierThreshold && (
                <> {snap.nextTierThreshold - snap.overall} more to reach {snap.nextTierLabel}.</>
              )}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (compact) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14, padding: '16px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrendingUp size={16} style={{ color: tierColor }} />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 1 }}>
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>OVR </span>
              <span style={{ color: tierColor }}>{snap.overall}</span>
            </span>
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
              color: tierColor, background: `${tierColor}18`, border: `1px solid ${tierColor}40`,
              borderRadius: 100, padding: '3px 10px', textTransform: 'uppercase',
            }}>
              {snap.tierLabel}
            </span>
          </div>
          {snap.progressTo && (
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              {snap.progressPct}% toward OVR {snap.progressTo}
            </span>
          )}
        </div>
        <div style={{ height: 8, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${snap.progressPct}%`,
            background: `linear-gradient(90deg, ${tierColor}, ${accentColor})`,
            borderRadius: 100, transition: 'width 0.5s ease',
          }} />
        </div>
        {snap.topOpportunity && (
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: '10px 0 0', lineHeight: 1.5 }}>
            <strong style={{ color: accentColor }}>Biggest opportunity:</strong> {snap.topOpportunity.label} — {snap.topOpportunity.tip}
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16, padding: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: 2,
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 6,
          }}>
            Overall Rating Progress
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, color: tierColor, lineHeight: 1 }}>
              {snap.overall}
            </span>
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1.5,
              color: tierColor, background: `${tierColor}18`, border: `1px solid ${tierColor}40`,
              borderRadius: 100, padding: '4px 12px', textTransform: 'uppercase',
            }}>
              {snap.tierLabel}
            </span>
          </div>
        </div>
        {snap.progressTo && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
              Next OVR
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: accentColor, letterSpacing: 1 }}>
              {snap.progressTo}
            </div>
            {snap.nextTierLabel && snap.nextTierThreshold && snap.progressTo === snap.nextTierThreshold && (
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
                Reaches {snap.nextTierLabel}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
        <span><span style={{ color: tierColor }}>{snap.progressFrom}</span> OVR</span>
        {snap.progressTo && <span><span style={{ color: tierColor }}>{snap.progressTo}</span> OVR</span>}
      </div>
      <div style={{ height: 10, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 24 }}>
        <div style={{
          height: '100%', width: `${snap.progressPct}%`,
          background: `linear-gradient(90deg, ${tierColor}, ${accentColor})`,
          borderRadius: 100, transition: 'width 0.5s ease',
        }} />
      </div>

      <div style={{
        fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: 2,
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 14,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <ChevronRight size={12} /> What moves your OVR most
      </div>

      {snap.contributors
        .sort((a, b) => (b.maxPoints - b.earned) - (a.maxPoints - a.earned))
        .slice(0, 5)
        .map(c => (
          <ContributorRow key={c.id} c={c} accent={accentColor} />
        ))}

      {snap.progressTo && (
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '16px 0 0', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
          Every OVR point is earned one at a time through coaching impact, community contribution, and consistency.
          {snap.nextTierThreshold && snap.overall < snap.nextTierThreshold && (
            <> {snap.nextTierThreshold - snap.overall} more to reach {snap.nextTierLabel}.</>
          )}
        </p>
      )}
    </div>
  );
}
