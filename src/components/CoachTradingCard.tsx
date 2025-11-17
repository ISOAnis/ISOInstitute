import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { X, Star, Calendar, Zap, BookOpen, Briefcase, DollarSign, GraduationCap, Award, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CoachCardProps {
  mentor: {
    name: string;
    role: string;
    bio: string;
    varsityPrice: number;
    yearsExperience: number;
    specialization: string[];
    successRate?: string;
    tier: 'standard' | 'specialist' | 'premium';
    additionalPerks?: string[];
    // Extended data for card
    rating?: number;
    sessionsCompleted?: number;
    responseTime?: string;
    education?: string[];
    careerTimeline?: Array<{ year: string; role: string; company: string }>;
  };
  category: {
    id: string;
    title: string;
    emoji: string;
    color: string;
  };
  onClose: () => void;
  onBookSession?: () => void;
}

export function CoachTradingCard({ mentor, category, onClose, onBookSession }: CoachCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  
  // Default values for stats
  const overall = mentor.rating ? Math.round(60 + (mentor.rating / 5) * 40) : 85; // Convert 1-5 rating to 60-100 scale, default to 85
  const sessionsCompleted = mentor.sessionsCompleted || 150;
  const responseTime = mentor.responseTime || '< 24hrs';
  
  // Mock education data
  const education = mentor.education || [
    'BS Computer Science, Stanford University',
    'MS Engineering, MIT'
  ];
  
  // Mock career timeline
  const careerTimeline = mentor.careerTimeline || [
    { year: '2019', role: 'Software Engineer', company: 'Apple' },
    { year: '2021', role: 'Senior Engineer', company: 'Zoox' },
    { year: '2023', role: 'Lead Engineer', company: 'Zoox' },
    { year: '2024', role: 'Coach & Community Builder', company: 'ISO Institute' }
  ];

  const getImageSrc = () => {
    return `https://images.unsplash.com/photo-1609503842755-77f4a81d69ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50b3IlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYyNjQ0MTgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral`;
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const modalContent = (
    <>
      {/* Dark overlay background */}
      <div 
        onClick={onClose}
        style={{ 
          zIndex: 9998,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.98)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          margin: 0,
          padding: 0
        }}
      />
      {/* Card container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          zIndex: 9999,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          pointerEvents: 'none'
        }}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '448px',
            pointerEvents: 'auto'
          }}
        >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-48px',
            right: 0,
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            zIndex: 10
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(51, 65, 85, 1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.8)'}
        >
          <X style={{ width: '20px', height: '20px', color: 'white' }} />
        </button>

        {/* Card Container with 3D Flip */}
        <div 
          style={{ 
            position: 'relative',
            width: '100%',
            height: '600px',
            perspective: '1000px',
            perspectiveOrigin: 'center center'
          }}
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{ 
              transformStyle: 'preserve-3d',
              width: '100%',
              height: '100%',
              position: 'relative'
            }}
            onClick={handleCardClick}
          >
            {/* Front of Card */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(0deg) translateZ(0)',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            >
              {/* Gradient Border - Tier based */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '16px',
                  padding: '4px',
                  background: mentor.tier === 'premium' 
                    ? 'linear-gradient(135deg, #9333ea 0%, #f97316 100%)'
                    : mentor.tier === 'specialist'
                    ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                    : 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
                  animation: mentor.tier === 'premium' 
                    ? 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    : mentor.tier === 'specialist'
                    ? 'gold-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    : 'none',
                  boxShadow: mentor.tier === 'premium'
                    ? '0 0 30px rgba(249, 115, 22, 0.8), 0 0 50px rgba(147, 51, 234, 0.6)'
                    : mentor.tier === 'specialist'
                    ? '0 0 25px rgba(234, 179, 8, 0.7), 0 0 45px rgba(245, 158, 11, 0.5)'
                    : 'none',
                }}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#0f172a',
                  borderRadius: '14px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxSizing: 'border-box'
                }}>
                  {/* Pathway Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'rgba(30, 41, 59, 0.5)',
                      padding: '6px 12px',
                      borderRadius: '9999px'
                    }}>
                      <span style={{ fontSize: '20px' }}>{category.emoji}</span>
                      <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{category.title}</span>
                    </div>
                    {mentor.tier === 'premium' && (
                      <span style={{ color: '#facc15', fontSize: '12px', fontWeight: '600' }}>⭐ PREMIUM</span>
                    )}
                    {mentor.tier === 'specialist' && (
                      <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: '600' }}>⭐ SPECIALIST</span>
                    )}
                  </div>

                  {/* Photo */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '256px',
                    marginBottom: '16px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #475569 0%, #334155 100%)'
                  }}>
                    <ImageWithFallback
                      src={getImageSrc()}
                      alt={mentor.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: mentor.name === 'Anis Benyoucef' ? 'contain' : 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 100%)'
                    }}></div>
                  </div>

                  {/* Name and Role */}
                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      marginBottom: '4px',
                      fontFamily: "'Poppins', sans-serif",
                      textTransform: 'uppercase'
                    }}>
                      {mentor.name}
                    </h3>
                    <p style={{ color: '#f97316', fontSize: '14px', fontWeight: '500' }}>{mentor.role}</p>
                  </div>

                  {/* Quick Stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(30, 41, 59, 0.5)',
                      borderRadius: '8px',
                      padding: '8px',
                      textAlign: 'center'
                    }}>
                      <Star style={{ width: '16px', height: '16px', color: '#facc15', margin: '0 auto 4px', display: 'block' }} />
                      <p style={{ color: 'white', fontSize: '12px', fontWeight: '600', margin: '0' }}>{overall}</p>
                      <p style={{ color: '#94a3b8', fontSize: '10px', margin: '0' }}>Overall</p>
                    </div>
                    <div style={{
                      backgroundColor: 'rgba(30, 41, 59, 0.5)',
                      borderRadius: '8px',
                      padding: '8px',
                      textAlign: 'center'
                    }}>
                      <Calendar style={{ width: '16px', height: '16px', color: '#60a5fa', margin: '0 auto 4px', display: 'block' }} />
                      <p style={{ color: 'white', fontSize: '12px', fontWeight: '600', margin: '0' }}>{sessionsCompleted}</p>
                      <p style={{ color: '#94a3b8', fontSize: '10px', margin: '0' }}>Sessions</p>
                    </div>
                    <div style={{
                      backgroundColor: 'rgba(30, 41, 59, 0.5)',
                      borderRadius: '8px',
                      padding: '8px',
                      textAlign: 'center'
                    }}>
                      <Zap style={{ width: '16px', height: '16px', color: '#4ade80', margin: '0 auto 4px', display: 'block' }} />
                      <p style={{ color: 'white', fontSize: '12px', fontWeight: '600', margin: '0' }}>{responseTime}</p>
                      <p style={{ color: '#94a3b8', fontSize: '10px', margin: '0' }}>Response</p>
                    </div>
                  </div>

                  {/* Specialty Tags */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginBottom: '16px'
                  }}>
                    {mentor.specialization.slice(0, 4).map((spec, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '12px',
                          backgroundColor: 'rgba(30, 41, 59, 0.7)',
                          color: '#cbd5e1',
                          padding: '4px 8px',
                          borderRadius: '9999px',
                          border: '1px solid #334155'
                        }}
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Flip Indicator */}
                  <div style={{
                    marginTop: 'auto',
                    paddingTop: '16px',
                    borderTop: '1px solid #1e293b',
                    textAlign: 'center'
                  }}>
                    <p style={{ 
                      fontSize: '12px', 
                      margin: 0,
                      background: 'linear-gradient(90deg, #94a3b8 0%, #f97316 25%, #9333ea 50%, #f97316 75%, #94a3b8 100%)',
                      backgroundSize: '200% 100%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: 'wave-gradient 3s ease-in-out infinite',
                      fontWeight: '500'
                    }}>
                      Click card to flip and see more →
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Back of Card */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg) translateZ(0)',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            >
              {/* Gradient Border */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '16px',
                  padding: '4px',
                  background: 'linear-gradient(135deg, #9333ea 0%, #f97316 100%)',
                }}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#0f172a',
                  borderRadius: '14px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  overflowY: 'auto',
                  boxSizing: 'border-box'
                }}>
                  {/* Close/Flip indicator */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                  }}>
                    <p style={{ 
                      fontSize: '12px', 
                      margin: 0,
                      background: 'linear-gradient(90deg, #94a3b8 0%, #f97316 25%, #9333ea 50%, #f97316 75%, #94a3b8 100%)',
                      backgroundSize: '200% 100%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: 'wave-gradient 3s ease-in-out infinite',
                      fontWeight: '500'
                    }}>Click to flip back</p>
                    <span style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>BACK</span>
                  </div>

                  {/* Name Header */}
                  <h3 style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    fontFamily: "'Poppins', sans-serif",
                    textTransform: 'uppercase'
                  }}>
                    {mentor.name}
                  </h3>

                  {/* Full Bio */}
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.75', margin: 0 }}>{mentor.bio}</p>
                  </div>

                  {/* Education Section */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <GraduationCap style={{ width: '16px', height: '16px', color: '#f97316' }} />
                      <h4 style={{ color: 'white', fontSize: '14px', fontWeight: '600', margin: 0 }}>Education</h4>
                    </div>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      marginLeft: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      {education.map((edu, idx) => (
                        <li key={idx} style={{ color: '#94a3b8', fontSize: '12px' }}>• {edu}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Career Timeline */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <Briefcase style={{ width: '16px', height: '16px', color: '#a855f7' }} />
                      <h4 style={{ color: 'white', fontSize: '14px', fontWeight: '600', margin: 0 }}>Career Timeline</h4>
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      marginLeft: '24px'
                    }}>
                      {careerTimeline.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                          <span style={{
                            color: '#f97316',
                            fontSize: '12px',
                            fontWeight: '600',
                            minWidth: '50px'
                          }}>{item.year}</span>
                          <div>
                            <p style={{ color: 'white', fontSize: '12px', fontWeight: '500', margin: 0 }}>{item.role}</p>
                            <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>{item.company}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expertise Tags */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <Award style={{ width: '16px', height: '16px', color: '#60a5fa' }} />
                      <h4 style={{ color: 'white', fontSize: '14px', fontWeight: '600', margin: 0 }}>Expertise</h4>
                    </div>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginLeft: '24px'
                    }}>
                      {mentor.specialization.map((spec, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '12px',
                            backgroundColor: 'rgba(30, 41, 59, 0.7)',
                            color: '#cbd5e1',
                            padding: '4px 8px',
                            borderRadius: '9999px',
                            border: '1px solid #334155'
                          }}
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Coach-Specific Benefits */}
                  {mentor.additionalPerks && mentor.additionalPerks.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px'
                      }}>
                        <Award style={{ width: '16px', height: '16px', color: '#fbbf24' }} />
                        <h4 style={{ color: 'white', fontSize: '14px', fontWeight: '600', margin: 0 }}>Coach-Specific Benefits</h4>
                      </div>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        marginLeft: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}>
                        {mentor.additionalPerks.map((perk, idx) => (
                          <li key={idx} style={{ 
                            color: '#fbbf24', 
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '6px'
                          }}>
                            <span style={{ color: '#fbbf24', fontSize: '14px', flexShrink: 0 }}>★</span>
                            <span style={{ color: '#cbd5e1' }}>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Success Rate */}
                  {mentor.successRate && (
                    <div style={{
                      marginBottom: '16px',
                      padding: '12px',
                      backgroundColor: 'rgba(30, 41, 59, 0.5)',
                      borderRadius: '8px',
                      border: '1px solid #334155'
                    }}>
                      <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>{mentor.successRate}</p>
                    </div>
                  )}

                  {/* Call an ISO Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onBookSession) {
                        onBookSession();
                      }
                    }}
                    style={{
                      width: '100%',
                      backgroundColor: '#f97316',
                      color: 'white',
                      fontWeight: 'bold',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      fontFamily: "'Poppins', sans-serif",
                      marginTop: 'auto',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ea580c';
                      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f97316';
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                    }}
                  >
                    Call an ISO
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      </div>
    </>
  );

  if (!mounted) return null;

  // Render to document.body using portal to avoid z-index conflicts
  return createPortal(modalContent, document.body);
}
