function toRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
}

/** Hex color at the given opacity, e.g. alpha('#e65100', 0.14). */
export function alpha(hex: string, opacity: number): string {
  const [r, g, b] = toRgb(hex);
  return `rgba(${r},${g},${b},${opacity})`;
}

/** Mixes `hex` into `base` by `amount` (0 to 1). Stands in for CSS color-mix. */
export function mix(hex: string, base: string, amount: number): string {
  const a = toRgb(hex);
  const b = toRgb(base);
  const c = a.map((v, i) => Math.round(v * amount + b[i] * (1 - amount)));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
