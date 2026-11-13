/**
 * ISO landing page: scroll-story splash, how it works (player / coach walkthroughs),
 * the first ISO, ranks, Invitationals, pathways, safety, FAQ and a closing CTA.
 * Styles live in src/styles/iso-landing.css; the splash animation in
 * src/components/landing/splashStory.ts. Media lives in public/iso/.
 */
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { initSplashStory } from '../components/landing/splashStory';
import '../styles/iso-landing.css';

const WAITLIST_URL = 'https://tally.so/r/Y5Ee75';
const DISCORD_URL = 'https://discord.gg/X3hvk4vZd';
const INSTAGRAM_URL = 'https://www.instagram.com/isoapp.co/';
const IMG = '/iso/img/';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const playSafe = (v: HTMLVideoElement | null) => {
  const p = v?.play();
  if (p && p.catch) p.catch(() => {});
};

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

type Beat = { t: number; title: string; body: string };
type Shot = { src: string; alt: string; title: string; body: string };
type Role = 'players' | 'coaches';

const WALKS: Record<
  Role,
  { video: string; poster: string; label: string; note: string; beats: Beat[]; shots: Shot[] }
> = {
  players: {
    video: 'v-player-full.mp4',
    poster: 's3-P1-Map.webp',
    label: 'A full ISO as a player: find a coach on the map, claim a seat, check in, ask questions, rate the ISO and rank up',
    note: 'Every step a player sees, from the map to ranking up.',
    beats: [
      { t: 0, title: 'Find a coach near you', body: 'Pins show coaches on your path at cafés and gyms around your city.' },
      { t: 5.0, title: 'Check their coach card', body: "Where they work now, their path here and what they're open to." },
      { t: 9.4, title: 'Say "I got next"', body: 'A one-time 18+ ID check, then you commit to showing up.' },
      { t: 19.4, title: 'Your seat is locked in', body: 'The exact spot unlocks 24 hours before, only for confirmed players.' },
      { t: 24.3, title: 'Pull up and check in', body: 'Show the coach your four-digit code. No code, no seat.' },
      { t: 27.3, title: 'Ask what you came to ask', body: 'Guided questions keep it easy, and your notes save to My ISOs.' },
      { t: 33.7, title: 'Rate the ISO', body: 'Stars and what stood out. Coaches only see an average.' },
      { t: 38.5, title: 'Level up', body: 'Every ISO counts toward your next rank.' },
    ],
    shots: [
      { src: 's3-P1-Map.webp', alt: 'Map with coach pins around Denver', title: 'Find a coach', body: 'The map shows coaches on your path near you.' },
      { src: 's3-P2-MapSheet.webp', alt: 'Coach preview sheet on the map', title: 'Preview the ISO', body: 'Tap a pin for the time, area and open seats.' },
      { src: 's3-P2C-Front.webp', alt: 'Front of a coach card', title: 'Their coach card', body: 'Role, company and key boxes at a glance.' },
      { src: 's3-P2C-Back.webp', alt: 'Back of a coach card with their path', title: 'Flip for their path', body: "Past roles and the topics they're open to." },
      { src: 's3-P3-ISODetail.webp', alt: 'ISO details with seats and an I got next button', title: 'Say "I got next"', body: 'Claim one of 2–4 seats. Players on that path get first call.' },
      { src: 's3-P-Verify.webp', alt: 'One-time 18+ ID check', title: "Verify you're 18+", body: 'A one-time ID check before your first seat.' },
      { src: 's3-P-Commit.webp', alt: 'Commitment sheet before claiming a seat', title: 'Commit to it', body: "Cancel 12+ hours before if you can't make it. Coaches give their time." },
      { src: 's3-P4-Confirmed.webp', alt: 'Seat confirmed with a check-in code', title: 'Seat confirmed', body: 'The exact spot unlocks 24 hours before, only for confirmed players.' },
      { src: 's3-P5-CheckIn.webp', alt: 'Check-in screen showing a four-digit code', title: 'Show your code', body: 'Give the coach your four digits when you pull up.' },
      { src: 's3-P5G-GuidedQuestions.webp', alt: 'Guided questions during an ISO', title: 'Ask what you came to ask', body: 'Guided questions so everyone at the table gets their answer.' },
      { src: 's3-P-Rate.webp', alt: 'Rating the ISO with stars', title: 'Rate the ISO', body: 'Stars and what stood out. Your name stays private.' },
      { src: 's3-P-Rank.webp', alt: 'Rank up to Junior Varsity', title: 'Level up', body: "Five ISOs and you're off the bench." },
    ],
  },
  coaches: {
    video: 'v-coach-full.mp4',
    poster: 's3-K13-CoachMap.webp',
    label: 'A full ISO as a coach: drop a pin, check players in, run the ISO Guide, review the ISO and rank up',
    note: 'Every step a coach sees, from dropping a pin to ranking up.',
    beats: [
      { t: 0, title: 'Pick your usual spot', body: 'Partner cafés, gyms and coworking spots on the map.' },
      { t: 1.8, title: 'Set a time and seats', body: "Your schedule, 2–4 seats and the topics you're open to." },
      { t: 8.2, title: 'Review your pin', body: 'Players only see the area until 24 hours before.' },
      { t: 10.8, title: 'Your ISO is live', body: 'Players on your path and your followers get a ping.' },
      { t: 15.9, title: 'Check players in', body: 'Each player shows a code when they pull up. No code, no seat.' },
      { t: 20.0, title: 'Run it with the ISO Guide', body: "A timed plan, prompts to steer the room and notes on who's there." },
      { t: 25.1, title: 'Wrap up and review', body: 'Finish the ISO and tell us how it went. Players rate it too.' },
      { t: 35.4, title: 'Rank up', body: 'Every ISO grows your Overall and unlocks more.' },
    ],
    shots: [
      { src: 's3-K13-CoachMap.webp', alt: 'Coach map of partner spots', title: 'Pick a spot', body: "Partner spots near you, with when they're quiet." },
      { src: 's3-K2-DropSpot.webp', alt: 'Drop a pin screen with time and seats', title: 'Set time and seats', body: 'Day, time, 2–4 seats and your topics on one screen.' },
      { src: 's3-K6-DropConfirm.webp', alt: 'Review your pin screen', title: 'Review your pin', body: "Check the spot, time and who it's open to." },
      { src: 's3-K6-Live.webp', alt: 'Pin dropped confirmation', title: 'Your ISO is live', body: 'Players on your path and your followers get a ping.' },
      { src: 's3-K1-CoachISOs.webp', alt: 'My ISOs with upcoming ISOs and claimed seats', title: 'Watch seats fill', body: 'See who claimed a seat, run late or open the Huddle.' },
      { src: 's3-K8-CoachCheckIn.webp', alt: 'Checking players in with their codes', title: 'Check players in', body: 'Each player shows a code when they pull up.' },
      { src: 's3-K8G-ISOGuide.webp', alt: 'ISO Guide with a timed plan', title: 'Run it with the ISO Guide', body: 'A timed plan with what to say for each part.' },
      { src: 's3-K-Who.webp', alt: 'ISO Guide showing who is here and follow-ups', title: "Know who's there", body: 'Where each player is on their path, prompts to steer the room and private follow-ups.' },
      { src: 's3-K-Finish.webp', alt: 'ISO Guide with the Finish ISO prompt', title: 'Wrap up', body: "Tap Finish ISO when you're done. Players get asked to rate it." },
      { src: 's3-K-Review.webp', alt: "How was today's ISO feedback sheet", title: 'Review the ISO', body: 'Great, okay or rough, plus anything that would make coaching better.' },
      { src: 's3-K11-CoachRankUp.webp', alt: 'Coach rank up to Platinum', title: 'Rank up', body: 'Every ISO grows your Overall and unlocks more.' },
      { src: 's3-K-Profile.webp', alt: 'Coach profile with followers and streak', title: 'Build your name', body: 'Followers, ISOs hosted and your streak, all on your profile.' },
    ],
  },
};

