"use client";

import { useState } from "react";
import { Target, Pencil } from "lucide-react";
import { motion } from "motion/react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { fadeUp } from "@/lib/motion";

export function NorthStar() {
  const northStar = useStore((s) => s.northStar);
  const setNorthStar = useStore((s) => s.setNorthStar);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(northStar);

  const openEdit = () => {
    setDraft(northStar);
    setOpen(true);
  };

  return (
    <>
      <motion.button
        variants={fadeUp}
        onClick={openEdit}
        className="relative w-full overflow-hidden rounded-[var(--r-lg)] border p-5 text-left"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--accent) 20%, var(--surface)) 0%, var(--surface) 70%)",
          borderColor: "color-mix(in srgb, var(--accent) 30%, var(--border))",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Target size={15} style={{ color: "var(--accent)" }} />
          <span className="t-foot uppercase tracking-[0.08em] text-[var(--accent)] font-[650]">Mein Ziel</span>
          <Pencil size={13} className="ml-auto text-[var(--text-3)]" />
        </div>
        {northStar ? (
          <p className="t-title3 leading-snug">{northStar}</p>
        ) : (
          <p className="t-body text-[var(--text-2)]">
            Worauf arbeitest du hin? Tipp hier dein großes Ziel ein — du siehst es jeden Tag.
          </p>
        )}
      </motion.button>

      <Sheet open={open} onClose={() => setOpen(false)} title="Mein großes Ziel">
        <p className="t-foot text-[var(--text-3)] mb-3">
          Wofür machst du das alles? Schreib es in einem Satz — es steht künftig jeden Morgen ganz oben.
        </p>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          autoFocus
          rows={3}
          placeholder="z. B. 100k FTMO bestehen, ausziehen und finanziell frei sein."
          className="w-full resize-none rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] px-3.5 py-3 text-[0.95rem] outline-none focus:border-[var(--accent)] leading-relaxed mb-1"
        />
        <Button
          variant="primary"
          full
          className="mt-3 mb-1"
          onClick={() => {
            setNorthStar(draft.trim());
            setOpen(false);
          }}
        >
          Speichern
        </Button>
      </Sheet>
    </>
  );
}
