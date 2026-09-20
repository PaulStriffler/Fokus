"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Flame, Plus, Pencil, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Ring } from "@/components/ui/Ring";
import { useStore } from "@/lib/store";
import { dateKey } from "@/lib/format";
import { isDone, habitStreak, todayProgress } from "@/lib/habits";
import { spring } from "@/lib/motion";

const ADD_COLORS = ["var(--accent)", "var(--orange)", "var(--purple)", "var(--green)", "var(--gold)", "var(--teal)", "var(--pink)"];

export function DailyFocus() {
  const habits = useStore((s) => s.habits);
  const habitLog = useStore((s) => s.habitLog);
  const toggleHabit = useStore((s) => s.toggleHabit);
  const addHabit = useStore((s) => s.addHabit);
  const removeHabit = useStore((s) => s.removeHabit);

  const [edit, setEdit] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const dk = dateKey();
  const { done, total, ratio } = todayProgress(habits, habitLog, dk);
  const complete = total > 0 && done === total;

  const headline = complete
    ? "Durchgezogen. Stark. 🔥"
    : done === 0
    ? "Auf geht's — zieh es heute durch."
    : `Noch ${total - done} — bleib dran.`;

  const add = () => {
    const t = newTitle.trim();
    if (!t) return;
    addHabit(t, ADD_COLORS[habits.length % ADD_COLORS.length]);
    setNewTitle("");
  };

  return (
    <Card padded={false} className="p-5">
      {/* Hero */}
      <div className="flex items-center gap-5 mb-5">
        <Ring progress={ratio} size={96} stroke={9} color={complete ? "var(--green)" : "var(--accent)"}>
          <div className="text-center">
            <div className="t-title2 leading-none tabular">
              {done}
              <span className="t-callout text-[var(--text-3)]">/{total}</span>
            </div>
            <div className="t-foot text-[var(--text-3)] mt-0.5">heute</div>
          </div>
        </Ring>
        <div className="flex-1 min-w-0">
          <div className="t-foot uppercase tracking-[0.07em] text-[var(--text-3)] mb-1">Dein Tag</div>
          <div className="t-title3 leading-snug">{headline}</div>
        </div>
      </div>

      {/* Habit list */}
      <div className="flex flex-col gap-1.5">
        {habits.map((h) => {
          const doneToday = isDone(habitLog, dk, h.id);
          const streak = habitStreak(habitLog, h.id);
          return (
            <motion.div key={h.id} layout className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                transition={spring}
                onClick={() => toggleHabit(dk, h.id)}
                className="flex flex-1 items-center gap-3 rounded-[var(--r-md)] px-3.5 py-3 text-left transition-colors"
                style={{
                  background: doneToday ? `color-mix(in srgb, ${h.color} 14%, transparent)` : "var(--surface-2)",
                }}
              >
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-colors"
                  style={{
                    borderColor: doneToday ? h.color : "var(--border-strong)",
                    background: doneToday ? h.color : "transparent",
                  }}
                >
                  <AnimatePresence>
                    {doneToday && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring}>
                        <Check size={15} strokeWidth={3} className="text-white" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                <span
                  className="flex-1 t-body font-[560] transition-colors"
                  style={{ color: doneToday ? "var(--text-2)" : "var(--text)" }}
                >
                  {h.title}
                </span>
                {streak > 0 && (
                  <span className="flex items-center gap-1 t-foot font-[650]" style={{ color: h.color }}>
                    <Flame size={13} />
                    {streak}
                  </span>
                )}
              </motion.button>
              {edit && (
                <button
                  onClick={() => removeHabit(h.id)}
                  aria-label="Gewohnheit löschen"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--red)]"
                >
                  <X size={16} />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Edit / add */}
      {edit ? (
        <div className="mt-3 flex items-center gap-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Neue Gewohnheit…"
            className="flex-1 h-11 px-3.5 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] outline-none text-[0.95rem] placeholder:text-[var(--text-3)] focus:border-[var(--accent)]"
          />
          <button onClick={add} aria-label="Hinzufügen" className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--r-sm)] bg-[var(--accent)] text-white">
            <Plus size={20} />
          </button>
          <button onClick={() => setEdit(false)} className="t-callout font-[600] text-[var(--text-2)] px-2">
            Fertig
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEdit(true)}
          className="mt-3 flex items-center gap-1.5 t-foot font-[600] text-[var(--text-3)] hover:text-[var(--text)] transition-colors"
        >
          <Pencil size={13} /> Gewohnheiten bearbeiten
        </button>
      )}
    </Card>
  );
}
