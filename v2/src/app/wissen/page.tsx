"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PageHeader } from "@/components/common/PageHeader";
import { Skeleton } from "@/components/common/Section";
import { Segmented } from "@/components/ui/Segmented";
import { Academy } from "@/components/wissen/Academy";
import { Reading } from "@/components/wissen/Reading";
import { useHydrated } from "@/lib/hooks";

const TABS = ["Academy", "Lesen"] as const;
type Tab = (typeof TABS)[number];

export default function WissenPage() {
  const hydrated = useHydrated();
  const [tab, setTab] = useState<Tab>("Academy");

  return (
    <div>
      <PageHeader title="Wissen" subtitle="Academy & Lese-Ziel" />

      {!hydrated ? (
        <div className="flex flex-col gap-3">
          <Skeleton h={48} />
          <Skeleton h={260} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="max-w-xs">
            <Segmented options={TABS} value={tab} onChange={setTab} id="wissen" />
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
              {tab === "Academy" ? <Academy /> : <Reading />}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
