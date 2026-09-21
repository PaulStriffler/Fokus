"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Camera, Loader2, Check, ListTodo, NotebookPen, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { useStore } from "@/lib/store";
import { scanBoard, fileToBase64, type ScanResult } from "@/lib/scan";
import { spring } from "@/lib/motion";

export function BoardScan() {
  const apiKey = useStore((s) => s.apiKey);
  const addTodo = useStore((s) => s.addTodo);
  const addJournalMany = useStore((s) => s.addJournalMany);
  const todos = useStore((s) => s.todos);
  const toggleTodo = useStore((s) => s.toggleTodo);

  const fileRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [sel, setSel] = useState<{ todos: Set<number>; thoughts: Set<number>; done: Set<number> }>({
    todos: new Set(), thoughts: new Set(), done: new Set(),
  });
  const [applied, setApplied] = useState(false);

  const pick = () => {
    setError("");
    if (!apiKey) {
      setError("no-key");
      return;
    }
    fileRef.current?.click();
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) e.target.value = "";
    if (!file) return;
    setScanning(true);
    setError("");
    setResult(null);
    try {
      const { base64, mediaType } = await fileToBase64(file);
      const r = await scanBoard(base64, mediaType, apiKey);
      setResult(r);
      setSel({
        todos: new Set(r.todos.map((_, i) => i)),
        thoughts: new Set(r.thoughts.map((_, i) => i)),
        done: new Set(r.done.map((_, i) => i)),
      });
      setApplied(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan fehlgeschlagen.");
    } finally {
      setScanning(false);
    }
  };

  const toggle = (kind: "todos" | "thoughts" | "done", i: number) => {
    setSel((s) => {
      const next = new Set(s[kind]);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return { ...s, [kind]: next };
    });
  };

  const apply = () => {
    if (!result) return;
    result.todos.forEach((t, i) => sel.todos.has(i) && addTodo({ text: t, due: null, priority: "normal" }));
    const thoughts = result.thoughts.filter((_, i) => sel.thoughts.has(i));
    if (thoughts.length) addJournalMany(thoughts);
    result.done.forEach((d, i) => {
      if (!sel.done.has(i)) return;
      const dl = d.toLowerCase();
      const match = todos.find(
        (t) => !t.done && (t.text.toLowerCase().includes(dl) || dl.includes(t.text.toLowerCase()))
      );
      if (match) toggleTodo(match.id);
    });
    setApplied(true);
    setTimeout(() => setResult(null), 900);
  };

  return (
    <>
      <Card as="button" interactive onClick={pick} className="w-full">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px] bg-[color-mix(in_srgb,var(--accent)_16%,transparent)]">
            {scanning ? (
              <Loader2 size={21} className="animate-spin" style={{ color: "var(--accent)" }} />
            ) : (
              <Camera size={21} style={{ color: "var(--accent)" }} />
            )}
          </span>
          <div className="min-w-0 flex-1 text-left">
            <div className="t-headline">{scanning ? "Board wird gelesen…" : "Board scannen"}</div>
            <div className="t-foot text-[var(--text-3)]">Foto machen → To-Dos & Gedanken automatisch einsortieren</div>
          </div>
        </div>
      </Card>

      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} hidden />

      {error === "no-key" && (
        <Card className="mt-3">
          <div className="t-callout mb-2">Für den Board-Scan brauchst du einen Anthropic-API-Key.</div>
          <Link href="/einstellungen" className="t-callout font-[650]" style={{ color: "var(--accent)" }}>
            → In den Einstellungen eintragen
          </Link>
        </Card>
      )}
      {error && error !== "no-key" && (
        <Card className="mt-3"><div className="t-callout" style={{ color: "var(--red)" }}>{error}</div></Card>
      )}

      <Sheet open={!!result} onClose={() => setResult(null)} title="Vom Board erkannt">
        {result && (
          <>
            {applied ? (
              <div className="py-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring} className="grid h-14 w-14 mx-auto place-items-center rounded-full bg-[color-mix(in_srgb,var(--green)_16%,transparent)] mb-3">
                  <Check size={28} style={{ color: "var(--green)" }} strokeWidth={3} />
                </motion.div>
                <div className="t-headline">Übernommen!</div>
              </div>
            ) : (
              <>
                <ScanGroup icon={<ListTodo size={15} />} color="var(--accent)" label="To-Dos" items={result.todos} selected={sel.todos} onToggle={(i) => toggle("todos", i)} />
                <ScanGroup icon={<NotebookPen size={15} />} color="var(--indigo)" label="Gedanken → Journal" items={result.thoughts} selected={sel.thoughts} onToggle={(i) => toggle("thoughts", i)} />
                <ScanGroup icon={<CheckCircle2 size={15} />} color="var(--green)" label="Erledigt (hakt passende To-Dos ab)" items={result.done} selected={sel.done} onToggle={(i) => toggle("done", i)} />
                {result.todos.length + result.thoughts.length + result.done.length === 0 ? (
                  <div className="py-6 text-center t-callout text-[var(--text-3)]">Nichts erkannt. Versuch ein schärferes Foto.</div>
                ) : (
                  <Button variant="primary" full className="mt-4 mb-1" onClick={apply}>Übernehmen</Button>
                )}
              </>
            )}
          </>
        )}
      </Sheet>
    </>
  );
}

function ScanGroup({
  icon, color, label, items, selected, onToggle,
}: {
  icon: React.ReactNode; color: string; label: string; items: string[];
  selected: Set<number>; onToggle: (i: number) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mb-4">
      <div className="flex items-center gap-1.5 mb-2" style={{ color }}>
        {icon}
        <span className="t-foot font-[650]">{label}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map((t, i) => {
          const on = selected.has(i);
          return (
            <button key={i} onClick={() => onToggle(i)} className="flex items-center gap-3 rounded-[var(--r-sm)] bg-[var(--surface-2)] px-3 py-2.5 text-left">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition-colors" style={{ borderColor: on ? color : "var(--border-strong)", background: on ? color : "transparent" }}>
                {on && <Check size={13} strokeWidth={3} className="text-white" />}
              </span>
              <span className="flex-1 t-callout">{t}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