const REVIEWS = [
  { quote: 'Talking to someone at a higher level who made it in engineering, which sometimes feels impossible, gave me a lot of insight and motivation.', name: 'Ryan Zaghab' },
  { quote: 'Networking made better. Real people you can actually speak to about your real questions.', name: 'Hanad Ali' },
  { quote: "If you're looking for a sense of guidance or community in a difficult job market or new space, ISO is the way to do that.", name: 'Abeal Gebreziabher' },
  { quote: 'Great, honest, and professional advice.', name: 'Awab' },
  { quote: 'Speaking to someone who was in your shoes before.', name: 'Hanad Ali' },
  { quote: "Made me feel like I'm capable of doing the things everyone else is.", name: 'Ryan Zaghab' },
];

const PATHWAYS = [
  { name: 'Builder', field: 'Engineering & tech', live: true },
  { name: 'Founder', field: 'Entrepreneurship & business' },
  { name: 'Healer', field: 'Medicine & healthcare' },
  { name: 'Reformer', field: 'Law & public policy' },
  { name: 'Warrior', field: 'Health, fitness & athletics' },
  { name: 'Seeker', field: 'Deen, purpose & character' },
];

const SAFETY = [
  { title: 'Public places only', body: 'Every ISO is at a café, gym or third space. Never a private address.' },
  { title: 'Always a small group', body: 'One coach and 2–4 players at the table.' },
  { title: 'Spot shared late', body: 'The exact location goes only to confirmed players, 24 hours before.' },
  { title: 'Check in with a code', body: 'Everyone checks in on arrival, and anyone can report a problem.' },
];

