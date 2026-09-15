import { monthly, dateKey } from "./format";
import type { TxItem, Goal } from "./store";

export const monthKey = (d: Date = new Date()) => dateKey(d).slice(0, 7); // "YYYY-MM"

export function monthLabel(d: Date = new Date()) {
  return d.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
}

/** Recurring-only monthly total (the "should earn / should spend" plan). */
export function planMonthly(items: TxItem[]): number {
  return items.reduce((s, t) => s + monthly(t.amount, t.freq), 0);
}

/** Actual for a given month = recurring + one-time entries dated in that month. */
export function actualForMonth(items: TxItem[], mk: string = monthKey()): number {
  return items.reduce((s, t) => {
    if (t.freq === "einmalig") return s + (t.date?.startsWith(mk) ? t.amount : 0);
    return s + monthly(t.amount, t.freq);
  }, 0);
}

export type MonthSummary = {
  earnedActual: number;
  earnedPlan: number;
  spentActual: number;
  spentPlan: number;
  leftover: number;
  byCategory: { category: string; amount: number; pct: number }[];
};

export function monthSummary(income: TxItem[], expenses: TxItem[], mk: string = monthKey()): MonthSummary {
  const earnedActual = actualForMonth(income, mk);
  const earnedPlan = planMonthly(income);
  const spentActual = actualForMonth(expenses, mk);
  const spentPlan = planMonthly(expenses);

  const catMap = new Map<string, number>();
  for (const t of expenses) {
    const amt = t.freq === "einmalig" ? (t.date?.startsWith(mk) ? t.amount : 0) : monthly(t.amount, t.freq);
    if (amt) catMap.set(t.category, (catMap.get(t.category) || 0) + amt);
  }
  const byCategory = [...catMap.entries()]
    .map(([category, amount]) => ({ category, amount, pct: spentActual > 0 ? (amount / spentActual) * 100 : 0 }))
    .sort((a, b) => b.amount - a.amount);

  return { earnedActual, earnedPlan, spentActual, spentPlan, leftover: earnedActual - spentActual, byCategory };
}

/** Months until a goal is reached given its monthly contribution. */
export function monthsToGoal(g: Goal): number | null {
  const remaining = g.target - g.saved;
  if (remaining <= 0) return 0;
  if (g.monthly <= 0) return null;
  return Math.ceil(remaining / g.monthly);
}

export function goalETA(g: Goal): string {
  const m = monthsToGoal(g);
  if (m === null) return "Keine Sparrate";
  if (m === 0) return "Erreicht 🎉";
  const d = new Date();
  d.setMonth(d.getMonth() + m);
  return d.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
}
