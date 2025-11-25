import * as React from 'react';
import { motion } from 'motion/react';
import { Map, Users, Phone, Zap } from 'lucide-react';

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

  const nodes = [
    { 
      id: 1, 
      label: 'Choose Pathway', 
      subtext: 'Career, Spiritual, or Personal',
      icon: Map,
    },
    { 
      id: 2, 
      label: 'Select Coach', 
      subtext: 'Match with your mentor',
      icon: Users,
    },
    { 
      id: 3, 
      label: 'Call an ISO', 
      subtext: 'Begin your journey',
      icon: Phone,
    },
    { 
      id: 4, 
      label: 'Change Your Life', 
      subtext: 'Transform and grow',
      icon: Zap,
    }
  ];

  return (
    <section 
      className="min-h-screen relative overflow-hidden pt-32 pb-16 px-4"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(255, 107, 53, 0.05) 0%, #0a0a0a 70%)',
      }}
    >
      {/* Top Section - Text Content */}
      <div className="max-w-4xl mx-auto text-center mb-16 z-10 relative">
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <img 
            src="/ISO-logo-v2.jpg" 
            alt="ISO Institute Logo" 
            className="h-24 md:h-28 lg:h-32 w-auto object-contain"
          />
        </motion.div>

        {/* Large Heading */}
        <motion.h1 
          className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white leading-tight tracking-tight mb-6"
          style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 'bold', lineHeight: '1.2' }}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          ISO Institute
        </motion.h1>

        {/* Subheading */}
        <motion.h2 
          className="text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-relaxed mb-6"
          style={{ fontFamily: "'Poppins', sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          You're not lost — you're just <span className="text-orange-500 font-semibold">In Search Of</span>.
        </motion.h2>

        {/* Description */}
        <motion.p 
          className="text-lg md:text-xl lg:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-8"
          style={{ fontFamily: "'Poppins', sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          At ISO, your defender becomes your coach. The ISO Institute is a faith-driven coaching movement rooted in authentic community uplift and empowerment. Inspired by basketball culture, ISO makes professional coaching relatable, human, and culturally grounded.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
      </div>

      {/* Bottom Section - Horizontal Flow Diagram */}
      <div 
        className="relative w-full max-w-7xl mx-auto"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '40px',
          padding: '60px 20px',
          flexWrap: 'wrap'
        }}
      >
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <React.Fragment key={node.id}>
              {/* Diagram Card */}
              <motion.div
                className="bg-white/5 backdrop-blur-[10px] border border-orange-500/30 rounded-2xl p-8 text-center min-w-[220px] max-w-[250px] flex-1"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 40px rgba(255, 107, 53, 0.1)',
                }}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.8,
                  delay: 1 + index * 0.15,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(255, 107, 53, 0.2)',
                }}
              >
                <motion.div
                  className="flex justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon className="w-10 h-10 text-orange-500" />
                </motion.div>
                <h3 
                  className="text-white font-bold text-lg mb-2" 
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {node.label}
                </h3>
                <p 
                  className="text-slate-400 text-sm" 
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {node.subtext}
                </p>
              </motion.div>

              {/* Animated Arrow (not after last card) */}
              {index < nodes.length - 1 && (
                <motion.div
                  className="flex items-center justify-center"
                  style={{ minWidth: '60px' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 1.2 + index * 0.15,
                  }}
                >
                  <svg
                    width="60"
                    height="20"
                    viewBox="0 0 60 20"
                    className="overflow-visible"
                  >
                    {/* Animated dashed line */}
                    <motion.line
                      x1="0"
                      y1="10"
                      x2="50"
                      y2="10"
                      stroke="#FF6B35"
                      strokeWidth="2"
                      strokeDasharray="8 4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ 
                        pathLength: 1, 
                        opacity: 0.6,
                        strokeDashoffset: [0, -12]
                      }}
                      transition={{
                        pathLength: { duration: 1, delay: 1.2 + index * 0.15 },
                        opacity: { duration: 0.8, delay: 1.2 + index * 0.15 },
                        strokeDashoffset: {
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear",
                          delay: 2 + index * 0.15
                        }
                      }}
                    />
                    {/* Arrow head */}
                    <motion.polygon
                      points="50,5 60,10 50,15"
                      fill="#FF6B35"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.8 }}
                      transition={{
                        duration: 0.6,
                        delay: 1.5 + index * 0.15
                      }}
                    />
                    {/* Animated dot */}
                    <motion.circle
                      r="3"
                      fill="#FF6B35"
                      cx="0"
                      cy="10"
                      animate={{
                        cx: [0, 50],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 2.5 + index * 0.15
                      }}
                    />
                  </svg>
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Background gradient effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -right-24 -top-24 h-96 w-96 bg-orange-500/10 blur-[140px]" />
        <div className="absolute left-1/4 top-1/3 h-72 w-72 bg-cyan-500/5 blur-[160px]" />
      </div>
    </section>
  );
}
