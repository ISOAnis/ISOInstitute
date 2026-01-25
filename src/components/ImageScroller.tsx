import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║           APPLE-STYLE SCROLL-PINNED IMAGE SEQUENCE ANIMATION                 ║
 * ║                                                                              ║
 * ║  Creates a "scroll-jacking" effect where the viewport locks in place while  ║
 * ║  an image sequence plays through. Similar to Apple product reveal pages.    ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * HOW IT WORKS:
 * 1. Container has tall height (e.g., 400vh) to create scroll range
 * 2. Canvas is position: sticky, stays pinned at top of viewport
 * 3. As user scrolls through the container, only the frame changes
 * 4. Visual effect: page appears "frozen" while animation plays
 * 5. After all frames complete, normal scrolling resumes
 * 
 * SCROLL PINNING BEHAVIOR:
 * ✓ Canvas locked in viewport during animation
 * ✓ Scroll progress mapped to frame index
 * ✓ Works both scrolling down AND up
 * ✓ Smooth 60fps frame transitions
 * ✓ Preloaded images for instant playback
 * 
 * USAGE:
 * ```tsx
 * <ScrollPinnedImageSequence 
 *   frameCount={94}
 *   framePrefix="ezgif-frame-"
 *   frameSuffix=".png"
 *   scrollHeight={250}
 * />
 * ```
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

interface ScrollPinnedImageSequenceProps {
  /** Total number of frames in the sequence */
  frameCount?: number;
  /** Prefix for frame filenames (e.g., "frame-" for frame-001.png) */
  framePrefix?: string;
  /** File extension (e.g., ".png", ".jpg") */
  frameSuffix?: string;
  /** Custom path pattern (overrides prefix/suffix). Use {:03} for frame number */
  imagePathPattern?: string;
  /** Container height in viewport heights (vh). Determines scroll distance. */
  scrollHeight?: number;
  /** Show debug overlay with frame/scroll info */
  showDebug?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Callback when sequence completion state changes */
  onSequenceComplete?: (isComplete: boolean) => void;
}

