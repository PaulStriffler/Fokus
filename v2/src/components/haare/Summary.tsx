"use client";

import { Card } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { useStore } from "@/lib/store";
import { totalWeek, totalMonth, totalAll } from "@/lib/haircuts";
import { eur } from "@/lib/format";

export function Summary() {
  const haircuts = useStore((s) => s.haircuts);
  const week = totalWeek(haircuts);
  const month = totalMonth(haircuts);
  const all = totalAll(haircuts);
  const count = haircuts.length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="t-headline">Verdienst</div>
        <div className="t-foot text-[var(--text-3)]">{count} Schnitte gesamt</div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Tile label="Diese Woche" value={week} highlight />
        <Tile label="Dieser Monat" value={month} />
        <Tile label="Gesamt" value={all} />
      </div>
    </Card>
  );
}

function Tile({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div
      className="rounded-[var(--r-md)] p-3.5 border"
      style={{
        background: highlight ? "color-mix(in srgb, var(--teal) 12%, transparent)" : "var(--surface-2)",
        borderColor: highlight ? "color-mix(in srgb, var(--teal) 30%, transparent)" : "var(--border)",
      }}
    >
      <div className="t-title3 tabular leading-none mb-1" style={{ color: highlight ? "var(--teal)" : "var(--text)" }}>
        <CountUp value={value} format={(n) => eur(n)} />
      </div>
      <div className="t-foot text-[var(--text-3)]">{label}</div>
    </div>
  );
}
