import * as React from 'react';
import { Moon, Dumbbell, Globe, Activity, Rocket, Settings, ArrowRight, type LucideIcon } from 'lucide-react';
import { IsoNav } from './IsoNav';
import { SplashFooter } from './SplashFooter';
import '../styles/about-v2.css';

type Page =
  | 'home'
  | 'pathways'
  | 'about'
  | 'community'
  | 'store'
  | 'coach-portal'
  | 'player-portal'
  | 'call-iso';

interface AboutProps {
  onNavigate?: (page: Page) => void;
  onWaitlistClick?: () => void;
  onBack?: () => void;
  onNavigateToAbout?: () => void;
  onNavigateToFAQ?: () => void;
  onNavigateToAssist?: () => void;
}

const PROBLEMS = [
  {
    num: '01',
    title: (
      <>
        Talent is everywhere.
        <br />
        Access is not.
      </>
    ),
    desc: "The most capable people often don't live in major hubs. They're hidden behind geography, networks, or circumstance.",
  },
  {
    num: '02',
    title: 'Development has become performative.',
    desc: "Growth became something you post, not something you feel. It's been reduced to routines, slogans, and content for show.",
  },
  {
    num: '03',
    title: "Local talent isn't celebrated.",
    desc: 'We celebrate celebrities for status, not impact. Meanwhile, the people doing real work in their communities go unseen.',
  },
] as const;

const MISSION =
  'ISO is built to inspire ambition, elevate overlooked talent, and rebuild community pathways to success.';

const BELIEFS = [
  'Iron sharpens iron',
  'Growth requires resistance',
  'Community accelerates mastery',
  'Development deserves to be rewarded',
] as const;

const PATHWAY_ARCHETYPES: {
  name: string;
  tagline: string;
  accent: string;
  icon: LucideIcon;
}[] = [
  { name: 'The Seeker', tagline: 'Center faith before function.', accent: '#10b981', icon: Moon },
  { name: 'The Warrior', tagline: 'Train the body. Strengthen the mind.', accent: '#ef4444', icon: Dumbbell },
  { name: 'The Reformer', tagline: 'Lead globally. Move with purpose.', accent: '#6366f1', icon: Globe },
  { name: 'The Healer', tagline: 'Serve through science and compassion.', accent: '#3b82f6', icon: Activity },
  { name: 'The Founder', tagline: 'Build something that outlasts you.', accent: '#f97316', icon: Rocket },
  { name: 'The Builder', tagline: 'Design, build, and solve for tomorrow.', accent: '#a855f7', icon: Settings },
];

const AUDIENCES = [
  {
    key: 'players',
    tab: 'Players',
    label: 'For Players',
    title: 'Built by courage',
    body: 'Brave enough to pull up.',
    highlights: ['Meet coaches on your path', 'Rank up to All-Star', 'Unlock drops and Invitationals'],
  },
  {
    key: 'coaches',
    tab: 'Coaches',
    label: 'For Coaches',
    title: 'Sustained by humility',
    body: 'Been there. Giving back.',
    highlights: ['ID-verified, real experience', 'Climb Bronze to Platinum', 'Coach-only ISO drops'],
  },
  {
    key: 'partners',
    tab: 'Partners',
    label: 'For Partner Businesses',
    title: 'Powered by community',
    body: 'Where ISOs happen.',
    highlights: ['New foot traffic', 'Featured on the ISO map', 'Home base for ambition'],
  },
] as const;

const IMPACTS = [
  ['When access improves,', 'communities strengthen.'],
  ['When development becomes engaging,', 'people commit.'],
  ['When people grow together,', 'progress compounds.'],
] as const;

const VALUES = ['Courage', 'Humility', 'Service', 'Integrity', 'Community', 'Honesty', 'Sincerity'] as const;

const TEAM = [
  { num: '01', name: 'Anis Benyoucef', role: 'Founder' },
  { num: '02', name: 'Yahya Hamu', role: 'Technical Lead' },
  { num: '03', name: 'Idris Elmi', role: 'Technical Lead' },
] as const;

/** Adds `is-in` to every [data-reveal] element once it scrolls into view. */
function useReveal(rootRef: React.RefObject<HTMLElement | null>) {
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootRef]);
}

