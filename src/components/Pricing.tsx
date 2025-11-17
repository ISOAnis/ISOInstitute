import { useState } from 'react';

export function Pricing() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const pricingCards = [
    {
      id: 'walk-on',
      title: 'Walk-On',
      badge: 'Free',
      badgeColor: 'bg-slate-600',
      price: 'Free',
      description: null,
      features: [
        '30-minute monthly check-in',
        'Access to coaching nights & events',
        'Pathway-specific resources',
        'Community support',
      ],
      buttonText: 'Join Free',
      buttonColor: 'bg-slate-700 hover:bg-slate-600',
      emphasis: false,
    },
    {
      id: 'locker-room',
      title: 'Locker Room Pass',
      badge: 'Popular',
      badgeColor: 'bg-orange-500',
      price: '$5/month',
      description: 'Perfect for those who want inspiration, content, and community without committing to a coach.',
      features: [
        'Everything in Walk-On',
        'Full access to The Locker Room video library',
        'Community discussions',
        'Motivational content drops',
        'Early event announcements',
      ],
      buttonText: 'Get Access',
      buttonColor: 'bg-orange-500 hover:bg-orange-600',
      emphasis: true,
    },
    {
      id: 'varsity',
      title: 'Varsity Program',
      badge: 'Premium',
      badgeColor: 'bg-yellow-500',
      price: '$10/mo – $100/mo',
      priceSubtext: 'varies by coach',
      description: 'Coaches set their own pricing based on expertise, experience, and availability.',
      features: [
        'Weekly check-ins with your coach',
        'Structured curriculum & playbook',
        'Resume review & interview prep',
        'Professional network & referrals',
        'Locker Room included',
        'Priority event access',
      ],
      buttonText: 'Meet the Coaches',
      buttonColor: 'bg-yellow-500 hover:bg-yellow-600',
      emphasis: false,
    },
  ];

  return (
    <section style={{
      backgroundColor: '#05060A',
      paddingTop: '80px',
      paddingBottom: '80px',
      paddingLeft: '32px',
      paddingRight: '32px',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
      }}>
        {/* Section Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '64px',
        }}>
          <h2 style={{
            fontSize: '3.75rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '16px',
            fontFamily: "'Poppins', sans-serif",
          }}>
            Membership Options
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#94a3b8',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.75',
            fontFamily: "'Poppins', sans-serif",
          }}>
            Choose what fits your journey. ISO is designed to meet you where you are.
          </p>
        </div>

        {/* Pricing Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
          alignItems: 'stretch',
        }}>
          {pricingCards.map((card) => (
            <div
              key={card.id}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                position: 'relative',
                backgroundColor: '#0f172a',
                borderRadius: '20px',
                border: `1px solid ${card.emphasis ? 'rgba(249, 115, 22, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                padding: '40px 32px',
                transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out',
                transform: hoveredCard === card.id ? 'scale(1.02)' : 'scale(1)',
                boxShadow: card.emphasis
                  ? hoveredCard === card.id
                    ? '0 20px 40px rgba(249, 115, 22, 0.2), 0 0 30px rgba(249, 115, 22, 0.1)'
                    : '0 10px 30px rgba(249, 115, 22, 0.15), 0 0 20px rgba(249, 115, 22, 0.05)'
                  : hoveredCard === card.id
                  ? '0 20px 40px rgba(0, 0, 0, 0.3)'
                  : '0 10px 30px rgba(0, 0, 0, 0.2)',
                borderColor: hoveredCard === card.id && card.emphasis ? 'rgba(249, 115, 22, 0.5)' : undefined,
                overflow: 'hidden',
              }}
            >
              {/* Gradient background for emphasis */}
              {card.emphasis && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(249, 115, 22, 0.02) 100%)',
                  pointerEvents: 'none',
                }} />
              )}

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Badge */}
                <div style={{
                  display: 'inline-block',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  backgroundColor: card.badgeColor,
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '24px',
                }}>
                  {card.badge}
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '16px',
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  {card.title}
                </h3>

                {/* Price */}
                <div style={{
                  marginBottom: card.description ? '12px' : '24px',
                }}>
                  <div style={{
                    fontSize: '1.875rem',
                    fontWeight: 'bold',
                    color: 'white',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    {card.price}
                  </div>
                  {card.priceSubtext && (
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#94a3b8',
                      marginTop: '4px',
                      fontStyle: 'italic',
                    }}>
                      {card.priceSubtext}
                    </div>
                  )}
                </div>

                {/* Description */}
                {card.description && (
                  <p style={{
                    fontSize: '1rem',
                    color: '#94a3b8',
                    lineHeight: '1.6',
                    marginBottom: '24px',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    {card.description}
                  </p>
                )}

                {/* Features List */}
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  marginBottom: '32px',
                  flex: 1,
                }}>
                  {card.features.map((feature, index) => (
                    <li
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginBottom: '16px',
                        fontSize: '1rem',
                        color: '#cbd5e1',
                        lineHeight: '1.6',
                      }}
                    >
                      <span style={{
                        color: '#f97316',
                        marginRight: '12px',
                        fontSize: '1.25rem',
                        flexShrink: 0,
                      }}>•</span>
                      <span style={{ fontFamily: "'Poppins', sans-serif" }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    backgroundColor: card.buttonColor.split(' ')[0],
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-out',
                    fontFamily: "'Poppins', sans-serif",
                    boxShadow: hoveredCard === card.id
                      ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.2)',
                    transform: hoveredCard === card.id ? 'translateY(-2px)' : 'translateY(0)',
                  }}
                  onMouseEnter={(e) => {
                    const baseColor = card.buttonColor.split(' ')[0];
                    e.currentTarget.style.backgroundColor = baseColor === 'bg-slate-700' ? '#475569' :
                                                          baseColor === 'bg-orange-500' ? '#ea580c' :
                                                          '#f59e0b';
                  }}
                  onMouseLeave={(e) => {
                    const baseColor = card.buttonColor.split(' ')[0];
                    e.currentTarget.style.backgroundColor = baseColor === 'bg-slate-700' ? '#334155' :
                                                          baseColor === 'bg-orange-500' ? '#f97316' :
                                                          '#eab308';
                  }}
                >
                  {card.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

