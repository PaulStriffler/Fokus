"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { dateKey } from "./format";

export type Freq = "monatlich" | "jährlich" | "einmalig";

export type TxItem = {
  id: string;
  name: string;
  amount: number;
  freq: Freq;
  category: string;
};

export type Goal = {
  id: string;
  name: string;
  target: number;
  saved: number;
  monthly: number;
  color: string;
};

export type SleepEntry = {
  bed: string; // "23:30"
  wake: string; // "07:00"
  hours: number;
  quality: 1 | 2 | 3 | 4 | 5;
};

type State = {
  income: TxItem[];
  expenses: TxItem[];
  goals: Goal[];
  sleep: Record<string, SleepEntry>;

  addTx: (kind: "income" | "expenses", tx: Omit<TxItem, "id">) => void;
  updateTx: (kind: "income" | "expenses", id: string, patch: Partial<TxItem>) => void;
  removeTx: (kind: "income" | "expenses", id: string) => void;

  addGoal: (g: Omit<Goal, "id">) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  removeGoal: (id: string) => void;

  setSleep: (key: string, e: SleepEntry) => void;
};

const uid = () => Math.random().toString(36).slice(2, 10);

export const EXPENSE_CATEGORIES = [
  "Wohnen",
  "Auto",
  "Versicherung",
  "Abos",
  "Essen",
  "Fitness",
  "Sonstiges",
] as const;

export const INCOME_CATEGORIES = ["Gehalt", "Freelance", "Trading", "Sonstiges"] as const;

const seedIncome: TxItem[] = [
  { id: uid(), name: "Ausbildungsvergütung", amount: 900, freq: "monatlich", category: "Gehalt" },
  { id: uid(), name: "Freelance Website", amount: 600, freq: "monatlich", category: "Freelance" },
];

const seedExpenses: TxItem[] = [
  { id: uid(), name: "Handyvertrag", amount: 25, freq: "monatlich", category: "Abos" },
  { id: uid(), name: "Fitnessstudio", amount: 30, freq: "monatlich", category: "Fitness" },
  { id: uid(), name: "Sprit & Auto", amount: 150, freq: "monatlich", category: "Auto" },
  { id: uid(), name: "Essen & Einkauf", amount: 250, freq: "monatlich", category: "Essen" },
  { id: uid(), name: "Abos (Streaming, KI)", amount: 40, freq: "monatlich", category: "Abos" },
];

const seedGoals: Goal[] = [
  { id: uid(), name: "Notgroschen", target: 5000, saved: 1200, monthly: 200, color: "var(--green)" },
  { id: uid(), name: "Immobilien-Anzahlung", target: 40000, saved: 3500, monthly: 400, color: "var(--accent)" },
  { id: uid(), name: "Trading-Reserve", target: 3000, saved: 800, monthly: 100, color: "var(--gold)" },
];

export const useStore = create<State>()(
  persist(
    (set) => ({
      income: seedIncome,
      expenses: seedExpenses,
      goals: seedGoals,
      sleep: {},

      addTx: (kind, tx) => set((s) => ({ [kind]: [...s[kind], { ...tx, id: uid() }] }) as Partial<State>),
      updateTx: (kind, id, patch) =>
        set((s) => ({ [kind]: s[kind].map((t) => (t.id === id ? { ...t, ...patch } : t)) }) as Partial<State>),
      removeTx: (kind, id) => set((s) => ({ [kind]: s[kind].filter((t) => t.id !== id) }) as Partial<State>),

      addGoal: (g) => set((s) => ({ goals: [...s.goals, { ...g, id: uid() }] })),
      updateGoal: (id, patch) =>
        set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)) })),
      removeGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      setSleep: (key, e) => set((s) => ({ sleep: { ...s.sleep, [key]: e } })),
    }),
    { name: "fokus-store-v2", skipHydration: true }
  )
);

export const todayKey = () => dateKey();
