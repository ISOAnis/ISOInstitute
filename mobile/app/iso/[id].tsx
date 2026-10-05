import { router, useLocalSearchParams } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, Button, Card, CodeDisplay, Icon, IconButton, PathwayDot, Text, TopBar } from '@/components';
import {
  getHuddle,
  getIso,
  getRevealedVenue,
  getSeats,
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
import { colors, fonts, gutter, layout, pathwayColors, radius, statusColors, tracking } from '@/theme';

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
  const venue = useData(() => getRevealedVenue(id), [id, revision]).data;
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
          label="THE ISO"
          right={
            <IconButton
              icon="share"
              label="Share ISO"
              onPress={() => Share.share({ message: `${iso.title} with ${iso.coach.name} on ISO · ${dayLabel(iso.startsAt)} · ${iso.areaName}` })}
            />
          }
        />

        <View style={[styles.tag, { backgroundColor: p.tint, borderColor: p.fill }]}>
          <PathwayDot pathway={iso.pathway} />
          <Text style={styles.tagText} color={p.text}>
            {iso.pathway.toUpperCase()} PATHWAY
          </Text>
        </View>
        <Text variant="hero">{iso.title}</Text>

        <Pressable accessibilityRole="button" accessibilityLabel={`Coach card for ${iso.coach.name}`} onPress={() => router.push(`/coach/${iso.coachId}`)} style={styles.host}>
          <Avatar initials={iso.coach.initials} size={48} pathway={iso.pathway} />
          <View style={styles.flex}>
            <Text variant="bodyStrong">Hosted by {iso.coach.name}</Text>
            <Text variant="caption">
              Overall {iso.coach.overall} · {iso.coach.tier} · {iso.coach.isosHosted} ISOs hosted
            </Text>
          </View>
          <Text style={styles.link} color={colors.gold}>
            Coach card ›
          </Text>
        </Pressable>

        <Card>
          <View style={styles.detailRow}>
            <Icon name="clock" size={20} color={colors.gold} />
            <View>
              <Text variant="bodyStrong">{dayLabel(iso.startsAt, { long: true })}</Text>
              <Text variant="caption">{timeRange(iso.startsAt, iso.endsAt, { padded: true })}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Icon name={venue ? 'pin' : 'area'} size={20} color={colors.gold} />
            <View style={styles.flex}>
              <Text variant="bodyStrong">{iso.areaName}</Text>
              <Text variant="caption">{placeLine}</Text>
            </View>
          </View>
        </Card>

        {confirmed && mine?.checkinCode && mine.status === 'confirmed' ? (
          <CodeDisplay
            code={mine.checkinCode}
            caption={`Give this to ${first} at the table. It checks you in, releases your $5 hold, and counts toward your rank.`}
          />
        ) : null}

        {confirmed ? (
          <Card
            onPress={() => router.push(`/huddle/${iso.id}`)}
            accessibilityLabel="Open the Huddle"
            style={{ backgroundColor: p.tint, borderColor: p.line }}
          >
            <View style={styles.detailRow}>
              <Icon name="chat" size={22} color={p.text} />
              <View style={styles.flex}>
                <Text variant="bodyStrong">The Huddle</Text>
                <Text variant="caption" color={colors.textBody}>
                  {venue && pinned ? `${first}: “${pinned.body.split('.')[0]}.”` : 'Opens with the exact spot 24 hrs before'}
                </Text>
              </View>
              <Icon name="forward" size={18} color={colors.textMuted} />
            </View>
          </Card>
        ) : null}

        {iso.topics.length ? (
          <View style={styles.section}>
            <Text variant="section">WHAT WE’LL TALK ABOUT</Text>
            {iso.topics.map((t, i) => (
              <View key={t} style={styles.topic}>
                <Text style={styles.topicNum} color={colors.gold}>
                  {String(i + 1).padStart(2, '0')}
                </Text>
                <Text variant="body" style={styles.flex}>
                  {t}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        <SeatsSection iso={iso} seats={seats} mine={mine} myPathway={myPathway} />

        <View style={styles.section}>
          <Text variant="section">HOW IT WORKS</Text>
          <View style={styles.steps}>
            {STEPS.map((s, i) => (
              <View key={s} style={styles.step}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText} color={colors.gold}>
                    {i + 1}
                  </Text>
                </View>
                <Text variant="tiny" align="center" color={colors.textBody}>
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

function SeatsSection({ iso, seats, mine, myPathway }: { iso: IsoSummary; seats: Seat[]; mine?: MySeat; myPathway: string }) {
  const p = pathwayColors[iso.pathway];
  const others = seats.filter((s) => s.playerId !== 'me' && (s.status === 'confirmed' || s.status === 'checked_in'));
  const meIn = mine && (mine.status === 'requested' || mine.status === 'confirmed' || mine.status === 'checked_in');
  const open = Math.max(0, iso.seats - others.length - (meIn ? 1 : 0));
  const yourPath = myPathway === iso.pathway;

  return (
    <View style={styles.section}>
      <Text variant="section">AT THE TABLE · {iso.seats} SEATS</Text>
      <Text variant="caption">
        {yourPath
          ? `You’re ${pathwayName(iso.pathway)}, so you get first call on these seats.`
          : `${pathwayName(iso.pathway)} players get first call on seats. Every other pathway can request any seat still open.`}
      </Text>
      <View style={styles.seats}>
        {others.map((s) => (
          <View key={s.playerId} style={styles.seat}>
            <Avatar initials={s.playerInitials} size={52} pathway={s.playerPathway} />
            <Text variant="tiny" color={colors.textBody}>
              {s.playerName.split(' ')[0]} · {s.playerRank}
            </Text>
          </View>
        ))}
        {meIn ? (
          <View style={styles.seat}>
            <Avatar initials="YOU" size={52} ringColor={colors.gold} ink={colors.gold} />
            <Text variant="tiny" color={colors.gold}>
              {mine?.status === 'requested' ? 'Pending' : mine?.status === 'checked_in' ? 'Checked in' : 'Confirmed'}
            </Text>
          </View>
        ) : null}
        {Array.from({ length: open }, (_, i) => (
          <View key={`open-${i}`} style={styles.seat}>
            <View style={[styles.openSeat, { borderColor: p.line }]} />
            <Text variant="tiny">Open</Text>
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
    action = <Button label="Check in table" height={52} onPress={() => router.push(`/check-in/${iso.id}`)} />;
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
    line = 'This table is full';
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
        <Text variant="bodyStrong" numberOfLines={1}>
          {line}
        </Text>
        <Text variant="tiny" numberOfLines={2} color={error ? statusColors.bad : colors.textMuted}>
          {error || sub}
        </Text>
      </View>
      <View style={styles.actionBtn}>{action}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: gutter, gap: 18 },
  flex: { flex: 1 },
  tag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  tagText: { fontFamily: fonts.extrabold, fontSize: 11, letterSpacing: tracking(0.16, 11) },
  host: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56 },
  link: { fontFamily: fonts.extrabold, fontSize: 13 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { height: 1, backgroundColor: colors.border },
  section: { gap: 10 },
  topic: { flexDirection: 'row', gap: 12, alignItems: 'baseline' },
  topicNum: { fontFamily: fonts.display, fontSize: 22, width: 26 },
  seats: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  seat: { alignItems: 'center', gap: 6, minWidth: 64 },
  openSeat: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderStyle: 'dashed' },
  steps: { flexDirection: 'row', gap: 8 },
  step: { flex: 1, alignItems: 'center', gap: 6 },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderBox,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { fontFamily: fonts.display, fontSize: 18 },
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
    backgroundColor: colors.bgRaised,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  actionBtn: { minWidth: 150 },
});
