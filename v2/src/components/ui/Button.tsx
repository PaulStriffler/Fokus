"use client";

import { motion } from "motion/react";
import { spring } from "@/lib/motion";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 font-[590] select-none rounded-[var(--r-sm)] transition-colors disabled:opacity-40 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-[var(--accent)] text-white hover:brightness-110",
  secondary: "bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-hover)]",
  ghost: "text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]",
  danger: "bg-[color-mix(in_srgb,var(--red)_16%,transparent)] text-[var(--red)] hover:bg-[color-mix(in_srgb,var(--red)_24%,transparent)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[0.85rem]",
  md: "h-11 px-5 text-[0.95rem]",
};

type Props = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  full?: boolean;
  "aria-label"?: string;
};

export function Button({
  children,
  variant = "secondary",
  size = "md",
  onClick,
  type = "button",
  disabled,
  className = "",
  full,
  ...rest
}: Props) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.96 }}
      transition={spring}
      className={[base, variants[variant], sizes[size], full ? "w-full" : "", className].join(" ")}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export function IconButton({
  children,
  onClick,
  label,
  active,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  label: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <motion.button
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      transition={spring}
      className={[
        "grid place-items-center h-10 w-10 rounded-full transition-colors",
        active ? "bg-[var(--surface-2)] text-[var(--text)]" : "text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]",
        className,
      ].join(" ")}
    >
      {children}
    </motion.button>
  );
}
