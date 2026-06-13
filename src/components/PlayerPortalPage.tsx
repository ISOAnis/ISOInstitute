import * as React from 'react';
import { Navigation } from './Navigation';
import { PlayerPortal } from './PlayerPortal';

interface PlayerPortalPageProps {
  onNavigate: (
    page: 'home' | 'pathways' | 'about' | 'community' | 'coach-portal' | 'player-portal' | 'call-iso' | 'store'
  ) => void;
}

export function PlayerPortalPage({ onNavigate }: PlayerPortalPageProps) {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#111111' }}>
      <Navigation currentPage="player-portal" onNavigate={onNavigate} />
      <PlayerPortal onNavigate={onNavigate} />
    </div>
  );
}
