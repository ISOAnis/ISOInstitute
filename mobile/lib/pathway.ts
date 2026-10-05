import type { PathwayId } from '@/data';

/** "founder" → "Founder" */
export const pathwayName = (id: PathwayId) => id[0].toUpperCase() + id.slice(1);
