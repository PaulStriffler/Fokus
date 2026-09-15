"use client";

import { motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, PiggyBank } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { Bar } from "@/components/ui/Bar";
import { useStore } from "@/lib/store";
import { monthSummary, monthLabel, monthKey } from "@/lib/finance";
import { totalMonth } from "@/lib/haircuts";
import { eur, signed } from "@/lib/format";

const PALETTE = [
  "var(--accent)", "var(--orange)", "var(--purple)", "var(--mint)",
  "var(--pink)", "var(--yellow)", "var(--teal)", "var(--green)", "var(--indigo)",
];

export function MonthOverview() {
  const income = useStore((s) => s.income);
  const expenses = useStore((s) => s.expenses);
  const goals = useStore((s) => s.goals);
  const haircuts = useStore((s) => s.haircuts);
  const haareMonth = totalMonth(haircuts);
  const m = monthSummary(income, expenses, monthKey(), haareMonth);

  const positive = m.leftover >= 0;
  const earnedExtra = m.earnedActual - m.earnedPlan;
  const spentExtra = m.spentActual - m.spentPlan;

  return (
    <div className="flex flex-col gap-4">
      {/* Hero: Übrig diesen Monat */}
      <Card>
        <div className="t-foot uppercase tracking-[0.06em] text-[var(--text-3)] mb-1">{monthLabel()}</div>
        <div className="t-foot text-[var(--text-2)]">Übrig diesen Monat</div>
        <div className="t-large leading-tight mb-4" style={{ color: positive ? "var(--text)" : "var(--red)" }}>
          <CountUp value={m.leftover} format={(n) => signed(n)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatTile
            icon={<ArrowUpRight size={16} />}
            label="Verdient"
            value={m.earnedActual}
            sub={earnedExtra > 0.5 ? `Plan ${eur(m.earnedPlan)}` : "wie geplant"}
            color="var(--green)"
          />
          <StatTile
            icon={<ArrowDownRight size={16} />}
            label="Ausgegeben"
            value={m.spentActual}
            sub={Math.abs(spentExtra) > 0.5 ? `Plan ${eur(m.spentPlan)}` : "wie geplant"}
            color="var(--red)"
          />
        </div>

        {haareMonth > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-[var(--r-sm)] bg-[color-mix(in_srgb,var(--teal)_10%,transparent)] px-3.5 py-2.5">
            <span className="h-2 w-2 rounded-full" style={{ background: "var(--teal)" }} />
            <span className="t-foot text-[var(--text-2)] flex-1">davon Haare schneiden</span>
            <span className="t-foot font-[650] tabular" style={{ color: "var(--teal)" }}>{eur(haareMonth)}</span>
          </div>
        )}
      </Card>

      {/* Kategorie-Aufschlüsselung */}
      {m.byCategory.length > 0 && (
        <Card>
          <div className="t-headline mb-4">Wohin dein Geld geht</div>
          <div className="flex h-3 w-full overflow-hidden rounded-full mb-5 bg-[var(--surface-2)]">
            {m.byCategory.map((c, i) => (
              <motion.div
                key={c.category}
                initial={{ width: 0 }}
                animate={{ width: `${c.pct}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
                style={{ background: PALETTE[i % PALETTE.length] }}
              />
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {m.byCategory.map((c, i) => (
              <div key={c.category} className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: PALETTE[i % PALETTE.length] }} />
                <span className="t-callout flex-1">{c.category}</span>
                <span className="t-foot text-[var(--text-3)] tabular w-10 text-right">{c.pct.toFixed(0)}%</span>
                <span className="t-callout font-[620] tabular w-20 text-right">{eur(c.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Sparziele kompakt */}
      {goals.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <PiggyBank size={17} style={{ color: "var(--gold)" }} />
            <span className="t-headline">Sparziele</span>
          </div>
          <div className="flex flex-col gap-3.5">
            {goals.map((g) => {
              const p = g.target > 0 ? g.saved / g.target : 0;
              return (
                <div key={g.id}>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="t-callout">{g.name}</span>
                    <span className="t-foot text-[var(--text-2)] tabular">
                      {eur(g.saved)} <span className="text-[var(--text-3)]">/ {eur(g.target)}</span>
                    </span>
                  </div>
                  <Bar progress={p} color={g.color} />
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
  color: string;
}) {
  return (
    <div className="rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] p-3.5">
      <div className="flex items-center gap-1.5 mb-1.5" style={{ color }}>
        {icon}
        <span className="t-foot font-[600] text-[var(--text-2)]">{label}</span>
      </div>
      <div className="t-title3 tabular leading-none mb-1">
        <CountUp value={value} format={(n) => eur(n)} />
      </div>
      <div className="t-foot text-[var(--text-3)]">{sub}</div>
    </div>
  );
}
