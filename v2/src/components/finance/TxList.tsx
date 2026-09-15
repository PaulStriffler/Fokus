"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Trash2 } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { Segmented } from "@/components/ui/Segmented";
import { Field, TextInput, Select } from "@/components/ui/Field";
import {
  useStore,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  type TxItem,
  type Freq,
} from "@/lib/store";
import { eur, monthly, dateKey, parseKey } from "@/lib/format";
import { spring } from "@/lib/motion";

const FREQS: Freq[] = ["monatlich", "jährlich", "einmalig"];

export function TxList({ kind }: { kind: "income" | "expenses" }) {
  const items = useStore((s) => s[kind]);
  const addTx = useStore((s) => s.addTx);
  const updateTx = useStore((s) => s.updateTx);
  const removeTx = useStore((s) => s.removeTx);

  const cats = kind === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const accent = kind === "income" ? "var(--green)" : "var(--red)";

  const [editing, setEditing] = useState<TxItem | null>(null);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [freq, setFreq] = useState<Freq>("monatlich");
  const [category, setCategory] = useState<string>(cats[0]);
  const [date, setDate] = useState<string>(dateKey());

  const openNew = () => {
    setEditing(null);
    setName("");
    setAmount("");
    setFreq("monatlich");
    setCategory(cats[0]);
    setDate(dateKey());
    setOpen(true);
  };

  const openEdit = (t: TxItem) => {
    setEditing(t);
    setName(t.name);
    setAmount(String(t.amount));
    setFreq(t.freq);
    setCategory(t.category);
    setDate(t.date || dateKey());
    setOpen(true);
  };

  const save = () => {
    const amt = parseFloat(amount.replace(",", ".")) || 0;
    if (!name.trim() || amt <= 0) return;
    const data: Omit<TxItem, "id"> = {
      name: name.trim(),
      amount: amt,
      freq,
      category,
      ...(freq === "einmalig" ? { date } : {}),
    };
    if (editing) updateTx(kind, editing.id, data);
    else addTx(kind, data);
    setOpen(false);
  };

  const del = () => {
    if (editing) removeTx(kind, editing.id);
    setOpen(false);
  };

  const sorted = [...items].sort((a, b) => monthly(b.amount, b.freq) - monthly(a.amount, a.freq));

  return (
    <>
      <div className="flex items-center justify-between mb-3 px-0.5">
        <span className="t-sub text-[var(--text-2)]">{items.length} Einträge</span>
        <Button size="sm" variant="secondary" onClick={openNew}>
          <Plus size={16} /> Hinzufügen
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="t-headline mb-1">Noch nichts erfasst</div>
          <div className="t-callout text-[var(--text-2)] mb-4">
            Trag deine {kind === "income" ? "Einnahmen" : "Ausgaben"} ein, um deinen Cashflow zu sehen.
          </div>
          <Button variant="primary" size="sm" onClick={openNew}>
            <Plus size={16} /> Ersten Eintrag
          </Button>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <AnimatePresence initial={false}>
            {sorted.map((t, i) => (
              <motion.button
                key={t.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                transition={spring}
                onClick={() => openEdit(t)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[var(--surface-hover)]"
                style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
              >
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] t-foot font-[700]"
                  style={{ background: `color-mix(in srgb, ${accent} 15%, transparent)`, color: accent }}
                >
                  {t.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block t-callout font-[600] truncate">{t.name}</span>
                  <span className="block t-foot text-[var(--text-3)]">
                    {t.category} · {t.freq}
                    {t.freq === "einmalig" && t.date
                      ? ` · ${parseKey(t.date).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}`
                      : ""}
                  </span>
                </span>
                <span className="text-right">
                  <span className="block t-callout font-[650] tabular">{eur(t.amount)}</span>
                  {t.freq !== "monatlich" && (
                    <span className="block t-foot text-[var(--text-3)] tabular">
                      {eur(monthly(t.amount, t.freq))}/M
                    </span>
                  )}
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Bearbeiten" : kind === "income" ? "Einnahme" : "Ausgabe"}
      >
        <Field label="Bezeichnung">
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={kind === "income" ? "z. B. Gehalt" : "z. B. Miete"}
            autoFocus
          />
        </Field>
        <Field label="Betrag (€)">
          <TextInput
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            inputMode="decimal"
          />
        </Field>
        <div className="mb-3.5">
          <span className="block t-foot text-[var(--text-2)] mb-1.5 ml-0.5">Häufigkeit</span>
          <Segmented options={FREQS} value={freq} onChange={setFreq} id="freq" />
        </div>
        {freq === "einmalig" && (
          <Field label="Datum">
            <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
        )}
        <Field label="Kategorie">
          <Select value={category} onChange={setCategory} options={cats} />
        </Field>

        <div className="flex gap-2 mt-5 mb-1">
          {editing && (
            <Button variant="danger" onClick={del} aria-label="Löschen">
              <Trash2 size={17} />
            </Button>
          )}
          <Button variant="primary" full onClick={save}>
            {editing ? "Speichern" : "Hinzufügen"}
          </Button>
        </div>
      </Sheet>
    </>
  );
}
