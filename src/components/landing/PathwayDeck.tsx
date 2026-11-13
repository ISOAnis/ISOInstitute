import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Activity, Dumbbell, Globe, Moon, Rocket, Settings, type LucideIcon } from 'lucide-react';
import '../../styles/pathway-deck.css';

type Pathway = { name: string; field: string; who: string; live?: boolean; Icon: LucideIcon };

/** Same order, icons and colors as the coach card builder. */
const DECK: Pathway[] = [
  { name: 'Builder', field: 'Engineering & tech', who: 'Engineers, developers, product and design leads', live: true, Icon: Settings },
  { name: 'Founder', field: 'Entrepreneurship & business', who: 'Founders, operators and small business owners', Icon: Rocket },
  { name: 'Healer', field: 'Medicine & healthcare', who: 'Doctors, nurses, pharmacists and researchers', Icon: Activity },
  { name: 'Reformer', field: 'Law & public policy', who: 'Lawyers, policy makers and advocates', Icon: Globe },
  { name: 'Warrior', field: 'Health, fitness & athletics', who: 'Athletes, coaches and trainers', Icon: Dumbbell },
  { name: 'Seeker', field: 'Deen, purpose & character', who: 'Scholars, imams and teachers', Icon: Moon },
];
const N = DECK.length;
const SWIPE_MIN = 45;
const AUTO_MS = 4200;

/** Shortest signed distance from the front card, so the deck wraps around. */
function offset(i: number, active: number) {
  let d = i - active;
  if (d > N / 2) d -= N;
  if (d <= -N / 2) d += N;
  return d;
}

/**
 * The six pathways as a fanned 3D deck. The front card faces you; the rest tilt away on
 * either side. Shuffle with the arrows, the tabs, a swipe/drag, the arrow keys, or by tapping
 * a side card. It drifts forward on its own while in view until someone touches it.
 */
export function PathwayDeck() {
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState(0);
  const [width, setWidth] = useState(1000);
  const stageRef = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const inView = useRef(false);
  const start = useRef<{ x: number; id: number } | null>(null);

  const go = (dir: number) => setActive((a) => (a + dir + N) % N);
  const pick = (i: number) => {
    touched.current = true;
    setActive(i);
  };
  const step = (dir: number) => {
    touched.current = true;
    go(dir);
  };

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = reduce
      ? 0
      : window.setInterval(() => {
          if (!touched.current && inView.current && !document.hidden) go(1);
        }, AUTO_MS);
    return () => {
      io.disconnect();
      ro.disconnect();
      if (id) window.clearInterval(id);
    };
  }, []);

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    start.current = { x: e.clientX, id: e.pointerId };
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!start.current || start.current.id !== e.pointerId) return;
    const dx = e.clientX - start.current.x;
    if (Math.abs(dx) > 6) {
      touched.current = true;
      setDrag(dx);
    }
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!start.current || start.current.id !== e.pointerId) return;
    const dx = e.clientX - start.current.x;
    start.current = null;
    setDrag(0);
    if (Math.abs(dx) >= SWIPE_MIN) go(dx < 0 ? 1 : -1);
  };

  const shift = Math.min(width * 0.2, 230);
  const dragUnits = drag / (shift * 1.4);

  return (
    <div className="pd">
      <div
        className={`pd-stage${drag ? ' dragging' : ''}`}
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Six ISO pathways. Use the left and right arrow keys to shuffle."
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1);
          if (e.key === 'ArrowLeft') step(-1);
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {DECK.map((p, i) => {
          const d = offset(i, active) + dragUnits;
          const a = Math.abs(d);
          const front = offset(i, active) === 0;
          const style = {
            transform: `translate(-50%, -50%) translateX(${d * shift}px) translateZ(${-a * 150}px) rotateY(${
              Math.max(-3, Math.min(3, d)) * -24
            }deg) rotateZ(${d * 2.5}deg) scale(${1 - Math.min(a, 3) * 0.04})`,
            opacity: a >= 2.6 ? 0 : 1,
            zIndex: 20 - Math.round(a * 4),
            filter: `brightness(${1 - Math.min(a, 2.5) * 0.22})`,
          };
          return (
            <article
              key={p.name}
              className={`pd-card${front ? ' front' : ''}`}
              data-path={p.name}
              style={style}
              aria-hidden={!front}
              onClick={() => !front && pick(i)}
            >
              <span className="pd-water" aria-hidden="true">
                {p.name}
              </span>
              <div className="pd-top">
                <span className="pd-icon">
                  <p.Icon size={22} strokeWidth={1.8} />
                </span>
                <span className={`pd-tag${p.live ? ' live' : ''}`}>{p.live ? 'Live in Denver soon' : 'Coming'}</span>
              </div>
              <div className="pd-body">
                <span className="pd-num">
                  {String(i + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
                </span>
                <h3 className="pd-name">{p.name}</h3>
                <p className="pd-field">{p.field}</p>
              </div>
              <div className="pd-foot">
                <span className="pd-label">Who coaches here</span>
                <p className="pd-who">{p.who}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="pd-controls">
        <button type="button" className="pd-arrow" onClick={() => step(-1)} aria-label="Previous pathway">
          <svg width="16" height="16" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M8.5 3 4.5 7l4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="pd-tabs" role="tablist" aria-label="Pathways">
          {DECK.map((p, i) => (
            <button
              key={p.name}
              type="button"
              role="tab"
              aria-selected={i === active}
              className="pd-tab"
              data-path={p.name}
              onClick={() => pick(i)}
            >
              {p.name}
            </button>
          ))}
        </div>
        <span className="pd-count" aria-hidden="true">
          {DECK[active].name} · {active + 1} of {N}
        </span>
        <button type="button" className="pd-arrow" onClick={() => step(1)} aria-label="Next pathway">
          <svg width="16" height="16" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M5.5 3l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <p className="pd-sr" aria-live="polite">
        {DECK[active].name}: {DECK[active].field}. {DECK[active].live ? 'Live in Denver soon.' : 'Coming.'} Who coaches here:{' '}
        {DECK[active].who}.
      </p>
    </div>
  );
}
