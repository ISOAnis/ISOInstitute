import { AboutCardRail } from './AboutCardRail';

const AUDIENCE_CARDS: { label: string; title: string; body: string; highlights: string[] }[] = [
  {
    label: 'For Players',
    title: 'Built by courage',
    body: 'Brave enough to pull up.',
    highlights: ['Meet coaches on your path', 'Rank up to All-Star', 'Unlock drops and Invitationals'],
  },
  {
    label: 'For Coaches',
    title: 'Sustained by humility',
    body: 'Been there. Giving back.',
    highlights: ['ID-verified, real experience', 'Climb Bronze to Platinum', 'Gear at every rank up'],
  },
  {
    label: 'For Partner Businesses',
    title: 'Powered by community',
    body: 'Where ISOs happen.',
    highlights: ['New foot traffic', 'Featured on the ISO map', 'Home base for ambition'],
  },
];

export function AboutRoleToggle() {
  return (
    <div className="about-role-toggle-wrap">
      <div className="about-eyebrow">Who It's For</div>
      <p className="about-section-lede about-role-intro">Three sides. One city. Everyone's In Search Of something.</p>

      <AboutCardRail label="Who it's for" itemCount={AUDIENCE_CARDS.length} gridClassName="about-role-grid">
        {AUDIENCE_CARDS.map((card) => (
          <div key={card.label} className="about-role-panel">
            <div className="about-role-panel-label">{card.label}</div>
            <div className="about-role-panel-title">{card.title}</div>
            <p className="about-role-panel-body">{card.body}</p>
            <ul className="about-role-panel-list">
              {card.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </AboutCardRail>

      <p className="about-role-culture">
        Rewarding player progress, celebrating coaches like superstars, and putting local spots on the map. <strong>That's the culture.</strong>
      </p>
    </div>
  );
}
