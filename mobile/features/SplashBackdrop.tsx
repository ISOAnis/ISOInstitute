import { StyleSheet } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { alpha, colors } from '@/theme';

const W = 390;
const H = 844;

/** Deterministic PRNG so the texture is identical on every launch. */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

type P = { x: number; y: number };

/** A loose web of people: faint nodes, each linked to its nearest neighbours. Kept clear of the copy block. */
function buildWeb() {
  const rand = rng(7);
  const nodes: P[] = [];
  while (nodes.length < 46) {
    const p = { x: rand() * W, y: rand() * H };
    const inCopy = (p.y > 300 && p.y < 600 && p.x > 24 && p.x < W - 24) || Math.hypot((p.x - W / 2) / 130, (p.y - 300) / 150) < 1;
    const tooClose = nodes.some((n) => Math.hypot(n.x - p.x, n.y - p.y) < 42);
    if (!inCopy && !tooClose) nodes.push(p);
  }
  const seen = new Set<string>();
  const links: [P, P][] = [];
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
      .filter((n) => n.j !== i)
      .sort((m, n) => m.d - n.d)
      .slice(0, 2)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          links.push([a, nodes[j]]);
        }
      });
  });
  return { nodes, links };
}

const WEB = buildWeb();

/** Six hops from you to the person you want to meet, arcing over the logo. */
const CHAIN: P[] = [
  { x: 34, y: 640 },
  { x: 58, y: 520 },
  { x: 40, y: 380 },
  { x: 96, y: 236 },
  { x: 214, y: 132 },
  { x: 330, y: 196 },
  { x: 356, y: 330 },
];

/** Splash texture: a gold glow behind the mark over a faint network of connections. */
export function SplashBackdrop() {
  const chain = `M${CHAIN.map((p) => `${p.x} ${p.y}`).join(' L')}`;
  return (
    <Svg style={StyleSheet.absoluteFill} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" pointerEvents="none">
      <Defs>
        <RadialGradient id="glow" cx="50%" cy="40%" r="55%">
          <Stop offset="0" stopColor={colors.gold} stopOpacity={0.16} />
          <Stop offset="0.55" stopColor={colors.gold} stopOpacity={0.04} />
          <Stop offset="1" stopColor={colors.gold} stopOpacity={0} />
        </RadialGradient>
        <LinearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0.62" stopColor={colors.bg} stopOpacity={0} />
          <Stop offset="0.9" stopColor={colors.bg} stopOpacity={0.95} />
        </LinearGradient>
      </Defs>

      <Rect width={W} height={H} fill="url(#glow)" />

      {WEB.links.map(([a, b], i) => (
        <Line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={alpha(colors.text, 0.06)} strokeWidth={1} />
      ))}
      {WEB.nodes.map((n, i) => (
        <Circle key={i} cx={n.x} cy={n.y} r={i % 3 === 0 ? 2.2 : 1.4} fill={alpha(colors.text, i % 3 === 0 ? 0.2 : 0.12)} />
      ))}

      <Path d={chain} stroke={alpha(colors.gold, 0.28)} strokeWidth={1.2} strokeDasharray="3 5" fill="none" />
      {CHAIN.map((p, i) => (
        <Circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i === 0 || i === CHAIN.length - 1 ? 3.6 : 2.4}
          fill={alpha(colors.gold, i === 0 || i === CHAIN.length - 1 ? 0.7 : 0.4)}
        />
      ))}

      <Rect width={W} height={H} fill="url(#floor)" />
    </Svg>
  );
}
