import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Coach {
  name: string;
  role: string;
  bio: string;
  varsityPrice: number;
  yearsExperience: number;
  specialization: string[];
  successRate?: string;
  tier: 'standard' | 'specialist' | 'premium';
  additionalPerks?: string[];
  categoryId?: string;
  categoryTitle?: string;
  categoryEmoji?: string;
}

interface CallIsoPageProps {
  coachName: string;
  onBack: () => void;
}

// Import mentor data from MentorModal
const mentorData: Record<string, Array<{
  name: string;
  role: string;
  bio: string;
  varsityPrice: number;
  yearsExperience: number;
  specialization: string[];
  successRate?: string;
  tier: 'standard' | 'specialist' | 'premium';
  additionalPerks?: string[];
}>> = {
  deen: [
    { 
      name: 'Imam Abdullah Rahman', 
      role: 'Islamic Scholar & Youth Mentor', 
      bio: 'Dedicated to helping young Muslims navigate faith in modern society. 15+ years of experience in youth development and Islamic education.',
      varsityPrice: 45,
      yearsExperience: 15,
      specialization: ['Quran Study', 'Youth Development', 'Spiritual Counseling'],
      successRate: '95% player satisfaction',
      tier: 'premium',
      additionalPerks: ['Direct access to Islamic scholars network', 'Monthly group spiritual sessions']
    },
    { 
      name: 'Sister Amina Khalid', 
      role: 'Spiritual Counselor', 
      bio: 'Certified counselor specializing in faith-based mental wellness and personal development for student athletes.',
      varsityPrice: 25,
      yearsExperience: 7,
      specialization: ['Mental Wellness', 'Faith Integration', 'Student Athletes'],
      tier: 'standard'
    },
  ],
  health: [
    { 
      name: 'Osaid Sasi', 
      role: 'Strength & Conditioning Coach', 
      bio: 'CEO of Iron Fortress, a calesthenics training brand for athletes and fitness enthusiasts. Passionate about building discipline through physical excellence.',
      varsityPrice: 35,
      yearsExperience: 5,
      specialization: ['Calesthenics Training', 'Athletic Performance', 'Nutrition','Entrepreneurship'],
      successRate: '15+ athletes trained',
      tier: 'specialist',
      additionalPerks: ['Custom workout video library', 'Form check videos within 24hrs']
    },
    { 
      name: 'Dr. Sarah Mitchell', 
      role: 'Sports Psychologist', 
      bio: 'Specializes in mental health and peak performance for young athletes. Licensed clinical psychologist.',
      varsityPrice: 65,
      yearsExperience: 12,
      specialization: ['Sports Psychology', 'Mental Performance', 'Clinical Therapy'],
      successRate: 'Licensed therapist',
      tier: 'premium',
      additionalPerks: ['Access to mental health resources library', 'Crisis support availability']
    },
  ],
  medicine: [
    { 
      name: 'Dr. Hassan Ahmed', 
      role: 'Emergency Medicine Physician', 
      bio: 'Practicing ER doctor and pre-med advisor. Committed to coaching the next generation of healthcare professionals.',
      varsityPrice: 55,
      yearsExperience: 14,
      specialization: ['Medical School Prep', 'Clinical Experience', 'MCAT Strategy'],
      successRate: '85% med school acceptance rate',
      tier: 'premium',
      additionalPerks: ['Clinical shadowing opportunities', 'Medical school interview prep']
    },
    { 
      name: 'Wacim Benyoucef', 
      role: '3rd Year Medical Student at the University of Missouri Columbia', 
      bio: 'Dedicated to compassionate care and coaching students interested in healthcare careers.',
      varsityPrice: 0,
      yearsExperience: 1,
      specialization: ['Public and Global Health', 'Policy', 'Medical Education'],
      tier: 'standard'
    },
  ],
  engineering: [
    { 
      name: 'Anis Benyoucef', 
      role: '5x Intern - Apple, Zoox, Stanford Research', 
      bio: 'I have 2+ years of internship experience across leading companies such as Apple and Zoox, giving me diverse experience in product design, hardware testing and validation, manufacturing, and quality. Passionate about community building and leadership',
      varsityPrice: 40,
      yearsExperience: 5,
      specialization: ['Big Tech Recruiting', 'Hardware Engineering', 'Product Design', 'Interview Prep'],
      successRate: '20+ players placed at top tech companies',
      tier: 'specialist',
      additionalPerks: ['Resume review within 48hrs', 'Referral opportunities at Apple/Zoox']
    },
    { 
      name: 'Dr. Layla Chen', 
      role: 'Mechanical Engineer & Researcher', 
      bio: 'PhD in Robotics. Focused on innovation and coaching underrepresented students in STEM fields.',
      varsityPrice: 50,
      yearsExperience: 12,
      specialization: ['Robotics', 'Research Methods', 'Graduate School Prep'],
      successRate: 'PhD advisor',
      tier: 'premium',
      additionalPerks: ['Research lab connections', 'Academic publication guidance']
    },
  ],
  entrepreneurship: [
    { 
      name: 'Jamal Williams', 
      role: 'Social Entrepreneur & Founder', 
      bio: 'Founded three successful startups. Now dedicated to helping young entrepreneurs build sustainable businesses.',
      varsityPrice: 75,
      yearsExperience: 18,
      specialization: ['Startup Strategy', 'Fundraising', 'Social Impact'],
      successRate: '3 exits, $50M+ raised',
      tier: 'premium',
      additionalPerks: ['Investor introductions', 'Pitch deck teardowns', 'Founder community access']
    },
    { 
      name: 'Aisha Mohammed', 
      role: 'Venture Capitalist', 
      bio: 'Investing in purpose-driven startups. Coach to aspiring founders looking to create meaningful impact.',
      varsityPrice: 60,
      yearsExperience: 10,
      specialization: ['Venture Capital', 'Investment Strategy', 'Pitch Preparation'],
      successRate: '$100M+ invested',
      tier: 'premium',
      additionalPerks: ['VC network access', 'Investment readiness assessment']
    },
  ],
  global: [
    { 
      name: 'Ambassador David Chen', 
      role: 'Former Diplomat & Policy Advisor', 
      bio: '20 years in international relations. Now coaching students interested in global affairs and diplomacy.',
      varsityPrice: 70,
      yearsExperience: 20,
      specialization: ['International Relations', 'Diplomacy', 'Policy Analysis'],
      successRate: 'Former US Ambassador',
      tier: 'premium',
      additionalPerks: ['UN/State Dept connections', 'Policy writing workshops']
    },
    { 
      name: 'Nadia Ibrahim', 
      role: 'International Business Consultant', 
      bio: 'Advising Fortune 500 companies on global strategy. Passionate about ethical leadership development.',
      varsityPrice: 45,
      yearsExperience: 12,
      specialization: ['Global Business', 'Strategy Consulting', 'Leadership'],
      successRate: 'Fortune 500 consultant',
      tier: 'specialist',
      additionalPerks: ['Corporate strategy frameworks', 'Executive presence training']
    },
  ],
};

