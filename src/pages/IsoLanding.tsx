/**
 * ISO landing page: scroll-story splash, how it works (player / coach walkthroughs),
 * the first ISO, ranks, Invitationals, pathways, safety, FAQ and a closing CTA.
 * Styles live in src/styles/iso-landing.css; the splash animation in
 * src/components/landing/splashStory.ts. Media lives in public/iso/.
 */
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { Instagram, Linkedin, Youtube } from 'lucide-react';
import { initSplashStory } from '../components/landing/splashStory';
import '../styles/iso-landing.css';
import '../styles/coach-card.css';
import { BuildYourCard } from '../components/landing/BuildYourCard';
import { PathwayFocus } from '../components/landing/PathwayFocus';

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
    video: 'v-player-v4.mp4',
    poster: 's3-P1-Map.webp',
    label: 'A full ISO as a player: find a coach on the map, claim a seat, check in, ask questions, rate the ISO and rank up',
    note: 'Every step a player sees, from the map to ranking up.',
    beats: [
      { t: 0, title: 'Find a coach near you', body: 'Pins show coaches on your path at cafés and gyms around your city.' },
      { t: 4.7, title: 'Check their coach card', body: "Where they work now, their path here and what they're open to." },
      { t: 8.4, title: 'Say "I got next"', body: 'A one-time 18+ ID check, then you commit to showing up.' },
      { t: 17.2, title: 'Your seat is locked in', body: 'The exact spot unlocks 24 hours before, only for confirmed players.' },
      { t: 21.4, title: 'Pull up and check in', body: 'Show the coach your four-digit code. No code, no seat.' },
      { t: 24.1, title: 'Ask what you came to ask', body: 'Guided questions keep it easy, and your notes save to My ISOs.' },
      { t: 25.8, title: 'Record for safety', body: "Anyone can record an ISO. Everyone at the table sees it, and it's only used if you report." },
      { t: 34.0, title: 'Rate the ISO', body: 'Stars and what stood out. Coaches only see an average.' },
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
    video: 'v-coach-v4.mp4',
    poster: 's3-K13-CoachMap.webp',
    label: 'A full ISO as a coach: drop a pin, check players in, run the ISO Guide, review the ISO and rank up',
    note: 'Every step a coach sees, from dropping a pin to ranking up.',
    beats: [
      { t: 0, title: 'Pick your usual spot', body: 'Partner cafés, gyms and coworking spots on the map.' },
      { t: 1.8, title: 'Set a time and seats', body: "Your schedule, 2–4 seats and the topics you're open to." },
      { t: 6.5, title: 'Review your pin', body: 'Players only see the area until 24 hours before.' },
      { t: 8.7, title: 'Your ISO is live', body: 'Players on your path and your followers get a ping.' },
      { t: 12.9, title: 'Check players in', body: 'Each player shows a code when they pull up. No code, no seat.' },
      { t: 16.2, title: 'Run it with the ISO Guide', body: "A timed plan, prompts to steer the room and notes on who's there." },
      { t: 17.8, title: 'Record for safety', body: 'Coaches can record too. The check-in list shows who is recording.' },
      { t: 25.8, title: 'Wrap up and review', body: 'Finish the ISO and tell us how it went. Players rate it too.' },
      { t: 34.4, title: 'Rank up', body: 'Every ISO grows your Overall and unlocks more.' },
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


const SAFETY = [
  { title: 'Public places only', body: 'Every ISO is at a café, gym or third space. Never a private address.' },
  { title: 'Always a small group', body: 'One coach and 2–4 players at the table.' },
  { title: 'Spot shared late', body: 'The exact location goes only to confirmed players, 24 hours before.' },
  { title: 'Check in with a code', body: 'Everyone checks in on arrival, and anyone can report a problem.' },
  { title: 'Record for safety', body: 'Anyone can voice record an ISO. Everyone is told, it stays locked on your phone and only the safety team hears it, if you report.' },
];

const FAQS = [
  { q: 'Is ISO free?', a: "Yes, there's a free tier for players, so everyone has a way in. It comes with some limits, and coaches host for free. ISO is built for access, so the core experience is meant to stay that way." },
  { q: 'Why not just message people on LinkedIn?', a: "Cold messages to strangers mostly go unanswered, and the person who replies usually lives in another city. On ISO, the coach has already raised their hand to meet, they're on your path, and they're down the street. You show up and ask in person." },
  { q: 'Why would a successful professional host for free?', a: 'Most people who made it remember someone who helped them. ISO makes giving back easy: coaches pick a spot they already go to, on their own schedule, and build a coach card and reputation in their city along the way. Active coaches also get last call: if a seat is still open 6 hours before an ISO, they get a ping and can take it for free. Players always get first call, and coaches who want it can pay like any player.' },
  { q: "Wait, isn't an ISO one-on-one?", a: "In basketball, yes. On ISO it's always a small group: one coach and 2–4 players. It's safer, it's lower pressure, and you learn from everyone else's questions too. That's how your growth compounds." },
  { q: 'Is the app out?', a: "Not yet. We're running ISOs by hand in Denver first to get the experience right. Join the waitlist to hear when ISOs open near you." },
  { q: 'Where is ISO available?', a: 'New York and Denver, starting with the Builder pathway (engineering and tech). Join the waitlist and tell us your city and path so we know where to go next.' },
  { q: 'Can I become a coach?', a: "If you're doing big things in your field and want to pay it forward, DM us at @isoapp.co. We're looking for founding coaches." },
];

const MENU = [
  { href: '#how', label: 'How it works' },
  { href: '#first-iso', label: 'The first ISO' },
  { href: '#pathways', label: 'Pathways' },
  { href: '#assist', label: 'The Assist' },
  { href: '#about', label: 'About' },
  { href: '#faq', label: 'FAQ' },
];

/** Menu hashes that open their own page (App routes these) instead of scrolling the landing page. */
const PAGE_HASHES = new Set(['about', 'assist']);

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

function SocialIcon({ label }: { label: string }) {
  if (label === 'Instagram') return <Instagram size={18} aria-hidden="true" />;
  if (label === 'LinkedIn') return <Linkedin size={18} aria-hidden="true" />;
  if (label === 'YouTube') return <Youtube size={18} aria-hidden="true" />;
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

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
// The reel: plays while on screen, with a scrub bar that fades out while it plays
// ---------------------------------------------------------------------------

const formatTime = (sec: number) => {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/** Seconds of quiet before the controls fade while the reel is playing. */
const REEL_IDLE_MS = 2500;

function ReelPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const idleTimer = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);
  const [active, setActive] = useState(true);

  // the controls stay up while paused or scrubbing, and fade after a short idle while playing
  const wake = useCallback(() => {
    setActive(true);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setActive(false), REEL_IDLE_MS);
  }, []);
  useEffect(() => () => window.clearTimeout(idleTimer.current), []);
  // start the fade countdown as soon as it plays, so an untouched reel still clears its controls
  useEffect(() => {
    if (playing) wake();
  }, [playing, wake]);
  const shown = active || !playing || scrubbing;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const sync = () => {
      setPlaying(!v.paused);
      setTime(v.currentTime);
      if (Number.isFinite(v.duration)) setDuration(v.duration);
      let end = 0;
      for (let i = 0; i < v.buffered.length; i++) {
        if (v.buffered.start(i) <= v.currentTime + 0.5) end = Math.max(end, v.buffered.end(i));
      }
      setBuffered(end);
    };
    const events = ['play', 'pause', 'timeupdate', 'progress', 'loadedmetadata', 'durationchange', 'seeked'] as const;
    events.forEach((n) => v.addEventListener(n, sync));
    // play while on screen, unless the viewer paused it themselves
    let io: IntersectionObserver | null = null;
    if (!reducedMotion()) {
      io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting && !userPaused.current) playSafe(v);
          else if (!e.isIntersecting) v.pause();
        },
        { threshold: 0.15 },
      );
      io.observe(v);
    }
    return () => {
      events.forEach((n) => v.removeEventListener(n, sync));
      io?.disconnect();
    };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      playSafe(v);
    } else {
      userPaused.current = true;
      v.pause();
    }
    wake();
  };

  // a tap on the video first brings the controls back; once they're up it plays or pauses
  const onVideoClick = () => {
    if (!shown) wake();
    else togglePlay();
  };

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = v.muted;
    v.muted = !next;
    setSoundOn(next);
    if (next) {
      userPaused.current = false;
      playSafe(v);
    }
    wake();
  };

  const seek = (value: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = value;
    setTime(value);
  };

  const pct = (n: number) => (duration ? `${Math.min(100, (n / duration) * 100)}%` : '0%');

  return (
    <div
      className={`g g-reel${shown ? '' : ' is-idle'}`}
      onPointerMove={(e) => e.pointerType === 'mouse' && wake()}
      onPointerLeave={(e) => e.pointerType === 'mouse' && playing && setActive(false)}
      onFocus={wake}
    >
      <video
        ref={videoRef}
        src={IMG + 'reel.mp4'}
        poster={IMG + 'reel-poster.jpg'}
        muted
        loop
        playsInline
        preload="none"
        onClick={onVideoClick}
        aria-label="ISO promo reel: a Builder coach drops a pin, the first ISO at Coffee Story, and ranking up"
      />
      <span className="g-tag reel-tag">The reel</span>
      <div className="reel-bar" onPointerDown={wake}>
        <button
          type="button"
          className="reel-btn"
          aria-label={playing ? 'Pause the reel' : 'Play the reel'}
          onClick={togglePlay}
          tabIndex={shown ? 0 : -1}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            {playing ? (
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
            ) : (
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            )}
          </svg>
        </button>
        <input
          type="range"
          className="reel-scrub"
          min={0}
          max={duration || 0}
          step={0.1}
          value={time}
          onChange={(e) => seek(Number(e.target.value))}
          onPointerDown={() => setScrubbing(true)}
          onPointerUp={() => {
            setScrubbing(false);
            wake();
          }}
          onBlur={() => setScrubbing(false)}
          tabIndex={shown ? 0 : -1}
          aria-label="Scrub through the reel"
          aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
          style={{ '--p': pct(time), '--b': pct(buffered) } as React.CSSProperties}
        />
        <span className="reel-time">{formatTime(time)}</span>
        <button
          type="button"
          className="reel-btn"
          aria-pressed={soundOn}
          aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}
          onClick={toggleSound}
          tabIndex={shown ? 0 : -1}
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
    </div>
  );
}

