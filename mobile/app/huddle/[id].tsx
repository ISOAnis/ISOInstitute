import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, Icon, Text, TopBar } from '@/components';
import { getHuddle, getHuddleMembers, getIso, getQuickReplies, getRevealedVenue, sendHuddleMessage, useData } from '@/data';
import { clockTime, dayLabel, timeRange } from '@/lib/format';
import { useAppStore } from '@/store';
import { alpha, colors, fonts, gutter, pathwayColors, radius, raisedShadow } from '@/theme';

/** Group chat for the coach and confirmed players only. */
export default function Huddle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const revision = useAppStore((s) => s.revision);
  const mine = useAppStore((s) => s.seats[id]);
  const myCoachId = useAppStore((s) => s.coachId);
  const [tick, setTick] = useState(0);
  const [draft, setDraft] = useState('');

  const iso = useData(() => getIso(id), [id, revision]).data;
  const venue = useData(() => getRevealedVenue(id), [id, revision]).data;
  const members = useData(() => getHuddleMembers(id), [id, revision]).data ?? [];
  const messages = useData(() => getHuddle(id), [id, tick]).data ?? [];
  const replies = useData(getQuickReplies, []).data ?? [];

  if (!iso) return <View style={styles.root} />;

  const isHost = iso.coachId === myCoachId;
  const allowed = isHost || mine?.status === 'confirmed' || mine?.status === 'checked_in';
  const p = pathwayColors[iso.pathway];
  const first = iso.coach.firstName;
  const players = members.filter((m) => !m.isCoach);
  const pinned = messages.find((m) => m.pinned);
  const thread = messages.filter((m) => !m.pinned);
  const author = (userId: string) => members.find((m) => m.id === userId);

  const send = async (body: string) => {
    if (!body.trim()) return;
    await sendHuddleMessage(id, body);
    setDraft('');
    setTick((t) => t + 1);
  };

  if (!allowed) {
    return (
      <View style={[styles.root, styles.locked, { paddingTop: insets.top + 8 }]}>
        <TopBar label="The Huddle" />
        <View style={styles.lockedBody}>
          <Icon name="lock" size={32} color={colors.textSecondary} />
          <Text variant="sheetTitle" align="center">
            Huddle’s for the table
          </Text>
          <Text variant="subtitle" align="center">
            Only confirmed players and {first} can see it. Say “I got next” and it opens once you’re in.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TopBar
          label="The Huddle"
          right={
            <View style={styles.stack}>
              {members.slice(0, 4).map((m, i) => (
                <View key={m.id} style={{ marginLeft: i ? -10 : 0 }}>
                  <Avatar initials={m.initials} size={30} pathway={m.isCoach ? iso.pathway : undefined} ringColor={m.isCoach ? undefined : colors.bg} />
                </View>
              ))}
            </View>
          }
        />
        <Text variant="caption" align="center">
          {dayLabel(iso.startsAt)} {timeRange(iso.startsAt, iso.endsAt)} · {first} + {players.length} {players.length === 1 ? 'player' : 'players'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.thread}>
        <View style={[styles.pinned, { backgroundColor: alpha(p.fill, 0.12) }]}>
          <Text variant="eyebrow" color={p.text}>
            Pinned · find {first}
          </Text>
          {venue ? (
            <>
              <Text variant="bodyStrong">{venue.name}</Text>
              <Text variant="body">{pinned?.body ?? venue.notes}</Text>
              {venue.photo ? <Image source={venue.photo} style={styles.photo} resizeMode="cover" accessibilityLabel="Photo of the table" /> : null}
            </>
          ) : (
            <Text variant="body">The exact spot and where to find {first} drop here 24 hrs before.</Text>
          )}
        </View>

        <Text variant="caption" align="center" style={styles.divider}>
          {venue ? 'Huddle opened · spot revealed' : 'Huddle opened'}
        </Text>

        {thread.map((m) => {
          const who = author(m.userId);
          const me = m.userId === 'me' || who?.isMe || (isHost && m.userId === iso.coachId);
          return (
            <View key={m.id} style={[styles.msgRow, me && styles.msgRowMine]}>
              {!me ? <Avatar initials={who?.initials ?? '?'} size={30} pathway={who?.isCoach ? iso.pathway : undefined} /> : null}
              <View style={styles.msgCol}>
                {!me ? (
                  <Text variant="caption" color={colors.textSecondary}>
                    {who?.name ?? 'Player'} · {clockTime(m.createdAt)}
                  </Text>
                ) : null}
                <View style={[styles.bubble, me ? styles.bubbleMine : styles.bubbleTheirs]}>
                  <Text variant="body" color={colors.text}>
                    {m.body}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.replies}>
          {replies.map((r) => (
            <Pressable key={r} accessibilityRole="button" accessibilityLabel={r} onPress={() => send(r)} style={styles.reply}>
              <Text style={styles.replyText}>{r}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.inputRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Message the table"
            placeholderTextColor={colors.textMeta}
            selectionColor={colors.gold}
            style={styles.input}
            onSubmitEditing={() => send(draft)}
            returnKeyType="send"
            accessibilityLabel="Message"
          />
          <Pressable accessibilityRole="button" accessibilityLabel="Send" onPress={() => send(draft)} style={styles.send}>
            <Icon name="send" size={20} color={colors.onGold} strokeWidth={2.4} />
          </Pressable>
        </View>
        <Text variant="caption" align="center">
          Only confirmed players and {first}. Closes 2 hrs after the ISO. Messages are saved for safety.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  locked: { paddingHorizontal: gutter },
  lockedBody: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 12 },
  header: { paddingHorizontal: gutter, gap: 6, paddingBottom: 10 },
  stack: { flexDirection: 'row', minWidth: 44, justifyContent: 'flex-end' },
  thread: { padding: gutter, gap: 12 },
  pinned: { borderRadius: radius.card, padding: 18, gap: 6 },
  photo: {
    height: 150,
    width: '100%',
    marginTop: 8,
    borderRadius: radius.lg,
    backgroundColor: colors.surface2,
  },
  divider: { marginVertical: 4 },
  msgRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end', maxWidth: '86%' },
  msgRowMine: { alignSelf: 'flex-end' },
  msgCol: { gap: 4, flexShrink: 1 },
  bubble: { paddingHorizontal: 14, paddingVertical: 10 },
  bubbleMine: { backgroundColor: colors.surface3, borderRadius: 16, borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: colors.surface1, borderRadius: 16, borderBottomLeftRadius: 4 },
  composer: { paddingHorizontal: gutter, paddingTop: 10, gap: 10, backgroundColor: colors.surface1, ...raisedShadow },
  replies: { gap: 8 },
  reply: {
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    justifyContent: 'center',
  },
  replyText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: {
    flex: 1,
    minHeight: 46,
    borderRadius: 23,
    backgroundColor: colors.surface2,
    paddingHorizontal: 16,
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 16,
  },
  send: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
});
