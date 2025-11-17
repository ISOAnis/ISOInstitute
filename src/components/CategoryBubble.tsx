import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface CategoryBubbleProps {
  category: {
    id: string;
    title: string;
    emoji: string;
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
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={() => {
          setIsHovered(false);
          onClick();
        }}
      >
        {/* Main bubble with glow effect */}
        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg border-4 border-white transition-all duration-300 ${
          isSelected ? 'opacity-80 ring-4 ring-orange-400/50 ring-offset-2 ring-offset-slate-950' : 'opacity-100'
        } ${
          isHovered ? 'shadow-2xl shadow-orange-500/50 ring-2 ring-orange-400/30' : ''
        }`}>
          <span className={`text-3xl ${category.id === 'medicine' ? 'text-white' : ''}`}>{category.emoji}</span>
        </div>

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
              <span className={`text-2xl ${category.id === 'medicine' ? 'text-white' : ''}`}>{category.emoji}</span>
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