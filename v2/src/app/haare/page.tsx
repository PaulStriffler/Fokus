"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { PageHeader } from "@/components/common/PageHeader";
import { Skeleton } from "@/components/common/Section";
import { Segmented } from "@/components/ui/Segmented";
import { Summary } from "@/components/haare/Summary";
import { QuickEntry } from "@/components/haare/QuickEntry";
import { Clients } from "@/components/haare/Clients";
import { DayLog } from "@/components/haare/DayLog";
import { useHydrated } from "@/lib/hooks";

const TABS = ["Eintragen", "Kunden", "Verlauf"] as const;
type Tab = (typeof TABS)[number];

export default function HaarePage() {
  const hydrated = useHydrated();
  const [tab, setTab] = useState<Tab>("Eintragen");

  return (
    <div>
      <PageHeader title="Haare schneiden" subtitle="Kunden, Verdienst & Verlauf" />

      {!hydrated ? (
        <div className="flex flex-col gap-3">
          <Skeleton h={120} />
          <Skeleton h={48} />
          <Skeleton h={220} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Summary />

          <div className="max-w-sm">
            <Segmented options={TABS} value={tab} onChange={setTab} id="haare" />
          </div>

          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3"
          >
            {tab === "Eintragen" && <QuickEntry />}
            {tab === "Kunden" && <Clients />}
            {tab === "Verlauf" && <DayLog />}
          </motion.div>
        </div>
      )}
    </div>
  );
}
