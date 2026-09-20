"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Check, X, Pencil, CalendarRange } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Ring } from "@/components/ui/Ring";
import { useStore } from "@/lib/store";
import { dateKey, weekKeys } from "@/lib/format";
import { isDone, weekCount, isWeekComplete, weekProgress, dayCounts, WEEKDAYS } from "@/lib/habits";
import { iconFor } from "@/lib/icons";
import { spring } from "@/lib/motion";

export function DailyFocus() {
  const habits = useStore((s) => s.habits);
  const habitLog = useStore((s) => s.habitLog);
  const toggleHabit = useStore((s) => s.toggleHabit);
  const removeHabit = useStore((s) => s.removeHabit);

  const [edit, setEdit] = useState(false);
  const dk = dateKey();
  const { done, total, ratio } = weekProgress(habits, habitLog);
  const complete = total > 0 && done >= total;

  // offene zuerst, erledigte nach unten
  const sorted = [...habits].sort((a, b) => Number(isWeekComplete(a, habitLog)) - Number(isWeekComplete(b, habitLog)));

  const headline = complete
    ? "Woche geschafft. Maschine. 🔥"
    : done === 0
    ? "Neue Woche — leg los."
    : `${total - done} übrig diese Woche.`;

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
            <div className="t-foot text-[var(--text-3)] mt-0.5">Woche</div>
          </div>
        </Ring>
        <div className="flex-1 min-w-0">
          <div className="t-foot uppercase tracking-[0.07em] text-[var(--text-3)] mb-1">Deine Woche</div>
          <div className="t-title3 leading-snug">{headline}</div>
        </div>
      </div>

      <WeekConsistency habitLog={habitLog} className="mb-4" />

      <AnimatePresence>
        {complete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={spring}
            className="mb-4 flex items-center justify-center gap-2 rounded-[var(--r-md)] py-2.5 t-callout font-[650]"
            style={{ background: "color-mix(in srgb, var(--green) 15%, transparent)", color: "var(--green)" }}
          >
            🔥 Alle Wochenziele erreicht!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ziel-Liste */}
      <div className="flex flex-col gap-1.5">
        {habits.length === 0 && (
          <div className="py-4 text-center t-callout text-[var(--text-3)]">
            Noch keine Wochenziele. Leg unter „Ziele planen“ los.
          </div>
        )}
        {sorted.map((h) => {
          const Icon = iconFor(h.icon);
          const count = weekCount(habitLog, h.id);
          const doneToday = isDone(habitLog, dk, h.id);
          const weekDone = count >= h.weeklyTarget;
          return (
            <motion.div key={h.id} layout className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.99 }}
                transition={spring}
                onClick={() => toggleHabit(dk, h.id)}
                className="flex flex-1 items-center gap-3 rounded-[var(--r-md)] px-3 py-2.5 text-left transition-colors"
                style={{ background: doneToday ? `color-mix(in srgb, ${h.color} 14%, transparent)` : "var(--surface-2)" }}
              >
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px]"
                  style={{ background: `color-mix(in srgb, ${h.color} 18%, transparent)` }}
                >
                  <Icon size={18} style={{ color: h.color }} />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className="block t-callout font-[600] truncate transition-colors"
                    style={{ color: weekDone ? "var(--text-2)" : "var(--text)" }}
                  >
                    {h.title}
                  </span>
                  <span className="mt-1 flex items-center gap-1">
                    {Array.from({ length: h.weeklyTarget }).map((_, i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: i < count ? h.color : "var(--border-strong)" }}
                      />
                    ))}
                    <span className="ml-1 t-foot text-[var(--text-3)] tabular">
                      {count}/{h.weeklyTarget}
                    </span>
                  </span>
                </span>
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-colors"
                  style={{
                    borderColor: doneToday ? h.color : weekDone ? "var(--green)" : "var(--border-strong)",
                    background: doneToday ? h.color : weekDone ? "var(--green)" : "transparent",
                  }}
                >
                  {(doneToday || weekDone) && <Check size={14} strokeWidth={3} className="text-white" />}
                </span>
              </motion.button>
              {edit && (
                <button
                  onClick={() => removeHabit(h.id)}
                  aria-label="Ziel löschen"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--red)]"
                >
                  <X size={16} />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => setEdit((e) => !e)}
          className="flex items-center gap-1.5 t-foot font-[600] text-[var(--text-3)] hover:text-[var(--text)] transition-colors"
        >
          <Pencil size={13} /> {edit ? "Fertig" : "Bearbeiten"}
        </button>
        <Link
          href="/woche"
          className="flex items-center gap-1.5 t-foot font-[600] text-[var(--accent)] hover:brightness-110 transition-all"
        >
          <CalendarRange size={14} /> Ziele planen
        </Link>
      </div>
    </Card>
  );
}

function WeekConsistency({ habitLog, className = "" }: { habitLog: Record<string, Record<string, boolean>>; className?: string }) {
  const keys = weekKeys();
  const todayK = dateKey();
  const counts = dayCounts(habitLog);

  return (
    <div className={["flex items-center justify-between", className].join(" ")}>
      {keys.map((k, i) => {
        const isToday = k === todayK;
        const isFuture = k > todayK;
        const active = counts[i] > 0;
        return (
          <div key={k} className="flex flex-col items-center gap-1">
            <div
              className="grid h-7 w-7 place-items-center rounded-full transition-colors"
              style={{
                background: active ? "var(--accent)" : "var(--surface-2)",
                border: isToday ? "2px solid var(--accent)" : "2px solid transparent",
                opacity: isFuture ? 0.4 : 1,
              }}
            >
              {active && <span className="t-foot text-[0.6rem] font-[700] text-white tabular">{counts[i]}</span>}
            </div>
            <span className="t-foot text-[0.6rem] text-[var(--text-3)]">{WEEKDAYS[i].short}</span>
          </div>
        );
      })}
    </div>
  );
}
