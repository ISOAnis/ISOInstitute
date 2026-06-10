import * as React from 'react';
import { useState } from 'react';

export function WhyISO() {
  const [playersFlipped, setPlayersFlipped] = useState(false);
  const [coachesFlipped, setCoachesFlipped] = useState(false);

  return (
    <React.Fragment>
    <section 
      style={{
        padding: '60px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        backgroundColor: '#111111',
      }}
    >
    </section>

    {/* Six Degrees Section */}
    <section
      style={{
        padding: '60px 24px',
        maxWidth: '1400px',
        margin: '0 auto',
        backgroundColor: '#111111',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            background: 'linear-gradient(145deg, #1a1a1a 0%, #202020 50%, #1a1a1a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '24px',
            padding: '40px 60px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(255, 255, 255, 0.02)',
            maxWidth: '1280px',
            width: '100%',
          }}
        >
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(36px, 5vw, 56px)',
              letterSpacing: '0.02em',
              lineHeight: '1.1',
              marginBottom: '0',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            A New{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #c0c0c0 40%, #e0e0e0 60%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Culture
            </span>
            {' '}Of Development.
            <br />
            A New{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #c0c0c0 40%, #e0e0e0 60%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Ecosystem
            </span>
            {' '}For Local Talent.
          </h2>
        </div>
      </div>

      {/* Split Container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'center',
        }}
      >
        {/* Left Content */}
        <div style={{ marginLeft: 'auto', maxWidth: '400px' }}>
          <h3
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(20px, 2vw, 24px)',
              color: 'rgba(255, 255, 255, 0.5)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}
          >
            Six Degrees Of Separation
          </h3>
          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(18px, 2vw, 22px)',
              lineHeight: '1.7',
              color: 'rgba(255, 255, 255, 0.8)',
              letterSpacing: '0.01em',
            }}
          >
            Opportunity isn't rare.
            Proximity is.
            <br />
            ISO activates local talent networks to bring guidance, collaboration, and opportunity closer.
          </p>
        </div>

        {/* Right Visualization - Radar */}
        <div
          style={{
            position: 'relative',
            height: '500px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Descriptive Text */}
          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '16px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '16px',
            }}
          >
            ISO expands your proximity beyond your natural reach.
          </p>

          {/* Radar Container */}
          <div
            style={{
              position: 'relative',
              width: '400px',
              height: '400px',
            }}
          >
            {/* Outer Circle - With ISO */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '380px',
                height: '380px',
                borderRadius: '50%',
                border: '2px solid rgba(249, 115, 22, 0.6)',
              }}
            />

            {/* Inner Circle - Without ISO */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                border: '2px dashed rgba(150, 150, 150, 0.5)',
              }}
            />

            {/* Center Node */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                zIndex: 10,
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
                color: 'white',
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              YOU
            </div>

            {/* Radar Pulse */}
            <div
              className="radar-pulse"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: '3px solid rgba(249, 115, 22, 0.9)',
                boxShadow: '0 0 25px rgba(249, 115, 22, 0.5), inset 0 0 15px rgba(249, 115, 22, 0.2)',
                animation: 'radar-sweep 5s linear infinite',
              }}
            />

            {/* Grey Dots - Without ISO zone */}
            {(() => {
              const greyDots = [
                { x: 38, y: 35 },
                { x: 62, y: 40 },
                { x: 42, y: 65 },
              ];
              // Container is 400px, pulse goes from 25px to 190px radius over 80% of animation
              const containerSize = 400;
              const pulseStartRadius = 25;
              const pulseEndRadius = 190;
              const pulseTravelDistance = pulseEndRadius - pulseStartRadius;
              const sweepPortionPercent = 80;
              const holdEnd = 80;

              return greyDots.map((dot, i) => {
                const centerX = 50;
                const centerY = 50;
                const dx = dot.x - centerX;
                const dy = dot.y - centerY;
                // Convert percentage distance to pixels (1% = 4px in 400px container)
                const distanceInPixels = Math.sqrt(dx * dx + dy * dy) * (containerSize / 100);
                const appearPercent = Math.max(0, ((distanceInPixels - pulseStartRadius) / pulseTravelDistance) * sweepPortionPercent);
                const appear = Math.min(appearPercent, sweepPortionPercent - 2);

                return (
                  <React.Fragment key={`grey-${i}`}>
                    <style>{`
                      @keyframes grey-dot-${i} {
                        0%, ${appear.toFixed(1)}% {
                          opacity: 0;
                          transform: translate(-50%, -50%) scale(0);
                        }
                        ${(appear + 1).toFixed(1)}% {
                          opacity: 1;
                          transform: translate(-50%, -50%) scale(1.25);
                        }
                        ${(appear + 3).toFixed(1)}%, ${holdEnd}% {
                          opacity: 1;
                          transform: translate(-50%, -50%) scale(1);
                        }
                        100% {
                          opacity: 0;
                          transform: translate(-50%, -50%) scale(0);
                        }
                      }
                    `}</style>
                    <div
                      className="connection-dot"
                      style={{
                        position: 'absolute',
                        left: `${dot.x}%`,
                        top: `${dot.y}%`,
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: 'rgba(150, 150, 150, 0.9)',
                        boxShadow: '0 0 8px rgba(150, 150, 150, 0.5)',
                        animation: `grey-dot-${i} 5s linear infinite`,
                      }}
                    />
                  </React.Fragment>
                );
              });
            })()}

            {/* Orange Dots - With ISO zone (scattered randomly) */}
            {(() => {
              const orangeDots = [
                { x: 76, y: 38 },
                { x: 24, y: 58 },
                { x: 67, y: 78 },
                { x: 18, y: 35 },
                { x: 85, y: 52 },
                { x: 38, y: 15 },
                { x: 12, y: 48 },
                { x: 72, y: 85 },
                { x: 88, y: 38 },
                { x: 28, y: 82 },
                { x: 55, y: 8 },
                { x: 8, y: 62 },
                { x: 92, y: 55 },
                { x: 45, y: 90 },
                { x: 78, y: 22 },
                { x: 20, y: 75 },
              ];
              // Container is 400px, pulse goes from 25px to 190px radius over 80% of animation
              const containerSize = 400;
              const pulseStartRadius = 25;
              const pulseEndRadius = 190;
              const pulseTravelDistance = pulseEndRadius - pulseStartRadius;
              const sweepPortionPercent = 80;
              const holdEnd = 80;

              return orangeDots.map((dot, i) => {
                const centerX = 50;
                const centerY = 50;
                const dx = dot.x - centerX;
                const dy = dot.y - centerY;
                // Convert percentage distance to pixels (1% = 4px in 400px container)
                const distanceInPixels = Math.sqrt(dx * dx + dy * dy) * (containerSize / 100);
                const appearPercent = Math.max(0, ((distanceInPixels - pulseStartRadius) / pulseTravelDistance) * sweepPortionPercent);
                const appear = Math.min(appearPercent, sweepPortionPercent - 2);

                return (
                  <React.Fragment key={`orange-${i}`}>
                    <style>{`
                      @keyframes orange-dot-${i} {
                        0%, ${appear.toFixed(1)}% {
                          opacity: 0;
                          transform: translate(-50%, -50%) scale(0);
                        }
                        ${(appear + 1).toFixed(1)}% {
                          opacity: 1;
                          transform: translate(-50%, -50%) scale(1.25);
                        }
                        ${(appear + 3).toFixed(1)}%, ${holdEnd}% {
                          opacity: 1;
                          transform: translate(-50%, -50%) scale(1);
                        }
                        100% {
                          opacity: 0;
                          transform: translate(-50%, -50%) scale(0);
                        }
                      }
                    `}</style>
                    <div
                      className="connection-dot"
                      style={{
                        position: 'absolute',
                        left: `${dot.x}%`,
                        top: `${dot.y}%`,
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: 'rgba(249, 115, 22, 0.9)',
                        boxShadow: '0 0 8px rgba(249, 115, 22, 0.5)',
                        animation: `orange-dot-${i} 5s linear infinite`,
                      }}
                    />
                  </React.Fragment>
                );
              });
            })()}
          </div>

          {/* Legend */}
          <div
            style={{
              display: 'flex',
              gap: '32px',
              marginTop: '24px',
              justifyContent: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: 'rgba(150, 150, 150, 0.9)',
                }}
              />
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  letterSpacing: '0.05em',
                }}
              >
                Natural Reach
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: 'rgba(249, 115, 22, 0.9)',
                }}
              />
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  letterSpacing: '0.05em',
                }}
              >
                ISO Impact
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Animations and Responsive Styles */}
      <style>{`
        @keyframes radar-sweep {
          0% {
            width: 50px;
            height: 50px;
            border-color: rgba(249, 115, 22, 1);
            box-shadow: 0 0 40px rgba(249, 115, 22, 0.8), inset 0 0 25px rgba(249, 115, 22, 0.4);
          }
          80% {
            width: 380px;
            height: 380px;
            border-color: rgba(249, 115, 22, 0.7);
            box-shadow: 0 0 30px rgba(249, 115, 22, 0.5), inset 0 0 15px rgba(249, 115, 22, 0.2);
          }
          100% {
            width: 380px;
            height: 380px;
            border-color: rgba(249, 115, 22, 0);
            box-shadow: 0 0 0px rgba(249, 115, 22, 0);
            opacity: 0;
          }
        }

        .connection-dot {
          will-change: transform, opacity;
        }

        @media (max-width: 968px) {
          section > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
            gap: 60px !important;
          }
          
          section > div[style*="grid-template-columns"] > div:last-child {
            height: 400px !important;
          }
        }
      `}</style>
    </section>

    {/* Foundation Statement Section */}
    <section 
      style={{
        padding: '60px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        backgroundColor: '#111111',
      }}
    >
      {/* Foundation Statement */}
      <div style={{ textAlign: 'center', marginBottom: '64px', display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            background: 'linear-gradient(145deg, #1a1a1a 0%, #202020 50%, #1a1a1a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '24px',
            padding: '40px 60px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(255, 255, 255, 0.02)',
            maxWidth: '1280px',
            width: '100%',
          }}
        >
          <h3
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(32px, 5vw, 56px)',
              letterSpacing: '0.02em',
              lineHeight: '1.3',
              marginBottom: '0',
              color: 'white',
            }}
          >
            Built By{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #c0c0c0 40%, #e0e0e0 60%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Courage.
            </span>
            <br />
            Sustained By{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #c0c0c0 40%, #e0e0e0 60%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Humility.
            </span>
          </h3>
        </div>
      </div>

      {/* Flip Cards */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '48px',
          maxWidth: '1100px',
          margin: '0 auto',
          justifyContent: 'center',
          alignItems: 'stretch',
        }}
      >
        {/* Players Card */}
        <div
          style={{
            perspective: '1000px',
            height: '350px',
            width: '50%',
            minWidth: '0',
          }}
        >
          <div
            onClick={() => setPlayersFlipped(!playersFlipped)}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transition: 'transform 0.8s',
              transformStyle: 'preserve-3d',
              cursor: 'pointer',
              transform: playersFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                borderRadius: '16px',
                padding: '48px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'left',
              }}
            >
              <h4
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  marginBottom: '24px',
                  letterSpacing: '0.02em',
                  color: 'white',
                }}
              >
                Players
              </h4>
              <p
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(18px, 2vw, 22px)',
                  lineHeight: '1.7',
                  color: 'rgba(255, 255, 255, 0.8)',
                  letterSpacing: '0.01em',
                }}
              >
                It takes courage to call an ISO. To admit you need guidance. To step into spaces
                that challenge you.
              </p>
              <span
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.4)',
                  letterSpacing: '0.05em',
                  fontFamily: "'Bebas Neue', sans-serif",
                }}
              >
                CLICK TO LEARN MORE →
              </span>
      </div>

            {/* Back */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                borderRadius: '16px',
                padding: '48px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'left',
                overflowY: 'auto',
              }}
            >
              <p
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(18px, 2vw, 22px)',
                  lineHeight: '1.7',
                  color: 'rgba(255, 255, 255, 0.9)',
                  letterSpacing: '0.01em',
                }}
              >
                Calling an ISO means rejecting comfort. Choosing to be seen, challenged, and risking failure in front of people who will push you.
              </p>
              <p
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(18px, 2vw, 22px)',
                  lineHeight: '1.7',
                  color: 'rgba(255, 255, 255, 0.9)',
                  letterSpacing: '0.01em',
                  marginTop: '24px',
                }}
              >
                Most people never make that call. ISO exists for the ones who choose differently.
              </p>
              <span
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.4)',
                  letterSpacing: '0.05em',
                  fontFamily: "'Bebas Neue', sans-serif",
                }}
              >
                ← CLICK TO GO BACK
              </span>
            </div>
        </div>
      </div>

        {/* Coaches Card */}
        <div
          style={{
            perspective: '1000px',
            height: '350px',
            width: '50%',
            minWidth: '0',
          }}
        >
          <div
            onClick={() => setCoachesFlipped(!coachesFlipped)}
              style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transition: 'transform 0.8s',
              transformStyle: 'preserve-3d',
              cursor: 'pointer',
              transform: coachesFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                borderRadius: '16px',
                padding: '48px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'left',
              }}
            >
              <h4
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  marginBottom: '24px',
                  letterSpacing: '0.02em',
                  color: 'white',
                }}
              >
                Coaches
              </h4>
              <p
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(18px, 2vw, 22px)',
                  lineHeight: '1.7',
                  color: 'rgba(255, 255, 255, 0.8)',
                  letterSpacing: '0.01em',
                }}
              >
                It takes humility to accept the call. To serve instead of sell. To invest in others
                when you could focus only on yourself.
              </p>
              <span
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.4)',
                  letterSpacing: '0.05em',
                  fontFamily: "'Bebas Neue', sans-serif",
                }}
              >
                CLICK TO LEARN MORE →
              </span>
            </div>

            {/* Back */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                borderRadius: '16px',
                padding: '48px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'left',
                overflowY: 'auto',
              }}
            >
              <p
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(18px, 2vw, 22px)',
                  lineHeight: '1.7',
                  color: 'rgba(255, 255, 255, 0.9)',
                  letterSpacing: '0.01em',
                }}
              >
                Accepting the call means putting someone else's growth above your own recognition. Choosing service over status, impact over income.
              </p>
              <p
                style={{ 
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(18px, 2vw, 22px)',
                  lineHeight: '1.7',
                  color: 'rgba(255, 255, 255, 0.9)',
                  letterSpacing: '0.01em',
                  marginTop: '24px',
                }}
              >
                In a world that celebrates celebrity, coaches invest in people who may never make them famous. That's humility.
              </p>
              <span
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.4)',
                  letterSpacing: '0.05em',
                  fontFamily: "'Bebas Neue', sans-serif",
                }}
              >
                ← CLICK TO GO BACK
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Media Query */}
      <style>{`
        @media (max-width: 768px) {
          section > div:last-child {
            flex-direction: column !important;
          }
          section > div:last-child > div {
            width: 100% !important;
            height: 400px !important;
          }
        }
      `}</style>
    </section>
    </React.Fragment>
  );
}