"use client";

import { Trash2, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useStore } from "@/lib/store";
import { byDay } from "@/lib/haircuts";
import { eur, parseKey, relativeDay } from "@/lib/format";

export function DayLog() {
  const haircuts = useStore((s) => s.haircuts);
  const removeHaircut = useStore((s) => s.removeHaircut);
  const days = byDay(haircuts);

  if (days.length === 0) {
    return (
      <Card>
        <div className="py-8 text-center">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--surface-2)] mx-auto mb-3">
            <CalendarDays size={20} className="text-[var(--text-2)]" />
          </div>
          <div className="t-headline mb-1">Noch kein Verlauf</div>
          <div className="t-callout text-[var(--text-2)]">Deine Tage erscheinen hier, sobald du Schnitte einträgst.</div>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {days.map((d) => (
        <Card key={d.date}>
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="t-headline">{relativeDay(d.date)}</div>
              <div className="t-foot text-[var(--text-3)]">
                {parseKey(d.date).toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
              </div>
            </div>
            <div className="t-title3 tabular" style={{ color: "var(--teal)" }}>{eur(d.total)}</div>
          </div>
          <div className="flex flex-col">
            {d.cuts.map((h, i) => (
              <div
                key={h.id}
                className="group flex items-center gap-3 py-2"
                style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--teal)_14%,transparent)] t-foot font-[700]" style={{ color: "var(--teal)" }}>
                  {h.client.slice(0, 1).toUpperCase()}
                </span>
                <span className="flex-1 t-callout">{h.client}</span>
                <span className="t-callout font-[600] tabular">{eur(h.amount)}</span>
                <button
                  onClick={() => removeHaircut(h.id)}
                  aria-label="Löschen"
                  className="grid h-7 w-7 place-items-center rounded-full text-[var(--text-3)] opacity-0 group-hover:opacity-100 hover:bg-[var(--surface-2)] hover:text-[var(--red)] transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
