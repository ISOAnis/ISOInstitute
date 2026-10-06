import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Avatar, Button, Card, CoachCardFull, IconButton, ListRow, Screen, StatRow, StatTile, Text, TopBar } from '@/components';
import { getCoach, getCoachIsos, getCoachPosts, useData } from '@/data';
import { ago, dateBlock, seatsLabel, timeRange } from '@/lib/format';
import { useAppStore } from '@/store';
import { colors, fonts, pathwayColors, radius } from '@/theme';

export default function CoachCardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const revision = useAppStore((s) => s.revision);
  const following = useAppStore((s) => s.follows.includes(id));
  const isMe = useAppStore((s) => s.coachId === id);
  const toggleFollow = useAppStore((s) => s.toggleFollow);

  const coach = useData(() => getCoach(id), [id]).data;
  const posts = useData(() => getCoachPosts(id), [id]).data ?? [];
  const upcoming = useData(() => getCoachIsos(id), [id, revision]).data ?? [];

  if (!coach) return <Screen>{null}</Screen>;

  const moves = [
    { label: 'ISOs hosted', value: String(coach.isosHosted), pct: Math.min(100, (coach.isosHosted / 30) * 100) },
    { label: 'Player feedback', value: `${coach.rating} / 5`, pct: (coach.rating / 5) * 100 },
    { label: 'Show-up rate', value: `${coach.showUpRate}%`, pct: coach.showUpRate },
    { label: 'Events co-hosted', value: String(coach.eventsCoHosted), pct: Math.min(100, coach.eventsCoHosted * 30) },
  ];

  return (
    <Screen>
      <TopBar label="Coach card" right={isMe ? <IconButton icon="plus" label="Drop a pin" onPress={() => router.push('/drop-pin')} /> : undefined} />

      <CoachCardFull coach={coach} />

      <StatRow>
        <StatTile value={coach.isosHosted} label="ISOs hosted" />
        <StatTile value={coach.playersMet} label="Players met" />
        <StatTile value={coach.rating} label="Player rating" />
      </StatRow>

      {!isMe ? (
        <View style={styles.follow}>
          <Button
            label={following ? 'Following · pins on' : `Follow ${coach.firstName}`}
            variant={following ? 'outline' : 'primary'}
            icon={following ? 'bell' : undefined}
            height={52}
            onPress={() => toggleFollow(coach.id)}
          />
          <Text variant="caption" align="center">
            Followers get notified the moment {coach.firstName} drops a pin.
          </Text>
        </View>
      ) : null}

      {posts.length ? (
        <View style={styles.section}>
          <Text variant="section">Coach updates</Text>
          {posts.map((post) => (
            <Card key={post.id}>
              <View style={styles.postHead}>
                <Avatar initials={coach.initials} photo={coach.photo} size={36} pathway={coach.pathway} />
                <View>
                  <Text style={styles.postName}>{coach.name}</Text>
                  <Text variant="meta">{ago(post.createdAt)} · to followers</Text>
                </View>
              </View>
              <Text variant="body">{post.body}</Text>
              <Text variant="caption" color={colors.textSecondary}>
                {post.reactions} players reacted
              </Text>
            </Card>
          ))}
        </View>
      ) : null}

      <View style={styles.section}>
        <Text variant="section">Upcoming ISOs</Text>
        {upcoming.length ? (
          <Card style={styles.list}>
            {upcoming.map((iso, i) => {
              const d = dateBlock(iso.startsAt);
              return (
                <ListRow key={iso.id} divider={i > 0} onPress={() => router.push(`/iso/${iso.id}`)} accessibilityLabel={iso.title}>
                  <View style={styles.date}>
                    <Text style={styles.dow} color={colors.textSecondary}>
                      {d.dow}
                    </Text>
                    <Text style={styles.day}>{d.day}</Text>
                  </View>
                  <View style={styles.flex}>
                    <Text variant="bodyStrong">{iso.title}</Text>
                    <Text variant="caption">
                      {timeRange(iso.startsAt, iso.endsAt)} · {iso.areaName} · {seatsLabel(iso.seatsOpen, iso.seats)}
                    </Text>
                  </View>
                </ListRow>
              );
            })}
          </Card>
        ) : (
          <Text variant="caption">No pins up right now. Follow to hear the moment one drops.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text variant="section">What moves the Overall</Text>
        <Card>
          {moves.map((m) => (
            <View key={m.label} style={styles.move}>
              <View style={styles.moveHead}>
                <Text variant="caption" color={colors.text}>
                  {m.label}
                </Text>
                <Text variant="caption" color={colors.text} style={styles.bold}>
                  {m.value}
                </Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${m.pct}%`, backgroundColor: pathwayColors[coach.pathway].fill }]} />
              </View>
            </View>
          ))}
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bold: { fontFamily: fonts.extrabold },
  follow: { gap: 8 },
  section: { gap: 12 },
  list: { paddingVertical: 0, gap: 0, overflow: 'hidden' },
  postHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  postName: { fontFamily: fonts.bold, fontSize: 15, color: colors.text },
  date: { width: 46, alignItems: 'center' },
  dow: { fontFamily: fonts.semibold, fontSize: 13 },
  day: { fontFamily: fonts.extrabold, fontSize: 22, lineHeight: 28, color: colors.text },
  move: { gap: 6 },
  moveHead: { flexDirection: 'row', justifyContent: 'space-between' },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.surface2, overflow: 'hidden' },
  fill: { height: 6, borderRadius: radius.pill },
});
