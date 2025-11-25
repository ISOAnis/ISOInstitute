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

  const handleLogout = () => {
    localStorage.removeItem('iso_demo_user');
    localStorage.removeItem('iso_demo_portal');
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation currentPage="coach-portal" onNavigate={onNavigate} />
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
          <CoachPortal />
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}



