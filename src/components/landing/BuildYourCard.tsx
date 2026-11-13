import { memo, useEffect, useRef } from 'react';
import {
  Activity,
  Bell,
  Dumbbell,
  Globe,
  MapPin,
  Moon,
  Rocket,
  Settings,
  Shirt,
  Ticket,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import { initBuildCard, PATHWAYS } from './buildCard';

/** What the back of the card promises, grouped by when a coach gets it. */
const PERK_GROUPS: Array<{ when: string; items: Array<{ Icon: LucideIcon; text: string }> }> = [
  {
    when: 'From day one',
    items: [
      { Icon: MapPin, text: 'Players on your path find you' },
      { Icon: Bell, text: 'Followers get pinged on new pins' },
      { Icon: TrendingUp, text: 'Your Overall grows with every ISO' },
    ],
  },
  {
    when: 'As you rank up',
    items: [
      { Icon: Trophy, text: 'Cohost your pathway\u2019s Invitational' },
      { Icon: Shirt, text: 'Unlock premium ISO apparel to buy' },
    ],
  },
  {
    when: 'When you host consistently',
    items: [{ Icon: Ticket, text: 'A free player membership' }],
  },
];

/** Same icons the About page uses for each pathway. */
const PATH_ICONS: Record<(typeof PATHWAYS)[number], LucideIcon> = {
  Builder: Settings,
  Founder: Rocket,
  Healer: Activity,
  Reformer: Globe,
  Warrior: Dumbbell,
  Seeker: Moon,
};

/** All six icons are rendered; CSS shows the one matching the card's data-path. */
function PathIcon() {
  return (
    <span className="bc-icon" aria-hidden="true">
      {PATHWAYS.map((path) => {
        const Icon = PATH_ICONS[path];
        return <Icon key={path} data-i={path} size={20} strokeWidth={1.8} />;
      })}
    </span>
  );
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path
        d={dir === 'left' ? 'M8.5 3 4.5 7l4 4' : 'M5.5 3l4 4-4 4'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * "Build your card" coach section. The card itself is the editor: every line is tap-to-edit,
 * the pathway changes by swiping the card (or the arrows), and the photo box opens the picker.
 * initBuildCard drives it directly in the DOM, so this component is memoized and never
 * re-renders over those changes.
 */
export const BuildYourCard = memo(function BuildYourCard() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    return initBuildCard(rootRef.current);
  }, []);

  return (
    <section id="build-card" className="bc-sec" ref={rootRef}>
      <div className="wrap">
        <div className="bc-head">
          <div className="eyebrow">For coaches</div>
          <h2>Already on the path? Build your card.</h2>
          <p className="lede">Players find coaches by their card. Make yours in a minute and see what comes with it.</p>
        </div>
        <div className="bc">
          <div className="bc-left">
            <input type="file" id="bcPhoto" accept="image/*" className="bc-file" aria-label="Add a photo to your card" />
            <div className="bc-flip">
              <div className="bc-flip-inner" id="bcFlip">
                <div className="bc-card bc-card-front" id="bcCard" data-path="Builder">
                  <span className="bc-water" id="bcWater" aria-hidden="true">
                    Builder
                  </span>
                  <div className="bc-top">
                    <span className="bc-ovr" id="bcOvr">
                      60
                    </span>
                    <span className="bc-ovl" id="bcRank">
                      Bronze
                    </span>
                  </div>
                  <PathIcon />
                  <span className="bc-prev" id="bcPrev" hidden>
                    Preview
                  </span>
                  <div className="bc-photo-wrap">
                    <label className="bc-photo" htmlFor="bcPhoto" id="bcPhotoBox">
                      <img id="bcPhotoImg" alt="" hidden />
                      <span className="bc-add" id="bcAdd">
                        <svg
                          width="26"
                          height="26"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
                          <circle cx="12" cy="13" r="3.5" />
                        </svg>
                        Add photo<small>No background works best</small>
                      </span>
                    </label>
                    <button type="button" className="bc-clear" id="bcClear" aria-label="Remove photo" hidden>
                      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                  <div className="bc-path-row">
                    <p className="bc-path" id="bcPathLbl" aria-live="polite">
                      Builder
                    </p>
                    <div className="bc-path-arrows">
                      <button type="button" className="bc-path-arrow" data-dir="-1" aria-label="Previous pathway">
                        <Chevron dir="left" />
                      </button>
                      <button type="button" className="bc-path-arrow" data-dir="1" aria-label="Next pathway">
                        <Chevron dir="right" />
                      </button>
                    </div>
                  </div>
                  <p className="bc-name">
                    <span className="bc-edit" data-field="name" data-ph="Your name" data-max="24" />
                  </p>
                  <p className="bc-meta">
                    <span className="bc-edit" data-field="role" data-ph="Your role" data-max="28" />
                    {', '}
                    <span className="bc-edit" data-field="co" data-ph="Company" data-max="24" data-label="Company" />
                    {' · '}
                    <span className="bc-edit" data-field="city" data-ph="Denver, CO" data-max="20" data-label="City" />
                  </p>
                  <div className="bc-boxes">
                    {[
                      ['b1', 'Company', 's1', 'Your role'],
                      ['b2', 'School', 's2', 'Major'],
                      ['b3', 'Group', 's3', 'Title'],
                    ].map(([b, bPh, d, dPh], i) => (
                      <div className="bc-box" key={b}>
                        <b
                          className="bc-edit"
                          data-field={b}
                          data-ph={bPh}
                          data-max="12"
                          data-label={`Key box ${i + 1}: ${bPh.toLowerCase()}`}
                        />
                        <span
                          className="bc-edit"
                          data-field={d}
                          data-ph={dPh}
                          data-max="16"
                          data-label={`Key box ${i + 1}: ${dPh.toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bc-card bc-card-back" id="bcCardBack" data-path="Builder" aria-hidden="true">
                  <PathIcon />
                  <div className="bc-back-head">
                    <span className="bc-back-eyebrow">For ISO coaches</span>
                    <p className="bc-back-title">What comes with your card</p>
                  </div>
                  <div className="bc-back-groups">
                    {PERK_GROUPS.map((group) => (
                      <div className="bc-back-group" key={group.when}>
                        <p className="bc-back-when">{group.when}</p>
                        <ul>
                          {group.items.map(({ Icon, text }) => (
                            <li key={text}>
                              <span className="bc-back-ic" aria-hidden="true">
                                <Icon size={15} strokeWidth={2} />
                              </span>
                              <span>{text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="bc-back-foot">
                    <span className="bc-back-path" id="bcBackPath">
                      Builder
                    </span>
                    <span className="bc-back-rank">
                      <b id="bcBackOvr">60</b>
                      <span className="bc-ovl" id="bcBackRank">
                        Bronze
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="bc-hint" id="bcHint">
              Tap any line on the card to edit it. Swipe the card or use the arrows to change your pathway.
            </p>
            <div className="bc-flip-row">
              <button
                type="button"
                className="expand bc-flip-btn"
                id="bcFlipBtn"
                aria-pressed="false"
                aria-controls="bcFlip"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
                <span id="bcFlipLabel">Flip to see what you get</span>
              </button>
            </div>
            <button
              type="button"
              className="bc-q"
              id="bcQBtn"
              aria-expanded="false"
              aria-controls="bcQ"
              aria-label="What makes up your Overall?"
            >
              ?
            </button>
            <div className="bc-pop" id="bcQ" role="dialog" aria-label="What makes up your Overall" hidden>
              <p className="bc-pop-t">What&rsquo;s your Overall?</p>
              <p>
                Every coach starts at <b>Bronze 60</b>. It&rsquo;s a starting line, not a grade. It grows with:
              </p>
              <ul>
                <li>The ISOs you host</li>
                <li>How players rate them</li>
                <li>Showing up consistently (your streak)</li>
                <li>Players who follow you</li>
              </ul>
              <p>
                Climb to Silver, Gold and Platinum to unlock more, like cohosting your pathway&rsquo;s Invitational and
                premium ISO apparel.
              </p>
            </div>
            <div className="bc-ranks" role="group" aria-label="Preview your card at each rank">
              <button type="button" data-rank="bronze" aria-pressed="true">
                <i />
                Bronze<small>You&rsquo;re here</small>
              </button>
              <button type="button" data-rank="silver" aria-pressed="false">
                <i />
                Silver<small>Preview</small>
              </button>
              <button type="button" data-rank="gold" aria-pressed="false">
                <i />
                Gold<small>Preview</small>
              </button>
              <button type="button" data-rank="platinum" aria-pressed="false" className="locked">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
                Platinum<small>Locked</small>
              </button>
            </div>
            <p className="bc-rank-note" id="bcRankNote" aria-live="polite">
              Tap a rank to see where your card is headed.
            </p>
          </div>
          <div className="bc-side">
            <ol className="bc-steps">
              <li>
                <b>Tap a line to type</b>
                <span>Your name, role, city and three key boxes, right on the card.</span>
              </li>
              <li>
                <b>Swipe to pick your pathway</b>
                <span>Six pathways, each with its own color and icon.</span>
              </li>
              <li>
                <b>Tap the center to add a photo</b>
                <span>Optional. A photo with no background looks best, and it stays on your device.</span>
              </li>
            </ol>
            <div className="bc-cta">
              <a className="btn" id="bcClaim" href="https://tally.so/r/Y5Ee75" target="_blank" rel="noopener">
                Claim your card
              </a>
              <p className="bc-note">
                Claiming adds you to the coach waitlist. We&rsquo;ll reach out to verify you and get your first pin on the
                map.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
