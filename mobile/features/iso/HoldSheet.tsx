import { StyleSheet, View } from 'react-native';

import { BottomSheet, Button, Text } from '@/components';
import { getSavedCard, useData } from '@/data';
import { colors, fonts, radius, statusColors } from '@/theme';

const bullets = [
  { color: statusColors.good, text: 'Check in when you pull up and the hold disappears.' },
  { color: statusColors.good, text: 'Cancel 24+ hours before and it’s released, no questions.' },
  { color: colors.textSecondary, text: 'Life happens: one late cancel a month is on us.' },
  { color: statusColors.bad, text: 'No-show? The $5 goes to the Community Pool, which funds free Court tickets for students.' },
];

/** "I got next" confirmation explaining the $5 authorization hold. */
export function HoldSheet({ visible, onClose, onConfirm, busy }: { visible: boolean; onClose: () => void; onConfirm: () => void; busy?: boolean }) {
  const card = useData(getSavedCard, []).data;
  return (
    <BottomSheet visible={visible} onClose={onClose} eyebrow="I got next" title="Save your seat with a $5 hold">
      <View style={styles.cardRow}>
        <View style={styles.flex}>
          <Text variant="bodyStrong">$5.00 hold</Text>
          <Text variant="caption">Card ending {card?.last4 ?? '••••'} · not a charge</Text>
        </View>
        <Text style={styles.change}>Change</Text>
      </View>
      <View style={styles.bullets}>
        {bullets.map((b) => (
          <View key={b.text} style={styles.bullet}>
            <View style={[styles.dot, { backgroundColor: b.color }]} />
            <Text variant="body" style={styles.flex}>
              {b.text}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.row}>
        <Button label="Not yet" variant="outline" height={52} style={styles.flex} onPress={onClose} />
        <Button label="Confirm" height={52} style={styles.flex} disabled={busy} onPress={onConfirm} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.surface2,
  },
  change: { fontFamily: fonts.bold, fontSize: 15, color: colors.text, textDecorationLine: 'underline' },
  bullets: { gap: 12, paddingVertical: 4 },
  bullet: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 8 },
  row: { flexDirection: 'row', gap: 10, marginTop: 4 },
  flex: { flex: 1 },
});
