import * as React from 'react';
import { useState } from 'react';

export function Pricing() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const colorMap: Record<string, string> = {
    'bg-slate-600': '#334155',
    'bg-orange-500': '#f97316',
    'bg-yellow-500': '#eab308',
  };

  const borderPalette: Record<string, { base: string; hover: string }> = {
    'walk-on': { base: 'rgba(148, 163, 184, 0.35)', hover: 'rgba(226, 232, 240, 0.8)' },
    'locker-room': { base: 'rgba(251, 191, 36, 0.4)', hover: 'rgba(253, 224, 71, 0.85)' },
    'varsity': { base: 'rgba(129, 140, 248, 0.45)', hover: 'rgba(168, 85, 247, 0.9)' },
  };

  const pricingCards = [
    {
      id: 'walk-on',
      title: 'Walk-On',
      badge: 'Free',
      badgeColor: 'bg-slate-600',
      price: 'Free',
      description: 'Perfect for those who want to get started with ISO and see if it\'s a good fit for them.',
      features: [
        '30-minute monthly check-in',
        'Access to coaching nights & events',
        'Pathway-specific resources',
        'Community support',
      ],
      buttonText: 'Join Free',
      buttonColor: 'bg-slate-600 hover:bg-slate-500',
      borderGradient: 'linear-gradient(135deg, rgba(156, 163, 175, 0.8), rgba(156, 163, 175, 0.2))',
      emphasis: false,
    },
    {
      id: 'locker-room',
      title: 'Locker Room Pass',
      badge: 'Popular',
      badgeColor: 'bg-orange-500',
      price: '$5/month',
      description: 'Perfect for those who want extra inspiration, content, and community without committing to the full varsity program.',
      features: [
        'Everything in Walk-On',
        'Full access to The Locker Room video library',
        'Community discussions',
        'Motivational content drops',
        'Early event announcements',
      ],
      buttonText: 'Get Access',
      buttonColor: 'bg-orange-500 hover:bg-orange-600',
      borderGradient: 'linear-gradient(135deg, rgba(217, 180, 104, 0.9), rgba(217, 180, 104, 0.2))',
      emphasis: true,
    },
    {
      id: 'varsity',
      title: 'Varsity Program',
      badge: 'Premium',
      badgeColor: 'bg-yellow-500',
      price: 'Varies by coach',
      priceSubtext: undefined,
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
      borderGradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.9), rgba(59, 130, 246, 0.9), rgba(168, 85, 247, 0.9))',
      emphasis: false,
    },
  ];

  return (
    <section style={{
      backgroundColor: '#05060A',
      paddingTop: '50px',
      paddingBottom: '50px',
      paddingLeft: '20px',
      paddingRight: '20px',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
      }}>
        {/* Section Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
        }}>
          <h2 style={{
            fontSize: '3.75rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '12px',
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '16px',
          alignItems: 'stretch',
        }}>
          {pricingCards.map((card) => {
            const isHovered = hoveredCard === card.id;
            const boxShadow = isHovered
              ? card.id === 'varsity'
                ? '0 24px 50px rgba(249, 115, 22, 0.35), 0 0 35px rgba(59, 130, 246, 0.25)'
                : card.emphasis
                ? '0 20px 40px rgba(249, 115, 22, 0.25), 0 0 24px rgba(249, 115, 22, 0.15)'
                : '0 16px 32px rgba(0, 0, 0, 0.32)'
              : card.emphasis
              ? '0 12px 26px rgba(249, 115, 22, 0.2)'
              : '0 6px 18px rgba(0, 0, 0, 0.25)';

            return (
              <div
                key={card.id}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  position: 'relative',
                  background: '#0f172a',
                  borderRadius: '20px',
                  padding: '18px 16px',
                  transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out',
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                  boxShadow,
                overflow: 'hidden',
                  border: `1px solid ${isHovered ? borderPalette[card.id].hover : borderPalette[card.id].base}`
                }}
              >
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Badge */}
                <div style={{
                  display: 'inline-block',
                  padding: '3px 10px',
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
                  fontSize: '1.35rem',
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
                    fontSize: '1.1rem',
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
                  marginBottom: '18px',
                  flex: 1,
                }}>
                  {card.features.map((feature, index) => (
                    <li
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginBottom: '8px',
                        fontSize: '0.9rem',
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
                    padding: '8px 15px',
                    borderRadius: '12px',
                    background: card.id === 'varsity'
                      ? 'linear-gradient(135deg, #f97316, #fb7185, #a855f7)'
                      : `linear-gradient(135deg, ${borderPalette[card.id].base}, rgba(255,255,255,0.1))`,
                    color: card.id === 'walk-on' ? '#0f172a' : '#0b1120',
                    fontSize: '1rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-out',
                    fontFamily: "'Poppins', sans-serif",
                    boxShadow: hoveredCard === card.id
                      ? '0 4px 14px rgba(0, 0, 0, 0.35)'
                      : '0 2px 8px rgba(0, 0, 0, 0.2)',
                    transform: hoveredCard === card.id ? 'translateY(-2px)' : 'translateY(0)',
                  }}
                  onMouseEnter={(e) => {
                    if (card.id !== 'varsity') {
                      e.currentTarget.style.background = `linear-gradient(135deg, ${borderPalette[card.id].hover}, rgba(255,255,255,0.25))`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (card.id !== 'varsity') {
                      e.currentTarget.style.background = `linear-gradient(135deg, ${borderPalette[card.id].base}, rgba(255,255,255,0.1))`;
                    }
                  }}
                >
                  {card.buttonText}
                </button>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

