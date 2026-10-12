/**
 * =============================================================================
 * TEMPORARY EVENT SPLASH PAGE
 * =============================================================================
 *
 * This is a temporary splash/waiting page for the ISO Launch Event.
 * It is intended to be used on a separate branch while the full site is
 * in development on the main branch.
 *
 * REMOVE THIS FILE AND REVERT App.tsx CHANGES WHEN THE FULL SITE LAUNCHES.
 *
 * Created: December 2024
 * Purpose: Lead capture, event awareness, and social media routing
 * =============================================================================
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SplashNavigation } from '../components/SplashNavigation';
import { SplashFooter } from '../components/SplashFooter';
import { SplashHero } from '../components/SplashHero';
import {
  SplashIntroOverlay,
  hasSeenSplashIntro,
  markSplashIntroSeen,
} from '../components/SplashIntroOverlay';

// =============================================================================
// CONSTANTS
// =============================================================================

const WAITLIST_FORM_URL = 'https://tally.so/r/Y5Ee75';

export function EventSplashPage({
  onNavigateToAbout,
  onNavigateToFAQ,
  onNavigateToAssist,
}: {
  onNavigateToAbout?: () => void;
  onNavigateToFAQ?: () => void;
  onNavigateToAssist?: () => void;
}) {
  const [showIntroOverlay, setShowIntroOverlay] = useState(() => !hasSeenSplashIntro());
  const [mainVisible, setMainVisible] = useState(() => hasSeenSplashIntro());

  const handleIntroExitStart = () => {
    setMainVisible(true);
  };

  const handleIntroComplete = () => {
    markSplashIntroSeen();
    setShowIntroOverlay(false);
  };

  const openWaitlistForm = () => {
    window.open(WAITLIST_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative min-h-screen" style={{ background: '#161618' }}>
      <AnimatePresence>
        {showIntroOverlay && (
          <SplashIntroOverlay
            key="splash-intro"
            onExitStart={handleIntroExitStart}
            onComplete={handleIntroComplete}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          opacity: mainVisible ? 1 : 0,
        }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
      >
      <SplashNavigation
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToAssist={onNavigateToAssist}
      />

      <SplashHero onWaitlistClick={openWaitlistForm} onBrowseSeasonClick={() => onNavigateToAssist?.()} />

      <SplashFooter
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToFAQ={onNavigateToFAQ}
        onNavigateToAssist={onNavigateToAssist}
        onWaitlistClick={openWaitlistForm}
      />
      </motion.div>
    </div>
  );
}

export default EventSplashPage;
