"use client";

import { motion } from "motion/react";
import { spring } from "@/lib/motion";

type Props<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  id?: string;
};

export function Segmented<T extends string>({ options, value, onChange, id }: Props<T>) {
  return (
    <div className="relative flex gap-1 p-1 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)]">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="relative flex-1 py-2 px-3 text-[0.82rem] font-[560] rounded-[calc(var(--r-sm)-3px)] transition-colors z-10"
            style={{ color: active ? "var(--text)" : "var(--text-2)" }}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id || "x"}`}
                className="absolute inset-0 rounded-[calc(var(--r-sm)-3px)] bg-[var(--elevated)] shadow-[var(--shadow-sm)] -z-10 border border-[var(--border)]"
                transition={spring}
              />
            )}
            {opt}
          </button>
        );
      })}
    </div>
  );
}
