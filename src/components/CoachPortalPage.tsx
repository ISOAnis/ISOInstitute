import * as React from 'react';
import { Navigation } from './Navigation';
import { CoachPortal } from './CoachPortal';

interface CoachPortalPageProps {
  onNavigate: (
    page: 'home' | 'pathways' | 'about' | 'community' | 'coach-portal' | 'player-portal' | 'call-iso'
  ) => void;
}

export function CoachPortalPage({ onNavigate }: CoachPortalPageProps) {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#111111' }}>
      <Navigation currentPage="coach-portal" onNavigate={onNavigate} />
      <CoachPortal />
    </div>
  );
}