const categoryInfo: Record<string, { title: string; emoji: string }> = {
  deen: { title: 'Deen & Purpose', emoji: '🕌' },
  health: { title: 'Health & Wellness', emoji: '💪' },
  medicine: { title: 'Medicine & Healthcare', emoji: '⚕️' },
  engineering: { title: 'Engineering & Tech', emoji: '💻' },
  entrepreneurship: { title: 'Entrepreneurship & Business', emoji: '🚀' },
  global: { title: 'Global Affairs & Policy', emoji: '🌍' },
};

export function CallIsoPage({ coachName, onBack }: CallIsoPageProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Find the coach across all categories
  let selectedCoach: Coach | null = null;
  let categoryId = '';
  
  for (const [catId, coaches] of Object.entries(mentorData)) {
    const coach = coaches.find(c => c.name === coachName);
    if (coach) {
      selectedCoach = {
        ...coach,
        categoryId: catId,
        categoryTitle: categoryInfo[catId]?.title || catId,
        categoryEmoji: categoryInfo[catId]?.emoji || '👤',
      };
      categoryId = catId;
      break;
    }
  }

  if (!selectedCoach) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#030305',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '16px',
            fontFamily: "'Bebas Neue', sans-serif",
          }}>
            Coach not found
          </h1>
          <button
            onClick={onBack}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              backgroundColor: '#f97316',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Bebas Neue', sans-serif",
            }}
          >
            ← Back to Coaches
          </button>
        </div>
      </div>
    );
  }

  const coach = selectedCoach;
  const coachSpecificPerks = coach.additionalPerks || [];
  const varsityPriceDisplay = coach.varsityPrice 
    ? `$${coach.varsityPrice}/mo` 
    : '$10/mo – $100/mo';

  // Handle Walk-On button click
  const handleWalkOnClick = () => {
    onBack();
  };

  // Handle Locker Room button click
  const handleLockerRoomClick = async () => {
    setIsSubmitting(true);
    
    try {
      // Pseudo-code for creating pending payment intent for Locker Room
      console.log('Creating Locker Room Pass request for', coach.name);
      console.log('Payment details collected but not charged');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success
      setShowSuccess(true);
    } catch (error) {
      console.error('Locker Room request failed:', error);
      alert('There was an error processing your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Varsity button click - show payment form
  const handleVarsityClick = () => {
    setShowPaymentForm(true);
  };

  // Handle payment form submission
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Pseudo-code for creating pending payment intent
      console.log('Creating pending payment intent for', coach.name);
      console.log('Payment details collected but not charged');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success screen
      setShowSuccess(true);
      setShowPaymentForm(false);
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      alert('There was an error processing your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageSrc = () => {
    return `https://images.unsplash.com/photo-1609503842755-77f4a81d69ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50b3IlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYyNjQ0MTgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral`;
  };

  // Base Varsity features
  const baseVarsityFeatures = [
    'Everything in Walk-On',
    'Weekly check-ins with your coach',
    'Structured curriculum & playbook',
    'Resume & LinkedIn optimization',
    'Professional network & referrals',
    'The Locker Room included',
    'Priority event access',
  ];

  if (showSuccess) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#030305',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}>
        <div style={{ 
          flex: 1,
          maxWidth: '800px',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          textAlign: 'center',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(249, 115, 22, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
          }}>
            <span style={{ fontSize: '3rem' }}>🏀</span>
          </div>
          
          <h3 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '16px',
            fontFamily: "'Bebas Neue', sans-serif",
          }}>
            ISO Request Submitted!
          </h3>
          
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            marginBottom: '32px',
          }}>
            <p style={{
              fontSize: '1rem',
              color: '#cbd5e1',
              lineHeight: '1.6',
              marginBottom: '16px',
              fontFamily: "'Bebas Neue', sans-serif",
            }}>
              Your request has been sent to <span style={{ color: '#f97316', fontWeight: '600' }}>{coach.name}</span> for review.
            </p>
            <p style={{
              fontSize: '0.9375rem',
              color: '#94a3b8',
              lineHeight: '1.6',
              fontFamily: "'Bebas Neue', sans-serif",
            }}>
              Once they accept your ISO request, you'll have a consultation meeting to ensure both of you are aligned and ready for this coaching journey.
            </p>
          </div>
          
          <button
            onClick={onBack}
            style={{
              padding: '12px 32px',
              borderRadius: '12px',
              backgroundColor: '#f97316',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease-out',
              fontFamily: "'Bebas Neue', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ea580c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f97316';
            }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  if (showPaymentForm) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#030305',
        padding: '80px 32px',
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          <button
            onClick={() => setShowPaymentForm(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '32px',
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: '#94a3b8',
              fontSize: '0.9375rem',
              fontWeight: '500',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: "'Bebas Neue', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Back
          </button>

          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '24px',
            fontFamily: "'Bebas Neue', sans-serif",
          }}>
            Payment Information
          </h3>
          <p style={{
            fontSize: '0.9375rem',
            color: '#94a3b8',
            lineHeight: '1.6',
            marginBottom: '32px',
            fontFamily: "'Bebas Neue', sans-serif",
          }}>
            Enter your payment details below. Your card will not be charged until {coach.name} accepts your ISO request.
          </p>
          
          <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#cbd5e1',
                marginBottom: '8px',
                fontFamily: "'Bebas Neue', sans-serif",
              }}>
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#1e293b',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem',
                  fontFamily: "'Bebas Neue', sans-serif",
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#cbd5e1',
                  marginBottom: '8px',
                  fontFamily: "'Bebas Neue', sans-serif",
                }}>
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '1rem',
                    fontFamily: "'Bebas Neue', sans-serif",
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#cbd5e1',
                  marginBottom: '8px',
                  fontFamily: "'Bebas Neue', sans-serif",
                }}>
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '1rem',
                    fontFamily: "'Bebas Neue', sans-serif",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#cbd5e1',
                marginBottom: '8px',
                fontFamily: "'Bebas Neue', sans-serif",
              }}>
                Name on Card
              </label>
              <input
                type="text"
                placeholder="John Doe"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#1e293b',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem',
                  fontFamily: "'Bebas Neue', sans-serif",
                }}
              />
            </div>

            <p style={{
              fontSize: '0.75rem',
              color: '#94a3b8',
              lineHeight: '1.5',
              textAlign: 'center',
              marginTop: '8px',
              padding: '12px',
              backgroundColor: 'rgba(251, 191, 36, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              fontFamily: "'Bebas Neue', sans-serif",
            }}>
              You won't be charged until your coach accepts your ISO. If they don't respond within 48 hours, we'll match you with another coach or cancel your request.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  borderRadius: '12px',
                  backgroundColor: '#334155',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-out',
                  fontFamily: "'Bebas Neue', sans-serif",
                }}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  flex: 2,
                  padding: '12px 24px',
                  borderRadius: '12px',
                  backgroundColor: isSubmitting ? '#64748b' : '#fbbf24',
                  color: '#1e293b',
                  fontSize: '1rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease-out',
                  fontFamily: "'Bebas Neue', sans-serif",
                }}
              >
                {isSubmitting ? 'Processing...' : 'Submit ISO Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#030305',
      paddingTop: '40px',
      paddingBottom: '40px',
      paddingLeft: '32px',
      paddingRight: '32px',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
      }}>
        {/* Logo at top left */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px',
        }}>
          <img 
            src="/ISOMetallic.png" 
            alt="ISO Logo" 
            style={{
              height: '40px',
              width: 'auto',
              objectFit: 'contain',
            }}
            onError={(e) => {
              // Fallback if logo doesn't exist yet
              e.currentTarget.style.display = 'none';
            }}
          />
          <span style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            fontFamily: "'Bebas Neue', sans-serif",
          }}>
            ISO
          </span>
        </div>

        {/* Hero Section */}
        <div style={{
          marginBottom: '32px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
              fontFamily: "'Bebas Neue', sans-serif",
            }}>
              Call an ISO
            </h1>
            <button
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: '#94a3b8',
                fontSize: '0.9375rem',
                fontWeight: '500',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: "'Bebas Neue', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <ArrowLeft style={{ width: '16px', height: '16px' }} />
              Back to Coaches
            </button>
          </div>
          <p style={{
            fontSize: '1.25rem',
            color: '#94a3b8',
            marginBottom: '20px',
            fontFamily: "'Bebas Neue', sans-serif",
          }}>
            Request coaching from {coach.name}
          </p>

          {/* Coach Info Block */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '10px',
              overflow: 'hidden',
              backgroundColor: '#1e293b',
              flexShrink: 0,
            }}>
              <ImageWithFallback
                src={getImageSrc()}
                alt={coach.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: coach.name === 'Anis Benyoucef' ? 'contain' : 'cover',
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '2px',
                fontFamily: "'Bebas Neue', sans-serif",
              }}>
                {coach.name}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#f97316',
                marginBottom: '8px',
                fontFamily: "'Bebas Neue', sans-serif",
              }}>
                {coach.role}
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                <span style={{
                  fontSize: '1.25rem',
                  marginRight: '4px',
                }}>
                  {coach.categoryEmoji}
                </span>
                <span style={{
                  fontSize: '0.875rem',
                  color: '#cbd5e1',
                  fontFamily: "'Bebas Neue', sans-serif",
                }}>
                  {coach.categoryTitle}
                </span>
                {coach.specialization.slice(0, 3).map((spec, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.875rem',
                      backgroundColor: 'rgba(30, 41, 59, 0.7)',
                      color: '#cbd5e1',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      border: '1px solid #334155',
                      fontFamily: "'Bebas Neue', sans-serif",
                    }}
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          alignItems: 'stretch',
          marginBottom: '32px',
        }}>
          {/* Card 1: Walk-On Program */}
          <div
            onMouseEnter={() => setHoveredCard('walk-on')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              backgroundColor: '#0f172a',
              borderRadius: '16px',
              border: `1px solid ${hoveredCard === 'walk-on' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)'}`,
              padding: '24px',
              transition: 'all 0.3s ease-out',
              transform: hoveredCard === 'walk-on' ? 'scale(1.02)' : 'scale(1)',
              boxShadow: hoveredCard === 'walk-on' 
                ? '0 10px 30px rgba(0, 0, 0, 0.4)' 
                : '0 4px 12px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(148, 163, 184, 0.2)',
                color: '#cbd5e1',
                fontSize: '0.7rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '10px',
              }}>
                Free
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '6px',
                fontFamily: "'Bebas Neue', sans-serif",
              }}>
                Walk-On Program
              </h3>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '2px',
                fontFamily: "'Bebas Neue', sans-serif",
              }}>
                Free
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: '#94a3b8',
                fontStyle: 'italic',
                marginBottom: '8px',
              }}>
                Donations welcome
              </p>
              <p style={{
                fontSize: '0.8125rem',
                color: '#94a3b8',
                lineHeight: '1.5',
                marginBottom: '16px',
                fontFamily: "'Bebas Neue', sans-serif",
              }}>
                Stay connected at your own pace.
              </p>
            </div>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              marginBottom: '20px',
              flex: 1,
            }}>
              {[
                '30-minute monthly check-in',
                'Coaching nights & events',
                'Pathway resources',
                'Community support',
              ].map((feature, index) => (
                <li
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                    fontSize: '0.8125rem',
                    color: '#cbd5e1',
                    lineHeight: '1.5',
                  }}
                >
                  <span style={{
                    color: '#f97316',
                    marginRight: '8px',
                    fontSize: '1rem',
                    flexShrink: 0,
                  }}>•</span>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleWalkOnClick}
              style={{
              width: '100%',
              padding: '10px 20px',
              borderRadius: '10px',
              backgroundColor: '#334155',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease-out',
                fontFamily: "'Bebas Neue', sans-serif",
                boxShadow: hoveredCard === 'walk-on' 
                  ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#475569';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#334155';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Continue as Walk-On
            </button>
          </div>

          {/* Card 2: Locker Room Pass */}
          <div
            onMouseEnter={() => setHoveredCard('locker-room')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              backgroundColor: '#0f172a',
              borderRadius: '16px',
              border: `1px solid ${hoveredCard === 'locker-room' ? 'rgba(249, 115, 22, 0.4)' : 'rgba(249, 115, 22, 0.25)'}`,
              padding: '24px',
              transition: 'all 0.3s ease-out',
              transform: hoveredCard === 'locker-room' ? 'scale(1.02)' : 'scale(1)',
              boxShadow: hoveredCard === 'locker-room'
                ? '0 10px 30px rgba(249, 115, 22, 0.2), 0 0 20px rgba(249, 115, 22, 0.1)'
                : '0 4px 12px rgba(249, 115, 22, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: '8px',
                backgroundColor: '#f97316',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '10px',
              }}>
                Popular
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '6px',
                fontFamily: "'Bebas Neue', sans-serif",
              }}>
                Locker Room Pass
              </h3>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '8px',
                fontFamily: "'Bebas Neue', sans-serif",
              }}>
                $5/mo
              </div>
              <p style={{
                fontSize: '0.8125rem',
                color: '#94a3b8',
                lineHeight: '1.5',
                marginBottom: '16px',
                fontFamily: "'Bebas Neue', sans-serif",
              }}>
                Coach will reach out to you within 24-48 hrs for monthly meetings. Your portal will include all the benefits of the Locker Room Pass.
              </p>
            </div>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              marginBottom: '20px',
              flex: 1,
            }}>
              {[
                'Everything in Walk-On',
                'Full access to The Locker Room video library',
                'Community discussion space',
                'Motivational content drops',
                'Early event announcements',
              ].map((feature, index) => (
                <li
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                    fontSize: '0.8125rem',
                    color: '#cbd5e1',
                    lineHeight: '1.5',
                  }}
                >
                  <span style={{
                    color: '#f97316',
                    marginRight: '8px',
                    fontSize: '1rem',
                    flexShrink: 0,
                  }}>•</span>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleLockerRoomClick}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '10px 20px',
                borderRadius: '10px',
                backgroundColor: isSubmitting ? '#64748b' : '#f97316',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease-out',
                fontFamily: "'Bebas Neue', sans-serif",
                boxShadow: hoveredCard === 'locker-room'
                  ? '0 4px 12px rgba(249, 115, 22, 0.4)'
                  : '0 2px 8px rgba(249, 115, 22, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = '#ea580c';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = '#f97316';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {isSubmitting ? 'Processing...' : 'Continue with Locker Room Access'}
            </button>
          </div>

          {/* Card 3: Varsity Program (Emphasized) */}
          <div
            onMouseEnter={() => setHoveredCard('varsity')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              backgroundColor: '#0f172a',
              borderRadius: '16px',
              border: `2px solid ${hoveredCard === 'varsity' ? 'rgba(251, 191, 36, 0.5)' : 'rgba(251, 191, 36, 0.3)'}`,
              padding: '24px',
              transition: 'all 0.3s ease-out',
              transform: hoveredCard === 'varsity' ? 'scale(1.03)' : 'scale(1)',
              boxShadow: hoveredCard === 'varsity'
                ? '0 15px 40px rgba(251, 191, 36, 0.25), 0 0 30px rgba(251, 191, 36, 0.15)'
                : '0 8px 24px rgba(251, 191, 36, 0.15), 0 0 20px rgba(251, 191, 36, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(15, 23, 42, 0.9) 100%)',
              position: 'relative',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: '8px',
                backgroundColor: '#fbbf24',
                color: '#1e293b',
                fontSize: '0.7rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '10px',
              }}>
                Premium
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '6px',
                fontFamily: "'Bebas Neue', sans-serif",
              }}>
                Varsity Program
              </h3>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '2px',
                fontFamily: "'Bebas Neue', sans-serif",
              }}>
                {coach.varsityPrice ? `${varsityPriceDisplay} – $100/mo` : '$10/mo – $100/mo'}
              </div>
              <p style={{
                fontSize: '0.7rem',
                color: '#94a3b8',
                marginBottom: '6px',
                fontStyle: 'italic',
              }}>
                (varies by coach)
              </p>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  lineHeight: '1.5',
                  marginBottom: '12px',
                  fontStyle: 'italic',
                  fontFamily: "'Bebas Neue', sans-serif",
                }}>
                  Coaches set their own pricing based on expertise, experience, and availability.
                </p>
              <p style={{
                fontSize: '0.8125rem',
                color: '#94a3b8',
                lineHeight: '1.5',
                marginBottom: '16px',
                fontStyle: 'italic',
                fontFamily: "'Bebas Neue', sans-serif",
              }}>
                Weekly sessions & full support with {coach.name}.
              </p>
            </div>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              marginBottom: '20px',
              flex: 1,
            }}>
              {baseVarsityFeatures.map((feature, index) => (
                <li
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                    fontSize: '0.8125rem',
                    color: '#cbd5e1',
                    lineHeight: '1.5',
                  }}
                >
                  <span style={{
                    color: '#fbbf24',
                    marginRight: '8px',
                    fontSize: '1rem',
                    flexShrink: 0,
                  }}>•</span>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{feature}</span>
                </li>
              ))}
              
              {/* Coach-specific perks */}
              {coachSpecificPerks.map((perk, index) => (
                <li
                  key={`perk-${index}`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                    fontSize: '0.8125rem',
                    color: '#fbbf24',
                    lineHeight: '1.5',
                  }}
                >
                  <span style={{
                    color: '#fbbf24',
                    marginRight: '8px',
                    fontSize: '1rem',
                    flexShrink: 0,
                  }}>★</span>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: '500' }}>{perk}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleVarsityClick}
              style={{
                width: '100%',
                padding: '10px 20px',
                borderRadius: '10px',
                backgroundColor: '#fbbf24',
                color: '#1e293b',
                fontSize: '0.875rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease-out',
                fontFamily: "'Bebas Neue', sans-serif",
                boxShadow: hoveredCard === 'varsity'
                  ? '0 6px 16px rgba(251, 191, 36, 0.4)'
                  : '0 4px 12px rgba(251, 191, 36, 0.3)',
                marginBottom: '12px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f59e0b';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fbbf24';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Start Varsity with {coach.name}
            </button>

            {/* Payment note */}
            <p style={{
              fontSize: '0.7rem',
              color: '#94a3b8',
              lineHeight: '1.4',
              textAlign: 'center',
              marginTop: '8px',
              marginBottom: 0,
              fontFamily: "'Bebas Neue', sans-serif",
            }}>
              You won't be charged until your coach accepts your ISO. If they don't respond within 48 hours, we'll match you with another coach or cancel your request.
            </p>
          </div>
        </div>

        {/* Trust Note and Back Link */}
        <div style={{
          textAlign: 'center',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          marginTop: '48px',
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: '#94a3b8',
            lineHeight: '1.5',
            marginBottom: '32px',
            fontFamily: "'Bebas Neue', sans-serif",
          }}>
            You won't be charged until your coach accepts your ISO. If they don't respond within 48 hours, we'll match you with another coach or cancel your request.
          </p>
          
          {/* Logo at bottom */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}>
            <img 
              src="/ISOMetallic.png" 
              alt="ISO Logo" 
              style={{
                height: '40px',
                width: 'auto',
                objectFit: 'contain',
              }}
              onError={(e) => {
                // Fallback if logo doesn't exist yet
                e.currentTarget.style.display = 'none';
              }}
            />
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'white',
              fontFamily: "'Bebas Neue', sans-serif",
            }}>
              ISO
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

