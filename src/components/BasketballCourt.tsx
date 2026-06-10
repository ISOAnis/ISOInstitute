import * as React from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { CategoryBubble } from './CategoryBubble';
import { FeatureShowcase } from './FeatureShowcase';
import { Moon, Dumbbell, Activity, Settings, Rocket, Globe, Compass, BookOpen, Users, Briefcase } from 'lucide-react';
import { getAccentColor } from './Pathways';
import { PATHWAYS, PATHWAYS_MARKETING_LIST } from '../data/pathways';

interface CommitmentStatus {
  isCommitted: boolean;
  coachName?: string;
  category?: string;
  daysRemaining?: number;
}

interface BasketballCourtProps {
  commitmentStatus?: CommitmentStatus | null;
  onNavigateToCallIso?: (coachName: string, categoryId?: string) => void;
  selectedCategoryId?: string | null;
  onCategorySelect?: (categoryId: string) => void;
  forceOpenCategoryId?: string | null;
  onForceOpenHandled?: () => void;
  onNavigateToPathways?: () => void;
}

const categoryIcons: Record<string, typeof Moon> = {
  deen: Moon,
  health: Dumbbell,
  medicine: Activity,
  engineering: Settings,
  entrepreneurship: Rocket,
  global: Globe,
};

const categoryIconNames: Record<string, string> = {
  deen: 'Moon',
  health: 'Dumbbell',
  medicine: 'Activity',
  engineering: 'Settings',
  entrepreneurship: 'Rocket',
  global: 'Globe',
};

const categoryPositions: Record<string, React.CSSProperties & { zIndex: number }> = {
  deen: { bottom: '5%', left: '50%', transform: 'translateX(-50%)', zIndex: 10 },
  health: { bottom: '8%', right: '15%', zIndex: 10 },
  medicine: { top: '15%', right: '15%', zIndex: 10 },
  engineering: { top: '10%', left: '50%', transform: 'translateX(-50%)', zIndex: 10 },
  entrepreneurship: { top: '15%', left: '15%', zIndex: 10 },
  global: { bottom: '8%', left: '15%', zIndex: 10 },
};

const categories = PATHWAYS.map((pathway) => {
  const position = categoryPositions[pathway.id];
  return {
    id: pathway.id,
    title: pathway.name,
    subtitle: pathway.legacyName,
    icon: categoryIcons[pathway.id],
    iconName: categoryIconNames[pathway.id],
    description: pathway.description,
    tagline: pathway.tagline,
    color: pathway.color,
    position,
    zIndex: position.zIndex,
  };
});

