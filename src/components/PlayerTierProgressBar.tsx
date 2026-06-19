import * as React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  getPlayerTierSnapshot,
  PLAYER_TIERS,
  type PlayerGrowthContributor,
} from '../utils/playerProgress';

interface PlayerTierProgressBarProps {
  gamesWon: number;
  contributors: PlayerGrowthContributor[];
  accentColor?: string;
  expandable?: boolean;
}

function ContributorRow({
  c, accent, showWeight,
}: {
  c: PlayerGrowthContributor;
  accent: string;
  showWeight?: boolean;
}) {
  const pct = c.maxPoints > 0 ? (c.earned / c.maxPoints) * 100 : 0;
  const gap = c.maxPoints - c.earned;

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4, gap: 8 }}>
        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
          {c.label}
        </span>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11,
          color: gap > 0 ? accent : '#22c55e', letterSpacing: 0.5, flexShrink: 0,
        }}>
          {c.earned}/{c.maxPoints}{gap > 0 ? ` · room to grow` : ' · strong'}
        </span>
      </div>
      <div style={{ height: 5, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: gap > 0 ? accent : '#22c55e',
          borderRadius: 100, transition: 'width 0.4s ease',
        }} />
      </div>
      {showWeight && gap > 0 && (
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: '4px 0 0' }}>
          {c.tip}
        </p>
      )}
    </div>
  );
}

export function PlayerTierProgressBar({
  gamesWon,
  contributors,
  accentColor = '#a855f7',
  expandable = false,
}: PlayerTierProgressBarProps) {
  const snap = React.useMemo(() => getPlayerTierSnapshot(gamesWon), [gamesWon]);
  const tierColor = snap.tierHex;
  const [expanded, setExpanded] = React.useState(false);

  const segmentFill = (index: number) => {
    if (index < snap.tierIndex) return 100;
    if (index === snap.tierIndex) return snap.progressPct;
    return 0;
  };

  return (
    <div
      data-tutorial-id="player-tier-bar"
      style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, padding: '20px 24px',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, lineHeight: 1 }}>
            <span style={{ color: 'rgba(255,255,255,0.45)' }}>LVL </span>
            <span style={{ color: tierColor }}>{snap.tierName}</span>
          </span>
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
            color: tierColor, background: `${tierColor}18`, border: `1px solid ${tierColor}40`,
            borderRadius: 100, padding: '4px 12px', textTransform: 'uppercase',
          }}>
            {snap.gamesWon} games won
          </span>
        </div>
        {snap.nextTier && (
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              {snap.progressPct}% toward{' '}
            </span>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: accentColor, letterSpacing: 1 }}>
              {snap.nextTier.name}
            </span>
            {snap.gamesToNext !== null && snap.gamesToNext > 0 && (
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                {snap.gamesToNext} game{snap.gamesToNext !== 1 ? 's' : ''} to level up
              </div>
            )}
          </div>
        )}
        {snap.isMaxTier && (
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#22c55e', textTransform: 'uppercase' }}>
            Max Tier Reached
          </span>
        )}
      </div>

      {/* Freshman → Pro segmented bar */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>
        {PLAYER_TIERS.map((tier, index) => {
          const fill = segmentFill(index);
          const isCurrent = index === snap.tierIndex;
          return (
            <div key={tier.id} style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                height: 10, borderRadius: 100, background: 'rgba(255,255,255,0.06)',
                overflow: 'hidden', position: 'relative',
              }}>
                {fill > 0 && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    width: `${fill}%`,
                    background: isCurrent
                      ? `linear-gradient(90deg, ${tier.hex}, ${accentColor})`
                      : tier.hex,
                    borderRadius: 100,
                    transition: 'width 0.5s ease',
                  }} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', gap: 4,
        fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700,
        letterSpacing: 0.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
      }}>
        {PLAYER_TIERS.map((tier, index) => (
          <span
            key={tier.id}
            style={{
              flex: 1, textAlign: 'center', minWidth: 0,
              color: index === snap.tierIndex ? tier.hex : index < snap.tierIndex ? 'rgba(255,255,255,0.55)' : undefined,
            }}
          >
            {tier.name}
          </span>
        ))}
      </div>

      {expandable && (
        <>
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
            What drives your level
          </button>

          {expanded && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {contributors.map(c => (
                <ContributorRow key={c.id} c={c} accent={accentColor} showWeight />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
