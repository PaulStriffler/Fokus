"use client";

import type { ReactNode } from "react";
import { Sidebar, TabBar } from "./TabBar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="relative flex-1 min-w-0">
        <div
          className="mx-auto w-full max-w-[var(--content-max)] px-4 sm:px-8"
          style={{
            paddingTop: "max(env(safe-area-inset-top), 20px)",
            paddingBottom: "calc(var(--tabbar-h) + 32px)",
          }}
        >
          {children}
        </div>
        <TabBar />
      </main>
    </div>
  );
}
