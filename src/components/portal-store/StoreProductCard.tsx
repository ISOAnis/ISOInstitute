import * as React from 'react';
import { ShoppingBag, Lock, Check } from 'lucide-react';
import type { StoreItem } from '../../types/store';

interface StoreProductCardProps {
  item: StoreItem;
  accentColor?: string;
  onAdd?: () => void;
  disabled?: boolean;
  disabledLabel?: string;
  previewOnly?: boolean;
  inCart?: boolean;
  badge?: string;
}

export function StoreProductCard({
  item,
  accentColor = '#f97316',
  onAdd,
  disabled = false,
  disabledLabel = 'Unavailable',
  previewOnly = false,
  inCart = false,
  badge,
}: StoreProductCardProps) {
  const canAdd = !disabled && !previewOnly && onAdd;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid rgba(255,255,255,0.08)`,
      borderRadius: 16,
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      <div style={{ position: 'relative', aspectRatio: '1', background: 'rgba(0,0,0,0.3)' }}>
        <img
          src={item.imageUrl}
          alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: previewOnly ? 0.85 : 1 }}
        />
        {badge && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 1.5,
            color: accentColor, background: `${accentColor}20`, border: `1px solid ${accentColor}40`,
            borderRadius: 100, padding: '3px 10px', textTransform: 'uppercase',
          }}>
            {badge}
          </span>
        )}
        {previewOnly && (
          <div style={{
            position: 'absolute', bottom: 10, right: 10,
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'rgba(168,85,247,0.85)', borderRadius: 100, padding: '4px 10px',
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 1, color: '#fff',
          }}>
            <Lock size={10} /> VARSITY
          </div>
        )}
      </div>
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: '#F2F2F2', marginBottom: 4 }}>
          {item.name}
        </div>
        {item.description && (
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '0 0 10px', lineHeight: 1.4 }}>
            {item.description}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#F2F2F2', letterSpacing: 0.5 }}>
              ${item.price.toFixed(0)}
            </span>
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 8, textTransform: 'capitalize' }}>
              {item.type}
            </span>
          </div>
          <button
            onClick={() => canAdd && onAdd?.()}
            disabled={!canAdd}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 10, border: 'none', cursor: canAdd ? 'pointer' : 'not-allowed',
              background: inCart ? 'rgba(34,197,94,0.15)' : previewOnly ? 'rgba(168,85,247,0.15)' : disabled ? 'rgba(255,255,255,0.06)' : `${accentColor}25`,
              color: inCart ? '#22c55e' : previewOnly ? '#a855f7' : disabled ? 'rgba(255,255,255,0.25)' : accentColor,
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1,
            }}
          >
            {inCart ? <><Check size={12} /> ADDED</> : previewOnly ? <><Lock size={12} /> PREVIEW</> : disabled ? disabledLabel : <><ShoppingBag size={12} /> ADD</>}
          </button>
        </div>
      </div>
    </div>
  );
}
