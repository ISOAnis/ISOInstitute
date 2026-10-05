import { View } from 'react-native';

import type { PathwayId } from '@/data';
import { pathwayColors } from '@/theme';

/** Small solid dot in a pathway's color. Pass `color` for non-pathway dots (gold, muted). */
export function PathwayDot({ pathway, color, size = 8 }: { pathway?: PathwayId; color?: string; size?: number }) {
  const fill = color ?? (pathway ? pathwayColors[pathway].fill : undefined);
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: fill }} />;
}
