import { Pressable, StyleSheet } from 'react-native';

import { colors, TAP } from '@/theme';

import { Icon, type IconName } from './Icon';

/** 44pt round icon button used in headers (back, share, settings). */
export function IconButton({
  icon,
  label,
  onPress,
  color = colors.textBody,
}: {
  icon: IconName;
  label: string;
  onPress?: () => void;
  color?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [styles.btn, pressed && { backgroundColor: colors.surfaceHigh }]}
    >
      <Icon name={icon} size={20} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: TAP,
    height: TAP,
    borderRadius: TAP / 2,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
