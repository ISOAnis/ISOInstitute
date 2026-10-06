import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

import { fonts, metal } from '@/theme';

/** "ISO" in Bebas Neue with a brushed-silver gradient that matches the logo mark. */
export function Wordmark({ size = 30 }: { size?: number }) {
  const width = Math.ceil(size * 1.32);
  const height = Math.ceil(size * 1.02);
  return (
    <View accessible accessibilityRole="header" accessibilityLabel="ISO">
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="metal" x1="0" y1="0" x2="0.35" y2="1">
            {metal.map((color, i) => (
              <Stop key={i} offset={i / (metal.length - 1)} stopColor={color} />
            ))}
          </LinearGradient>
        </Defs>
        <SvgText x={width / 2} y={size * 0.9} textAnchor="middle" fontFamily={fonts.display} fontSize={size} letterSpacing={size * 0.06} fill="url(#metal)">
          ISO
        </SvgText>
      </Svg>
    </View>
  );
}
