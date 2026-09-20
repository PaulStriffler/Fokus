"use client";

import { useState } from "react";
import { PiggyBank, Pencil, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Ring } from "@/components/ui/Ring";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { useStore } from "@/lib/store";
import { weekKeys, eur, parseKey } from "@/lib/format";

export function WeeklySavings() {
  const target = useStore((s) => s.weeklySaveTarget);
  const setTarget = useStore((s) => s.setWeeklySaveTarget);
  const savedMap = useStore((s) => s.weeklySaved);
  const setSaved = useStore((s) => s.setWeeklySaved);

  const wk = weekKeys();
  const weekKey = wk[0];
  const saved = savedMap[weekKey] || 0;
  const ratio = target > 0 ? saved / target : 0;
  const reached = target > 0 && saved >= target;

  const [goalOpen, setGoalOpen] = useState(false);
  const [goalDraft, setGoalDraft] = useState(String(target));
  const [amount, setAmount] = useState("");

  const mondayLabel = parseKey(wk[0]).toLocaleDateString("de-DE", { day: "numeric", month: "short" });
  const sundayLabel = parseKey(wk[6]).toLocaleDateString("de-DE", { day: "numeric", month: "short" });

  const saveAmount = () => {
    const v = parseFloat(amount.replace(",", "."));
    if (!isNaN(v)) setSaved(weekKey, v);
    setAmount("");
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <div className="grid h-9 w-9 place-items-center rounded-[11px] bg-[color-mix(in_srgb,var(--gold)_18%,transparent)]">
          <PiggyBank size={18} style={{ color: "var(--gold)" }} />
        </div>
        <div>
          <div className="t-headline">Wochen-Sparen</div>
          <div className="t-foot text-[var(--text-3)]">{mondayLabel} – {sundayLabel}</div>
        </div>
        <button
          onClick={() => { setGoalDraft(String(target)); setGoalOpen(true); }}
          aria-label="Sparziel ändern"
          className="ml-auto grid h-8 w-8 place-items-center rounded-full text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
        >
          <Pencil size={14} />
        </button>
      </div>

      <div className="flex items-center gap-5">
        <Ring progress={ratio} size={92} stroke={9} color={reached ? "var(--green)" : "var(--gold)"}>
          <div className="text-center">
            <div className="t-title3 leading-none tabular">{Math.round(ratio * 100)}%</div>
          </div>
        </Ring>
        <div className="flex-1 min-w-0">
          <div className="t-foot text-[var(--text-3)] mb-0.5">Diese Woche gespart</div>
          <div className="t-title2 tabular leading-none mb-1" style={{ color: reached ? "var(--green)" : "var(--text)" }}>
            {eur(saved)} <span className="t-callout text-[var(--text-3)]">/ {eur(target)}</span>
          </div>
          {reached && (
            <div className="flex items-center gap-1 t-foot font-[650]" style={{ color: "var(--green)" }}>
              <Check size={13} strokeWidth={3} /> Ziel erreicht
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <TextInput
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && saveAmount()}
          inputMode="decimal"
          placeholder={`Betrag eintragen (aktuell ${eur(saved)})`}
        />
        <Button variant="primary" onClick={saveAmount}>Setzen</Button>
      </div>
      <p className="t-foot text-[var(--text-3)] mt-2">Trag am Ende der Woche ein, wie viel du gespart hast.</p>

      <Sheet open={goalOpen} onClose={() => setGoalOpen(false)} title="Wochen-Sparziel">
        <Field label="Wie viel willst du pro Woche sparen? (€)">
          <TextInput value={goalDraft} onChange={(e) => setGoalDraft(e.target.value)} inputMode="decimal" autoFocus />
        </Field>
        <Button variant="primary" full className="mt-2 mb-1" onClick={() => { setTarget(parseFloat(goalDraft.replace(",", ".")) || 0); setGoalOpen(false); }}>
          Speichern
        </Button>
      </Sheet>
    </Card>
  );
}
