import { Redirect } from 'expo-router';

import { useAppStore } from '@/store';

export default function Gate() {
  const onboarded = useAppStore((s) => s.onboarded);
  const mode = useAppStore((s) => s.mode);
  if (!onboarded) return <Redirect href="/welcome" />;
  return <Redirect href={mode === 'coach' ? '/spots' : '/map'} />;
}
