import * as React from 'react';
import { Flame } from 'lucide-react';
import { getPortalStreak, recordPortalVisit } from '../utils/portalStreak';

interface PortalDailyStreakProps {
  role: 'coach' | 'player';
  accentColor?: string;
}

export function PortalDailyStreak({ role, accentColor = '#f97316' }: PortalDailyStreakProps) {
  const [streak, setStreak] = React.useState(() => getPortalStreak(role));

  React.useEffect(() => {
    setStreak(recordPortalVisit(role));
  }, [role]);

  const count = streak.count;

  return (
    <div
      title={count > 0 ? `${count} consecutive days on ISO` : 'Visit daily to start your streak'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        borderRadius: 100,
        background: count > 0 ? `${accentColor}12` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${count > 0 ? `${accentColor}35` : 'rgba(255,255,255,0.08)'}`,
      }}
    >
      <Flame
        size={16}
        style={{ color: count > 0 ? accentColor : 'rgba(255,255,255,0.25)', flexShrink: 0 }}
        fill={count > 0 ? `${accentColor}40` : 'none'}
      />
      <div style={{ lineHeight: 1.1 }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 20,
          color: count > 0 ? '#F2F2F2' : 'rgba(255,255,255,0.35)',
          letterSpacing: 0.5,
        }}>
          {count > 0 ? count : '—'}
        </div>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: count > 0 ? `${accentColor}` : 'rgba(255,255,255,0.3)',
        }}>
          Day Streak
        </div>
      </div>
    </div>
  );
}
