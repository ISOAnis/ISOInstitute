import * as React from 'react';
import { PortalDailyStreak } from './PortalDailyStreak';

const ISO_LOGO_SRC = '/ISO OFFICIAL.png';

interface PortalChromeBarProps {
  role: 'coach' | 'player';
  portalLabel: string;
  accentColor?: string;
}

export function PortalChromeBar({ role, portalLabel, accentColor = '#10b981' }: PortalChromeBarProps) {
  return (
    <div
      data-tutorial-id={role === 'coach' ? 'coach-chrome-bar' : 'player-chrome-bar'}
      style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: '14px 28px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(0,0,0,0.25)',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
        <img
          src={ISO_LOGO_SRC}
          alt="ISO Institute"
          style={{ height: 36, width: 'auto', objectFit: 'contain', flexShrink: 0 }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 18,
            color: '#F2F2F2',
            letterSpacing: 1,
            lineHeight: 1,
          }}>
            ISO Institute
          </div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: accentColor,
            marginTop: 2,
          }}>
            {portalLabel}
          </div>
        </div>
      </div>

      <div data-tutorial-id={role === 'coach' ? 'coach-daily-streak' : 'player-daily-streak'}>
        <PortalDailyStreak role={role} accentColor={accentColor} />
      </div>
    </div>
  );
}
