import React, { useState, useRef } from 'react';

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
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const playerDemoImages = [
    '/navigate the court demo image.png',
    '/choose your coach demo image.png',
    '/score your goals demo image.png',
    '/unlock your potential demo image.png'
  ];
  
  const coachDemoImages = [
    '/coach portal demo.png',
    '/coach AI matchmaking 2.png',
    '/coach portal demo 2.png',
    '/coach overall demo.png'
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
      desc: "Measure your growth, celebrate wins, and continue evolving. Flex your achievements and development through ISO apparel, which is unlocked exclusively through your hard work and dedication to the movement."
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
      title: "Accept ISO Requests",
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
      title: "Become a Hall of Fame Coach",
      desc: "Increase your overall rating through exceptional coaching, gain premium visibility to attract more players, and unlock exclusive coach apparel. Be celebrated like a superstar."
    }
  ];

  const features = role === 'coaches' ? coachFeatures : playerFeatures;

  // Reset to first card when role changes
  React.useEffect(() => {
    setActiveIndex(0);
    scrollToCard(0);
  }, [role]);

  const scrollToCard = (index: number) => {
    setActiveIndex(index);
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.scrollWidth / features.length;
      scrollContainerRef.current.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      });
      }
    };

  const handleNext = () => {
    if (activeIndex < features.length - 1) {
      scrollToCard(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      scrollToCard(activeIndex - 1);
    }
  };

  return (
    <div style={{
      width: '100%',
      padding: '20px 0 20px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        onScroll={(e) => {
          // Update active index based on scroll position
          const container = e.currentTarget;
          const scrollLeft = container.scrollLeft;
          const cardWidth = container.offsetWidth; // Use visible width instead of total width
          const newIndex = Math.round(scrollLeft / cardWidth);
          if (newIndex !== activeIndex && newIndex >= 0 && newIndex < features.length) {
            setActiveIndex(newIndex);
          }
        }}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          gap: '20px',
          padding: '0 10px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {features.map((feature, index) => (
          <div
            key={index}
          style={{
              minWidth: 'min(1200px, 95vw)',
              scrollSnapAlign: 'center',
              display: 'grid',
              gridTemplateColumns: '1.3fr 1fr',
              gap: '40px',
              alignItems: 'center',
              padding: '24px'
            }}
          >
            {/* Image */}
            <div style={{
              width: '100%',
              borderRadius: '16px',
              overflow: 'hidden',
              background: 'linear-gradient(145deg, #0f0f0f 0%, #181818 50%, #0f0f0f 100%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: index === 1 && role === 'coaches' ? '40px' : '24px',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={demoImages[index]}
                alt={`Feature ${index + 1}`}
                style={{
                  width: index === 1 && role === 'coaches' ? '70%' : '100%',
                  height: 'auto',
                  display: 'block',
                  position: 'relative',
                  zIndex: 2
                }}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                }}
              />
            </div>

            {/* Content */}
            <div>
              <div style={{
                fontSize: '14px',
                color: '#f97316',
                fontWeight: '600',
                letterSpacing: '3px',
                marginBottom: '16px',
                textTransform: 'uppercase'
              }}>
                {feature.num} • {feature.tag}
              </div>
              <h2 style={{
                fontSize: '56px',
                color: 'white',
                      fontWeight: 'bold',
                marginBottom: '24px',
                lineHeight: '1.1'
              }}>
                {feature.title}
              </h2>
              <p style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: '1.8',
                marginBottom: '32px'
              }}>
                {feature.desc}
              </p>
            </div>
                  </div>
                ))}
              </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        disabled={activeIndex === 0}
                  style={{
                    position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: activeIndex === 0 ? '#1e293b' : '#f97316',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
          opacity: activeIndex === 0 ? 0.3 : 1,
          transition: 'all 0.3s ease',
                        display: 'flex',
          alignItems: 'center',
                        justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          zIndex: 10
                        }}
                      >
        ←
      </button>

      <button
        onClick={handleNext}
        disabled={activeIndex === features.length - 1}
                style={{
                  position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: activeIndex === features.length - 1 ? '#1e293b' : '#f97316',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: activeIndex === features.length - 1 ? 'not-allowed' : 'pointer',
          opacity: activeIndex === features.length - 1 ? 0.3 : 1,
          transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          zIndex: 10
                }}
              >
        →
      </button>

      {/* Dots Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        marginTop: '24px'
      }}>
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToCard(index)}
            aria-label={`Go to feature ${index + 1}`}
                    style={{
              width: index === activeIndex ? '40px' : '12px',
              height: '12px',
              borderRadius: '6px',
              background: index === activeIndex ? '#f97316' : '#334155',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0
                    }}
                  />
                ))}
              </div>

      <style>
        {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
}