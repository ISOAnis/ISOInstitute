import * as React from 'react';
import { useState, useEffect } from 'react';

interface PricingProps {
  onLoginClick?: () => void;
}

export function Pricing({ onLoginClick }: PricingProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const savedUser = localStorage.getItem('iso_demo_user');
      return savedUser !== null;
    } catch {
      return false;
    }
  });
  const [userPlan, setUserPlan] = useState<string | null>(null);

  // Update login state when localStorage changes
  useEffect(() => {
    const checkLoginState = () => {
      try {
        const savedUser = localStorage.getItem('iso_demo_user');
        const isUserLoggedIn = savedUser !== null;
        setIsLoggedIn(isUserLoggedIn);
        
        // Determine user's plan (default to 'walk-on' for logged-in users)
        // In the future, this could be stored in localStorage or fetched from an API
        if (isUserLoggedIn) {
          // Check if user has a plan stored in localStorage
          const savedPlan = localStorage.getItem('iso_demo_plan');
          setUserPlan(savedPlan || 'walk-on'); // Default to walk-on if no plan stored
        } else {
          setUserPlan(null);
        }
      } catch {
        setIsLoggedIn(false);
        setUserPlan(null);
      }
    };
    
    checkLoginState();
    window.addEventListener('storage', checkLoginState);
    const interval = setInterval(checkLoginState, 500);
    
    return () => {
      window.removeEventListener('storage', checkLoginState);
      clearInterval(interval);
    };
  }, []);

  const borderPalette: Record<string, { base: string; hover: string }> = {
    'walk-on': { base: 'rgba(148, 163, 184, 0.35)', hover: 'rgba(226, 232, 240, 0.8)' },
    'locker-room': { base: 'rgba(251, 191, 36, 0.4)', hover: 'rgba(253, 224, 71, 0.85)' },
    'varsity': { base: 'rgba(129, 140, 248, 0.45)', hover: 'rgba(168, 85, 247, 0.9)' },
  };

  type Competitor = {
    id: string;
    name: string;
    highlight?: boolean;
    response: string;
    affordable: string;
    relatable: string;
    structure: string;
    culture: string;
  };

  const competitors: Competitor[] = [
    {
      id: 'iso',
      name: 'ISO',
      response: '✔ Yes',
      affordable: '✔ High value',
      relatable: '✔ Near-peer coaches',
      structure: '✔ Weekly check-ins',
      culture: '✔ Yes',
      highlight: true,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Premium',
      response: '✖ No',
      affordable: '$39.99/mo',
      relatable: '✖ Not coacheship',
      structure: '✖ None',
      culture: '✖ No',
    },
    {
      id: 'leland',
      name: 'Leland',
      response: '✖ No',
      affordable: '✖ $$$',
      relatable: '✔ Elite coaches',
      structure: '✔ Session-based',
      culture: '✖ No',
    },
    {
      id: 'curious',
      name: 'Curious Cardinals',
      response: '✖ No',
      affordable: '✖ Expensive',
      relatable: '✔ Student coaches',
      structure: '✔ Some structure',
      culture: '✖ No',
    },
    {
      id: 'coachcruise',
      name: 'CoachCruise',
      response: '✖ Not guaranteed',
      affordable: '✔ Varies',
      relatable: '✔ Industry pros',
      structure: '✖ Unstructured',
      culture: '✖ No',
    },
    {
      id: 'adplist',
      name: 'ADPList',
      response: '✖ No',
      affordable: '✔ Free',
      relatable: '✔ Pros',
      structure: '✖ 20–30 min calls',
      culture: '✖ No',
    },
  ];

  const featureRows = [
    { label: 'Guaranteed Response', key: 'response' },
    { label: 'Affordable', key: 'affordable' },
    { label: 'Relatable Coaches', key: 'relatable' },
    { label: 'Structured Coacheship', key: 'structure' },
    { label: 'Faith/Culture Aware', key: 'culture' },
  ] as const;

  const benefitIcons = [
    {
      title: 'Guaranteed Replies',
      description: 'You always hear back from your ISO coach within the week.',
    },
    {
      title: 'High-Value Access',
      description: 'Affordable pathways without sacrificing depth or rigor.',
    },
    {
      title: 'Culture-Aware Coaches',
      description: 'Coaches who mirror your lived experience and values.',
    },
    {
      title: 'Weekly Accountability',
      description: 'Structured check-ins and playbooks to keep you on track.',
    },
  ];

  const isoColumnStyle = {
    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(59, 130, 246, 0.15))',
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
      badge: 'Best Value',
      badgeColor: 'bg-orange-500',
      price: '$10/month',
      description: 'Perfect for those who want extra inspiration, content, community, and ISO apparel without committing to the full varsity program.',
      features: [
        'Everything in Walk-On',
        'Full access to The Locker Room video library',
        'Access to Locker Room Store',
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
        'Access to Locker Room Store + The Journey Store',
        'Priority event access',
      ],
      buttonText: 'Meet the Coaches',
      buttonColor: 'bg-yellow-500 hover:bg-yellow-600',
      borderGradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.9), rgba(59, 130, 246, 0.9), rgba(168, 85, 247, 0.9))',
      emphasis: false,
    },
  ];

  return (
    <>
    <section style={{
      background: '#030305',
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
            fontFamily: "'Bebas Neue', sans-serif",
          }}>
            Membership Options
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.75',
            fontFamily: "'Bebas Neue', sans-serif",
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
            const isUserCurrentPlan = userPlan === card.id;
            
            // Glow effect for user's plan
            const userPlanGlow = isUserCurrentPlan
              ? card.id === 'walk-on'
                ? '0 0 30px rgba(148, 163, 184, 0.6), 0 0 50px rgba(148, 163, 184, 0.4)'
                : card.id === 'locker-room'
                ? '0 0 30px rgba(251, 191, 36, 0.6), 0 0 50px rgba(251, 191, 36, 0.4)'
                : '0 0 30px rgba(249, 115, 22, 0.6), 0 0 50px rgba(59, 130, 246, 0.4)'
              : '';
            
            const boxShadow = isHovered
              ? card.id === 'varsity'
                ? `0 24px 50px rgba(249, 115, 22, 0.35), 0 0 35px rgba(59, 130, 246, 0.25)${userPlanGlow ? ', ' + userPlanGlow : ''}`
                : card.emphasis
                ? `0 20px 40px rgba(249, 115, 22, 0.25), 0 0 24px rgba(249, 115, 22, 0.15)${userPlanGlow ? ', ' + userPlanGlow : ''}`
                : `0 16px 32px rgba(0, 0, 0, 0.32)${userPlanGlow ? ', ' + userPlanGlow : ''}`
              : isUserCurrentPlan
              ? userPlanGlow
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
                  background: '#0a0a0f',
                borderRadius: '20px',
                  padding: '18px 16px',
                transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out',
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                  boxShadow,
                overflow: 'hidden',
                  border: `1px solid ${isUserCurrentPlan ? borderPalette[card.id].hover : isHovered ? borderPalette[card.id].hover : borderPalette[card.id].base}`
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
                  fontFamily: "'Bebas Neue', sans-serif",
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
                    fontFamily: "'Bebas Neue', sans-serif",
                  }}>
                    {card.price}
                  </div>
                  {card.priceSubtext && (
                    <div style={{
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.7)',
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
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: '1.6',
                    marginBottom: '24px',
                    fontFamily: "'Bebas Neue', sans-serif",
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
                        alignItems: 'center',
                        marginBottom: '8px',
                        fontSize: '0.9rem',
                        color: '#cbd5e1',
                        lineHeight: '1.6',
                      }}
                    >
                      <span style={{
                        color: '#f97316',
                        marginRight: '12px',
                        fontSize: '0.5rem',
                        flexShrink: 0,
                      }}>●</span>
                      <span style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  onClick={() => {
                    if (card.id === 'walk-on' && onLoginClick && !isLoggedIn) {
                      onLoginClick();
                    }
                  }}
                  disabled={isUserCurrentPlan}
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
                    cursor: isUserCurrentPlan ? 'default' : 'pointer',
                    transition: 'all 0.3s ease-out',
                    fontFamily: "'Bebas Neue', sans-serif",
                    boxShadow: hoveredCard === card.id
                      ? '0 4px 14px rgba(0, 0, 0, 0.35)'
                      : '0 2px 8px rgba(0, 0, 0, 0.2)',
                    transform: hoveredCard === card.id ? 'translateY(-2px)' : 'translateY(0)',
                    opacity: isUserCurrentPlan ? 0.9 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (card.id !== 'varsity' && !isUserCurrentPlan) {
                      e.currentTarget.style.background = `linear-gradient(135deg, ${borderPalette[card.id].hover}, rgba(255,255,255,0.25))`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (card.id !== 'varsity') {
                      e.currentTarget.style.background = `linear-gradient(135deg, ${borderPalette[card.id].base}, rgba(255,255,255,0.1))`;
                    }
                  }}
                >
                  {isUserCurrentPlan ? 'Your Plan' : card.buttonText}
                </button>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
      {/* Competitive Landscape - temporarily hidden */}
      {false && <section 
        className="border-t border-white/5"
        style={{
          background: '#030305',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-white">
          <div className="text-center max-w-4xl mx-auto mb-12 lg:mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-4">How We Compare</p>
            <h2 className="text-4xl sm:text-5xl font-bold">Competitive Landscape — ISO vs. Existing Solutions</h2>
            <p className="text-white/70 mt-4">The coacheship market is fragmented. ISO delivers what others can’t: guaranteed, affordable, culturally-aligned guidance.</p>
          </div>

          <div className="rounded-3xl border border-white/5 bg-slate-900/70 p-4 lg:p-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="text-left text-white/70 uppercase text-xs tracking-[0.3em]">
                <tr>
                  <th className="py-3 pl-2 font-semibold border-b border-white/5">
                    Key Features &amp; Focus
                  </th>
                  {competitors.map((company) => (
                    <th
                      key={company.id}
                      className="py-3 px-4 text-center border-b border-white/5"
                      style={{
                        ...(company.highlight ? isoColumnStyle : {}),
                        color: company.highlight ? '#ffffff' : '#cbd5f5',
                        fontWeight: company.highlight ? 600 : 500
                      }}
                    >
                      {company.highlight ? (
                        <img
                          src="/ISOMetallic.png"
                          alt="ISO Institute"
                          style={{ height: '42px', width: 'auto', margin: '0 auto' }}
                        />
                      ) : (
                        company.name
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureRows.map((feature) => (
                  <tr key={feature.key} className="border-b border-white/5">
                    <td className="py-4 pr-4 font-semibold text-base text-slate-200">
                      {feature.label}
                    </td>
                    {competitors.map((company) => (
                      <td
                        key={`${feature.key}-${company.id}`}
                        className="py-4 px-4 text-center"
                        style={{
                          ...(company.highlight ? isoColumnStyle : {}),
                          color: company.highlight ? '#ffffff' : '#cbd5e1',
                          fontWeight: company.highlight ? 600 : 400
                        }}
                      >
                        {company[feature.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mt-12 text-slate-200">
            {benefitIcons.map((benefit) => (
              <div key={benefit.title} className="flex flex-col items-center text-center gap-4 bg-slate-900/70 border border-white/5 rounded-2xl p-6 shadow-lg shadow-black/20">
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-2xl text-orange-400">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-lg mb-2">{benefit.title}</p>
                  <p className="text-sm text-white/70 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>}
    </>
  );
}

