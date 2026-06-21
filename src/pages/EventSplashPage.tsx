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

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, Linkedin, X } from 'lucide-react';
import { SplashNavigation } from '../components/SplashNavigation';
// =============================================================================
// CONSTANTS
// =============================================================================

// Social media links - replace with actual URLs
const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/isoinstitute/',
  tiktok: 'https://tiktok.com/@iso_institute',
  linkedin: 'https://www.linkedin.com/company/isoinstitute/',
};

// Pilot program application URL - Typeform application
const PILOT_APPLICATION_URL = 'https://form.typeform.com/to/ersVpyNB';

// Temporary: Google Form while Supabase waitlist is unavailable
const WAITLIST_FORM_URL = 'https://forms.gle/A4RZXCqNptBGkLE39';
const LIVE_STREAM_URL = 'https://youtube.com/live/oYSlRvQgJ20';
const PREVIOUS_EPISODE_URL = 'https://youtu.be/dmkHZkFmQSA';
const ASSIST_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const ASSIST_LIVE_START_HOUR = 18; // Sunday 6 PM Mountain Time
const ASSIST_LIVE_END_HOUR = 19; // Sunday 7 PM Mountain Time
const MOUNTAIN_TIME_ZONE = 'America/Denver';

function getZonedParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short',
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '0';
  const hourRaw = get('hour');

  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    hour: Number(hourRaw === '24' ? '0' : hourRaw),
    minute: Number(get('minute')),
    second: Number(get('second')),
    dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')),
  };
}

function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute = 0,
  second = 0,
  timeZone: string,
): number {
  let utcGuess = Date.UTC(year, month - 1, day, hour, minute, second);

  for (let i = 0; i < 4; i++) {
    const parts = getZonedParts(new Date(utcGuess), timeZone);
    const actualLocalMs = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
    );
    const wantedLocalMs = Date.UTC(year, month - 1, day, hour, minute, second);
    utcGuess += wantedLocalMs - actualLocalMs;
  }

  return utcGuess;
}

function getSundayLiveStartMs(year: number, month: number, day: number) {
  const normalizedSunday = new Date(Date.UTC(year, month - 1, day));
  return zonedTimeToUtc(
    normalizedSunday.getUTCFullYear(),
    normalizedSunday.getUTCMonth() + 1,
    normalizedSunday.getUTCDate(),
    ASSIST_LIVE_START_HOUR,
    0,
    0,
    MOUNTAIN_TIME_ZONE,
  );
}

// First episode: Sunday May 31, 2026, 6:00 PM Mountain Time
const ASSIST_FIRST_EPISODE_LIVE_START_MS = zonedTimeToUtc(
  2026,
  5,
  31,
  ASSIST_LIVE_START_HOUR,
  0,
  0,
  MOUNTAIN_TIME_ZONE,
);

const episodeDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  timeZone: MOUNTAIN_TIME_ZONE,
});

function getAssistSchedule(now: Date) {
  const nowMs = now.getTime();
  const parts = getZonedParts(now, MOUNTAIN_TIME_ZONE);
  const sundayAnchor = new Date(Date.UTC(parts.year, parts.month - 1, parts.day - parts.dayOfWeek));

  const liveStartMs = getSundayLiveStartMs(
    sundayAnchor.getUTCFullYear(),
    sundayAnchor.getUTCMonth() + 1,
    sundayAnchor.getUTCDate(),
  );
  const liveEndMs = liveStartMs + (ASSIST_LIVE_END_HOUR - ASSIST_LIVE_START_HOUR) * 60 * 60 * 1000;

  const isLive = nowMs >= liveStartMs && nowMs < liveEndMs;
  const nextTargetMs = nowMs >= liveEndMs ? liveStartMs + ASSIST_WEEK_MS : liveStartMs;
  const diffMs = isLive ? 0 : Math.max(0, nextTargetMs - nowMs);

  const episodeNumber =
    Math.floor((nextTargetMs - ASSIST_FIRST_EPISODE_LIVE_START_MS) / ASSIST_WEEK_MS) + 1;
  const episodeDateLabel = episodeDateFormatter.format(new Date(nextTargetMs));

  return {
    isLive,
    diffMs,
    episodeNumber,
    episodeDateLabel,
  };
}

// =============================================================================
// COMPONENTS
// =============================================================================

/**
 * TikTok Icon Component (not available in Lucide by default)
 */
function TikTokIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function AssistCountdownSection() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const { diffMs, episodeNumber, episodeDateLabel } = getAssistSchedule(now);
  const diff = diffMs;
  const episodeLabel = `EP. ${String(episodeNumber).padStart(2, '0')} • ${episodeDateLabel}`;

  const days = String(Math.floor(diff / 86400000)).padStart(2, '0');
  const hours = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
  const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');

  const valueStyle = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '56px',
    fontWeight: 900,
    fontVariantNumeric: 'tabular-nums' as const,
    lineHeight: 1,
    display: 'block',
  };

  const labelStyle = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '12px',
    letterSpacing: '4px',
    textTransform: 'uppercase' as const,
    color: '#555',
    marginTop: '6px',
    display: 'block',
  };

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
          margin: '0 0 12px',
        }}
      >
       A weekly talk dedicated to the ones our communities don't celebrate enough.
      </p>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '6px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ background: '#0c0c0c', border: '0.5px solid #1a1a1a', padding: '12px 16px', minWidth: '66px', textAlign: 'center' }}>
            <span style={{ ...valueStyle, color: '#e0e0e0' }}>{days}</span>
          </div>
          <span style={labelStyle}>DAYS</span>
        </div>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", color: '#2a2a2a', fontSize: '24px', fontWeight: 900, marginTop: '8px', alignSelf: 'flex-start' }}>:</span>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ background: '#0c0c0c', border: '0.5px solid #1a1a1a', padding: '12px 16px', minWidth: '66px', textAlign: 'center' }}>
            <span style={{ ...valueStyle, color: '#e0e0e0' }}>{hours}</span>
          </div>
          <span style={labelStyle}>HOURS</span>
        </div>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", color: '#2a2a2a', fontSize: '24px', fontWeight: 900, marginTop: '8px', alignSelf: 'flex-start' }}>:</span>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ background: '#0c0c0c', border: '0.5px solid #1a1a1a', padding: '12px 16px', minWidth: '66px', textAlign: 'center' }}>
            <span style={{ ...valueStyle, color: '#e0e0e0' }}>{minutes}</span>
          </div>
          <span style={labelStyle}>MINS</span>
        </div>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", color: '#2a2a2a', fontSize: '24px', fontWeight: 900, marginTop: '8px', alignSelf: 'flex-start' }}>:</span>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ background: '#0c0c0c', border: '0.5px solid #1a1a1a', padding: '12px 16px', minWidth: '66px', textAlign: 'center' }}>
            <span style={{ ...valueStyle, color: '#555' }}>{seconds}</span>
          </div>
          <span style={labelStyle}>SECS</span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '14px',
        }}
      >
        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#C08038', display: 'inline-block' }} />
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#9a9a9a',
          }}
        >
          Every Sunday · 6-7 PM MST
        </span>
        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#C08038', display: 'inline-block' }} />
      </div>

      <p
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '16px',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#7a7a7a',
          margin: '10px 0 0',
        }}
      >
        {episodeLabel}
      </p>

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

/**
 * Pilot Program Info Modal Component
 */
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
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Content */}
            <motion.div
              className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#141414] p-8 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Close button */}
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

/**
 * Social Media Icons Row Component with Brand Colors
 */
function SocialIconsRow() {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Instagram - Gradient */}
      <motion.a
        href={SOCIAL_LINKS.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-white/30 hover:bg-white/10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Follow us on Instagram"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFDC80" />
              <stop offset="25%" stopColor="#F77737" />
              <stop offset="50%" stopColor="#E1306C" />
              <stop offset="75%" stopColor="#C13584" />
              <stop offset="100%" stopColor="#833AB4" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#instagram-gradient)" strokeWidth="2" fill="none" />
          <circle cx="12" cy="12" r="4" stroke="url(#instagram-gradient)" strokeWidth="2" fill="none" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="url(#instagram-gradient)" />
        </svg>
      </motion.a>

      {/* TikTok - Brand Colors */}
      <motion.a
        href={SOCIAL_LINKS.tiktok}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-white/30 hover:bg-white/10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Follow us on TikTok"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cyan shadow */}
          <path 
            d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" 
            fill="#25F4EE"
            transform="translate(-1, 0)"
          />
          {/* Pink shadow */}
          <path 
            d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" 
            fill="#FE2C55"
            transform="translate(1, 0)"
          />
          {/* White main */}
          <path 
            d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" 
            fill="white"
          />
        </svg>
      </motion.a>

      {/* LinkedIn - Blue */}
      <motion.a
        href={SOCIAL_LINKS.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-white/30 hover:bg-white/10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Follow us on LinkedIn"
      >
        <Linkedin size={22} color="#0A66C2" fill="#0A66C2" />
      </motion.a>
    </div>
  );
}

/**
 * CTA Button Component with fluid color invert on hover
 */
function CTAButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className="w-[260px] rounded-2xl px-8 py-4 text-base font-extrabold text-center border-2 border-white"
      style={{ 
        fontFamily: "'Bebas Neue', sans-serif",
        backgroundColor: isHovered ? '#000000' : '#ffffff',
        color: isHovered ? '#ffffff' : '#000000',
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

function LiveStreamButton({ onClick }: { onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const { isLive, diffMs } = getAssistSchedule(now);
  const shouldAnimate = isLive || (diffMs > 0 && diffMs <= 60 * 60 * 1000);

  return (
    <motion.button
      onClick={onClick}
      className="w-[260px] rounded-2xl px-8 py-4 text-base font-extrabold text-center border-2 border-white"
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        background:
          'linear-gradient(120deg, #ffffff 0%, #d9d9d9 18%, #a8a8a8 36%, #efefef 52%, #8f8f8f 68%, #d7d7d7 84%, #ffffff 100%)',
        backgroundSize: '320% 100%',
        backgroundPosition: '0% 50%',
        color: isHovered ? '#111111' : '#000000',
        transition: 'color 0.3s ease',
        boxShadow: isHovered ? '0 0 26px rgba(255,255,255,0.2)' : 'none',
      }}
      animate={shouldAnimate ? { backgroundPosition: ['0% 50%', '320% 50%'] } : undefined}
      transition={shouldAnimate ? { duration: 5.6, repeat: Infinity, ease: 'linear' } : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isLive ? 'Currently Live' : 'Join Live Stream'}
    </motion.button>
  );
}

/**
 * CTA Buttons Row
 */
function CTAButtonsRow({
  onWaitlistClick,
  onLiveClick,
  onPilotClick,
}: {
  onWaitlistClick: () => void;
  onLiveClick: () => void;
  onPilotClick: () => void;
}) {
  // Temporarily suppress the application button - can be re-enabled by setting to true
  const SHOW_PILOT_BUTTON = false;
  
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 pb-5">
      <CTAButton variant="primary" onClick={onWaitlistClick}>
        Join the Waitlist
      </CTAButton>
      <div className="relative">
        <LiveStreamButton onClick={onLiveClick} />
        <a
          href={PREVIOUS_EPISODE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[11px] uppercase tracking-[2.5px] no-underline transition-colors hover:underline"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            color: '#888888',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#aaaaaa'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#888888'; }}
        >
          View previous episode
        </a>
      </div>
      {SHOW_PILOT_BUTTON && (
        <CTAButton variant="primary" onClick={onPilotClick}>
          Apply for Pilot Program
        </CTAButton>
      )}
    </div>
  );
}

// =============================================================================
// MAIN SPLASH PAGE COMPONENT
// =============================================================================

export function EventSplashPage({ onNavigateToAbout }: { onNavigateToAbout?: () => void }) {
  const [showPilotModal, setShowPilotModal] = useState(false);

  const openWaitlistForm = () => {
    window.open(WAITLIST_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  const openLiveStream = () => {
    window.open(LIVE_STREAM_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="relative min-h-screen"
      style={{ background: '#0C0C0C' }}
    >
      {/* Navigation Bar */}
      <SplashNavigation onNavigateToAbout={onNavigateToAbout} />

      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        {/* Radial gradient vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 0%, #0C0C0C 70%)',
          }}
        />
        {/* Subtle center glow */}
        <div
          className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse, rgba(255,255,255,0.1) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-4 pb-8" style={{ paddingTop: '100px' }}>
        <div className="w-full max-w-4xl text-center">
          {/* ISO Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8"
          >
            <img
              src="/ISO OFFICIAL.png"
              alt="ISO"
              className="mx-auto h-32 w-32 object-contain sm:h-40 sm:w-40 md:h-48 md:w-48"
              style={{
                filter: 'drop-shadow(0 0 40px rgba(255, 255, 255, 0.3))',
              }}
            />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="mb-4 text-5xl font-bold uppercase leading-tight tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            You're Not Lost.
            <br />
            <span>You're </span>
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
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="mx-auto mb-4 max-w-xl text-lg text-white sm:text-xl md:text-2xl"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            A movement, a system, a community.
          </motion.p>

          {/* Mission Statement */}
          <motion.p
            className="mb-2 mx-auto max-w-5xl text-lg sm:text-xl md:text-2xl tracking-[0.2em] sm:tracking-[0.3em] font-bold px-4 text-center leading-snug"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              background: 'linear-gradient(135deg, #ffffff 0%, #959595 40%, #b5b5b5 60%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            A gamified development platform and cultural movement built to inspire ambition,
            <br />
            elevate overlooked talent, and rebuild community pathways to success.
          </motion.p>

          <AssistCountdownSection />

          {/* CTA Section */}
          <motion.div
            className="mb-12 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <CTAButtonsRow
              onWaitlistClick={openWaitlistForm}
              onLiveClick={openLiveStream}
              onPilotClick={() => setShowPilotModal(true)}
            />
          </motion.div>

          {/* Divider */}
          <motion.div
            className="mx-auto mb-8 h-px w-24 bg-white/10"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />

          {/* Social Media Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <p
              className="mb-4 text-sm uppercase tracking-[0.2em] text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Follow the Movement
            </p>
            <SocialIconsRow />
          </motion.div>
        </div>
      </div>

      {/* Optional Footer Text */}
      <motion.footer
        className="pb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <p className="text-xs text-white/70">
          © {new Date().getFullYear()} ISO Institute. All rights reserved.
        </p>
      </motion.footer>

      {/* Modals */}
      <PilotInfoModal
        isOpen={showPilotModal}
        onClose={() => setShowPilotModal(false)}
      />
    </div>
  );
}

export default EventSplashPage;
