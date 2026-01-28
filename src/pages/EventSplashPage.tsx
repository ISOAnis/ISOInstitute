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
import { saveWaitlistEntry } from '../utils/supabase';

// =============================================================================
// TYPES
// =============================================================================

interface WaitlistFormData {
  fullName: string;
  email: string;
  phone: string;
}

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

// =============================================================================
// COMPONENTS
// =============================================================================

/**
 * Simplified Navigation Bar for Splash Page
 */
function SplashNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4">
      <div className="w-full max-w-5xl">
        <div
          className={`flex items-center justify-between rounded-full pl-4 pr-3 h-12 shadow-lg transition-all duration-300 ${
            isScrolled
              ? 'bg-black/90 shadow-black/60 backdrop-blur-[40px]'
              : 'bg-black/65 shadow-black/30 backdrop-blur-[16px]'
          }`}
          style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }}
        >
          {/* Brand */}
          <div className="flex items-center">
            <span 
              className="text-white text-lg font-semibold tracking-wide" 
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              ISO Institute
            </span>
          </div>
          
          {/* Coming Soon Button */}
          <button 
            className="flex items-center justify-center rounded-full bg-white px-6 h-8 text-black font-medium transition-all hover:bg-white/90 leading-none mr-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif", height: '36px' }}
          >
            Coming Soon
          </button>
        </div>
      </div>
    </nav>
  );
}

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

/**
 * Waitlist Form Modal Component
 */
function WaitlistModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<WaitlistFormData>({
    fullName: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Save to database
      const result = await saveWaitlistEntry({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
      });

      if (!result.success) {
        setError(result.error || 'Failed to save. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Success - show success message
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form after showing success
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ fullName: '', email: '', phone: '' });
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error submitting waitlist:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ fullName: '', email: '', phone: '' });
      setIsSubmitted(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0c] p-8 shadow-2xl"
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

            {isSubmitted ? (
              <motion.div
                className="py-8 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="mb-4 text-5xl">✓</div>
                <h3
                  className="mb-2 text-2xl font-bold text-white"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  You're on the list
                </h3>
                <p className="text-white">We'll be in touch soon.</p>
              </motion.div>
            ) : (
              <>
                <h2
                  className="mb-2 text-3xl font-bold text-white"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  Join the Waitlist
                </h2>
                <p className="mb-6 text-white">
                  Be the first to know when ISO launches.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-1 block text-sm font-medium text-white"
                    >
                      Full Name <span className="text-white/60">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 transition-colors focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-sm font-medium text-white"
                    >
                      Email <span className="text-white/60">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 transition-colors focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1 block text-sm font-medium text-white"
                    >
                      Phone Number{' '}
                      <span className="text-white/60">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 transition-colors focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <p className="text-xs text-white">
                    We'll only use this to keep you updated about ISO.
                  </p>

                  {error && (
                    <div className="rounded-xl bg-red-500/20 border border-red-500/50 px-4 py-3 text-sm text-red-200">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-white py-3 text-lg font-semibold text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
              className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0c] p-8 shadow-2xl"
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

/**
 * CTA Buttons Row
 */
function CTAButtonsRow({
  onWaitlistClick,
  onPilotClick,
}: {
  onWaitlistClick: () => void;
  onPilotClick: () => void;
}) {
  // Temporarily suppress the application button - can be re-enabled by setting to true
  const SHOW_PILOT_BUTTON = false;
  
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <CTAButton variant="primary" onClick={onWaitlistClick}>
        Join the Waitlist
      </CTAButton>
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

export function EventSplashPage() {
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [showPilotModal, setShowPilotModal] = useState(false);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: '#030305' }}
    >
      {/* Navigation Bar */}
      <SplashNavigation />

      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        {/* Radial gradient vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 0%, #030305 70%)',
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
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
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

          {/* Event Reference */}
          <motion.p
            className="mb-4 text-lg uppercase tracking-[0.3em] text-white font-bold"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            ISO • 2026
          </motion.p>

          {/* Mission Statement */}
          <motion.p
            className="mb-12 text-sm sm:text-base md:text-lg uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold px-4 text-center"
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
            A FAITH-DRIVEN DEVELOPMENTAL MOVEMENT AND PROGRESS-FOCUSED LIFESTYLE BRAND BUILT TO
            <br />
            INSPIRE AMBITION, ELEVATE TALENT, AND REBUILD COMMUNITY PATHWAYS TO SUCCESS.
          </motion.p>

          {/* CTA Section */}
          <motion.div
            className="mb-12 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <CTAButtonsRow
              onWaitlistClick={() => setShowWaitlistModal(true)}
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
        className="absolute bottom-4 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <p className="text-xs text-white/70">
          © {new Date().getFullYear()} ISO Institute. All rights reserved.
        </p>
      </motion.footer>

      {/* Modals */}
      <WaitlistModal
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
      />
      <PilotInfoModal
        isOpen={showPilotModal}
        onClose={() => setShowPilotModal(false)}
      />
    </div>
  );
}

export default EventSplashPage;
