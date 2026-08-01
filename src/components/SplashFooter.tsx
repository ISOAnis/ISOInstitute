import type { ReactNode } from 'react';
import { Instagram, Linkedin } from 'lucide-react';
import '../styles/splash-footer.css';

const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/isoinstitute/',
  tiktok: 'https://tiktok.com/@iso_institute',
  linkedin: 'https://www.linkedin.com/company/isoinstitute/',
};

interface SplashFooterProps {
  onNavigateToAbout?: () => void;
  onNavigateToFAQ?: () => void;
  onNavigateToAssist?: () => void;
  onWaitlistClick?: () => void;
}

function FooterLink({
  children,
  onClick,
  href,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="splash-footer-link"
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="splash-footer-link">
      {children}
    </button>
  );
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export function SplashFooter({
  onNavigateToAbout,
  onNavigateToFAQ,
  onNavigateToAssist,
  onWaitlistClick,
}: SplashFooterProps) {
  return (
    <footer className="splash-footer">
      <div className="splash-footer-inner">
        <div className="splash-footer-brand">
          <img src="/ISO OFFICIAL.png" alt="ISO Institute" className="splash-footer-logo" />
          <p className="splash-footer-tagline">A movement, a system, a community.</p>
        </div>

        <div className="splash-footer-grid">
          <div>
            <h3 className="splash-footer-col-title">Resources</h3>
            <ul className="splash-footer-links">
              {onNavigateToAssist && (
                <li>
                  <FooterLink onClick={onNavigateToAssist}>The Assist</FooterLink>
                </li>
              )}
              {onNavigateToFAQ && (
                <li>
                  <FooterLink onClick={onNavigateToFAQ}>FAQ</FooterLink>
                </li>
              )}
              {onWaitlistClick && (
                <li>
                  <FooterLink onClick={onWaitlistClick}>Join Waitlist</FooterLink>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="splash-footer-col-title">Company</h3>
            <ul className="splash-footer-links">
              {onNavigateToAbout && (
                <li>
                  <FooterLink onClick={onNavigateToAbout}>About</FooterLink>
                </li>
              )}
              <li>
                <FooterLink href={SOCIAL_LINKS.instagram}>Contact</FooterLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="splash-footer-col-title">Follow</h3>
            <div className="splash-footer-social">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="splash-footer-social-link"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="splash-footer-social-link"
                aria-label="Follow us on TikTok"
              >
                <TikTokIcon />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="splash-footer-social-link"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="splash-footer-bottom">
          <p>&copy; {new Date().getFullYear()} ISO Institute. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
