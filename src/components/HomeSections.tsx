import { useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react';
import '../styles/home-sections.css';

const WAITLIST_URL = 'https://tally.so/r/Y5Ee75';
const INSTAGRAM_URL = 'https://www.instagram.com/isoapp.co/';
const DISCORD_URL = 'https://discord.gg/X3hvk4vZd';

type ViewKey = 'players' | 'coaches';

interface Flow {
  video: string;
  poster: string;
  label: string;
  note: string;
  beats: { t: number; title: string; body: string }[];
  shots: { img: string; alt: string; title: string; body: string }[];
}

const FLOWS: Record<ViewKey, Flow> = {
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
      { img: 's3-P1-Map.webp', alt: 'Map with coach pins around Denver', title: 'Find a coach', body: 'The map shows coaches on your path near you.' },
      { img: 's3-P2-MapSheet.webp', alt: 'Coach preview sheet on the map', title: 'Preview the ISO', body: 'Tap a pin for the time, area and open seats.' },
      { img: 's3-P2C-Front.webp', alt: 'Front of a coach card', title: 'Their coach card', body: 'Role, company and key boxes at a glance.' },
      { img: 's3-P2C-Back.webp', alt: 'Back of a coach card with their path', title: 'Flip for their path', body: "Past roles and the topics they're open to." },
      { img: 's3-P3-ISODetail.webp', alt: 'ISO details with seats and an I got next button', title: 'Say "I got next"', body: 'Claim one of 2–4 seats. Players on that path get first call.' },
      { img: 's3-P-Verify.webp', alt: 'One-time 18+ ID check', title: "Verify you're 18+", body: 'A one-time ID check before your first seat.' },
      { img: 's3-P-Commit.webp', alt: 'Commitment sheet before claiming a seat', title: 'Commit to it', body: "Cancel 12+ hours before if you can't make it. Coaches give their time." },
      { img: 's3-P4-Confirmed.webp', alt: 'Seat confirmed with a check-in code', title: 'Seat confirmed', body: 'The exact spot unlocks 24 hours before, only for confirmed players.' },
      { img: 's3-P5-CheckIn.webp', alt: 'Check-in screen showing a four-digit code', title: 'Show your code', body: 'Give the coach your four digits when you pull up.' },
      { img: 's3-P5G-GuidedQuestions.webp', alt: 'Guided questions during an ISO', title: 'Ask what you came to ask', body: 'Guided questions so everyone at the table gets their answer.' },
      { img: 's3-P-Rate.webp', alt: 'Rating the ISO with stars', title: 'Rate the ISO', body: 'Stars and what stood out. Your name stays private.' },
      { img: 's3-P-Rank.webp', alt: 'Rank up to Junior Varsity', title: 'Level up', body: "Five ISOs and you're off the bench." },
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
      { img: 's3-K13-CoachMap.webp', alt: 'Coach map of partner spots', title: 'Pick a spot', body: "Partner spots near you, with when they're quiet." },
      { img: 's3-K2-DropSpot.webp', alt: 'Drop a pin screen with time and seats', title: 'Set time and seats', body: 'Day, time, 2–4 seats and your topics on one screen.' },
      { img: 's3-K6-DropConfirm.webp', alt: 'Review your pin screen', title: 'Review your pin', body: "Check the spot, time and who it's open to." },
      { img: 's3-K6-Live.webp', alt: 'Pin dropped confirmation', title: 'Your ISO is live', body: 'Players on your path and your followers get a ping.' },
      { img: 's3-K1-CoachISOs.webp', alt: 'My ISOs with upcoming ISOs and claimed seats', title: 'Watch seats fill', body: 'See who claimed a seat, run late or open the Huddle.' },
      { img: 's3-K8-CoachCheckIn.webp', alt: 'Checking players in with their codes', title: 'Check players in', body: 'Each player shows a code when they pull up.' },
      { img: 's3-K8G-ISOGuide.webp', alt: 'ISO Guide with a timed plan', title: 'Run it with the ISO Guide', body: 'A timed plan with what to say for each part.' },
      { img: 's3-K-Who.webp', alt: 'ISO Guide showing who is here and follow-ups', title: "Know who's there", body: 'Where each player is on their path, prompts to steer the room and private follow-ups.' },
      { img: 's3-K-Finish.webp', alt: 'ISO Guide with the Finish ISO prompt', title: 'Wrap up', body: "Tap Finish ISO when you're done. Players get asked to rate it." },
      { img: 's3-K-Review.webp', alt: "How was today's ISO feedback sheet", title: 'Review the ISO', body: 'Great, okay or rough, plus anything that would make coaching better.' },
      { img: 's3-K11-CoachRankUp.webp', alt: 'Coach rank up to Platinum', title: 'Rank up', body: 'Every ISO grows your Overall and unlocks more.' },
      { img: 's3-K-Profile.webp', alt: 'Coach profile with followers and streak', title: 'Build your name', body: 'Followers, ISOs hosted and your streak, all on your profile.' },
    ],
  },
};

