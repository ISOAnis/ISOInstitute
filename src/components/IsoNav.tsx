import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Instagram, Linkedin, Youtube } from 'lucide-react';
import '../styles/iso-nav.css';

const WAITLIST_URL = 'https://tally.so/r/Y5Ee75';
const LOGO_SRC = '/ISO OFFICIAL.png';

const LINKS: { href: string; label: string }[] = [
  { href: '/#how', label: 'How it works' },
  { href: '/#first-iso', label: 'The first ISO' },
  { href: '/#pathways', label: 'Pathways' },
  { href: '/#assist', label: 'The Assist' },
  { href: '/#about', label: 'About' },
  { href: '/#questions', label: 'FAQ' },
];

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/isoapp.co/', icon: <Instagram size={18} /> },
  { label: 'TikTok', href: 'https://www.tiktok.com/@isoapp.co', icon: <TikTokIcon /> },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/isoapp/', icon: <Linkedin size={18} /> },
  { label: 'YouTube', href: 'https://www.youtube.com/@ISO-1v', icon: <Youtube size={18} /> },
];

function TikTokIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

type Page = 'home' | 'about' | 'faq' | 'assist';

function pageForHash(hash: string): Page {
  return hash === 'about' || hash === 'faq' || hash === 'assist' ? hash : 'home';
}

/** Section anchor a home-page hash scrolls to; `#coaches` lands on How it works. */
export function homeSectionForHash(hash: string): string | null {
  if (pageForHash(hash) !== 'home' || !hash) return null;
  return hash === 'coaches' ? 'how' : hash;
}

/**
 * Routes are hash-based, so moving between pages goes through history plus a popstate
 * event (which App listens for) instead of a full page load.
 */
function navigateTo(href: string) {
  const hash = href.split('#')[1] ?? '';
  const current = pageForHash(window.location.hash.slice(1));
  const next = pageForHash(hash);
  window.history.pushState(null, '', href);

  if (current !== next) {
    window.dispatchEvent(new PopStateEvent('popstate'));
    return;
  }

  const sectionId = homeSectionForHash(hash);
  const target = sectionId ? document.getElementById(sectionId) : null;
  if (target) target.scrollIntoView({ behavior: 'smooth' });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function IsoNav() {
  const [open, setOpen] = useState(false);
  const [scrimVisible, setScrimVisible] = useState(false);
  const [scrimOn, setScrimOn] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const hasOpened = useRef(false);

  useEffect(() => {
    if (open) {
      hasOpened.current = true;
      setScrimVisible(true);
      const frame = requestAnimationFrame(() => setScrimOn(true));
      const focusTimer = window.setTimeout(() => drawerRef.current?.querySelector('a')?.focus(), 60);
      return () => {
        cancelAnimationFrame(frame);
        window.clearTimeout(focusTimer);
      };
    }
    setScrimOn(false);
    const hideTimer = window.setTimeout(() => setScrimVisible(false), 300);
    if (hasOpened.current) menuBtnRef.current?.focus();
    return () => window.clearTimeout(hideTimer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const onInternalLink = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    setOpen(false);
    navigateTo(href);
  };

  return (
    <>
      <nav className="iso-nav" aria-label="Main">
        <div className="wrap">
          <a className="brand" href="/" aria-label="ISO home" onClick={(event) => onInternalLink(event, '/')}>
            <img src={LOGO_SRC} alt="" />
            <b>ISO</b>
          </a>
          <div className="links">
            <a className="btn" href={WAITLIST_URL} target="_blank" rel="noopener noreferrer">
              Join the waitlist
            </a>
            <button
              ref={menuBtnRef}
              type="button"
              className="mbtn"
              aria-expanded={open}
              aria-controls="iso-drawer"
              onClick={() => setOpen(true)}
            >
              <span>Menu</span>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2 5h12M2 11h12" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div className={`iso-scrim${scrimOn ? ' on' : ''}`} hidden={!scrimVisible} onClick={() => setOpen(false)} />

      <aside
        ref={drawerRef}
        className={`iso-drawer${open ? ' on' : ''}`}
        id="iso-drawer"
        aria-label="Menu"
        aria-hidden={!open}
      >
        <div className="dtop">
          <span className="eyebrow dk">The lineup</span>
          <button type="button" className="mbtn" onClick={() => setOpen(false)}>
            <span>Close</span>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
        <ol>
          {LINKS.map((link, i) => (
            <li key={link.label}>
              <a href={link.href} onClick={(event) => onInternalLink(event, link.href)}>
                <span className="jn">{String(i + 1).padStart(2, '0')}</span>
                <span className="lb">{link.label}</span>
                <span className="ar">&rarr;</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="dfoot">
          <div className="dsocial">
            <span className="eyebrow dk">Follow</span>
            <ul>
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`ISO on ${social.label}`}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <a className="dcta" href={WAITLIST_URL} target="_blank" rel="noopener noreferrer">
            Join the waitlist
          </a>
        </div>
      </aside>
    </>
  );
}
