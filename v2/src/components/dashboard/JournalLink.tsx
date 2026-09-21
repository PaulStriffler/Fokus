"use client";

import Link from "next/link";
import { NotebookPen, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useStore } from "@/lib/store";

export function JournalLink() {
  const journal = useStore((s) => s.journal);
  const latest = journal[0];

  return (
    <Card padded={false} className="p-4">
      <Link href="/journal" className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px] bg-[color-mix(in_srgb,var(--indigo)_16%,transparent)]">
          <NotebookPen size={20} style={{ color: "var(--indigo)" }} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="t-headline">Journal</div>
          <div className="t-foot text-[var(--text-3)] truncate">
            {latest ? latest.text : `${journal.length ? "" : "Noch leer — "}Gedanken & Notizen`}
          </div>
        </div>
        <span className="t-foot text-[var(--text-3)] tabular shrink-0">{journal.length}</span>
        <ChevronRight size={18} className="text-[var(--text-3)] shrink-0" />
      </Link>
    </Card>
  );
}