const FAQS = [
  { q: 'Is ISO free?', a: "Yes, there's a free tier for players, so everyone has a way in. It comes with some limits, and coaches host for free. ISO is built for access, so the core experience is meant to stay that way." },
  { q: 'Why not just message people on LinkedIn?', a: "Cold messages to strangers mostly go unanswered, and the person who replies usually lives in another city. On ISO, the coach has already raised their hand to meet, they're on your path, and they're down the street. You show up and ask in person." },
  { q: 'Why would a successful professional host for free?', a: 'Most people who made it remember someone who helped them. ISO makes giving back easy: coaches pick a spot they already go to, on their own schedule, and build a coach card and reputation in their city along the way. Coaches who run ISOs consistently also get a free player membership.' },
  { q: "Wait, isn't an ISO one-on-one?", a: "In basketball, yes. On ISO it's always a small group: one coach and 2–4 players. It's safer, it's lower pressure, and you learn from everyone else's questions too. That's how your growth compounds." },
  { q: 'Is the app out?', a: "Not yet. We're running ISOs by hand in Denver first to get the experience right. Join the waitlist to hear when ISOs open near you." },
  { q: 'Where is ISO available?', a: 'Denver, starting with the Builder pathway (engineering and tech). Join the waitlist and tell us your city and path so we know where to go next.' },
  { q: 'Can I become a coach?', a: "If you're doing big things in your field and want to pay it forward, DM us at @isoapp.co. We're looking for founding coaches." },
];

const MENU = [
  { href: '#how', label: 'How it works' },
  { href: '#first-iso', label: 'The first ISO' },
  { href: '#pathways', label: 'Pathways' },
  { href: '#coaches', label: 'Coach on ISO' },
  { href: '#assist', label: 'The Assist' },
  { href: '#about', label: 'About' },
  { href: '#faq', label: 'FAQ' },
];

/** Hashes that open their own page (handled by App) rather than a section here. */
const PAGE_HASHES = new Set(['about', 'assist']);

const PAGE_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#assist', label: 'The Assist' },
];

/** Switch to another page: App listens for popstate and swaps the view. */
function openPage(href: string) {
  window.history.pushState(null, '', href);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

const SOCIALS = [
  { label: 'Instagram', href: INSTAGRAM_URL },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/isoapp/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@isoapp.co' },
  { label: 'YouTube', href: 'https://www.youtube.com/@ISO-1v' },
];

const SECTION_ALIASES: Record<string, string> = { coaches: 'how', questions: 'faq' };

// ---------------------------------------------------------------------------
// Small pieces
// ---------------------------------------------------------------------------

function MenuIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2 5h12M2 11h12" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M3 5l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Phone({ src, alt, lazy = true }: { src: string; alt: string; lazy?: boolean }) {
  return (
    <div className="phone">
      <img src={IMG + src} alt={alt} loading={lazy ? 'lazy' : undefined} decoding="async" />
    </div>
  );
}

/** Plays a muted looping video only while it is on screen. */
function InViewVideo({
  src,
  poster,
  label,
  style,
  preload = 'metadata',
  videoRef,
}: {
  src: string;
  poster: string;
  label: string;
  style?: React.CSSProperties;
  preload?: 'none' | 'metadata' | 'auto';
  videoRef?: React.MutableRefObject<HTMLVideoElement | null>;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (videoRef) videoRef.current = v;
    if (reducedMotion()) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) playSafe(v);
        else v.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [videoRef]);
  return (
    <video
      ref={ref}
      src={IMG + src}
      poster={IMG + poster}
      muted
      loop
      playsInline
      preload={preload}
      aria-label={label}
      style={style}
    />
  );
}

// ---------------------------------------------------------------------------
// Walkthrough: a looping phone video with beats that follow along
// ---------------------------------------------------------------------------

