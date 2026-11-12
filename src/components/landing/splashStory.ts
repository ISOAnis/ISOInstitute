/**
 * Scroll story for the landing splash: "You." → the six-degrees chain → ISO skips
 * the chain → the globe spins to Denver → the dot lands on the app map → coach card.
 *
 * Everything is driven by scroll progress through `.sp-track` (1000vh tall) and drawn
 * on two canvases around the phone. The animation loop only runs while the track is
 * on screen, canvases are only resized when the stage size actually changes, and the
 * DOM/back canvas are only touched when the scroll position moves.
 */
import { geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson-client';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const eio = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eo = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const ORANGE = '200,135,58';
const INK = '242,238,232';
const DENVER: [number, number] = [-104.99, 39.74];
/** The "you" ring on the map screenshot, as a fraction of the phone image. */
const PIN = { x: 0.524, y: 0.465 };
const LABELS = ['You', 'A friend', 'Their coworker', 'Her cousin', 'His old boss', 'A LinkedIn mutual', 'The person you need'];
const DISPLAY_FONT = "'Bebas Neue', Impact, sans-serif";
const BODY_FONT = 'Manrope, system-ui, sans-serif';

type Pt = { x: number; y: number };
type Layout = {
  W: number; H: number; m: boolean; gx: number; gy: number; R: number; Z: number;
  ph: number; pw: number; pts: Pt[]; C: Pt; S: Pt;
};

export function initSplashStory(root: HTMLElement, onQuietChange: (quiet: boolean) => void): () => void {
  const $ = <T extends Element>(sel: string) => root.querySelector(sel) as T;
  const track = $<HTMLElement>('.sp-track');
  const stage = $<HTMLElement>('.sp-stage');
  const back = $<HTMLCanvasElement>('.sp-back');
  const front = $<HTMLCanvasElement>('.sp-front');
  const phone = $<HTMLElement>('.sp-phone');
  const card = $<HTMLElement>('.sp-card');
  const flipper = card.querySelector('.sp-flip') as HTMLElement;
  const hint = $<HTMLElement>('.sp-hint');
  const skip = $<HTMLButtonElement>('.sp-skip');
  const ctas = $<HTMLElement>('.sp-ctas');
  const scene = $<HTMLElement>('[data-sp="0"]');
  const lines = Array.from(scene.querySelectorAll<HTMLElement>('.sp-ln')).map((el) => ({
    el,
    at: parseFloat(el.dataset.at || '0'),
    on: false,
  }));
  const blocks = (
    [
      ['1', 0.07, 0.11, 0.29, 0.31],
      ['2', 0.32, 0.35, 0.44, 0.47],
      ['3', 0.55, 0.61, 2, 2],
    ] as const
  ).map(([id, a, b, c, d]) => {
    const el = $<HTMLElement>(`[data-sp="${id}"]`);
    return { el, a, b, c, d, hasLink: !!el.querySelector('a') };
  });

  const bctx = back.getContext('2d')!;
  const fctx = front.getContext('2d')!;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const cleanups: Array<() => void> = [];
  const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, fn: (e: HTMLElementEventMap[K]) => void) => {
    el.addEventListener(type, fn as EventListener);
    cleanups.push(() => el.removeEventListener(type, fn as EventListener));
  };

  // ---------- coach card flip ----------
  let autoFlipped = false;
  let flipTimers: number[] = [];
  const setFlip = (v: boolean) => flipper.classList.toggle('on', v);
  on(card, 'click', () => setFlip(!flipper.classList.contains('on')));
  on(card, 'keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setFlip(!flipper.classList.contains('on'));
    }
  });
  if (window.matchMedia('(hover: hover)').matches) {
    on(card, 'mouseenter', () => setFlip(true));
    on(card, 'mouseleave', () => setFlip(false));
  }

  // ---------- skip intro ----------
  on(skip, 'click', (e) => {
    e.preventDefault();
    const run = track.offsetHeight - stage.clientHeight;
    const de = document.documentElement;
    const prev = de.style.scrollBehavior;
    de.style.scrollBehavior = 'auto';
    window.scrollTo(0, track.getBoundingClientRect().top + window.scrollY + run * 0.995);
    de.style.scrollBehavior = prev;
  });

  // ---------- map data ----------
  let land: any = null;
  let borders: any = null;
  let states: any = null;
  let colorado: any = null;
  let disposed = false;
  const grat = geoGraticule10();
  Promise.all(
    ['/iso/data/world-110m.json', '/iso/data/us-states.json'].map((u) =>
      fetch(u).then((r) => {
        if (!r.ok) throw new Error(u);
        return r.json();
      }),
    ),
  )
    .then(([world, us]) => {
      if (disposed) return;
      land = feature(world, world.objects.land);
      borders = mesh(world, world.objects.countries, (a: unknown, b: unknown) => a !== b);
      states = mesh(us, us.objects.states, (a: unknown, b: unknown) => a !== b);
      colorado = (feature(us, us.objects.states) as any).features.find((f: any) => f.id === '08');
      lastP = -1;
    })
    .catch((err) => console.warn('ISO splash: map data failed to load', err));
  const proj = geoOrthographic().clipAngle(90);
  const path = geoPath(proj, bctx);

  // ---------- layout ----------
  let L = {} as Layout;
  let dpr = 1;
  let lastP = -1;
  let RAW = 0;
  let quiet: boolean | null = null;

  function layout(force = false) {
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const nextDpr = Math.min(2, window.devicePixelRatio || 1);
    if (!force && W === L.W && H === L.H && nextDpr === dpr) return;
    dpr = nextDpr;
    for (const c of [back, front]) {
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
    }
    const m = W < 760;
    const gx = m ? W * 0.5 : W * 0.7;
    const gy = m ? H * 0.76 : H * 0.52;
    const R = m ? Math.min(W * 0.4, H * 0.22) : Math.min(W * 0.25, H * 0.38);
    const Z = ((m ? 1.55 : 1.15) * W) / R;
    const ph = m ? Math.min(H * 0.4, 480) : Math.min(H * 0.8, 700);
    const pw = (ph * 540) / 1168;
    // Seven people, six equal links, one even zigzag
    const x0 = W * 0.08;
    const x1 = W * (m ? 0.92 : 0.7);
    const step = (x1 - x0) / 6;
    const amp = step * 0.3;
    const base = H * (m ? 0.7 : 0.67);
    const pts = Array.from({ length: 7 }, (_, i) => ({ x: x0 + step * i, y: base + (i % 2 ? -amp : amp) }));
    L = {
      W, H, m, gx, gy, R, Z, ph, pw, pts,
      C: { x: W / 2, y: H / 2 },
      S: m ? { x: W / 2, y: H * (H < 740 ? 0.9 : 0.82) } : { x: W * 0.7, y: H / 2 },
    };
    phone.style.width = pw + 'px';
    phone.style.height = ph + 'px';
    lastP = -1;
  }

  function progress() {
    const r = track.getBoundingClientRect();
    const run = r.height - stage.clientHeight;
    return clamp(-r.top / (run || 1));
  }

  const quad = (a: Pt, c: Pt, b: Pt, t: number) => {
    const u = 1 - t;
    return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
  };
  const arcCtrl = () => {
    const A = L.pts[0];
    const F = L.pts[6];
    return { x: (A.x + F.x) / 2, y: Math.min(A.y, F.y) - L.H * (L.m ? 0.16 : 0.24) };
  };
  const globeCenter = (p: number) => {
    const F = L.pts[6];
    const t = eio(seg(p, 0.44, 0.56));
    return { x: lerp(F.x, L.gx, t), y: lerp(F.y, L.gy, t) };
  };
  const phonePos = (p: number) => {
    const rise = eio(seg(p, 0.74, 0.86));
    const cy = lerp(L.H + L.ph * 0.6, L.gy, rise);
    return { left: L.gx - L.pw / 2, top: cy - L.ph / 2, op: seg(p, 0.74, 0.8) };
  };

  // ---------- back layer: chain + globe ----------
  function drawBack(p: number) {
    const { W, H } = L;
    const ctx = bctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const g = seg(p, 0.44, 0.58);
    if (g > 0 && land) {
      const c = globeCenter(p);
      const z = eio(seg(p, 0.6, 0.72));
      const e = eio(seg(p, 0.74, 0.9));
      const s = L.R * eo(g) * lerp(1, L.Z, z) * lerp(1, 3.2, e);
      const spin = eio(seg(p, 0.44, 0.62));
      proj
        .translate([c.x, c.y])
        .scale(s)
        .rotate([lerp(-DENVER[0] + 150, -DENVER[0], spin), lerp(-8, -DENVER[1], spin)]);
      const a = eo(g) * lerp(1, 0.3, e);
      ctx.globalAlpha = a;
      if (s < Math.max(W, H) * 1.5) {
        const halo = ctx.createRadialGradient(c.x, c.y, s * 0.92, c.x, c.y, s * 1.22);
        halo.addColorStop(0, `rgba(${ORANGE},.16)`);
        halo.addColorStop(1, `rgba(${ORANGE},0)`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(c.x, c.y, s * 1.22, 0, Math.PI * 2);
        ctx.fill();
      }
      const sea = ctx.createRadialGradient(c.x - s * 0.3, c.y - s * 0.35, s * 0.05, c.x, c.y, s);
      sea.addColorStop(0, '#1d1d22');
      sea.addColorStop(1, '#0d0d0f');
      ctx.fillStyle = sea;
      ctx.beginPath();
      path({ type: 'Sphere' } as any);
      ctx.fill();
      ctx.strokeStyle = `rgba(${ORANGE},.28)`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.strokeStyle = `rgba(${INK},.05)`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      path(grat);
      ctx.stroke();
      ctx.fillStyle = '#2a2a31';
      ctx.beginPath();
      path(land);
      ctx.fill();
      ctx.strokeStyle = `rgba(${INK},.12)`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      path(borders);
      ctx.stroke();
      const st = seg(p, 0.62, 0.7);
      if (st > 0) {
        ctx.globalAlpha = a * st;
        ctx.strokeStyle = `rgba(${INK},.10)`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        path(states);
        ctx.stroke();
        if (colorado) {
          ctx.fillStyle = `rgba(${ORANGE},.13)`;
          ctx.strokeStyle = `rgba(${ORANGE},.55)`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          path(colorado);
          ctx.fill();
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      // scrim so the copy stays readable over the map
      const sc = seg(p, 0.52, 0.62);
      if (sc > 0) {
        let gr: CanvasGradient;
        if (L.m) {
          gr = ctx.createLinearGradient(0, 0, 0, H * 0.62);
          gr.addColorStop(0, 'rgba(18,18,20,.92)');
          gr.addColorStop(0.75, 'rgba(18,18,20,.75)');
          gr.addColorStop(1, 'rgba(18,18,20,0)');
        } else {
          gr = ctx.createLinearGradient(0, 0, W * 0.55, 0);
          gr.addColorStop(0, 'rgba(18,18,20,.9)');
          gr.addColorStop(0.7, 'rgba(18,18,20,.6)');
          gr.addColorStop(1, 'rgba(18,18,20,0)');
        }
        ctx.globalAlpha = sc;
        ctx.fillStyle = gr;
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
      }
    }

    // Chain of introductions
    const chainIn = seg(p, 0.1, 0.25);
    const fade = 1 - seg(p, 0.4, 0.47);
    const dim = seg(p, 0.33, 0.4);
    if (chainIn > 0 && fade > 0) {
      const P = L.pts;
      const segA = [0.45, 0.36, 0.27, 0.19, 0.13, 0.08];
      for (let i = 0; i < 6; i++) {
        const t = clamp((chainIn - (i + 0.6) / 7) * 7);
        if (t <= 0) continue;
        const a = P[i];
        const b = P[i + 1];
        ctx.save();
        ctx.globalAlpha = fade * (1 - 0.75 * dim);
        ctx.strokeStyle = `rgba(${INK},${segA[i]})`;
        ctx.lineWidth = 1.4;
        if (i >= 2) ctx.setLineDash([3, 7]);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(lerp(a.x, b.x, t), lerp(a.y, b.y, t));
        ctx.stroke();
        ctx.restore();
      }
      ctx.textAlign = 'center';
      for (let i = 0; i < 7; i++) {
        const t = clamp((chainIn - i / 7) * 7);
        if (t <= 0) continue;
        const q = P[i];
        let a = t * fade;
        if (i > 0 && i < 6) a *= 1 - 0.8 * dim;
        ctx.globalAlpha = a;
        if (i > 0) {
          ctx.fillStyle = `rgba(${INK},${i === 6 ? 0.95 : 0.6})`;
          ctx.beginPath();
          ctx.arc(q.x, q.y, i === 6 ? 6 : 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
        if (i === 6) {
          ctx.strokeStyle = `rgba(${INK},.35)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(q.x, q.y, 13, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = i === 0 || i === 6 ? `rgba(${ORANGE},1)` : `rgba(${INK},.55)`;
        ctx.font = `400 ${L.m ? 22 : 26}px ${DISPLAY_FONT}`;
        ctx.fillText('ABCDEFG'[i], q.x, q.y - 24);
        if (!L.m || i === 0 || i === 6) {
          ctx.fillStyle = `rgba(${INK},${i === 0 || i === 6 ? 0.85 : 0.5})`;
          ctx.font = `600 ${L.m ? 12 : 14}px ${BODY_FONT}`;
          if (L.m && i === 6) {
            ctx.textAlign = 'right';
            ctx.fillText('Who you need', q.x + 10, q.y + 36);
            ctx.textAlign = 'center';
          } else ctx.fillText(LABELS[i], q.x, q.y + 36);
        }
        ctx.globalAlpha = 1;
      }
    }
  }

  // ---------- front layer: the dot ----------
  function dotState(p: number) {
    const A = L.pts[0];
    const F = L.pts[6];
    let pos: Pt;
    let r = 1;
    const s0 = eio(seg(RAW, 0.006, 0.03));
    const S = { x: lerp(L.C.x, L.S.x, s0), y: lerp(L.C.y, L.S.y, s0) };
    if (p < 0.06) pos = S;
    else if (p < 0.1) {
      const t = eio(seg(p, 0.06, 0.1));
      pos = { x: lerp(S.x, A.x, t), y: lerp(S.y, A.y, t) };
    } else if (p < 0.33) pos = A;
    else if (p < 0.42) pos = quad(A, arcCtrl(), F, eio(seg(p, 0.33, 0.42)));
    else if (p < 0.74) pos = globeCenter(p);
    else {
      const lift = L.m ? 40 : 70;
      const up = eio(seg(p, 0.74, 0.8));
      const base = { x: L.gx, y: L.gy - lift * up };
      const ph = phonePos(p);
      const tgt = { x: ph.left + PIN.x * L.pw, y: ph.top + PIN.y * L.ph };
      const landT = eio(seg(p, 0.81, 0.9));
      pos = { x: lerp(base.x, tgt.x, landT), y: lerp(base.y, tgt.y, landT) };
      r = lerp(1, 0.75, landT);
    }
    return { pos, r, alpha: 1 - seg(p, 0.91, 0.96) };
  }

  function drawFront(p: number, time: number) {
    const { W, H } = L;
    const ctx = fctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // the skip: A straight to G
    const tr = seg(p, 0.33, 0.42);
    const trFade = 1 - seg(p, 0.44, 0.52);
    if (tr > 0 && trFade > 0) {
      const A = L.pts[0];
      const F = L.pts[6];
      const c = arcCtrl();
      const end = eio(tr);
      ctx.save();
      ctx.globalAlpha = trFade;
      const gr = ctx.createLinearGradient(A.x, 0, F.x, 0);
      gr.addColorStop(0, `rgba(${ORANGE},.15)`);
      gr.addColorStop(1, `rgba(${ORANGE},.95)`);
      ctx.strokeStyle = gr;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const q = quad(A, c, F, (end * i) / 60);
        if (i) ctx.lineTo(q.x, q.y);
        else ctx.moveTo(q.x, q.y);
      }
      ctx.stroke();
      ctx.restore();
    }

    const d = dotState(p);
    const tag = seg(p, 0.58, 0.63) * (1 - seg(p, 0.72, 0.76));
    if (tag > 0) {
      ctx.globalAlpha = tag;
      ctx.textAlign = 'left';
      ctx.fillStyle = `rgba(${INK},.95)`;
      ctx.font = `700 ${L.m ? 13 : 15}px ${BODY_FONT}`;
      ctx.fillText('Denver', d.pos.x + 20, d.pos.y - 4);
      ctx.fillStyle = `rgba(${INK},.55)`;
      ctx.font = `500 ${L.m ? 11 : 12}px ${BODY_FONT}`;
      ctx.fillText('39.74° N · 104.99° W', d.pos.x + 20, d.pos.y + 14);
      ctx.globalAlpha = 1;
    }

    // ripple on landing
    const rp = seg(p, 0.86, 0.98);
    if (rp > 0 && rp < 1) {
      for (const k of [0, 0.35]) {
        const t = clamp(rp - k) / (1 - k);
        if (t <= 0) continue;
        ctx.strokeStyle = `rgba(${ORANGE},${(1 - t) * 0.8})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(d.pos.x, d.pos.y, lerp(8, L.m ? 40 : 60, eo(t)), 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    if (d.alpha > 0) {
      const pulse = reduce ? 1 : 1 + 0.18 * Math.sin(time / 420);
      const gl = (L.m ? 30 : 40) * d.r * pulse;
      ctx.globalAlpha = d.alpha;
      const g = ctx.createRadialGradient(d.pos.x, d.pos.y, 0, d.pos.x, d.pos.y, gl);
      g.addColorStop(0, `rgba(${ORANGE},.75)`);
      g.addColorStop(0.25, `rgba(${ORANGE},.35)`);
      g.addColorStop(1, `rgba(${ORANGE},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(d.pos.x, d.pos.y, gl, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F6D9B4';
      ctx.beginPath();
      ctx.arc(d.pos.x, d.pos.y, 5.5 * d.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      if (p < 0.12) {
        ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(${INK},.85)`;
        ctx.font = `600 ${L.m ? 12 : 14}px ${BODY_FONT}`;
        ctx.fillText('You', d.pos.x, d.pos.y + 36);
      }
    }
  }

  function drawDom(p: number) {
    for (const b of blocks) {
      const i = seg(p, b.a, b.b);
      const o = 1 - seg(p, b.c, b.d);
      const v = Math.min(i, o);
      b.el.style.opacity = String(v);
      b.el.style.transform = `translateY(${(1 - i) * 24 - (1 - o) * 16}px)`;
      b.el.style.pointerEvents = v > 0.6 && b.hasLink ? 'auto' : 'none';
      b.el.style.visibility = v > 0 ? 'visible' : 'hidden';
    }
    hint.style.opacity = String(1 - seg(RAW, 0, 0.012));

    const nextQuiet = p < 0.88;
    if (nextQuiet !== quiet) {
      quiet = nextQuiet;
      onQuietChange(nextQuiet);
    }
    const so2 = 1 - seg(p, 0.86, 0.9);
    skip.style.opacity = String(so2);
    skip.style.pointerEvents = so2 > 0.5 ? 'auto' : 'none';
    skip.style.visibility = so2 > 0 ? 'visible' : 'hidden';

    // buttons wait until the dot has landed on the phone
    const ca = seg(p, 0.88, 0.94);
    ctas.style.opacity = String(ca);
    ctas.style.transform = `translateY(${(1 - ca) * 12}px)`;
    ctas.style.pointerEvents = ca > 0.6 ? 'auto' : 'none';

    // the opening scene takes the first 16% of the scroll
    const so = 1 - seg(RAW, 0.145, 0.16);
    scene.style.opacity = String(so);
    scene.style.transform = `translateY(${-(1 - so) * 16}px)`;
    scene.style.visibility = so > 0 ? 'visible' : 'hidden';
    for (const ln of lines) {
      const v = RAW >= ln.at;
      if (v !== ln.on) {
        ln.on = v;
        ln.el.classList.toggle('on', v);
      }
    }

    const ph = phonePos(p);
    phone.style.opacity = String(ph.op);
    phone.style.transform = `translate3d(${ph.left}px,${ph.top}px,0)`;

    // coach card slides in beside the phone after the dot lands
    const cw = L.m ? Math.min(150, L.W * 0.36) : Math.max(210, Math.min(270, L.W * 0.21));
    const cardIn = eo(seg(p, 0.9, 0.96));
    const cl = Math.min(ph.left + L.pw - (L.m ? 44 : 64), L.W - cw - (L.m ? 10 : 24));
    const ct = ph.top + L.ph * (L.m ? 0.3 : 0.22);
    card.style.width = cw + 'px';
    card.style.opacity = String(cardIn);
    const live = cardIn > 0.9;
    card.style.pointerEvents = live ? 'auto' : 'none';
    card.tabIndex = live ? 0 : -1;
    // flip once on its own after the dot lands, so everyone sees the back
    if (p >= 0.97 && !autoFlipped) {
      autoFlipped = true;
      flipTimers = [window.setTimeout(() => setFlip(true), 600), window.setTimeout(() => setFlip(false), 3400)];
    }
    if (p < 0.9 && autoFlipped) {
      autoFlipped = false;
      flipTimers.forEach(clearTimeout);
      flipTimers = [];
      setFlip(false);
    }
    card.style.transform = `translate3d(${cl + (1 - cardIn) * 40}px,${ct}px,0) rotate(${lerp(12, 5, cardIn)}deg)`;
  }

  // ---------- loop: only while the story is on screen ----------
  let raf = 0;
  let running = false;
  function tick(time: number) {
    RAW = progress();
    const p = seg(RAW, 0.16, 1);
    if (RAW !== lastP) {
      drawBack(p);
      drawDom(p);
      lastP = RAW;
    }
    drawFront(p, time);
  }
  function frame(time: number) {
    if (!running) return;
    tick(time);
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (running) return;
    running = true;
    lastP = -1;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
    // settle the final state (e.g. after an anchor jump past the story)
    lastP = -1;
    tick(performance.now());
  }

  layout(true);
  tick(performance.now());

  const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
    rootMargin: '100px 0px',
  });
  io.observe(track);

  const ro = new ResizeObserver(() => {
    layout();
    if (!running) tick(performance.now());
  });
  ro.observe(stage);

  if (document.fonts) {
    document.fonts.ready.then(() => {
      lastP = -1;
      if (!running && !disposed) tick(performance.now());
    });
  }

  return () => {
    disposed = true;
    running = false;
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    flipTimers.forEach(clearTimeout);
    cleanups.forEach((fn) => fn());
  };
}
