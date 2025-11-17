import { useState, useEffect } from 'react';

interface IntroAnimationProps {
  onComplete?: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [stage, setStage] = useState<'stage1' | 'stage2' | 'stage3' | 'stage4' | 'stage5' | 'complete'>('stage1');
  const [shouldShow, setShouldShow] = useState(true);
  
  // Letter-by-letter states for "In Search Of"
  const fullText = "In Search Of";
  // Positions: I(0), n(1), [space(2)], S(3), e(4), a(5), r(6), c(7), h(8), [space(9)], O(10), f(11)
  const lettersToKeep = [0, 3, 10]; // I, S, O positions
  
  const [letterOpacities, setLetterOpacities] = useState<number[]>(() => 
    new Array(fullText.length).fill(1)
  );
  const [letterTransforms, setLetterTransforms] = useState<string[]>(() => 
    new Array(fullText.length).fill('translateX(0)')
  );
  
  // Overlay opacity
  const [overlayOpacity, setOverlayOpacity] = useState(1);

  useEffect(() => {
    // Check if animation has already played this session
    if (typeof window !== 'undefined') {
      const hasPlayed = sessionStorage.getItem('introPlayed');
      if (hasPlayed) {
        setShouldShow(false);
        if (onComplete) onComplete();
        return;
      }
    }

    // Disable scrolling during animation
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const timers: NodeJS.Timeout[] = [];
    
    // STAGE 1 (0-5 seconds): Show full text "You're not lost, you're just In Search Of"
    // Text is already visible, just wait
    
    // STAGE 2 (5-6.5 seconds): Fade out letters except I, S, O (staggered)
    const stage2Timer = setTimeout(() => {
      setStage('stage2');
      
      // Fade out letters that should disappear (staggered over 1.5 seconds)
      fullText.split('').forEach((_, index) => {
        if (!lettersToKeep.includes(index)) {
          // Calculate delay: start at 0ms, spread over 1500ms
          const progress = index / (fullText.length - 1);
          const delay = Math.floor(progress * 1500);
          
          const fadeTimer = setTimeout(() => {
            setLetterOpacities(prev => {
              const newOpacities = [...prev];
              newOpacities[index] = 0;
              return newOpacities;
            });
          }, delay);
          timers.push(fadeTimer);
        }
      });
    }, 5000);
    timers.push(stage2Timer);

    // STAGE 3 (6.5-8 seconds): Move I, S, O together to form "ISO" (smooth transition)
    const stage3Timer = setTimeout(() => {
      setStage('stage3');
      
      // Calculate positions to move letters together
      setLetterTransforms(prev => {
        const newTransforms = [...prev];
        
        // Current character positions in "In Search Of"
        // I(0), n(1), space(2), S(3), e(4), a(5), r(6), c(7), h(8), space(9), O(10), f(11)
        
        // I (index 0): needs to move right ~1.2em to be closer to S
        newTransforms[0] = 'translateX(1.2em)';
        
        // S (index 3): needs to move left ~0.5em to be closer to I
        newTransforms[3] = 'translateX(-0.5em)';
        
        // O (index 10): needs to move left significantly ~4.5em to be next to S
        newTransforms[10] = 'translateX(-4.5em)';
        
        return newTransforms;
      });
    }, 6500);
    timers.push(stage3Timer);

    // STAGE 4 (8-10 seconds): Keep ISO visible and stationary
    const stage4Timer = setTimeout(() => {
      setStage('stage4');
    }, 8000);
    timers.push(stage4Timer);

    // STAGE 5 (10-12 seconds): Fade out overlay (transparent, not white)
    const stage5Timer = setTimeout(() => {
      setStage('stage5');
      setOverlayOpacity(0);
    }, 10000);
    timers.push(stage5Timer);

    // STAGE 6 (After 12 seconds): Complete and cleanup
    const completeTimer = setTimeout(() => {
      setStage('complete');
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('introPlayed', 'true');
      }
      setShouldShow(false);
      if (onComplete) onComplete();
    }, 12000);
    timers.push(completeTimer);

    return () => {
      // Cleanup all timers
      timers.forEach(timer => clearTimeout(timer));
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [onComplete]);

  if (!shouldShow) return null;

  const fontFamily = "'Poppins', 'Inter', sans-serif";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        opacity: overlayOpacity,
        backgroundColor: 'rgba(0, 0, 0, 1)',
        transition: 'opacity 2s ease-in-out',
        pointerEvents: overlayOpacity > 0 ? 'auto' : 'none',
      }}
    >
      <div className="text-center px-4">
        {/* STAGE 1 (0-5s): Full text "You're not lost, you're just In Search Of" */}
        {stage === 'stage1' && (
          <div>
            <h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              style={{ 
                fontFamily,
                opacity: 1,
                transition: 'opacity 0.8s ease-in-out'
              }}
            >
              You're not lost, you're just{' '}
              <span className="inline-block">
                {fullText.split('').map((letter, index) => (
                  <span 
                    key={index} 
                    className="inline-block"
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </span>
            </h1>
          </div>
        )}

        {/* STAGE 2 & 3 (5-8s): Letter-by-letter transition to ISO */}
        {(stage === 'stage2' || stage === 'stage3') && (
          <div>
            {/* Show "You're not lost, you're just" - keep it visible and fade out gradually */}
            <h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-2 md:mb-4"
              style={{ 
                fontFamily,
                opacity: stage === 'stage2' ? 1 : 0.3,
                transition: 'opacity 1s ease-in-out'
              }}
            >
              You're not lost, you're just
            </h1>
            
            {/* Letter-by-letter "In Search Of" transitioning to ISO */}
            <div 
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-wider inline-flex items-center justify-center whitespace-nowrap"
              style={{ 
                fontFamily,
                minHeight: '1.2em',
              }}
            >
              {fullText.split('').map((letter, index) => {
                const isSpace = letter === ' ';
                const opacity = letterOpacities[index] ?? 1;
                const transform = letterTransforms[index] ?? 'translateX(0)';
                
                // Don't render fully faded spaces or letters
                if (opacity < 0.01) {
                  return null;
                }
                
                return (
                  <span
                    key={index}
                    style={{
                      opacity,
                      transform,
                      transition: stage === 'stage2' 
                        ? 'opacity 0.5s ease-in-out' 
                        : 'opacity 0.5s ease-in-out, transform 1s ease-in-out',
                      display: 'inline-block',
                      pointerEvents: 'none',
                    }}
                  >
                    {isSpace ? '\u00A0' : letter}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* STAGE 4 & 5 (8-12s): Final ISO display - matches hero section styling */}
        {(stage === 'stage4' || stage === 'stage5') && (
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl md:text-9xl font-bold text-white tracking-wider"
            style={{ 
              fontFamily,
              textShadow: '0 0 30px rgba(249,115,22,0.9)',
              opacity: overlayOpacity,
              transition: 'opacity 2s ease-in-out'
            }}
          >
            ISO
          </h1>
        )}
      </div>
    </div>
  );
}
