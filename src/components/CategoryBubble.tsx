import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, LucideIcon } from 'lucide-react';

interface CategoryBubbleProps {
  category: {
    id: string;
    title: string;
    icon?: LucideIcon;
    iconName?: string;
    emoji?: string;
    description: string;
    tagline: string;
    color: string;
    position: React.CSSProperties;
    zIndex: number;
  };
  onClick: () => void;
  isSelected: boolean;
  isOtherHovered?: boolean;
}

export function CategoryBubble({ category, onClick, isSelected, isOtherHovered = false }: CategoryBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const IconComponent = category.icon;
  
  // Determine if bubble is in lower part of screen (positioned from bottom)
  const isLowerPosition = 'bottom' in category.position;

  // Dynamic positioning to keep card on screen
  const [cardPosition, setCardPosition] = useState<'top' | 'bottom'>(
    isLowerPosition ? 'bottom' : 'top'
  );
  const [horizontalAlign, setHorizontalAlign] = useState<'center' | 'left' | 'right'>('center');
  
  useEffect(() => {
    if (isHovered && cardRef.current) {
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Check if card goes off-screen
      const goesOffBottom = rect.bottom > viewportHeight - 20; // 20px buffer
      const goesOffTop = rect.top < 20; // 20px buffer
      const goesOffRight = rect.right > viewportWidth - 20;
      const goesOffLeft = rect.left < 20;
      
      // Adjust vertical position
      if (goesOffBottom && !goesOffTop) {
        setCardPosition('top');
      } else if (goesOffTop && !goesOffBottom) {
        setCardPosition('bottom');
      }
      
      // Adjust horizontal position if needed
      if (goesOffRight && !goesOffLeft) {
        setHorizontalAlign('right');
      } else if (goesOffLeft && !goesOffRight) {
        setHorizontalAlign('left');
      } else {
        setHorizontalAlign('center');
      }
    } else {
      // Reset to defaults when not hovered
      setCardPosition(isLowerPosition ? 'bottom' : 'top');
      setHorizontalAlign('center');
    }
  }, [isHovered, isLowerPosition]);

  // Get glow color based on category color
  const getGlowColor = () => {
    if (category.color.includes('emerald')) return 'rgba(16, 185, 129, 0.6)';
    if (category.color.includes('red')) return 'rgba(239, 68, 68, 0.6)';
    if (category.color.includes('blue')) return 'rgba(59, 130, 246, 0.6)';
    if (category.color.includes('purple')) return 'rgba(147, 51, 234, 0.6)';
    if (category.color.includes('orange')) return 'rgba(249, 115, 22, 0.6)';
    if (category.color.includes('indigo')) return 'rgba(99, 102, 241, 0.6)';
    if (category.color.includes('teal')) return 'rgba(20, 184, 166, 0.6)';
    if (category.color.includes('cyan')) return 'rgba(34, 211, 238, 0.6)';
    return 'rgba(249, 115, 22, 0.6)';
  };

  // Get background gradient colors from category.color string
  const getGradientColors = () => {
    // Parse Tailwind gradient classes like "from-emerald-500 to-teal-600"
    const fromMatch = category.color.match(/from-([a-z]+)-(\d+)/);
    const toMatch = category.color.match(/to-([a-z]+)-(\d+)/);
    
    // Color mapping for common Tailwind colors
    const colorMap: Record<string, Record<string, string>> = {
      emerald: {
        '500': '#10b981',
        '600': '#059669',
      },
      red: {
        '500': '#ef4444',
        '600': '#dc2626',
      },
      blue: {
        '500': '#3b82f6',
        '600': '#2563eb',
      },
      purple: {
        '500': '#a855f7',
        '600': '#9333ea',
      },
      orange: {
        '500': '#f97316',
        '600': '#ea580c',
      },
      indigo: {
        '500': '#6366f1',
        '600': '#4f46e5',
      },
      teal: {
        '500': '#14b8a6',
        '600': '#0d9488',
      },
      cyan: {
        '500': '#06b6d4',
        '600': '#0891b2',
      },
      rose: {
        '500': '#f43f5e',
        '600': '#e11d48',
      },
      amber: {
        '500': '#f59e0b',
        '600': '#d97706',
      },
      green: {
        '500': '#22c55e',
        '600': '#16a34a',
      },
    };
    
    const fromColor = fromMatch ? (colorMap[fromMatch[1]]?.[fromMatch[2]] || '#3b82f6') : '#3b82f6';
    const toColor = toMatch ? (colorMap[toMatch[1]]?.[toMatch[2]] || '#2563eb') : '#2563eb';
    
    return { fromColor, toColor };
  };

  const { fromColor, toColor } = getGradientColors();

  return (
    <div
      className="absolute z-10"
      style={{ 
        ...category.position, 
        zIndex: isHovered ? 20 : 10,
        opacity: isOtherHovered && !isHovered ? 0.5 : 1,
        transition: 'opacity 0.3s ease-out'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative cursor-pointer"
        whileHover={{ scale: 1.15, y: -5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={() => {
          setIsHovered(false);
          onClick();
        }}
      >
        {/* Main bubble with glassmorphic effect, glow, and shadow */}
        <div 
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
            isSelected ? 'opacity-80 ring-4 ring-orange-400/50 ring-offset-2 ring-offset-slate-950' : 'opacity-100'
          }`}
          style={{
            background: `linear-gradient(135deg, ${fromColor}, ${toColor})`,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `3px solid rgba(255, 255, 255, 0.3)`,
            boxShadow: isHovered 
              ? `0 20px 60px ${getGlowColor()}, 0 10px 30px ${getGlowColor()}, 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)`
              : `0 10px 40px ${getGlowColor()}, 0 5px 15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Outer glow ring */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${getGlowColor()}, transparent 70%)`,
              opacity: isHovered ? 0.8 : 0.5,
              transition: 'opacity 0.3s ease',
            }}
          />
          
          {/* Inner highlight */}
          <div 
            className="absolute inset-2 rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent 60%)`,
              opacity: isHovered ? 0.6 : 0.4,
              transition: 'opacity 0.3s ease',
            }}
          />
          
          {/* Icon */}
          <div className="relative z-10">
            {IconComponent ? (
              <IconComponent 
                className={`w-10 h-10 ${category.id === 'medicine' ? 'text-white' : 'text-white'}`}
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                }}
              />
            ) : (
          <span className={`text-3xl ${category.id === 'medicine' ? 'text-white' : ''}`}>{category.emoji}</span>
            )}
          </div>
          
          {/* Shimmer effect on hover */}
          {isHovered && (
            <div 
              className="absolute inset-0 rounded-full opacity-50"
              style={{
                background: `linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)`,
                animation: 'shimmer 2s ease-in-out infinite',
              }}
            />
          )}
        </div>

        {/* Minimal title label underneath bubble */}
        <motion.div
          className="absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span 
            className="text-xs font-medium text-white/90"
            style={{
              fontFamily: "'Poppins', sans-serif",
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)',
              letterSpacing: '0.5px',
            }}
          >
            {category.title}
          </span>
        </motion.div>

        {/* Hover card - dynamically positioned */}
        {isHovered && !isSelected && (
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: cardPosition === 'bottom' ? -10 : 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`absolute ${
              cardPosition === 'bottom'
                ? 'bottom-full mb-4' 
                : 'top-full mt-4'
            } ${
              horizontalAlign === 'center' 
                ? 'left-1/2 -translate-x-1/2' 
                : horizontalAlign === 'right'
                ? 'right-0'
                : 'left-0'
            } w-80 bg-slate-900 rounded-2xl shadow-xl p-6 z-10 border-2 border-slate-800`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsHovered(false);
              }}
              className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-3 justify-center">
              {IconComponent ? (
                <IconComponent className={`w-6 h-6 text-white`} />
              ) : (
              <span className={`text-2xl ${category.id === 'medicine' ? 'text-white' : ''}`}>{category.emoji}</span>
              )}
              <h3 className="text-white font-semibold">{category.title}</h3>
            </div>
            <p className="text-slate-400 mb-3 text-center leading-relaxed" style={{ lineHeight: '1.7' }}>{category.description}</p>
            <p className="text-slate-300 italic text-center leading-relaxed" style={{ lineHeight: '1.7' }}>{category.tagline}</p>
            <div className="flex justify-center">
              <button 
                className="mt-4 bg-white text-slate-900 py-3 px-8 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 font-semibold text-base shadow-md hover:shadow-lg hover:scale-105"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsHovered(false);
                  onClick();
                }}
              >
                View Coaches
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}