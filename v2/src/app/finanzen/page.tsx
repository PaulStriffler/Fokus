"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PageHeader } from "@/components/common/PageHeader";
import { Skeleton } from "@/components/common/Section";
import { Segmented } from "@/components/ui/Segmented";
import { SummaryHero } from "@/components/finance/SummaryHero";
import { CategoryBreakdown } from "@/components/finance/CategoryBreakdown";
import { TxList } from "@/components/finance/TxList";
import { Goals } from "@/components/finance/Goals";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/hooks";
import { summarize } from "@/lib/finance";

const TABS = ["Ausgaben", "Einnahmen", "Sparziele"] as const;
type Tab = (typeof TABS)[number];

export default function FinanzenPage() {
  const hydrated = useHydrated();
  const income = useStore((s) => s.income);
  const expenses = useStore((s) => s.expenses);
  const [tab, setTab] = useState<Tab>("Ausgaben");

  const s = summarize(income, expenses);

  return (
    <div>
      <PageHeader title="Finanzen" subtitle="Dein monatlicher Cashflow & Sparplan" />

      {!hydrated ? (
        <div className="flex flex-col gap-3">
          <Skeleton h={168} />
          <Skeleton h={48} />
          <Skeleton h={220} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <SummaryHero s={s} />

          <div className="max-w-sm">
            <Segmented options={TABS} value={tab} onChange={setTab} id="fin" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-4"
            >
              {tab === "Ausgaben" && (
                <>
                  <CategoryBreakdown s={s} />
                  <TxList kind="expenses" />
                </>
              )}
              {tab === "Einnahmen" && <TxList kind="income" />}
              {tab === "Sparziele" && <Goals />}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
