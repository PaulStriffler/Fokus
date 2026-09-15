"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Moon, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { CountUp } from "@/components/ui/CountUp";
import { useStore, type SleepEntry } from "@/lib/store";
import { dateKey, parseKey } from "@/lib/format";
import { spring } from "@/lib/motion";

const GOAL_HOURS = 8;

function hoursBetween(bed: string, wake: string): number {
  const [bh, bm] = bed.split(":").map(Number);
  const [wh, wm] = wake.split(":").map(Number);
  let mins = wh * 60 + wm - (bh * 60 + bm);
  if (mins < 0) mins += 24 * 60;
  return Math.round((mins / 60) * 10) / 10;
}

function last7Keys(): string[] {
  return Array.from({ length: 7 }, (_, i) => dateKey(new Date(Date.now() - (6 - i) * 86400000)));
}

export function SleepCard() {
  const sleep = useStore((s) => s.sleep);
  const setSleep = useStore((s) => s.setSleep);
  const [open, setOpen] = useState(false);
  const [bed, setBed] = useState("23:00");
  const [wake, setWake] = useState("07:00");
  const [quality, setQuality] = useState<1 | 2 | 3 | 4 | 5>(4);

  const keys = last7Keys();
  const todayEntry = sleep[dateKey()];
  const maxHours = Math.max(9, ...keys.map((k) => sleep[k]?.hours || 0));

  const save = () => {
    const entry: SleepEntry = { bed, wake, hours: hoursBetween(bed, wake), quality };
    setSleep(dateKey(), entry);
    setOpen(false);
  };

  return (
    <>
      <Card>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-[11px] bg-[color-mix(in_srgb,var(--indigo)_18%,transparent)]">
              <Moon size={18} style={{ color: "var(--indigo)" }} />
            </div>
            <div>
              <div className="t-headline">Schlaf</div>
              <div className="t-foot text-[var(--text-3)]">Ziel {GOAL_HOURS} h</div>
            </div>
          </div>
          <button
            onClick={() => setOpen(true)}
            aria-label="Schlaf eintragen"
            className="grid h-8 w-8 place-items-center rounded-full bg-[var(--surface-2)] text-[var(--text-2)] hover:text-[var(--text)]"
          >
            <Plus size={17} />
          </button>
        </div>

        <div className="flex items-end gap-1.5 mb-1">
          <CountUp
            value={todayEntry?.hours ?? 0}
            format={(n) => (n ? n.toFixed(1) : "–")}
            className="t-large leading-none"
          />
          {todayEntry && <span className="t-callout text-[var(--text-2)] mb-1">Stunden heute</span>}
          {!todayEntry && <span className="t-callout text-[var(--text-3)] mb-1">noch nicht erfasst</span>}
        </div>

        <div className="mt-5 flex items-end justify-between gap-1.5" style={{ height: 64 }}>
          {keys.map((k, i) => {
            const h = sleep[k]?.hours || 0;
            const isToday = k === dateKey();
            const good = h >= GOAL_HOURS;
            return (
              <div key={k} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex w-full flex-1 items-end justify-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(h / maxHours) * 100}%` }}
                    transition={{ ...spring, delay: i * 0.04 }}
                    className="w-[62%] rounded-full"
                    style={{
                      minHeight: h ? 6 : 3,
                      background: h
                        ? good
                          ? "var(--indigo)"
                          : "color-mix(in srgb, var(--indigo) 55%, transparent)"
                        : "var(--surface-2)",
                      opacity: isToday ? 1 : 0.85,
                    }}
                  />
                </div>
                <span
                  className="t-foot text-[0.6rem]"
                  style={{ color: isToday ? "var(--text-2)" : "var(--text-3)" }}
                >
                  {parseKey(k).toLocaleDateString("de-DE", { weekday: "short" }).slice(0, 2)}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <Sheet open={open} onClose={() => setOpen(false)} title="Schlaf eintragen">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Ins Bett">
            <TextInput type="time" value={bed} onChange={(e) => setBed(e.target.value)} />
          </Field>
          <Field label="Aufgewacht">
            <TextInput type="time" value={wake} onChange={(e) => setWake(e.target.value)} />
          </Field>
        </div>
        <div className="mb-4">
          <span className="block t-foot text-[var(--text-2)] mb-2 ml-0.5">
            Dauer: <span className="text-[var(--text)] font-[600]">{hoursBetween(bed, wake)} h</span>
          </span>
          <span className="block t-foot text-[var(--text-2)] mb-1.5 ml-0.5">Qualität</span>
          <div className="flex gap-2">
            {([1, 2, 3, 4, 5] as const).map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className="flex-1 h-10 rounded-[var(--r-sm)] border transition-colors text-[0.9rem] font-[600]"
                style={{
                  borderColor: quality >= q ? "var(--indigo)" : "var(--border)",
                  background: quality >= q ? "color-mix(in srgb, var(--indigo) 16%, transparent)" : "var(--surface-2)",
                  color: quality >= q ? "var(--text)" : "var(--text-3)",
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
        <Button variant="primary" full onClick={save} className="mb-2">
          Speichern
        </Button>
      </Sheet>
    </>
  );
}
