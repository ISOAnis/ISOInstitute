import * as React from 'react';
import { useState, useEffect, Suspense, lazy } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { ConsultationModal } from './components/ConsultationModal';
import { CoachPortalPage } from './components/CoachPortalPage';
import { PlayerPortalPage } from './components/PlayerPortalPage';
import { About } from './components/About';
import { LoginModal } from './components/LoginModal';
import { SignupModal } from './components/SignupModal';
import { X } from 'lucide-react';
import './styles/about.css';

// Lazy load heavy components
const BasketballCourt = lazy(() => import('./components/BasketballCourt').then(m => ({ default: m.BasketballCourt })));
const WhatIsISO = lazy(() => import('./components/WhatIsISO').then(m => ({ default: m.WhatIsISO })));
const ProductShowcase = lazy(() => import('./components/ProductShowcase').then(m => ({ default: m.ProductShowcase })));
const Pricing = lazy(() => import('./components/Pricing').then(m => ({ default: m.Pricing })));
const Hero = lazy(() => import('./components/Hero').then(m => ({ default: m.Hero })));
const WhyISO = lazy(() => import('./components/WhyISO').then(m => ({ default: m.WhyISO })));
const Pathways = lazy(() => import('./components/Pathways').then(m => ({ default: m.Pathways })));
const ISOCommunity = lazy(() => import('./components/ISOCommunity').then(m => ({ default: m.ISOCommunity })));
const CallIsoPage = lazy(() => import('./components/CallIsoPage').then(m => ({ default: m.CallIsoPage })));
const StoreDashboard = lazy(() => import('./components/store/StoreDashboard').then(m => ({ default: m.StoreDashboard })));
const ForCoaches = lazy(() => import('./pages/ForCoaches').then(m => ({ default: m.default })));

