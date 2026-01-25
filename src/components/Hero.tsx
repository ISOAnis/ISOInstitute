import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onNavigate?: (page: 'home' | 'pathways' | 'about' | 'community') => void;
  onPlayerClick?: () => void;
  onCoachClick?: () => void;
}

export function Hero({ onNavigate, onPlayerClick, onCoachClick }: HeroProps = {}) {
  const scrollToCourt = () => {
    const courtSection = document.getElementById('iso-court');
    if (courtSection) {
      courtSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section 
      className="relative overflow-hidden min-h-screen flex items-center px-4 py-20"
      style={{
        background: '#030305',
      }}
    >
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* LEFT SIDE - Text Content */}
          <div className="text-left space-y-8">
            {/* Welcome Button */}
        <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <button
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-orange-500/30 bg-slate-950/60 backdrop-blur-md text-white text-lg font-medium hover:border-orange-500/50 hover:bg-slate-950/80 transition-all"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                Welcome to ISO Institute
                <ArrowRight size={16} className="opacity-70" />
              </button>
        </motion.div>

            {/* Main Heading */}
        <motion.h1 
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-tight tracking-tight"
              style={{ 
                fontFamily: "'Bebas Neue', sans-serif", 
                fontWeight: 'bold',
                lineHeight: '1.1',
                letterSpacing: '-0.02em'
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-white">You're Not Lost,</span>
              <br />
              <span className="text-white">You're Just </span>
              <span 
                className="inline-block"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #a8a8a8 40%, #d0d0d0 60%, #ffffff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 40px rgba(255, 255, 255, 0.2)',
                }}
              >
                In Search Of
              </span>
        </motion.h1>

        {/* Description */}
        <motion.p 
              className="text-xl md:text-2xl leading-relaxed max-w-xl"
          style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: "'Bebas Neue', sans-serif" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              The ISO Institute is a faith-rooted cultural movement designed to inspire ambition, elevate overlooked talent, and rebuild community pathways to success.
        </motion.p>

            {/* CTA Buttons with Flowing Border */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* For Players Button */}
              <motion.div
                className="relative inline-flex rounded-full"
                style={{ padding: '1px' }}
              >
                {/* Animated flowing border */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #f97316, #fb923c, #3b82f6, #60a5fa, #f97316)',
                    backgroundSize: '200% 100%',
                  }}
                  animate={{ 
                    backgroundPosition: ['0% 50%', '200% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                
                {/* Glow effect */}
                <motion.div
                  className="absolute -inset-2 rounded-full blur-xl -z-10"
                  style={{ 
                    background: 'linear-gradient(90deg, #f97316, #3b82f6)',
                  }}
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                <button
                  onClick={() => onPlayerClick?.()}
                  className="relative px-6 py-3 rounded-full text-white text-base font-semibold transition-all z-10"
                  style={{ 
                    fontFamily: "'Bebas Neue', sans-serif",
                    background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(90deg, rgba(249, 115, 22, 0.3), rgba(59, 130, 246, 0.25))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(90deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))';
                  }}
                >
                  for players
                </button>
              </motion.div>

              {/* For Coaches Button */}
              <motion.div
                className="relative inline-flex rounded-full"
                style={{ padding: '1px' }}
              >
                {/* Animated flowing border */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #f97316, #fb923c, #3b82f6, #60a5fa, #f97316)',
                    backgroundSize: '200% 100%',
                  }}
                  animate={{ 
                    backgroundPosition: ['0% 50%', '200% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                
                {/* Glow effect */}
                <motion.div
                  className="absolute -inset-2 rounded-full blur-xl -z-10"
                  style={{ 
                    background: 'linear-gradient(90deg, #f97316, #3b82f6)',
                  }}
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                <button
                  onClick={() => onCoachClick?.()}
                  className="relative px-6 py-3 rounded-full text-white text-base font-semibold transition-all z-10"
                  style={{ 
                    fontFamily: "'Bebas Neue', sans-serif",
                    background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(90deg, rgba(249, 115, 22, 0.3), rgba(59, 130, 246, 0.25))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(90deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))';
                  }}
                >
                  for coaches
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT SIDE - ISO Logo */}
          <motion.div 
            className="relative flex items-center justify-center w-full h-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <img 
              src="/ISO OFFICIAL.png" 
              alt="ISO" 
              className="w-full h-auto max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] object-contain"
            />
      </motion.div>
        </div>
      </div>

      {/* Background gradient effects - Monochrome */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-3xl" />
      </div>
    </section>
  );
}