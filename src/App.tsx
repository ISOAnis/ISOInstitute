import { useState, Suspense, lazy } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';

// Lazy load heavy components
const ImageSequenceScroll = lazy(() => import('./components/ImageScroller'));
const BasketballCourt = lazy(() => import('./components/BasketballCourt').then(m => ({ default: m.BasketballCourt })));
const WhatIsISO = lazy(() => import('./components/WhatIsISO').then(m => ({ default: m.WhatIsISO })));
const ProductShowcase = lazy(() => import('./components/ProductShowcase').then(m => ({ default: m.ProductShowcase })));
const Pricing = lazy(() => import('./components/Pricing').then(m => ({ default: m.Pricing })));
const Hero = lazy(() => import('./components/Hero').then(m => ({ default: m.Hero })));
const About = lazy(() => import('./components/About').then(m => ({ default: m.About })));
const Pathways = lazy(() => import('./components/Pathways').then(m => ({ default: m.Pathways })));
const ISOCommunity = lazy(() => import('./components/ISOCommunity').then(m => ({ default: m.ISOCommunity })));
const CallIsoPage = lazy(() => import('./components/CallIsoPage').then(m => ({ default: m.CallIsoPage })));
const FAQ = lazy(() => import('./components/FAQ').then(m => ({ default: m.FAQ })));
const BecomeACoach = lazy(() => import('./components/BecomeACoach').then(m => ({ default: m.BecomeACoach })));

type Page = 'home' | 'pathways' | 'about' | 'community' | 'call-iso' | 'faq' | 'become-a-coach';

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
  const [sequenceComplete, setSequenceComplete] = useState(false);

  // Helper to navigate to Call ISO page
  const navigateToCallIso = (coachName: string, categoryId?: string) => {
    setSelectedCoachName(coachName);
    setSelectedCategoryId(categoryId || null);
    setCurrentPage('call-iso');
  };

  // Helper to navigate back to coaches (reopen MentorModal)
  const navigateBackToCoaches = () => {
    setCurrentPage('home');
    // The category will be restored by BasketballCourt if needed
    setSelectedCoachName(null);
    setSelectedCategoryId(null);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onMenteeStatusChange={setMenteeCommitmentStatus}
      />
      
      {currentPage === 'home' && (
        <>
          <Suspense fallback={<LoadingSpinner />}>
            <ImageSequenceScroll 
              frameCount={94}
              framePrefix="ezgif-frame-"
              frameSuffix=".png"
              scrollHeight={250}
              showDebug={false}
              onSequenceComplete={setSequenceComplete}
            />
          </Suspense>
          <div 
            className="transition-all duration-700 ease-in-out"
            style={{ 
              opacity: sequenceComplete ? 1 : 0,
              pointerEvents: sequenceComplete ? 'auto' : 'none',
              visibility: sequenceComplete ? 'visible' : 'hidden',
              transform: sequenceComplete ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 700ms ease-in-out, transform 700ms ease-in-out, visibility 0ms linear 0ms',
            }}
          >
            {sequenceComplete && (
              <Suspense fallback={<LoadingSpinner />}>
                <BasketballCourt 
                  commitmentStatus={menteeCommitmentStatus}
                  onNavigateToCallIso={navigateToCallIso}
                  selectedCategoryId={selectedCategoryId}
                  onCategorySelect={(categoryId) => setSelectedCategoryId(categoryId)}
                />
              </Suspense>
            )}
          </div>
          <Suspense fallback={<div className="h-96 bg-slate-950" />}>
            <ProductShowcase />
          </Suspense>
          <Suspense fallback={<div className="h-96 bg-slate-950" />}>
            <Pricing />
          </Suspense>
          <Suspense fallback={<div className="h-96 bg-slate-950" />}>
            <Hero />
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

      {/* FAQ page */}
      {currentPage === 'faq' && (
        <Suspense fallback={<LoadingSpinner />}>
          <FAQ />
        </Suspense>
      )}

      {/* Become a Coach page */}
      {currentPage === 'become-a-coach' && (
        <Suspense fallback={<LoadingSpinner />}>
          <BecomeACoach />
        </Suspense>
      )}

      {currentPage !== 'call-iso' && <Footer onNavigate={setCurrentPage} />}
    </div>
  );
}
