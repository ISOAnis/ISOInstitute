import * as React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Heart, Handshake, ArrowUpRight, Users, Briefcase, MapPin, Shield, Settings, DollarSign } from 'lucide-react';

export function WhyISO() {
  const [activeTab, setActiveTab] = React.useState<'players' | 'coaches'>('players');

  const playerNodes = [
    { 
      id: 1, 
      label: 'Real Connections, Real Responses', 
      subtext: 'Still getting ghosted? Stop wasting time on cold outreach. ISO guarantees a response from a coach in your field of interest.',
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
      label: 'Affordable Coaching', 
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
      className="relative w-full py-16"
      style={{
        background: '#030305',
      }}
    >
      {/* Why ISO Section */}
      <div className="relative w-full max-w-6xl mx-auto py-16 px-4 z-10">
        <motion.h2 
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center mb-1"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 'bold' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Why ISO?
        </motion.h2>
      </div>

      {/* Tab System - Above Cards */}
      <div className="relative w-full max-w-6xl mx-auto mb-4 z-10 flex justify-center">
        <div className="flex items-center gap-2 backdrop-blur-[10px] rounded-xl p-1" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
          <motion.button
            onClick={() => setActiveTab('players')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
              activeTab === 'players'
                ? 'bg-white text-black'
                : 'text-white hover:text-white'
            }`}
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
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
                ? 'bg-white text-black'
                : 'text-white hover:text-white'
            }`}
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            whileHover={{ scale: activeTab === 'coaches' ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Briefcase size={18} />
            For Coaches
          </motion.button>
        </div>
      </div>

      {/* Bottom Section - Why ISO Benefit Cards */}
      <motion.div 
        className="relative w-full max-w-6xl mx-auto flex flex-wrap justify-center items-stretch gap-6 z-10 pb-16"
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
              className="benefit-card backdrop-blur-[10px] rounded-2xl text-center"
              style={{
                padding: '30px 26px',
                width: 'calc(25% - 18px)',
                minWidth: '240px',
                minHeight: '280px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                background: 'linear-gradient(145deg, #0f0f0f 0%, #181818 50%, #0f0f0f 100%)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
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
                boxShadow: '0 18px 40px rgba(0, 0, 0, 0.4)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                background: 'linear-gradient(145deg, #121212 0%, #1c1c1c 50%, #121212 100%)',
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
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '1.25rem',
                  margin: '12px 0 10px 0',
                  lineHeight: 1.3,
                }}
              >
                {node.label}
              </h3>
              <p 
                style={{ 
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '0.92rem',
                  color: 'rgba(255, 255, 255, 0.7)',
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
    </section>
  );
}

