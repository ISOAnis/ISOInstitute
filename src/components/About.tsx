import * as React from "react";
import { useState, useEffect, useRef } from "react";

type Page =
  | "home"
  | "for-players"
  | "about"
  | "community"
  | "store"
  | "coach-portal"
  | "player-portal"
  | "call-iso";

interface AboutProps {
  onNavigate?: (page: Page) => void;
}

export function About({ onNavigate }: AboutProps) {
  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      <HeroSection />
      <MissionSection />
      <ProblemsSection />
      <ConnectionAndApproach />
      <WhyItMattersSection />
      <ClosingCTA onNavigate={onNavigate} />
    </div>
  );
}

// ============================================================================
// HERO SECTION WITH VIDEO
// ============================================================================
function HeroSection() {
  const [showModal, setShowModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const handleWatchTrailer = () => {
    setShowModal(true);
    // Small delay to ensure modal video element is mounted
    setTimeout(() => {
      if (modalVideoRef.current) {
        modalVideoRef.current.muted = false;
        modalVideoRef.current.currentTime = 0;
        modalVideoRef.current.play().catch(console.error);
      }
    }, 100);
  };

  const handleCloseTrailer = () => {
    setShowModal(false);
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
      modalVideoRef.current.muted = true;
    }
  };

  return (
    <>
      <section
        style={{
          position: "relative",
          height: "70vh",
          width: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          padding: 0,
        }}
      >
        {/* Video Background */}
        <video
          ref={videoRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/Show Dem Nike Football.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            padding: "0 24px",
          }}
        >
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(60px, 10vw, 140px)",
              fontWeight: "bold",
              color: "white",
              marginBottom: "24px",
              letterSpacing: "0.02em",
            }}
          >
            It's Not You vs You Anymore.
          </h1>
          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(18px, 2vw, 28px)",
              color: "white",
              maxWidth: "900px",
              margin: "0 auto",
              letterSpacing: "0.01em",
            }}
          >
            Fear makes role players. Courage makes stars. It's time to Call an
            ISO.
          </p>
        </div>

        {/* Watch Trailer Button */}
        <button
          onClick={handleWatchTrailer}
          style={{
            position: "absolute",
            bottom: "48px",
            left: "48px",
            zIndex: 20,
            padding: "12px 24px",
            borderRadius: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "white",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "16px",
            letterSpacing: "0.05em",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          }}
        >
          Watch the Full Trailer
        </button>
      </section>

      {/* Modal */}
      {showModal && (
        <div
          onClick={handleCloseTrailer}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "1200px",
              aspectRatio: "16/9",
              backgroundColor: "#000",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <video
              ref={modalVideoRef}
              style={{ width: "100%", height: "100%" }}
              controls
              autoPlay
            >
              <source src="/Show Dem Nike Football.mp4" type="video/mp4" />
            </video>

            <button
              onClick={handleCloseTrailer}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "none",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================================
// MISSION SECTION
// ============================================================================
function MissionSection() {
  return (
    <section
      style={{
        textAlign: "center",
        padding: "64px 24px",
        backgroundColor: "#000",
      }}
    >
      <div
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "14px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255, 255, 255, 0.5)",
          marginBottom: "8px",
        }}
      >
        The Challenge
      </div>
      <h2
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(40px, 5vw, 60px)",
          fontWeight: "bold",
          color: "white",
          letterSpacing: "0.02em",
        }}
      >
        Three Problems. One Mission.
      </h2>
    </section>
  );
}

