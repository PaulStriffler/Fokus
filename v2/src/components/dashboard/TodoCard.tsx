"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Check, X, ListTodo } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useStore, type Priority } from "@/lib/store";
import { relativeDay } from "@/lib/format";
import { spring } from "@/lib/motion";

const PRIO_COLOR: Record<Priority, string> = {
  hoch: "var(--red)",
  normal: "var(--accent)",
  niedrig: "var(--text-3)",
};

export function TodoCard() {
  const todos = useStore((s) => s.todos);
  const addTodo = useStore((s) => s.addTodo);
  const toggleTodo = useStore((s) => s.toggleTodo);
  const removeTodo = useStore((s) => s.removeTodo);

  const [text, setText] = useState("");
  const [prio, setPrio] = useState<Priority>("normal");

  const open = todos.filter((t) => !t.done);
  const done = todos.filter((t) => t.done);

  const submit = () => {
    if (!text.trim()) return;
    addTodo({ text: text.trim(), due: null, priority: prio });
    setText("");
    setPrio("normal");
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-[11px] bg-[color-mix(in_srgb,var(--accent)_16%,transparent)]">
            <ListTodo size={18} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <div className="t-headline">To-dos</div>
            <div className="t-foot text-[var(--text-3)]">
              {open.length} offen{done.length ? ` · ${done.length} erledigt` : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Quick add */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex flex-1 items-center gap-2 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] px-3 h-11 focus-within:border-[var(--accent)] transition-colors">
          <button
            aria-label="Priorität wechseln"
            onClick={() => setPrio(prio === "normal" ? "hoch" : prio === "hoch" ? "niedrig" : "normal")}
            className="h-3 w-3 rounded-full shrink-0"
            style={{ background: PRIO_COLOR[prio] }}
          />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Neue Aufgabe…"
            className="flex-1 bg-transparent outline-none text-[0.95rem] placeholder:text-[var(--text-3)]"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          transition={spring}
          onClick={submit}
          aria-label="Hinzufügen"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--r-sm)] bg-[var(--accent)] text-white"
        >
          <Plus size={20} />
        </motion.button>
      </div>

      {open.length === 0 && done.length === 0 ? (
        <div className="py-6 text-center t-callout text-[var(--text-3)]">
          Noch keine Aufgaben. Tipp oben was ein.
        </div>
      ) : (
        <div className="flex flex-col">
          <AnimatePresence initial={false}>
            {[...open, ...done].map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={spring}
                className="group flex items-center gap-3 py-2.5"
              >
                <button
                  aria-label={t.done ? "Als offen markieren" : "Als erledigt markieren"}
                  onClick={() => toggleTodo(t.id)}
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors"
                  style={{
                    borderColor: t.done ? "var(--green)" : PRIO_COLOR[t.priority],
                    background: t.done ? "var(--green)" : "transparent",
                  }}
                >
                  {t.done && <Check size={13} strokeWidth={3} className="text-white" />}
                </button>
                <span
                  className="flex-1 t-callout transition-colors"
                  style={{
                    color: t.done ? "var(--text-3)" : "var(--text)",
                    textDecoration: t.done ? "line-through" : "none",
                  }}
                >
                  {t.text}
                  {t.due && (
                    <span className="ml-2 t-foot text-[var(--text-3)]">{relativeDay(t.due)}</span>
                  )}
                </span>
                <button
                  aria-label="Löschen"
                  onClick={() => removeTodo(t.id)}
                  className="grid h-7 w-7 place-items-center rounded-full text-[var(--text-3)] opacity-0 group-hover:opacity-100 hover:bg-[var(--surface-2)] hover:text-[var(--red)] transition-opacity"
                >
                  <X size={15} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </Card>
  );
}
