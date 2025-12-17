import * as React from 'react';
import { Navigation } from './Navigation';
import { CoachPortal } from './CoachPortal';
import { Footer } from './Footer';

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
    <div className="min-h-screen text-white" style={{ background: '#030305' }}>
      <Navigation currentPage="coach-portal" onNavigate={onNavigate} />
      <div className="pt-32 pb-16">
        <CoachPortal />
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}



