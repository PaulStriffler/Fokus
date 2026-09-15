"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { NAV } from "@/lib/nav";
import { fadeUp } from "@/lib/motion";

const SUBTITLE: Record<string, string> = {
  "/trading": "FTMO · Regeln · Journal",
  "/koerper": "Gym · Ernährung · Schlaf",
  "/wissen": "Immobilien · Bücher · Skills",
};

export function AreasGrid() {
  const areas = NAV.filter((n) => n.href !== "/" && n.href !== "/finanzen");

  return (
    <div className="grid grid-cols-2 gap-3">
      {areas.map((a) => {
        const Icon = a.icon;
        return (
          <motion.div key={a.href} variants={fadeUp}>
            <Link
              href={a.href}
              className="group relative block h-full overflow-hidden rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:bg-[var(--surface-hover)]"
            >
              <div
                className="grid h-10 w-10 place-items-center rounded-[12px] mb-8"
                style={{ background: `color-mix(in srgb, ${a.color} 16%, transparent)` }}
              >
                <Icon size={20} style={{ color: a.color }} />
              </div>
              <div className="t-headline mb-0.5">{a.label}</div>
              <div className="t-foot text-[var(--text-3)] leading-snug">{SUBTITLE[a.href]}</div>
              {!a.ready && (
                <span className="absolute right-3 top-3 rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-[0.58rem] font-[650] uppercase tracking-wide text-[var(--text-3)]">
                  bald
                </span>
              )}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
