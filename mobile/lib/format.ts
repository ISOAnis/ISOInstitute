import { now } from '@/data';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

function daysFromToday(d: Date): number {
  const a = now();
  const start = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.round((target - start) / 86_400_000);
}

/** "Tue Oct 6" */
export function shortDate(iso: string): string {
  const d = new Date(iso);
  return `${DAYS[d.getDay()]} ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/** "Today" for today, otherwise "Tue Oct 6". With `long`, "Tomorrow, Tue Oct 6". */
export function dayLabel(iso: string, opts: { long?: boolean } = {}): string {
  const d = new Date(iso);
  if (dayKey(d) === dayKey(now())) return 'Today';
  if (opts.long && daysFromToday(d) === 1) return `Tomorrow, ${shortDate(iso)}`;
  return shortDate(iso);
}

const clock = (d: Date) => {
  const h = d.getHours() % 12 || 12;
  const m = d.getMinutes();
  return m ? `${h}:${String(m).padStart(2, '0')}` : `${h}`;
};
const meridiem = (d: Date) => (d.getHours() < 12 ? 'AM' : 'PM');

/** "12–2 PM", "7:30–9 AM", "11 AM–1 PM". With `padded`, "12:00 – 2:00 PM". */
export function timeRange(startIso: string, endIso: string, opts: { padded?: boolean } = {}): string {
  const s = new Date(startIso);
  const e = new Date(endIso);
  if (opts.padded) {
    const full = (d: Date) => `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}`;
    const sm = meridiem(s) === meridiem(e) ? '' : ` ${meridiem(s)}`;
    return `${full(s)}${sm} – ${full(e)} ${meridiem(e)}`;
  }
  const sm = meridiem(s) === meridiem(e) ? '' : ` ${meridiem(s)}`;
  return `${clock(s)}${sm}–${clock(e)} ${meridiem(e)}`;
}

/** "6 PM", "7:30 AM" */
export function startTime(iso: string): string {
  const d = new Date(iso);
  return `${clock(d)} ${meridiem(d)}`;
}

/** "Tue Oct 6 · 12–2 PM" / "Today · 6–7 PM" */
export function whenLabel(startIso: string, endIso: string): string {
  return `${dayLabel(startIso)} · ${timeRange(startIso, endIso)}`;
}

/** "2 of 3 open" or "Full". */
export function seatsLabel(open: number, total: number): string {
  return open === 0 ? 'Full' : `${open} of ${total} open`;
}

/** "TUE" and "6" for date blocks. */
export function dateBlock(iso: string): { dow: string; day: string } {
  const d = new Date(iso);
  return { dow: DAYS[d.getDay()], day: String(d.getDate()) };
}

/** "2h", "3d" for post timestamps. */
export function ago(iso: string): string {
  const mins = Math.max(1, Math.round((now().getTime() - new Date(iso).getTime()) / 60_000));
  if (mins < 60) return `${mins}m`;
  const hours = Math.round(mins / 60);
  return hours < 24 ? `${hours}h` : `${Math.round(hours / 24)}d`;
}

/** "12:30 PM" / "9 am" / "14:00" → "12:30" in 24h, or null. */
export function parseClock(input: string): string | null {
  const m = input.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2] ?? 0);
  const ap = m[3]?.toLowerCase();
  if (min > 59 || h > 23 || (ap && (h < 1 || h > 12))) return null;
  if (ap === 'pm' && h < 12) h += 12;
  if (ap === 'am' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

/** Local YYYY-MM-DD. */
export function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** "11:41 AM" */
export function clockTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')} ${meridiem(d)}`;
}

/** "1 switch left this month" / "0 switches left until Nov 1" (switches reset on the 1st). */
export function switchesLeftLabel(left: number): string {
  if (left > 0) return `${left} ${left === 1 ? 'switch' : 'switches'} left this month`;
  const n = now();
  const reset = new Date(n.getFullYear(), n.getMonth() + 1, 1);
  return `0 switches left until ${MONTHS[reset.getMonth()]} ${reset.getDate()}`;
}

/** "13:30" → "1:30 PM" (the Drop a Pin time field format). */
export function clockLabel(hhmm: string): string {
  const h = Number(hhmm.slice(0, 2));
  const m = hhmm.slice(3, 5);
  return `${h % 12 || 12}:${m} ${h < 12 ? 'AM' : 'PM'}`;
}
