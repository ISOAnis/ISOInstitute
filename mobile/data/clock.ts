import { DEMO_NOW } from './db';

/** Current time. Pinned to the demo date until there is a backend. */
export function now(): Date {
  return new Date(DEMO_NOW);
}

export function hoursUntil(iso: string, from: Date = now()): number {
  return (new Date(iso).getTime() - from.getTime()) / 3_600_000;
}
