import React, { useState, useEffect, useRef } from 'react';

interface Feature {
  num: string;
  tag: string;
  title: string;
  desc: string;
}

export function FeatureShowcase() {
  const [step, setStep] = useState(0);
  const [locked, setLocked] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollAmount = useRef(0);
  
  const progressPercentage = step === 0 ? 0 : step === 1 ? 22.22 : step === 2 ? 44.44 : 66.67;
  const translateYValue = step * 400;

  const features: Feature[] = [
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

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!sectionRef.current) return;
      
      const box = sectionRef.current.getBoundingClientRect();
      const inView = box.top < window.innerHeight && box.bottom > 0;
      const isScrollingInSection = e.clientY >= box.top && e.clientY <= box.bottom;
      
      if (inView && !locked && isScrollingInSection) {
        setLocked(true);
        document.body.style.overflow = 'hidden';
        document.body.style.cursor = 'default';
      }
      
      if (locked) {
        if (!isScrollingInSection) {
          setLocked(false);
          document.body.style.overflow = '';
          document.body.style.cursor = '';
          scrollAmount.current = 0;
          return;
        }
        
        e.preventDefault();
        scrollAmount.current += e.deltaY;
        
        if (scrollAmount.current > 500 && step < 3) {
          setStep(prev => prev + 1);
          scrollAmount.current = 0;
        } else if (scrollAmount.current < -500 && step > 0) {
          setStep(prev => prev - 1);
          scrollAmount.current = 0;
        } else if (step === 3 && scrollAmount.current > 700) {
          setTimeout(() => {
            setLocked(false);
            document.body.style.overflow = '';
            document.body.style.cursor = '';
            scrollAmount.current = 0;
          }, 100);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      document.body.style.overflow = '';
      document.body.style.cursor = '';
    };
  }, [locked, step]);

  return (
    <div 
      ref={sectionRef} 
      style={{ 
        height: '100vh',
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        border: 'none',
        outline: 'none',
        cursor: 'default'
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
      }}>
        <div style={{ width: '100%', maxWidth: '1200px', padding: '0 20px', display: 'flex', gap: '80px', alignItems: 'center' }}>
            
          <div style={{ flex: 1, pointerEvents: 'auto' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              borderRadius: '24px',
              padding: '80px',
              border: '2px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px' }}>
                🏀
              </div>
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            
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

            <div style={{ paddingLeft: '80px', position: 'relative', height: '400px', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute',
                top: 0,
                transform: 'translateY(-' + translateYValue + 'px)',
                transition: 'transform 0.6s ease',
                width: '100%'
              }}>
                {features.map((f, i) => (
                  <div key={i} style={{
                    height: '400px',
                    transform: i === step ? 'scale(1)' : 'scale(0.95)',
                    opacity: i === step ? 1 : 0.3,
                    transition: 'all 0.6s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      fontSize: i === step ? '13px' : '12px',
                      color: '#f97316',
                      fontWeight: '600',
                      letterSpacing: '2px',
                      marginBottom: '12px',
                      transition: 'all 0.6s ease'
                    }}>
                      {f.tag}
                    </div>
                    <h2 style={{
                      fontSize: i === step ? '52px' : '48px',
                      color: 'white',
                      fontWeight: 'bold',
                      marginBottom: '24px',
                      lineHeight: '1.1',
                      transition: 'all 0.6s ease'
                    }}>
                      {f.title}
                    </h2>
                    <p style={{
                      fontSize: i === step ? '18px' : '17px',
                      color: '#94a3b8',
                      lineHeight: '1.7',
                      maxWidth: '550px',
                      transition: 'all 0.6s ease'
                    }}>
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '0',
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
    </div>
  );
}