export function BasketballCourt({ commitmentStatus, onNavigateToCallIso, selectedCategoryId, onCategorySelect, forceOpenCategoryId, onForceOpenHandled, onNavigateToPathways }: BasketballCourtProps) {
  const [mode, setMode] = useState<'explore' | 'learn'>('explore');
  const [role, setRole] = useState<'players' | 'coaches'>('players');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const isPinnedRef = useRef(false);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepsContainerRef = useRef<HTMLDivElement | null>(null);
  const learnSectionRef = useRef<HTMLDivElement | null>(null);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [lockedBubblePosition, setLockedBubblePosition] = useState<{ x: number; y: number } | null>(null);
  const courtContainerRef = React.useRef<HTMLDivElement>(null);

  const playerSteps = [
    {
      number: '01',
      question: 'CHOOSE YOUR PATHWAY',
      heading: 'Navigate the Court',
      description: `Explore six pathways of growth and select the area that aligns with your goals. From ${PATHWAYS_MARKETING_LIST}, find your starting point.`,
    },
    {
      number: '02',
      question: 'CALL AN ISO',
      heading: 'Connect with Your Coach',
      description: 'Browse coach profiles, read their stories, and connect with a coach who understands your journey. Schedule your first session and begin your coacheship.',
    },
    {
      number: '03',
      question: 'GET BUCKETS & WIN GAMES',
      heading: 'Score Your Goals',
      description: 'Complete tasks, achieve milestones, and track your progress. Your coach sets personalized goals and helps you execute with accountability.',
    },
    {
      number: '04',
      question: 'LEVEL UP',
      heading: 'Grow Continuously',
      description: 'Unlock new opportunities, build your network, and keep moving up—your growth journey never stops.',
    },
  ];

  const coachSteps = [
    {
      number: '01',
      question: 'ACCEPT ISOs',
      heading: 'Review Coacheship Requests',
      description: 'Players in your pathway reach out. Understand their goals and accept coacheship requests that align with your expertise.',
    },
    {
      number: '02',
      question: 'SET BUCKETS & GOALS',
      heading: 'Create Structured Plans',
      description: 'Design personalized development plans for your players. Set milestones, assignments, and track progress in one place.',
    },
    {
      number: '03',
      question: 'BUILD YOUR REP',
      heading: 'Grow Your Brand',
      description: 'Share wins, join events, and post inside the community. Build a reputation through genuine service and consistent value.',
    },
    {
      number: '04',
      question: 'GRADUATE YOUR STUDENT',
      heading: 'Celebrate Milestones',
      description: 'Watch your players grow, celebrate their wins, and prep them for the next level before taking on new ISOs.',
    },
  ];

  const currentSteps = role === 'players' ? playerSteps : coachSteps;
  
  // Ensure cursor is always hidden on court container
  useEffect(() => {
    if (courtContainerRef.current) {
      const container = courtContainerRef.current;
      container.style.cursor = 'none';
      
      // Add cursor: none to all children
      const allChildren = container.querySelectorAll('*');
      allChildren.forEach((child) => {
        (child as HTMLElement).style.cursor = 'none';
      });
      
      // Watch for new elements and apply cursor: none
      const observer = new MutationObserver(() => {
        const newChildren = container.querySelectorAll('*');
        newChildren.forEach((child) => {
          (child as HTMLElement).style.cursor = 'none';
        });
      });
      
      observer.observe(container, { childList: true, subtree: true });
      
      return () => observer.disconnect();
    }
  }, []);
  

  // Add staggered bounce animation for arrows and tracing line animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes staggered-bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(-5px);
        }
      }
      
      .court-arrow-1 {
        animation: staggered-bounce 1.5s ease-in-out 0s infinite;
      }
      
      .court-arrow-2 {
        animation: staggered-bounce 1.5s ease-in-out 0.2s infinite;
      }
      
      .court-arrow-3 {
        animation: staggered-bounce 1.5s ease-in-out 0.4s infinite;
      }
      
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Clickability removed - court is now visual only
  // Coach selection moved to Pathways page
  const handleCategoryClick = (category: typeof categories[0]) => {
    // No-op: Bubbles are no longer clickable
    // All coach selection now happens on Pathways page
  };

  // Reset learn mode step when toggles change
  useEffect(() => {
    setActiveStep(0);
    stepRefs.current = [];
  }, [mode, role]);

  // Scroll pinning and step tracking for learn mode
  useEffect(() => {
    if (mode !== 'learn') {
      setScrollProgress(0);
      setActiveStep(0);
      setIsPinned(false);
      isPinnedRef.current = false;
      return;
    }

    const section = learnSectionRef.current;
    const container = stepsContainerRef.current;
    if (!section || !container) return;

    let pinnedScrollY = 0;
    let isHandlingWheel = false;
    let scrollLockRaf: number | null = null;

    const handleWheel = (e: WheelEvent) => {
      if (!isPinnedRef.current) return;

      const currentScroll = container.scrollTop || 0;
      const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
      
      // If container is at bottom and scrolling down, allow page to scroll normally
      if (currentScroll >= maxScroll - 10 && e.deltaY > 0) {
        // Unpin and allow normal scroll
        isPinnedRef.current = false;
        setIsPinned(false);
        pinnedScrollY = 0;
        return; // Let the scroll event pass through
      }
      
      // If container is at top and scrolling up, allow page to scroll back
      if (currentScroll <= 10 && e.deltaY < 0) {
        // Don't unpin immediately - let user scroll up to exit the section
        // Just allow the scroll to pass through
        return; // Let the scroll event pass through to window
      }

      // When pinned and container has room to scroll, convert scroll to container
      e.preventDefault();
      e.stopPropagation();
      
      isHandlingWheel = true;
      
      const scrollDelta = e.deltaY;
      const newScroll = Math.max(0, Math.min(maxScroll, currentScroll + scrollDelta));
      
      // Apply scroll to container
      container.scrollTop = newScroll;
      
      // Lock window scroll position
      if (scrollLockRaf !== null) {
        cancelAnimationFrame(scrollLockRaf);
      }
      
      scrollLockRaf = requestAnimationFrame(() => {
        if (pinnedScrollY > 0 && Math.abs(window.scrollY - pinnedScrollY) > 2) {
          window.scrollTo(0, pinnedScrollY);
        }
        isHandlingWheel = false;
      });
    };

    const handleContainerScroll = () => {
      if (!container || isHandlingWheel) return;

      const scrollTop = container.scrollTop;
      const maxScroll = container.scrollHeight - container.clientHeight;
      const progress = maxScroll > 0 ? Math.max(0, Math.min(1, scrollTop / maxScroll)) : 0;
      setScrollProgress(progress);

      // Determine active step
      const containerRect = container.getBoundingClientRect();
      const viewportCenter = containerRect.top + container.clientHeight * 0.3;
      
      let newActive = 0;
      stepRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const stepCenter = rect.top + rect.height / 2;
          if (Math.abs(stepCenter - viewportCenter) < Math.abs((stepRefs.current[newActive]?.getBoundingClientRect().top || 0) + (stepRefs.current[newActive]?.getBoundingClientRect().height || 0) / 2 - viewportCenter)) {
            newActive = index;
          }
        }
      });
      
      setActiveStep(newActive);

      // Unpin if we've scrolled past all steps (progress is 1 or very close)
      if (progress >= 0.95 && isPinnedRef.current) {
        isPinnedRef.current = false;
        setIsPinned(false);
        // Reset pinned scroll position to allow normal scrolling
        pinnedScrollY = 0;
      }
    };

    // Check pinning status on scroll
    const handleWindowScroll = () => {
      if (isHandlingWheel) return;
      
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      const windowHeight = window.innerHeight;

      // Pin when section top reaches top of viewport
      const shouldBePinned = sectionTop <= 0 && sectionBottom > windowHeight;
      
      if (shouldBePinned && !isPinnedRef.current) {
        isPinnedRef.current = true;
        setIsPinned(true);
        pinnedScrollY = window.scrollY;
        // Immediately lock position
        window.scrollTo(0, pinnedScrollY);
      } else if (!shouldBePinned && isPinnedRef.current) {
        // Unpin if we've scrolled past
        isPinnedRef.current = false;
        setIsPinned(false);
        pinnedScrollY = 0;
      } else if (isPinnedRef.current && pinnedScrollY > 0 && Math.abs(window.scrollY - pinnedScrollY) > 2) {
        // Maintain locked position only if we have a valid pinned position
        window.scrollTo(0, pinnedScrollY);
      }
    };

    // Initial check
    setTimeout(() => {
      handleWindowScroll();
      handleContainerScroll();
    }, 100);

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    window.addEventListener('resize', handleWindowScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('scroll', handleContainerScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
      window.removeEventListener('resize', handleWindowScroll);
      window.removeEventListener('wheel', handleWheel);
      container.removeEventListener('scroll', handleContainerScroll);
      if (scrollLockRaf !== null) {
        cancelAnimationFrame(scrollLockRaf);
      }
    };
  }, [mode, role]);

  return (
    <>
      <section 
        id="iso-court" 
        className="pt-8 pb-20 px-4 sm:px-6 lg:px-8"
        style={{
          background: '#030305',
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Title above court */}
          <h2 
            style={{ 
              fontSize: '3.75rem', 
              fontWeight: 'bold', 
              color: 'white',
              fontFamily: 'Bebas Neue, sans-serif',
              textAlign: 'center',
              maxWidth: '1280px',
              margin: '0 auto 40px auto',
              padding: '40px 60px',
              borderRadius: '24px',
              background: 'linear-gradient(145deg, #0f0f0f 0%, #181818 50%, #0f0f0f 100%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(255, 255, 255, 0.02)'
            }}
          >
            {/* Animated gradient overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 50%)',
                pointerEvents: 'none',
                zIndex: 0,
                animation: 'pulse 4s ease-in-out infinite'
              }}
            />
            <span style={{ position: 'relative', zIndex: 1 }}>
            The court is not the end, it's the <span style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #a8a8a8 40%, #d0d0d0 60%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>beginning</span>.
            </span>
            <style>
              {`
                @keyframes pulse {
                  0%, 100% {
                    opacity: 1;
                    transform: scale(1);
                  }
                  50% {
                    opacity: 0.7;
                    transform: scale(1.05);
                  }
                }
              `}
            </style>
          </h2>

          {/* Mode Toggle */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="flex items-center gap-2 backdrop-blur-[10px] rounded-xl p-1" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
              <motion.button
                onClick={() => setMode('explore')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  mode === 'explore'
                    ? 'bg-white text-black'
                    : 'text-white hover:text-white'
                }`}
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                whileHover={{ scale: mode === 'explore' ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Compass size={18} />
                Explore Pathways
              </motion.button>
              <motion.button
                onClick={() => setMode('learn')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  mode === 'learn'
                    ? 'bg-white text-black'
                    : 'text-white hover:text-white'
                }`}
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                whileHover={{ scale: mode === 'learn' ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <BookOpen size={18} />
                Learn How ISO Works
              </motion.button>
            </div>

            {mode === 'learn' && (
              <div className="flex items-center gap-2 backdrop-blur-[10px] rounded-xl p-1" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                <motion.button
                  onClick={() => setRole('players')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    role === 'players'
                      ? 'bg-white text-black'
                      : 'text-white hover:text-white'
                  }`}
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  whileHover={{ scale: role === 'players' ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Users size={18} />
                  For Players
                </motion.button>
                <motion.button
                  onClick={() => setRole('coaches')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    role === 'coaches'
                      ? 'bg-white text-black'
                      : 'text-white hover:text-white'
                  }`}
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  whileHover={{ scale: role === 'coaches' ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Briefcase size={18} />
                  For Coaches
                </motion.button>
              </div>
            )}
          </div>

          {mode === 'explore' ? (
            <div className="pathways-showcase" style={{
              display: 'grid',
              gridTemplateColumns: '45% 55%',
              gap: '40px',
              alignItems: 'start',
              width: '100%',
              maxWidth: '1400px',
              margin: '0 auto'
            }}>
            
            {/* LEFT: Basketball Court - Smaller */}
             <div 
               ref={courtContainerRef}
               className="basketball-court-container" 
               style={{
                 width: '100%',
                 height: '500px',
                 position: 'relative',
                 overflow: 'hidden',
                 cursor: 'none', // Hide default cursor
                 pointerEvents: 'auto', // Ensure clicks work
               }}
               onClick={(e) => {
                 // Allow clicks to pass through if not on a bubble
                 // Don't prevent default - let bubbles handle their own clicks
               }}
               onMouseMove={(e) => {
                if (!courtContainerRef.current) return;
                const rect = courtContainerRef.current.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                setMousePosition({ x: mouseX, y: mouseY });
                
                // Check proximity to bubbles for lock-on
                let closestCategory: typeof categories[0] | null = null;
                let closestDistance = Infinity;
                const lockOnRadius = 100; // pixels
                
                categories.forEach((category) => {
                  const categoryPos = category.position;
                  let categoryX = 0;
                  let categoryY = 0;
                  
                  // Calculate category position in pixels
                  if ('left' in categoryPos && typeof categoryPos.left === 'string') {
                    categoryX = (parseFloat(categoryPos.left.replace('%', '')) / 100) * rect.width;
                  } else if ('right' in categoryPos && typeof categoryPos.right === 'string') {
                    const rightPercent = parseFloat((categoryPos.right as string).replace('%', ''));
                    categoryX = ((100 - rightPercent) / 100) * rect.width;
                  }
                  
                  if ('top' in categoryPos && typeof categoryPos.top === 'string') {
                    categoryY = (parseFloat(categoryPos.top.replace('%', '')) / 100) * rect.height;
                  } else if ('bottom' in categoryPos && typeof categoryPos.bottom === 'string') {
                    const bottomPercent = parseFloat((categoryPos.bottom as string).replace('%', ''));
                    categoryY = ((100 - bottomPercent) / 100) * rect.height;
                  }
                  
                  const distance = Math.sqrt(
                    Math.pow(mouseX - categoryX, 2) +
                    Math.pow(mouseY - categoryY, 2)
                  );
                  
                  if (distance < closestDistance && distance < lockOnRadius) {
                    closestDistance = distance;
                    closestCategory = category;
                  }
                });
                
                if (closestCategory && closestCategory.id !== hoveredCategoryId) {
                  setHoveredCategoryId(closestCategory.id);
                  // Calculate bubble position for lock-on
                  const categoryPos = closestCategory.position;
                  let categoryX = 0;
                  let categoryY = 0;
                  
                  if ('left' in categoryPos && typeof categoryPos.left === 'string') {
                    categoryX = (parseFloat(categoryPos.left.replace('%', '')) / 100) * rect.width;
                  } else if ('right' in categoryPos && typeof categoryPos.right === 'string') {
                    const rightPercent = parseFloat((categoryPos.right as string).replace('%', ''));
                    categoryX = ((100 - rightPercent) / 100) * rect.width;
                  }
                  
                  if ('top' in categoryPos && typeof categoryPos.top === 'string') {
                    categoryY = (parseFloat(categoryPos.top.replace('%', '')) / 100) * rect.height;
                  } else if ('bottom' in categoryPos && typeof categoryPos.bottom === 'string') {
                    const bottomPercent = parseFloat((categoryPos.bottom as string).replace('%', ''));
                    categoryY = ((100 - bottomPercent) / 100) * rect.height;
                  }
                  
                  setLockedBubblePosition({ x: categoryX, y: categoryY });
                } else if (!closestCategory && hoveredCategoryId) {
                  // Clear lock if mouse moves away from all bubbles
                  setHoveredCategoryId(null);
                  setLockedBubblePosition(null);
                }
              }}
              onMouseLeave={() => {
                // Don't clear mousePosition immediately - keep ball visible briefly
                setTimeout(() => {
                  setMousePosition(null);
                  setHoveredCategoryId(null);
                  setLockedBubblePosition(null);
                }, 100);
              }}
              onMouseEnter={() => {
                // Ensure cursor is hidden when entering
                if (courtContainerRef.current) {
                  courtContainerRef.current.style.cursor = 'none';
                }
              }}
            >
              {/* Basketball cursor - always show when mouse is in container */}
              {(mousePosition || hoveredCategoryId) && (() => {
                // Use last known position if mousePosition is null but we're still locked on
                const currentMousePos = mousePosition || lockedBubblePosition || { x: 0, y: 0 };
                // Calculate ball position with attraction to bubble when close
                let ballX = currentMousePos.x;
                let ballY = currentMousePos.y;
                
                if (lockedBubblePosition && hoveredCategoryId) {
                  // Attract ball towards bubble, but still allow mouse control
                  const attractionStrength = 0.3; // 0 = no attraction, 1 = fully locked
                  ballX = currentMousePos.x + (lockedBubblePosition.x - currentMousePos.x) * attractionStrength;
                  ballY = currentMousePos.y + (lockedBubblePosition.y - currentMousePos.y) * attractionStrength;
                }
                
                 return (
                   <motion.div
                     className="pointer-events-none absolute z-50"
                     style={{
                       left: `${ballX}px`,
                       top: `${ballY}px`,
                       transform: 'translate(-50%, -50%)',
                       pointerEvents: 'none', // Explicitly disable pointer events
                     }}
                     animate={{
                       left: `${ballX}px`,
                       top: `${ballY}px`,
                     }}
                     transition={{
                       duration: 0.15,
                       ease: 'easeOut',
                     }}
                   >
                     <motion.div
                       style={{ pointerEvents: 'none' }} // Ensure inner div also has no pointer events
                       animate={{
                         scale: hoveredCategoryId ? [1, 1.3, 1] : 1, // Grow/shrink to simulate dribbling into screen
                       }}
                       transition={{
                         duration: hoveredCategoryId ? 0.6 : 0,
                         repeat: hoveredCategoryId ? Infinity : 0,
                         ease: 'easeInOut',
                       }}
                     >
                       <div className="text-2xl" style={{ pointerEvents: 'none' }}>🏀</div>
                     </motion.div>
                   </motion.div>
                 );
              })()}
            {/* Basketball Court SVG - Half Court */}
            <svg 
              viewBox="0 0 800 500" 
              className="w-full h-full absolute inset-0"
              style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))', cursor: 'none', pointerEvents: 'none' }}
              preserveAspectRatio="xMidYMid slice"
            >
              {/* SVG Filters for glow effects */}
              <defs>
                <filter id="orangeGlow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                  <feGaussianBlur stdDeviation="16" result="coloredBlur2"/>
                  <feGaussianBlur stdDeviation="24" result="coloredBlur3"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur3" />
                    <feMergeNode in="coloredBlur2"/>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Court background - fills entire container */}
              <rect x="0" y="0" width="800" height="500" fill="#0a0a0f" rx="8" />
              
              {/* Court lines - no glow */}
              <g stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" fill="none">
                {/* Outer boundary - sides and top only (no bottom line) - top line ends at 3-point line intersection */}
                <path d="M 140 10 L 660 10 M 790 10 L 790 490 M 10 490 L 10 10" strokeLinecap="round" />
                
                {/* Key/paint area */}
                <rect x="310" y="10" width="180" height="290" />
                
                {/* Free throw circle */}
                <circle cx="400" cy="300" r="60" />
                
                {/* Three-point line - wide arc tangent to free throw circle, centered at hoop */}
                <path d="M 140 10 L 140 175 A 225 175 0 0 0 660 175 L 660 10" strokeWidth="3" />
              </g>
              
            </svg>

            {/* Category Bubbles - Visual only, not clickable */}
            <div style={{ cursor: 'none', pointerEvents: 'auto' }}>
              {categories.map((category) => {
                const isHovered = hoveredCategoryId === category.id;
                return (
              <CategoryBubble
                key={category.id}
                category={category}
                onClick={() => {}} // No-op: bubbles are visual only
                isSelected={false} // Never selected since not clickable
                    isOtherHovered={hoveredCategoryId !== null && hoveredCategoryId !== category.id}
                    disableHoverCard={true}
                    hideTitle={true}
                    isLockedOn={isHovered}
              />
                );
              })}
            </div>


            {/* Lock Overlay when in commitment period */}
            {commitmentStatus?.isCommitted && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <div className="bg-slate-900 border-2 border-orange-500/50 rounded-2xl p-8 max-w-lg mx-4 text-center">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-white mb-3">Commitment Period Active</h3>
                  <p className="text-white/70 mb-4">
                    You're currently committed to <span className="text-orange-400">{commitmentStatus.category}</span> with {commitmentStatus.coachName}.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-white/70 mb-6">
                    <Clock className="w-5 h-5" />
                    <span>{commitmentStatus.daysRemaining} days remaining until you can explore other pathways</span>
                  </div>
                  <p className="text-slate-500 text-sm">
                    This ensures you stay focused and give your coacheship the commitment it deserves. 
                    Check your Player Portal to track your progress!
                  </p>
                </div>
              </div>
            )}

            </div>

            {/* RIGHT: Description Panel */}
            <div className="pathway-description-panel" style={{
              width: '100%',
              minHeight: '500px',
              background: 'linear-gradient(145deg, #0f0f0f 0%, #181818 50%, #0f0f0f 100%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              padding: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              {hoveredCategoryId ? (
                (() => {
                  const hoveredCategory = categories.find(c => c.id === hoveredCategoryId);
                  if (!hoveredCategory) return null;
                  const Icon = hoveredCategory.icon;
                  const categoryAccentColor = getAccentColor(hoveredCategory.color);
                  
                  return (
                    <motion.div
                      key={hoveredCategory.id}
                      className="text-center w-full"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="flex justify-center mb-6">
                        <Icon size={64} strokeWidth={2} style={{ color: categoryAccentColor }} />
                      </div>
                      <h3
                        className="text-3xl lg:text-4xl font-bold mb-4 text-white"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                      >
                        {hoveredCategory.title}
                      </h3>
                      <p
                        className="text-lg lg:text-xl text-white leading-relaxed max-w-[500px] mx-auto mb-4"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                      >
                        {hoveredCategory.description}
                      </p>
                      <p
                        className="text-base lg:text-lg italic mb-6"
                        style={{ fontFamily: "'Bebas Neue', sans-serif", color: categoryAccentColor }}
                      >
                        {hoveredCategory.tagline}
                      </p>
                      <p
                        className="text-lg lg:text-xl text-white font-bold border-t pt-4"
                        style={{ fontFamily: "'Bebas Neue', sans-serif", borderTopColor: `${categoryAccentColor}4D` }}
                      >
                        Discover coaches through Pathways
                      </p>
                    </motion.div>
                  );
                })()
              ) : (
                <motion.div
                  className="text-center w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <p
                    className="text-lg lg:text-xl text-white leading-relaxed max-w-[500px] mx-auto mb-6"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    Inspired by basketball, ISO makes professional coaching relatable, human, and culturally grounded. ISO offers 6 pathways of growth and development in your field of interest.
                  </p>
                  <p
                    className="text-base lg:text-lg mb-6"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    Hover over a pathway to learn more
                  </p>
                  <motion.button
                    onClick={() => {
                      if (onNavigateToPathways) {
                        onNavigateToPathways();
                      }
                    }}
                    className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-all"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore Pathways
                  </motion.button>
                  <motion.div
                    className="text-5xl mt-4"
                    animate={{
                      y: [0, 10, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    👆
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
          ) : (
            <FeatureShowcase role={role} />
          )}
        </div>
      </section>

      {/* Modals removed - coach selection now happens on Pathways page */}

      <style>{`
        /* Container for SIDE-BY-SIDE layout */
        .pathways-showcase {
          display: grid;
          grid-template-columns: 45% 55%;
          gap: 40px;
          align-items: start;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* LEFT side - Basketball court */
        .basketball-court-container {
          width: 100%;
          height: 500px;
          position: relative;
          background: linear-gradient(145deg, #0f0f0f 0%, #181818 50%, #0f0f0f 100%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
        }

        /* Pathway bubbles MUST be smaller */
        .pathway-bubble {
          position: absolute;
          width: 80px !important;
          height: 80px !important;
          border-radius: 50%;
          background: rgba(10, 10, 10, 0.9);
          border: 2px solid;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pathway-bubble svg {
          width: 24px !important;
          height: 24px !important;
        }

        .pathway-label {
          font-size: 0.55rem !important;
          text-align: center;
          color: #fff;
          margin-top: 4px;
          max-width: 70px;
          line-height: 1.1;
        }

        /* RIGHT side - Description panel */
        .pathway-description-panel {
          width: 100%;
          min-height: 500px;
          background: linear-gradient(145deg, #0f0f0f 0%, #181818 50%, #0f0f0f 100%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Ensure NO stacking on desktop */
        @media (min-width: 769px) {
          .pathways-showcase {
            grid-template-columns: 45% 55% !important;
          }
        }

        /* Only stack on mobile */
        @media (max-width: 768px) {
          .pathways-showcase {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          
          .basketball-court-container,
          .pathway-description-panel {
            height: auto;
            min-height: 400px;
          }
        }
      `}</style>
    </>
  );
}
