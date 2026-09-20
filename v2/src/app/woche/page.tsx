"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Skeleton } from "@/components/common/Section";
import { WeekPlan } from "@/components/woche/WeekPlan";
import { useHydrated } from "@/lib/hooks";

export default function WochePage() {
  const hydrated = useHydrated();

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 t-foot font-[600] text-[var(--text-2)] hover:text-[var(--text)] transition-colors pt-3 mb-1"
      >
        <ArrowLeft size={15} /> Start
      </Link>
      <PageHeader title="Wochenplan" subtitle="Was ziehst du jede Woche konstant durch?" />

      {!hydrated ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} h={120} />
          ))}
        </div>
      ) : (
        <WeekPlan />
      )}
    </div>
  );
}
