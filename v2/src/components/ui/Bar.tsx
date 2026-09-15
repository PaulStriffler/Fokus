"use client";

import { motion } from "motion/react";

export function Bar({
  progress,
  color = "var(--accent)",
  height = 8,
  className = "",
}: {
  progress: number; // 0..1
  color?: string;
  height?: number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <div
      className={["w-full overflow-hidden rounded-full bg-[var(--surface-2)]", className].join(" ")}
      style={{ height }}
      role="progressbar"
      aria-valuenow={Math.round(clamped * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${clamped * 100}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
