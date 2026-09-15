"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { spring } from "@/lib/motion";
import { NAV } from "@/lib/nav";

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Hauptnavigation"
      className="fixed inset-x-0 bottom-0 z-40 sm:hidden"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 8px)" }}
    >
      <div className="mx-auto mb-2 flex w-[calc(100%-24px)] max-w-md items-center justify-around rounded-[26px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--elevated)_82%,transparent)] px-1.5 py-1.5 shadow-[var(--shadow-lg)] backdrop-blur-2xl">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="relative flex flex-1 flex-col items-center gap-0.5 rounded-[20px] py-1.5"
            >
              {active && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-[20px] bg-[var(--surface-2)]"
                  transition={spring}
                />
              )}
              <Icon
                size={21}
                className="relative z-10 transition-colors"
                style={{ color: active ? item.color : "var(--text-3)" }}
                strokeWidth={active ? 2.4 : 2}
              />
              <span
                className="relative z-10 text-[0.62rem] font-[560] transition-colors"
                style={{ color: active ? "var(--text)" : "var(--text-3)" }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden sm:flex sm:flex-col sm:w-[236px] sm:shrink-0 sm:h-screen sm:sticky sm:top-0 border-r border-[var(--border)] px-4 py-6">
      <div className="px-2 mb-8 flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-[12px] bg-[var(--accent)] text-white font-bold text-lg">F</div>
        <span className="t-title3">Fokus</span>
      </div>
      <div className="flex flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="relative flex items-center gap-3 rounded-[var(--r-sm)] px-3 py-2.5 transition-colors hover:bg-[var(--surface-2)]"
            >
              {active && (
                <motion.span
                  layoutId="side-pill"
                  className="absolute inset-0 rounded-[var(--r-sm)] bg-[var(--surface-2)]"
                  transition={spring}
                />
              )}
              <Icon
                size={19}
                className="relative z-10"
                style={{ color: active ? item.color : "var(--text-2)" }}
                strokeWidth={active ? 2.4 : 2}
              />
              <span
                className="relative z-10 text-[0.92rem] font-[540]"
                style={{ color: active ? "var(--text)" : "var(--text-2)" }}
              >
                {item.label}
              </span>
              {!item.ready && (
                <span className="relative z-10 ml-auto text-[0.6rem] text-[var(--text-3)] font-[600] uppercase tracking-wide">
                  bald
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
