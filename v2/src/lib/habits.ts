import { dateKey } from "./format";
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

/** Gilt die Aktivität an diesem Wochentag? (leere days = täglich) */
export function isForDay(habit: Habit, date: Date = new Date()): boolean {
  const days = habit.days ?? [];
  return days.length === 0 || days.includes(date.getDay());
}

export function habitsForDay(habits: Habit[], date: Date = new Date()): Habit[] {
  return habits.filter((h) => isForDay(h, date));
}

export function isDone(log: Log, dk: string, habitId: string): boolean {
  return !!log[dk]?.[habitId];
}

/** Consecutive days a habit was done, counting up to today (grace: today still open). */
export function habitStreak(log: Log, habitId: string, from: Date = new Date()): number {
  let streak = 0;
  const d = new Date(from);
  if (!isDone(log, dateKey(d), habitId)) d.setDate(d.getDate() - 1);
  while (isDone(log, dateKey(d), habitId)) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function todayProgress(habits: Habit[], log: Log, dk: string = dateKey()) {
  const done = habits.filter((h) => isDone(log, dk, h.id)).length;
  return { done, total: habits.length, ratio: habits.length ? done / habits.length : 0 };
}

/** Best current streak across all habits — for a headline "🔥 N". */
export function bestStreak(log: Log, habits: Habit[]): number {
  return habits.reduce((max, h) => Math.max(max, habitStreak(log, h.id)), 0);
}