// ---------------------------------------------------------------------------
// Walkthrough: a looping phone video with beats that follow along
// ---------------------------------------------------------------------------

function onBuildCardLink(e: MouseEvent<HTMLAnchorElement>) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  history.replaceState(null, '', '#build-card');
  document.getElementById('build-card')?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
}

function Walkthrough({ role, active }: { role: Role; active: boolean }) {
  const walk = WALKS[role];
  const videoRef = useRef<HTMLVideoElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const inView = useRef(false);
  const [beat, setBeat] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const beatsRef = useRef<HTMLOListElement>(null);
  const allId = `all-${role}`;

  // on phones the steps are a sideways row of pills; keep the current one in view
  useEffect(() => {
    const list = beatsRef.current;
    const item = list?.children[beat] as HTMLElement | undefined;
    if (!list || !item || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: item.offsetLeft - parseFloat(getComputedStyle(list).paddingLeft), behavior: 'smooth' });
  }, [beat]);

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
          <ol className="beats" ref={beatsRef}>
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
          <p className="beat-now">{walk.beats[beat].body}</p>
          <div className="walk-actions">
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
            {role === 'coaches' && (
              <a className="expand bc-link" href="#build-card" onClick={onBuildCardLink}>
                <span>Build your card</span>
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path
                    d="M3 7h8M8 4l3 3-3 3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            )}
          </div>
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
      <div className="dg-cta">
        <p>If you see an open seat, call next.</p>
        <a className="btn" href={WAITLIST_URL} target="_blank" rel="noopener noreferrer">
          Call next
        </a>
      </div>
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
  const [quiet, setQuiet] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrim, setScrim] = useState<'hidden' | 'shown' | 'on'>('hidden');
  const [role, setRole] = useState<Role>(() => (window.location.hash === '#coaches' ? 'coaches' : 'players'));
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
      history.pushState(null, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
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
        <div className="dfoot">
          <div className="dsocial">
            <span className="eyebrow dk">Follow</span>
            <ul>
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`ISO on ${s.label}`}
                    tabIndex={menuOpen ? 0 : -1}
                  >
                    <SocialIcon label={s.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <a className="dcta" href={WAITLIST_URL} target="_blank" rel="noopener noreferrer" tabIndex={menuOpen ? 0 : -1}>
            Join the waitlist
          </a>
        </div>
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
            <p className="sp-ln sp-say" data-at=".034">A talented engineering student without access.</p>
            <p className="sp-ln sp-say dim" data-at=".047">
              Competing against those with access and connections.
            </p>
            <p className="sp-ln sp-say dim" data-at=".06">No network to lean on.</p>
            <p className="sp-ln sp-say dim" data-at=".073">Your DMs go unanswered.</p>
            <p className="sp-ln sp-say dim" data-at=".086">
              You&rsquo;re in search of guidance you didn&rsquo;t know you needed.
            </p>
            <h2 className="sp-ln sp-turn" data-at=".102">
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
            <p className="sp-eyebrow">Launching in NYC and Denver</p>
            <h1>
              Your city&rsquo;s best. ISO puts them <em>on the map.</em>
            </h1>
            <p className="sp-sub">Connecting engineering students with working engineers for small-group coffee chats in your city.</p>
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
            You. A talented engineering student without access, competing against those with access and connections. No network to lean on. Your DMs go unanswered. You&rsquo;re in search of guidance you didn&rsquo;t know you needed. Your problem isn&rsquo;t ability, it&rsquo;s proximity.
            Six degrees of separation: seven people, A to G, in a chain of introductions. ISO skips the chain and goes
            straight from A to G. The person you need splits in two and lands on New York and Denver on the globe, then the two come back together and land on your location in the ISO app map.
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
                <p className="lede how-promise">
                  No cold messages. No favors to ask. Just a coach opening their seats for you.
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
              <ReelPlayer />
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
                    Players get earlier access <span>to ISO drops and Invitationals as they rank</span>
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
                    Active coaches get last call{' '}
                    <span>on any seat still open 6 hours before an ISO, free. Players always get first call</span>
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
            <div className="eyebrow">Starting with Builders</div>
            <h2>Find your path. Meet who&rsquo;s already on it.</h2>
            <p className="lede">ISO starts with one pathway, engineering and tech, in New York and Denver. More pathways open as each city fills up.</p>
            <PathwayFocus />
          </div>
        </section>

        <BuildYourCard />

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
