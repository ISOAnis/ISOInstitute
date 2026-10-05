import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon, Text } from '@/components';
import { getPathways, useData, type PathwayId } from '@/data';
import { OnboardingHeader } from '@/features/OnboardingHeader';
import { pathwayName } from '@/lib/pathway';
import { useAppStore } from '@/store';
import { colors, gutter, pathwayColors, radius } from '@/theme';

/** Onboard2: pick a pathway. Accents recolor live. */
export default function PathwayStep() {
  const insets = useSafeAreaInsets();
  const current = useAppStore((s) => s.pathway);
  const choosePathway = useAppStore((s) => s.choosePathway);
  const [picked, setPicked] = useState<PathwayId>(current);
  const pathways = useData(getPathways, []).data ?? [];
  const p = pathwayColors[picked];

  const lockIn = async () => {
    await choosePathway(picked, { initial: true });
    router.push('/onboarding/questions');
  };

  return (
    <View style={styles.root}>
      <OnboardingHeader step={2} accent={p.fill} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        <Text variant="titleLg">Pick your pathway</Text>
        <Text variant="subtitle">
          Your app takes on your pathway’s color. You get first call on seats at your pathway’s ISOs, and can still join any ISO with open seats.
        </Text>

        <View style={styles.list}>
          {pathways.map((path) => {
            const c = pathwayColors[path.id];
            const active = picked === path.id;
            return (
              <Pressable
                key={path.id}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`${path.name}, ${path.field}`}
                onPress={() => setPicked(path.id)}
                style={[styles.row, active ? { borderWidth: 2, borderColor: c.fill, backgroundColor: c.tint } : styles.rowIdle]}
              >
                <View style={[styles.bar, { backgroundColor: c.fill, opacity: active ? 1 : 0.55 }]} />
                <View style={styles.flex}>
                  <Text variant="pathwayName" color={active ? c.text : colors.textBody}>
                    {path.name}
                  </Text>
                  <Text variant="subtitle" color={active ? colors.textBody : colors.textMuted}>
                    {path.field}
                  </Text>
                </View>
                {active ? <Icon name="check" size={20} color={c.text} /> : null}
              </Pressable>
            );
          })}
        </View>

        <Text variant="caption">
          Commit to it. You can switch pathways twice a month, so your coaches and crew know where you’re headed.
        </Text>
        <Button label={`Lock in ${pathwayName(picked)}`} height={52} onPress={lockIn}>
          <View style={[styles.ctaDot, { backgroundColor: p.fill }]} />
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: gutter, gap: 14 },
  list: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16, borderRadius: radius.xl },
  rowIdle: { borderWidth: 1, borderColor: colors.borderChip, backgroundColor: colors.surface },
  bar: { width: 12, height: 40, borderRadius: 6 },
  flex: { flex: 1, gap: 2 },
  ctaDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: colors.bg },
});
