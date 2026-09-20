import { dateKey, weekKeys } from "./format";
import type { Habit } from "./store";

type Log = Record<string, Record<string, boolean>>;

// Wochentage in Anzeige-Reihenfolge (Mo..So) mit getDay()-Wert.
export const WEEKDAYS: { day: number; short: string; long: string }[] = [
  { day: 1, short: "Mo", long: "Montag" },
  { day: 2, short: "Di", long: "Dienstag" },
  { day: 3, short: "Mi", long: "Mittwoch" },
  { day: 4, short: "Do", long: "Donnerstag" },
  { day: 5, short: "Fr", long: "Freitag" },
  { day: 6, short: "Sa", long: "Samstag" },
  { day: 0, short: "So", long: "Sonntag" },
];

export function isDone(log: Log, dk: string, habitId: string): boolean {
  return !!log[dk]?.[habitId];
}

/** Wie oft diese Woche erledigt (max. 1x pro Tag zählt). */
export function weekCount(log: Log, habitId: string): number {
  return weekKeys().reduce((n, k) => n + (log[k]?.[habitId] ? 1 : 0), 0);
}

/** Noch offen diese Woche. */
export function remaining(habit: Habit, log: Log): number {
  return Math.max(0, habit.weeklyTarget - weekCount(log, habit.id));
}

export function isWeekComplete(habit: Habit, log: Log): boolean {
  return weekCount(log, habit.id) >= habit.weeklyTarget;
}

/** Gesamt-Wochenfortschritt über alle Ziele (für den Ring). */
export function weekProgress(habits: Habit[], log: Log) {
  let done = 0;
  let total = 0;
  for (const h of habits) {
    total += h.weeklyTarget;
    done += Math.min(weekCount(log, h.id), h.weeklyTarget);
  }
  return { done, total, ratio: total ? done / total : 0 };
}

/** Erledigungen pro Wochentag (für die Mo–So-Leiste). */
export function dayCounts(log: Log): number[] {
  return weekKeys().map((k) => Object.values(log[k] || {}).filter(Boolean).length);
}

export const todayKey = () => dateKey();
