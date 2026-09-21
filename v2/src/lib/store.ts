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
  lastDaily?: string; // dateKey — an welchem Tag zuletzt die Tagesrate zurückgelegt wurde
};

export type Haircut = {
  id: string;
  date: string; // dateKey
  client: string;
  amount: number;
  note?: string;
  created: number;
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

export type Habit = {
  id: string;
  title: string;
  color: string;
  icon: string; // key aus lib/icons
  weeklyTarget: number; // wie oft pro Woche (1-7)
  created: number;
  days?: number[]; // legacy — nicht mehr aktiv genutzt
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
  haircuts: Haircut[];

  habits: Habit[];
  habitLog: Record<string, Record<string, boolean>>; // dateKey -> habitId -> done
  northStar: string; // dein großes Ziel / Warum

  userName: string;
  focus: Record<string, { text: string; done: boolean }>; // dateKey -> die eine wichtigste Sache
  reflections: Record<string, { rating: number; note: string }>; // dateKey -> Abend-Check
  weeklySaveTarget: number; // Wochen-Sparziel in €
  weeklySaved: Record<string, number>; // weekKey (Montag-dateKey) -> gespart

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

  addHaircut: (h: Omit<Haircut, "id" | "created">) => void;
  addHaircuts: (list: Omit<Haircut, "id" | "created">[]) => void;
  updateHaircut: (id: string, patch: Partial<Haircut>) => void;
  removeHaircut: (id: string) => void;

  addHabit: (h: { title: string; color: string; icon: string; weeklyTarget: number }) => void;
  updateHabit: (id: string, patch: Partial<Habit>) => void;
  removeHabit: (id: string) => void;
  toggleHabit: (dateKey: string, habitId: string) => void;
  setNorthStar: (v: string) => void;

  setUserName: (v: string) => void;
  setFocus: (dateKey: string, text: string) => void;
  toggleFocusDone: (dateKey: string) => void;
  setReflection: (dateKey: string, r: { rating: number; note: string }) => void;
  setWeeklySaveTarget: (n: number) => void;
  setWeeklySaved: (weekKey: string, amount: number) => void;
  resetAll: () => void;
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

function makeSeedHabits(): Habit[] {
  const now = Date.now();
  return [
    { id: uid(), title: "Gym", color: "var(--orange)", icon: "dumbbell", weeklyTarget: 4, created: now },
    { id: uid(), title: "7–8 Std. Schlaf", color: "var(--indigo)", icon: "moon", weeklyTarget: 7, created: now },
    { id: uid(), title: "Gesunder Smoothie", color: "var(--mint)", icon: "smoothie", weeklyTarget: 4, created: now },
    { id: uid(), title: "Genug Wasser trinken", color: "var(--teal)", icon: "droplet", weeklyTarget: 7, created: now },
    { id: uid(), title: "Entries checken", color: "var(--green)", icon: "trending", weeklyTarget: 7, created: now },
    { id: uid(), title: "Markt-Analyse (Wochenvorbereitung)", color: "var(--accent)", icon: "brain", weeklyTarget: 1, created: now },
    { id: uid(), title: "10 Seiten lesen", color: "var(--purple)", icon: "book", weeklyTarget: 3, created: now },
    { id: uid(), title: "Academy-Lektion", color: "var(--pink)", icon: "graduation", weeklyTarget: 2, created: now },
    { id: uid(), title: "Immobilien recherchieren", color: "var(--gold)", icon: "briefcase", weeklyTarget: 1, created: now },
    { id: uid(), title: "Haare schneiden", color: "var(--red)", icon: "scissors", weeklyTarget: 4, created: now },
    { id: uid(), title: "Wochen-Sparen eintragen", color: "var(--gold)", icon: "wallet", weeklyTarget: 1, created: now },
  ];
}

const seedHabits: Habit[] = makeSeedHabits();

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
      haircuts: [],

      habits: seedHabits,
      habitLog: {},
      northStar: "",
      userName: "Paul",
      focus: {},
      reflections: {},
      weeklySaveTarget: 250,
      weeklySaved: {},

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

      addHaircut: (h) => set((s) => ({ haircuts: [{ ...h, id: uid(), created: Date.now() }, ...s.haircuts] })),
      addHaircuts: (list) =>
        set((s) => ({
          haircuts: [...list.map((h) => ({ ...h, id: uid(), created: Date.now() })), ...s.haircuts],
        })),
      updateHaircut: (id, patch) =>
        set((s) => ({ haircuts: s.haircuts.map((h) => (h.id === id ? { ...h, ...patch } : h)) })),
      removeHaircut: (id) => set((s) => ({ haircuts: s.haircuts.filter((h) => h.id !== id) })),

      addHabit: (h) =>
        set((s) => ({ habits: [...s.habits, { ...h, id: uid(), created: Date.now() }] })),
      updateHabit: (id, patch) =>
        set((s) => ({ habits: s.habits.map((h) => (h.id === id ? { ...h, ...patch } : h)) })),
      removeHabit: (id) => set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),
      toggleHabit: (dk, habitId) =>
        set((s) => {
          const day = { ...(s.habitLog[dk] || {}) };
          day[habitId] = !day[habitId];
          return { habitLog: { ...s.habitLog, [dk]: day } };
        }),
      setNorthStar: (v) => set({ northStar: v }),

      setUserName: (v) => set({ userName: v || "Ich" }),
      setFocus: (dk, text) =>
        set((s) => ({ focus: { ...s.focus, [dk]: { text, done: s.focus[dk]?.done ?? false } } })),
      toggleFocusDone: (dk) =>
        set((s) => ({
          focus: { ...s.focus, [dk]: { text: s.focus[dk]?.text ?? "", done: !s.focus[dk]?.done } },
        })),
      setReflection: (dk, r) => set((s) => ({ reflections: { ...s.reflections, [dk]: r } })),
      setWeeklySaveTarget: (n) => set({ weeklySaveTarget: Math.max(0, n) }),
      setWeeklySaved: (wk, amount) =>
        set((s) => ({ weeklySaved: { ...s.weeklySaved, [wk]: Math.max(0, amount) } })),
      resetAll: () =>
        set({
          income: seedIncome,
          expenses: seedExpenses,
          goals: seedGoals,
          sleep: {},
          courses: seedCourses,
          weeklyPagesGoal: 100,
          reading: {},
          books: seedBooks,
          todos: [],
          haircuts: [],
          habits: seedHabits,
          habitLog: {},
          northStar: "",
          focus: {},
          reflections: {},
          weeklySaveTarget: 250,
          weeklySaved: {},
        }),
    }),
    {
      name: "fokus-store-v2",
      skipHydration: true,
      version: 6,
      migrate: (persisted, version) => {
        const s = persisted as State;
        // v6: von Paul kuratiertes Wochenziel-Set einmalig übernehmen, Habit-Log frisch starten
        if (version < 6 && s) {
          s.habits = makeSeedHabits();
          s.habitLog = {};
        }
        return s;
      },
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<State>;
        const habits = (p.habits ?? current.habits).map((h) => {
          const legacyDays = Array.isArray(h.days) ? h.days : undefined;
          return {
            ...h,
            icon: h.icon ?? "target",
            weeklyTarget:
              typeof h.weeklyTarget === "number"
                ? h.weeklyTarget
                : legacyDays
                ? legacyDays.length === 0
                  ? 7
                  : legacyDays.length
                : 7,
          };
        });
        return { ...current, ...p, habits };
      },
    }
  )
);

export const todayKey = () => dateKey();
