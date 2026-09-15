"use client";

import { HeartPulse } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function KoerperPage() {
  return (
    <ComingSoon
      title="Körper"
      subtitle="Gym, Ernährung & Schlaf"
      icon={HeartPulse}
      color="var(--area-gym)"
      features={[
        "Trainingsplan mit Split-Rotation (Push/Pull/Legs)",
        "Übungs-Log mit Gewicht × Wdh. & Progression",
        "Ernährung: Kalorien, Protein & Wasser tracken",
        "Meal-Voice: „150g Reis + 200g Hähnchen“ → KI schätzt",
        "Schlaf-Verlauf & Wochendurchschnitt",
      ]}
    />
  );
}
