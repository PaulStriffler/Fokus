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
  date?: string; // dateKey — relevant für einmalige Einträge (welcher Monat)
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

export type Lesson = { id: string; title: string; note: string; done: boolean };
export type Module = { id: string; title: string; lessons: Lesson[] };
export type Course = { id: string; title: string; subtitle: string; color: string; modules: Module[] };

export type Book = {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
};

export type Priority = "niedrig" | "normal" | "hoch";
export type Todo = {
  id: string;
  text: string;
  done: boolean;
  due: string | null; // dateKey
  priority: Priority;
  created: number;
};

type State = {
  income: TxItem[];
  expenses: TxItem[];
  goals: Goal[];
  sleep: Record<string, SleepEntry>;

  courses: Course[];
  weeklyPagesGoal: number;
  reading: Record<string, number>; // dateKey -> pages read
  books: Book[];

  todos: Todo[];

  addTx: (kind: "income" | "expenses", tx: Omit<TxItem, "id">) => void;
  updateTx: (kind: "income" | "expenses", id: string, patch: Partial<TxItem>) => void;
  removeTx: (kind: "income" | "expenses", id: string) => void;

  addGoal: (g: Omit<Goal, "id">) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  removeGoal: (id: string) => void;

  setSleep: (key: string, e: SleepEntry) => void;

  toggleLesson: (courseId: string, moduleId: string, lessonId: string) => void;
  setLessonNote: (courseId: string, moduleId: string, lessonId: string, note: string) => void;

  setWeeklyPagesGoal: (n: number) => void;
  addPages: (key: string, pages: number) => void;
  addBook: (b: Omit<Book, "id">) => void;
  updateBook: (id: string, patch: Partial<Book>) => void;
  removeBook: (id: string) => void;

  addTodo: (t: Omit<Todo, "id" | "created" | "done">) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, patch: Partial<Todo>) => void;
  removeTodo: (id: string) => void;
};

const uid = () => Math.random().toString(36).slice(2, 10);

export const EXPENSE_CATEGORIES = [
  "Wohnen",
  "Auto",
  "Versicherung",
  "Abos",
  "Essen",
  "Fitness",
  "Investieren",
  "FTMO",
  "Freundin",
  "Aktivitäten",
  "Sonstiges",
] as const;

export const INCOME_CATEGORIES = ["Gehalt", "Freelance", "Trading", "Geschenk", "Sonstiges"] as const;

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

const lesson = (title: string): Lesson => ({ id: uid(), title, note: "", done: false });

const seedCourses: Course[] = [
  {
    id: uid(),
    title: "Immobilien-Basics",
    subtitle: "Kompakter Einstieg — nebenbei machbar",
    color: "var(--accent)",
    modules: [
      {
        id: uid(),
        title: "1 · Grundlagen",
        lessons: [
          lesson("Warum Immobilien? Vermögensaufbau & Hebel"),
          lesson("Eigennutzung vs. Kapitalanlage"),
          lesson("Cashflow einfach erklärt"),
        ],
      },
      {
        id: uid(),
        title: "2 · Finanzierung",
        lessons: [
          lesson("Eigenkapital & Kaufnebenkosten"),
          lesson("Annuitätendarlehen: Zins & Tilgung"),
          lesson("Zinsbindung & Anschlussfinanzierung"),
          lesson("KfW & Förderungen"),
        ],
      },
      {
        id: uid(),
        title: "3 · Objekt bewerten",
        lessons: [
          lesson("Lage-Check: Makro & Mikro"),
          lesson("Kaufpreisfaktor (Preis / Jahresmiete)"),
          lesson("Bruttorendite selbst rechnen"),
          lesson("Instandhaltung & Rücklagen"),
        ],
      },
      {
        id: uid(),
        title: "4 · Kaufprozess",
        lessons: [
          lesson("Exposé richtig lesen"),
          lesson("Besichtigungs-Checkliste"),
          lesson("Notar, Kaufvertrag & Grundbuch"),
        ],
      },
      {
        id: uid(),
        title: "5 · Steuern & danach",
        lessons: [
          lesson("AfA & Abschreibung"),
          lesson("Mieteinnahmen versteuern"),
          lesson("Vermietung: das Wichtigste"),
        ],
      },
    ],
  },
];

const seedBooks: Book[] = [
  { id: uid(), title: "The Daily Trading Coach", author: "Brett Steenbarger", totalPages: 350, currentPage: 0 },
];

export const useStore = create<State>()(
  persist(
    (set) => ({
      income: seedIncome,
      expenses: seedExpenses,
      goals: seedGoals,
      sleep: {},

      courses: seedCourses,
      weeklyPagesGoal: 100,
      reading: {},
      books: seedBooks,

      todos: [],

      addTx: (kind, tx) => set((s) => ({ [kind]: [...s[kind], { ...tx, id: uid() }] }) as Partial<State>),
      updateTx: (kind, id, patch) =>
        set((s) => ({ [kind]: s[kind].map((t) => (t.id === id ? { ...t, ...patch } : t)) }) as Partial<State>),
      removeTx: (kind, id) => set((s) => ({ [kind]: s[kind].filter((t) => t.id !== id) }) as Partial<State>),

      addGoal: (g) => set((s) => ({ goals: [...s.goals, { ...g, id: uid() }] })),
      updateGoal: (id, patch) =>
        set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)) })),
      removeGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      setSleep: (key, e) => set((s) => ({ sleep: { ...s.sleep, [key]: e } })),

      toggleLesson: (courseId, moduleId, lessonId) =>
        set((s) => ({
          courses: s.courses.map((c) =>
            c.id !== courseId
              ? c
              : {
                  ...c,
                  modules: c.modules.map((m) =>
                    m.id !== moduleId
                      ? m
                      : { ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, done: !l.done } : l)) }
                  ),
                }
          ),
        })),
      setLessonNote: (courseId, moduleId, lessonId, note) =>
        set((s) => ({
          courses: s.courses.map((c) =>
            c.id !== courseId
              ? c
              : {
                  ...c,
                  modules: c.modules.map((m) =>
                    m.id !== moduleId
                      ? m
                      : { ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, note } : l)) }
                  ),
                }
          ),
        })),

      setWeeklyPagesGoal: (n) => set({ weeklyPagesGoal: n }),
      addPages: (key, pages) =>
        set((s) => ({ reading: { ...s.reading, [key]: Math.max(0, (s.reading[key] || 0) + pages) } })),
      addBook: (b) => set((s) => ({ books: [...s.books, { ...b, id: uid() }] })),
      updateBook: (id, patch) =>
        set((s) => ({ books: s.books.map((b) => (b.id === id ? { ...b, ...patch } : b)) })),
      removeBook: (id) => set((s) => ({ books: s.books.filter((b) => b.id !== id) })),

      addTodo: (t) =>
        set((s) => ({ todos: [{ ...t, id: uid(), created: Date.now(), done: false }, ...s.todos] })),
      toggleTodo: (id) =>
        set((s) => ({ todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) })),
      updateTodo: (id, patch) =>
        set((s) => ({ todos: s.todos.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
      removeTodo: (id) => set((s) => ({ todos: s.todos.filter((t) => t.id !== id) })),
    }),
    {
      name: "fokus-store-v2",
      skipHydration: true,
      version: 2,
      migrate: (persisted) => persisted as State,
    }
  )
);

export const todayKey = () => dateKey();
