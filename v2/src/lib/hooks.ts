"use client";

import { useEffect, useState } from "react";
import { useStore } from "./store";

// Modul-weites Flag: nach dem ersten Hydrieren rendern Folge-Seiten sofort
// (kein erneutes Skeleton-Aufblitzen bei jeder Navigation).
let hydratedOnce = false;

/** Rehydrate the persisted store on the client, return readiness flag. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(hydratedOnce);
  useEffect(() => {
    if (hydratedOnce) return;
    const done = () => {
      hydratedOnce = true;
      setHydrated(true);
    };
    useStore.persist.rehydrate();
    const unsub = useStore.persist.onFinishHydration(done);
    if (useStore.persist.hasHydrated()) done();
    return unsub;
  }, []);
  return hydrated;
}

export type Theme = "dark" | "light";

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const t = (document.documentElement.getAttribute("data-theme") as Theme) || "dark";
    setTheme(t);
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("fokus-theme", next);
      } catch {}
      return next;
    });
  };

  return [theme, toggle];
}
