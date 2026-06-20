import * as React from 'react';
import { Moon, Dumbbell, Globe, Activity, Rocket, Settings, type LucideIcon } from 'lucide-react';
import '../styles/about.css';

type Page =
  | 'home'
  | 'pathways'
  | 'about'
  | 'community'
  | 'store'
  | 'coach-portal'
  | 'player-portal'
  | 'call-iso'
  | 'for-coaches'
  | 'join';

interface AboutProps {
  onNavigate?: (page: Page) => void;
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

const IMPACTS = [
  'When access improves, communities strengthen.',
  'When development becomes engaging, people commit.',
  'When people grow together, progress compounds.',
] as const;

const VALUES = ['Courage', 'Humility', 'Service', 'Integrity', 'Community', 'Honesty', 'Sincerity'] as const;

const TEAM = [
  { initials: 'AB', name: 'Anis Benyoucef', role: 'Founder' },
  { initials: 'YH', name: 'Yahya Hamu', role: 'Technical Lead' },
  { initials: 'IE', name: 'Idris Elmi', role: 'Technical Lead' },
] as const;

export function About({ onNavigate }: AboutProps) {
  return (
    <div className="about-splash">
      <div className="about-splash-bg" aria-hidden="true">
        <div className="about-splash-bg-vignette" />
        <div className="about-splash-bg-glow" />
      </div>

      <div className="about-splash-content about-splash-content--app">
        {/* Hero */}
        <section className="about-hero">
          <img src="/ISO OFFICIAL.png" alt="ISO" className="about-hero-logo" />
          <h1 className="about-hero-title">It's not you vs you anymore.</h1>
          <p className="about-hero-sub">
            Fear makes role players. Courage makes stars. It's time to{' '}
            <strong>Call an ISO</strong>.
          </p>
        </section>

        {/* The Problem */}
        <section className="about-section about-section-tight">
          <div className="about-eyebrow">The Challenge</div>
          <h2 className="about-heading about-heading-cards">Three Problems. One Mission.</h2>
          <div className="about-problem-grid">
            {PROBLEMS.map((problem) => (
              <div key={problem.num} className="about-problem-card">
                <div className="about-problem-num">Problem {problem.num}</div>
                <div className="about-problem-title">{problem.title}</div>
                <div className="about-problem-desc">{problem.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="about-section about-mission-section">
          <div className="about-eyebrow">Mission</div>
          <h2 className="about-heading about-mission-heading">
            <span className="about-mission-line">ISO is built to inspire ambition, elevate overlooked</span>
            <span className="about-mission-line">
              talent, and rebuild community pathways to success.
            </span>
          </h2>
        </section>

        <p className="about-why-line">
          Access used to come through people who let you get close enough to learn.{' '}
          <strong>ISO is building that back.</strong>
        </p>

        {/* What ISO Means */}
        <section className="about-section">
          <div className="about-defined">
            <div className="about-eyebrow">What ISO Means</div>
            <div className="about-defined-term">
              <span className="about-defined-word">ISO</span>
              <span className="about-defined-pronunciation">(eye-so)</span>
              <span className="about-defined-pos">— verb, basketball — isolation play</span>
            </div>

            <div className="about-reframe-split">
              <div className="about-reframe-col">
                <div className="about-reframe-label">What people assume</div>
                <div className="about-reframe-text struck">You vs you. Alone in the gym.</div>
              </div>
              <div className="about-reframe-vs">VS</div>
              <div className="about-reframe-col">
                <div className="about-reframe-label gold">What an ISO actually is</div>
                <div className="about-reframe-text">You vs a defender built to challenge you.</div>
              </div>
            </div>

            <p className="about-reframe-close">
              In basketball, an ISO isn't isolation — it's a one-on-one against someone who sharpens you in real
              time. <strong>We took that definition and applied it to real-world pathways.</strong> Every coach
              on ISO is that defender. You don't get better in isolation. You get better in proximity to someone
              who won't let you stay the same.
            </p>

            <div className="about-beliefs">
              {BELIEFS.map((belief) => (
                <div key={belief} className="about-belief">
                  <span className="about-belief-dash" />
                  {belief}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Six Pathways */}
        <section className="about-section about-pathways-section">
          <div className="about-eyebrow">The Pathways</div>
          <h2 className="about-heading about-heading-cards">Six paths. One mission.</h2>
          <p className="about-section-lede">
            Six archetypes for players and coaches — choose where you want to grow or lead.
          </p>
          <div className="about-pathway-grid">
            {PATHWAY_ARCHETYPES.map((pathway, index) => {
              const Icon = pathway.icon;
              return (
                <div
                  key={pathway.name}
                  className="about-pathway-card"
                  style={{ '--pathway-accent': pathway.accent } as React.CSSProperties}
                >
                  <div className="about-pathway-top">
                    <div className="about-pathway-icon" aria-hidden="true">
                      <Icon className="about-pathway-icon-svg" strokeWidth={1.75} />
                    </div>
                    <div className="about-pathway-num">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="about-pathway-name">{pathway.name}</div>
                  <div className="about-pathway-tagline">{pathway.tagline}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* What We Stand On */}
        <section className="about-section about-stand-on-section">
          <div className="about-eyebrow">What We Stand On</div>
          <h2 className="about-heading about-heading-cards">Faith-driven development and leadership</h2>
          <p className="about-section-lede">
            ISO is faith-driven — not in what it asks of you, but in how it was built. ISO is open to
            everyone willing to grow with discipline, humility, and respect for the values we stand on.
          </p>
          <div className="about-values">
            {VALUES.map((value) => (
              <span key={value} className="about-value">
                {value}
              </span>
            ))}
          </div>
        </section>

        {/* Why ISO Matters */}
        <section className="about-section">
          <div className="about-eyebrow">The Impact</div>
          <h2 className="about-heading about-heading-cards">Why ISO Matters</h2>
          <div className="about-impact-grid">
            {IMPACTS.map((impact, index) => (
              <div
                key={impact}
                className={`about-impact-bubble${index === 2 ? ' full' : ''}`}
              >
                {impact}
              </div>
            ))}
          </div>
        </section>

        {/* The Team */}
        <section className="about-section">
          <div className="about-eyebrow">Behind ISO</div>
          <h2 className="about-heading about-heading-cards">The Team</h2>
          <div className="about-team-grid">
            {TEAM.map((member) => (
              <div key={member.name} className="about-team-card">
                <div className="about-team-avatar">{member.initials}</div>
                <div className="about-team-name">{member.name}</div>
                <div className="about-team-role">{member.role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Close */}
        <section className="about-section about-close">
          <h2 className="about-close-title">
            ISO is built by courage.
            <br />
            And sustained by humility.
          </h2>
          <button type="button" className="about-close-btn" onClick={() => onNavigate?.('pathways')}>
            Call an ISO
          </button>
          <div className="about-close-sub">Players</div>
        </section>
      </div>
    </div>
  );
}
