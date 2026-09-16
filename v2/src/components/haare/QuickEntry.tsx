"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/Field";
import { useStore } from "@/lib/store";
import { parseHaircutNote, type ParsedCut } from "@/lib/haircuts";
import { dateKey, eur, parseKey, relativeDay } from "@/lib/format";
import { spring } from "@/lib/motion";

export function QuickEntry() {
  const addHaircuts = useStore((s) => s.addHaircuts);
  const [text, setText] = useState("");
  const [date, setDate] = useState(dateKey());
  const [justSaved, setJustSaved] = useState(0);

  const parsed = useMemo(() => parseHaircutNote(text, date), [text, date]);
  const sum = parsed.reduce((s, p) => s + p.amount, 0);

  // group preview by date (newest first)
  const groups = useMemo(() => {
    const map = new Map<string, ParsedCut[]>();
    for (const p of parsed) {
      const arr = map.get(p.date) || [];
      arr.push(p);
      map.set(p.date, arr);
    }
    return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [parsed]);

  const submit = () => {
    if (parsed.length === 0) return;
    addHaircuts(parsed.map((p) => ({ date: p.date, client: p.client, amount: p.amount })));
    setJustSaved(parsed.length);
    setText("");
    setTimeout(() => setJustSaved(0), 2400);
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={17} style={{ color: "var(--teal)" }} />
        <span className="t-headline">Tages-Notiz</span>
      </div>
      <p className="t-foot text-[var(--text-3)] mb-3 leading-relaxed">
        Schreib rein, wen du geschnitten hast — z. B. „Nikolas 15, Peter 20". Für{" "}
        <span className="text-[var(--text-2)]">mehrere Tage</span> setz eine Datums-Zeile davor:
      </p>
      <pre className="mb-3 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2.5 t-foot text-[var(--text-2)] whitespace-pre-wrap leading-relaxed">
{`15.09.  Nikolas 15, Peter 20
14.09.  Frank 15, Max 25`}
      </pre>

      <div className="mb-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"Nikolas 15, Peter 20, Frank 15\noder mit Datum:\n15.09. Nikolas 15\n14.09. Peter 20"}
          rows={4}
          className="w-full resize-none rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] px-3.5 py-3 text-[0.95rem] outline-none transition-colors placeholder:text-[var(--text-3)] focus:border-[var(--teal)] leading-relaxed"
        />
      </div>

      <AnimatePresence>
        {parsed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 mb-3">
              {groups.map(([d, cuts]) => (
                <div key={d}>
                  <div className="t-foot font-[600] text-[var(--text-2)] mb-1.5">
                    {relativeDay(d)}
                    <span className="text-[var(--text-3)] font-[400]">
                      {" · "}
                      {parseKey(d).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cuts.map((p, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--teal)_14%,transparent)] px-2.5 py-1 t-foot"
                      >
                        <span className="font-[600]">{p.client}</span>
                        <span className="text-[var(--teal)] font-[650] tabular">{eur(p.amount)}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 flex-1">
          <span className="t-foot text-[var(--text-3)] shrink-0">Standard</span>
          <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <Button variant="primary" onClick={submit} disabled={parsed.length === 0}>
          {parsed.length > 0 ? `${parsed.length} · ${eur(sum)}` : "Eintragen"}
        </Button>
      </div>

      <AnimatePresence>
        {justSaved > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={spring}
            className="mt-3 flex items-center gap-2 t-foot font-[600]"
            style={{ color: "var(--green)" }}
          >
            <Check size={15} strokeWidth={3} /> {justSaved} Schnitt(e) gespeichert
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
