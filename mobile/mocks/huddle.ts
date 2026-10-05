import type { HuddleMessage } from '@/data/types';

export const huddleMessages: HuddleMessage[] = [
  {
    id: 'hm-pin',
    isoId: 'iso-mr-tue',
    userId: 'marcus',
    body: 'Back corner by the big window. Black ISO hoodie, laptop open.',
    pinned: true,
    createdAt: '2026-10-06T11:40:00',
  },
  {
    id: 'hm-1',
    isoId: 'iso-mr-tue',
    userId: 'marcus',
    body: 'Pulled up early, grabbed the back table. Order whatever you want, I’ll see you at noon.',
    pinned: false,
    createdAt: '2026-10-06T11:41:00',
  },
  {
    id: 'hm-2',
    isoId: 'iso-mr-tue',
    userId: 'jalen',
    body: 'On my way. Parking now',
    pinned: false,
    createdAt: '2026-10-06T11:52:00',
  },
  {
    id: 'hm-3',
    isoId: 'iso-mr-tue',
    userId: 'marcus',
    body: 'Bring the idea you’re working on. We’re pressure-testing it today.',
    pinned: false,
    createdAt: '2026-10-06T11:53:00',
  },
];

export const quickReplies = ['I’m here', 'On my way', 'Running 5 late', 'Can’t find you'];
