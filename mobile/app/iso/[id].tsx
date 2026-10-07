import { router, useLocalSearchParams } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Image, Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, Button, Card, CodeDisplay, Icon, IconButton, Text, TopBar } from '@/components';
import {
  getHuddle,
  getIso,
  getNamesVisible,
  getRevealedVenue,
  getSeats,
  getTablePhoto,
  isLateCancel,
  useData,
  type CancelResult,
  type IsoSummary,
  type Seat,
} from '@/data';
import { CancelSheet } from '@/features/iso/CancelSheet';
import { HoldSheet } from '@/features/iso/HoldSheet';
import { dayLabel, timeRange } from '@/lib/format';
import { pathwayName } from '@/lib/pathway';
import { useAppStore, type MySeat } from '@/store';
import { alpha, colors, fonts, gutter, layout, pathwayColors, radius, raisedShadow, statusColors } from '@/theme';

const STEPS = ['Say “I got next”', 'Coach confirms', 'Spot revealed', 'Give your code, rank up'];
const MONTH = new Intl.DateTimeFormat('en-US', { month: 'long' });

export default function IsoDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const revision = useAppStore((s) => s.revision);
  const myPathway = useAppStore((s) => s.pathway);
  const myCoachId = useAppStore((s) => s.coachId);
  const lateCancelsLeft = useAppStore((s) => s.lateCancelsLeft);
  const mine = useAppStore((s) => s.seats[id]);
  const { gotNext, giveUpSeat } = useAppStore.getState();

  const iso = useData(() => getIso(id), [id, revision]).data;
  const seats = useData(() => getSeats(id), [id, revision]).data ?? [];
  const namesOn = useData(() => getNamesVisible(id), [id, revision]).data ?? false;
  const venue = useData(() => getRevealedVenue(id), [id, revision]).data;
  const table = useData(() => getTablePhoto(id), [id, revision]).data;
  const pinned = (useData(() => getHuddle(id), [id, revision]).data ?? []).find((m) => m.pinned);
  const late = useData(() => isLateCancel(id), [id]).data ?? false;

  const [sheet, setSheet] = useState<'hold' | 'cancel' | null>(null);
  const [busy, setBusy] = useState(false);
  const [lastCancel, setLastCancel] = useState<CancelResult | null>(null);
  const [error, setError] = useState('');

  if (!iso) return <View style={styles.root} />;

  const p = pathwayColors[iso.pathway];
  const first = iso.coach.firstName;
  const hosting = iso.coachId === myCoachId;
  const active = mine && (mine.status === 'requested' || mine.status === 'confirmed' || mine.status === 'checked_in');
  const confirmed = mine?.status === 'confirmed' || mine?.status === 'checked_in';

  const placeLine = venue
    ? `${venue.name} · ${venue.notes}`
    : confirmed
      ? 'Exact spot is in the Huddle, 24 hrs before'
      : 'Exact spot shared once you’re confirmed';

  const onConfirmHold = async () => {
    setBusy(true);
    setError('');
    try {
      await gotNext(id);
      setLastCancel(null);
      setSheet(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const onCancel = async (reason?: Parameters<typeof giveUpSeat>[1], note?: string) => {
    try {
      setLastCancel(await giveUpSeat(id, reason, note));
      setSheet(null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 8, paddingBottom: layout.actionBarHeight + insets.bottom + 24 }]}>
        <TopBar
          label="The ISO"
          right={
            <IconButton
              icon="share"
              label="Share ISO"
              onPress={() => Share.share({ message: `${iso.title} with ${iso.coach.name} on ISO · ${dayLabel(iso.startsAt)} · ${iso.areaName}` })}
            />
          }
        />

        {table ? (
          <View style={styles.photo} accessible accessibilityLabel={table.revealed ? 'Photo of your spot' : 'Spot photo, revealed 24 hrs before'}>
            <Image source={table.photo} style={styles.photoImg} resizeMode="cover" blurRadius={table.revealed ? 0 : 18} />
            {table.revealed ? null : (
              <View style={styles.photoVeil}>
                <Icon name="lock" size={18} color={colors.text} />
                <Text variant="caption" color={colors.text} style={styles.bold}>
                  Your spot shows up 24 hrs before
                </Text>
              </View>
            )}
          </View>
        ) : null}

        <View style={styles.headGroup}>
          <View style={[styles.tag, { backgroundColor: alpha(p.fill, 0.12) }]}>
            <Icon name={iso.pathway} size={15} color={pathwayColors[iso.pathway].text} />
            <Text variant="caption" color={p.text} style={styles.bold}>
              {pathwayName(iso.pathway)} pathway
            </Text>
          </View>
          <Text variant="hero">{iso.title}</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Coach card for ${iso.coach.name}`}
            onPress={() => router.push(`/coach/${iso.coachId}`)}
            style={styles.host}
          >
            <Avatar initials={iso.coach.initials} photo={iso.coach.photo} size={48} pathway={iso.pathway} />
            <View style={styles.flex}>
              <Text variant="bodyStrong">Hosted by {iso.coach.name}</Text>
              <Text variant="caption">
                Overall {iso.coach.overall} · {iso.coach.tier} · {iso.coach.isosHosted} ISOs hosted
              </Text>
            </View>
            <Icon name="forward" size={18} color={colors.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.cards}>
          <Card>
            <View style={styles.detailRow}>
              <Icon name="clock" size={20} color={colors.textSecondary} />
              <View>
                <Text variant="bodyStrong">{dayLabel(iso.startsAt, { long: true })}</Text>
                <Text variant="caption">{timeRange(iso.startsAt, iso.endsAt, { padded: true })}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Icon name={venue ? 'pin' : 'area'} size={20} color={colors.textSecondary} />
              <View style={styles.flex}>
                <Text variant="bodyStrong">{iso.areaName}</Text>
                <Text variant="caption">{placeLine}</Text>
              </View>
            </View>
          </Card>

          {confirmed && mine?.checkinCode && mine.status === 'confirmed' ? (
            <CodeDisplay
              code={mine.checkinCode}
              caption={`Give this to ${first} when you pull up. It checks you in, releases your $5 hold, and counts toward your rank.`}
            />
          ) : null}

          {confirmed ? (
            <Card onPress={() => router.push(`/huddle/${iso.id}`)} accessibilityLabel="Open the Huddle" style={{ backgroundColor: alpha(p.fill, 0.12) }}>
              <View style={styles.detailRow}>
                <Icon name="chat" size={22} color={p.text} />
                <View style={styles.flex}>
                  <Text variant="bodyStrong">The Huddle</Text>
                  <Text variant="caption" color={colors.text}>
                    {venue && pinned
                      ? `${first}: “${pinned.body.split('.')[0]}.”`
                      : namesOn
                        ? 'Opens with the exact spot 24 hrs before'
                        : 'Spot and who’s in drop 24 hrs before'}
                  </Text>
                </View>
                <Icon name="forward" size={18} color={colors.textSecondary} />
              </View>
            </Card>
          ) : null}
        </View>

        {iso.topics.length ? (
          <View style={styles.section}>
            <Text variant="section">What we’ll talk about</Text>
            {iso.topics.map((t, i) => (
              <View key={t} style={styles.topic}>
                <Text style={styles.topicNum} color={colors.textSecondary}>
                  {i + 1}
                </Text>
                <Text variant="body" style={styles.flex}>
                  {t}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        <SeatsSection iso={iso} seats={seats} mine={mine} myPathway={myPathway} namesOn={namesOn} />

        <View style={styles.section}>
          <Text variant="section">How it works</Text>
          <View style={styles.steps}>
            {STEPS.map((s, i) => (
              <View key={s} style={styles.step}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>{i + 1}</Text>
                </View>
                <Text variant="caption" align="center" color={colors.text}>
                  {s}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <ActionBar
        iso={iso}
        mine={mine}
        hosting={hosting}
        active={Boolean(active)}
        lastCancel={lastCancel}
        error={error}
        bottomInset={insets.bottom}
        onGotNext={() => setSheet('hold')}
        onGiveUp={() => setSheet('cancel')}
      />

      <HoldSheet visible={sheet === 'hold'} busy={busy} onClose={() => setSheet(null)} onConfirm={onConfirmHold} />
      <CancelSheet
        key={sheet === 'cancel' ? 'open' : 'closed'}
        visible={sheet === 'cancel'}
        late={late}
        hasHold={mine?.status === 'confirmed'}
        lateCancelsLeft={lateCancelsLeft}
        coachFirstName={first}
        onClose={() => setSheet(null)}
        onConfirm={onCancel}
      />
    </View>
  );
}

function SeatsSection({ iso, seats, mine, myPathway, namesOn }: { iso: IsoSummary; seats: Seat[]; mine?: MySeat; myPathway: string; namesOn: boolean }) {
  const p = pathwayColors[iso.pathway];
  const taken = seats.filter((s) => s.status === 'confirmed' || s.status === 'checked_in');
  const others = taken.filter((s) => s.playerId !== 'me' && s.playerName);
  const hidden = namesOn ? 0 : taken.filter((s) => s.playerId !== 'me').length;
  const meIn = mine && (mine.status === 'requested' || mine.status === 'confirmed' || mine.status === 'checked_in');
  const open = Math.max(0, iso.seats - taken.length - (mine?.status === 'requested' ? 1 : 0));
  const yourPath = myPathway === iso.pathway;
  const inIso = mine?.status === 'confirmed' || mine?.status === 'checked_in';

  const caption = namesOn
    ? yourPath
      ? `You’re ${pathwayName(iso.pathway)}, so you get first call on these seats.`
      : `${pathwayName(iso.pathway)} players get first call on seats. Every other pathway can request any seat still open.`
    : inIso
      ? 'Who else is coming drops 24 hrs before. Privacy first.'
      : 'Seat count only. Names stay private unless you’re in, and only 24 hrs before.';

  return (
    <View style={styles.section}>
      <Text variant="section">
        Seats · {iso.seatsTaken} of {iso.seats} taken
      </Text>
      <Text variant="caption">{caption}</Text>
      <View style={styles.seats}>
        {others.map((s) => (
          <View key={s.playerId} style={styles.seat}>
            <Avatar initials={s.playerInitials} size={52} pathway={s.playerPathway} />
            <Text variant="caption" color={colors.text}>
              {s.playerName.split(' ')[0]} · {s.playerRank}
            </Text>
          </View>
        ))}
        {Array.from({ length: hidden }, (_, i) => (
          <View key={`taken-${i}`} style={styles.seat}>
            <View style={styles.takenSeat} />
            <Text variant="caption">Taken</Text>
          </View>
        ))}
        {meIn ? (
          <View style={styles.seat}>
            <Avatar initials="You" size={52} ringColor={colors.text} />
            <Text variant="caption" color={colors.text} style={styles.bold}>
              {mine?.status === 'requested' ? 'Pending' : mine?.status === 'checked_in' ? 'Checked in' : 'Confirmed'}
            </Text>
          </View>
        ) : null}
        {Array.from({ length: open }, (_, i) => (
          <View key={`open-${i}`} style={styles.seat}>
            <View style={[styles.openSeat, { borderColor: alpha(p.fill, 0.55) }]} />
            <Text variant="caption">Open</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ActionBar({
  iso,
  mine,
  hosting,
  active,
  lastCancel,
  error,
  bottomInset,
  onGotNext,
  onGiveUp,
}: {
  iso: IsoSummary;
  mine?: MySeat;
  hosting: boolean;
  active: boolean;
  lastCancel: CancelResult | null;
  error: string;
  bottomInset: number;
  onGotNext: () => void;
  onGiveUp: () => void;
}) {
  const first = iso.coach.firstName;
  let line: string;
  let sub: string;
  let action: ReactNode;

  if (hosting) {
    line = 'You’re hosting this one';
    sub = `${iso.seatsTaken} of ${iso.seats} seats confirmed`;
    action = <Button label="Check in players" height={52} onPress={() => router.push(`/check-in/${iso.id}`)} />;
  } else if (mine?.status === 'checked_in') {
    line = 'Checked in · $5 released';
    sub = `+1 ${pathwayName(iso.pathway)} ISO toward your rank`;
    action = <Button label="Huddle" variant="outline" height={52} onPress={() => router.push(`/huddle/${iso.id}`)} />;
  } else if (mine?.status === 'confirmed') {
    line = 'You’re in · $5 held';
    sub = 'Check in with your code to release it';
    action = <Button label="Give up my spot" variant="outline" height={52} onPress={onGiveUp} />;
  } else if (mine?.status === 'requested') {
    line = 'You got next · request sent';
    sub = `${first} confirms each seat. The $5 hold goes on when you’re in.`;
    action = <Button label="Give up my spot" variant="outline" height={52} onPress={onGiveUp} />;
  } else if (!active && lastCancel) {
    line = lastCancel.holdReleased ? 'Spot released · $5 returned' : 'Spot released · $5 to the Community Pool';
    sub = lastCancel.usedLatePass ? `Late-cancel pass used for ${MONTH.format(new Date(iso.startsAt))}` : 'Thanks for the heads up';
    action = <Button label="I got next" height={52} disabled={iso.seatsOpen === 0} onPress={onGotNext} />;
  } else if (iso.seatsOpen === 0) {
    line = 'This ISO is full';
    sub = `Follow ${first} to catch the next one`;
    action = <Button label="Full" height={52} disabled />;
  } else {
    line = `${iso.seatsOpen} of ${iso.seats} seats open`;
    sub = iso.approveRequests ? `${first} approves each seat` : 'Seats confirm right away';
    action = <Button label="I got next" height={52} onPress={onGotNext} />;
  }

  return (
    <View style={[styles.actionBar, { paddingBottom: Math.max(bottomInset, 16) }]}>
      <View style={styles.flex}>
        <Text variant="bodyStrong">{line}</Text>
        <Text variant="caption" color={error ? statusColors.bad : colors.textSecondary}>
          {error || sub}
        </Text>
      </View>
      <View style={styles.actionBtn}>{action}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: gutter, gap: 28 },
  headGroup: { gap: 14 },
  cards: { gap: 12 },
  bold: { fontFamily: fonts.bold },
  photo: { height: 180, borderRadius: radius.card, overflow: 'hidden', backgroundColor: colors.surface1 },
  photoImg: { width: '100%', height: '100%' },
  photoVeil: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.scrim,
  },
  flex: { flex: 1 },
  tag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  host: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { height: 1, backgroundColor: colors.hairline },
  section: { gap: 12 },
  topic: { flexDirection: 'row', gap: 12, alignItems: 'baseline' },
  topicNum: { fontFamily: fonts.bold, fontSize: 15, width: 18 },
  seats: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  seat: { alignItems: 'center', gap: 6, minWidth: 64 },
  openSeat: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderStyle: 'dashed' },
  takenSeat: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.surface2 },
  steps: { flexDirection: 'row', gap: 8 },
  step: { flex: 1, alignItems: 'center', gap: 6 },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { fontFamily: fonts.bold, fontSize: 15 },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: layout.actionBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: gutter,
    paddingTop: 14,
    backgroundColor: colors.surface1,
    ...raisedShadow,
  },
  actionBtn: { minWidth: 150 },
});