const STATS = [
  { value: '5.0', label: 'average rating out of 5 stars' },
  { value: '9.75', label: 'out of 10 on "would you recommend ISO to a friend"' },
  { value: '4 / 4', label: 'said "Yes, for sure" to coming back' },
  { value: '4 / 4', label: "would pull up with a coach they've never met" },
];

const REVIEWS = [
  {
    quote:
      'Talking to someone at a higher level who made it in engineering, which sometimes feels impossible, gave me a lot of insight and motivation.',
    name: 'Ryan Zaghab',
  },
  { quote: 'Networking made better. Real people you can actually speak to about your real questions.', name: 'Hanad Ali' },
  {
    quote:
      "If you're looking for a sense of guidance or community in a difficult job market or new space, ISO is the way to do that.",
    name: 'Abeal Gebreziabher',
  },
  { quote: 'Great, honest, and professional advice.', name: 'Awab' },
  { quote: 'Speaking to someone who was in your shoes before.', name: 'Hanad Ali' },
  { quote: "Made me feel like I'm capable of doing the things everyone else is.", name: 'Ryan Zaghab' },
];

const PATHS = [
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
  {
    q: 'Is ISO free?',
    a: "Yes, there's a free tier for players, so everyone has a way in. It comes with some limits, and coaches host for free. ISO is built for access, so the core experience is meant to stay that way.",
  },
  {
    q: 'Why not just message people on LinkedIn?',
    a: "Cold messages to strangers mostly go unanswered, and the person who replies usually lives in another city. On ISO, the coach has already raised their hand to meet, they're on your path, and they're down the street. You show up and ask in person.",
  },
  {
    q: 'Why would a successful professional host for free?',
    a: 'Most people who made it remember someone who helped them. ISO makes giving back easy: coaches pick a spot they already go to, on their own schedule, and build a coach card and reputation in their city along the way.',
  },
  {
    q: "Wait, isn't an ISO one-on-one?",
    a: "In basketball, yes. On ISO it's always a small group: one coach and 2–4 players. It's safer, it's lower pressure, and you learn from everyone else's questions too.",
  },
  {
    q: 'Is the app out?',
    a: "Not yet. We're running ISOs by hand in Denver first to get the experience right. Join the waitlist to hear when ISOs open near you.",
  },
  {
    q: 'Where is ISO available?',
    a: 'Denver, starting with the Builder pathway (engineering and tech). Join the waitlist and tell us your city and path so we know where to go next.',
  },
  {
    q: 'Can I become a coach?',
    a: "If you're doing big things in your field and want to pay it forward, DM us at @isoapp.co. We're looking for founding coaches.",
  },
];

