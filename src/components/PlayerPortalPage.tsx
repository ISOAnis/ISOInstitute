import * as React from 'react';
import { Navigation } from './Navigation';
import { MenteePortal } from './MenteePortal';
import { Footer } from './Footer';

interface PlayerPortalPageProps {
  onNavigate: (
    page: 'home' | 'pathways' | 'about' | 'community' | 'coach-portal' | 'player-portal' | 'call-iso'
  ) => void;
}

export function PlayerPortalPage({ onNavigate }: PlayerPortalPageProps) {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('iso_demo_user');
    localStorage.removeItem('iso_demo_portal');
    onNavigate('home');
  };

  return (
    <div className="min-h-screen text-white" style={{ background: '#030305' }}>
      <Navigation currentPage="player-portal" onNavigate={onNavigate} />
      <div className="pt-28 pb-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end mb-6">
            <button
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-full transition-colors"
            >
              Sign Out
            </button>
          </div>
          <MenteePortal />
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}



