"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PageHeader } from "@/components/common/PageHeader";
import { Skeleton } from "@/components/common/Section";
import { Segmented } from "@/components/ui/Segmented";
import { MonthOverview } from "@/components/finance/MonthOverview";
import { TxList } from "@/components/finance/TxList";
import { Goals } from "@/components/finance/Goals";
import { useHydrated } from "@/lib/hooks";

const TABS = ["Übersicht", "Ausgaben", "Einnahmen", "Sparziele"] as const;
type Tab = (typeof TABS)[number];

export default function FinanzenPage() {
  const hydrated = useHydrated();
  const [tab, setTab] = useState<Tab>("Übersicht");

  return (
    <div>
      <PageHeader title="Finanzen" subtitle="Dein Monat, dein Plan, dein Sparziel" />

      {!hydrated ? (
        <div className="flex flex-col gap-3">
          <Skeleton h={48} />
          <Skeleton h={200} />
          <Skeleton h={220} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="min-w-[380px] sm:min-w-0 sm:max-w-lg">
              <Segmented options={TABS} value={tab} onChange={setTab} id="fin" />
            </div>
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
              {tab === "Übersicht" && <MonthOverview />}
              {tab === "Ausgaben" && <TxList kind="expenses" />}
              {tab === "Einnahmen" && <TxList kind="income" />}
              {tab === "Sparziele" && <Goals />}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
