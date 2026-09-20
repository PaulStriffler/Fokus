"use client";

import { motion } from "motion/react";
import { HomeHeader } from "@/components/dashboard/HomeHeader";
import { DailyFocus } from "@/components/dashboard/DailyFocus";
import { SleepCard } from "@/components/dashboard/SleepCard";
import { TodoCard } from "@/components/dashboard/TodoCard";
import { FinanceGlance } from "@/components/dashboard/FinanceGlance";
import { AreasGrid } from "@/components/dashboard/AreasGrid";
import { SectionTitle, Skeleton } from "@/components/common/Section";
import { useHydrated } from "@/lib/hooks";
import { stagger } from "@/lib/motion";

export default function Home() {
  const hydrated = useHydrated();

  return (
    <div>
      <HomeHeader />

      {!hydrated ? (
        <div className="flex flex-col gap-3">
          <Skeleton h={200} />
          <Skeleton h={210} />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton h={128} />
            <Skeleton h={128} />
          </div>
        </div>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col">
          <SectionTitle>Heute durchziehen</SectionTitle>
          <DailyFocus />

          <SectionTitle>Aufgaben</SectionTitle>
          <TodoCard />

          <SectionTitle>Schlaf</SectionTitle>
          <SleepCard />

          <SectionTitle>Geld</SectionTitle>
          <FinanceGlance />

          <SectionTitle>Deine Bereiche</SectionTitle>
          <AreasGrid />
        </motion.div>
      )}
    </div>
  );
}
