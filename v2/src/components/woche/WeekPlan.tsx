"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { Field, TextInput } from "@/components/ui/Field";
import { useStore, type Habit } from "@/lib/store";
import { weekCount, weekProgress } from "@/lib/habits";
import { ICON_KEYS, iconFor } from "@/lib/icons";
import { spring } from "@/lib/motion";

const COLORS = [
  "var(--accent)", "var(--orange)", "var(--purple)", "var(--green)",
  "var(--gold)", "var(--teal)", "var(--pink)", "var(--indigo)", "var(--mint)", "var(--red)",
];

export function WeekPlan() {
  const habits = useStore((s) => s.habits);
  const habitLog = useStore((s) => s.habitLog);
  const addHabit = useStore((s) => s.addHabit);
  const updateHabit = useStore((s) => s.updateHabit);
  const removeHabit = useStore((s) => s.removeHabit);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("dumbbell");
  const [color, setColor] = useState(COLORS[0]);
  const [target, setTarget] = useState(4);

  const prog = weekProgress(habits, habitLog);

  const openNew = () => {
    setEditing(null);
    setTitle("");
    setIcon("dumbbell");
    setColor(COLORS[habits.length % COLORS.length]);
    setTarget(4);
    setOpen(true);
  };
  const openEdit = (h: Habit) => {
    setEditing(h);
    setTitle(h.title);
    setIcon(h.icon);
    setColor(h.color);
    setTarget(h.weeklyTarget);
    setOpen(true);
  };
  const save = () => {
    if (!title.trim()) return;
    const data = { title: title.trim(), icon, color, weeklyTarget: target };
    if (editing) updateHabit(editing.id, data);
    else addHabit(data);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="t-foot text-[var(--text-3)]">Diese Woche</div>
            <div className="t-title2 tabular">
              {prog.done}
              <span className="t-callout text-[var(--text-3)]"> / {prog.total} erledigt</span>
            </div>
          </div>
          <Button variant="primary" onClick={openNew}>
            <Plus size={17} /> Ziel
          </Button>
        </div>
      </Card>

      {habits.length === 0 ? (
        <Card>
          <div className="py-6 text-center">
            <div className="t-headline mb-1">Noch keine Wochenziele</div>
            <div className="t-callout text-[var(--text-2)] mb-4">
              Leg fest, was du jede Woche konstant machst — z. B. 4× Gym, 4× lesen.
            </div>
            <Button variant="primary" onClick={openNew}>
              <Plus size={16} /> Erstes Ziel
            </Button>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-2.5">
          <AnimatePresence initial={false}>
            {habits.map((h) => {
              const Icon = iconFor(h.icon);
              const count = weekCount(habitLog, h.id);
              return (
                <motion.div key={h.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} transition={spring}>
                  <Card as="button" interactive onClick={() => openEdit(h)} className="w-full">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px]" style={{ background: `color-mix(in srgb, ${h.color} 18%, transparent)` }}>
                        <Icon size={21} style={{ color: h.color }} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="t-headline truncate">{h.title}</div>
                        <div className="t-foot text-[var(--text-3)]">{h.weeklyTarget}× pro Woche</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: h.weeklyTarget }).map((_, i) => (
                          <span key={i} className="h-2 w-2 rounded-full" style={{ background: i < count ? h.color : "var(--border-strong)" }} />
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Sheet open={open} onClose={() => setOpen(false)} title={editing ? "Ziel bearbeiten" : "Neues Wochenziel"}>
        <Field label="Was willst du tun?">
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="z. B. Gym, 10 Seiten lesen, Smoothie" autoFocus />
        </Field>

        <div className="mb-4">
          <span className="block t-foot text-[var(--text-2)] mb-2 ml-0.5">Icon</span>
          <div className="grid grid-cols-6 gap-2">
            {ICON_KEYS.map((k) => {
              const Icon = iconFor(k);
              const active = k === icon;
              return (
                <button
                  key={k}
                  onClick={() => setIcon(k)}
                  className="grid aspect-square place-items-center rounded-[12px] border transition-colors"
                  style={{
                    borderColor: active ? color : "var(--border)",
                    background: active ? `color-mix(in srgb, ${color} 16%, transparent)` : "var(--surface-2)",
                  }}
                >
                  <Icon size={19} style={{ color: active ? color : "var(--text-2)" }} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <span className="block t-foot text-[var(--text-2)] mb-2 ml-0.5">Farbe</span>
          <div className="flex flex-wrap gap-2.5">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                aria-label="Farbe"
                className="h-8 w-8 rounded-full transition-transform"
                style={{ background: c, outline: c === color ? "2px solid var(--text)" : "none", outlineOffset: 2, transform: c === color ? "scale(1.1)" : "scale(1)" }}
              />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <span className="block t-foot text-[var(--text-2)] mb-2 ml-0.5">Wie oft pro Woche?</span>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <button
                key={n}
                onClick={() => setTarget(n)}
                className="flex-1 h-10 rounded-[var(--r-sm)] border t-callout font-[650] transition-colors"
                style={{
                  borderColor: target === n ? color : "var(--border)",
                  background: target === n ? `color-mix(in srgb, ${color} 16%, transparent)` : "var(--surface-2)",
                  color: target === n ? "var(--text)" : "var(--text-3)",
                }}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="t-foot text-[var(--text-3)] mt-2">{target === 7 ? "Jeden Tag" : `${target}× pro Woche — du wählst flexibel welche Tage`}</p>
        </div>

        <div className="flex gap-2 mt-5 mb-1">
          {editing && (
            <Button variant="danger" onClick={() => { removeHabit(editing.id); setOpen(false); }} aria-label="Löschen">
              <Trash2 size={17} />
            </Button>
          )}
          <Button variant="primary" full onClick={save}>
            {editing ? "Speichern" : "Hinzufügen"}
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
