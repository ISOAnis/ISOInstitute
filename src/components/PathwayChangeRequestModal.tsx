import * as React from 'react';
import { useState } from 'react';
import { X, Lock, Send, CheckCircle2 } from 'lucide-react';
import { PATHWAYS, PATHWAY_BY_ID } from '../data/pathways';
import {
  getLockedPathway,
  getPathwayChangeRequest,
  submitPathwayChangeRequest,
  approvePathwayChangeRequest,
  type PathwayChangeRequest,
} from '../utils/membership';

const PATHWAY_HEX: Record<string, string> = {
  deen: '#10b981', health: '#ef4444', medicine: '#3b82f6',
  engineering: '#a855f7', entrepreneurship: '#f97316', global: '#06b6d4',
};

interface PathwayChangeRequestModalProps {
  onClose: () => void;
  onPathwayChanged: (newPathwayId: string) => void;
}

export function PathwayChangeRequestModal({ onClose, onPathwayChanged }: PathwayChangeRequestModalProps) {
  const lockedPathway = getLockedPathway() || '';
  const existing = getPathwayChangeRequest();
  const [requestedPathway, setRequestedPathway] = useState('');
  const [justification, setJustification] = useState('');
  const [submitted, setSubmitted] = useState<PathwayChangeRequest | null>(existing?.status === 'pending' ? existing : null);
  const [approved, setApproved] = useState(existing?.status === 'approved');

  const currentName = PATHWAY_BY_ID[lockedPathway as keyof typeof PATHWAY_BY_ID]?.name ?? lockedPathway;
  const lockedHex = PATHWAY_HEX[lockedPathway] ?? '#f97316';

  const handleSubmit = () => {
    if (!requestedPathway || requestedPathway === lockedPathway) return;
    if (justification.trim().length < 20) return;
    const req = submitPathwayChangeRequest(lockedPathway, requestedPathway, justification.trim());
    setSubmitted(req);
  };

  const handleDemoApprove = () => {
    if (approvePathwayChangeRequest()) {
      const req = getPathwayChangeRequest();
      if (req?.status === 'approved') {
        setApproved(true);
        onPathwayChanged(req.requestedPathway);
      }
    }
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 32, maxWidth: 480, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Lock size={20} style={{ color: lockedHex }} />
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#F2F2F2', margin: 0, letterSpacing: 0.5 }}>Request Pathway Change</h2>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} />
          </button>
        </div>

        {approved ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={40} style={{ color: '#22c55e', marginBottom: 12 }} />
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.7)', margin: '0 0 20px' }}>
              Your pathway change has been approved by the ISO Advisory Board.
            </p>
            <button onClick={onClose} style={{ background: lockedHex, color: '#fff', border: 'none', borderRadius: 100, padding: '10px 28px', fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 2, cursor: 'pointer' }}>DONE</button>
          </div>
        ) : submitted ? (
          <div>
            <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: '0 0 8px' }}>
                Request submitted — pending ISO Advisory Board review.
              </p>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                {currentName} → {PATHWAY_BY_ID[submitted.requestedPathway as keyof typeof PATHWAY_BY_ID]?.name}
              </p>
            </div>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>
              Demo: simulate advisory board approval below.
            </p>
            <button onClick={handleDemoApprove} style={{ width: '100%', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: 10, padding: '12px 0', color: '#22c55e', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', marginBottom: 10 }}>
              SIMULATE ADVISORY APPROVAL (DEMO)
            </button>
            <button onClick={onClose} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 0', color: 'rgba(255,255,255,0.5)', fontFamily: "'Barlow', sans-serif", fontSize: 13, cursor: 'pointer' }}>Close</button>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: '0 0 20px', lineHeight: 1.6 }}>
              You're locked to <strong style={{ color: lockedHex }}>{currentName}</strong>. Locker Room members must stay in one pathway for community identity, goal setting, and future AI coaching. Submit a request with justification to switch.
            </p>
            <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Request New Pathway</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 20 }}>
              {PATHWAYS.filter(p => p.id !== lockedPathway).map(p => (
                <button key={p.id} onClick={() => setRequestedPathway(p.id)} style={{ padding: '10px 12px', borderRadius: 10, border: requestedPathway === p.id ? `1px solid ${PATHWAY_HEX[p.id]}60` : '1px solid rgba(255,255,255,0.08)', background: requestedPathway === p.id ? `${PATHWAY_HEX[p.id]}15` : 'transparent', color: requestedPathway === p.id ? PATHWAY_HEX[p.id] : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600 }}>
                  {p.name}
                </button>
              ))}
            </div>
            <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Justification (min 20 chars)</label>
            <textarea
              value={justification}
              onChange={e => setJustification(e.target.value)}
              placeholder="Why do you want to switch pathways? What have you learned that points you in a new direction?"
              rows={4}
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontFamily: "'Barlow', sans-serif", fontSize: 14, resize: 'vertical', outline: 'none', marginBottom: 20, boxSizing: 'border-box' }}
            />
            <button
              onClick={handleSubmit}
              disabled={!requestedPathway || justification.trim().length < 20}
              style={{ width: '100%', background: requestedPathway && justification.trim().length >= 20 ? lockedHex : 'rgba(255,255,255,0.08)', color: requestedPathway && justification.trim().length >= 20 ? '#fff' : 'rgba(255,255,255,0.25)', border: 'none', borderRadius: 10, padding: '13px 0', fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 2, cursor: requestedPathway && justification.trim().length >= 20 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Send size={14} /> SUBMIT TO ADVISORY BOARD
            </button>
          </>
        )}
      </div>
    </div>
  );
}
