import type { Coach } from './types';
import { rules } from './db';

/** Players per ISO, and the confirmed minimum for it to run. */
export const SEAT_RANGE = { min: rules.minSeats, max: rules.maxSeats } as const;
export const ROOKIE_ISOS = rules.rookieIsos;
export const ACTIVE_WINDOW_DAYS = rules.activeWindowDays;

/** Rookie until the first three ISOs are done. */
export const isRookie = (coach: Pick<Coach, 'isosHosted'>) => coach.isosHosted < rules.rookieIsos;
