import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components';
import { alpha, colors } from '@/theme';

import { DOT_BOX } from './IsoDot';

/** An ISO Partner spot on the coach map: a gold shield. Gold fill when selected. */
export function SpotPin({ selected }: { selected?: boolean }) {
  const size = selected ? 40 : 32;
  return (
    <View style={styles.box} pointerEvents="none">
      {selected ? <View style={[styles.glow, { width: size * 1.7, height: size * 1.7, borderRadius: size * 0.85 }]} /> : null}
      <View
        style={[
          styles.pin,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: selected ? colors.gold : colors.surface2 },
          { borderColor: selected ? colors.text : alpha(colors.gold, 0.6) },
        ]}
      >
        <Icon name="shieldCheck" size={selected ? 22 : 18} color={selected ? colors.onGold : colors.gold} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { width: DOT_BOX, height: DOT_BOX, alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute', backgroundColor: alpha(colors.gold, 0.25) },
  pin: { alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
});