// ============================================================================
// PROBLEMS SECTION WITH FLIP CARDS
// ============================================================================
function ProblemsSection() {
  const [flipped1, setFlipped1] = useState(false);
  const [flipped2, setFlipped2] = useState(false);
  const [flipped3, setFlipped3] = useState(false);

  return (
    <section
      style={{
        padding: "5px 24px",
        backgroundColor: "#000",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "48px",
          marginBottom: "120px",
        }}
      >
        {/* Problem 01 Card */}
        <FlipCard
          isFlipped={flipped1}
          onFlip={() => setFlipped1(!flipped1)}
          front={{
            label: "Problem 01",
            title: "Talent Is Everywhere.\nAccess Is Not.",
            description:
              "The most capable people often don't live in major hubs. They're hidden behind geography, networks, or circumstance.",
          }}
          back={{
            label: "Problem 01 — Deep Dive",
            content: (
              <>
                <p style={{ marginBottom: "16px" }}>
                  Some of the most capable, disciplined, and driven people in
                  the world don't live in major hubs. They live in small to
                  mid-sized cities where opportunity is fragmented and
                  visibility is limited.
                </p>
                <p style={{ marginBottom: "16px" }}>
                  In these communities, talent is often:
                </p>
                <p
                  style={{
                    paddingLeft: "20px",
                    color: "rgba(255,255,255,0.8)",
                    marginBottom: "16px",
                  }}
                >
                  → disconnected from mentors
                  <br />
                  → separated from peers operating at a high level
                  <br />→ hidden behind geography, networks, or circumstance
                </p>
                <p style={{ marginBottom: "16px" }}>
                  Success becomes less about ability and more about proximity.
                </p>
                <p
                  style={{
                    marginTop: "24px",
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "16px",
                  }}
                >
                  ISO exists to rebuild community pathways to success by
                  locating, connecting, and activating overlooked talent. We
                  focus on increasing proximity to people, standards, and
                  opportunities that accelerate growth, regardless of where
                  you're starting from.
                </p>
                <p>
                  Not by forcing people to leave their communities, but by
                  strengthening them.
                </p>
              </>
            ),
          }}
        />

        {/* Problem 02 Card */}
        <FlipCard
          isFlipped={flipped2}
          onFlip={() => setFlipped2(!flipped2)}
          front={{
            label: "Problem 02",
            title: "Personal Development\nHas Lost Its Edge.",
            description:
              "Growth has been reduced to routines, slogans, and isolated loops. It's become quiet and uninspiring.",
          }}
          back={{
            label: "Problem 02 — Deep Dive",
            content: (
              <>
                <p style={{ marginBottom: "16px" }}>
                  Growth has been commodified into apps, habits, and morning
                  routines done in isolation. The edge has been smoothed away.
                  The fire has dimmed.
                </p>
                <p style={{ marginTop: "24px", marginBottom: "16px" }}>
                  But growth was never meant to be passive.
                </p>
                <p style={{ marginBottom: "16px" }}>
                  Real development happens through challenge, accountability,
                  and exposure to people who push you beyond your comfort zone.
                  It happens when you step into environments that demand more
                  from you.
                </p>
                <p
                  style={{
                    marginTop: "24px",
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "16px",
                  }}
                >
                  ISO exists to reshape how we view personal development. It
                  doesn't have to be boring. It doesn't have to be isolated. And
                  it doesn't have to be done alone.
                </p>
                <p style={{ fontSize: "22px", marginTop: "16px" }}>
                  Growth should feel engaging, demanding, and alive.
                </p>
              </>
            ),
          }}
        />

        {/* Problem 03 Card - NEW */}
        <FlipCard
          isFlipped={flipped3}
          onFlip={() => setFlipped3(!flipped3)}
          front={{
            label: "Problem 03",
            title: "Local Talent\nIsn't Celebrated.",
            description:
              "We celebrate celebrities for status, not impact. Meanwhile, the people doing real work in their communities go unseen.",
          }}
          back={{
            label: "Problem 03 — Deep Dive",
            content: (
              <>
                <p style={{ marginBottom: "16px" }}>
                  Society elevates people based on fame and followers, not on
                  the value they create or the lives they impact. Celebrities
                  with massive platforms get endless attention simply for
                  existing, while local builders, mentors, and doers remain
                  invisible.
                </p>
                <p style={{ marginBottom: "16px" }}>
                  This creates a warped incentive structure:
                </p>
                <p
                  style={{
                    paddingLeft: "20px",
                    color: "rgba(255,255,255,0.8)",
                    marginBottom: "16px",
                  }}
                >
                  → Status trumps substance
                  <br />
                  → Attention goes to those who already have it
                  <br />→ Real impact in small communities goes unrecognized
                </p>
                <p style={{ marginBottom: "16px" }}>
                  The person mentoring dozens of young people in their town
                  deserves more recognition than someone famous for being
                  famous. But our systems don't reward that.
                </p>
                <p
                  style={{
                    marginTop: "24px",
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "16px",
                  }}
                >
                  ISO exists to shift the spotlight. We amplify the people doing
                  meaningful work in their communities. We celebrate builders,
                  not just broadcasters. Impact over status. Always.
                </p>
              </>
            ),
          }}
        />
      </div>
    </section>
  );
}

