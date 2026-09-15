import { dateKey, monthKeyOf, weekKeys } from "./format";
import type { Haircut } from "./store";

export type ParsedCut = { client: string; amount: number };

/**
 * Parse a free-text note like "Nikolas 15, Peter 20 Frank 15" into
 * {client, amount} pairs. Splits on comma / newline / semicolon / slash,
 * then reads "<name> <number>" from each segment.
 */
export function parseHaircutNote(text: string): ParsedCut[] {
  const out: ParsedCut[] = [];
  const segments = text.split(/[,;\n\/]+/);
  for (const raw of segments) {
    const seg = raw.trim();
    if (!seg) continue;
    // name (letters/spaces/hyphen) followed by a number, optional € / euro
    const m = seg.match(/^([A-Za-zÄÖÜäöüß.\- ]+?)\s*[:=]?\s*(\d+(?:[.,]\d{1,2})?)\s*(?:€|eur|euro)?$/i);
    if (!m) continue;
    const client = normalizeName(m[1]);
    const amount = parseFloat(m[2].replace(",", "."));
    if (client && amount > 0) out.push({ client, amount });
  }
  return out;
}

export function normalizeName(raw: string): string {
  const n = raw.trim().replace(/\s+/g, " ");
  if (!n) return "";
  return n
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export type ClientSummary = {
  client: string;
  total: number;
  count: number;
  first: string; // dateKey
  last: string; // dateKey
};

export function clientSummaries(haircuts: Haircut[]): ClientSummary[] {
  const map = new Map<string, ClientSummary>();
  for (const h of haircuts) {
    const key = h.client;
    const cur = map.get(key);
    if (!cur) {
      map.set(key, { client: key, total: h.amount, count: 1, first: h.date, last: h.date });
    } else {
      cur.total += h.amount;
      cur.count += 1;
      if (h.date < cur.first) cur.first = h.date;
      if (h.date > cur.last) cur.last = h.date;
    }
  }
  return [...map.values()].sort((a, b) => b.total - a.total);
}

export function totalAll(haircuts: Haircut[]): number {
  return haircuts.reduce((s, h) => s + h.amount, 0);
}

export function totalMonth(haircuts: Haircut[], mk: string = monthKeyOf()): number {
  return haircuts.reduce((s, h) => s + (h.date.startsWith(mk) ? h.amount : 0), 0);
}

export function totalWeek(haircuts: Haircut[]): number {
  const wk = new Set(weekKeys());
  return haircuts.reduce((s, h) => s + (wk.has(h.date) ? h.amount : 0), 0);
}

/** Group haircuts by day (newest first). */
export function byDay(haircuts: Haircut[]): { date: string; cuts: Haircut[]; total: number }[] {
  const map = new Map<string, Haircut[]>();
  for (const h of haircuts) {
    const arr = map.get(h.date) || [];
    arr.push(h);
    map.set(h.date, arr);
  }
  return [...map.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([date, cuts]) => ({ date, cuts, total: cuts.reduce((s, c) => s + c.amount, 0) }));
}

export const today = () => dateKey();
