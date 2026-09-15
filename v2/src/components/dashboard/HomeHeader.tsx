"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { greeting } from "@/lib/format";
import { useTheme } from "@/lib/hooks";
import { IconButton } from "@/components/ui/Button";

const NAME = "Paul";

export function HomeHeader() {
  const [theme, toggle] = useTheme();
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
          {greeting()}, {NAME}
        </motion.h1>
      </div>
      <IconButton label="Design wechseln" onClick={toggle} className="mt-1">
        {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
      </IconButton>
    </header>
  );
}