// Flip Card Component
interface FlipCardProps {
  isFlipped: boolean;
  onFlip: () => void;
  front: {
    label: string;
    title: string;
    description: string;
  };
  back: {
    label: string;
    content: React.ReactNode;
  };
}

function FlipCard({ isFlipped, onFlip, front, back }: FlipCardProps) {
  return (
    <div
      style={{
        perspective: "1000px",
        height: "500px",
        position: "relative",
      }}
    >
      <div
        onClick={onFlip}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transition: "transform 0.8s",
          transformStyle: "preserve-3d",
          cursor: "pointer",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            borderRadius: "16px",
            padding: "48px",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "12px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: "24px",
            }}
          >
            {front.label}
          </div>
          <h3
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(32px, 4vw, 48px)",
              marginBottom: "24px",
              lineHeight: "1.2",
              letterSpacing: "0.01em",
              color: "white",
              whiteSpace: "pre-line",
            }}
          >
            {front.title}
          </h3>
          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "18px",
              color: "rgba(255, 255, 255, 0.9)",
              lineHeight: "1.6",
              letterSpacing: "0.01em",
              marginBottom: "16px",
            }}
          >
            {front.description}
          </p>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.6)",
              marginTop: "auto",
              textAlign: "center",
              paddingTop: "24px",
            }}
          >
            👆 Click to explore deeper
          </div>
        </div>

        {/* Back */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "16px",
            padding: "48px",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "12px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: "24px",
            }}
          >
            {back.label}
          </div>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "18px",
              color: "rgba(255, 255, 255, 0.9)",
              lineHeight: "1.6",
              letterSpacing: "0.01em",
            }}
          >
            {back.content}
          </div>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "14px",
              color: "rgba(255,255,255,0.6)",
              marginTop: "auto",
              textAlign: "center",
              paddingTop: "24px",
            }}
          >
            👆 Click to go back
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CONNECTION LINES AND ISO APPROACH
// ============================================================================
function ConnectionAndApproach() {
  const [isVisible, setIsVisible] = useState(false);
  const approachRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!approachRef.current) return;

      const rect = approachRef.current.getBoundingClientRect();
      const screenPosition = window.innerHeight / 1.3;

      if (rect.top < screenPosition && !isVisible) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible]);

  return (
    <section style={{ padding: "0 24px 64px", backgroundColor: "#000" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Connection Lines */}
        <div
          style={{
            position: "relative",
            height: "200px",
            display: "flex",
            justifyContent: "center",
            marginBottom: "0",
          }}
        >
          <svg
            style={{
              position: "absolute",
              top: "-50px",
              left: 0,
              width: "100%",
              height: "250px",
              opacity: isVisible ? 1 : 0,
              transition: "opacity 1s ease-out",
            }}
            viewBox="0 0 1000 250"
            preserveAspectRatio="none"
          >
            {/* Left line from card 1 */}
            <path
              d="M 166 0 Q 166 125, 500 250"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="1000"
              strokeDashoffset={isVisible ? 0 : 1000}
              style={{
                transition: "stroke-dashoffset 2s ease-out",
              }}
            />
            {/* Middle line from card 2 */}
            <path
              d="M 500 0 L 500 250"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="1000"
              strokeDashoffset={isVisible ? 0 : 1000}
              style={{
                transition: "stroke-dashoffset 2s ease-out 0.2s",
              }}
            />
            {/* Right line from card 3 */}
            <path
              d="M 834 0 Q 834 125, 500 250"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="1000"
              strokeDashoffset={isVisible ? 0 : 1000}
              style={{
                transition: "stroke-dashoffset 2s ease-out 0.4s",
              }}
            />
          </svg>
        </div>

        {/* ISO Approach Box */}
        <div
          ref={approachRef}
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "64px 48px",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "24px",
            position: "relative",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(50px)",
            transition: "all 1s ease-out",
          }}
        >
          {/* Convergence Point */}
          <div
            style={{
              position: "absolute",
              top: "-15px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "16px",
              height: "16px",
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: "50%",
              opacity: isVisible ? 1 : 0,
              transition: "opacity 0.5s 2s",
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.6)",
            }}
          />

          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(48px, 6vw, 72px)",
              color: "white",
              marginBottom: "16px",
              letterSpacing: "0.02em",
              textAlign: "center",
            }}
          >
            The ISO Approach
          </h2>

          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "22px",
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.9)",
              marginBottom: "32px",
              letterSpacing: "0.01em",
            }}
          >
            ISO brings people into proximity with standards that sharpen them.
          </p>

          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "18px",
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: "24px",
            }}
          >
            We believe:
          </p>

          <div style={{ margin: "32px 0" }}>
            {[
              "iron sharpens iron",
              "growth requires resistance",
              "community accelerates mastery",
              "becoming better is an active pursuit",
              "development deserves to be rewarded",
              "community leaders deserve to be recongnized",
            ].map((belief, index) => (
              <div
                key={index}
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "28px",
                  color: "white",
                  margin: "20px 0",
                  textAlign: "center",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {belief}
              </div>
            ))}
          </div>

          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "22px",
              color: "rgba(255, 255, 255, 0.95)",
              marginTop: "48px",
              textAlign: "center",
              fontStyle: "italic",
              lineHeight: "1.6",
            }}
          >
            ISO is not about competing against yourself in isolation.
            <br />
            It's about stepping into spaces that challenge you to rise.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// WHY IT MATTERS SECTION
