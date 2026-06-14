import * as React from 'react';
import { getPortalFirstName, getTimeGreeting } from '../utils/portalGreeting';

interface PortalGreetingProps {
  name?: string;
  role?: 'player' | 'coach';
  subline?: string;
  accentColor?: string;
  className?: string;
}

export function PortalGreeting({
  name,
  role = 'player',
  subline,
  accentColor = '#f97316',
  className,
}: PortalGreetingProps) {
  const greeting = React.useMemo(() => getTimeGreeting(), []);
  const firstName = name ?? getPortalFirstName(role);

  return (
    <div className={className} style={{ marginBottom: 28 }}>
      <h1 style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 42,
        color: '#F2F2F2',
        margin: 0,
        letterSpacing: 0.5,
        lineHeight: 1.1,
      }}>
        <span style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 18,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: 0,
          display: 'block',
          marginBottom: 4,
        }}>
          {greeting},
        </span>
        {firstName}
      </h1>
      {subline && (
        <p style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 14,
          color: accentColor,
          margin: '10px 0 0',
          opacity: 0.85,
        }}>
          {subline}
        </p>
      )}
    </div>
  );
}
