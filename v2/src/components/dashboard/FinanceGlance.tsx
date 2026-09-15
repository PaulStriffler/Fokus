"use client";

import Link from "next/link";
import { ArrowUpRight, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { useStore } from "@/lib/store";
import { monthSummary, monthKey } from "@/lib/finance";
import { totalMonth } from "@/lib/haircuts";
import { eur, signed } from "@/lib/format";

export function FinanceGlance() {
  const income = useStore((s) => s.income);
  const expenses = useStore((s) => s.expenses);
  const haircuts = useStore((s) => s.haircuts);
  const { earnedActual, spentActual, leftover } = monthSummary(income, expenses, monthKey(), totalMonth(haircuts));
  const cashflow = leftover;
  const savingsRate = earnedActual > 0 ? (leftover / earnedActual) * 100 : 0;
  const positive = cashflow >= 0;

  return (
    <Card padded={false} className="p-5">
      <Link href="/finanzen" className="block">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-[11px] bg-[color-mix(in_srgb,var(--area-finance)_18%,transparent)]">
              <Wallet size={18} style={{ color: "var(--area-finance)" }} />
            </div>
            <div>
              <div className="t-headline">Finanzen</div>
              <div className="t-foot text-[var(--text-3)]">Monatlicher Überblick</div>
            </div>
          </div>
          <ArrowUpRight size={20} className="text-[var(--text-3)]" />
        </div>

        <div className="flex items-end gap-2 mb-1">
          <span className="t-callout text-[var(--text-2)] mb-1">Cashflow</span>
        </div>
        <div className="flex items-end gap-3 mb-4">
          <CountUp
            value={cashflow}
            format={(n) => signed(n)}
            className="t-large leading-none"
          />
          <span
            className="mb-1 rounded-full px-2 py-0.5 t-foot font-[650]"
            style={{
              color: positive ? "var(--green)" : "var(--red)",
              background: `color-mix(in srgb, ${positive ? "var(--green)" : "var(--red)"} 15%, transparent)`,
            }}
          >
            {savingsRate.toFixed(0)}% Sparquote
          </span>
        </div>

        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[var(--surface-2)] mb-3">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: "var(--red)" }}
            initial={{ width: 0 }}
            animate={{ width: `${earnedActual ? Math.min(100, (spentActual / earnedActual) * 100) : 0}%` }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <div className="flex justify-between t-foot">
          <span className="text-[var(--text-2)]">
            Verdient <span className="text-[var(--text)] font-[600]">{eur(earnedActual)}</span>
          </span>
          <span className="text-[var(--text-2)]">
            Ausgegeben <span className="text-[var(--text)] font-[600]">{eur(spentActual)}</span>
          </span>
        </div>
      </Link>
    </Card>
  );
}
