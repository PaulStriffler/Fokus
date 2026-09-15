"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Trash2, Target } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bar } from "@/components/ui/Bar";
import { Sheet } from "@/components/ui/Sheet";
import { Field, TextInput } from "@/components/ui/Field";
import { useStore, type Goal } from "@/lib/store";
import { eur } from "@/lib/format";
import { goalETA } from "@/lib/finance";
import { fadeUp } from "@/lib/motion";

const COLORS = ["var(--green)", "var(--accent)", "var(--gold)", "var(--purple)", "var(--orange)", "var(--mint)"];

export function Goals() {
  const goals = useStore((s) => s.goals);
  const addGoal = useStore((s) => s.addGoal);
  const updateGoal = useStore((s) => s.updateGoal);
  const removeGoal = useStore((s) => s.removeGoal);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [monthlyAmt, setMonthlyAmt] = useState("");

  const openNew = () => {
    setEditing(null);
    setName("");
    setTarget("");
    setSaved("");
    setMonthlyAmt("");
    setOpen(true);
  };

  const openEdit = (g: Goal) => {
    setEditing(g);
    setName(g.name);
    setTarget(String(g.target));
    setSaved(String(g.saved));
    setMonthlyAmt(String(g.monthly));
    setOpen(true);
  };

  const numv = (s: string) => parseFloat(s.replace(",", ".")) || 0;

  const save = () => {
    if (!name.trim() || numv(target) <= 0) return;
    const data = {
      name: name.trim(),
      target: numv(target),
      saved: numv(saved),
      monthly: numv(monthlyAmt),
      color: editing?.color || COLORS[goals.length % COLORS.length],
    };
    if (editing) updateGoal(editing.id, data);
    else addGoal(data);
    setOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-3 px-0.5">
        <span className="t-sub text-[var(--text-2)]">{goals.length} Sparziele</span>
        <Button size="sm" variant="secondary" onClick={openNew}>
          <Plus size={16} /> Neu
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--surface-2)] mx-auto mb-3">
            <Target size={20} className="text-[var(--text-2)]" />
          </div>
          <div className="t-headline mb-1">Kein Sparziel</div>
          <div className="t-callout text-[var(--text-2)] mb-4">Setz dir ein Ziel — z. B. Immobilien-Anzahlung.</div>
          <Button variant="primary" size="sm" onClick={openNew}>
            <Plus size={16} /> Ziel erstellen
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {goals.map((g) => {
            const p = g.target > 0 ? g.saved / g.target : 0;
            return (
              <motion.div key={g.id} variants={fadeUp}>
                <Card as="button" interactive onClick={() => openEdit(g)} className="w-full">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="t-headline">{g.name}</span>
                    <span className="t-callout font-[650] tabular">{Math.round(p * 100)}%</span>
                  </div>
                  <Bar progress={p} color={g.color} className="mb-2.5" />
                  <div className="flex items-center justify-between t-foot">
                    <span className="text-[var(--text-2)] tabular">
                      {eur(g.saved)} <span className="text-[var(--text-3)]">/ {eur(g.target)}</span>
                    </span>
                    <span className="text-[var(--text-3)]">{goalETA(g)}</span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <Sheet open={open} onClose={() => setOpen(false)} title={editing ? "Sparziel bearbeiten" : "Neues Sparziel"}>
        <Field label="Name">
          <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Immobilien-Anzahlung" autoFocus />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Zielbetrag (€)">
            <TextInput value={target} onChange={(e) => setTarget(e.target.value)} inputMode="decimal" placeholder="40000" />
          </Field>
          <Field label="Bereits gespart (€)">
            <TextInput value={saved} onChange={(e) => setSaved(e.target.value)} inputMode="decimal" placeholder="0" />
          </Field>
        </div>
        <Field label="Monatliche Sparrate (€)">
          <TextInput value={monthlyAmt} onChange={(e) => setMonthlyAmt(e.target.value)} inputMode="decimal" placeholder="400" />
        </Field>

        <div className="flex gap-2 mt-5 mb-1">
          {editing && (
            <Button variant="danger" onClick={() => { removeGoal(editing.id); setOpen(false); }} aria-label="Löschen">
              <Trash2 size={17} />
            </Button>
          )}
          <Button variant="primary" full onClick={save}>
            {editing ? "Speichern" : "Erstellen"}
          </Button>
        </div>
      </Sheet>
    </>
  );
}
