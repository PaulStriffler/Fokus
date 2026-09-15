import type { Transition, Variants } from "motion/react";

export const spring: Transition = { type: "spring", stiffness: 380, damping: 32, mass: 0.9 };
export const springSoft: Transition = { type: "spring", stiffness: 220, damping: 28 };
export const ease: Transition = { duration: 0.32, ease: [0.22, 1, 0.36, 1] };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: ease },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: spring },
};

export const pressable = {
  whileTap: { scale: 0.97 },
  transition: spring,
};
