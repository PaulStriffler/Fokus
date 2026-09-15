"use client";

import type { ReactNode } from "react";

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3 mt-7 first:mt-0 px-0.5">
      <h2 className="t-title3">{children}</h2>
      {action}
    </div>
  );
}

export function Skeleton({ className = "", h = 120 }: { className?: string; h?: number }) {
  return <div className={["skeleton", className].join(" ")} style={{ height: h }} />;
}
