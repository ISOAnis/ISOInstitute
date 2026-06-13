import * as React from 'react';
import { useState } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';
import { LOCKER_ROOM_PRICE_USD } from '../utils/explorerUsage';

interface LockerRoomCheckoutModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function LockerRoomCheckoutModal({ onClose, onSuccess }: LockerRoomCheckoutModalProps) {
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#0A0A0A', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 20, padding: 32, maxWidth: 440, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: '#F2F2F2', margin: '0 0 4px', letterSpacing: 0.5 }}>Join Locker Room</h2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>${LOCKER_ROOM_PRICE_USD}/month · cancel anytime</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <ul style={{ margin: 0, padding: '0 0 0 18px', fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
            <li>3 × 30-min try outs with <strong>different</strong> coaches in your pathway</li>
            <li>Locker Room chat, goals & online store</li>
            <li>Locked pathway identity · priority shadowing</li>
            <li>Varsity milestone gear preview</li>
          </ul>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: '12px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: 10 }}>
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Monthly total</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#f97316' }}>${LOCKER_ROOM_PRICE_USD}</span>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Card (demo)</label>
          <input readOnly value="4242 4242 4242 4242" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 14px', color: '#fff', fontFamily: "'Barlow', sans-serif", fontSize: 14, boxSizing: 'border-box' }} />
        </div>

        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '0 0 16px', lineHeight: 1.5 }}>
          <Lock size={10} style={{ display: 'inline', marginRight: 4 }} />
          All Locker Room revenue supports ISO. Coaches serve try outs as part of their platform agreement — they earn when you Call an ISO and join them on the ISO Pass.
        </p>

        <button onClick={handlePay} disabled={processing} style={{ width: '100%', background: processing ? 'rgba(249,115,22,0.5)' : '#f97316', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 0', fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 2, cursor: processing ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <CreditCard size={16} />
          {processing ? 'PROCESSING...' : `PAY $${LOCKER_ROOM_PRICE_USD} & CONTINUE`}
        </button>
      </div>
    </div>
  );
}
