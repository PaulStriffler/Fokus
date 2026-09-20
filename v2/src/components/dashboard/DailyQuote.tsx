"use client";

import { motion } from "motion/react";
import { quoteOfTheDay } from "@/lib/quotes";
import { fadeUp } from "@/lib/motion";

export function DailyQuote() {
  return (
    <motion.p
      variants={fadeUp}
      className="px-1 py-2 text-center t-callout italic text-[var(--text-2)] leading-relaxed"
    >
      „{quoteOfTheDay()}"
    </motion.p>
  );
}
