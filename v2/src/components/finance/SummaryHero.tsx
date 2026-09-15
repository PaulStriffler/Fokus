"use client";

import { Card } from "@/components/ui/Card";
import { Ring } from "@/components/ui/Ring";
import { CountUp } from "@/components/ui/CountUp";
import type { FinanceSummary } from "@/lib/finance";
import { eur, signed } from "@/lib/format";

export function SummaryHero({ s }: { s: FinanceSummary }) {
  const positive = s.cashflow >= 0;
  const ringColor = positive ? "var(--green)" : "var(--red)";
  const rate = Math.max(0, Math.min(100, s.savingsRate));

  return (
    <Card className="p-5">
      <div className="flex items-center gap-5">
        <Ring progress={rate / 100} size={104} stroke={9} color={ringColor}>
          <div className="text-center">
            <div className="t-title2 leading-none">
              <CountUp value={rate} format={(n) => `${Math.round(n)}`} />
              <span className="t-callout text-[var(--text-2)]">%</span>
            </div>
            <div className="t-foot text-[var(--text-3)] mt-0.5">Sparquote</div>
          </div>
        </Ring>

        <div className="flex-1 min-w-0">
          <div className="t-foot text-[var(--text-3)] mb-0.5">Monatlicher Cashflow</div>
          <div className="t-title1 leading-tight mb-3" style={{ color: positive ? "var(--text)" : "var(--red)" }}>
            <CountUp value={s.cashflow} format={(n) => signed(n)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Row label="Einnahmen" value={eur(s.incomeMonthly)} dot="var(--green)" />
            <Row label="Ausgaben" value={eur(s.expenseMonthly)} dot="var(--red)" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function Row({ label, value, dot }: { label: string; value: string; dot: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 t-callout text-[var(--text-2)]">
        <span className="h-2 w-2 rounded-full" style={{ background: dot }} />
        {label}
      </span>
      <span className="t-callout font-[620] tabular">{value}</span>
    </div>
  );
}
