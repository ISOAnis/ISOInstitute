import * as React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Heart, Handshake, ArrowUpRight, Users, Briefcase, MapPin, Shield, Settings, DollarSign } from 'lucide-react';

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

  const [activeTab, setActiveTab] = React.useState<'players' | 'coaches'>('players');

  const playerNodes = [
    { 
      id: 1, 
      label: 'Real Connections, Real Responses', 
      subtext: 'Still getting ghosted? Stop wasting time on cold outreach. ISO guarantees aresponse from a coach in your field of interest.',
      icon: MessageSquare,
    },
    { 
      id: 2, 
      label: 'Faith-Driven Guidance', 
      subtext: 'At ISO, you will work with coaches who are committed to the game and who are here to serve, not sell.',
      icon: Heart,
    },
    { 
      id: 3, 
      label: 'Community Support', 
      subtext: "Join a network of peers on the same journey. Grow together, not alone.",
      icon: Handshake,
    },
    { 
      id: 8, 
      label: 'Accessible Coaching', 
      subtext: 'Access expert guidance without breaking the bank. Built for students and young professionals.',
      icon: DollarSign,
    },
  ];

  const coachNodes = [
    { 
      id: 4, 
      label: 'Build Through Service', 
      subtext: 'ISO helps you build a meaningful brand and attract opportunities through genuine service, not performative self-promotion.',
      icon: ArrowUpRight,
    },
    { 
      id: 5, 
      label: 'Local Impact', 
      subtext: 'Make real change in your community. Instead of broadcasting to millions, focus on deep, authentic, and local community impact.',
      icon: MapPin,
    },
    { 
      id: 6, 
      label: 'Faith-Aligned Platform', 
      subtext: 'Connect with mentees who share your values. Be compensated fairly for genuine, purpose-driven coaching.',
      icon: Shield,
    },
    { 
      id: 7, 
      label: 'Streamlined Tools', 
      subtext: 'Manage sessions, track progress, and focus on what matters - transforming lives, not admin work.',
      icon: Settings,
    }
  ];

  const nodes = activeTab === 'players' ? playerNodes : coachNodes;
  const [hoveredCard, setHoveredCard] = React.useState<number | null>(null);
  const defaultIconState = { scale: 1, y: 0, rotate: 0 };
  const iconAnimationMap: Record<number, { animate: any; transition: any }> = {
    1: {
      animate: { y: [0, -4, 0], scale: [1, 1.05, 1] },
      transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
    },
    2: {
      animate: { scale: [1, 1.15, 1] },
      transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
    },
    3: {
      animate: { rotate: [0, -5, 5, 0] },
      transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
    },
    4: {
      animate: { x: [0, 6, 0], y: [0, -6, 0], scale: [1, 1.08, 1] },
      transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
    },
    5: {
      animate: { scale: [1, 1.1, 1], y: [0, -3, 0] },
      transition: { duration: 1.3, repeat: Infinity, ease: 'easeInOut' },
    },
    6: {
      animate: { rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] },
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
    },
    7: {
      animate: { rotate: [0, 360] },
      transition: { duration: 3, repeat: Infinity, ease: 'linear' },
    },
    8: {
      animate: { scale: [1, 1.12, 1], y: [0, -2, 0] },
      transition: { duration: 1.1, repeat: Infinity, ease: 'easeInOut' },
    },
  };

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
          The ISO Institute is a faith-driven coaching platform rooted in community uplift and empowerment. Inspired by basketball, ISO makes professional coaching relatable, human, and culturally grounded. ISO offers 6 pathways of growth and development in your field of interest.
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

      {/* Why ISO Section */}
      <div className="relative w-full max-w-6xl mx-auto mb-8 z-10">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-white text-center mb-12"
          style={{ fontFamily: "'Poppins', sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          Why ISO?
        </motion.h2>
          </div>

      {/* Bottom Section - Why ISO Benefit Cards */}
      <motion.div 
        className="relative w-full max-w-6xl mx-auto flex flex-wrap justify-center items-stretch gap-6 z-10"
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <motion.div
              key={node.id}
              className="benefit-card bg-white/5 backdrop-blur-[10px] border border-orange-500/30 rounded-2xl text-center"
              style={{
                padding: '30px 26px',
                width: 'calc(25% - 18px)',
                minWidth: '240px',
                minHeight: '280px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 40px rgba(255, 107, 53, 0.1)',
              }}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ 
                scale: 1.04,
                y: -6,
                boxShadow: '0 18px 40px rgba(0, 0, 0, 0.4), 0 0 70px rgba(255, 107, 53, 0.3)',
                borderColor: 'rgba(255, 107, 53, 0.7)',
                background: 'rgba(255, 255, 255, 0.06)',
              }}
              onMouseEnter={() => setHoveredCard(node.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <motion.div
                style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', flexShrink: 0 }}
                animate={hoveredCard === node.id ? iconAnimationMap[node.id].animate : defaultIconState}
                transition={hoveredCard === node.id ? iconAnimationMap[node.id].transition : { duration: 0.2 }}
              >
                <Icon size={36} color="#FF6B35" strokeWidth={2} />
              </motion.div>
              <h3 
                className="text-white font-semibold"
                style={{ 
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1.25rem',
                  margin: '12px 0 10px 0',
                  lineHeight: 1.3,
                }}
              >
                {node.label}
              </h3>
              <p 
                style={{ 
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '0.92rem',
                  color: '#b8b8b8',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {node.subtext}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Tab System - Below Cards */}
      <div className="relative w-full max-w-6xl mx-auto mt-16 z-10 flex justify-center">
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-[10px] border border-orange-500/30 rounded-xl p-1">
          <motion.button
            onClick={() => setActiveTab('players')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
              activeTab === 'players'
                ? 'bg-orange-500 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
            whileHover={{ scale: activeTab === 'players' ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Users size={18} />
            For Players
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('coaches')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
              activeTab === 'coaches'
                ? 'bg-orange-500 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
            whileHover={{ scale: activeTab === 'coaches' ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Briefcase size={18} />
            For Coaches
          </motion.button>
        </div>
      </div>

      {/* Background gradient effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -right-24 -top-24 h-96 w-96 bg-orange-500/10 blur-[140px]" />
        <div className="absolute left-1/4 top-1/3 h-72 w-72 bg-cyan-500/5 blur-[160px]" />
    </div>
    </section>
  );
}
