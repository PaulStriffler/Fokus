import { dateKey, monthKeyOf, weekKeys } from "./format";
import type { Haircut } from "./store";

export type ParsedCut = { client: string; amount: number; date: string };

/** Detect a leading date on a line, e.g. "15.09.2026", "15.9.", "Mo 15.09: …". */
function parseDatePrefix(line: string): { key: string; rest: string } | null {
  const m = line.match(
    /^(?:[A-Za-zÄÖÜäöüß.]+\s+)?(\d{1,2})[.\/-](\d{1,2})(?:[.\/-](\d{2,4}))?\.?\s*[:–—-]?\s*(.*)$/
  );
  if (!m) return null;
  const day = parseInt(m[1], 10);
  const mon = parseInt(m[2], 10);
  if (day < 1 || day > 31 || mon < 1 || mon > 12) return null;
  let year = m[3] ? parseInt(m[3], 10) : new Date().getFullYear();
  if (year < 100) year += 2000;
  const key = `${year}-${String(mon).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return { key, rest: (m[4] || "").trim() };
}

// Wörter, die keine Kunden sind — Summen-/Zeitraum-Zeilen werden ignoriert.
const AGGREGATE_WORDS = new Set([
  "summe", "gesamt", "insgesamt", "total", "zwischensumme", "ges", "sum", "gesammt",
  "monat", "monatlich", "woche", "wöchentlich", "tag", "täglich", "jahr", "durchschnitt",
  "einnahmen", "verdienst", "umsatz", "gewinn",
  "januar", "februar", "märz", "maerz", "april", "mai", "juni", "juli", "august",
  "september", "oktober", "november", "dezember",
  "montag", "dienstag", "mittwoch", "donnerstag", "freitag", "samstag", "sonntag",
]);

function isAggregate(name: string): boolean {
  const words = name.toLowerCase().split(/\s+/);
  return words.some((w) => AGGREGATE_WORDS.has(w));
}

function parseSegment(seg: string): { client: string; amount: number } | null {
  const m = seg
    .trim()
    .match(/^([A-Za-zÄÖÜäöüß.\- ]+?)\s*[:=]?\s*(\d+(?:[.,]\d{1,2})?)\s*(?:€|eur|euro)?$/i);
  if (!m) return null;
  const client = normalizeName(m[1]);
  const amount = parseFloat(m[2].replace(",", "."));
  if (!client || amount <= 0) return null;
  // Nur bezahlte Kunden — Summen-/Zeitraum-Zeilen überspringen.
  if (isAggregate(client)) return null;
  return { client, amount };
}

/**
 * Parse a free-text note into {client, amount, date} entries.
 * - Lines can start with a date ("15.09.2026", "15.9.") which then applies
 *   to the following entries (and any entries on the same line).
 * - Within a line, entries are separated by comma / semicolon / slash.
 * - Lines without a date use `fallbackDate`.
 */
export function parseHaircutNote(text: string, fallbackDate: string): ParsedCut[] {
  const out: ParsedCut[] = [];
  let current = fallbackDate;
  for (const rawLine of text.split(/\n/)) {
    let line = rawLine.trim();
    if (!line) continue;
    const dm = parseDatePrefix(line);
    if (dm) {
      current = dm.key;
      line = dm.rest;
      if (!line) continue;
    }
    for (const seg of line.split(/[,;\/]+/)) {
      const cut = parseSegment(seg);
      if (cut) out.push({ ...cut, date: current });
    }
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
