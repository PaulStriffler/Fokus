"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Skeleton } from "@/components/common/Section";
import { JournalView } from "@/components/journal/JournalView";
import { useHydrated } from "@/lib/hooks";

export default function JournalPage() {
  const hydrated = useHydrated();
  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 t-foot font-[600] text-[var(--text-2)] hover:text-[var(--text)] transition-colors pt-3 mb-1"
      >
        <ArrowLeft size={15} /> Start
      </Link>
      <PageHeader title="Journal" subtitle="Deine Gedanken & Notizen — alles an einem Ort" />
      {!hydrated ? (
        <div className="flex flex-col gap-3">
          <Skeleton h={140} />
          <Skeleton h={200} />
        </div>
      ) : (
        <JournalView />
      )}
    </div>
  );
}
