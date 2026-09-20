"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useStore, type Habit } from "@/lib/store";
import { WEEKDAYS } from "@/lib/habits";
import { spring } from "@/lib/motion";

const COLORS = ["var(--accent)", "var(--orange)", "var(--purple)", "var(--green)", "var(--gold)", "var(--teal)", "var(--pink)"];

export function WeekPlan() {
  const habits = useStore((s) => s.habits);
  const addHabit = useStore((s) => s.addHabit);
  const updateHabit = useStore((s) => s.updateHabit);
  const removeHabit = useStore((s) => s.removeHabit);

  const [openDay, setOpenDay] = useState<number | null>(null);
  const [text, setText] = useState("");
  const today = new Date().getDay();

  const forDay = (day: number): Habit[] =>
    habits.filter((h) => h.days.length === 0 || h.days.includes(day));

  const add = (day: number) => {
    const t = text.trim();
    if (!t) return;
    addHabit(t, COLORS[habits.length % COLORS.length], [day]);
    setText("");
  };

  const removeFromDay = (h: Habit, day: number) => {
    const base = h.days.length === 0 ? [0, 1, 2, 3, 4, 5, 6] : h.days;
    const others = base.filter((d) => d !== day);
    if (others.length === 0) removeHabit(h.id);
    else updateHabit(h.id, { days: others });
  };

  return (
    <div className="flex flex-col gap-3">
      {WEEKDAYS.map(({ day, long }) => {
        const items = forDay(day);
        const isToday = day === today;
        return (
          <Card key={day}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="t-headline">{long}</span>
                {isToday && (
                  <span className="rounded-full bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] px-2 py-0.5 t-foot font-[650]" style={{ color: "var(--accent)" }}>
                    heute
                  </span>
                )}
              </div>
              <span className="t-foot text-[var(--text-3)]">{items.length}</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <AnimatePresence initial={false}>
                {items.map((h) => (
                  <motion.div
                    key={h.id}
                    layout
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={spring}
                    className="group flex items-center gap-2.5 rounded-[var(--r-sm)] bg-[var(--surface-2)] px-3 py-2.5"
                  >
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: h.color }} />
                    <span className="flex-1 t-callout font-[540]">{h.title}</span>
                    {h.days.length === 0 && (
                      <span className="t-foot text-[var(--text-3)]">täglich</span>
                    )}
                    <button
                      onClick={() => removeFromDay(h, day)}
                      aria-label="Von diesem Tag entfernen"
                      className="grid h-6 w-6 place-items-center rounded-full text-[var(--text-3)] opacity-0 group-hover:opacity-100 hover:bg-[var(--surface)] hover:text-[var(--red)] transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {openDay === day ? (
              <div className="mt-2 flex items-center gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") add(day);
                    if (e.key === "Escape") setOpenDay(null);
                  }}
                  autoFocus
                  placeholder="z. B. Push-Training, 20 Seiten lesen…"
                  className="flex-1 h-10 px-3 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] outline-none text-[0.9rem] placeholder:text-[var(--text-3)] focus:border-[var(--accent)]"
                />
                <button onClick={() => add(day)} aria-label="Hinzufügen" className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--r-sm)] bg-[var(--accent)] text-white">
                  <Plus size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setOpenDay(day); setText(""); }}
                className="mt-2 flex items-center gap-1.5 t-foot font-[600] text-[var(--text-3)] hover:text-[var(--accent)] transition-colors"
              >
                <Plus size={14} /> Aktivität hinzufügen
              </button>
            )}
          </Card>
        );
      })}
    </div>
  );
}