// ============================================================================
function WhyItMattersSection() {
  const [cardsVisible, setCardsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const screenPosition = window.innerHeight / 1.3;

      if (rect.top < screenPosition && !cardsVisible) {
        setCardsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [cardsVisible]);

  const impacts = [
    "When access improves, communities strengthen.",
    "When development becomes engaging, people commit.",
    "When people grow together, progress compounds.",
  ];

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "120px 24px",
        backgroundColor: "#000",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "14px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.5)",
              marginBottom: "16px",
            }}
          >
            The Impact
          </div>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(48px, 6vw, 72px)",
              color: "white",
              letterSpacing: "0.02em",
            }}
          >
            Why ISO Matters
          </h2>
        </div>

        {/* Impact Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "32px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {impacts.map((impact, index) => (
            <div
              key={index}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "48px 32px",
                textAlign: "center",
                opacity: cardsVisible ? 1 : 0,
                transform: cardsVisible ? "translateY(0)" : "translateY(30px)",
                transition: `all 0.4s ease-out ${index * 0.2}s`,
                gridColumn: index === 2 ? "1 / -1" : "auto",
                maxWidth: index === 2 ? "600px" : "none",
                margin: index === 2 ? "0 auto" : "0",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.transform = "translateY(-8px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <p
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "24px",
                  lineHeight: "1.6",
                  color: "rgba(255, 255, 255, 0.9)",
                  letterSpacing: "0.01em",
                  margin: 0,
                }}
              >
                {impact}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .impact-cards {
            grid-template-columns: 1fr !important;
          }
          .impact-card:nth-child(3) {
            grid-column: 1 !important;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================================================
// CLOSING CTA SECTION
// ============================================================================
interface ClosingCTAProps {
  onNavigate?: (page: Page) => void;
}

function ClosingCTA({ onNavigate }: ClosingCTAProps) {
  return (
    <section
      style={{
        padding: "10px 24px 160px",
        backgroundColor: "#000",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Main Statement */}
        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(36px, 5vw, 56px)",
            color: "white",
            lineHeight: "1.3",
            marginBottom: "64px",
            letterSpacing: "0.02em",
          }}
        >
          ISO is built on courage from players
          <br />
          and sustained by humility from coaches.
        </h2>

        {/* CTA Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: "48px",
            flexWrap: "wrap",
          }}
        >
          {/* Call an ISO - Players */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => onNavigate?.("for-players")}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "20px",
                letterSpacing: "0.05em",
                padding: "18px 48px",
                borderRadius: "12px",
                backgroundColor: "white",
                color: "#000",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
                fontWeight: "bold",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.9)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 40px rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Call an ISO
            </button>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "14px",
                letterSpacing: "0.1em",
                color: "rgba(255, 255, 255, 0.5)",
                marginTop: "16px",
                textTransform: "uppercase",
              }}
            >
              (Players)
            </div>
          </div>

          {/* Accept the Call - Coaches */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => onNavigate?.("coach-portal")}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "20px",
                letterSpacing: "0.05em",
                padding: "18px 48px",
                borderRadius: "12px",
                backgroundColor: "transparent",
                color: "white",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                cursor: "pointer",
                transition: "all 0.3s",
                fontWeight: "bold",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Accept the Call
            </button>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "14px",
                letterSpacing: "0.1em",
                color: "rgba(255, 255, 255, 0.5)",
                marginTop: "16px",
                textTransform: "uppercase",
              }}
            >
              (Coaches)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
