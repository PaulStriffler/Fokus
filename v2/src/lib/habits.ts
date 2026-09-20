import { dateKey } from "./format";
import type { Habit } from "./store";

type Log = Record<string, Record<string, boolean>>;

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
