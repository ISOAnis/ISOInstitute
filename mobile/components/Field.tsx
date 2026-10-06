import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { colors, fonts, radius } from '@/theme';

import { Text } from './Text';

/** Labeled text input. */
export function Field({ label, multiline, style, ...rest }: TextInputProps & { label?: string }) {
  return (
    <View style={styles.wrap}>
      {label ? <Text variant="section">{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textMeta}
        selectionColor={colors.gold}
        multiline={multiline}
        accessibilityLabel={label ?? rest.placeholder}
        {...rest}
        style={[styles.input, multiline && styles.multi, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  input: {
    minHeight: 50,
    borderRadius: radius.lg,
    backgroundColor: colors.surface2,
    paddingHorizontal: 16,
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 16,
  },
  multi: { minHeight: 92, paddingTop: 12, textAlignVertical: 'top' },
});
