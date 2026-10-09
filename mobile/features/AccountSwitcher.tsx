import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Avatar, BottomSheet, Card, Icon, ListRow, Text } from '@/components';
import { getMe, getMyCoach, useData, type Mode } from '@/data';
import { pathwayName } from '@/lib/pathway';
import { useAppStore } from '@/store';
import { colors, pathwayColors } from '@/theme';

/** Where each account lands. */
export const ACCOUNT_HOME = { player: '/map', coach: '/spots' } as const;

/**
 * Instagram-style account switcher, opened by holding the Me tab. A coach has a
 * player account and a coach account; everyone else sees a way to add one.
 */
export function AccountSwitcher({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const mode = useAppStore((s) => s.mode);
  const coachStatus = useAppStore((s) => s.coachStatus);
  const revision = useAppStore((s) => s.revision);
  const setMode = useAppStore((s) => s.setMode);
  const me = useData(getMe, [revision]).data;
  const coach = useData(getMyCoach, [revision, coachStatus]).data;

  const go = (next: Mode) => {
    onClose();
    if (next === mode) return;
    setMode(next);
    router.replace(ACCOUNT_HOME[next]);
  };

  const addCoach = () => {
    onClose();
    router.push(coachStatus === 'applied' ? '/coach-review' : '/coach-cohorts');
  };

  if (!me) return null;

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Switch account">
      <Card style={styles.list}>
        <AccountRow
          initials={me.initials}
          pathway={me.pathway}
          name={me.name}
          sub={`${pathwayName(me.pathway)} player`}
          active={mode === 'player'}
          onPress={() => go('player')}
        />
        {coach ? (
          <AccountRow
            divider
            initials={coach.initials}
            photo={coach.photo}
            pathway={coach.pathway}
            name={coach.name}
            sub={`${pathwayName(coach.pathway)} coach`}
            active={mode === 'coach'}
            onPress={() => go('coach')}
          />
        ) : (
          <ListRow divider onPress={addCoach} accessibilityLabel={coachStatus === 'applied' ? 'Coach application in review' : 'Add a coach account'}>
            <View style={styles.add}>
              <Icon name="plus" size={20} color={colors.text} />
            </View>
            <View style={styles.flex}>
              <Text variant="bodyStrong">{coachStatus === 'applied' ? 'Coach account in review' : 'Add a coach account'}</Text>
              <Text variant="caption">{coachStatus === 'applied' ? 'See where your application stands' : 'Apply to coach on ISO'}</Text>
            </View>
          </ListRow>
        )}
      </Card>
    </BottomSheet>
  );
}

function AccountRow({
  initials,
  photo,
  pathway,
  name,
  sub,
  active,
  divider,
  onPress,
}: {
  initials: string;
  photo?: Parameters<typeof Avatar>[0]['photo'];
  pathway: Parameters<typeof Avatar>[0]['pathway'];
  name: string;
  sub: string;
  active: boolean;
  divider?: boolean;
  onPress: () => void;
}) {
  return (
    <ListRow divider={divider} onPress={onPress} accessibilityLabel={`${name}, ${sub}${active ? ', current account' : ''}`}>
      <Avatar initials={initials} photo={photo} size={44} pathway={pathway} />
      <View style={styles.flex}>
        <Text variant="bodyStrong">{name}</Text>
        <Text variant="caption" color={pathway ? pathwayColors[pathway].text : colors.textSecondary}>
          {sub}
        </Text>
      </View>
      {active ? <Icon name="check" size={20} color={colors.gold} /> : null}
    </ListRow>
  );
}

const styles = StyleSheet.create({
  list: { paddingVertical: 0, gap: 0, overflow: 'hidden' },
  flex: { flex: 1, gap: 2 },
  add: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
});
