"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "motion/react";

type Props = {
  value: number;
  format?: (n: number) => string;
  className?: string;
  duration?: number;
};

export function CountUp({ value, format = (n) => Math.round(n).toString(), className, duration = 0.9 }: Props) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, duration]);

  return <span className={["tabular", className].filter(Boolean).join(" ")}>{format(display)}</span>;
}
