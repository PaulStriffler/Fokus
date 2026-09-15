"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight, Trash2, User } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Sheet } from "@/components/ui/Sheet";
import { useStore } from "@/lib/store";
import { clientSummaries } from "@/lib/haircuts";
import { eur, parseKey } from "@/lib/format";
import { fadeUp } from "@/lib/motion";

const fmtDate = (key: string) => parseKey(key).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "2-digit" });

export function Clients() {
  const haircuts = useStore((s) => s.haircuts);
  const removeHaircut = useStore((s) => s.removeHaircut);
  const summaries = clientSummaries(haircuts);
  const [selected, setSelected] = useState<string | null>(null);

  const clientCuts = selected
    ? haircuts.filter((h) => h.client === selected).sort((a, b) => (a.date < b.date ? 1 : -1))
    : [];

  if (summaries.length === 0) {
    return (
      <Card>
        <div className="py-8 text-center">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--surface-2)] mx-auto mb-3">
            <User size={20} className="text-[var(--text-2)]" />
          </div>
          <div className="t-headline mb-1">Noch keine Kunden</div>
          <div className="t-callout text-[var(--text-2)]">Trag deinen ersten Schnitt in der Tages-Notiz ein.</div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="card overflow-hidden p-0">
        {summaries.map((c, i) => (
          <motion.button
            key={c.client}
            variants={fadeUp}
            onClick={() => setSelected(c.client)}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[var(--surface-hover)]"
            style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--teal)_16%,transparent)] t-callout font-[700]" style={{ color: "var(--teal)" }}>
              {c.client.slice(0, 1).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block t-callout font-[600] truncate">{c.client}</span>
              <span className="block t-foot text-[var(--text-3)]">
                {c.count}× · seit {fmtDate(c.first)}
              </span>
            </span>
            <span className="t-callout font-[650] tabular">{eur(c.total)}</span>
            <ChevronRight size={16} className="text-[var(--text-3)]" />
          </motion.button>
        ))}
      </div>

      <Sheet open={!!selected} onClose={() => setSelected(null)} title={selected ?? ""}>
        {selected && (
          <>
            <div className="mb-4 flex items-center justify-between rounded-[var(--r-md)] bg-[var(--surface-2)] p-3.5">
              <div>
                <div className="t-foot text-[var(--text-3)]">Insgesamt bekommen</div>
                <div className="t-title2 tabular" style={{ color: "var(--teal)" }}>
                  {eur(clientCuts.reduce((s, c) => s + c.amount, 0))}
                </div>
              </div>
              <div className="text-right">
                <div className="t-foot text-[var(--text-3)]">Schnitte</div>
                <div className="t-title3 tabular">{clientCuts.length}</div>
              </div>
            </div>

            <div className="flex flex-col">
              {clientCuts.map((h, i) => (
                <div
                  key={h.id}
                  className="group flex items-center gap-3 py-2.5"
                  style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
                >
                  <span className="flex-1 t-callout">{fmtDate(h.date)}</span>
                  <span className="t-callout font-[600] tabular">{eur(h.amount)}</span>
                  <button
                    onClick={() => removeHaircut(h.id)}
                    aria-label="Löschen"
                    className="grid h-7 w-7 place-items-center rounded-full text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--red)]"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </Sheet>
    </>
  );
}
