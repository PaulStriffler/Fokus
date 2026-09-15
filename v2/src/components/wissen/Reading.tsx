"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Plus, Minus, Pencil, Trash2, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Ring } from "@/components/ui/Ring";
import { Bar } from "@/components/ui/Bar";
import { CountUp } from "@/components/ui/CountUp";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { useStore, type Book } from "@/lib/store";
import { dateKey, weekKeys } from "@/lib/format";
import { spring } from "@/lib/motion";

export function Reading() {
  const goal = useStore((s) => s.weeklyPagesGoal);
  const setGoal = useStore((s) => s.setWeeklyPagesGoal);
  const reading = useStore((s) => s.reading);
  const addPages = useStore((s) => s.addPages);

  const [goalOpen, setGoalOpen] = useState(false);
  const [goalDraft, setGoalDraft] = useState(String(goal));

  const wk = weekKeys();
  const weekTotal = wk.reduce((sum, k) => sum + (reading[k] || 0), 0);
  const today = dateKey();
  const ratio = goal > 0 ? weekTotal / goal : 0;

  return (
    <>
      <Card>
        <div className="flex items-center gap-5">
          <Ring progress={ratio} size={100} stroke={9} color="var(--purple)">
            <div className="text-center">
              <div className="t-title2 leading-none">
                <CountUp value={weekTotal} />
              </div>
              <div className="t-foot text-[var(--text-3)]">von {goal}</div>
            </div>
          </Ring>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <BookOpen size={16} style={{ color: "var(--purple)" }} />
              <span className="t-headline">Lesen</span>
              <button
                onClick={() => { setGoalDraft(String(goal)); setGoalOpen(true); }}
                aria-label="Wochenziel ändern"
                className="ml-auto grid h-7 w-7 place-items-center rounded-full text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
              >
                <Pencil size={14} />
              </button>
            </div>
            <div className="t-foot text-[var(--text-3)] mb-3">Seiten diese Woche · Ziel {goal}/Woche</div>

            <div className="flex gap-2">
              {[10, 25, 50].map((n) => (
                <motion.button
                  key={n}
                  whileTap={{ scale: 0.94 }}
                  transition={spring}
                  onClick={() => addPages(today, n)}
                  className="flex-1 h-10 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] t-callout font-[600] hover:bg-[var(--surface-hover)]"
                >
                  +{n}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between gap-1.5" style={{ height: 48 }}>
          {wk.map((k) => {
            const v = reading[k] || 0;
            const max = Math.max(goal / 5, ...wk.map((x) => reading[x] || 0), 1);
            const isToday = k === today;
            return (
              <div key={k} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex w-full flex-1 items-end justify-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(v / max) * 100}%` }}
                    transition={spring}
                    className="w-[60%] rounded-full"
                    style={{ minHeight: v ? 5 : 3, background: v ? "var(--purple)" : "var(--surface-2)", opacity: isToday ? 1 : 0.8 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <BookList />

      <Sheet open={goalOpen} onClose={() => setGoalOpen(false)} title="Wochenziel">
        <Field label="Seiten pro Woche">
          <TextInput value={goalDraft} onChange={(e) => setGoalDraft(e.target.value)} inputMode="numeric" autoFocus />
        </Field>
        <Button variant="primary" full className="mt-2 mb-1" onClick={() => { setGoal(parseInt(goalDraft) || 0); setGoalOpen(false); }}>
          Speichern
        </Button>
      </Sheet>
    </>
  );
}

function BookList() {
  const books = useStore((s) => s.books);
  const addBook = useStore((s) => s.addBook);
  const updateBook = useStore((s) => s.updateBook);
  const removeBook = useStore((s) => s.removeBook);
  const addPages = useStore((s) => s.addPages);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [total, setTotal] = useState("");

  const openNew = () => { setEditing(null); setTitle(""); setAuthor(""); setTotal(""); setOpen(true); };
  const openEdit = (b: Book) => { setEditing(b); setTitle(b.title); setAuthor(b.author); setTotal(String(b.totalPages)); setOpen(true); };

  const save = () => {
    if (!title.trim()) return;
    const data = { title: title.trim(), author: author.trim(), totalPages: parseInt(total) || 0 };
    if (editing) updateBook(editing.id, data);
    else addBook({ ...data, currentPage: 0 });
    setOpen(false);
  };

  const bump = (b: Book, delta: number) => {
    const next = Math.max(0, Math.min(b.totalPages || 99999, b.currentPage + delta));
    updateBook(b.id, { currentPage: next });
    if (delta > 0) addPages(dateKey(), Math.max(0, next - b.currentPage));
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <span className="t-headline">Bücher</span>
        <Button size="sm" variant="secondary" onClick={openNew}><Plus size={16} /> Buch</Button>
      </div>

      {books.length === 0 ? (
        <div className="py-4 text-center t-callout text-[var(--text-3)]">Noch kein Buch. Füg eins hinzu.</div>
      ) : (
        <div className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {books.map((b) => {
              const p = b.totalPages > 0 ? b.currentPage / b.totalPages : 0;
              const finished = b.totalPages > 0 && b.currentPage >= b.totalPages;
              return (
                <motion.div key={b.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex items-baseline justify-between mb-1">
                    <button onClick={() => openEdit(b)} className="min-w-0 text-left flex items-center gap-1.5">
                      <span className="t-callout font-[600] truncate">{b.title}</span>
                      {finished && <Check size={14} style={{ color: "var(--green)" }} />}
                    </button>
                    <span className="t-foot text-[var(--text-3)] tabular shrink-0 ml-2">
                      {b.currentPage}/{b.totalPages}
                    </span>
                  </div>
                  {b.author && <div className="t-foot text-[var(--text-3)] mb-1.5">{b.author}</div>}
                  <div className="flex items-center gap-2">
                    <Bar progress={p} color="var(--purple)" className="flex-1" />
                    <button onClick={() => bump(b, -10)} aria-label="10 Seiten zurück" className="grid h-7 w-7 place-items-center rounded-full bg-[var(--surface-2)] text-[var(--text-2)]"><Minus size={14} /></button>
                    <button onClick={() => bump(b, 10)} aria-label="10 Seiten weiter" className="grid h-7 w-7 place-items-center rounded-full bg-[var(--surface-2)] text-[var(--text-2)]"><Plus size={14} /></button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Sheet open={open} onClose={() => setOpen(false)} title={editing ? "Buch bearbeiten" : "Neues Buch"}>
        <Field label="Titel"><TextInput value={title} onChange={(e) => setTitle(e.target.value)} autoFocus /></Field>
        <Field label="Autor"><TextInput value={author} onChange={(e) => setAuthor(e.target.value)} /></Field>
        <Field label="Seiten gesamt"><TextInput value={total} onChange={(e) => setTotal(e.target.value)} inputMode="numeric" /></Field>
        <div className="flex gap-2 mt-4 mb-1">
          {editing && <Button variant="danger" onClick={() => { removeBook(editing.id); setOpen(false); }} aria-label="Löschen"><Trash2 size={17} /></Button>}
          <Button variant="primary" full onClick={save}>{editing ? "Speichern" : "Hinzufügen"}</Button>
        </div>
      </Sheet>
    </Card>
  );
}
