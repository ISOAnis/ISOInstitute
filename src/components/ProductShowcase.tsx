import * as React from 'react';
import { useState, useEffect, useRef } from 'react';

export function ProductShowcase() {
  // Hover states for Feature 1 images
  const [hover1Card1, setHover1Card1] = useState(false);
  const [hover1Card2, setHover1Card2] = useState(false);
  
  // Hover states for Feature 2 images
  const [hover2Card1, setHover2Card1] = useState(false);
  const [hover2Card2, setHover2Card2] = useState(false);
  
  // Hover states for Feature 3 images
  const [hover3Card1, setHover3Card1] = useState(false);
  const [hover3Card2, setHover3Card2] = useState(false);

  // Scroll animation states
  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isVisible3, setIsVisible3] = useState(false);
  
  const feature1Ref = useRef<HTMLDivElement>(null);
  const feature2Ref = useRef<HTMLDivElement>(null);
  const feature3Ref = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === feature1Ref.current) {
            setIsVisible1(true);
          } else if (entry.target === feature2Ref.current) {
            setIsVisible2(true);
          } else if (entry.target === feature3Ref.current) {
            setIsVisible3(true);
          }
        }
      });
    }, observerOptions);

    // Small delay to ensure refs are attached
    const timeoutId = setTimeout(() => {
      if (feature1Ref.current) observer.observe(feature1Ref.current);
      if (feature2Ref.current) observer.observe(feature2Ref.current);
      if (feature3Ref.current) observer.observe(feature3Ref.current);
      
      // Check if elements are already in viewport on mount
      const checkInitialVisibility = () => {
        const rect1 = feature1Ref.current?.getBoundingClientRect();
        const rect2 = feature2Ref.current?.getBoundingClientRect();
        const rect3 = feature3Ref.current?.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (rect1 && rect1.top < viewportHeight && rect1.bottom > 0) {
          setIsVisible1(true);
        }
        if (rect2 && rect2.top < viewportHeight && rect2.bottom > 0) {
          setIsVisible2(true);
        }
        if (rect3 && rect3.top < viewportHeight && rect3.bottom > 0) {
          setIsVisible3(true);
        }
      };
      
      checkInitialVisibility();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return (
    <section 
      id="product-showcase"
      style={{ 
      background: '#030305', 
      paddingTop: '80px',
      paddingBottom: '80px',
      paddingLeft: '32px',
      paddingRight: '32px'
      }}
    >
      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto' 
      }}>
        
        {/* Main Heading */}
        <div style={{ 
          marginBottom: '40px', 
          textAlign: 'center' 
        }}>
          <h2 style={{ 
            fontSize: '3.75rem', 
            fontWeight: 'bold', 
            color: 'white',
            fontFamily: 'Bebas Neue, sans-serif'
          }}>
            A <span style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #a8a8a8 40%, #d0d0d0 60%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>new</span>, <span style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #a8a8a8 40%, #d0d0d0 60%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>intuitive</span>, and <span style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #a8a8a8 40%, #d0d0d0 60%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>exciting</span> coaching experience
          </h2>
        </div>

        {/* Feature 1: Choose Your Pathway */}
        <div 
          ref={feature1Ref}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '56px',
            alignItems: 'center',
            marginBottom: '64px',
            opacity: isVisible1 ? 1 : 0,
            transform: isVisible1 ? 'translateX(0)' : 'translateX(-80px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
          }}
        >
          <div>
            <p style={{ 
              color: '#94a3b8', 
              fontSize: '0.875rem', 
              textTransform: 'uppercase',
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              Navigation & Discovery
            </p>
            <h3 style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              color: 'white',
              marginBottom: '24px',
              fontFamily: 'Bebas Neue, sans-serif'
            }}>
              Choose Your Pathway
            </h3>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#94a3b8',
              marginBottom: '16px',
              lineHeight: '1.75'
            }}>
              Navigate your journey through six key pathways. From Deen & Purpose to Engineering & Technology, find the coaches who align with your goals.
            </p>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#64748b',
              lineHeight: '1.75'
            }}>
              Browse coaches, read profiles, and connect with coaches who specialize in your chosen area of growth.
            </p>
          </div>
          
          <div style={{ 
            position: 'relative',
            paddingTop: '80px',
            paddingBottom: '80px',
            paddingLeft: '40px',
            paddingRight: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '60px',
            overflow: 'visible',
            backgroundColor: '#0a0f1a',
            borderRadius: '12px'
          }}>
            {/* Card 1 - Left (slightly larger) */}
            <div 
              onMouseEnter={() => setHover1Card1(true)}
              onMouseLeave={() => setHover1Card1(false)}
              style={{ 
                width: '52%',
                maxWidth: '720px',
                height: 'auto',
                display: 'inline-block',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                transform: hover1Card1 ? 'rotate(-0.5deg) scale(1.03) translateY(-8px)' : 'rotate(-1deg)',
                transition: 'transform 0.3s ease-out',
                cursor: 'pointer',
                zIndex: 1
              }}
            >
              <img 
                className="iso-scale"
                src="/basketball court v3.png" 
                alt="Choose Your Pathway" 
                style={{
                  width: '100%', 
                  height: 'auto', 
                  display: 'block'
                }} 
              />
            </div>
            {/* Card 2 - Right (overlaying on left) */}
            <div 
              onMouseEnter={() => setHover1Card2(true)}
              onMouseLeave={() => setHover1Card2(false)}
              style={{ 
                width: '51%',
                maxWidth: '700px',
                height: 'auto',
                display: 'inline-block',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                transform: hover1Card2 ? 'rotate(2deg) scale(1.03) translateY(-8px)' : 'rotate(1.5deg)',
                transition: 'transform 0.3s ease-out',
                cursor: 'pointer',
                zIndex: 2
              }}
            >
              <img 
                className="iso-scale"
                src="/choose-your-pathway-2.png" 
                alt="Choose Your Pathway" 
                style={{
                  width: '100%', 
                  height: 'auto', 
                  display: 'block'
                }} 
              />
            </div>
          </div>
        </div>

        {/* Feature 2: View Coach Cards */}
        <div 
          ref={feature2Ref}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '48px',
            alignItems: 'center',
            marginBottom: '64px',
            opacity: isVisible2 ? 1 : 0,
            transform: isVisible2 ? 'translateX(0)' : 'translateX(80px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
          }}
        >
          <div style={{ 
            position: 'relative',
            paddingTop: '60px',
            paddingBottom: '60px',
            paddingLeft: '40px',
            paddingRight: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            backgroundColor: '#0a0f1a',
            borderRadius: '12px'
          }}>
            {/* Card 1 - Left (slightly larger) */}
            <div 
              onMouseEnter={() => setHover2Card1(true)}
              onMouseLeave={() => setHover2Card1(false)}
              style={{ 
                width: '45%',
                maxWidth: '500px',
                height: 'auto',
                display: 'inline-block',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                transform: hover2Card1 ? 'rotate(-0.5deg) scale(1.03) translateY(-8px)' : 'rotate(-1deg)',
                transition: 'transform 0.3s ease-out',
                cursor: 'pointer',
                zIndex: 2
              }}
            >
              <img 
                src="/coach-cards-v3.png" 
                alt="View Coach Cards" 
                style={{
                  width: '100%', 
                  height: 'auto', 
                  display: 'block'
                }} 
              />
            </div>
            {/* Card 2 - Right (slightly smaller) */}
            <div 
              onMouseEnter={() => setHover2Card2(true)}
              onMouseLeave={() => setHover2Card2(false)}
              style={{ 
                width: '44%',
                maxWidth: '490px',
                height: 'auto',
                display: 'inline-block',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                transform: hover2Card2 ? 'rotate(2deg) scale(1.03) translateY(-8px)' : 'rotate(1.5deg)',
                transition: 'transform 0.3s ease-out',
                cursor: 'pointer',
                zIndex: 1,
                marginLeft: '-20px'
              }}
            >
              <img 
                src="/coach-cards-v2a.png" 
                alt="View Coach Cards" 
                style={{
                  width: '100%', 
                  height: 'auto', 
                  display: 'block'
                }} 
              />
            </div>
          </div>
          
          <div style={{ order: window.innerWidth < 768 ? 1 : 2 }}>
            <p style={{ 
              color: '#94a3b8', 
              fontSize: '0.875rem', 
              textTransform: 'uppercase',
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              Coach Profiles
            </p>
            <h3 style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              color: 'white',
              marginBottom: '24px',
              fontFamily: 'Bebas Neue, sans-serif'
            }}>
              View Coach Cards
            </h3>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#94a3b8',
              marginBottom: '16px',
              lineHeight: '1.75'
            }}>
              Explore detailed coach cards that showcase each mentor's expertise, background, and approach. Each card provides a comprehensive profile including their career journey, education, specialization areas, and overall match score.
            </p>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#64748b',
              lineHeight: '1.75'
            }}>
              Flip through interactive trading cards to learn about coaching styles, success stories, and what makes each mentor unique. Find the perfect match for your personal and professional growth.
            </p>
          </div>
        </div>

        {/* Feature 3: Call an ISO */}
        <div 
          ref={feature3Ref}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '56px',
            alignItems: 'center',
            marginBottom: '64px',
            opacity: isVisible3 ? 1 : 0,
            transform: isVisible3 ? 'translateX(0)' : 'translateX(-80px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
          }}
        >
          <div>
            <p style={{ 
              color: '#94a3b8', 
              fontSize: '0.875rem', 
              textTransform: 'uppercase',
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              Direct Connection
            </p>
            <h3 style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              color: 'white',
              marginBottom: '24px',
              fontFamily: 'Bebas Neue, sans-serif'
            }}>
              Call an ISO
            </h3>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#94a3b8',
              marginBottom: '16px',
              lineHeight: '1.75'
            }}>
              Connect directly with a coach who understands your journey. One-on-one, personalized curriculum that challenges, guides, and helps you take smarter shots in life.
            </p>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#64748b',
              lineHeight: '1.75'
            }}>
              Schedule sessions, track progress, and build lasting relationships with coaches who've been where you are.
            </p>
          </div>
          
          <div style={{ 
            position: 'relative',
            paddingTop: '120px',
            paddingBottom: '120px',
            paddingLeft: '80px',
            paddingRight: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            overflow: 'visible',
            flexWrap: 'nowrap',
            backgroundColor: '#0a0f1a',
            borderRadius: '12px'
          }}>
            {/* Card 1 - Left */}
            <div 
              onMouseEnter={() => setHover3Card1(true)}
              onMouseLeave={() => setHover3Card1(false)}
              style={{ 
                width: '56%',
                maxWidth: '700px',
                flexShrink: 0,
                height: 'auto',
                display: 'inline-block',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                transform: hover3Card1 ? 'rotate(-0.5deg) scale(1.03) translateY(-8px)' : 'rotate(-1deg)',
                transition: 'transform 0.3s ease-out',
                cursor: 'pointer',
                zIndex: 2
              }}
            >
              <img 
                src="/coach-cards-v2.png" 
                alt="Call an ISO" 
                style={{
                  width: '100%', 
                  height: 'auto', 
                  display: 'block',
                  objectFit: 'cover'
                }} 
              />
            </div>
            {/* Card 2 - Right (larger - phone mockups) */}
            <div 
              onMouseEnter={() => setHover3Card2(true)}
              onMouseLeave={() => setHover3Card2(false)}
              style={{ 
                width: '100%',
                maxWidth: '1000px',
                flexShrink: 0,
                height: 'auto',
                display: 'inline-block',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                transform: hover3Card2 ? 'rotate(2deg) scale(1.03) translateY(-8px)' : 'rotate(1.5deg)',
                transition: 'transform 0.3s ease-out',
                cursor: 'pointer',
                zIndex: 1
              }}
            >
              <img 
                src="/ISO Called.png" 
                alt="Call an ISO" 
                style={{
                  width: '100%', 
                  height: 'auto', 
                  display: 'block',
                  objectFit: 'cover'
                }} 
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}