import * as React from 'react';
import { Navigation } from './Navigation';
import { PlayerPortal } from './PlayerPortal';
import { Footer } from './Footer';

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
    <div className="min-h-screen text-white" style={{ background: '#111111' }}>
      <Navigation currentPage="player-portal" onNavigate={onNavigate} />
      <div className="pt-28 pb-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <PlayerPortal onNavigate={onNavigate} />
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}



