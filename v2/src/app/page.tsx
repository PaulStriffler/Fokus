"use client";

import { motion } from "motion/react";
import { HomeHeader } from "@/components/dashboard/HomeHeader";
import { NorthStar } from "@/components/dashboard/NorthStar";
import { DailyQuote } from "@/components/dashboard/DailyQuote";
import { FocusToday } from "@/components/dashboard/FocusToday";
import { DailyFocus } from "@/components/dashboard/DailyFocus";
import { FocusTimer } from "@/components/dashboard/FocusTimer";
import { Reflection } from "@/components/dashboard/Reflection";
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
          <Skeleton h={96} />
          <Skeleton h={90} />
          <Skeleton h={260} />
        </div>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col">
          <div className="mb-2">
            <NorthStar />
          </div>
          <DailyQuote />

          <SectionTitle>Fokus heute</SectionTitle>
          <FocusToday />

          <SectionTitle>Heute durchziehen</SectionTitle>
          <DailyFocus />

          <SectionTitle>Konzentration</SectionTitle>
          <FocusTimer />

          <SectionTitle>Aufgaben</SectionTitle>
          <TodoCard />

          <SectionTitle>Tagesabschluss</SectionTitle>
          <Reflection />

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
