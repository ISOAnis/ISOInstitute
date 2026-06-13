import * as React from 'react';
import { useState } from 'react';
import { X, Lock } from 'lucide-react';
import { PATHWAYS, PATHWAY_BY_ID } from '../data/pathways';
import { lockPathway, setUserPlan, getExploringPathway, type MembershipPlan } from '../utils/membership';
import { LOCKER_ROOM_PRICE_USD } from '../utils/explorerUsage';

const PATHWAY_HEX: Record<string, string> = {
  deen: '#10b981', health: '#ef4444', medicine: '#3b82f6',
  engineering: '#a855f7', entrepreneurship: '#f97316', global: '#06b6d4',
};

interface PathwayLockConfirmModalProps {
  onClose: () => void;
  onConfirmed: (plan: MembershipPlan) => void;
  targetPlan?: MembershipPlan;
}

export function PathwayLockConfirmModal({ onClose, onConfirmed, targetPlan = 'locker-room' }: PathwayLockConfirmModalProps) {
  const exploring = getExploringPathway();
  const [selected, setSelected] = useState(exploring || PATHWAYS[0].id);
  const hex = PATHWAY_HEX[selected] ?? '#f97316';
  const name = PATHWAY_BY_ID[selected as keyof typeof PATHWAY_BY_ID]?.name ?? selected;

  const handleConfirm = () => {
    lockPathway(selected);
    setUserPlan(targetPlan);
    onConfirmed(targetPlan);
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#0A0A0A', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 20, padding: 32, maxWidth: 480, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Lock size={20} style={{ color: '#f97316' }} />
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#F2F2F2', margin: 0 }}>Lock Your Pathway</h2>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} />
          </button>
        </div>
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: '0 0 20px', lineHeight: 1.65 }}>
          {targetPlan === 'varsity' ? 'ISO Pass' : 'Locker Room'} requires committing to one pathway. Your pathway appears on your name in community chat and scopes your goals. You can browse all pathway channels — switching later requires ISO Advisory Board approval.
        </p>
        <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Select Your Pathway</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 24 }}>
          {PATHWAYS.map(p => (
            <button key={p.id} onClick={() => setSelected(p.id)} style={{ padding: '12px 14px', borderRadius: 10, border: selected === p.id ? `1px solid ${PATHWAY_HEX[p.id]}60` : '1px solid rgba(255,255,255,0.08)', background: selected === p.id ? `${PATHWAY_HEX[p.id]}15` : 'transparent', color: selected === p.id ? PATHWAY_HEX[p.id] : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, textAlign: 'left' }}>
              {p.name}
            </button>
          ))}
        </div>
        <div style={{ background: `${hex}10`, border: `1px solid ${hex}30`, borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
            You're joining {targetPlan === 'varsity' ? 'ISO Pass' : 'Locker Room'} as a <strong style={{ color: hex }}>{name}</strong> member{targetPlan === 'locker-room' ? ` · $${LOCKER_ROOM_PRICE_USD}/mo` : ''}
          </p>
        </div>
        <button onClick={handleConfirm} style={{ width: '100%', background: '#f97316', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 0', fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 2, cursor: 'pointer' }}>
          CONFIRM & JOIN {targetPlan === 'varsity' ? 'ISO PASS' : 'LOCKER ROOM'}
        </button>
      </div>
    </div>
  );
}
