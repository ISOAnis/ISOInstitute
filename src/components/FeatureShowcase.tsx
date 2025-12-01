import React, { useState, useEffect, useRef } from 'react';

interface Feature {
  num: string;
  tag: string;
  title: string;
  desc: string;
}

interface FeatureShowcaseProps {
  role?: 'players' | 'coaches';
}

export function FeatureShowcase({ role = 'players' }: FeatureShowcaseProps) {
  const [step, setStep] = useState(0);
  const [locked, setLocked] = useState(false);
  const [imageOpacity, setImageOpacity] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollAmount = useRef(0);
  const unlocking = useRef(false);
  const lastScrollY = useRef(0);
  const hasBeenSeen = useRef(false);
  const lastSeenDirection = useRef<'up' | 'down' | null>(null);
  
  const progressPercentage = (step / 3) * 66.67;
  const translateYValue = step * 400;
  
  const playerDemoImages = [
    '/navigate the court demo image.png',
    '/choose your coach demo image.png',
    '/score your goals demo image.png',
    '/unlock your potential demo image.png'
  ];
  
  const coachDemoImages = [
    '/navigate the court demo image.png', // TODO: Add coach-specific demo images when available
    '/choose your coach demo image.png',
    '/score your goals demo image.png',
    '/unlock your potential demo image.png'
  ];
  
  const demoImages = role === 'coaches' ? coachDemoImages : playerDemoImages;

  const playerFeatures: Feature[] = [
    {
      num: "01",
      tag: "CHOOSE YOUR PATHWAY",
      title: "Navigate the Court",
      desc: "Explore six pathways of growth and select the area that aligns with your goals. From Deen & Purpose to Engineering & Technology, find your starting point."
    },
    {
      num: "02",
      tag: "CALL AN ISO",
      title: "Connect with Your Coach",
      desc: "Browse coach profiles, read their stories, and connect with a mentor who understands your journey. Schedule your first session and begin your mentorship."
    },
    {
      num: "03",
      tag: "GET BUCKETS & WIN GAMES",
      title: "Score Your Goals",
      desc: "Complete tasks, achieve milestones, and track your progress. Your coach sets personalized goals and helps you execute with accountability."
    },
    {
      num: "04",
      tag: "LEVEL UP YOUR GAME",
      title: "Unlock Your Potential",
      desc: "Measure your growth, celebrate wins, and continue evolving. Access advanced features and take your development to the next level."
    }
  ];

  const coachFeatures: Feature[] = [
    {
      num: "01",
      tag: "FIND YOUR PLAYERS",
      title: "Choose Your Mentees with AI Matching",
      desc: "Browse player profiles and discover those seeking mentorship. Select players who align with your coaching philosophy and build meaningful connections."
    },
    {
      num: "02",
      tag: "CONNECT & COMMIT",
      title: "Accept ISO",
      desc: "Review and accept ISO requests from players. Schedule your first coaching session and begin building a transformative coach-player relationship."
    },
    {
      num: "03",
      tag: "GUIDE & DEVELOP",
      title: "Develop Champions",
      desc: "Create personalized development plans, set actionable goals, and track progress. Celebrate milestones and help your players unlock their full potential on and off the court."
    },
    {
      num: "04",
      tag: "LEVEL UP",
      title: "Become a Platinum Coach",
      desc: "Increase your overall rating through exceptional coaching, gain premium visibility to attract more players, and unlock advanced tools to scale your impact."
    }
  ];

  const features = role === 'coaches' ? coachFeatures : playerFeatures;
  
  // Reset step when role changes
  useEffect(() => {
    setStep(0);
    scrollAmount.current = 0;
  }, [role]);
  
  // Fade transition effect when step changes
  useEffect(() => {
    setImageOpacity(0);
    const timer = setTimeout(() => {
      setImageOpacity(1);
    }, 50);
    return () => clearTimeout(timer);
  }, [step]);

  // Intersection Observer to catch fast scrolling and lock when centered
  useEffect(() => {
    if (!sectionRef.current || unlocking.current) return;
    
    const checkAndLock = () => {
      if (!sectionRef.current || unlocking.current) return;
      
      const box = sectionRef.current.getBoundingClientRect();
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';
      lastScrollY.current = currentScrollY;
      
      const sectionCenter = box.top + (box.height / 2);
      const viewportCenter = window.innerHeight / 2;
      const isCentered = Math.abs(sectionCenter - viewportCenter) < 150;
      const isVisible = box.top < window.innerHeight * 0.4 && box.bottom > window.innerHeight * 0.6;
      const isAboveViewport = box.bottom < 0;
      const isBelowViewport = box.top > window.innerHeight;
      
      // If section was scrolled past (entered viewport but exited without locking)
      if (!locked) {
        // Section is in viewport
        if (!isAboveViewport && !isBelowViewport) {
          if (!hasBeenSeen.current) {
            hasBeenSeen.current = true;
            lastSeenDirection.current = scrollDirection;
          }
          
          // Lock when centered
          if (isCentered && isVisible) {
            setLocked(true);
            document.body.style.overflow = 'hidden';
            scrollAmount.current = 0;
          }
        }
        // Scrolled down past the section
        else if (isBelowViewport && hasBeenSeen.current && lastSeenDirection.current === 'down') {
          setStep(3); // Set to last step
          hasBeenSeen.current = false; // Reset for next time
          lastSeenDirection.current = null;
        }
        // Scrolled up past the section
        else if (isAboveViewport && hasBeenSeen.current && lastSeenDirection.current === 'up') {
          setStep(0); // Set to first step
          hasBeenSeen.current = false; // Reset for next time
          lastSeenDirection.current = null;
        }
      }
    };
    
    // Check on scroll and resize
    const handleScroll = () => {
      requestAnimationFrame(checkAndLock);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // Also check periodically to catch fast scrolling
    const interval = setInterval(checkAndLock, 100);
    
    // Initialize lastScrollY
    lastScrollY.current = window.scrollY;
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearInterval(interval);
    };
  }, [locked, unlocking]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!sectionRef.current || unlocking.current) return;

      const box = sectionRef.current.getBoundingClientRect();
      // Lock when section is centered in viewport
      // Check if section center is near viewport center (within 150px)
      const sectionCenter = box.top + (box.height / 2);
      const viewportCenter = window.innerHeight / 2;
      const isCentered = Math.abs(sectionCenter - viewportCenter) < 150;
      // Also ensure section is mostly visible
      const isVisible = box.top < window.innerHeight * 0.4 && box.bottom > window.innerHeight * 0.6;
      const shouldLock = isCentered && isVisible;
      
      if (!locked && shouldLock) {
        e.preventDefault();
        setLocked(true);
        document.body.style.overflow = 'hidden';
        scrollAmount.current = 0;
        return;
      }

      if (locked) {
        e.preventDefault();
        scrollAmount.current += e.deltaY;

        // Move to next step
        if (scrollAmount.current > 400 && step < 3) {
          setStep(step + 1);
          scrollAmount.current = 0;
        }
        // Move to previous step
        else if (scrollAmount.current < -400 && step > 0) {
          setStep(step - 1);
          scrollAmount.current = 0;
        }
        // Unlock when scrolling up at first step
        else if (scrollAmount.current < -400 && step === 0) {
          unlocking.current = true;
          setLocked(false);
          document.body.style.overflow = '';
          scrollAmount.current = 0;
          setTimeout(() => { unlocking.current = false; }, 500);
        }
        // Unlock when scrolling down at last step
        else if (scrollAmount.current > 400 && step === 3) {
          unlocking.current = true;
          setLocked(false);
          document.body.style.overflow = '';
          scrollAmount.current = 0;
          setTimeout(() => { unlocking.current = false; }, 500);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      document.body.style.overflow = '';
    };
  }, [locked, step]);

  return (
        <div
      ref={sectionRef} 
          style={{
        minHeight: 'auto',
        width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        padding: '0px 10px',
        position: 'relative'
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: '3000px',
        display: 'flex',
        gap: '60px',
        alignItems: 'center'
      }}>
          
        <div style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '24px 24px 24px 0' }}>
          <div style={{
            maxWidth: '1500px',
            width: '100%',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 25%, rgba(51, 65, 85, 0.85) 50%, rgba(30, 41, 59, 0.9) 75%, rgba(15, 23, 42, 0.95) 100%)',
            border: 'none',
            display: 'inline-block',
            padding: '50px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(249, 115, 22, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            {/* Background pattern overlay with more contrast */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 40%, rgba(249, 115, 22, 0.25) 0%, transparent 60%), radial-gradient(circle at 80% 60%, rgba(59, 130, 246, 0.25) 0%, transparent 60%), radial-gradient(circle at 50% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
              pointerEvents: 'none',
              zIndex: 1
            }}></div>
            <img
              key={step}
              src={demoImages[step]}
              alt={`Feature ${step + 1}`}
                style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                opacity: imageOpacity,
                transition: 'opacity 0.5s ease-in-out',
                position: 'relative',
                zIndex: 2
              }}
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div style={{
              display: 'none',
              width: '100%',
              height: '100%',
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    alignItems: 'center',
                    justifyContent: 'center',
              flexDirection: 'column',
              gap: '16px',
              color: '#94a3b8',
              position: 'absolute',
              top: 0,
              left: 0
            }}>
              <div style={{ fontSize: '60px' }}>📸</div>
              <p style={{ fontSize: '14px' }}>Demo Image {step + 1}</p>
                </div>
              </div>
            </div>

        <div style={{ flex: 1, position: 'relative', minHeight: '500px', display: 'flex', alignItems: 'center' }}>
          
          <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '2px',
                  height: '450px',
            background: '#334155'
          }}>
                <div
                  style={{
                    position: 'absolute',
                    width: '2px',
                    background: '#f97316',
                height: '33.333%',
                top: progressPercentage + '%',
                transition: 'top 0.6s ease'
                  }}
                />
              </div>

          <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  height: '450px',
                  display: 'flex',
                  flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
                {features.map((f, i) => (
              <div key={i} style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: i === step ? '#f97316' : '#1e293b',
                      border: `2px solid ${i === step ? '#f97316' : '#334155'}`,
                      color: i === step ? 'white' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      transform: i === step ? 'scale(1.2)' : 'scale(1)',
                      transition: 'all 0.6s ease',
                boxShadow: i === step ? '0 0 20px rgba(249, 115, 22, 0.5)' : 'none'
              }}>
                    {f.num}
                  </div>
                ))}
              </div>

          <div style={{ 
          paddingLeft: '40px', 
            position: 'relative', 
            height: '400px', 
            overflow: 'hidden',
            width: '100%'
          }}>
            <div style={{
                    position: 'absolute',
                    top: 0,
              left: '80px',
              right: 0,
              transform: `translateY(-${translateYValue}px)`,
              transition: 'transform 0.6s ease'
            }}>
                  {features.map((f, i) => (
                <div key={i} style={{
                        height: '400px',
                  width: '100%',
                  maxWidth: '560px',
                        transform: i === step ? 'scale(1)' : 'scale(0.95)',
                        opacity: i === step ? 1 : 0.3,
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                  paddingRight: '20px',
                  flexShrink: 0,
                  overflow: 'visible'
                }}>
                  <div style={{
                          fontSize: i === step ? '13px' : '12px',
                          color: '#f97316',
                          fontWeight: '600',
                          letterSpacing: '2px',
                          marginBottom: '12px',
                    transition: 'font-size 0.6s ease',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap'
                  }}>
                        {f.tag}
                      </div>
                  <h2 style={{
                    fontSize: i === step ? '48px' : '44px',
                          color: 'white',
                          fontWeight: 'bold',
                    marginBottom: '20px',
                          lineHeight: '1.1',
                    transition: 'font-size 0.6s ease',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    width: '100%'
                  }}>
                        {f.title}
                      </h2>
                  <p style={{
                    fontSize: i === step ? '16px' : '15px',
                          color: '#94a3b8',
                          lineHeight: '1.7',
                    width: '100%',
                    transition: 'font-size 0.6s ease',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    margin: 0
                  }}>
                        {f.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

          <div style={{
                  position: 'absolute',
            bottom: '-40px',
            right: '20px',
                  display: 'flex',
                  gap: '8px',
            alignItems: 'center'
          }}>
                <span style={{ color: '#64748b', fontSize: '14px', marginRight: '8px' }}>
              {step + 1} of 4
                </span>
            {[0,1,2,3].map(i => (
                  <div
                    key={i}
                    style={{
                      width: i === step ? '32px' : '6px',
                      height: '6px',
                      borderRadius: '3px',
                      background: i <= step ? '#f97316' : '#334155',
                  transition: 'all 0.6s ease'
                    }}
                  />
                ))}
              </div>

        </div>
      </div>
    </div>
  );
}