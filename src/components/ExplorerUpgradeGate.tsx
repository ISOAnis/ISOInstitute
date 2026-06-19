import { Lock, ArrowRight } from 'lucide-react';
import { LOCKER_ROOM_PRICE_USD } from '../utils/explorerUsage';

export interface ExplorerUpgradeGateProps {
  title: string;
  description: string;
  benefits: string[];
  onUpgrade: () => void;
  ctaLabel?: string;
}

export function ExplorerUpgradeGate({
  title,
  description,
  benefits,
  onUpgrade,
  ctaLabel = `JOIN LOCKER ROOM · $${LOCKER_ROOM_PRICE_USD}/MO`,
}: ExplorerUpgradeGateProps) {
  return (
    <div style={{ padding: 48, textAlign: 'center', background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 20 }}>
      <Lock size={36} style={{ color: '#f97316', marginBottom: 16, opacity: 0.7 }} />
      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#F2F2F2', margin: '0 0 10px' }}>{title}</h3>
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.45)', margin: '0 auto 24px', maxWidth: 420, lineHeight: 1.7 }}>
        {description}
      </p>
      <ul style={{ textAlign: 'left', maxWidth: 360, margin: '0 auto 28px', padding: '0 0 0 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
        {benefits.map(benefit => (
          <li key={benefit}>{benefit}</li>
        ))}
      </ul>
      <button
        onClick={onUpgrade}
        style={{ background: '#f97316', color: '#fff', border: 'none', borderRadius: 100, padding: '13px 32px', fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 2, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
      >
        {ctaLabel} <ArrowRight size={14} />
      </button>
    </div>
  );
}
