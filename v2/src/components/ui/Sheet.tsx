"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { spring } from "@/lib/motion";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export function Sheet({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative w-full sm:max-w-md bg-[var(--elevated)] border border-[var(--border)] rounded-t-[var(--r-xl)] sm:rounded-[var(--r-xl)] shadow-[var(--shadow-lg)] max-h-[90vh] overflow-y-auto no-scrollbar"
            style={{ paddingBottom: "max(env(safe-area-inset-bottom), 16px)" }}
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.6 }}
            transition={spring}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 pt-4 pb-3 bg-[var(--elevated)]/90 backdrop-blur-xl">
              <div className="t-title3">{title}</div>
              <button
                aria-label="Schließen"
                onClick={onClose}
                className="grid place-items-center h-8 w-8 rounded-full bg-[var(--surface-2)] text-[var(--text-2)] hover:text-[var(--text)]"
              >
                <X size={17} />
              </button>
            </div>
            <div className="px-5 pt-1">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
