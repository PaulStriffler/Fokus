"use client";

import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  as?: "div" | "button";
};

export function Card({ children, className = "", padded = true, interactive, onClick, as = "div" }: Props) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      variants={fadeUp}
      onClick={onClick}
      whileTap={interactive ? { scale: 0.985 } : undefined}
      className={[
        "card relative overflow-hidden",
        padded ? "p-5" : "",
        interactive ? "cursor-pointer text-left transition-colors hover:bg-[var(--surface-hover)]" : "",
        className,
      ].join(" ")}
    >
      {children}
    </Comp>
  );
}
