"use client";

import { motion } from "motion/react";
import { Check, type LucideIcon } from "lucide-react";
import { PageHeader } from "./PageHeader";
import { fadeUp, stagger } from "@/lib/motion";

export function ComingSoon({
  title,
  subtitle,
  icon: Icon,
  color,
  features,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  features: string[];
}) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />

      <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-4">
        <motion.div variants={fadeUp} className="card p-8 text-center">
          <div
            className="grid h-16 w-16 place-items-center rounded-[20px] mx-auto mb-4"
            style={{ background: `color-mix(in srgb, ${color} 16%, transparent)` }}
          >
            <Icon size={30} style={{ color }} />
          </div>
          <div className="t-title3 mb-1.5">In Arbeit</div>
          <div className="t-callout text-[var(--text-2)] max-w-xs mx-auto">
            Dieser Bereich wird als Nächstes gebaut. So sieht der Plan aus:
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="card p-2">
          {features.map((f, i) => (
            <div
              key={f}
              className="flex items-center gap-3 px-3 py-3"
              style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
            >
              <span
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full"
                style={{ background: `color-mix(in srgb, ${color} 18%, transparent)` }}
              >
                <Check size={13} style={{ color }} strokeWidth={3} />
              </span>
              <span className="t-callout">{f}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
