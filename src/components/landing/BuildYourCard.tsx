import { memo, useEffect, useRef } from 'react';
import { initBuildCard } from './buildCard';

const PERKS = [
  { title: 'Players on your path find you', detail: 'on the map, by your card' },
  { title: 'Followers get a ping', detail: 'every time you drop a pin' },
  { title: 'Your Overall grows', detail: 'with every ISO you host' },
  { title: 'Cohost your pathway\u2019s Invitational', detail: 'as you rank up' },
  { title: 'Premium apparel unlocks', detail: 'for purchase as your Overall climbs' },
  { title: 'A free player membership', detail: 'when you host consistently' },
];

/**
 * "Build your card" coach section, from ISO_Coach_Card/coach-card.html.
 * The card is updated by initBuildCard directly in the DOM, so this component is memoized
 * and never re-renders over those changes.
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
            <div className="bc-flip">
              <div className="bc-flip-inner" id="bcFlip">
                <div className="bc-card bc-card-front" id="bcCard" data-path="Builder" aria-live="polite">
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
                  <span className="bc-prev" id="bcPrev" hidden>
                    Preview
                  </span>
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
                  <p className="bc-path" id="bcPathLbl">
                    Builder
                  </p>
                  <p className="bc-name" id="bcName" data-ph="Your name">
                    Your name
                  </p>
                  <p className="bc-meta" id="bcMeta" data-ph="Your role, Company · Denver, CO">
                    Your role, Company · Denver, CO
                  </p>
                  <div className="bc-boxes">
                    <div className="bc-box">
                      <b id="bcB1" data-ph="Company">
                        Company
                      </b>
                      <span id="bcS1" data-ph="Your role">
                        Your role
                      </span>
                    </div>
                    <div className="bc-box">
                      <b id="bcB2" data-ph="School">
                        School
                      </b>
                      <span id="bcS2" data-ph="Major">
                        Major
                      </span>
                    </div>
                    <div className="bc-box">
                      <b id="bcB3" data-ph="Group">
                        Group
                      </b>
                      <span id="bcS3" data-ph="Title">
                        Title
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bc-card bc-card-back" id="bcCardBack" data-path="Builder" aria-hidden="true">
                  <div className="bc-back-head">
                    <span className="bc-back-eyebrow">For ISO coaches</span>
                    <p className="bc-back-title">What comes with your card</p>
                  </div>
                  <ul className="bc-back-list">
                    {PERKS.map((perk) => (
                      <li key={perk.title}>
                        <b>{perk.title}</b>
                        <span>{perk.detail}</span>
                      </li>
                    ))}
                  </ul>
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
          <form className="bc-form" id="bcForm" noValidate>
            <div className="bc-grid">
              <label className="bc-f">
                <span>Name</span>
                <input id="bcInName" maxLength={24} autoComplete="name" placeholder="Your name" />
              </label>
              <label className="bc-f">
                <span>City</span>
                <input id="bcInCity" maxLength={20} autoComplete="address-level2" placeholder="Denver, CO" />
              </label>
              <label className="bc-f">
                <span>Role</span>
                <input id="bcInRole" maxLength={28} autoComplete="organization-title" placeholder="Software engineer" />
              </label>
              <label className="bc-f">
                <span>Company</span>
                <input id="bcInCo" maxLength={24} autoComplete="organization" placeholder="Where you work now" />
              </label>
            </div>
            <fieldset className="bc-paths">
              <legend>Your pathway</legend>
              <div className="bc-chips" id="bcChips">
                {['Builder', 'Founder', 'Healer', 'Reformer', 'Warrior', 'Seeker'].map((path) => (
                  <label key={path}>
                    <input type="radio" name="bcPath" value={path} defaultChecked={path === 'Builder'} />
                    <span>{path}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="bc-keys">
              <legend>
                Key boxes <em>A company, school or group. Short words fit best.</em>
              </legend>
              <div className="bc-keyrow">
                <div className="bc-key">
                  <input id="bcInB1" maxLength={12} placeholder="Google" aria-label="Box 1 name" />
                  <input id="bcInS1" maxLength={16} placeholder="Software eng" aria-label="Box 1 detail" />
                </div>
                <div className="bc-key">
                  <input id="bcInB2" maxLength={12} placeholder="CU Boulder" aria-label="Box 2 name" />
                  <input id="bcInS2" maxLength={16} placeholder="Computer sci" aria-label="Box 2 detail" />
                </div>
                <div className="bc-key">
                  <input id="bcInB3" maxLength={12} placeholder="SHPE" aria-label="Box 3 name" />
                  <input id="bcInS3" maxLength={16} placeholder="Chapter lead" aria-label="Box 3 detail" />
                </div>
              </div>
            </fieldset>
            <div className="bc-photo-row">
              <input type="file" id="bcPhoto" accept="image/*" className="bc-file" />
              <label htmlFor="bcPhoto" className="btn ghost bc-photo-btn">
                Add a photo
              </label>
              <button type="button" className="bc-clear" id="bcClear" hidden>
                Remove photo
              </button>
              <span className="bc-note">
                Use a photo with no background for the most accurate results. Optional, and it stays on your device.
              </span>
            </div>
            <div className="bc-cta">
              <a className="btn" id="bcClaim" href="https://tally.so/r/Y5Ee75" target="_blank" rel="noopener">
                Claim your card
              </a>
              <p className="bc-note">
                Claiming adds you to the coach waitlist. We&rsquo;ll reach out to verify you and get your first pin on the
                map.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
});