function prefersReducedMotion() {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function safePlay(video: HTMLVideoElement | null) {
  video?.play()?.catch(() => {});
}

function ReviewCard({ quote, name, hidden }: { quote: string; name: string; hidden?: boolean }) {
  return (
    <figure className="review" aria-hidden={hidden || undefined}>
      <div className="stars" aria-label="5 out of 5 stars">
        ★★★★★
      </div>
      <blockquote>"{quote}"</blockquote>
      <figcaption className="who">
        <div className="av">{name[0]}</div>
        <div>
          <b>{name}</b>
          <small>Builder · Player</small>
        </div>
      </figcaption>
    </figure>
  );
}

function WalkView({
  viewKey,
  hidden,
  videoRef,
  reducedMotion,
}: {
  viewKey: ViewKey;
  hidden: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  reducedMotion: boolean;
}) {
  const flow = FLOWS[viewKey];
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const allId = `all-${viewKey}`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const mark = () => {
      let index = 0;
      flow.beats.forEach((beat, i) => {
        if (video.currentTime >= beat.t) index = i;
      });
      setActive(index);
    };
    video.addEventListener('timeupdate', mark);
    return () => video.removeEventListener('timeupdate', mark);
  }, [flow, videoRef]);

  const seek = (index: number) => {
    const video = videoRef.current;
    if (!video) return;
    try {
      video.currentTime = flow.beats[index].t + 0.05;
    } catch {
      // Seeking can throw before metadata has loaded.
    }
    setActive(index);
    if (!reducedMotion) safePlay(video);
  };

  return (
    <div className="view" id={`view-${viewKey}`} hidden={hidden}>
      <div className="walk">
        <div className="phone">
          <video
            ref={videoRef}
            src={`/home/${flow.video}`}
            poster={`/home/${flow.poster}`}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={flow.label}
          />
        </div>
        <div className="walk-side">
          <ol className="beats">
            {flow.beats.map((beat, i) => (
              <li key={beat.title} className={i === active ? 'on' : undefined}>
                <button type="button" onClick={() => seek(i)}>
                  <span className="k">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <b>{beat.title}</b>
                    <em>{beat.body}</em>
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
            onClick={() => setExpanded((open) => !open)}
          >
            <span>{expanded ? 'Hide screens' : 'See every screen'}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M3 5l4 4 4-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="all" id={allId} hidden={!expanded}>
        <p className="all-note">{flow.note}</p>
        <div className="shots">
          {flow.shots.map((shot, i) => (
            <figure key={shot.img} className="shot">
              <div className="phone">
                <img src={`/home/${shot.img}`} alt={shot.alt} loading="lazy" />
              </div>
              <figcaption>
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <b>{shot.title}</b>
                {shot.body}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  const reducedMotion = useMemo(prefersReducedMotion, []);
  const [view, setView] = useState<ViewKey>(() =>
    typeof window !== 'undefined' && window.location.hash === '#coaches' ? 'coaches' : 'players'
  );
  const playersRef = useRef<HTMLVideoElement>(null);
  const coachesRef = useRef<HTMLVideoElement>(null);
  const viewRef = useRef(view);
  viewRef.current = view;

  const videoFor = (key: ViewKey) => (key === 'players' ? playersRef.current : coachesRef.current);

  useEffect(() => {
    if (reducedMotion || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (video !== videoFor(viewRef.current)) return;
          if (entry.isIntersecting) safePlay(video);
          else video.pause();
        });
      },
      { threshold: 0.4 }
    );
    [playersRef.current, coachesRef.current].forEach((video) => video && observer.observe(video));
    return () => observer.disconnect();
  }, [reducedMotion]);

  const switchTo = (next: ViewKey) => {
    (['players', 'coaches'] as ViewKey[]).forEach((key) => {
      if (key !== next) videoFor(key)?.pause();
    });
    const video = videoFor(next);
    if (video) {
      try {
        video.currentTime = 0;
      } catch {
        // Seeking can throw before metadata has loaded.
      }
    }
    setView(next);
  };

  return (
    <section id="how">
      <div className="wrap">
        <div className="eyebrow">How an ISO works</div>
        <h2>Their routine. Your seat.</h2>
        <p className="lede">
          In basketball, an ISO is one-on-one against someone built to challenge you. Here it's one coach and 2–4 players
          on the same path, at a spot the coach already goes to.
        </p>
        <div className="seg" role="group" aria-label="Show how it works for">
          <button type="button" aria-pressed={view === 'players'} onClick={() => switchTo('players')}>
            I'm a player
          </button>
          <button type="button" aria-pressed={view === 'coaches'} onClick={() => switchTo('coaches')}>
            I'm a coach
          </button>
        </div>
        <WalkView viewKey="players" hidden={view !== 'players'} videoRef={playersRef} reducedMotion={reducedMotion} />
        <WalkView viewKey="coaches" hidden={view !== 'coaches'} videoRef={coachesRef} reducedMotion={reducedMotion} />
      </div>
    </section>
  );
}

function formatTime(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

function Reel() {
  const reducedMotion = useMemo(prefersReducedMotion, []);
  const reelRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const reel = reelRef.current;
    if (!reel) return;
    const sync = () => {
      setPlaying(!reel.paused);
      setTime(reel.currentTime);
      if (Number.isFinite(reel.duration)) setDuration(reel.duration);
    };
    const events = ['play', 'pause', 'timeupdate', 'loadedmetadata', 'seeked'] as const;
    events.forEach((name) => reel.addEventListener(name, sync));
    sync();
    return () => events.forEach((name) => reel.removeEventListener(name, sync));
  }, []);

  const togglePlay = () => {
    const reel = reelRef.current;
    if (!reel) return;
    if (reel.paused) safePlay(reel);
    else reel.pause();
  };

  const seek = (value: number) => {
    const reel = reelRef.current;
    if (!reel) return;
    reel.currentTime = value;
    setTime(value);
  };

  const toggleSound = () => {
    const reel = reelRef.current;
    if (!reel) return;
    const next = !soundOn;
    reel.muted = !next;
    setSoundOn(next);
    if (next) safePlay(reel);
  };

  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <div className="g g-reel">
      <video
        ref={reelRef}
        src="/home/reel.mp4"
        poster="/home/reel-poster.jpg"
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        onClick={togglePlay}
        aria-label="ISO promo reel: a Builder coach drops a pin, the first ISO at Coffee Story, and ranking up"
      />
      <span className="g-tag g-tag-top">The reel</span>
      <div className="reel-controls">
        <button
          type="button"
          className="reel-btn"
          aria-label={playing ? 'Pause the reel' : 'Play the reel'}
          onClick={togglePlay}
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
          onChange={(event) => seek(Number(event.target.value))}
          aria-label="Scrub through the reel"
          aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
          style={{ '--p': `${progress}%` } as CSSProperties}
        />
        <span className="reel-time">{formatTime(time)}</span>
        <button
          type="button"
          className="reel-btn"
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
    </div>
  );
}

export function HomeSections() {
  return (
    <div className="home-v2">
      <section className="intro" id="product">
        <div className="wrap">
          <div>
            <div className="eyebrow">ISO · In Search Of</div>
            <h2>Your city's best, on the map.</h2>
            <div className="ctas">
              <a className="btn ghost" href="#first-iso">
                See the first ISO
              </a>
            </div>
            <div className="intro-meta">
              <span>
                <i className="dot" />
                Launching in Denver
              </span>
              <span>Free for players</span>
              <span>Small groups, public spots</span>
            </div>
          </div>
          <div className="stage" aria-hidden="true">
            <div className="phone">
              <img src="/home/s3-P2-MapSheet.webp" alt="" />
              <div className="pin">
                <i />
                <i />
              </div>
            </div>
            <img className="card" src="/home/card-renat.webp" alt="" />
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="band" id="first-iso">
        <div className="wrap">
          <div className="proof-head">
            <div>
              <div className="eyebrow">The first ISO · Aurora, CO · Nov 1</div>
              <h2>Here's how the first one went.</h2>
              <p className="lede">
                We ran the first ISO by hand at Coffee Story in Aurora: one Builder coach, a table of college students, and
                questions about internships, networking and belonging. Then we asked how it went.
              </p>
            </div>
            <a className="btn ghost" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              Watch the recap on Instagram
            </a>
          </div>
          <div className="stats">
            {STATS.map((stat) => (
              <div key={stat.label} className="stat">
                <b>{stat.value}</b>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <p className="footnote">From the feedback form after ISO #1. All 4 players responded.</p>
        </div>

        <div className="wrap">
          <div className="gallery">
            <Reel />
            <div className="g">
              <img
                src="/home/p-talk.webp"
                alt="The coach talking with players around a table at Coffee Story"
                style={{ objectPosition: '55% 55%' }}
              />
              <span className="g-tag">Coffee Story · Aurora</span>
            </div>
            <div className="g">
              <img src="/home/p-selfie.webp" alt="Group photo from the first ISO" style={{ objectPosition: '50% 40%' }} />
            </div>
            <div className="g">
              <video
                src="/home/c-qr.mp4"
                poster="/home/c-qr-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                aria-label="Players scanning the feedback QR code"
              />
            </div>
            <div className="g">
              <video
                src="/home/c-table.mp4"
                poster="/home/c-table-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                aria-label="Conversation at the table"
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
            {REVIEWS.map((review, i) => (
              <ReviewCard key={`a${i}`} {...review} />
            ))}
            {REVIEWS.map((review, i) => (
              <ReviewCard key={`b${i}`} {...review} hidden />
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap split">
          <div>
            <div className="eyebrow">Rank up</div>
            <h2>Every ISO, you level up.</h2>
            <p className="lede">
              Players climb from Freshman to All-Star. Coaches grow their Overall and build a card that shows the impact
              they've had in their city.
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
                  Coaches build their name <span>with every pin, and followers get notified when they drop one</span>
                </div>
              </li>
            </ul>
            <span className="soon">Rewards coming soon</span>
          </div>
          <div className="duo">
            <div className="phone">
              <img src="/home/s3-P8-RankPlayer.webp" alt="Player rank ladder from Freshman to All-Star, currently Junior Varsity" />
            </div>
            <div className="phone">
              <img src="/home/s3-K12-CoachProfile.webp" alt="Coach profile with card, followers, streak and Overall rating" />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="eyebrow">Six pathways</div>
          <h2>Find your path. Meet who's already on it.</h2>
          <p className="lede">We're starting with Builders in Denver. As each city fills up, more pathways open.</p>
          <div className="paths">
            {PATHS.map((path) => (
              <div key={path.name} className={`path${path.live ? ' live' : ''}`}>
                <span className="tag">{path.live ? 'Going live soon in Denver' : 'Coming'}</span>
                <h3>{path.name}</h3>
                <p>{path.field}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="eyebrow">Safe by design</div>
          <h2>Public spots. Never one-on-one.</h2>
          <div className="safe">
            {SAFETY.map((item) => (
              <div key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="questions">
        <div className="wrap faq">
          <div>
            <div className="eyebrow">FAQ</div>
            <h2>Questions people ask us.</h2>
            <p className="lede">Got one we didn't answer? DM us on Instagram at @isoapp.co.</p>
          </div>
          <div>
            {FAQS.map((item, i) => (
              <details key={item.q} open={i === 0}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

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
    </div>
  );
}
