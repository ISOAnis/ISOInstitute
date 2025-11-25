import { useState, Suspense, lazy } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { ConsultationModal } from './components/ConsultationModal';
import { CoachPortalPage } from './components/CoachPortalPage';
import { PlayerPortalPage } from './components/PlayerPortalPage';
import { About } from './components/About';

// Lazy load heavy components
const BasketballCourt = lazy(() => import('./components/BasketballCourt').then(m => ({ default: m.BasketballCourt })));
const WhatIsISO = lazy(() => import('./components/WhatIsISO').then(m => ({ default: m.WhatIsISO })));
const ProductShowcase = lazy(() => import('./components/ProductShowcase').then(m => ({ default: m.ProductShowcase })));
const Pricing = lazy(() => import('./components/Pricing').then(m => ({ default: m.Pricing })));
const Hero = lazy(() => import('./components/Hero').then(m => ({ default: m.Hero })));
const Pathways = lazy(() => import('./components/Pathways').then(m => ({ default: m.Pathways })));
const ISOCommunity = lazy(() => import('./components/ISOCommunity').then(m => ({ default: m.ISOCommunity })));
const CallIsoPage = lazy(() => import('./components/CallIsoPage').then(m => ({ default: m.CallIsoPage })));
type Page = 'home' | 'pathways' | 'about' | 'community' | 'call-iso' | 'coach-portal' | 'player-portal';

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

  if (currentPage === 'coach-portal') {
    return <CoachPortalPage onNavigate={handleNavigate} />;
  }

  if (currentPage === 'player-portal') {
    return <PlayerPortalPage onNavigate={handleNavigate} />;
  }

  return (
    <div className="min-h-screen bg-slate-950">
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
              />
            </Suspense>
          </div>
          
          <Suspense fallback={<div className="h-96 bg-[#0a0a0a]" />}>
            <ProductShowcase />
          </Suspense>
          <Suspense fallback={<div className="h-96 bg-[#0a0a0a]" />}>
            <Pricing />
          </Suspense>
        </>
      )}

      {currentPage === 'pathways' && (
        <Suspense fallback={<LoadingSpinner />}>
          <Pathways onNavigate={setCurrentPage} />
        </Suspense>
      )}

      {currentPage === 'about' && (
        <Suspense fallback={<LoadingSpinner />}>
          <About />
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
    </div>
  );
}
