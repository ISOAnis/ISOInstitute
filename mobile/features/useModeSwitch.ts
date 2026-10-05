import { router } from 'expo-router';

import { getCoachRequests, useData, type Mode } from '@/data';
import { useAppStore } from '@/store';

/** Player/Coach toggle wiring: switches mode and jumps to that mode's home tab. */
export function useModeSwitch() {
  const mode = useAppStore((s) => s.mode);
  const coachId = useAppStore((s) => s.coachId);
  const revision = useAppStore((s) => s.revision);
  const setMode = useAppStore((s) => s.setMode);
  const requests = useData(async () => (coachId ? getCoachRequests(coachId) : []), [coachId, revision]).data ?? [];

  const onChange = (next: Mode) => {
    if (next === mode) return;
    setMode(next);
    router.replace(next === 'coach' ? '/manage' : '/map');
  };

  return { mode, onChange, badge: requests.length };
}
