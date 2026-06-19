import * as React from 'react';
import { X, LogOut } from 'lucide-react';
import { PORTAL_ACCENT, PORTAL_PANEL_BORDER, PORTAL_SIDEBAR, PORTAL_TEXT_MUTED, PORTAL_TEXT_PRIMARY } from '../utils/portalTheme';

interface PortalSignOutModalProps {
  pendingPortalType: 'player' | 'coach';
  onCancel: () => void;
  onConfirm: () => void;
}

export function PortalSignOutModal({ pendingPortalType, onCancel, onConfirm }: PortalSignOutModalProps) {
  const currentRole = pendingPortalType === 'player' ? 'coach' : 'player';
  const targetPortal = pendingPortalType === 'player' ? 'player' : 'coach';

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: PORTAL_SIDEBAR,
          border: `1px solid ${PORTAL_PANEL_BORDER}`,
          borderRadius: 20,
          padding: 28,
          maxWidth: 440,
          width: '100%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogOut size={20} style={{ color: PORTAL_ACCENT }} />
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 0.5,
              color: PORTAL_TEXT_PRIMARY, margin: 0,
            }}>
              Sign Out Required
            </h2>
          </div>
          <button
            onClick={onCancel}
            aria-label="Close"
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%', width: 32, height: 32, cursor: 'pointer',
              color: PORTAL_TEXT_MUTED, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={14} />
          </button>
        </div>

        <p style={{
          fontFamily: "'Barlow', sans-serif", fontSize: 14, lineHeight: 1.65,
          color: 'rgba(255,255,255,0.55)', margin: '0 0 24px',
        }}>
          You are currently signed in as a{' '}
          <strong style={{ color: PORTAL_TEXT_PRIMARY }}>{currentRole}</strong>.
          {' '}Sign out to access the{' '}
          <strong style={{ color: PORTAL_ACCENT }}>{targetPortal} portal</strong>.
        </p>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '12px 0', cursor: 'pointer',
              fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.65)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, background: PORTAL_ACCENT, border: 'none', borderRadius: 10,
              padding: '12px 0', cursor: 'pointer',
              fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: '#fff',
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
