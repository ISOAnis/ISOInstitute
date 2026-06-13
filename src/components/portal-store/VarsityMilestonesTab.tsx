import * as React from 'react';
import { useState } from 'react';
import { ArrowRight, Lock, Sparkles } from 'lucide-react';
import { levelStoreItems, levelTiers } from '../../mockData/store';
import type { UserLevel } from '../../types/store';
import { LEVEL_ORDER } from '../../types/store';
import { StoreProductCard } from './StoreProductCard';

const LEVEL_HEX: Record<UserLevel, string> = {
  Freshman: '#22c55e',
  JV: '#3b82f6',
  Varsity: '#f97316',
  D1: '#a855f7',
};

interface VarsityMilestonesTabProps {
  previewMode: boolean;
  currentLevel: UserLevel;
  unlockedLevels: UserLevel[];
  accentColor?: string;
  onUpgrade?: () => void;
}

export function VarsityMilestonesTab({
  previewMode,
  currentLevel,
  unlockedLevels,
  accentColor = '#a855f7',
  onUpgrade,
}: VarsityMilestonesTabProps) {
  const [selectedLevel, setSelectedLevel] = useState<UserLevel>(previewMode ? 'Varsity' : currentLevel);
  const levelHex = LEVEL_HEX[selectedLevel];
  const tier = levelTiers.find(t => t.level === selectedLevel);
  const items = levelStoreItems[selectedLevel] ?? [];
  const isUnlocked = !previewMode && unlockedLevels.includes(selectedLevel);

  return (
    <div>
      {previewMode && (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24, padding: '18px 22px', background: 'rgba(168,85,247,0.06)', border: '1px dashed rgba(168,85,247,0.35)', borderRadius: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Sparkles size={14} style={{ color: '#a855f7' }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#a855f7', textTransform: 'uppercase' }}>ISO Pass Preview</span>
            </div>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0, maxWidth: 480, lineHeight: 1.6 }}>
              Browse milestone gear ISO Pass players earn through real progress with a dedicated coach. Call an ISO to unlock earning and purchasing.
            </p>
          </div>
          {onUpgrade && (
            <button onClick={onUpgrade} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(168,85,247,0.8)', color: '#fff', border: 'none', borderRadius: 100, padding: '10px 22px', fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 2, cursor: 'pointer', flexShrink: 0 }}>
              CALL AN ISO <ArrowRight size={13} />
            </button>
          )}
        </div>
      )}

      {/* Level tabs */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 24, paddingBottom: 4 }}>
        {LEVEL_ORDER.map(level => {
          const hex = LEVEL_HEX[level];
          const active = selectedLevel === level;
          const locked = !previewMode && !unlockedLevels.includes(level);
          return (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              style={{
                flexShrink: 0, padding: '10px 18px', borderRadius: 10, cursor: 'pointer',
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1.5,
                background: active ? `${hex}20` : 'rgba(255,255,255,0.04)',
                border: active ? `1px solid ${hex}50` : '1px solid rgba(255,255,255,0.08)',
                color: active ? hex : locked ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.45)',
                textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {locked && !previewMode && <Lock size={11} />}
              {level}
              {previewMode && level === 'Varsity' && (
                <span style={{ fontSize: 8, opacity: 0.7 }}>★</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Level header */}
      {tier && (
        <div style={{ marginBottom: 24, padding: '18px 22px', background: `${levelHex}10`, border: `1px solid ${levelHex}25`, borderRadius: 14 }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: levelHex, margin: '0 0 6px', letterSpacing: 0.5 }}>{tier.title} Collection</h3>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 4px', fontStyle: 'italic' }}>"{tier.tagline}"</p>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{tier.description}</p>
          {!previewMode && !isUnlocked && (
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '10px 0 0' }}>
              Reach {tier.xpRequired.toLocaleString()} XP with your coach to unlock this tier.
            </p>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {items.map(item => (
          <StoreProductCard
            key={item.id}
            item={item}
            accentColor={levelHex}
            previewOnly={previewMode || !isUnlocked}
            disabled={!previewMode && !isUnlocked}
            disabledLabel="LOCKED"
            badge={item.isFreeEligible ? 'EARNED' : selectedLevel}
          />
        ))}
      </div>

      {previewMode && onUpgrade && (
        <div style={{ marginTop: 32, padding: 28, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, textAlign: 'center' }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#F2F2F2', margin: '0 0 8px' }}>Want to earn this gear?</h3>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 20px' }}>
            ISO Pass milestone merch unlocks through real season progress — not just purchases.
          </p>
          <button onClick={onUpgrade} style={{ background: 'rgba(168,85,247,0.8)', color: '#fff', border: 'none', borderRadius: 100, padding: '12px 32px', fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 2, cursor: 'pointer' }}>
            UPGRADE TO VARSITY
          </button>
        </div>
      )}
    </div>
  );
}
