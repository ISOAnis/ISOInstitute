import * as React from 'react';
import { X, ArrowRight, Heart } from 'lucide-react';
import { ISO_PASS_PLATFORM_FEE } from '../utils/explorerUsage';

interface VarsityInterestModalProps {
  coachName: string;
  coachMonthlyPrice?: number;
  onClose: () => void;
  onRequestVarsity: () => void;
  onScholarshipInfo?: () => void;
}

export function VarsityInterestModal({
  coachName,
  coachMonthlyPrice = 75,
  onClose,
  onRequestVarsity,
  onScholarshipInfo,
}: VarsityInterestModalProps) {
  const isoFee = Math.round(coachMonthlyPrice * ISO_PASS_PLATFORM_FEE);
  const coachEarns = coachMonthlyPrice - isoFee;

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)', zIndex: 310, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#0A0A0A', border: '1px solid rgba(168,85,247,0.35)', borderRadius: 20, padding: 32, maxWidth: 460, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#F2F2F2', margin: 0 }}>Call an ISO with {coachName}</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} />
          </button>
        </div>

        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: '0 0 20px', lineHeight: 1.65 }}>
          You've already had your try out with {coachName} this month. The ISO Pass means weekly check-ins, a dedicated playbook, 1:1 messages, and real progress — all on-platform.
        </p>

        <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 8 }}>Coach sets price · ISO 15% platform fee</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
            <span>{coachName}'s ISO Pass rate</span>
            <span>${coachMonthlyPrice}/mo</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
            <span>ISO platform (15%)</span>
            <span>${isoFee}/mo</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.55)', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <span>Coach earns</span>
            <span style={{ color: '#a855f7' }}>${coachEarns}/mo</span>
          </div>
        </div>

        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '0 0 20px', lineHeight: 1.5 }}>
          Off-platform contact is prohibited per ISO terms. Coaches may recommend scholarship or pro bono ISO Pass spots through the ISO Foundation — never side arrangements.
        </p>

        <button onClick={onRequestVarsity} style={{ width: '100%', background: 'rgba(168,85,247,0.85)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 0', fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
          CALL AN ISO · ${coachMonthlyPrice}/MO <ArrowRight size={14} />
        </button>
        {onScholarshipInfo && (
          <button onClick={onScholarshipInfo} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 0', color: 'rgba(255,255,255,0.5)', fontFamily: "'Barlow', sans-serif", fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Heart size={13} /> Financial need? ISO Foundation scholarships
          </button>
        )}
      </div>
    </div>
  );
}
