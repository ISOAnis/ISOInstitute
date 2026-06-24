import * as React from 'react';

interface AboutCardRailProps {
  label: string;
  itemCount: number;
  gridClassName: string;
  children: React.ReactNode;
}

export function AboutCardRail({ label, itemCount, gridClassName, children }: AboutCardRailProps) {
  const railRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const syncActiveIndex = React.useCallback(() => {
    const el = railRef.current;
    if (!el || el.children.length === 0) return;

    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;

    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i] as HTMLElement;
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const dist = Math.abs(center - childCenter);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }

    setActiveIndex(best);
  }, []);

  React.useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    el.addEventListener('scroll', syncActiveIndex, { passive: true });
    syncActiveIndex();

    const ro = new ResizeObserver(syncActiveIndex);
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', syncActiveIndex);
      ro.disconnect();
    };
  }, [syncActiveIndex, itemCount]);

  return (
    <div className="about-card-rail-wrap">
      <p className="about-card-rail-hint" aria-hidden="true">
        Swipe to explore
      </p>
      <div
        ref={railRef}
        className={`${gridClassName} about-card-rail`}
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </div>
      <div className="about-card-rail-dots" aria-hidden="true">
        {Array.from({ length: itemCount }, (_, i) => (
          <span
            key={i}
            className={`about-card-rail-dot${i === activeIndex ? ' is-active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
