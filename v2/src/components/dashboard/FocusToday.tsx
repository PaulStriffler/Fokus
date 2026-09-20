"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useStore } from "@/lib/store";
import { dateKey } from "@/lib/format";
import { spring } from "@/lib/motion";

export function FocusToday() {
  const dk = dateKey();
  const focus = useStore((s) => s.focus[dk]);
  const setFocus = useStore((s) => s.setFocus);
  const toggleFocusDone = useStore((s) => s.toggleFocusDone);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const hasText = !!focus?.text;
  const done = !!focus?.done;

  const startEdit = () => {
    setDraft(focus?.text ?? "");
    setEditing(true);
  };
  const save = () => {
    setFocus(dk, draft.trim());
    setEditing(false);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2.5">
        <Zap size={15} style={{ color: "var(--yellow)" }} />
        <span className="t-foot uppercase tracking-[0.08em] text-[var(--text-3)] font-[650]">
          Wichtigste Sache heute
        </span>
      </div>

      {editing ? (
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") setEditing(false);
            }}
            autoFocus
            placeholder="Das Eine, das heute wirklich zählt…"
            className="flex-1 h-11 px-3.5 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] outline-none text-[0.95rem] placeholder:text-[var(--text-3)] focus:border-[var(--yellow)]"
          />
          <button onClick={save} className="h-11 px-4 rounded-[var(--r-sm)] bg-[var(--yellow)] text-black font-[650] text-[0.9rem]">
            OK
          </button>
        </div>
      ) : hasText ? (
        <div className="flex w-full items-center gap-3">
          <button
            onClick={() => toggleFocusDone(dk)}
            aria-label={done ? "Als offen markieren" : "Als erledigt markieren"}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-colors"
            style={{ borderColor: done ? "var(--green)" : "var(--yellow)", background: done ? "var(--green)" : "transparent" }}
          >
            <AnimatePresence>
              {done && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring}>
                  <Check size={15} strokeWidth={3} className="text-white" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={startEdit}
            className="flex-1 text-left t-title3 leading-snug transition-colors"
            style={{ color: done ? "var(--text-3)" : "var(--text)", textDecoration: done ? "line-through" : "none" }}
          >
            {focus!.text}
          </button>
        </div>
      ) : (
        <button onClick={startEdit} className="text-left t-body text-[var(--text-2)]">
          Tippen, um deine wichtigste Aufgabe für heute zu setzen.
        </button>
      )}
    </Card>
  );
}
