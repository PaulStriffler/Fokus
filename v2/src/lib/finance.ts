import { monthly } from "./format";
import type { TxItem, Goal } from "./store";

export type FinanceSummary = {
  incomeMonthly: number;
  expenseMonthly: number;
  cashflow: number;
  savingsRate: number; // %
  byCategory: { category: string; amount: number; pct: number }[];
};

export function summarize(income: TxItem[], expenses: TxItem[]): FinanceSummary {
  const incomeMonthly = income.reduce((s, t) => s + monthly(t.amount, t.freq), 0);
  const expenseMonthly = expenses.reduce((s, t) => s + monthly(t.amount, t.freq), 0);
  const cashflow = incomeMonthly - expenseMonthly;
  const savingsRate = incomeMonthly > 0 ? (cashflow / incomeMonthly) * 100 : 0;

  const catMap = new Map<string, number>();
  for (const t of expenses) {
    catMap.set(t.category, (catMap.get(t.category) || 0) + monthly(t.amount, t.freq));
  }
  const byCategory = [...catMap.entries()]
    .map(([category, amount]) => ({
      category,
      amount,
      pct: expenseMonthly > 0 ? (amount / expenseMonthly) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return { incomeMonthly, expenseMonthly, cashflow, savingsRate, byCategory };
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
