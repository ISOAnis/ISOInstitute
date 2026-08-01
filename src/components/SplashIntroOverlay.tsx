import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const INTRO_HOLD_MS = 2400;
const INTRO_FADE_MS = 650;

const gradientTextStyle = {
  background: 'linear-gradient(135deg, #ffffff 0%, #959595 40%, #b5b5b5 60%, #ffffff 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
} as const;

interface SplashIntroOverlayProps {
  onExitStart: () => void;
  onComplete: () => void;
}

export function SplashIntroOverlay({ onExitStart, onComplete }: SplashIntroOverlayProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const holdTimer = window.setTimeout(() => {
      onExitStart();
      setIsExiting(true);
    }, INTRO_HOLD_MS);
    return () => {
      window.clearTimeout(holdTimer);
      document.body.style.overflow = '';
    };
  }, [onExitStart]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center px-6"
      style={{ background: '#0C0C0C' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: INTRO_FADE_MS / 1000, ease: 'easeInOut' }}
      onAnimationComplete={() => {
        if (isExiting) onComplete();
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, #0C0C0C 68%)',
        }}
      />

      <div className="relative z-10 w-full max-w-4xl text-center">
        <motion.img
          src="/ISO OFFICIAL.png"
          alt="ISO"
          className="mx-auto h-32 w-32 object-contain sm:h-40 sm:w-40 md:h-48 md:w-48"
          style={{ filter: 'drop-shadow(0 0 48px rgba(255, 255, 255, 0.35))' }}
          initial={{ opacity: 0, scale: 0.88, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.h1
          className="mt-8 text-5xl font-bold uppercase leading-tight tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          You&apos;re Not Lost.
          <br />
          <span>You&apos;re </span>
          <span style={gradientTextStyle}>In Search Of.</span>
        </motion.h1>
      </div>
    </motion.div>
  );
}

export const SPLASH_INTRO_SESSION_KEY = 'iso-splash-intro-seen';

export function hasSeenSplashIntro(): boolean {
  if (typeof window === 'undefined') return true;
  return sessionStorage.getItem(SPLASH_INTRO_SESSION_KEY) === '1';
}

export function markSplashIntroSeen(): void {
  sessionStorage.setItem(SPLASH_INTRO_SESSION_KEY, '1');
}
