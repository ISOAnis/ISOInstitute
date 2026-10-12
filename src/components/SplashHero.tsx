import { useEffect, useState } from 'react';
import '../styles/splash-hero.css';

const ROTATING_PHRASES = ['your next step.', 'a way in.', 'someone who’s been there.', 'people on your path.', 'proximity.'];
const ROTATE_MS = 2400;

interface SplashHeroProps {
  onWaitlistClick: () => void;
  onBrowseSeasonClick: () => void;
}

function RotatingPhrase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % ROTATING_PHRASES.length), ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="splash-hero-rotator" aria-live="polite">
      <span key={index} className="splash-hero-phrase">
        {ROTATING_PHRASES[index]}
      </span>
    </span>
  );
}

export function SplashHero({ onWaitlistClick, onBrowseSeasonClick }: SplashHeroProps) {
  return (
    <section id="top" className="splash-hero">
      <img src="/hero-bg.svg" alt="" aria-hidden="true" className="splash-hero-bg" />
      <div className="splash-hero-glow" aria-hidden="true" />

      <div className="splash-hero-inner">
        <img src="/ISO OFFICIAL.png" alt="ISO" className="splash-hero-logo" />

        <h1 className="splash-hero-title">
          <span className="splash-hero-kicker">You’re not lost. You’re</span>
          <span className="splash-hero-chrome">In search of</span>
          <RotatingPhrase />
        </h1>

        <p className="splash-hero-sub">
          Find successful professionals on your path, in your city, at the places you go most: coffee shops, restaurants, gyms, and other third&nbsp;spaces.
        </p>

        <div className="splash-hero-ctas">
          <div className="splash-hero-cta-col">
            <button type="button" className="splash-hero-btn splash-hero-btn--primary" onClick={onWaitlistClick}>
              Join the waitlist
            </button>
            <p className="splash-hero-audience">For players, coaches &amp; local businesses</p>
          </div>
          <div className="splash-hero-cta-col">
            <button type="button" className="splash-hero-btn splash-hero-btn--outline" onClick={onBrowseSeasonClick}>
              Browse Season 1
            </button>
            <p className="splash-hero-audience">Season 2 coming soon</p>
          </div>
        </div>

        <span className="splash-hero-launch">LAUNCHING IN DENVER FIRST</span>
      </div>
    </section>
  );
}
