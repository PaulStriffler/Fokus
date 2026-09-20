"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Moon, Sun, Trash2, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { Sheet } from "@/components/ui/Sheet";
import { useStore } from "@/lib/store";
import { useHydrated, useTheme } from "@/lib/hooks";

export default function EinstellungenPage() {
  const hydrated = useHydrated();
  const name = useStore((s) => s.userName);
  const setUserName = useStore((s) => s.setUserName);
  const resetAll = useStore((s) => s.resetAll);
  const [theme, toggle] = useTheme();
  const [confirm, setConfirm] = useState(false);

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 t-foot font-[600] text-[var(--text-2)] hover:text-[var(--text)] transition-colors pt-3 mb-1"
      >
        <ArrowLeft size={15} /> Start
      </Link>
      <PageHeader title="Einstellungen" />

      {hydrated && (
        <div className="flex flex-col gap-4">
          <Card>
            <Field label="Dein Name">
              <TextInput value={name} onChange={(e) => setUserName(e.target.value)} placeholder="Dein Name" />
            </Field>
            <p className="t-foot text-[var(--text-3)]">Wird in der Begrüßung angezeigt.</p>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="t-headline mb-0.5">Design</div>
                <div className="t-foot text-[var(--text-3)]">Hell oder dunkel</div>
              </div>
              <Button variant="secondary" onClick={toggle}>
                {theme === "dark" ? <><Sun size={16} /> Hell</> : <><Moon size={16} /> Dunkel</>}
              </Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={16} style={{ color: "var(--red)" }} />
              <span className="t-headline">Alles zurücksetzen</span>
            </div>
            <p className="t-foot text-[var(--text-3)] mb-3">
              Löscht alle deine Daten (Gewohnheiten, Finanzen, Haare, Wissen …) und stellt den Startzustand her.
            </p>
            <Button variant="danger" onClick={() => setConfirm(true)}>
              <Trash2 size={16} /> Zurücksetzen
            </Button>
          </Card>

          <p className="text-center t-foot text-[var(--text-4)] pt-2">Fokus · dein persönliches Betriebssystem</p>
        </div>
      )}

      <Sheet open={confirm} onClose={() => setConfirm(false)} title="Wirklich zurücksetzen?">
        <p className="t-body text-[var(--text-2)] mb-4">
          Alle deine Einträge werden gelöscht. Das kann nicht rückgängig gemacht werden.
        </p>
        <div className="flex gap-2 mb-1">
          <Button variant="secondary" full onClick={() => setConfirm(false)}>
            Abbrechen
          </Button>
          <Button variant="danger" full onClick={() => { resetAll(); setConfirm(false); }}>
            Ja, löschen
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
