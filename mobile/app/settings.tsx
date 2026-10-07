import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Icon, ListRow, Screen, Text, Toggle, TopBar, type IconName } from '@/components';
import { getMatch, getProfileStatus, useData } from '@/data';
import { useAppStore } from '@/store';
import { colors, statusColors } from '@/theme';

/** Settings: matching preferences, your ISO profile, and the Playbook. */
export default function Settings() {
  const revision = useAppStore((s) => s.revision);
  const { setMatchPrefs, clearMatchSection } = useAppStore.getState();
  const data = useData(getMatch, [revision]).data;
  const status = useData(() => getProfileStatus('player'), [revision]).data;
  const [cleared, setCleared] = useState(false);

  if (!data || !status) return <Screen>{null}</Screen>;
  const { prefs, match } = data;

  const toggleSameGender = async (v: boolean) => {
    if (v && !match.gender) {
      router.push({ pathname: '/profile/[section]', params: { section: 'gender', who: 'player' } });
      return;
    }
    await setMatchPrefs({ sameGender: v });
  };

  const clearAll = async () => {
    await clearMatchSection('player', 'all');
    await setMatchPrefs({ similarBackground: false });
    setCleared(true);
  };

  return (
    <Screen>
      <TopBar onBack={() => router.back()} label="Settings" />

      <View style={styles.group}>
        <Text variant="section">Matching</Text>
        <Card>
          <Toggle
            title="Prefer same-gender ISOs"
            subtitle={
              match.gender
                ? 'Moves women’s and men’s ISOs and coaches who match you up in Recommended.'
                : 'Add your gender to turn this on. It’s only used for this.'
            }
            value={prefs.sameGender}
            onChange={toggleSameGender}
          />
          <Toggle
            title="Prefer coaches with a similar background"
            subtitle="Weighs where you’re from, first-gen, family, and faith more."
            value={prefs.similarBackground}
            onChange={(v) => setMatchPrefs({ similarBackground: v })}
          />
          <Text variant="caption">These boost suggestions. They never hide ISOs, and you can still say “I got next” on any of them.</Text>
        </Card>
      </View>

      <View style={styles.group}>
        <Text variant="section">Your profile</Text>
        <Card style={styles.list}>
          <Row icon="user" title="Profile basics" sub={status.basicsDone ? 'Name, neighborhood, where you’re at' : 'Not finished'} onPress={() => router.push('/profile/basics')} />
          <Row
            icon="sparkle"
            title="Refine your ISO profile"
            sub={`${status.done} of ${status.total} sections · private to you`}
            onPress={() => router.push({ pathname: '/profile/refine', params: { who: 'player' } })}
            divider
          />
          {status.done ? (
            <ListRow divider onPress={clearAll} accessibilityLabel="Clear my matching answers">
              <Icon name="close" size={18} color={statusColors.bad} />
              <Text variant="bodyStrong" color={statusColors.bad} style={styles.flex}>
                Clear my matching answers
              </Text>
            </ListRow>
          ) : null}
        </Card>
        {cleared ? <Text variant="caption">Cleared. Suggestions are back to your pathway only.</Text> : null}
      </View>

      <View style={styles.group}>
        <Text variant="section">More</Text>
        <Card style={styles.list}>
          <Row icon="book" title="Playbook" sub="Mission, lingo, ranks, and Overall" onPress={() => router.push('/playbook')} />
        </Card>
      </View>
    </Screen>
  );
}

function Row({ icon, title, sub, onPress, divider }: { icon: IconName; title: string; sub: string; onPress: () => void; divider?: boolean }) {
  return (
    <ListRow divider={divider} onPress={onPress} accessibilityLabel={title}>
      <Icon name={icon} size={20} color={colors.textSecondary} />
      <View style={styles.flex}>
        <Text variant="bodyStrong">{title}</Text>
        <Text variant="caption">{sub}</Text>
      </View>
      <Icon name="forward" size={16} color={colors.textSecondary} />
    </ListRow>
  );
}

const styles = StyleSheet.create({
  group: { gap: 12 },
  flex: { flex: 1, gap: 2 },
  list: { paddingVertical: 0, gap: 0, overflow: 'hidden' },
});
