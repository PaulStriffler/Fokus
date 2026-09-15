const EUR = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const EUR2 = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const NUM = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 });

export const eur = (n: number, decimals = false) => (decimals ? EUR2 : EUR).format(n || 0);
export const num = (n: number) => NUM.format(n || 0);
export const pct = (n: number, digits = 0) =>
  `${n >= 0 ? "" : ""}${n.toLocaleString("de-DE", { maximumFractionDigits: digits })} %`;

export const signed = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${eur(Math.abs(n))}`;

/** Local YYYY-MM-DD key, timezone-safe (never use new Date(str)). */
export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse a YYYY-MM-DD key back into a local Date. */
export function parseKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function greeting(d: Date = new Date()): string {
  const h = d.getHours();
  if (h < 5) return "Gute Nacht";
  if (h < 11) return "Guten Morgen";
  if (h < 17) return "Guten Tag";
  if (h < 22) return "Guten Abend";
  return "Gute Nacht";
}

/** dateKeys Monday..Sunday of the week containing `d` (local). */
export function weekKeys(d: Date = new Date()): string[] {
  const day = (d.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(d);
  monday.setDate(d.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(monday);
    x.setDate(monday.getDate() + i);
    return dateKey(x);
  });
}

export function relativeDay(key: string): string {
  const today = dateKey();
  if (key === today) return "Heute";
  const yesterday = dateKey(new Date(Date.now() - 86400000));
  if (key === yesterday) return "Gestern";
  return parseKey(key).toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" });
}

/** Normalize any recurrence to a monthly amount. */
export function monthly(amount: number, freq: "monatlich" | "jährlich" | "einmalig"): number {
  if (freq === "monatlich") return amount;
  if (freq === "jährlich") return amount / 12;
  return 0; // einmalig doesn't count toward recurring cashflow
}
