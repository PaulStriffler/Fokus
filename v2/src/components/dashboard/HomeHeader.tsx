"use client";

import Link from "next/link";
import { Moon, Sun, Settings } from "lucide-react";
import { motion } from "motion/react";
import { greeting } from "@/lib/format";
import { useTheme } from "@/lib/hooks";
import { useStore } from "@/lib/store";
import { IconButton } from "@/components/ui/Button";

export function HomeHeader() {
  const [theme, toggle] = useTheme();
  const name = useStore((s) => s.userName);
  const now = new Date();
  const date = now.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });

  return (
    <header className="flex items-start justify-between pt-3 pb-6">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="t-foot uppercase tracking-[0.08em] text-[var(--text-3)] mb-1"
        >
          {date}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="t-large"
        >
          {greeting()}, {name}
        </motion.h1>
      </div>
      <div className="flex items-center gap-1 mt-1">
        <IconButton label="Design wechseln" onClick={toggle}>
          {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
        </IconButton>
        <Link href="/einstellungen" aria-label="Einstellungen" className="grid h-10 w-10 place-items-center rounded-full text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors">
          <Settings size={19} />
        </Link>
      </div>
    </header>
  );
}
