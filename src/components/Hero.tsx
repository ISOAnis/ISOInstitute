import * as React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Moon, Dumbbell, Activity, Settings, Rocket, Globe } from 'lucide-react';

interface HeroProps {
  onNavigate?: (page: 'home' | 'pathways' | 'about' | 'community') => void;
}

export function Hero({ onNavigate }: HeroProps = {}) {
  const scrollToCourt = () => {
    const courtSection = document.getElementById('iso-court');
    if (courtSection) {
      courtSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Pathway icons that will orbit - matching basketball court icons
  const pathwayIcons = [
    { Icon: Moon, color: '#10b981', name: 'Deen & Purpose' }, // emerald/teal
    { Icon: Dumbbell, color: '#ef4444', name: 'Health & Fitness' }, // red/rose
    { Icon: Activity, color: '#3b82f6', name: 'Medicine & Healthcare' }, // blue/cyan
    { Icon: Settings, color: '#a855f7', name: 'Engineering & Technology' }, // purple/indigo
    { Icon: Rocket, color: '#f97316', name: 'Entrepreneurship & Business' }, // orange/amber
    { Icon: Globe, color: '#6366f1', name: 'Global Affairs & Business' }, // indigo/blue
  ];

  return (
    <section 
      className="relative overflow-hidden min-h-screen flex items-center px-4 py-20"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 1) 100%)',
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
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-orange-500/30 bg-slate-950/60 backdrop-blur-md text-white text-base font-medium hover:border-orange-500/50 hover:bg-slate-950/80 transition-all"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Welcome to ISO Institute
                <ArrowRight size={16} className="opacity-70" />
              </button>
        </motion.div>

            {/* Main Heading */}
        <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight"
              style={{ 
                fontFamily: "'Poppins', sans-serif", 
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
                  background: 'linear-gradient(90deg, #f97316, #fb923c, #3b82f6, #60a5fa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                In Search Of
              </span>
        </motion.h1>

        {/* Description */}
        <motion.p 
              className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl"
          style={{ fontFamily: "'Poppins', sans-serif" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              The ISO Institute is a faith-rooted cultural movement designed to inspire ambition, elevate overlooked talent, and rebuild community pathways to success.
        </motion.p>

            {/* CTA Button with Flowing Border */}
            <motion.div
              className="relative inline-flex rounded-full"
              style={{ padding: '1px' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
                onClick={scrollToCourt}
                className="relative px-6 py-3 rounded-full text-white text-base font-semibold transition-all z-10"
                style={{ 
                  fontFamily: "'Poppins', sans-serif",
                  background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, rgba(249, 115, 22, 0.3), rgba(59, 130, 246, 0.25))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))';
                }}
              >
                Get Started
              </button>
            </motion.div>
          </div>

          {/* RIGHT SIDE - Static 3D Basketball with Orbiting Icons */}
          <motion.div 
            className="relative flex items-center justify-center h-[500px] lg:h-[600px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="relative" style={{ width: '256px', height: '256px', perspective: '1000px' }}>
              {/* Static 3D Basketball Wireframe */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  transformStyle: 'preserve-3d',
                  background: 'transparent',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  transform: 'translateZ(0)',
                  boxShadow: `
                    inset 0 0 80px rgba(255, 255, 255, 0.1),
                    inset -30px -30px 60px rgba(0, 0, 0, 0.3),
                    inset 30px 30px 60px rgba(255, 255, 255, 0.08)
                  `,
                }}
              >
                {/* Basketball wireframe lines - Clean standard pattern */}
                <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Vertical center line */}
                  <line 
                    x1="50" y1="0" x2="50" y2="100" 
                    stroke="#ffffff" 
                    strokeWidth="1.5" 
                    opacity="0.8"
                    strokeLinecap="round"
                  />
                  {/* Horizontal center line */}
                  <line 
                    x1="0" y1="50" x2="100" y2="50" 
                    stroke="#ffffff" 
                    strokeWidth="1.5" 
                    opacity="0.8"
                    strokeLinecap="round"
                  />
                  {/* Curved lines for basketball pattern */}
                  <path 
                    d="M 20 10 Q 50 50 20 90" 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="1.5" 
                    opacity="0.8"
                    strokeLinecap="round"
                  />
                  <path 
                    d="M 80 10 Q 50 50 80 90" 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="1.5" 
                    opacity="0.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              
              {/* Subtle 3D depth effect */}
              <div 
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.12) 0%, transparent 70%)',
                  mixBlendMode: 'overlay',
                }}
              />

              {/* 3D Orbit Container */}
              <motion.div
                className="absolute inset-0"
                style={{ 
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  rotateY: [0, 360],
                  rotateX: [15, 15],
                }}
                transition={{
                  rotateY: {
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
              >
                {/* Orbiting Pathway Icons - positioned in 3D space with fade behind ball */}
                {pathwayIcons.map((pathway, index) => {
                  const angle = (index * 60) * (Math.PI / 180); // 60 degrees apart (6 icons = 360/6)
                  const orbitRadius = 200;
                  const orbitTilt = 15 * (Math.PI / 180); // Convert to radians
                  
                  // Calculate initial 3D position
                  const initialX = Math.cos(angle) * orbitRadius;
                  const initialY = Math.sin(angle) * Math.cos(orbitTilt) * orbitRadius;
                  const initialZ = Math.sin(angle) * Math.sin(orbitTilt) * orbitRadius;
                  
                  // Create keyframes for 3D orbit with smooth fade when behind ball
                  const ballRadius = 128; // Half of 256px ball size
                  const iconRadius = 32; // Half of 64px icon size
                  
                  const orbitKeyframes = Array.from({ length: 60 }, (_, i) => {
                    const currentAngle = angle + (i / 60) * Math.PI * 2;
                    const x = Math.cos(currentAngle) * orbitRadius;
                    const y = Math.sin(currentAngle) * Math.cos(orbitTilt) * orbitRadius;
                    const z = Math.sin(currentAngle) * Math.sin(orbitTilt) * orbitRadius;
                    
                    // Calculate 3D distance from icon center to ball center
                    const distanceFromBallCenter = Math.sqrt(x * x + y * y + z * z);
                    
                    // Calculate opacity: fade when icon is behind the ball (negative z or intersecting)
                    let opacity = 1;
                    const minOpacity = 0.05; // Minimum opacity when behind ball - almost invisible
                    
                    // Check if icon is behind the ball (negative z means it's in the back)
                    // Also check if it's intersecting with the ball
                    const isBehind = z < 0 || distanceFromBallCenter < (ballRadius + iconRadius);
                    
                    if (isBehind) {
                      // Calculate how far behind/inside the ball the icon is
                      if (distanceFromBallCenter < ballRadius + iconRadius) {
                        // Icon is intersecting with ball - fade based on intersection depth
                        const intersectionDepth = (ballRadius + iconRadius) - distanceFromBallCenter;
                        const maxIntersection = iconRadius * 2;
                        const fadeProgress = Math.min(1, intersectionDepth / maxIntersection);
                        // Keep minimum opacity for depth effect
                        opacity = Math.max(minOpacity, 1 - (fadeProgress * (1 - minOpacity)));
                      } else if (z < 0) {
                        // Icon is behind the ball - fade based on z distance
                        // More negative z = more behind = more transparent
                        const behindDistance = Math.abs(z);
                        const fadeStart = 50; // Start fading 50px behind
                        const fadeRange = 100; // Fade over 100px
                        const fadeProgress = Math.min(1, (behindDistance - fadeStart) / fadeRange);
                        // Keep minimum opacity for depth effect
                        opacity = Math.max(minOpacity, 1 - (fadeProgress * (1 - minOpacity)));
                      }
                    }
                    
                    return { x, y, z, opacity };
                  });
                  
                  return (
                    <motion.div
                      key={index}
                      className="absolute"
                      style={{
                        left: '50%',
                        top: '50%',
                        marginLeft: '-32px',
                        marginTop: '-32px',
                        transformStyle: 'preserve-3d',
                      }}
                      animate={{
                        x: orbitKeyframes.map(k => k.x),
                        y: orbitKeyframes.map(k => k.y),
                        z: orbitKeyframes.map(k => k.z),
                        opacity: orbitKeyframes.map(k => k.opacity),
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <motion.div
                        className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md border-2 relative"
                        style={{
                          background: `${pathway.color}30`,
                          borderColor: `${pathway.color}80`,
                          boxShadow: `
                            0 0 20px ${pathway.color}40,
                            0 8px 24px rgba(0, 0, 0, 0.4)
                          `,
                          transformStyle: 'preserve-3d',
                        }}
                        whileHover={{ scale: 1.3 }}
                      >
                        <pathway.Icon size={28} color={pathway.color} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                      </motion.div>
            </motion.div>
          );
        })}
              </motion.div>
            </div>
      </motion.div>
        </div>
      </div>

      {/* Background gradient effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}