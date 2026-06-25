import * as React from 'react';

type Role = 'players' | 'coaches';

const ROLE_CONTENT: Record<
  Role,
  { label: string; title: string; body: string; highlights: string[] }
> = {
  players: {
    label: 'For Players',
    title: 'Built by Courage',
    body:
      'Get matched with a coach who has been in your shoes, struggled your same struggle, learned the playbook, and is giving the game back with humility — real life accountability, not another app.',
    highlights: [
      'Choose a pathway and get matched with a coach',
      'Level up from Freshman to Professional through documented progress',
      'Complete skill buckets and build with your community',
    ],
  },
  coaches: {
    label: 'For Coaches',
    title: 'Sustained by Humility',
    body:
      "Coaches are verified professionals and community leaders with real experience in one of the six pathways. They're not here to give generic advice — they've walked the path and lead with humility.",
    highlights: [
      'Earn an Overall rating through real impact, not resume padding',
      'Guide players through skill buckets and documented outcomes',
      'Get celebrated like a superstar for the work you put in',
    ],
  },
};

export function AboutRoleToggle() {
  const [role, setRole] = React.useState<Role>('players');
  const content = ROLE_CONTENT[role];

  return (
    <div className="about-role-toggle-wrap">
      <div className="about-eyebrow">Who It's For</div>
      <p className="about-section-lede about-role-intro">
        The ISO Institute is the first gamified development platform for courageous people In
        Search Of real growth — and for others In Search Of a platform to give back.
      </p>

      <div className="about-role-toggle" role="tablist" aria-label="Choose player or coach view">
        {(Object.keys(ROLE_CONTENT) as Role[]).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={role === key}
            className={`about-role-toggle-btn${role === key ? ' active' : ''}`}
            onClick={() => setRole(key)}
          >
            {ROLE_CONTENT[key].label}
          </button>
        ))}
      </div>

      <div
        key={role}
        className="about-role-panel"
        role="tabpanel"
        aria-label={content.label}
      >
        <div className="about-role-panel-title">{content.title}</div>
        <p className="about-role-panel-body">{content.body}</p>
        <ul className="about-role-panel-list">
          {content.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <p className="about-role-culture">
        Rewarding player progress and celebrating coaches like superstars.{' '}
        <strong>That's the culture.</strong>
      </p>
    </div>
  );
}
