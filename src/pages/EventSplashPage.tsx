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
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { SplashNavigation } from '../components/SplashNavigation';
import { SplashFooter } from '../components/SplashFooter';
import {
  SplashIntroOverlay,
  hasSeenSplashIntro,
  markSplashIntroSeen,
} from '../components/SplashIntroOverlay';

// =============================================================================
// CONSTANTS
// =============================================================================

const PILOT_APPLICATION_URL = 'https://form.typeform.com/to/ersVpyNB';
const WAITLIST_FORM_URL = 'https://forms.gle/A4RZXCqNptBGkLE39';

// =============================================================================
// COMPONENTS
// =============================================================================

function AssistPromoSection() {
  return (
    <div style={{ textAlign: 'center', padding: '0 0 12px' }}>
      <div
        style={{
          width: '1.5px',
          height: '36px',
          background: 'linear-gradient(to bottom, transparent, #4a4a4a, transparent)',
          margin: '0 auto 20px',
        }}
      />

      <p
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '18px',
          fontWeight: 700,
          letterSpacing: '5px',
          textTransform: 'uppercase',
          color: '#9a9a9a',
          margin: '0 0 14px',
        }}
      >
        ISO: THE ASSIST
      </p>

      <p
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '15px',
          letterSpacing: '1px',
          color: '#7f7f7f',
          margin: '0 0 20px',
        }}
      >
        A weekly talk dedicated to the ones our communities don&apos;t celebrate enough.
      </p>

      <div
        style={{
          background: 'linear-gradient(135deg, #1a1510 0%, #0c0c0c 50%, #1a1510 100%)',
          border: '1px solid rgba(192, 128, 56, 0.35)',
          padding: '24px 32px',
          margin: '0 auto',
          maxWidth: '360px',
        }}
      >
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '42px',
            fontWeight: 900,
            letterSpacing: '4px',
            color: '#C08038',
            display: 'block',
            lineHeight: 1,
          }}
        >
          Season 2 Coming Soon
        </span>
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '12px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#9a9a9a',
            marginTop: '10px',
            display: 'block',
          }}
        >
          Season 1 is complete — all 8 episodes available now
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '16px',
        }}
      >
        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#C08038', display: 'inline-block' }} />
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#7a7a7a',
          }}
        >
          8 Episodes · Season 1 Complete
        </span>
        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#C08038', display: 'inline-block' }} />
      </div>

      <div
        style={{
          width: '1.5px',
          height: '36px',
          background: 'linear-gradient(to bottom, transparent, #4a4a4a, transparent)',
          margin: '20px auto 0',
        }}
      />
    </div>
  );
}

function PilotInfoModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const handleApply = () => {
    window.open(PILOT_APPLICATION_URL, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <style>{`
            .pilot-list li::marker {
              color: white;
            }
          `}</style>
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#141414] p-8 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-white/50 transition-colors hover:text-white"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>

              <h2
                className="mb-2 text-3xl font-bold text-white"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                Pilot Program
              </h2>
              <p className="mb-6 text-white">
                Join an exclusive group of early adopters shaping the future of ISO.
              </p>

              <div className="mb-6 space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                  Application includes:
                </h3>
                <ul className="pilot-list space-y-2 text-white list-disc ml-6">
                  <li>Full name & date of birth</li>
                  <li>Email address</li>
                  <li>Acceptance of terms & conditions</li>
                  <li>Additional qualifying questions</li>
                </ul>
              </div>

              <p className="mb-6 text-sm text-white">
                Limited spots available. All applications are reviewed.
              </p>

              <button
                onClick={handleApply}
                className="w-full rounded-xl border border-white/20 bg-white/5 py-3 text-lg font-semibold text-white transition-all hover:border-white/40 hover:bg-white/10"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                Continue to Application →
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CTAButton({
  children,
  onClick,
  variant = 'default',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'gold';
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isGold = variant === 'gold';

  return (
    <motion.button
      className="w-[260px] rounded-2xl px-8 py-4 text-base font-extrabold text-center border-2"
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        backgroundColor: isGold
          ? isHovered
            ? '#a06828'
            : '#C08038'
          : isHovered
            ? '#000000'
            : '#ffffff',
        color: isGold ? '#ffffff' : isHovered ? '#ffffff' : '#000000',
        borderColor: isGold ? '#C08038' : '#ffffff',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        boxShadow: isHovered ? '0 0 30px rgba(255,255,255,0.15)' : 'none',
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}

function CTAButtonsRow({
  onWaitlistClick,
  onAssistClick,
  onPilotClick,
}: {
  onWaitlistClick: () => void;
  onAssistClick: () => void;
  onPilotClick: () => void;
}) {
  const SHOW_PILOT_BUTTON = false;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 pb-5">
      <CTAButton onClick={onWaitlistClick}>Join the Waitlist</CTAButton>
      <CTAButton onClick={onAssistClick} variant="gold">
        Browse Season 1
      </CTAButton>
      {SHOW_PILOT_BUTTON && (
        <CTAButton onClick={onPilotClick}>Apply for Pilot Program</CTAButton>
      )}
    </div>
  );
}

export function EventSplashPage({
  onNavigateToAbout,
  onNavigateToFAQ,
  onNavigateToAssist,
}: {
  onNavigateToAbout?: () => void;
  onNavigateToFAQ?: () => void;
  onNavigateToAssist?: () => void;
}) {
  const [showPilotModal, setShowPilotModal] = useState(false);
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
    <div className="relative min-h-screen" style={{ background: '#0C0C0C' }}>
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

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, #0C0C0C 70%)',
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.1) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 pb-8" style={{ paddingTop: '100px' }}>
        <div className="w-full max-w-4xl text-center">
          <div className="mb-8">
            <img
              src="/ISO OFFICIAL.png"
              alt="ISO"
              className="mx-auto h-32 w-32 object-contain sm:h-40 sm:w-40 md:h-48 md:w-48"
              style={{
                filter: 'drop-shadow(0 0 40px rgba(255, 255, 255, 0.3))',
              }}
            />
          </div>

          <h1
            className="mb-4 text-5xl font-bold uppercase leading-tight tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            You&apos;re Not Lost.
            <br />
            <span>You&apos;re </span>
            <span
              style={{
                background:
                  'linear-gradient(135deg, #ffffff 0%, #959595 40%, #b5b5b5 60%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              In Search Of.
            </span>
          </h1>

          <motion.p
            className="mx-auto mb-4 max-w-xl text-lg text-white sm:text-xl md:text-2xl"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: mainVisible ? 1 : 0, y: mainVisible ? 0 : 16 }}
            transition={{ duration: 0.65, delay: mainVisible ? 0.15 : 0 }}
          >
            A movement, a system, a community.
          </motion.p>

          <motion.p
            className="mb-2 mx-auto max-w-5xl text-lg sm:text-xl md:text-2xl tracking-[0.2em] sm:tracking-[0.3em] font-bold px-4 text-center leading-snug"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              background:
                'linear-gradient(135deg, #ffffff 0%, #959595 40%, #b5b5b5 60%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: mainVisible ? 1 : 0 }}
            transition={{ duration: 0.65, delay: mainVisible ? 0.25 : 0 }}
          >
            The ISO Institute is a gamified development platform built to inspire ambition,
            <br />
            elevate overlooked talent, and rebuild community pathways to success.
          </motion.p>

          {mainVisible && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.35 }}
            >
              <AssistPromoSection />
            </motion.div>
          )}

          <motion.div
            className="mb-12 flex justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: mainVisible ? 1 : 0, y: mainVisible ? 0 : 16 }}
            transition={{ duration: 0.65, delay: mainVisible ? 0.45 : 0 }}
          >
            <CTAButtonsRow
              onWaitlistClick={openWaitlistForm}
              onAssistClick={() => onNavigateToAssist?.()}
              onPilotClick={() => setShowPilotModal(true)}
            />
          </motion.div>
        </div>
      </div>

      <SplashFooter
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToFAQ={onNavigateToFAQ}
        onNavigateToAssist={onNavigateToAssist}
        onWaitlistClick={openWaitlistForm}
      />

      <PilotInfoModal isOpen={showPilotModal} onClose={() => setShowPilotModal(false)} />
      </motion.div>
    </div>
  );
}

export default EventSplashPage;
