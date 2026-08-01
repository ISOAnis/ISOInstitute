import { useState, useEffect } from 'react';

interface SplashNavigationProps {
  mode?: 'splash' | 'about';
  onNavigateToAbout?: () => void;
  onNavigateToAssist?: () => void;
  onBack?: () => void;
}

export function SplashNavigation({
  mode = 'splash',
  onNavigateToAbout,
  onNavigateToAssist,
  onBack,
}: SplashNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pillClass = `flex items-center justify-between rounded-full pl-4 pr-5 py-1 shadow-lg transition-all duration-300 ${
    isScrolled
      ? 'bg-black/90 shadow-black/60 backdrop-blur-[40px]'
      : 'bg-black/65 shadow-black/30 backdrop-blur-[16px]'
  }`;

  const brandStyle = { fontFamily: "'Bebas Neue', sans-serif", color: '#E8E8E8' };

  const navButtonStyle = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '14px',
    letterSpacing: '2px',
    padding: '7px 18px',
  };

  const navActionsStyle = { margin: '3px 6px 3px 8px', display: 'flex', alignItems: 'center', gap: '8px' };

  return (
    <nav className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4">
      <div className="w-full max-w-5xl">
        <div
          className={pillClass}
          style={{ border: `1px solid rgba(255, 255, 255, ${isScrolled ? 0.3 : 0.15})` }}
        >
          {mode === 'about' ? (
            <button
              type="button"
              onClick={onBack}
              className="text-lg font-semibold tracking-wide transition-opacity hover:opacity-80"
              style={{ ...brandStyle, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              ISO Institute
            </button>
          ) : (
            <span className="text-lg font-semibold tracking-wide" style={brandStyle}>
              ISO Institute
            </span>
          )}

          {mode === 'splash' ? (
            <div style={navActionsStyle}>
              {onNavigateToAssist && (
                <button
                  type="button"
                  onClick={onNavigateToAssist}
                  className="splash-assist-btn create-account-btn relative rounded-full overflow-hidden font-semibold whitespace-nowrap"
                  style={navButtonStyle}
                >
                  <span className="relative z-10 transition-colors duration-500 inline-block font-medium">The Assist</span>
                </button>
              )}
              {onNavigateToAbout && (
                <button
                  type="button"
                  onClick={onNavigateToAbout}
                  className="splash-about-btn create-account-btn relative rounded-full overflow-hidden font-semibold whitespace-nowrap"
                  style={navButtonStyle}
                >
                  <span className="relative z-10 transition-colors duration-500 inline-block font-medium">About</span>
                </button>
              )}
            </div>
          ) : (
            <div style={navActionsStyle}>
              {onNavigateToAssist && (
                <button
                  type="button"
                  onClick={onNavigateToAssist}
                  className="splash-assist-btn create-account-btn relative rounded-full overflow-hidden font-semibold whitespace-nowrap"
                  style={navButtonStyle}
                >
                  <span className="relative z-10 transition-colors duration-500 inline-block font-medium">The Assist</span>
                </button>
              )}
              <button
                type="button"
                onClick={onBack}
                className="splash-home-btn create-account-btn relative rounded-full overflow-hidden font-semibold whitespace-nowrap"
                style={navButtonStyle}
              >
                <span className="relative z-10 transition-colors duration-500 inline-block font-medium">Home</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
