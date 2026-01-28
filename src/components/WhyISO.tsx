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
        backgroundColor: '#000',
      }}
    >
    </section>

    {/* Six Degrees Section */}
    <section
      style={{
        padding: '60px 24px',
        maxWidth: '1400px',
        margin: '0 auto',
        backgroundColor: '#000',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            background: 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '32px 48px',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 4px 12px rgba(0, 0, 0, 0.3)',
            display: 'inline-block',
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
          gap: '80px',
          alignItems: 'center',
        }}
      >
        {/* Left Content */}
        <div>
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

        {/* Right Visualization */}
        <div
          style={{
            position: 'relative',
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            {/* Rings */}
            <div
              className="degree-ring ring-1"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            />
            <div
              className="degree-ring ring-2"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '260px',
                height: '260px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            />
            <div
              className="degree-ring ring-3"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '360px',
                height: '360px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            />

            {/* Center Node */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                zIndex: 10,
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
                color: 'white',
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              YOU
            </div>

            {/* First Degree Nodes */}
            <div
              className="node degree-1 node-1-1"
              style={{
                position: 'absolute',
                top: '15%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '50px',
                height: '50px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'white',
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              1°
            </div>
            <div
              className="node degree-1 node-1-2"
              style={{
                position: 'absolute',
                bottom: '15%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '50px',
                height: '50px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'white',
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              1°
            </div>
            <div
              className="node degree-1 node-1-3"
              style={{
                position: 'absolute',
                top: '50%',
                left: '15%',
                transform: 'translateY(-50%)',
                width: '50px',
                height: '50px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'white',
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              1°
            </div>
            <div
              className="node degree-1 node-1-4"
              style={{
                position: 'absolute',
                top: '50%',
                right: '15%',
                transform: 'translateY(-50%)',
                width: '50px',
                height: '50px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'white',
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              1°
            </div>

            {/* Second Degree Nodes */}
            <div
              className="node node-2-1"
              style={{
                position: 'absolute',
                top: '10%',
                left: '25%',
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'white',
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              2°
            </div>
            <div
              className="node node-2-2"
              style={{
                position: 'absolute',
                top: '10%',
                right: '25%',
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'white',
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              2°
            </div>
            <div
              className="node node-2-3"
              style={{
                position: 'absolute',
                bottom: '10%',
                left: '25%',
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'white',
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              2°
            </div>
            <div
              className="node node-2-4"
              style={{
                position: 'absolute',
                bottom: '10%',
                right: '25%',
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'white',
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              2°
            </div>
            <div
              className="node node-2-5"
              style={{
                position: 'absolute',
                top: '30%',
                left: '5%',
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'white',
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              2°
            </div>
            <div
              className="node node-2-6"
              style={{
                position: 'absolute',
                top: '30%',
                right: '5%',
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'white',
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              2°
            </div>

            {/* Third Degree Nodes */}
            <div
              className="node degree-3 node-3-1"
              style={{
                position: 'absolute',
                top: '5%',
                left: '15%',
                width: '30px',
                height: '30px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'white',
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              3°
            </div>
            <div
              className="node degree-3 node-3-2"
              style={{
                position: 'absolute',
                top: '5%',
                right: '15%',
                width: '30px',
                height: '30px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'white',
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              3°
            </div>
            <div
              className="node degree-3 node-3-3"
              style={{
                position: 'absolute',
                bottom: '5%',
                left: '15%',
                width: '30px',
                height: '30px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'white',
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              3°
            </div>
            <div
              className="node degree-3 node-3-4"
              style={{
                position: 'absolute',
                bottom: '5%',
                right: '15%',
                width: '30px',
                height: '30px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'white',
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              3°
            </div>
            <div
              className="node degree-3 node-3-5"
              style={{
                position: 'absolute',
                top: '50%',
                left: '2%',
                transform: 'translateY(-50%)',
                width: '30px',
                height: '30px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'white',
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              3°
            </div>
            <div
              className="node degree-3 node-3-6"
              style={{
                position: 'absolute',
                top: '50%',
                right: '2%',
                transform: 'translateY(-50%)',
                width: '30px',
                height: '30px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'white',
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              3°
            </div>
          </div>
        </div>
      </div>

      {/* Animations and Responsive Styles */}
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(0, -10px); }
        }

        .degree-ring {
          animation: pulse-ring 3s ease-in-out infinite;
        }

        .ring-1 { animation-delay: 0s; }
        .ring-2 { animation-delay: 0.5s; }
        .ring-3 { animation-delay: 1s; }

        .node {
          animation: float 4s ease-in-out infinite;
        }

        .node-1-1 { animation-delay: 0s; }
        .node-1-2 { animation-delay: 0.5s; }
        .node-1-3 { animation-delay: 1s; }
        .node-1-4 { animation-delay: 1.5s; }
        .node-2-1 { animation-delay: 0.3s; }
        .node-2-2 { animation-delay: 0.6s; }
        .node-2-3 { animation-delay: 0.9s; }
        .node-2-4 { animation-delay: 1.2s; }
        .node-2-5 { animation-delay: 1.5s; }
        .node-2-6 { animation-delay: 1.8s; }
        .node-3-1 { animation-delay: 0.4s; }
        .node-3-2 { animation-delay: 0.7s; }
        .node-3-3 { animation-delay: 1s; }
        .node-3-4 { animation-delay: 1.3s; }
        .node-3-5 { animation-delay: 1.6s; }
        .node-3-6 { animation-delay: 1.9s; }

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
        backgroundColor: '#000',
      }}
    >
      {/* Foundation Statement */}
      <div style={{ textAlign: 'center', marginBottom: '64px', display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            background: 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '32px 48px',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 4px 12px rgba(0, 0, 0, 0.3)',
            display: 'inline-block',
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
              <h4
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(24px, 3vw, 32px)',
                  marginBottom: '24px',
                  letterSpacing: '0.02em',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                Why Courage?
              </h4>
              <p
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(16px, 1.8vw, 20px)',
                  lineHeight: '1.7',
                  color: 'rgba(255, 255, 255, 0.75)',
                  letterSpacing: '0.01em',
                  marginBottom: '16px',
                }}
              >
                Calling an ISO means rejecting comfort. It's choosing to be seen, to be challenged,
                to risk failure in front of people who will push you.
              </p>
              <p
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(16px, 1.8vw, 20px)',
                  lineHeight: '1.7',
                  color: 'rgba(255, 255, 255, 0.75)',
                  letterSpacing: '0.01em',
                  marginBottom: '16px',
                }}
              >
                Most people never make that call. They stay in their routines, their safe spaces,
                their isolated loops. ISO exists for the ones who choose differently.
              </p>
              <p
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(16px, 1.8vw, 20px)',
                  lineHeight: '1.7',
                  color: 'rgba(255, 255, 255, 0.75)',
                  letterSpacing: '0.01em',
                }}
              >
                Players build ISO by showing up, doing the work, and refusing to settle for growth
                that doesn't demand anything from them.
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
              <h4
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(24px, 3vw, 32px)',
                  marginBottom: '24px',
                  letterSpacing: '0.02em',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                Why Humility?
              </h4>
              <p
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(16px, 1.8vw, 20px)',
                  lineHeight: '1.7',
                  color: 'rgba(255, 255, 255, 0.75)',
                  letterSpacing: '0.01em',
                  marginBottom: '16px',
                }}
              >
                Accepting the call means putting someone else's growth above your own recognition.
                It's choosing service over status, impact over income.
              </p>
              <p
                style={{ 
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(16px, 1.8vw, 20px)',
                  lineHeight: '1.7',
                  color: 'rgba(255, 255, 255, 0.75)',
                  letterSpacing: '0.01em',
                  marginBottom: '16px',
                }}
              >
                In a world that celebrates celebrity and personal brands, coaches choose
                differently. They invest time, energy, and attention into people who may never make
                them famous.
              </p>
              <p 
                style={{ 
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(16px, 1.8vw, 20px)',
                  lineHeight: '1.7',
                  color: 'rgba(255, 255, 255, 0.75)',
                  letterSpacing: '0.01em',
                }}
              >
                Coaches sustain ISO by showing up consistently, sharing what they know, and
                prioritizing the community over themselves.
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
