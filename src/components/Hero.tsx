import * as React from 'react';
import { motion } from 'motion/react';

interface HeroProps {
  onNavigate?: (page: 'home' | 'pathways' | 'about' | 'community') => void;
}

export function Hero({ onNavigate }: HeroProps = {}) {
  const scrollToCourt = () => {
    const courtSection = document.getElementById('iso-court');
    if (courtSection) {
      courtSection.scrollIntoView({ behavior: 'auto' });
    }
  };

  const handleLearnHowItWorks = () => {
    const productShowcaseSection = document.getElementById('product-showcase');
    if (productShowcaseSection) {
      productShowcaseSection.scrollIntoView({ behavior: 'auto' });
    }
  };

  return (
    <section 
      className="min-h-screen bg-slate-950 pt-32 pb-16"
      style={{ 
        display: 'flex', 
        alignItems: 'center',
        paddingLeft: '80px',
        paddingRight: '80px'
      }}
    >
      <div 
        className="w-full"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '100px'
        }}
      >
        {/* Left Side: Text Content (48% width) */}
        <motion.div 
          className="space-y-8"
          style={{ 
            width: '48%',
            paddingRight: '0'
          }}
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="space-y-6">
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight tracking-tight"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 'bold', lineHeight: '1.2' }}
            >
              <motion.span 
                style={{ display: 'block' }}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                You're not lost.
              </motion.span>
              <motion.span 
                style={{ display: 'block', marginTop: '0.5rem' }}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                You're just <span className="text-orange-500 font-semibold">In Search Of</span>.
              </motion.span>
            </motion.h1>
            
            <motion.h2 
              className="text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-relaxed"
              style={{ fontFamily: "'Poppins', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              At ISO, your defender becomes your coach.
            </motion.h2>
            
            <motion.p 
              className="text-lg md:text-xl lg:text-xl text-slate-300 leading-relaxed"
              style={{ fontFamily: "'Poppins', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              The ISO Institute is a faith-driven coaching movement rooted in authentic community uplift and empowerment. Inspired by basketball culture, ISO makes professional coaching relatable, human, and culturally grounded.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.button
              onClick={scrollToCourt}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg shadow-orange-500/20"
              style={{ fontFamily: "'Poppins', sans-serif" }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Pathways
            </motion.button>
            
            <motion.button
              onClick={handleLearnHowItWorks}
              className="border-2 border-slate-600 hover:border-slate-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
              style={{ fontFamily: "'Poppins', sans-serif" }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Learn How ISO Works
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Side: Image (52% width) */}
        <motion.div 
          style={{ 
            width: '52%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'stretch',
            minHeight: '600px'
          }}
          initial={{ opacity: 0, x: 80, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div 
            className="relative" 
            style={{ width: '100%', height: '100%', maxWidth: '100%' }}
            initial={{ rotateY: -15, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div 
              className="relative rounded-2xl overflow-hidden shadow-2xl" 
              style={{ 
                boxShadow: '0 25px 50px -12px rgba(249, 115, 22, 0.3), 0 0 60px rgba(249, 115, 22, 0.1)',
                width: '100%',
                height: '100%',
                minHeight: '600px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              whileHover={{ 
                boxShadow: '0 35px 70px -12px rgba(249, 115, 22, 0.4), 0 0 80px rgba(249, 115, 22, 0.2)',
                scale: 1.02
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.img 
                src="/ChatGPT Image Nov 14, 2025, 12_50_27 AM.png" 
                alt="ISO Institute - Basketball Court with Mentorship Theme"
                style={{ 
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  objectFit: 'cover',
                  objectPosition: '42% center'
                }}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
