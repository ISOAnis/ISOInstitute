import * as React from 'react';
import { motion } from 'motion/react';

const MISSION_LINES = [
  'ISO is built to inspire ambition, elevate overlooked',
  'talent, and rebuild community pathways to success.',
] as const;

const NAV_OFFSET = 88;
/** Wheel delta (px) required to complete the zoom in either direction */
const SCROLL_DISTANCE = 800;
/** How close scrollY must be to the caught position before zoom-out can start */
const CAUGHT_TOLERANCE = 20;

function MissionContent() {
  return (
    <>
      <div className="about-eyebrow">Mission</div>
      <h2 className="about-heading about-mission-heading">
        {MISSION_LINES.map((line) => (
          <span key={line} className="about-mission-line">
            {line}
          </span>
        ))}
      </h2>
    </>
  );
}

export function AboutMissionScroll() {
  const pinRef = React.useRef<HTMLElement>(null);
  const progressRef = React.useRef(0);
  const pinnedYRef = React.useRef(0);
  const caughtScrollYRef = React.useRef<number | null>(null);
  const isPinnedRef = React.useRef(false);
  const touchYRef = React.useRef(0);

  const [reduceMotion, setReduceMotion] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [isLocked, setIsLocked] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const getCaughtScrollY = React.useCallback(() => {
    if (caughtScrollYRef.current != null) return caughtScrollYRef.current;
    const section = pinRef.current;
    if (!section) return window.scrollY;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    return sectionTop - NAV_OFFSET;
  }, []);

  const setMissionProgress = React.useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(1, next));
    progressRef.current = clamped;
    setProgress(clamped);

    if (clamped >= 1) {
      caughtScrollYRef.current = pinnedYRef.current;
    }
    if (clamped <= 0) {
      caughtScrollYRef.current = null;
    }
  }, []);

  const releasePin = React.useCallback(() => {
    isPinnedRef.current = false;
    setIsLocked(false);
  }, []);

  const engagePin = React.useCallback(() => {
    isPinnedRef.current = true;
    pinnedYRef.current = window.scrollY;
    setIsLocked(true);
  }, []);

  React.useEffect(() => {
    if (reduceMotion) return;

    const section = pinRef.current;
    if (!section) return;

    const isPinZone = () => {
      const rect = section.getBoundingClientRect();
      return rect.top <= NAV_OFFSET + 4 && rect.bottom > NAV_OFFSET + 120;
    };

    /** Mission is aligned and scroll has reached the full zoomed-in position */
    const isAtCaughtView = () => {
      if (!isPinZone()) return false;
      const caughtY = getCaughtScrollY();
      return window.scrollY <= caughtY + CAUGHT_TOLERANCE;
    };

    const shouldEngage = (delta: number) => {
      const p = progressRef.current;

      if (delta > 0 && p < 1) {
        return isPinZone();
      }

      if (delta < 0 && p > 0) {
        return isAtCaughtView();
      }

      return false;
    };

    const applyDelta = (delta: number) => {
      const current = progressRef.current;
      const next = current + delta / SCROLL_DISTANCE;

      if (next <= 0) {
        setMissionProgress(0);
        releasePin();
        return;
      }

      if (next >= 1) {
        pinnedYRef.current = window.scrollY;
        setMissionProgress(1);
        releasePin();
        return;
      }

      setMissionProgress(next);
      window.scrollTo(0, pinnedYRef.current);
    };

    const onWheel = (e: WheelEvent) => {
      if (!isPinnedRef.current) {
        if (!shouldEngage(e.deltaY)) return;
        engagePin();
      }

      if (!isPinnedRef.current) return;

      if (!isPinZone() && progressRef.current <= 0) {
        releasePin();
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      applyDelta(e.deltaY);
    };

    const onScroll = () => {
      if (isPinnedRef.current) {
        window.scrollTo(0, pinnedYRef.current);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchYRef.current = e.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0]?.clientY ?? touchYRef.current;
      const delta = (touchYRef.current - touchY) * 1.5;
      touchYRef.current = touchY;

      if (!isPinnedRef.current) {
        if (!shouldEngage(delta)) return;
        engagePin();
      }

      if (!isPinnedRef.current) return;

      if (!isPinZone() && progressRef.current <= 0) {
        releasePin();
        return;
      }

      e.preventDefault();
      applyDelta(delta);
    };

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false, capture: true });

    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove, { capture: true });
    };
  }, [reduceMotion, engagePin, releasePin, setMissionProgress, getCaughtScrollY]);

  const scale = 1 + progress * 0.32;
  const opacity = 0.9 + progress * 0.1;

  if (reduceMotion) {
    return (
      <section className="about-section about-mission-section">
        <MissionContent />
      </section>
    );
  }

  return (
    <section
      ref={pinRef}
      className={`about-mission-pin${isLocked ? ' is-locked' : ''}`}
      aria-label="Mission"
    >
      <div className={`about-mission-sticky${isLocked ? ' is-locked' : ''}`}>
        <div className="about-mission-sticky-inner">
          <motion.div
            style={{ scale, opacity, transformOrigin: 'center center' }}
            transition={{ type: 'tween', duration: 0.08, ease: 'linear' }}
          >
            <MissionContent />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