function Walkthrough({ role, active }: { role: Role; active: boolean }) {
  const walk = WALKS[role];
  const videoRef = useRef<HTMLVideoElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const inView = useRef(false);
  const [beat, setBeat] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const allId = `all-${role}`;

  // highlight the beat that matches the video's current time
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const mark = () => {
      const t = v.currentTime;
      let i = 0;
      walk.beats.forEach((b, j) => {
        if (t >= b.t) i = j;
      });
      setBeat(i);
    };
    v.addEventListener('timeupdate', mark);
    v.addEventListener('seeked', mark);
    return () => {
      v.removeEventListener('timeupdate', mark);
      v.removeEventListener('seeked', mark);
    };
  }, [walk]);

  // play only while visible and selected
  useEffect(() => {
    const v = videoRef.current;
    const el = phoneRef.current;
    if (!v || !el) return;
    if (!active) {
      v.pause();
      return;
    }
    try {
      v.currentTime = 0;
    } catch {
      /* not seekable yet */
    }
    setBeat(0);
    if (reducedMotion()) return;
    const io = new IntersectionObserver(
      ([e]) => {
        inView.current = e.isIntersecting;
        if (e.isIntersecting) playSafe(v);
        else v.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [active]);

  const jump = (i: number) => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.currentTime = walk.beats[i].t + 0.05;
    } catch {
      /* ignore */
    }
    setBeat(i);
    if (!reducedMotion()) playSafe(v);
  };

  return (
    <div className="view" id={`view-${role}`} hidden={!active}>
      <div className="walk">
        <div className="phone" ref={phoneRef}>
          <video
            ref={videoRef}
            src={IMG + walk.video}
            poster={IMG + walk.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={walk.label}
          />
        </div>
        <div className="walk-side">
          <ol className="beats">
            {walk.beats.map((b, i) => (
              <li key={b.title} className={i === beat ? 'on' : undefined}>
                <button type="button" onClick={() => jump(i)} aria-current={i === beat ? 'step' : undefined}>
                  <span className="k">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <b>{b.title}</b>
                    <em>{b.body}</em>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="expand"
            aria-expanded={expanded}
            aria-controls={allId}
            onClick={() => setExpanded((x) => !x)}
          >
            <span>{expanded ? 'Hide screens' : 'See every screen'}</span>
            <Chevron />
          </button>
        </div>
      </div>
      <div className="all" id={allId} hidden={!expanded}>
        <p className="all-note">{walk.note}</p>
        <div className="shots">
          {walk.shots.map((s, i) => (
            <figure className="shot" key={s.src}>
              <Phone src={s.src} alt={s.alt} />
              <figcaption>
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <b>{s.title}</b>
                {s.body}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// "How an ISO works" diagram: plays once when it scrolls into view
// ---------------------------------------------------------------------------

function SeatDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setPlay(true);
          io.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`dg${play ? ' play' : ''}`} ref={ref}>
      <svg
        viewBox="0 0 560 380"
        role="img"
        aria-label="One coach card with lines to four seats. In basketball an ISO is one-on-one; on ISO one coach opens up to four seats, and you take one."
      >
        <defs>
          <clipPath id="lp-cardclip">
            <rect x="20" y="64" width="202" height="253" rx="12" />
          </clipPath>
          <radialGradient id="lp-glow">
            <stop offset="0" stopColor="#c8873a" stopOpacity=".8" />
            <stop offset=".45" stopColor="#c8873a" stopOpacity=".35" />
            <stop offset="1" stopColor="#c8873a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <image
          className="cardimg"
          href={IMG + 'card-renat.webp'}
          x="20"
          y="64"
          width="202"
          height="253"
          clipPath="url(#lp-cardclip)"
          preserveAspectRatio="xMidYMid slice"
        />
        <path className="ln l2" pathLength={1} d="M222 190 C 320 190, 320 70, 404 70" />
        <path className="ln l1" pathLength={1} d="M222 190 C 320 190, 320 150, 404 150" />
        <path className="ln l3" pathLength={1} d="M222 190 C 320 190, 320 230, 404 230" />
        <path className="ln l4" pathLength={1} d="M222 190 C 320 190, 320 310, 404 310" />
        <path className="ln you-ln" pathLength={1} d="M222 190 C 320 190, 320 230, 404 230" />
        {[
          ['s2', 70],
          ['s1', 150],
          ['s3', 230],
          ['s4', 310],
        ].map(([cls, y]) => (
          <g className={`seat ${cls}`} key={cls}>
            <circle className="o" cx="430" cy={y} r="24" />
            <text x="466" y={Number(y) + 5}>
              Open seat
            </text>
          </g>
        ))}
        <g className="you">
          <circle cx="430" cy="230" r="40" fill="url(#lp-glow)" />
          <circle cx="430" cy="230" r="6" fill="#F6D9B4" />
          <text x="466" y="235">
            You
          </text>
        </g>
        <circle className="rip" cx="430" cy="230" r="24" />
      </svg>
      <ol className={`caps${play ? ' play' : ''}`}>
        <li>
          <b>1</b>In basketball, an ISO is one-on-one.
        </li>
        <li>
          <b>4</b>On ISO, one coach opens up to 4 seats.
        </li>
        <li>
          <b>&rarr;</b>You call next on one of them.
        </li>
      </ol>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function IsoLanding() {
  const rootRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const reelRef = useRef<HTMLVideoElement | null>(null);
  const [quiet, setQuiet] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrim, setScrim] = useState<'hidden' | 'shown' | 'on'>('hidden');
  const [role, setRole] = useState<Role>(() => (window.location.hash === '#coaches' ? 'coaches' : 'players'));
  const [soundOn, setSoundOn] = useState(false);
  const menuWasOpened = useRef(false);

  // splash scroll story
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return initSplashStory(root, setQuiet);
  }, []);

  // land on a section when the page opens with a hash (e.g. /#faq)
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const id = SECTION_ALIASES[hash] ?? hash;
    const el = document.getElementById(id);
    if (el) {
      const de = document.documentElement;
      const prev = de.style.scrollBehavior;
      de.style.scrollBehavior = 'auto';
      el.scrollIntoView();
      de.style.scrollBehavior = prev;
    }
  }, []);

  // drawer open/close, scrim fade, focus handling
  useEffect(() => {
    if (menuOpen) {
      menuWasOpened.current = true;
      setScrim('shown');
      const f = requestAnimationFrame(() => setScrim('on'));
      const t = window.setTimeout(() => drawerRef.current?.querySelector('a')?.focus(), 60);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMenuOpen(false);
      };
      document.addEventListener('keydown', onKey);
      return () => {
        cancelAnimationFrame(f);
        window.clearTimeout(t);
        document.removeEventListener('keydown', onKey);
      };
    }
    setScrim((s) => (s === 'hidden' ? s : 'shown'));
    const t = window.setTimeout(() => setScrim('hidden'), 300);
    if (menuWasOpened.current) menuBtnRef.current?.focus({ preventScroll: true });
    return () => window.clearTimeout(t);
  }, [menuOpen]);

  const scrollToId = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
  }, []);

  const onMenuLink = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setMenuOpen(false);
    const hash = href.slice(1);
    if (PAGE_HASHES.has(hash)) {
      openPage(href);
      return;
    }
    if (hash === 'coaches') setRole('coaches');
    history.replaceState(null, '', href);
    scrollToId(SECTION_ALIASES[hash] ?? hash);
  };

  const onTopLink = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    history.replaceState(null, '', window.location.pathname + window.location.search);
    window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
  };

  const onHowLink = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    history.replaceState(null, '', '#how');
    scrollToId('how');
  };

  const toggleSound = () => {
    const reel = reelRef.current;
    if (!reel) return;
    const next = reel.muted;
    reel.muted = !next;
    setSoundOn(next);
    if (next) playSafe(reel);
  };

  return (
    <div className="iso-lp" ref={rootRef}>
      <nav className={`lp-nav${quiet ? ' quiet' : ''}`} aria-label="Main">
        <div className="wrap">
          <a className="brand" href="#top" aria-label="ISO home" onClick={onTopLink}>
            <img src={IMG + 'logo.webp'} alt="" width={30} height={30} />
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
              aria-expanded={menuOpen}
              aria-controls="lp-drawer"
              onClick={() => setMenuOpen(true)}
            >
              <span>Menu</span>
              <MenuIcon />
            </button>
          </div>
        </div>
      </nav>

      <div className={`scrim${scrim === 'on' ? ' on' : ''}`} hidden={scrim === 'hidden'} onClick={() => setMenuOpen(false)} />
      <aside
        ref={drawerRef}
        className={`drawer${menuOpen ? ' on' : ''}`}
        id="lp-drawer"
        aria-label="Menu"
        aria-hidden={!menuOpen}
      >
        <div className="dtop">
          <span className="eyebrow dk">The lineup</span>
          <button type="button" className="mbtn" onClick={() => setMenuOpen(false)}>
            <span>Close</span>
            <CloseIcon />
          </button>
        </div>
        <ol>
          {MENU.map((m, i) => (
            <li key={m.href}>
              <a href={m.href} onClick={(e) => onMenuLink(e, m.href)} tabIndex={menuOpen ? 0 : -1}>
                <span className="jn">{String(i + 1).padStart(2, '0')}</span>
                <span className="lb">{m.label}</span>
                <span className="ar">&rarr;</span>
              </a>
            </li>
          ))}
        </ol>
        <a className="dcta" href={WAITLIST_URL} target="_blank" rel="noopener noreferrer" tabIndex={menuOpen ? 0 : -1}>
          Join the waitlist
        </a>
      </aside>

      {/* ---------- splash: scroll story ---------- */}
      <header className="sp-track" id="top">
        <div className="sp-stage">
          <canvas className="sp-back" aria-hidden="true" />
          <div className="sp-phone">
            <img src={IMG + 's3-P1-Map.webp'} alt="The ISO app map in Denver, showing coach pins around your location" />
          </div>
          <div className="sp-card" role="button" tabIndex={-1} aria-label="Flip Renat's coach card to see her path">
            <div className="sp-flip">
              <img
                className="f"
                src={IMG + 'card-renat.webp'}
                alt="Coach card for Renat Mohamed, a Builder and structural design engineer in Denver"
              />
              <img
                className="b"
                src={IMG + 'card-renat-back.webp'}
                alt="Back of the card: structural design engineer at JVA, previously a graduate researcher and McNair Scholar at Texas Tech"
              />
            </div>
            <p className="sp-tip">Tap to flip</p>
          </div>
          <canvas className="sp-front" aria-hidden="true" />

          <div className="sp-copy mid sp-scene" data-sp="0">
            <p className="sp-ln sp-you" data-at=".02">You.</p>
            <p className="sp-ln sp-say" data-at=".036">A talented individual with a lack of access.</p>
            <p className="sp-ln sp-say dim" data-at=".05">Your cold messages get ignored.</p>
            <p className="sp-ln sp-say dim" data-at=".064">Your alumni network is non-existent or completely fragmented.</p>
            <p className="sp-ln sp-say dim" data-at=".078">No existing professional network to lean on.</p>
            <p className="sp-ln sp-say dim" data-at=".092">
              You&rsquo;re in search of guidance in your pathway but don&rsquo;t know where to start.
            </p>
            <h2 className="sp-ln sp-turn" data-at=".108">
              Your problem isn&rsquo;t ability. It&rsquo;s <em>proximity.</em>
            </h2>
          </div>
          <div className="sp-copy top" data-sp="1">
            <p className="sp-eyebrow">The problem</p>
            <h2>Six degrees of separation.</h2>
            <p className="sp-sub">
              The person who could change your path is probably only a few introductions away. For most people, that
              chain breaks after the first one.
            </p>
          </div>
          <div className="sp-copy top" data-sp="2">
            <p className="sp-eyebrow">ISO</p>
            <h2>Skip the chain.</h2>
            <p className="sp-sub">
              Go from A straight to G. Sit down with the person you actually need to meet, no warm intro required.
            </p>
          </div>
          <div className="sp-copy mid" data-sp="3">
            <p className="sp-eyebrow">Launching in Denver</p>
            <h1>
              Your city&rsquo;s best. ISO puts them <em>on the map.</em>
            </h1>
            <p className="sp-sub">Find successful professionals on your path, in your city, at the places you go to most.</p>
            <div className="sp-ctas">
              <a className="btn" href={WAITLIST_URL} target="_blank" rel="noopener noreferrer">
                Join the waitlist
              </a>
              <a className="btn ghost" href="#how" onClick={onHowLink}>
                See how it works
              </a>
            </div>
          </div>

          <button type="button" className="sp-skip">
            Skip intro
          </button>
          <div className="sp-hint" aria-hidden="true">
            Scroll
            <i />
          </div>
          <p className="sp-sr">
            You. A talented individual with a lack of access. Your problem isn&rsquo;t ability, it&rsquo;s proximity.
            Six degrees of separation: seven people, A to G, in a chain of introductions. ISO skips the chain and goes
            straight from A to G. The world turns to Denver and the dot lands on your location in the ISO app map.
          </p>
        </div>
      </header>

      <main>
        {/* ---------- how it works ---------- */}
        <section id="how">
          <div className="wrap">
            <div className="how-top">
              <div>
                <div className="eyebrow">How an ISO works</div>
                <h2>Their routine. Your seat.</h2>
                <p className="lede">
                  In basketball, an ISO is one-on-one against someone built to challenge you. Here, it&rsquo;s with a
                  coach at a spot in your city, built to do the same.
                </p>
              </div>
              <SeatDiagram />
            </div>
            <div className="seg" role="group" aria-label="Show how it works for">
              <button type="button" aria-pressed={role === 'players'} onClick={() => setRole('players')}>
                I&rsquo;m a player
              </button>
              <button type="button" aria-pressed={role === 'coaches'} onClick={() => setRole('coaches')}>
                I&rsquo;m a coach
              </button>
            </div>
            <Walkthrough role="players" active={role === 'players'} />
            <Walkthrough role="coaches" active={role === 'coaches'} />
          </div>
        </section>

        {/* ---------- the first ISO ---------- */}
        <section className="proof" id="first-iso">
          <div className="wrap">
            <div className="proof-head">
              <div>
                <div className="eyebrow">The first ISO · Aurora, CO · Nov 1</div>
                <h2>Here&rsquo;s how the first one went.</h2>
                <p className="lede">
                  We ran the first ISO by hand at Coffee Story in Aurora: one Builder coach, a table of college students,
                  and questions about internships, networking and belonging. Then we asked how it went.
                </p>
              </div>
              <a className="btn ghost" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                Watch the recap on Instagram
              </a>
            </div>
            <div className="stats">
              <div className="stat">
                <b>5.0</b>
                <span>average rating out of 5 stars</span>
              </div>
              <div className="stat">
                <b>9.75</b>
                <span>out of 10 on &ldquo;would you recommend ISO to a friend&rdquo;</span>
              </div>
              <div className="stat">
                <b>4 / 4</b>
                <span>said &ldquo;Yes, for sure&rdquo; to coming back</span>
              </div>
              <div className="stat">
                <b>4 / 4</b>
                <span>would pull up with a coach they&rsquo;ve never met</span>
              </div>
            </div>
            <p className="footnote">From the feedback form after ISO #1. All 4 players responded.</p>
          </div>

          <div className="wrap">
            <div className="gallery">
              <div className="g g-reel">
                <InViewVideo
                  src="reel.mp4"
                  poster="reel-poster.jpg"
                  preload="none"
                  label="ISO promo reel: a Builder coach drops a pin, the first ISO at Coffee Story, and ranking up"
                  videoRef={reelRef}
                />
                <span className="g-tag">The reel</span>
                <button
                  type="button"
                  className="snd"
                  aria-pressed={soundOn}
                  aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}
                  onClick={toggleSound}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
                    {soundOn ? (
                      <path
                        d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    ) : (
                      <path d="M17 9l5 6M22 9l-5 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    )}
                  </svg>
                </button>
              </div>
              <div className="g">
                <img
                  src={IMG + 'p-talk.webp'}
                  alt="The coach talking with players around a table at Coffee Story"
                  style={{ objectPosition: '55% 55%' }}
                  loading="lazy"
                  decoding="async"
                />
                <span className="g-tag">Coffee Story · Aurora</span>
              </div>
              <div className="g">
                <img
                  src={IMG + 'p-selfie.webp'}
                  alt="Group photo from the first ISO"
                  style={{ objectPosition: '50% 40%' }}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="g">
                <InViewVideo src="c-qr.mp4" poster="c-qr-poster.jpg" label="Players scanning the feedback QR code" />
              </div>
              <div className="g">
                <InViewVideo
                  src="c-table.mp4"
                  poster="c-table-poster.jpg"
                  label="Conversation at the table"
                  style={{ objectPosition: '50% 45%' }}
                />
              </div>
            </div>
          </div>
          <div className="revs-head wrap">
            <div className="eyebrow">In their words</div>
          </div>
          <div className="marquee" aria-label="Reviews from the first ISO">
            <div className="track">
              {[...REVIEWS, ...REVIEWS].map((r, i) => (
                <figure className="rev" key={i} aria-hidden={i >= REVIEWS.length ? true : undefined}>
                  <div className="stars" role="img" aria-label="5 out of 5 stars">
                    ★★★★★
                  </div>
                  <blockquote>&ldquo;{r.quote}&rdquo;</blockquote>
                  <figcaption className="who">
                    <div className="av" aria-hidden="true">
                      {r.name[0]}
                    </div>
                    <div>
                      <b>{r.name}</b>
                      <small>Builder · Player</small>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- rank up ---------- */}
        <section id="ranks" className="alt">
          <div className="wrap split">
            <div>
              <div className="eyebrow">Rank up</div>
              <h2>Every ISO, you level up.</h2>
              <p className="lede">
                Players climb from Freshman to All-Star. Coaches grow their Overall and build a card that shows the
                impact they&rsquo;ve had in their city.
              </p>
              <ul className="ticks">
                <li>
                  <div>
                    Players unlock gear <span>and first access to Invitationals as they rank</span>
                  </div>
                </li>
                <li>
                  <div>
                    Reach Pro <span>and you can apply to coach</span>
                  </div>
                </li>
                <li>
                  <div>
                    Coaches build their name{' '}
                    <span>with every pin, and followers get notified when they drop one</span>
                  </div>
                </li>
                <li>
                  <div>
                    Coaches who host consistently{' '}
                    <span>get a free player membership, so they can take seats too</span>
                  </div>
                </li>
              </ul>
              <span className="soon">Rewards coming soon</span>
            </div>
            <div className="duo">
              <Phone src="s3-P8-RankPlayer.webp" alt="Player rank ladder from Freshman to All-Star, currently Junior Varsity" />
              <Phone src="s3-K12-CoachProfile.webp" alt="Coach profile with card, followers, streak and Overall rating" />
            </div>
          </div>
        </section>

        {/* ---------- Invitationals ---------- */}
        <section id="invitationals" className="inv">
          <div className="wrap split">
            <div className="duo">
              <Phone
                src="s-P16-Invitationals.webp"
                alt="The Events tab in the ISO app showing a ticketed Builder Invitational with a coach co-host and claimed spots"
              />
            </div>
            <div>
              <div className="eyebrow">ISO Invitationals</div>
              <h2>Every path gets its big night.</h2>
              <p className="lede">
                Each pathway has its own Invitational: a ticketed event that brings players and coaches on that path
                into one room. The city&rsquo;s top coaches cohost.
              </p>
              <ul className="ticks">
                <li>
                  <div>
                    One for every pathway <span>Builder, Founder, Healer, Reformer, Warrior and Seeker</span>
                  </div>
                </li>
                <li>
                  <div>
                    Coaches cohost <span>and put their name on the biggest night on their path</span>
                  </div>
                </li>
                <li>
                  <div>
                    Players who rank up <span>get first access to tickets</span>
                  </div>
                </li>
              </ul>
              <span className="soon">First Invitational: January 2027 in Denver</span>
            </div>
          </div>
        </section>

        {/* ---------- pathways ---------- */}
        <section id="pathways">
          <div className="wrap">
            <div className="eyebrow">Six pathways</div>
            <h2>Find your path. Meet who&rsquo;s already on it.</h2>
            <p className="lede">We&rsquo;re starting with Builders in Denver. As each city fills up, more pathways open.</p>
            <div className="paths">
              {PATHWAYS.map((p) => (
                <div className={`path${p.live ? ' live' : ''}`} key={p.name}>
                  <span className="tag">{p.live ? 'Live in Denver' : 'Coming'}</span>
                  <h3>{p.name}</h3>
                  <p>{p.field}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- safety ---------- */}
        <section id="safety" className="alt">
          <div className="wrap">
            <div className="eyebrow">Safe by design</div>
            <h2>Public spots. Never one-on-one.</h2>
            <div className="safe">
              {SAFETY.map((s) => (
                <div key={s.title}>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section id="faq">
          <div className="wrap faq">
            <div>
              <div className="eyebrow">FAQ</div>
              <h2>Questions people ask us.</h2>
              <p className="lede">Got one we didn&rsquo;t answer? DM us on Instagram at @isoapp.co.</p>
            </div>
            <div>
              {FAQS.map((f, i) => (
                <details key={f.q} open={i === 0}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- closing ---------- */}
        <section className="close">
          <div className="wrap">
            <h2>Who got next?</h2>
            <p className="lede">Get first call when coaches start dropping pins near you.</p>
            <div className="ctas">
              <a className="btn" href={WAITLIST_URL} target="_blank" rel="noopener noreferrer">
                Join the waitlist
              </a>
              <a className="btn ghost" href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
                Join the Discord
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <a className="brand" href="#top" aria-label="Back to top" onClick={onTopLink}>
            <img src={IMG + 'logo.webp'} alt="" width={30} height={30} loading="lazy" />
            <b>ISO</b>
          </a>
          <div className="social">
            {PAGE_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                  e.preventDefault();
                  openPage(l.href);
                }}
              >
                {l.label}
              </a>
            ))}
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            ))}
          </div>
          <span>Pull as you climb.</span>
        </div>
      </footer>
    </div>
  );
}

export default IsoLanding;