interface LoadingState {
  isLoading: boolean;
  progress: number;
  loadedCount: number;
  error: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ScrollPinnedImageSequence({
  frameCount = 94,
  framePrefix = 'frame-',
  frameSuffix = '.png',
  imagePathPattern,
  scrollHeight = 250,
  showDebug = false,
  className = '',
  onSequenceComplete,
}: ScrollPinnedImageSequenceProps) {
  
  // ─────────────────────────────────────────────────────────────────────────────
  // REFS - Persistent values that don't trigger re-renders
  // ─────────────────────────────────────────────────────────────────────────────
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const animationFrameRef = useRef<number>();
  const isSequenceActiveRef = useRef<boolean>(false);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // STATE - Triggers re-renders
  // ─────────────────────────────────────────────────────────────────────────────
  
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: true,
    progress: 0,
    loadedCount: 0,
    error: null,
  });
  
  const [currentFrame, setCurrentFrame] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSequenceActive, setIsSequenceActive] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentTextKey, setCurrentTextKey] = useState<string>('');
  const scrollAccumulatorRef = useRef(0);
  const lockedScrollPositionRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const lastWheelTimeRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const touchStateRef = useRef({ isTouching: false, lastY: 0 });
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // TEXT OVERLAY - Synced to frame ranges
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const textOverlays: Record<string, { text: string; subtext?: string; showArrows?: boolean }> = {
    '1-8': { text: 'ISO' },
    '9-24': { text: 'ISO', subtext: 'In Search Of' },
    '25-48': { 
      text: 'In basketball, ISO is you vs. your defender.', 
      subtext: 'Here, your defender becomes your coach.' 
    },
    '49-72': { 
      text: 'Faith-driven coaching for young men and women', 
      subtext: 'Searching for their next move.' 
    },
    '73-86': { 
      text: 'Spiritual growth. Professional direction. Personal courage.' 
    },
    '87-94': { 
      text: 'Explore the court and find coaches in your pathway',
      showArrows: true // Special flag for arrows
    },
  };
  
  // Determine current text based on frame
  const getCurrentText = useCallback((frame: number) => {
    if (frame >= 0 && frame < 8) return '1-8';
    if (frame >= 8 && frame < 24) return '9-24';
    if (frame >= 24 && frame < 48) return '25-48';
    if (frame >= 48 && frame < 72) return '49-72';
    if (frame >= 72 && frame < 86) return '73-86';
    if (frame >= 86) return '87-94';
    return '1-8';
  }, []);
  
  // Update text when frame changes - always update to ensure smooth backward scrolling
  useEffect(() => {
    const newTextKey = getCurrentText(currentFrame);
    // Always update even if same to force re-render and fix gradient rendering
    setCurrentTextKey(newTextKey);
  }, [currentFrame, getCurrentText]);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // PATHWAY CATEGORIES - Show on final frame
  // ═══════════════════════════════════════════════════════════════════════════════
  
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // IMAGE PATH GENERATION
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const getImagePath = useCallback((frameNum: number): string => {
    if (imagePathPattern) {
      const padded = (frameNum + 1).toString().padStart(3, '0');
      return imagePathPattern.replace('{:03}', padded);
    }
    const padded = (frameNum + 1).toString().padStart(3, '0');
    return `/${framePrefix}${padded}${frameSuffix}`;
  }, [imagePathPattern, framePrefix, frameSuffix]);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // IMAGE PRELOADING - Load all frames upfront
  // ═══════════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    let isCancelled = false;
    
    const preloadImages = async () => {
      console.log(`🎬 [SCROLL-PINNED] Loading ${frameCount} frames...`);
      console.log(`📁 Pattern: ${getImagePath(0)}`);
      
      const images: HTMLImageElement[] = new Array(frameCount);
      let loadedCount = 0;
      
      // Load images in parallel but track progress
      const loadPromises = Array.from({ length: frameCount }, (_, i) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          const path = getImagePath(i);
          
          const timeout = setTimeout(() => {
            console.warn(`⏱️ Timeout loading frame ${i + 1}`);
            resolve();
          }, 15000);
          
          img.onload = () => {
            clearTimeout(timeout);
            if (img.complete && img.naturalWidth > 0) {
              images[i] = img;
              loadedCount++;
              
              if (!isCancelled) {
                setLoading(prev => ({
                  ...prev,
                  progress: Math.round((loadedCount / frameCount) * 100),
                  loadedCount,
                }));
              }
            }
            resolve();
          };
          
          img.onerror = () => {
            clearTimeout(timeout);
            console.error(`❌ Failed: frame ${i + 1} from ${path}`);
            resolve();
          };
          
          img.src = path;
        });
      });
      
      await Promise.all(loadPromises);
      
      if (!isCancelled) {
        const validImages = images.filter(Boolean);
        console.log(`✅ Loaded ${validImages.length} of ${frameCount} frames`);
        
        imagesRef.current = validImages;
        
        setLoading({
          isLoading: false,
          progress: 100,
          loadedCount: validImages.length,
          error: validImages.length === 0 ? 'Failed to load images' : null,
        });
      }
    };
    
    preloadImages();
    
    return () => {
      isCancelled = true;
    };
  }, [frameCount, getImagePath]);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // CANVAS RENDERING - Draw frame to canvas
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const images = imagesRef.current;
    
    if (!canvas || images.length === 0) return;
    
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    
    const safeIndex = Math.max(0, Math.min(Math.floor(frameIndex), images.length - 1));
    const img = images[safeIndex];
    
    if (!img || !img.complete) return;
    
    // Clear canvas with background color
    ctx.fillStyle = '#020617'; // slate-950
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Calculate scaling for COVER (fill entire viewport)
    const dpr = window.devicePixelRatio || 1;
    const canvasWidth = canvas.width / dpr;
    const canvasHeight = canvas.height / dpr;
    
    // Crop right side of image for symmetry - use 95% of image width (crop 5% from right)
    const cropRatio = 0.95;
    const sourceWidth = img.width * cropRatio;
    const sourceHeight = img.height;
    
    // Calculate scale based on cropped width (cover behavior)
    const scale = Math.max(
      canvasWidth / sourceWidth,
      canvasHeight / sourceHeight
    );
    
    const scaledWidth = sourceWidth * scale;
    const scaledHeight = sourceHeight * scale;
    
    // Center image horizontally
    const x = (canvasWidth - scaledWidth) / 2;
    // Shift down by 38% of excess height to show full mannequins (not cutting heads)
    const excessHeight = scaledHeight - canvasHeight;
    const y = (canvasHeight - scaledHeight) / 2 + (excessHeight * 0.38);
    
    // High-quality rendering with right-side crop
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Draw only the left 95% of the image (crops right side)
    ctx.drawImage(
      img,
      0, 0, sourceWidth, sourceHeight,  // Source rectangle (crop from right)
      x, y, scaledWidth, scaledHeight   // Destination rectangle
    );
  }, []);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // EASING FUNCTIONS - Smooth frame transitions
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const easeOutCubic = useCallback((t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  }, []);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // FRAME ADVANCEMENT - Manual frame control via scroll accumulator
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const frameUpdateRef = useRef<number>();
  
  const advanceFrameByDelta = useCallback((delta: number) => {
    if (imagesRef.current.length === 0) return 0;
    
    const totalFrames = imagesRef.current.length;
    const pixelsPerFrame = 40; // Adjust for scroll sensitivity (lower = faster)
    
    // Accumulate scroll delta
    scrollAccumulatorRef.current += delta;
    
    // Clamp to valid range - CRITICAL: Prevent negative or out-of-bounds frames
    scrollAccumulatorRef.current = Math.max(0, Math.min(
      (totalFrames - 1) * pixelsPerFrame,
      scrollAccumulatorRef.current
    ));
    
    // Calculate frame index from accumulator
    const rawFrameIndex = scrollAccumulatorRef.current / pixelsPerFrame;
    
    // Apply easing for smoother transitions
    const normalizedProgress = rawFrameIndex / (totalFrames - 1);
    const easedProgress = easeOutCubic(normalizedProgress);
    const easedFrameIndex = easedProgress * (totalFrames - 1);
    
    // CRITICAL: Clamp frame index to valid range (0 to totalFrames - 1)
    const clampedFrameIndex = Math.max(0, Math.min(totalFrames - 1, easedFrameIndex));
    const progress = clampedFrameIndex / (totalFrames - 1);
    
    // Calculate the actual frame number (clamped)
    const actualFrame = Math.floor(clampedFrameIndex);
    
    // Use requestAnimationFrame for smooth updates
    if (frameUpdateRef.current) {
      cancelAnimationFrame(frameUpdateRef.current);
    }
    
    frameUpdateRef.current = requestAnimationFrame(() => {
      setScrollProgress(progress);
      setCurrentFrame(actualFrame);
      drawFrame(clampedFrameIndex);
    });
    
    return progress;
  }, [drawFrame, easeOutCubic]);
  
  const exitSequenceAtStart = useCallback(() => {
    isSequenceActiveRef.current = false;
    setIsSequenceActive(false);
    hasCompletedRef.current = false;
    setIsTransitioning(false);
    scrollAccumulatorRef.current = 0;
    setCurrentFrame(0);
    
    if (onSequenceComplete) {
      onSequenceComplete(false);
    }
  }, [onSequenceComplete]);
  
  const completeSequenceTransition = useCallback(() => {
    hasCompletedRef.current = true;
    setIsTransitioning(true);
    
    isSequenceActiveRef.current = false;
    setIsSequenceActive(false);
    
    if (onSequenceComplete) {
      onSequenceComplete(true);
    }
    
    setTimeout(() => {
      setIsTransitioning(false);
      const container = containerRef.current;
      if (container) {
        const containerEnd = container.offsetTop + container.offsetHeight;
        window.scrollTo({
          top: containerEnd,
          behavior: 'smooth'
        });
      }
    }, 700);
  }, [onSequenceComplete]);
  
  const handleScrollDelta = useCallback((deltaY: number): boolean => {
    if (deltaY === 0) return false;
    
    if (isTransitioning && deltaY > 0) {
      return false;
    }
    
    if (isTransitioning && deltaY < 0) {
      setIsTransitioning(false);
      hasCompletedRef.current = false;
    }
    
    if (!isSequenceActiveRef.current) {
      return false;
    }
    
    const currentProgress = scrollProgress;
    
    if (currentProgress >= 0.98 && deltaY > 0) {
      completeSequenceTransition();
      return false;
    }
    
    if (deltaY < 0 && hasCompletedRef.current) {
      hasCompletedRef.current = false;
      setIsTransitioning(false);
    }
    
    if (currentProgress <= 0.01 && deltaY < 0 && currentFrame === 0) {
      exitSequenceAtStart();
      return false;
    }
    
    advanceFrameByDelta(deltaY);
    window.scrollTo(0, lockedScrollPositionRef.current);
    return true;
  }, [advanceFrameByDelta, completeSequenceTransition, currentFrame, exitSequenceAtStart, isTransitioning, scrollProgress]);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // CHECK SEQUENCE ZONE - Determine if we should activate scroll hijacking
  // ═══════════════════════════════════════════════════════════════════════════════
  
  const checkSequenceZone = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;
    
    const rect = container.getBoundingClientRect();
    
    // Sequence is active when its top reaches the viewport top
    const shouldActivate = rect.top <= 0 && rect.bottom > 200;
    
    if (shouldActivate !== isSequenceActiveRef.current) {
      const wasActive = isSequenceActiveRef.current;
      isSequenceActiveRef.current = shouldActivate;
      setIsSequenceActive(shouldActivate);
      
      if (shouldActivate) {
        // Lock scroll position when entering sequence
        lockedScrollPositionRef.current = window.scrollY;
        
        // If re-entering sequence from below (was inactive, now active), hide basketball court
        if (!wasActive && hasCompletedRef.current) {
          hasCompletedRef.current = false;
          setIsTransitioning(false);
          if (onSequenceComplete) {
            onSequenceComplete(false);
          }
        }
        
        // Don't reset accumulator - preserve frame position for smooth re-entry
        console.log('🔒 Sequence LOCKED - scroll will only advance frames');
      } else {
        console.log('🔓 Sequence UNLOCKED - normal scrolling resumed');
      }
    }
    
    return shouldActivate;
  }, [onSequenceComplete]);
  
  // Monitor scroll position to detect when to activate sequence AND handle scrollbar control
  useEffect(() => {
    if (loading.isLoading) return;
    
    const handleScrollCheck = () => {
      checkSequenceZone();
      
      // If sequence is active, check if scrollbar was dragged (not wheel scroll)
      if (isSequenceActiveRef.current && containerRef.current) {
        const container = containerRef.current;
        const currentScrollY = window.scrollY;
        const timeSinceLastWheel = Date.now() - lastWheelTimeRef.current;
        const scrollChanged = Math.abs(currentScrollY - lastScrollYRef.current) > 5;
        
        // If scroll changed significantly and no recent wheel event, it's likely scrollbar drag
        if (scrollChanged && timeSinceLastWheel > 100) {
          const containerTop = container.offsetTop;
          const scrollIntoSequence = Math.max(0, currentScrollY - containerTop);
          const totalSequenceHeight = container.offsetHeight;
          
          if (totalSequenceHeight > 0) {
            const scrollProgressRatio = Math.max(0, Math.min(1, scrollIntoSequence / totalSequenceHeight));
            const totalFrames = imagesRef.current.length;
            
            if (totalFrames > 0) {
              const targetFrame = Math.floor(scrollProgressRatio * (totalFrames - 1));
              const pixelsPerFrame = 40;
              
              // Update scroll accumulator to match scrollbar position
              scrollAccumulatorRef.current = targetFrame * pixelsPerFrame;
              
              // Update frame directly
              if (targetFrame >= 0 && targetFrame < totalFrames) {
                setCurrentFrame(targetFrame);
                setScrollProgress(scrollProgressRatio);
                drawFrame(targetFrame);
                
                // Update locked position to current scroll to prevent jumping
                lockedScrollPositionRef.current = currentScrollY;
                
                // Check if scrollbar dragged to end - trigger transition
                if (scrollProgressRatio >= 0.98 && !hasCompletedRef.current && !isTransitioning) {
                  // Start smooth transition to unlock with fade-out
                  hasCompletedRef.current = true;
                  setIsTransitioning(true);
                  
                  console.log('✅ Sequence COMPLETE (scrollbar) - transitioning with fade-out...');
                  
                  // Unlock immediately and notify parent
                  isSequenceActiveRef.current = false;
                  setIsSequenceActive(false);
                  
                  // Notify parent that sequence is complete
                  if (onSequenceComplete) {
                    onSequenceComplete(true);
                  }
                  
                  // Wait for fade-out animation to complete before finishing transition
                  setTimeout(() => {
                    setIsTransitioning(false);
                    // Position scroll at container end for seamless transition (no bounce)
                    const container = containerRef.current;
                    if (container) {
                    const containerEnd = container.offsetTop + container.offsetHeight;
                    // Smooth scroll to container end after fade completes
                    window.scrollTo({
                      top: containerEnd,
                      behavior: 'auto'
                    });
                  }
                }, 700); // Match the fade-out duration (700ms)
                }
                
                // Check if scrollbar dragged to start - unlock going backwards
                if (scrollProgressRatio <= 0.01 && targetFrame === 0 && isSequenceActiveRef.current) {
                  isSequenceActiveRef.current = false;
                  setIsSequenceActive(false);
                  hasCompletedRef.current = false;
                  scrollAccumulatorRef.current = 0;
                  setCurrentFrame(0);
                  
                  // Notify parent that sequence is no longer complete
                  if (onSequenceComplete) {
                    onSequenceComplete(false);
                  }
                }
              }
            }
          }
        }
        
        lastScrollYRef.current = currentScrollY;
      }
    };
    
    window.addEventListener('scroll', handleScrollCheck, { passive: true });
    handleScrollCheck(); // Check initially
    
    return () => {
      window.removeEventListener('scroll', handleScrollCheck);
    };
  }, [loading.isLoading, checkSequenceZone, drawFrame, isTransitioning, onSequenceComplete]);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // CANVAS SETUP - Initialize and handle resize
  // ═══════════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || loading.isLoading) return;
    
    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      
      // Set canvas to full viewport dimensions
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      
    const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      
      // Draw first frame
      drawFrame(0);
    };
    
    setupCanvas();
    
    const handleResize = () => setupCanvas();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [loading.isLoading, drawFrame]);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // SCROLL HIJACKING - Capture wheel events and lock page position
  // ═══════════════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (loading.isLoading) return;
    
    const handleWheel = (e: WheelEvent) => {
      // Check sequence zone in real-time to ensure accurate state
      // This allows normal trackpad scrolling everywhere when sequence is not active
      checkSequenceZone();
      
      // Only intercept scroll when sequence is actually active
      // This allows normal trackpad scrolling everywhere else on the page
      if (!isSequenceActiveRef.current) {
        return; // Let trackpad scroll events pass through normally everywhere
      }
      
      // Prevent default scroll and handle the scroll delta only when sequence is active
      e.preventDefault();
      e.stopPropagation();
      lastWheelTimeRef.current = Date.now();
      handleScrollDelta(e.deltaY);
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSequenceActiveRef.current) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const deltaY = e.key === 'ArrowDown' ? 120 : -120;
        handleScrollDelta(deltaY);
      }
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      if (!isSequenceActiveRef.current || e.touches.length !== 1) return;
      touchStateRef.current.isTouching = true;
      touchStateRef.current.lastY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStateRef.current.isTouching || e.touches.length !== 1) return;
      const currentY = e.touches[0].clientY;
      const deltaY = touchStateRef.current.lastY - currentY;
      if (deltaY === 0) return;
      lastWheelTimeRef.current = Date.now();
      if (handleScrollDelta(deltaY)) {
        e.preventDefault();
      }
      touchStateRef.current.lastY = currentY;
    };
    
    const handleTouchEnd = () => {
      touchStateRef.current.isTouching = false;
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      if (frameUpdateRef.current) {
        cancelAnimationFrame(frameUpdateRef.current);
      }
    };
  }, [loading.isLoading, handleScrollDelta, checkSequenceZone]);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // INITIAL SCROLL TO TOP - Ensure sequence is visible when loaded
  // ═══════════════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (!loading.isLoading && containerRef.current) {
      // Scroll to the top of the page to show the sequence
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        console.log('📍 Scrolled to top to show image sequence');
      }, 100);
    }
  }, [loading.isLoading]);
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════════

  return (
    <div 
      className={`relative bg-slate-950 ${className}`}
      style={{
        width: '100vw',
        margin: 0,
        padding: 0,
      }}
    >
      
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* LOADING STATE */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      
      {loading.isLoading && (
      <section className="h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md w-full">
            {/* Animated loader */}
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-orange-500/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            {/* Loading text */}
            <h3 className="text-white text-2xl font-bold mb-3">
              Loading Experience
            </h3>
            <p className="text-slate-400 text-lg mb-6">
              {loading.loadedCount} of {frameCount} frames
            </p>
            
            {/* Progress bar */}
            <div className="w-full max-w-sm mx-auto">
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ 
                    width: `${loading.progress}%`,
                    backgroundSize: '200% 100%',
                    animation: loading.progress < 100 ? 'shimmer 2s infinite' : 'none',
                  }}
                />
              </div>
              <p className="text-slate-500 text-sm text-right">{loading.progress}%</p>
            </div>
          </div>
        </section>
      )}
      
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* SCROLL-PINNED IMAGE SEQUENCE */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* This is the main scroll-jacking container                               */}
      {/* The tall height creates scroll range while canvas stays sticky/pinned   */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      
      {!loading.isLoading && !loading.error && (
        <section 
          ref={containerRef}
          className="relative"
          style={{ 
            height: `${scrollHeight}vh`,
            width: '100vw',
            margin: 0,
            padding: 0,
          }}
          aria-label="Scroll-animated image sequence"
        >
          {/* FIXED CANVAS - Stays locked in place during animation */}
          <div 
            className={isSequenceActive ? "fixed top-0 left-0 z-10" : "sticky top-0 left-0"}
            style={{
              width: '100vw',
              height: '100vh',
              margin: 0,
              padding: 0,
              overflow: 'hidden',
              transition: 'opacity 700ms ease-in-out, transform 700ms ease-in-out',
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(-20px)' : 'translateY(0)',
            }}
          >
            <canvas 
              ref={canvasRef}
              className="block"
              style={{ 
                width: '100%',
                height: '100%',
                margin: 0,
                padding: 0,
                display: 'block',
                objectFit: 'cover',
                filter: 'brightness(0.7) contrast(1.1)', // Reduce exposure (brightness) and slightly increase contrast
              }}
              aria-label="Animation canvas"
            />
            
            {/* TEXT OVERLAY - Synced to frame ranges */}
            {currentTextKey && textOverlays[currentTextKey] && (
              <div 
                key={`text-overlay-${currentTextKey}-${currentFrame}`}
                className="absolute inset-0 flex flex-col items-center z-20 pointer-events-none"
                style={{
                  justifyContent: 'center',
                  top: currentTextKey === '1-8' || currentTextKey === '9-24' ? '25%' : currentTextKey === '87-94' ? '45%' : '28%',
                  transform: 'translateY(-50%)',
                }}
              >
                <div
                  className="text-center px-4 transition-all duration-700 ease-in-out"
                  style={{
                    opacity: 1,
                    transform: 'translateY(0)',
                    maxWidth: currentTextKey === '25-48' || currentTextKey === '49-72' || currentTextKey === '73-86' ? '85vw' : '90vw',
                  }}
                >
                  {textOverlays[currentTextKey]?.text && (
                    <h1 
                      key={`text-${currentTextKey}-${currentFrame}`}
                      className="font-bold mb-3"
                      style={{
                        fontFamily: currentTextKey === '1-8' || currentTextKey === '9-24' 
                          ? "'Bebas Neue', sans-serif"
                          : "'Bebas Neue', sans-serif",
                        fontSize: currentTextKey === '1-8' || currentTextKey === '9-24' 
                          ? 'clamp(2.5rem, 7vw, 6rem)' 
                          : currentTextKey === '25-48' || currentTextKey === '49-72'
                          ? 'clamp(1.25rem, 3.5vw, 2.75rem)'
                          : currentTextKey === '87-94'
                          ? 'clamp(1rem, 3vw, 2rem)'
                          : 'clamp(1.5rem, 4vw, 3rem)',
                        // Lighter metallic/silver gradient text effect with fallback (lighter grays for better contrast)
                        color: currentTextKey === '1-8' || currentTextKey === '9-24' ? '#ffffff' : 'rgba(230, 230, 230, 0.95)',
                        background: currentTextKey === '25-48' || currentTextKey === '49-72' || currentTextKey === '73-86'
                          ? 'linear-gradient(180deg, rgba(220, 220, 220, 0.95) 0%, rgba(190, 190, 190, 0.9) 25%, rgba(210, 210, 210, 0.92) 50%, rgba(240, 240, 240, 0.95) 75%, rgba(230, 230, 230, 0.98) 100%)'
                          : currentTextKey === '87-94'
                          ? 'linear-gradient(180deg, rgba(230, 230, 230, 0.98) 0%, rgba(210, 210, 210, 0.92) 50%, rgba(225, 225, 225, 0.95) 100%)'
                          : 'transparent',
                        WebkitBackgroundClip: (currentTextKey === '25-48' || currentTextKey === '49-72' || currentTextKey === '73-86' || currentTextKey === '87-94') ? 'text' : 'border-box',
                        WebkitTextFillColor: (currentTextKey === '25-48' || currentTextKey === '49-72' || currentTextKey === '73-86' || currentTextKey === '87-94') ? 'transparent' : 'auto',
                        backgroundClip: (currentTextKey === '25-48' || currentTextKey === '49-72' || currentTextKey === '73-86' || currentTextKey === '87-94') ? 'text' : 'border-box',
                        letterSpacing: currentTextKey === '1-8' || currentTextKey === '9-24' ? '0.1em' : '0.01em',
                        fontWeight: currentTextKey === '1-8' || currentTextKey === '9-24' ? '400' : '700',
                        lineHeight: '1.7',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        textShadow: currentTextKey === '1-8' || currentTextKey === '9-24' 
                          ? '0 4px 12px rgba(0, 0, 0, 0.9), 0 2px 6px rgba(0, 0, 0, 0.8)'
                          : 'none',
                        // Ensure gradient renders properly
                        display: 'inline-block',
                      }}
                    >
                      {textOverlays[currentTextKey].text}
                    </h1>
                  )}
                  {textOverlays[currentTextKey]?.subtext && (
                    <p 
                      key={`subtext-${currentTextKey}-${currentFrame}`}
                      className="font-medium mt-3 sm:mt-4"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: currentTextKey === '9-24' 
                          ? 'clamp(1rem, 3vw, 2rem)'
                          : 'clamp(1rem, 3vw, 2.25rem)',
                        // Lighter metallic/silver gradient text effect for subtext with fallback (lighter grays for better contrast)
                        color: 'rgba(230, 230, 230, 0.95)',
                        background: 'linear-gradient(180deg, rgba(220, 220, 220, 0.95) 0%, rgba(200, 200, 200, 0.9) 40%, rgba(230, 230, 230, 0.92) 80%, rgba(240, 240, 240, 0.95) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        letterSpacing: '0.015em',
                        lineHeight: '1.7',
                        fontWeight: '500',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        // Ensure gradient renders properly
                        display: 'inline-block',
                      }}
                    >
                      {textOverlays[currentTextKey].subtext}
                    </p>
                  )}
                  
                  {/* Animated arrows for final frames - large and white */}
                  {textOverlays[currentTextKey]?.showArrows && (
                    <div className="flex gap-3 justify-center mt-8">
                      <svg 
                        className="w-10 h-10 md:w-12 md:h-12 arrow-1" 
                        fill="none" 
                        stroke="white" 
                        viewBox="0 0 24 24"
                        style={{
                          filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.9))',
                        }}
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={3} 
                          d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                        />
                      </svg>
                      <svg 
                        className="w-10 h-10 md:w-12 md:h-12 arrow-2" 
                        fill="none" 
                        stroke="white" 
                        viewBox="0 0 24 24"
                        style={{
                          filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.9))',
                        }}
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={3} 
                          d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                        />
                      </svg>
                      <svg 
                        className="w-10 h-10 md:w-12 md:h-12 arrow-3" 
                        fill="none" 
                        stroke="white" 
                        viewBox="0 0 24 24"
                        style={{
                          filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.9))',
                        }}
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={3} 
                          d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Debug overlay */}
            {showDebug && (
              <div 
                className="absolute top-8 left-8 bg-black/90 backdrop-blur-sm text-white px-6 py-4 rounded-xl font-mono text-sm border border-orange-500/30 shadow-lg z-50"
                style={{ pointerEvents: 'none' }}
              >
                <div className="space-y-2">
                  <div className="flex justify-between gap-8">
                    <span className="text-slate-400">Frame:</span>
                    <span className="text-orange-400 font-bold">
                      {currentFrame + 1} / {imagesRef.current.length}
                    </span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span className="text-slate-400">Progress:</span>
                    <span className="text-orange-400 font-bold">
                      {Math.round(scrollProgress * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span className="text-slate-400">Active:</span>
                    <span className={isSequenceActive ? "text-green-400" : "text-red-400"}>
                      {isSequenceActive ? 'LOCKED' : 'FREE'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1 mt-3">
                    <div 
                      className="bg-orange-500 h-full rounded-full transition-all duration-100"
                      style={{ width: `${scrollProgress * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Scroll hint (shows at start) */}
            {currentFrame === 0 && !isSequenceActive && (
              <div 
                className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce z-50"
                style={{ pointerEvents: 'none' }}
              >
                <div className="flex flex-col items-center gap-2 text-white/70">
                  <span className="text-sm font-medium">Scroll to explore</span>
                  <svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                    />
                  </svg>
                </div>
              </div>
            )}
            
          
          {/* Complete hint (shows at very end) */}
          {scrollProgress >= 0.98 && !isTransitioning && !hasCompletedRef.current && (
            <div 
              className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce z-50"
              style={{ 
                pointerEvents: 'none',
                transition: 'opacity 0.5s ease-out',
                opacity: 1,
              }}
            >
              <div className="flex flex-col items-center gap-2 text-orange-400">
                <span className="text-sm font-medium">Scroll down to continue</span>
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </section>
      )}
      
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ERROR STATE */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      
      {loading.error && (
        <section className="h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">
              Failed to Load Animation
            </h3>
            <p className="text-slate-400 mb-4">
              {loading.error}
            </p>
            <p className="text-slate-500 text-sm">
              Check that images are in /public folder and paths are correct
            </p>
          </div>
        </section>
      )}

    </div>
  );
}

// Add shimmer animation and staggered arrow bounce to global styles
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
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
  
  .arrow-1 {
    animation: staggered-bounce 1.5s ease-in-out 0s infinite;
  }
  
  .arrow-2 {
    animation: staggered-bounce 1.5s ease-in-out 0.2s infinite;
  }
  
  .arrow-3 {
    animation: staggered-bounce 1.5s ease-in-out 0.4s infinite;
  }
`;
document.head.appendChild(style);
