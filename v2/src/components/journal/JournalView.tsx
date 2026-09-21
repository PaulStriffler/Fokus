"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Search, Trash2, NotebookPen } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useStore } from "@/lib/store";
import { relativeDay, parseKey } from "@/lib/format";
import { spring } from "@/lib/motion";

export function JournalView() {
  const journal = useStore((s) => s.journal);
  const addJournal = useStore((s) => s.addJournal);
  const removeJournal = useStore((s) => s.removeJournal);

  const [q, setQ] = useState("");
  const [text, setText] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = term ? journal.filter((j) => j.text.toLowerCase().includes(term)) : journal;
    // gruppiere nach Tag (journal ist bereits neueste zuerst)
    const groups: { date: string; items: typeof journal }[] = [];
    for (const e of list) {
      const g = groups.find((x) => x.date === e.date);
      if (g) g.items.push(e);
      else groups.push({ date: e.date, items: [e] });
    }
    groups.sort((a, b) => (a.date < b.date ? 1 : -1));
    return groups;
  }, [journal, q]);

  const add = () => {
    if (!text.trim()) return;
    addJournal(text.trim());
    setText("");
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <NotebookPen size={17} style={{ color: "var(--indigo)" }} />
          <span className="t-headline">Neuer Eintrag</span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="Ein Gedanke, eine Notiz, was dir durch den Kopf geht…"
          className="w-full resize-none rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] px-3.5 py-2.5 text-[0.95rem] outline-none placeholder:text-[var(--text-3)] focus:border-[var(--indigo)] mb-2"
        />
        <button
          onClick={add}
          disabled={!text.trim()}
          className="flex items-center gap-1.5 h-10 px-4 rounded-[var(--r-sm)] bg-[var(--indigo)] text-white font-[600] text-[0.9rem] disabled:opacity-40"
        >
          <Plus size={17} /> Speichern
        </button>
      </Card>

      <div className="flex items-center gap-2 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] px-3.5 h-11 focus-within:border-[var(--accent)]">
        <Search size={16} className="text-[var(--text-3)]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Im Journal suchen…"
          className="flex-1 bg-transparent outline-none text-[0.95rem] placeholder:text-[var(--text-3)]"
        />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <div className="py-8 text-center t-callout text-[var(--text-3)]">
            {q ? "Nichts gefunden." : "Noch keine Einträge. Schreib deinen ersten Gedanken auf."}
          </div>
        </Card>
      ) : (
        filtered.map((g) => (
          <div key={g.date}>
            <div className="t-foot font-[650] text-[var(--text-2)] mb-2 px-1">
              {relativeDay(g.date)}
              <span className="text-[var(--text-3)] font-[400]">
                {" · "}
                {parseKey(g.date).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <Card padded={false} className="p-0 overflow-hidden">
              <AnimatePresence initial={false}>
                {g.items.map((e, i) => (
                  <motion.div
                    key={e.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={spring}
                    className="group flex items-start gap-3 px-4 py-3"
                    style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--indigo)" }} />
                    <span className="flex-1 t-body leading-relaxed whitespace-pre-wrap">{e.text}</span>
                    <button
                      onClick={() => removeJournal(e.id)}
                      aria-label="Löschen"
                      className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[var(--text-3)] opacity-0 group-hover:opacity-100 hover:bg-[var(--surface-2)] hover:text-[var(--red)] transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Card>
          </div>
        ))
      )}
    </div>
  );
}
