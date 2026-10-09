import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, Icon, Screen, Text, TopBar, type IconName } from '@/components';
import { getCoachIdCheck, useData, type IdCheck } from '@/data';
import { ApplyProgress } from '@/features/apply/ApplyProgress';
import { useApplyContinue } from '@/features/apply/steps';
import { dayLabel } from '@/lib/format';
import { useAppStore } from '@/store';
import { colors, fonts, radius, statusColors } from '@/theme';

type Shot = 'id' | 'selfie';

/** Opens the camera (front for the selfie). Falls back to the library where there's no camera, like a simulator. */
async function capture(shot: Shot): Promise<string | null> {
  const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.6, exif: false };
  try {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) throw new Error('Allow camera access in Settings to verify your ID.');
    const result = await ImagePicker.launchCameraAsync({
      ...opts,
      cameraType: shot === 'selfie' ? ImagePicker.CameraType.front : ImagePicker.CameraType.back,
    });
    return result.canceled ? null : (result.assets[0]?.uri ?? null);
  } catch (e) {
    if ((e as Error).message.startsWith('Allow camera')) throw e;
    const result = await ImagePicker.launchImageLibraryAsync(opts);
    return result.canceled ? null : (result.assets[0]?.uri ?? null);
  }
}

/** Step 8: ID photo plus a selfie, checked by the verification provider. ISO keeps the result, never the images. */
export default function ApplyVerify() {
  const { data: saved, loading } = useData(getCoachIdCheck, []);
  const verifyCoachId = useAppStore((s) => s.verifyCoachId);
  const goNext = useApplyContinue('extras');

  const [check, setCheck] = useState<IdCheck | null | undefined>(undefined);
  const [idPhoto, setIdPhoto] = useState<string>();
  const [selfie, setSelfie] = useState<string>();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && check === undefined) setCheck(saved ?? null);
  }, [loading, saved, check]);

  if (check === undefined) return <Screen>{null}</Screen>;

  const take = async (shot: Shot) => {
    setError('');
    try {
      const uri = await capture(shot);
      if (uri) (shot === 'id' ? setIdPhoto : setSelfie)(uri);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const verify = async () => {
    if (!idPhoto || !selfie) return setError('Add both photos first.');
    setChecking(true);
    setError('');
    try {
      const result = await verifyCoachId({ idPhotoUri: idPhoto, selfieUri: selfie });
      setCheck(result);
      if (result.status === 'failed') setError('We couldn’t match your ID to your selfie. Retake both in good light and try again.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIdPhoto(undefined);
      setSelfie(undefined);
      setChecking(false);
    }
  };

  const passed = check && check.status !== 'failed';

  return (
    <Screen>
      <TopBar onBack={() => router.back()} />
      <ApplyProgress step="verify" />

      <View style={styles.group}>
        <Text variant="titleLg">Verify your ID</Text>
        <Text variant="subtitle">A photo of your government ID and a quick selfie. Players meet you in person, so every coach is verified.</Text>
      </View>

      {passed ? (
        <Card style={styles.result}>
          <View style={styles.resultIcon}>
            <Icon name="shieldCheck" size={28} color={statusColors.good} />
          </View>
          <View style={styles.flex}>
            <Text variant="bodyStrong">{check.status === 'verified' ? 'ID verified' : 'ID check in review'}</Text>
            <Text variant="caption">
              {check.status === 'verified'
                ? `Checked ${dayLabel(check.checkedAt).replace('Today', 'today')}. You’re set for this step.`
                : 'Our verification partner is taking a closer look. You can keep going.'}
            </Text>
          </View>
        </Card>
      ) : (
        <>
          <ShotTile
            icon="idCard"
            title="Government ID"
            sub="Driver’s license, state ID, or passport. All four corners in frame."
            uri={idPhoto}
            onPress={() => take('id')}
          />
          <ShotTile icon="user" title="Selfie" sub="Just your face, good light, no hat or sunglasses." uri={selfie} onPress={() => take('selfie')} />
        </>
      )}

      <View style={styles.note}>
        <Icon name="lock" size={20} color={colors.gold} />
        <Text variant="caption" style={styles.flex}>
          ISO never keeps a copy of your ID or selfie. Our verification partner checks them, and we only save whether it passed.
        </Text>
      </View>

      {error ? (
        <Text variant="caption" color={statusColors.bad}>
          {error}
        </Text>
      ) : null}

      {passed ? (
        <Button label="Continue" height={52} onPress={goNext} />
      ) : (
        <Button label={checking ? 'Checking your ID…' : 'Verify my ID'} height={52} disabled={checking || !idPhoto || !selfie} onPress={verify} />
      )}
    </Screen>
  );
}

function ShotTile({ icon, title, sub, uri, onPress }: { icon: IconName; title: string; sub: string; uri?: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={uri ? `Retake ${title}` : `Take ${title}`}
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
    >
      <View style={[styles.thumb, !uri && styles.thumbEmpty]}>
        {uri ? <Image source={{ uri }} style={styles.thumbImg} /> : <Icon name={icon} size={28} color={colors.textSecondary} />}
      </View>
      <View style={styles.flex}>
        <Text variant="bodyStrong">{title}</Text>
        <Text variant="caption">{sub}</Text>
        <View style={styles.action}>
          <Icon name={uri ? 'check' : 'camera'} size={16} color={uri ? statusColors.good : colors.gold} strokeWidth={uri ? 2.6 : undefined} />
          <Text style={styles.actionLabel} color={uri ? statusColors.good : colors.gold}>
            {uri ? 'Added · Retake' : 'Take photo'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: { gap: 12 },
  flex: { flex: 1, gap: 4 },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: radius.card,
    backgroundColor: colors.surface1,
  },
  tilePressed: { backgroundColor: colors.surface2 },
  thumb: { width: 84, height: 64, borderRadius: radius.md, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  thumbEmpty: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.surface3 },
  thumbImg: { width: '100%', height: '100%' },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 28 },
  actionLabel: { fontFamily: fonts.bold, fontSize: 15 },
  result: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  resultIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  note: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
