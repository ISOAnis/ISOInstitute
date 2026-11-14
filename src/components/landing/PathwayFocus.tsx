import { Activity, Dumbbell, Globe, Moon, Rocket, Settings, type LucideIcon } from 'lucide-react';
import '../../styles/pathway-deck.css';
import '../../styles/pathway-focus.css';

const TOPICS = ['Breaking into engineering', 'Internships and first jobs', 'Resume reviews', 'Interview prep'];

const COMING: { name: string; field: string; Icon: LucideIcon }[] = [
  { name: 'Founder', field: 'Entrepreneurship & business', Icon: Rocket },
  { name: 'Healer', field: 'Medicine & healthcare', Icon: Activity },
  { name: 'Reformer', field: 'Law & public policy', Icon: Globe },
  { name: 'Warrior', field: 'Health, fitness & athletics', Icon: Dumbbell },
  { name: 'Seeker', field: 'Deen, purpose & character', Icon: Moon },
];

/** The Builder pathway on its own, with the other five listed as coming soon. */
export function PathwayFocus() {
  return (
    <div className="pf">
      <div className="pf-main">
        <article className="pd-card front pf-card" data-path="Builder">
          <span className="pd-water" aria-hidden="true">
            Builder
          </span>
          <div className="pd-top">
            <span className="pd-icon">
              <Settings size={22} strokeWidth={1.8} />
            </span>
            <span className="pd-tag live">Live soon</span>
          </div>
          <div className="pd-body">
            <span className="pd-num">Pathway 01</span>
            <h3 className="pd-name">Builder</h3>
            <p className="pd-field">Engineering &amp; tech</p>
          </div>
          <div className="pd-foot">
            <span className="pd-label">Who coaches here</span>
            <p className="pd-who">Engineers, developers, product and design leads</p>
          </div>
        </article>

        <div className="pf-info">
          <div className="pf-block">
            <span className="pf-label">Who it&rsquo;s for</span>
            <p>Engineering and CS students, and new grads trying to land their first role.</p>
          </div>
          <div className="pf-block">
            <span className="pf-label">Who you&rsquo;ll meet</span>
            <p>Working engineers in your city, at companies you&rsquo;re applying to.</p>
          </div>
          <div className="pf-block">
            <span className="pf-label">What you&rsquo;ll talk about</span>
            <ul className="pf-topics">
              {TOPICS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="pf-next">
        <span className="pf-label">More pathways coming soon</span>
        <ul className="pf-coming">
          {COMING.map(({ name, field, Icon }) => (
            <li key={name} data-path={name}>
              <span className="pf-ic">
                <Icon size={16} strokeWidth={1.8} />
              </span>
              <span>
                <b>{name}</b>
                <small>{field}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
