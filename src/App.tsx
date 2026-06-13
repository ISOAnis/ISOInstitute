import * as React from 'react';
import { useState, useEffect, Suspense, lazy } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { ConsultationModal } from './components/ConsultationModal';
import { CoachPortalPage } from './components/CoachPortalPage';
import { PlayerPortalPage } from './components/PlayerPortalPage';
import { About } from './components/About';
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
const JoinISOPage = lazy(() => import('./pages/JoinISOPage').then(m => ({ default: m.JoinISOPage })));

type Page = 'home' | 'pathways' | 'about' | 'community' | 'call-iso' | 'coach-portal' | 'player-portal' | 'store' | 'for-coaches' | 'join';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-950">
    <div className="text-white text-lg">Loading...</div>
  </div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [joinAuthMode, setJoinAuthMode] = useState<'create' | 'signin'>('create');
  const [selectedCoachName, setSelectedCoachName] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [playerCommitmentStatus, setPlayerCommitmentStatus] = useState<{
    isCommitted: boolean;
    coachName?: string;
    category?: string;
    daysRemaining?: number;
  } | null>(null);
  const [shouldReopenCoachModal, setShouldReopenCoachModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [pendingCoachName, setPendingCoachName] = useState<string | null>(null);
  const [pendingCategoryId, setPendingCategoryId] = useState<string | null>(null);
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

      const validPages: Page[] = ['home', 'pathways', 'about', 'community', 'call-iso', 'coach-portal', 'player-portal', 'store', 'for-coaches', 'join'];
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
      setShouldReopenCoachModal(false);
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

  // Helper to navigate back to coaches (reopen CoachModal)
  const navigateBackToCoaches = (categoryId?: string) => {
    setCurrentPage('home');
    setSelectedCoachName(null);
    if (categoryId) {
      setSelectedCategoryId(categoryId);
    }
    setShouldReopenCoachModal(true);
    
    // Scroll to court section after navigation
    setTimeout(() => {
      const courtSection = document.getElementById('iso-court');
      if (courtSection) {
        courtSection.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }, 100);
  };

  // Handle player login
  const handlePlayerLogin = (_email: string, _password: string) => {
    handleNavigate('join');
  };

  const handleCoachLogin = (_email: string, _password: string) => {
    handleNavigate('join');
  };

  // Helper function to sign out user
  const signOutUser = () => {
    localStorage.removeItem('iso_demo_user');
    localStorage.removeItem('iso_demo_portal');
    localStorage.removeItem('iso_onboarding_complete');
    localStorage.removeItem('iso_coach_pending');
    localStorage.removeItem('iso_explorer');
    localStorage.removeItem('iso-onboarding');
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
        // User is not logged in — go to Join ISO auth flow
        handleNavigate('join');
      }
    } catch (error) {
      console.error('Failed to check login state:', error);
      handleNavigate('join');
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
        // User is not logged in — go to Join ISO auth flow
        handleNavigate('join');
      }
    } catch (error) {
      console.error('Failed to check login state:', error);
      handleNavigate('join');
    }
  };

  // Handle sign out confirmation
  const handleConfirmSignOut = () => {
    signOutUser();
    setShowSignOutModal(false);
    setPendingPortalType(null);
    handleNavigate('join');
  };

  // Handle cancel sign out
  const handleCancelSignOut = () => {
    setShowSignOutModal(false);
    setPendingPortalType(null);
  };

  // Portal gate — check login, onboarding, and coach pending status
  const isOnboarded = (() => {
    try { return !!localStorage.getItem('iso_onboarding_complete'); } catch { return false; }
  })();
  const isLoggedIn = (() => {
    try { return !!localStorage.getItem('iso_demo_user'); } catch { return false; }
  })();
  const isCoachPending = (() => {
    try { return !!localStorage.getItem('iso_coach_pending'); } catch { return false; }
  })();

  // Coach applied but not yet approved — show pending screen
  if (currentPage === 'coach-portal' && isCoachPending && !isOnboarded) {
    const GS = { fontFamily: "'Bebas Neue', sans-serif" } as React.CSSProperties;
    const BS = { fontFamily: "'Barlow', sans-serif" } as React.CSSProperties;
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 500 }}>
          <div style={{ ...GS, fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.25)', marginBottom: 24 }}>
            ISO · ADVISORY BOARD REVIEW
          </div>
          <h1 style={{ ...GS, fontSize: 'clamp(38px, 8vw, 58px)', color: 'rgba(180,180,180,0.9)', letterSpacing: '2px', lineHeight: 1, marginBottom: 16 }}>
            Application Under Review.
          </h1>
          <p style={{ ...BS, fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginBottom: 32 }}>
            Your coach application has been submitted to the ISO Advisory Board. Portal access is granted only after your credentials are verified and your application is approved.
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
            padding: '24px 28px',
            marginBottom: 32,
            textAlign: 'left',
          }}>
            <div style={{ ...GS, fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>WHAT TO EXPECT</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'ISO will email you at the address you provided requesting supporting documentation (diploma, certifications, licenses, or other proof).',
                'The Advisory Board reviews your materials alongside your intake assessment.',
                'Once approved, you\'ll receive portal access and your official coach card goes live.',
                'Review typically takes 5–10 business days.',
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ ...GS, fontSize: '12px', color: 'rgba(255,255,255,0.2)', minWidth: 18, paddingTop: 2 }}>{i + 1}</span>
                  <span style={{ ...BS, fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => handleNavigate('home')}
            style={{
              ...GS,
              fontSize: '14px',
              letterSpacing: '3px',
              background: 'rgba(180,180,180,0.9)',
              color: '#0A0A0A',
              border: 'none',
              borderRadius: '999px',
              padding: '14px 36px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Back to ISO
          </button>
        </div>
      </div>
    );
  }

  // General portal gate — not logged in or no onboarding
  if ((currentPage === 'coach-portal' || currentPage === 'player-portal') && (!isLoggedIn || !isOnboarded)) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 460 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.25)', marginBottom: 24 }}>
            ISO · ACCESS REQUIRED
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 8vw, 64px)', color: 'rgba(180,180,180,0.9)', letterSpacing: '2px', lineHeight: 1, marginBottom: 16 }}>
            Complete Onboarding First.
          </h1>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '15px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 36 }}>
            {isLoggedIn
              ? "You're signed in, but you haven't completed your onboarding yet. Finish your assessment to unlock your portal."
              : "You need to create an account and complete your onboarding before accessing this portal."}
          </p>
          <button
            onClick={() => handleNavigate('join')}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '14px',
              letterSpacing: '3px',
              background: 'rgba(180,180,180,0.9)',
              color: '#0A0A0A',
              border: 'none',
              borderRadius: '999px',
              padding: '14px 36px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginRight: 12,
            }}
          >
            {isLoggedIn ? 'Begin Onboarding' : 'Join ISO'}
          </button>
          <button
            onClick={() => handleNavigate('home')}
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: '13px',
              background: 'none',
              color: 'rgba(255,255,255,0.3)',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s',
              marginTop: 16,
              display: 'block',
              margin: '16px auto 0',
            }}
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  if (currentPage === 'coach-portal') {
    return <CoachPortalPage onNavigate={handleNavigate} />;
  }

  if (currentPage === 'player-portal') {
    return <PlayerPortalPage onNavigate={handleNavigate} />;
  }

  // Store hidden on onboarding branch
  // if (currentPage === 'store') {
  //   return (
  //     <Suspense fallback={<LoadingSpinner />}>
  //       <StoreDashboard onBack={() => handleNavigate('home')} />
  //     </Suspense>
  //   );
  // }

  return (
    <div 
      className="min-h-screen"
      style={{
        background: '#111111',
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
                commitmentStatus={playerCommitmentStatus}
                onNavigateToCallIso={navigateToCallIso}
                selectedCategoryId={selectedCategoryId}
                onCategorySelect={(categoryId) => setSelectedCategoryId(categoryId)}
                forceOpenCategoryId={shouldReopenCoachModal ? selectedCategoryId : null}
                onForceOpenHandled={() => setShouldReopenCoachModal(false)}
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
            <Pricing onLoginClick={() => handleNavigate('join')} />
          </Suspense>
        </>
      )}

      {currentPage === 'pathways' && (
        <Suspense fallback={<LoadingSpinner />}>
        <Pathways 
          onNavigate={setCurrentPage} 
          onNavigateToCallIso={navigateToCallIso}
          commitmentStatus={playerCommitmentStatus}
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
          <ForCoaches onNavigate={handleNavigate} />
        </Suspense>
      )}

      {currentPage === 'join' && (
        <Suspense fallback={<LoadingSpinner />}>
          <JoinISOPage onNavigate={handleNavigate} />
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

      {currentPage !== 'call-iso' && currentPage !== 'for-coaches' && currentPage !== 'join' && <Footer onNavigate={setCurrentPage} />}

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
