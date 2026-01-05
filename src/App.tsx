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

type Page = 'home' | 'pathways' | 'about' | 'community' | 'call-iso' | 'coach-portal' | 'player-portal' | 'store';

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
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('iso-app-state');
      if (!savedState) return;

      const parsed = JSON.parse(savedState) as Partial<{
        currentPage: Page;
        selectedCoachName: string | null;
        selectedCategoryId: string | null;
      }>;

      const validPages: Page[] = ['home', 'pathways', 'about', 'community', 'call-iso', 'coach-portal', 'player-portal', 'store'];
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
    setShowPlayerLogin(false);
    handleNavigate('player-portal');
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
            <Hero onNavigate={setCurrentPage} />
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

      {currentPage !== 'call-iso' && <Footer onNavigate={setCurrentPage} />}

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
    </div>
  );
}
