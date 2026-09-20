"use client";

import { useEffect, useState } from "react";
import { Moon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useStore } from "@/lib/store";
import { dateKey } from "@/lib/format";

const FACES = ["😞", "😕", "😐", "🙂", "🔥"];

export function Reflection() {
  const dk = dateKey();
  const saved = useStore((s) => s.reflections[dk]);
  const setReflection = useStore((s) => s.setReflection);

  const [rating, setRating] = useState(saved?.rating ?? 0);
  const [note, setNote] = useState(saved?.note ?? "");

  useEffect(() => {
    setRating(saved?.rating ?? 0);
    setNote(saved?.note ?? "");
  }, [saved?.rating, saved?.note]);

  const pick = (r: number) => {
    setRating(r);
    setReflection(dk, { rating: r, note });
  };
  const saveNote = () => setReflection(dk, { rating, note });

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <Moon size={16} style={{ color: "var(--indigo)" }} />
        <span className="t-headline">Tagesabschluss</span>
      </div>
      <p className="t-foot text-[var(--text-3)] mb-3">Wie war dein Tag?</p>

      <div className="flex justify-between mb-3">
        {FACES.map((f, i) => {
          const val = i + 1;
          const active = rating === val;
          return (
            <button
              key={val}
              onClick={() => pick(val)}
              className="grid h-12 w-12 place-items-center rounded-full text-2xl transition-all"
              style={{
                background: active ? "color-mix(in srgb, var(--indigo) 18%, transparent)" : "var(--surface-2)",
                transform: active ? "scale(1.1)" : "scale(1)",
                opacity: active || rating === 0 ? 1 : 0.5,
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onBlur={saveNote}
        rows={2}
        placeholder="Ein Gedanke zum Tag (optional)…"
        className="w-full resize-none rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] px-3.5 py-2.5 text-[0.9rem] outline-none placeholder:text-[var(--text-3)] focus:border-[var(--indigo)]"
      />
    </Card>
  );
}
