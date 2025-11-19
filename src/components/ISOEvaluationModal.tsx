import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface ISOEvaluationModalProps {
  onClose: () => void;
  categoryTitle: string;
  mentorName?: string;
  categoryId?: string;
  menteeProfile?: {
    motivationLevel?: 'exploring' | 'committed' | 'all-in';
    timeframe?: string;
  };
  mentorDetails?: {
    name?: string;
    varsityPrice?: number;
    varsityPriceRange?: string; // Optional override like "$25/mo – $60/mo"
    varsityPerks?: string[]; // Coach-specific extra perks
    yearsExperience: number;
    tier: 'standard' | 'specialist' | 'premium';
    additionalPerks?: string[];
    successRate?: string;
  };
}

// Helper function to scroll to court
const scrollToCourt = () => {
  const courtElement = document.getElementById('iso-court') || document.getElementById('basketball-court');
  if (courtElement) {
    courtElement.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
};

export function ISOEvaluationModal({ 
  onClose, 
  categoryTitle, 
  mentorName, 
  categoryId = 'global', 
  menteeProfile, 
  mentorDetails 
}: ISOEvaluationModalProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Base Varsity features (same for every coach)
  const baseVarsityFeatures = [
    'Everything in Walk-On',
    'Weekly check-ins with your coach',
    'Structured curriculum & playbook',
    'Resume & LinkedIn optimization',
    'Professional network & referrals',
    'The Locker Room included',
    'Priority event access',
  ];

  // Coach-specific perks
  const coachSpecificPerks = mentorDetails?.varsityPerks || mentorDetails?.additionalPerks || [];

  // Determine price display
  const varsityPriceDisplay = mentorDetails?.varsityPriceRange || '$10/mo – $100/mo';
  const coachName = mentorDetails?.name || mentorName || 'your coach';

  // Handle Walk-On button click
  const handleWalkOnClick = () => {
    onClose();
    // Small delay to ensure modal closes before scrolling
    setTimeout(() => {
      scrollToCourt();
    }, 100);
  };

  // Handle Locker Room button click
  const handleLockerRoomClick = () => {
    onClose();
    setTimeout(() => {
      scrollToCourt();
    }, 100);
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
      // In production, this would be an API call to your backend
      /*
      const paymentIntent = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coachId: mentorDetails?.name,
          coachName: coachName,
          amount: mentorDetails?.varsityPrice || 50, // Use actual price
          currency: 'usd',
          capture_method: 'manual', // Don't charge immediately
          metadata: {
            program: 'varsity',
            status: 'pending_coach_acceptance'
          }
        })
      });
      
      const { clientSecret, paymentIntentId } = await paymentIntent.json();
      
      // Store payment intent ID for later use when coach accepts
      localStorage.setItem('pendingPaymentIntent', paymentIntentId);
      */

      // Mock implementation
      console.log('Creating pending payment intent for', coachName);
      console.log('Payment details collected but not charged');
      console.log('Payment will be processed when coach accepts ISO request');

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

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4" 
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-900 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-orange-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-orange-600 to-orange-500 p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/30 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="pr-12">
            <h2 
              className="text-white text-3xl font-bold mb-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Call an ISO
            </h2>
            <p 
              className="text-white/90 text-lg"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
            {mentorName ? `Request mentorship from ${mentorName}` : `Request mentorship in ${categoryTitle}`}
          </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 bg-slate-900" style={{
          maxHeight: 'calc(90vh - 180px)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {showSuccess ? (
            /* Success Screen */
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              textAlign: 'center',
              padding: '40px 20px',
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
                fontFamily: "'Poppins', sans-serif",
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
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  {mentorName ? (
                    <>
                      Your request has been sent to <span style={{ color: '#f97316', fontWeight: '600' }}>{mentorName}</span> for review.
                    </>
                  ) : (
                    "Your request has been sent to the coach for review."
                  )}
                </p>
                <p style={{
                  fontSize: '0.9375rem',
                  color: '#94a3b8',
                  lineHeight: '1.6',
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  Once they accept your ISO request, you'll have a consultation meeting to ensure both of you are aligned and ready for this coaching journey.
                </p>
              </div>
              
              <div style={{
                backgroundColor: '#1e293b',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '32px',
                width: '100%',
                maxWidth: '600px',
              }}>
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '20px',
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  What Happens Next?
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'rgba(249, 115, 22, 0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}>
                      <span style={{ color: '#f97316', fontWeight: 'bold', fontSize: '1rem' }}>1</span>
                    </div>
                      <div>
                      <p style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '4px',
                        fontFamily: "'Poppins', sans-serif",
                      }}>
                        Mentor reviews your profile
                      </p>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#94a3b8',
                        fontFamily: "'Poppins', sans-serif",
                      }}>
                        They'll assess if they can help you achieve your goals
                      </p>
                      </div>
                      </div>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'rgba(249, 115, 22, 0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}>
                      <span style={{ color: '#f97316', fontWeight: 'bold', fontSize: '1rem' }}>2</span>
                    </div>
                    <div>
                      <p style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '4px',
                        fontFamily: "'Poppins', sans-serif",
                      }}>
                        Consultation meeting is scheduled
                      </p>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#94a3b8',
                        fontFamily: "'Poppins', sans-serif",
                      }}>
                        You'll discuss your goals in detail to ensure alignment
                      </p>
                      </div>
                      </div>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'rgba(249, 115, 22, 0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}>
                      <span style={{ color: '#f97316', fontWeight: 'bold', fontSize: '1rem' }}>3</span>
                      </div>
                    <div>
                      <p style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '4px',
                        fontFamily: "'Poppins', sans-serif",
                      }}>
                        Decision time
                      </p>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#94a3b8',
                        fontFamily: "'Poppins', sans-serif",
                      }}>
                        Both of you decide if it's the right fit to move forward
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <p style={{
                fontSize: '0.9375rem',
                color: '#94a3b8',
                marginBottom: '24px',
                fontFamily: "'Poppins', sans-serif",
              }}>
                We'll send you email updates or check your player portal for updates.
              </p>
              
                  <button
                onClick={onClose}
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
                  fontFamily: "'Poppins', sans-serif",
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
          ) : !showPaymentForm ? (
          <div className="space-y-8">
            {/* Pricing Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              alignItems: 'stretch',
            }}>
              {/* Card 1: Walk-On Program */}
              <div
                onMouseEnter={() => setHoveredCard('walk-on')}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '18px',
                  border: `1px solid ${hoveredCard === 'walk-on' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)'}`,
                  padding: '32px',
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
                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(148, 163, 184, 0.2)',
                    color: '#cbd5e1',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '16px',
                  }}>
                    Free
                      </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '8px',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    Walk-On Program
                  </h3>
                  <div style={{
                    fontSize: '1.75rem',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '4px',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    Free
                      </div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#94a3b8',
                    fontStyle: 'italic',
                    marginBottom: '12px',
                  }}>
                    Donations welcome
                  </p>
                  <p style={{
                    fontSize: '0.9375rem',
                    color: '#94a3b8',
                    lineHeight: '1.6',
                    marginBottom: '24px',
                  }}>
                    Stay connected at your own pace.
                  </p>
                    </div>
                    
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  marginBottom: '24px',
                  flex: 1,
                }}>
                  {[
                    '30-minute monthly check-in',
                    'Mentorship nights & events',
                    'Pathway resources',
                    'Community support',
                  ].map((feature, index) => (
                    <li
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginBottom: '12px',
                        fontSize: '0.9375rem',
                        color: '#cbd5e1',
                        lineHeight: '1.6',
                      }}
                    >
                      <span style={{
                        color: '#f97316',
                        marginRight: '10px',
                        fontSize: '1.125rem',
                        flexShrink: 0,
                      }}>•</span>
                      <span style={{ fontFamily: "'Poppins', sans-serif" }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                  <button
                  onClick={handleWalkOnClick}
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    backgroundColor: '#334155',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-out',
                    fontFamily: "'Poppins', sans-serif",
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
                  borderRadius: '18px',
                  border: `1px solid ${hoveredCard === 'locker-room' ? 'rgba(249, 115, 22, 0.4)' : 'rgba(249, 115, 22, 0.25)'}`,
                  padding: '32px',
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
                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    backgroundColor: '#f97316',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '16px',
                  }}>
                    Popular
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '8px',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    Locker Room Pass
                  </h3>
                  <div style={{
                    fontSize: '1.75rem',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '12px',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    $5/mo
                  </div>
                  <p style={{
                    fontSize: '0.9375rem',
                    color: '#94a3b8',
                    lineHeight: '1.6',
                    marginBottom: '24px',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    Coach will reach out to you within 24-48 hrs for monthly meetings. Your portal will include all the benefits of the Locker Room Pass.
                  </p>
                </div>

                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  marginBottom: '24px',
                  flex: 1,
                }}>
                  {[
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
                        marginBottom: '12px',
                        fontSize: '0.9375rem',
                        color: '#cbd5e1',
                        lineHeight: '1.6',
                      }}
                    >
                      <span style={{
                        color: '#f97316',
                        marginRight: '10px',
                        fontSize: '1.125rem',
                        flexShrink: 0,
                      }}>•</span>
                      <span style={{ fontFamily: "'Poppins', sans-serif" }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleLockerRoomClick}
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    backgroundColor: '#f97316',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-out',
                    fontFamily: "'Poppins', sans-serif",
                    boxShadow: hoveredCard === 'locker-room'
                      ? '0 4px 12px rgba(249, 115, 22, 0.4)'
                      : '0 2px 8px rgba(249, 115, 22, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ea580c';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f97316';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Continue with Locker Room Access
                </button>
              </div>
              
              {/* Card 3: Varsity Program (Emphasized) */}
              <div
                onMouseEnter={() => setHoveredCard('varsity')}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '20px',
                  border: `2px solid ${hoveredCard === 'varsity' ? 'rgba(251, 191, 36, 0.5)' : 'rgba(251, 191, 36, 0.3)'}`,
                  padding: '36px',
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
                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    backgroundColor: '#fbbf24',
                    color: '#1e293b',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '16px',
                  }}>
                    Premium
            </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '8px',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    Varsity Program
                  </h3>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '4px',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    {varsityPriceDisplay}
              </div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    marginBottom: '12px',
                    fontStyle: 'italic',
                  }}>
                    Price varies by coach, expertise, and availability.
                  </p>
                  <p style={{
                    fontSize: '0.9375rem',
                    color: '#94a3b8',
                    lineHeight: '1.6',
                    marginBottom: '24px',
                    fontStyle: 'italic',
                  }}>
                    Weekly sessions & full support with {coachName}.
                  </p>
                </div>

                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  marginBottom: '24px',
                  flex: 1,
                }}>
                  {baseVarsityFeatures.map((feature, index) => (
                    <li
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginBottom: '12px',
                        fontSize: '0.9375rem',
                        color: '#cbd5e1',
                        lineHeight: '1.6',
                      }}
                    >
                      <span style={{
                        color: '#fbbf24',
                        marginRight: '10px',
                        fontSize: '1.125rem',
                        flexShrink: 0,
                      }}>•</span>
                      <span style={{ fontFamily: "'Poppins', sans-serif" }}>{feature}</span>
                    </li>
                  ))}
                  
                  {/* Coach-specific perks */}
                  {coachSpecificPerks.map((perk, index) => (
                    <li
                      key={`perk-${index}`}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginBottom: '12px',
                        fontSize: '0.9375rem',
                        color: '#fbbf24',
                        lineHeight: '1.6',
                      }}
                    >
                      <span style={{
                        color: '#fbbf24',
                        marginRight: '10px',
                        fontSize: '1.125rem',
                        flexShrink: 0,
                      }}>★</span>
                      <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '500' }}>{perk}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleVarsityClick}
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    backgroundColor: '#fbbf24',
                    color: '#1e293b',
                    fontSize: '1rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-out',
                    fontFamily: "'Poppins', sans-serif",
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
                  Start Varsity with {coachName}
                </button>
                
                {/* Payment note */}
                <p style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  lineHeight: '1.5',
                  textAlign: 'center',
                  marginTop: '8px',
                  marginBottom: 0,
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  You won't be charged until your coach accepts your ISO. If they don't respond within 48 hours, we'll match you with another coach or cancel your request.
                </p>
                      </div>
                      </div>
                    </div>
          ) : (
            /* Payment Form */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '24px',
                fontFamily: "'Poppins', sans-serif",
              }}>
                Payment Information
              </h3>
              <p style={{
                fontSize: '0.9375rem',
                color: '#94a3b8',
                lineHeight: '1.6',
                marginBottom: '24px',
                fontFamily: "'Poppins', sans-serif",
              }}>
                Enter your payment details below. Your card will not be charged until {coachName} accepts your ISO request.
              </p>
              
              <form onSubmit={handlePaymentSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#cbd5e1',
                    marginBottom: '8px',
                    fontFamily: "'Poppins', sans-serif",
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
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  />
                      </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '20px' }}>
                      <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#cbd5e1',
                      marginBottom: '8px',
                      fontFamily: "'Poppins', sans-serif",
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
                        fontFamily: "'Poppins', sans-serif",
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
                      fontFamily: "'Poppins', sans-serif",
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
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#cbd5e1',
                    marginBottom: '8px',
                    fontFamily: "'Poppins', sans-serif",
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
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  />
                </div>

                {/* Payment note */}
                <p style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  lineHeight: '1.5',
                  textAlign: 'center',
                  marginTop: 'auto',
                  marginBottom: '20px',
                  padding: '12px',
                  backgroundColor: 'rgba(251, 191, 36, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  You won't be charged until your coach accepts your ISO. If they don't respond within 48 hours, we'll match you with another coach or cancel your request.
                </p>

                <div style={{ display: 'flex', gap: '12px' }}>
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
                      fontFamily: "'Poppins', sans-serif",
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
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {isSubmitting ? 'Processing...' : 'Submit ISO Request'}
              </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