/** Mission statement whose words light up as the section scrolls past. No scroll-jacking. */
function MissionScrub() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const wordRefs = React.useRef<HTMLSpanElement[]>([]);
  const words = React.useMemo(() => MISSION.split(' '), []);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      wordRefs.current.forEach((w) => w?.classList.add('is-lit'));
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = rect.height - vh;
      const raw = travel > 0 ? -rect.top / travel : (vh - rect.top) / (vh + rect.height);
      const progress = Math.max(0, Math.min(1, raw * 1.15));
      const lit = Math.round(progress * words.length);
      wordRefs.current.forEach((w, i) => w?.classList.toggle('is-lit', i < lit));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [words.length]);

  return (
    <section ref={sectionRef} className="ab-mission" aria-label="Mission">
      <div className="ab-mission-sticky">
        <div className="ab-wrap">
          <div className="ab-eyebrow">
            <span className="ab-eyebrow-num">02</span> Mission
          </div>
          <h2 className="ab-mission-text">
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                ref={(el) => {
                  if (el) wordRefs.current[i] = el;
                }}
                className="ab-mission-word"
              >
                {word}{' '}
              </span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}

/** Players / Coaches / Partners switcher with proper tab semantics. */
function AudienceTabs() {
  const [active, setActive] = React.useState(0);
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const current = AUDIENCES[active];

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (active + (e.key === 'ArrowRight' ? 1 : AUDIENCES.length - 1)) % AUDIENCES.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="ab-aud" data-reveal>
      <div className="ab-aud-head">
        <div className="ab-kicker">Who It's For</div>
        <p className="ab-aud-intro">Three sides. One city. Everyone's In Search Of something.</p>
      </div>

      <div className="ab-aud-tabs" role="tablist" aria-label="Who it's for" onKeyDown={onKeyDown}>
        <span
          className="ab-aud-thumb"
          aria-hidden="true"
          style={{ transform: `translateX(${active * 100}%)` }}
        />
        {AUDIENCES.map((a, i) => (
          <button
            key={a.key}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`ab-tab-${a.key}`}
            aria-selected={i === active}
            aria-controls={`ab-panel-${a.key}`}
            tabIndex={i === active ? 0 : -1}
            className={`ab-aud-tab${i === active ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
          >
            {a.tab}
          </button>
        ))}
      </div>

      <div
        key={current.key}
        className="ab-aud-panel"
        role="tabpanel"
        id={`ab-panel-${current.key}`}
        aria-labelledby={`ab-tab-${current.key}`}
      >
        <div className="ab-aud-panel-main">
          <div className="ab-aud-label">{current.label}</div>
          <div className="ab-aud-title">{current.title}</div>
          <p className="ab-aud-body">{current.body}</p>
        </div>
        <ul className="ab-aud-list">
          {current.highlights.map((item, i) => (
            <li key={item} style={{ '--i': i } as React.CSSProperties}>
              <span className="ab-aud-check" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <p className="ab-aud-culture">
        Rewarding player progress, celebrating coaches like superstars, and putting local spots on the map.{' '}
        <strong>That's the culture.</strong>
      </p>
    </div>
  );
}

/** Thin half-court lines that draw themselves in behind the hero. */
function CourtLines() {
  return (
    <svg className="ab-court" viewBox="0 0 600 560" fill="none" aria-hidden="true">
      <path className="ab-court-line" d="M20 540 H580" />
      <path className="ab-court-line" d="M200 540 V300 H400 V540" />
      <path className="ab-court-line" d="M200 300 A100 100 0 0 1 400 300" />
      <path className="ab-court-line ab-court-dash" d="M200 300 A100 100 0 0 0 400 300" />
      <path className="ab-court-line" d="M60 540 V430 A240 240 0 0 1 540 430 V540" />
      <path className="ab-court-line" d="M270 520 H330" />
      <circle className="ab-court-line" cx="300" cy="505" r="15" />
    </svg>
  );
}

export function About({ onNavigate, onWaitlistClick, onNavigateToAbout, onNavigateToFAQ }: AboutProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  const handlePrimaryCta = () => {
    if (onWaitlistClick) {
      onWaitlistClick();
      return;
    }
    onNavigate?.('pathways');
  };

  return (
    <div className="ab" ref={rootRef}>
      <IsoNav />

      <main>
        {/* Hero */}
        <section className="ab-hero">
          <div className="ab-hero-glow" aria-hidden="true" />
          <CourtLines />
          <div className="ab-wrap ab-hero-inner">
            <div className="ab-hero-tag">
              <img src="/ISO OFFICIAL.png" alt="ISO" className="ab-hero-logo" />
              <span>About ISO</span>
            </div>
            <h1 className="ab-hero-title">
              <span className="ab-hero-line" style={{ '--d': 0 } as React.CSSProperties}>It's not you</span>
              <span className="ab-hero-line" style={{ '--d': 1 } as React.CSSProperties}>
                <span className="ab-hero-vs">vs</span> you
              </span>
              <span className="ab-hero-line" style={{ '--d': 2 } as React.CSSProperties}>anymore.</span>
            </h1>
            <p className="ab-hero-sub">
              Fear makes role players. Courage makes stars. It's time to <strong>Call Next</strong>.
            </p>
            <a href="#ab-challenge" className="ab-scroll-cue">
              <span className="ab-scroll-cue-bar" aria-hidden="true" />
              Scroll
            </a>
          </div>
        </section>

        {/* The Problem */}
        <section className="ab-section" id="ab-challenge">
          <div className="ab-wrap ab-split">
            <div className="ab-split-side">
              <div className="ab-sticky" data-reveal>
                <div className="ab-eyebrow">
                  <span className="ab-eyebrow-num">01</span> The Challenge
                </div>
                <h2 className="ab-h2">Three Problems. One Mission.</h2>
              </div>
            </div>
            <ol className="ab-problems">
              {PROBLEMS.map((problem) => (
                <li key={problem.num} className="ab-problem" data-reveal>
                  <div className="ab-problem-num" aria-hidden="true">
                    {problem.num}
                  </div>
                  <div className="ab-problem-body">
                    <div className="ab-problem-label">Problem {problem.num}</div>
                    <h3 className="ab-problem-title">{problem.title}</h3>
                    <p className="ab-problem-desc">{problem.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Mission */}
        <MissionScrub />

        <section className="ab-quote-section">
          <div className="ab-wrap">
            <blockquote className="ab-quote" data-reveal>
              <span className="ab-quote-mark" aria-hidden="true">
                “
              </span>
              Access used to come through people who let you get close enough to learn.{' '}
              <strong>ISO is building that back.</strong>
            </blockquote>
          </div>
        </section>

        {/* What ISO Means */}
        <section className="ab-section ab-define-section">
          <div className="ab-wrap">
            <div className="ab-eyebrow" data-reveal>
              <span className="ab-eyebrow-num">03</span> What ISO Means
            </div>

            <div className="ab-entry" data-reveal>
              <div className="ab-entry-word">ISO</div>
              <div className="ab-entry-meta">
                <span className="ab-entry-pron">(eye-so)</span>
                <span className="ab-entry-pos">— verb, basketball — isolation play</span>
              </div>
            </div>

            <div className="ab-matchup" data-reveal>
              <div className="ab-matchup-side ab-matchup-away">
                <div className="ab-matchup-label">What people assume</div>
                <div className="ab-matchup-text">
                  <span className="ab-strike">You vs you. Alone in the gym.</span>
                </div>
              </div>
              <div className="ab-matchup-vs" aria-hidden="true">
                <span>VS</span>
              </div>
              <div className="ab-matchup-side ab-matchup-home">
                <div className="ab-matchup-label">What an ISO actually is</div>
                <div className="ab-matchup-text">You vs a defender built to challenge you.</div>
              </div>
            </div>

            <div className="ab-define-foot">
              <p className="ab-define-close" data-reveal>
                In basketball, an ISO isn’t isolation. It’s a matchup against someone who sharpens you in real time.{' '}
                <strong>We took that definition and applied it to real-world pathways.</strong> Every coach on ISO is
                that defender. And because nobody grows alone, every ISO is a small group: one coach, two to four
                players, all getting better in proximity to someone who won’t let them stay the same.
              </p>
              <ul className="ab-beliefs">
                {BELIEFS.map((belief, i) => (
                  <li key={belief} className="ab-belief" data-reveal style={{ '--i': i } as React.CSSProperties}>
                    <span className="ab-belief-num">{String(i + 1).padStart(2, '0')}</span>
                    {belief}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Six Pathways */}
        <section className="ab-section">
          <div className="ab-wrap">
            <div className="ab-head-row" data-reveal>
              <div>
                <div className="ab-eyebrow">
                  <span className="ab-eyebrow-num">04</span> The Pathways
                </div>
                <h2 className="ab-h2">Six paths. One mission.</h2>
              </div>
              <p className="ab-lede">Six archetypes for players and coaches — choose where you want to grow or lead.</p>
            </div>

            <ul className="ab-paths">
              {PATHWAY_ARCHETYPES.map((pathway, index) => {
                const Icon = pathway.icon;
                return (
                  <li
                    key={pathway.name}
                    className="ab-path"
                    data-reveal
                    tabIndex={0}
                    style={{ '--accent': pathway.accent, '--i': index } as React.CSSProperties}
                  >
                    <span className="ab-path-num">{String(index + 1).padStart(2, '0')}</span>
                    <span className="ab-path-icon" aria-hidden="true">
                      <Icon strokeWidth={1.75} />
                    </span>
                    <span className="ab-path-name">{pathway.name}</span>
                    <span className="ab-path-tag">{pathway.tagline}</span>
                    <ArrowRight className="ab-path-arrow" aria-hidden="true" strokeWidth={1.75} />
                  </li>
                );
              })}
            </ul>

            <AudienceTabs />
          </div>
        </section>

        {/* What We Stand On */}
        <section className="ab-section ab-stand">
          <div className="ab-wrap">
            <div className="ab-head-row" data-reveal>
              <div>
                <div className="ab-eyebrow">
                  <span className="ab-eyebrow-num">05</span> What We Stand On
                </div>
                <h2 className="ab-h2">Faith-driven development and leadership</h2>
              </div>
              <p className="ab-lede">
                ISO is faith-driven — not in what it asks of you, but in how it was built. ISO is open to everyone
                willing to grow with discipline, humility, and respect for the values we stand on.
              </p>
            </div>
          </div>
          <div className="ab-marquee" aria-label={`Our values: ${VALUES.join(', ')}`}>
            {[0, 1].map((copy) => (
              <div key={copy} className="ab-marquee-track" aria-hidden={copy === 1 ? 'true' : undefined}>
                {VALUES.map((value) => (
                  <span key={value} className="ab-marquee-item">
                    {value}
                    <span className="ab-marquee-dot" aria-hidden="true" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Why ISO Matters */}
        <section className="ab-section">
          <div className="ab-wrap">
            <div className="ab-eyebrow" data-reveal>
              <span className="ab-eyebrow-num">06</span> The Impact
            </div>
            <h2 className="ab-h2" data-reveal>
              Why ISO Matters
            </h2>
            <ol className="ab-impacts">
              {IMPACTS.map(([cause, effect], i) => (
                <li key={cause} className="ab-impact" data-reveal style={{ '--i': i } as React.CSSProperties}>
                  <span className="ab-impact-cause">{cause}</span> <span className="ab-impact-effect">{effect}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* The Team */}
        <section className="ab-section">
          <div className="ab-wrap ab-split">
            <div className="ab-split-side" data-reveal>
              <div className="ab-eyebrow">
                <span className="ab-eyebrow-num">07</span> Behind ISO
              </div>
              <h2 className="ab-h2">The Team</h2>
            </div>
            <div className="ab-roster" data-reveal>
              <div className="ab-roster-head" aria-hidden="true">
                <span>No.</span>
                <span>Name</span>
                <span>Position</span>
              </div>
              {TEAM.map((member) => (
                <div key={member.name} className="ab-roster-row">
                  <span className="ab-roster-num">{member.num}</span>
                  <span className="ab-roster-name">{member.name}</span>
                  <span className="ab-roster-role">{member.role}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Close */}
        <section className="ab-close">
          <div className="ab-wrap ab-close-inner" data-reveal>
            <h2 className="ab-close-title">
              Built by Courage.
              <br />
              <span>Sustained by Humility.</span>
            </h2>
            <div className="ab-close-cta">
              <button type="button" className="ab-btn" onClick={handlePrimaryCta}>
                {onWaitlistClick ? 'Join the Waitlist' : 'Call an ISO'}
                <ArrowRight aria-hidden="true" strokeWidth={2} />
              </button>
              <div className="ab-close-sub">{onWaitlistClick ? 'Early Access' : 'Players'}</div>
            </div>
          </div>
        </section>
      </main>

      <SplashFooter
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToFAQ={onNavigateToFAQ}
        onWaitlistClick={onWaitlistClick}
      />
    </div>
  );
}
