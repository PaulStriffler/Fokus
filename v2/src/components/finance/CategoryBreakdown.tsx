"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/Card";
import type { FinanceSummary } from "@/lib/finance";
import { eur } from "@/lib/format";

const PALETTE = [
  "var(--accent)",
  "var(--orange)",
  "var(--purple)",
  "var(--mint)",
  "var(--pink)",
  "var(--yellow)",
  "var(--teal)",
];

export function CategoryBreakdown({ s }: { s: FinanceSummary }) {
  if (s.byCategory.length === 0) return null;

  return (
    <Card>
      <div className="t-headline mb-4">Ausgaben nach Kategorie</div>

      <div className="flex h-3 w-full overflow-hidden rounded-full mb-5 bg-[var(--surface-2)]">
        {s.byCategory.map((c, i) => (
          <motion.div
            key={c.category}
            initial={{ width: 0 }}
            animate={{ width: `${c.pct}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
            style={{ background: PALETTE[i % PALETTE.length] }}
            title={c.category}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {s.byCategory.map((c, i) => (
          <div key={c.category} className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: PALETTE[i % PALETTE.length] }} />
            <span className="t-callout flex-1">{c.category}</span>
            <span className="t-foot text-[var(--text-3)] tabular w-10 text-right">{c.pct.toFixed(0)}%</span>
            <span className="t-callout font-[620] tabular w-20 text-right">{eur(c.amount)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
