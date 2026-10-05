import type { IsoEvent } from '@/data/types';

/** "The Court": curated ISO events. Bracketed values are placeholders in the design. */
export const events: IsoEvent[] = [
  {
    id: 'ev-king-court',
    pathway: 'warrior',
    title: 'King of the Court',
    description:
      'A night of King of the Court with college and pro athletes: 1-on-1, winner holds the court. Whoever holds it longest takes the merch and the bragging rights. Panel with the athletes after.',
    monthLabel: 'NOV',
    venueLabel: '[Gym], Denver',
    ticketLabel: '[$ Price]',
    prize: 'Earned crown tee',
    sponsor: '[Local sponsor]',
    featured: true,
  },
  {
    id: 'ev-pitch-battle',
    pathway: 'founder',
    title: 'Pitch Battle',
    description: 'Pitch local owners. Best idea gets the crown.',
    monthLabel: 'DEC',
    venueLabel: 'Denver',
    ticketLabel: 'TBA',
    featured: false,
  },
  {
    id: 'ev-build-day',
    pathway: 'builder',
    title: 'Build Day',
    description: 'One-day build challenge, engineers judging.',
    monthLabel: 'JAN',
    venueLabel: 'Denver',
    ticketLabel: 'TBA',
    featured: false,
  },
  {
    id: 'ev-case-night',
    pathway: 'healer',
    title: 'Case Night',
    description: 'Work a case with people in medicine.',
    monthLabel: 'JAN',
    venueLabel: 'Denver',
    ticketLabel: 'TBA',
    featured: false,
  },
  {
    id: 'ev-make-your-case',
    pathway: 'reformer',
    title: 'Make Your Case',
    description: 'Debate night, then a panel on policy work.',
    monthLabel: 'TBA',
    venueLabel: 'Denver',
    ticketLabel: 'TBA',
    featured: false,
  },
];