type Page = 'home' | 'pathways' | 'about' | 'community' | 'call-iso' | 'coach-portal' | 'player-portal' | 'store' | 'for-coaches';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-950">
    <div className="text-white text-lg">Loading...</div>
  </div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCoachName, setSelectedCoachName] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [menteeCommitmentStatus, setMenteeCommitmentStatus] = useState<{
    isCommitted: boolean;
    mentorName?: string;
    category?: string;
    daysRemaining?: number;
  } | null>(null);
  const [shouldReopenMentorModal, setShouldReopenMentorModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [pendingCoachName, setPendingCoachName] = useState<string | null>(null);
  const [pendingCategoryId, setPendingCategoryId] = useState<string | null>(null);
  const [showPlayerLogin, setShowPlayerLogin] = useState(false);
  const [showCoachLogin, setShowCoachLogin] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [pendingPortalType, setPendingPortalType] = useState<'player' | 'coach' | null>(null);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('iso-app-state');
      if (!savedState) return;

      const parsed = JSON.parse(savedState) as Partial<{
        currentPage: Page;
        selectedCoachName: string | null;
        selectedCategoryId: string | null;
      }>;

      const validPages: Page[] = ['home', 'pathways', 'about', 'community', 'call-iso', 'coach-portal', 'player-portal', 'store', 'for-coaches'];
      if (parsed.currentPage && validPages.includes(parsed.currentPage)) {
        // Only restore Call ISO page if we also have a coach to show
        const targetPage = parsed.currentPage === 'call-iso' && !parsed.selectedCoachName ? 'home' : parsed.currentPage;
        setCurrentPage(targetPage);
      }

      if (parsed.selectedCoachName) {
        setSelectedCoachName(parsed.selectedCoachName);
      }

      if (parsed.selectedCategoryId) {
        setSelectedCategoryId(parsed.selectedCategoryId);
      }
    } catch (error) {
      console.error('Failed to restore navigation state:', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'iso-app-state',
      JSON.stringify({
        currentPage,
        selectedCoachName,
        selectedCategoryId,
      }),
    );
  }, [currentPage, selectedCoachName, selectedCategoryId]);

  // Handle navigation - clear states when navigating to home from logo/nav
  const handleNavigate = (page: Page) => {
    // If navigating to home, clear all Call ISO related states
    if (page === 'home') {
      setSelectedCoachName(null);
      setSelectedCategoryId(null);
      setShouldReopenMentorModal(false);
      setShowConsultationModal(false);
      setPendingCoachName(null);
      setPendingCategoryId(null);
    }
    setCurrentPage(page);
    
    // Scroll to top when navigating to pathways page
    if (page === 'pathways') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Helper to show consultation modal before Call ISO page
  const navigateToCallIso = (coachName: string, categoryId?: string) => {
    setPendingCoachName(coachName);
    setPendingCategoryId(categoryId || null);
    setShowConsultationModal(true);
  };

  // After consultation is scheduled, navigate to Call ISO page
  const handleConsultationComplete = () => {
    if (pendingCoachName) {
      setSelectedCoachName(pendingCoachName);
      setSelectedCategoryId(pendingCategoryId || null);
      setShowConsultationModal(false);
      setPendingCoachName(null);
      setPendingCategoryId(null);
      setCurrentPage('call-iso');
    }
  };

  // Helper to navigate back to coaches (reopen MentorModal)
  const navigateBackToCoaches = (categoryId?: string) => {
    setCurrentPage('home');
    setSelectedCoachName(null);
    if (categoryId) {
      setSelectedCategoryId(categoryId);
    }
    setShouldReopenMentorModal(true);
    
    // Scroll to court section after navigation
    setTimeout(() => {
      const courtSection = document.getElementById('iso-court');
      if (courtSection) {
        courtSection.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }, 100);
  };

  // Handle player login
  const handlePlayerLogin = (email: string, password: string) => {
    // Mock authentication - in production, this would call an API
    const userData = { email, roles: ['player'] };
    localStorage.setItem('iso_demo_user', JSON.stringify(userData));
    localStorage.setItem('iso_demo_portal', 'player');
    setShowPlayerLogin(false);
    handleNavigate('player-portal');
  };

  // Handle coach login
  const handleCoachLogin = (email: string, password: string) => {
    // Mock authentication - in production, this would call an API
    const userData = { email, roles: ['coach', 'community-leader'] };
    localStorage.setItem('iso_demo_user', JSON.stringify(userData));
    localStorage.setItem('iso_demo_portal', 'coach');
    setShowCoachLogin(false);
    handleNavigate('coach-portal');
  };

  // Helper function to sign out user
  const signOutUser = () => {
    localStorage.removeItem('iso_demo_user');
    localStorage.removeItem('iso_demo_portal');
  };

  // Handle "for players" button click - check if user is logged in
  const handlePlayerButtonClick = () => {
    try {
      const savedUser = localStorage.getItem('iso_demo_user');
      const savedPortal = localStorage.getItem('iso_demo_portal');
      
      if (savedUser) {
        // User is logged in, check if they're logged in as a coach
        if (savedPortal === 'coach') {
          // User is logged in as coach, show sign out modal
          setPendingPortalType('player');
          setShowSignOutModal(true);
        } else {
          // User is logged in as player, navigate to player portal
          handleNavigate('player-portal');
        }
      } else {
        // User is not logged in, show login modal
        setShowPlayerLogin(true);
      }
    } catch (error) {
      console.error('Failed to check login state:', error);
      // If there's an error, show login modal as fallback
      setShowPlayerLogin(true);
    }
  };

  // Handle "for coaches" button click - check if user is logged in
  const handleCoachButtonClick = () => {
    try {
      const savedUser = localStorage.getItem('iso_demo_user');
      const savedPortal = localStorage.getItem('iso_demo_portal');
      
      if (savedUser) {
        // User is logged in, check if they're logged in as a player
        if (savedPortal === 'player') {
          // User is logged in as player, show sign out modal
          setPendingPortalType('coach');
          setShowSignOutModal(true);
        } else {
          // User is logged in as coach, navigate to coach portal
          handleNavigate('coach-portal');
        }
      } else {
        // User is not logged in, show login modal
        setShowCoachLogin(true);
      }
    } catch (error) {
      console.error('Failed to check login state:', error);
      // If there's an error, show login modal as fallback
      setShowCoachLogin(true);
    }
  };

  // Handle sign out confirmation
  const handleConfirmSignOut = () => {
    signOutUser();
    setShowSignOutModal(false);
    if (pendingPortalType === 'player') {
      setShowPlayerLogin(true);
    } else if (pendingPortalType === 'coach') {
      setShowCoachLogin(true);
    }
    setPendingPortalType(null);
  };

  // Handle cancel sign out
  const handleCancelSignOut = () => {
    setShowSignOutModal(false);
    setPendingPortalType(null);
  };

  if (currentPage === 'coach-portal') {
    return <CoachPortalPage onNavigate={handleNavigate} />;
  }

  if (currentPage === 'player-portal') {
    return <PlayerPortalPage onNavigate={handleNavigate} />;
  }

  if (currentPage === 'store') {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <StoreDashboard onBack={() => handleNavigate('home')} />
      </Suspense>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        background: '#030305',
      }}
    >
      <Navigation 
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      
      {currentPage === 'home' && (
        <>
          {/* New Simple Hero Section */}
          <Suspense fallback={<LoadingSpinner />}>
            <Hero onNavigate={setCurrentPage} onPlayerClick={handlePlayerButtonClick} onCoachClick={handleCoachButtonClick} />
          </Suspense>
          
          {/* Why ISO Section */}
          <Suspense fallback={<LoadingSpinner />}>
            <WhyISO />
          </Suspense>
          
          {/* Basketball Court Section */}
          <div id="iso-court">
            <Suspense fallback={<LoadingSpinner />}>
              <BasketballCourt 
                commitmentStatus={menteeCommitmentStatus}
                onNavigateToCallIso={navigateToCallIso}
                selectedCategoryId={selectedCategoryId}
                onCategorySelect={(categoryId) => setSelectedCategoryId(categoryId)}
                forceOpenCategoryId={shouldReopenMentorModal ? selectedCategoryId : null}
                onForceOpenHandled={() => setShouldReopenMentorModal(false)}
                onNavigateToPathways={() => handleNavigate('pathways')}
              />
            </Suspense>
          </div>
          
          {/* ProductShowcase - temporarily hidden
          <Suspense fallback={<div className="h-96 bg-[#0a0a0a]" />}>
            <ProductShowcase />
          </Suspense>
          */}
          <Suspense fallback={<div className="h-96 bg-[#0a0a0a]" />}>
            <Pricing onLoginClick={() => setShowPlayerLogin(true)} />
          </Suspense>
        </>
      )}

      {currentPage === 'pathways' && (
        <Suspense fallback={<LoadingSpinner />}>
        <Pathways 
          onNavigate={setCurrentPage} 
          onNavigateToCallIso={navigateToCallIso}
          commitmentStatus={menteeCommitmentStatus}
        />
        </Suspense>
      )}

      {currentPage === 'about' && (
        <Suspense fallback={<LoadingSpinner />}>
        <About onNavigate={setCurrentPage} />
        </Suspense>
      )}

      {currentPage === 'for-coaches' && (
        <Suspense fallback={<LoadingSpinner />}>
          <ForCoaches />
        </Suspense>
      )}

      {/* Community page - temporarily hidden */}
      {false && currentPage === 'community' && (
        <Suspense fallback={<LoadingSpinner />}>
        <ISOCommunity />
        </Suspense>
      )}

      {/* Call ISO page */}
      {currentPage === 'call-iso' && selectedCoachName && (
        <Suspense fallback={<LoadingSpinner />}>
          <CallIsoPage 
            coachName={selectedCoachName}
            onBack={navigateBackToCoaches}
          />
        </Suspense>
      )}

      {currentPage !== 'call-iso' && currentPage !== 'for-coaches' && <Footer onNavigate={setCurrentPage} />}

      {/* Consultation Modal - shown before Call ISO page */}
      {showConsultationModal && pendingCoachName && (
        <ConsultationModal
          coachName={pendingCoachName}
          categoryId={pendingCategoryId || undefined}
          onClose={() => {
            setShowConsultationModal(false);
            setPendingCoachName(null);
            setPendingCategoryId(null);
          }}
          onScheduleComplete={handleConsultationComplete}
        />
      )}

      {/* Player Login Modal */}
      {showPlayerLogin && (
        <LoginModal
          title="Log In"
          onClose={() => setShowPlayerLogin(false)}
          onLogin={handlePlayerLogin}
          onSignupClick={() => {
            setShowPlayerLogin(false);
            setShowSignupModal(true);
          }}
        />
      )}

      {/* Coach Login Modal */}
      {showCoachLogin && (
        <LoginModal
          title="Coach Portal Sign In"
          onClose={() => setShowCoachLogin(false)}
          onLogin={handleCoachLogin}
          onSignupClick={() => {
            setShowCoachLogin(false);
            setShowSignupModal(true);
          }}
        />
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          onSignupComplete={(userData) => {
            console.log('Account created:', userData);
            setShowSignupModal(false);
            handleNavigate('player-portal');
          }}
        />
      )}

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={handleCancelSignOut}>
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-8 border border-slate-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">Sign Out Required</h2>
              <button
                onClick={handleCancelSignOut}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-300 mb-8">
              You are currently signed in as a {pendingPortalType === 'player' ? 'coach' : 'player'}. 
              Please sign out to access the {pendingPortalType === 'player' ? 'player' : 'coach'} portal.
            </p>

            <div className="flex gap-4">
              <button
                onClick={handleCancelSignOut}
                className="flex-1 bg-slate-800 text-white py-3 rounded-full hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSignOut}
                className="flex-1 bg-orange-500 text-white py-3 rounded-full hover:bg-orange-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
