/**
 * =============================================================================
 * TEMPORARY SPLASH PAGE BRANCH
 * =============================================================================
 *
 * This branch (SplashPage) renders ONLY the EventSplashPage component.
 * The full site is being developed on the main branch.
 *
 * TO RESTORE THE FULL SITE:
 * 1. Switch to the main branch, OR
 * 2. Uncomment the FullApp component below and comment out the EventSplashPage import/render
 *
 * REMOVE THIS MODIFICATION AND DELETE src/pages/EventSplashPage.tsx
 * WHEN THE FULL SITE IS READY TO LAUNCH.
 * =============================================================================
 */

import { useState, useEffect } from 'react';
import EventSplashPage from './pages/EventSplashPage';
import { About } from './components/About';
import { FAQPage } from './components/FAQPage';
import { AssistPage } from './components/AssistPage';

const WAITLIST_FORM_URL = 'https://forms.gle/A4RZXCqNptBGkLE39';

type SplashView = 'splash' | 'about' | 'faq' | 'assist';

function getViewFromUrl(): SplashView {
  if (window.location.hash === '#about') return 'about';
  if (window.location.hash === '#faq') return 'faq';
  if (window.location.hash === '#assist') return 'assist';
  return 'splash';
}

function setUrlForView(view: SplashView) {
  const base = window.location.pathname + window.location.search;
  const hash =
    view === 'about'
      ? '#about'
      : view === 'faq'
        ? '#faq'
        : view === 'assist'
          ? '#assist'
          : '';
  const nextUrl = `${base}${hash}`;
  if (window.location.pathname + window.location.search + window.location.hash !== nextUrl) {
    window.history.pushState(null, '', nextUrl);
  }
}

export default function App() {
  const [view, setView] = useState<SplashView>(getViewFromUrl);

  const navigate = (next: SplashView) => {
    setView(next);
    setUrlForView(next);
  };

  useEffect(() => {
    const onPopState = () => setView(getViewFromUrl());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title =
      view === 'about'
        ? 'About · ISO Institute'
        : view === 'faq'
          ? 'FAQ · ISO Institute'
          : view === 'assist'
            ? 'The Assist · ISO Institute'
            : 'In Search Of · ISO Institute';
  }, [view]);

  const openWaitlistForm = () => {
    window.open(WAITLIST_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  if (view === 'about') {
    return (
      <About
        onBack={() => navigate('splash')}
        onWaitlistClick={openWaitlistForm}
        onNavigateToFAQ={() => navigate('faq')}
        onNavigateToAssist={() => navigate('assist')}
      />
    );
  }

  if (view === 'faq') {
    return (
      <FAQPage
        onBack={() => navigate('splash')}
        onWaitlistClick={openWaitlistForm}
        onNavigateToAbout={() => navigate('about')}
        onNavigateToAssist={() => navigate('assist')}
      />
    );
  }

  if (view === 'assist') {
    return (
      <AssistPage
        onBack={() => navigate('splash')}
        onWaitlistClick={openWaitlistForm}
        onNavigateToAbout={() => navigate('about')}
        onNavigateToFAQ={() => navigate('faq')}
        onNavigateToAssist={() => navigate('assist')}
      />
    );
  }

  return (
    <EventSplashPage
      onNavigateToAbout={() => navigate('about')}
      onNavigateToFAQ={() => navigate('faq')}
      onNavigateToAssist={() => navigate('assist')}
    />
  );
}

/* Full site code preserved below — see git history / main branch */
