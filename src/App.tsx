/**
 * Routes are hash-based. The home page is the single-scroll ISO landing page
 * (src/pages/IsoLanding.tsx); its sections use in-page anchors (#how, #first-iso,
 * #pathways, #faq, #coaches). #about and #assist still open their own pages.
 */

import { useState, useEffect } from 'react';
import IsoLanding from './pages/IsoLanding';
import { About } from './components/About';
import { AssistPage } from './components/AssistPage';

const WAITLIST_FORM_URL = 'https://tally.so/r/Y5Ee75';

type View = 'home' | 'about' | 'assist';

function getViewFromUrl(): View {
  if (window.location.hash === '#about') return 'about';
  if (window.location.hash === '#assist') return 'assist';
  return 'home';
}

function setUrl(hash: string) {
  const nextUrl = window.location.pathname + window.location.search + hash;
  if (window.location.pathname + window.location.search + window.location.hash !== nextUrl) {
    window.history.pushState(null, '', nextUrl);
  }
}

export default function App() {
  const [view, setView] = useState<View>(getViewFromUrl);

  const navigate = (next: View | 'faq') => {
    if (next === 'faq') {
      setUrl('#faq');
      setView('home');
      if (view === 'home') document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setUrl(next === 'home' ? '' : `#${next}`);
    setView(next);
  };

  useEffect(() => {
    const onPopState = () => setView(getViewFromUrl());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    // The landing page scrolls itself to a section when the URL has a hash.
    if (view !== 'home' || !window.location.hash) window.scrollTo(0, 0);
    document.title = view === 'about' ? 'About · ISO' : view === 'assist' ? 'The Assist · ISO' : 'ISO · In Search Of';
  }, [view]);

  const openWaitlistForm = () => {
    window.open(WAITLIST_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  if (view === 'about') {
    return (
      <About
        onBack={() => navigate('home')}
        onWaitlistClick={openWaitlistForm}
        onNavigateToFAQ={() => navigate('faq')}
        onNavigateToAssist={() => navigate('assist')}
      />
    );
  }

  if (view === 'assist') {
    return (
      <AssistPage
        onBack={() => navigate('home')}
        onWaitlistClick={openWaitlistForm}
        onNavigateToAbout={() => navigate('about')}
        onNavigateToFAQ={() => navigate('faq')}
        onNavigateToAssist={() => navigate('assist')}
      />
    );
  }

  return <IsoLanding />;
}
