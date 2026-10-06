import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet, Button, Chip, Field, Text } from '@/components';
import type { CancelReason } from '@/data';
import { colors, radius, statusColors } from '@/theme';

const REASONS: CancelReason[] = ['Sick', 'Work', 'Family', 'Emergency', 'Other'];

/**
 * "Give up my spot". Inside 24 hours a reason is required and the notice says
 * whether the late-cancel pass covers the hold.
 */
export function CancelSheet({
  visible,
  late,
  hasHold,
  lateCancelsLeft,
  coachFirstName,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  late: boolean;
  hasHold: boolean;
  lateCancelsLeft: number;
  coachFirstName: string;
  onClose: () => void;
  onConfirm: (reason?: CancelReason, note?: string) => void;
}) {
  const [reason, setReason] = useState<CancelReason | undefined>();
  const [note, setNote] = useState('');
  const needsReason = late && hasHold;
  const released = !needsReason || lateCancelsLeft > 0;

  const notice = !hasHold
    ? `${coachFirstName} hasn’t confirmed you yet, so there’s no hold to worry about.`
    : !late
      ? 'You’re more than 24 hours out, so your $5 hold is released.'
      : released
        ? `You have ${lateCancelsLeft} late cancel left this month, so your $5 hold will be released.`
        : 'You’ve used your late cancel this month, so the $5 hold goes to the Community Pool.';

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      eyebrow={needsReason ? 'Less than 24 hours out' : 'Give up your spot'}
      eyebrowColor={needsReason ? statusColors.bad : colors.textSecondary}
      title="Give up your spot?"
    >
      <Text variant="body" color={colors.textSecondary}>
        Your seat goes to the next player waiting. Let {coachFirstName} know what came up.
      </Text>
      {needsReason ? (
        <View style={styles.chips}>
          {REASONS.map((r) => (
            <Chip key={r} label={r} active={reason === r} onPress={() => setReason(r)} />
          ))}
        </View>
      ) : null}
      <Field
        label={`A note for ${coachFirstName} (optional)`}
        placeholder="Got called into a shift last minute. Would love to catch the next one."
        value={note}
        onChangeText={setNote}
        multiline
      />
      <View style={[styles.notice, { backgroundColor: released ? statusColors.goodTint : statusColors.badTint }]}>
        <Text variant="caption" color={released ? statusColors.good : statusColors.bad}>
          {notice}
        </Text>
      </View>
      <View style={styles.row}>
        <Button label="Keep my spot" height={52} style={styles.flex} onPress={onClose} />
        <Button
          label="Give it up"
          variant="outline"
          height={52}
          style={styles.flex}
          disabled={needsReason && !reason}
          onPress={() => onConfirm(reason, note.trim() || undefined)}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  notice: { padding: 14, borderRadius: radius.lg },
  row: { flexDirection: 'row', gap: 10, marginTop: 4 },
  flex: { flex: 1 },
});
