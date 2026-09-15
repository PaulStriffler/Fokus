"use client";

import { GraduationCap } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function WissenPage() {
  return (
    <ComingSoon
      title="Wissen"
      subtitle="Immobilien, Bücher & Skills"
      icon={GraduationCap}
      color="var(--area-education)"
      features={[
        "Immobilien-Vision & Objekte-Recherche",
        "Sparziel-Verknüpfung mit den Finanzen",
        "Lese-Stapel: aktuelle Bücher & Kapitel",
        "ICT/SMC-Lernpfad & Notizen",
        "Wochen-Review mit KI-Coach über alle Bereiche",
      ]}
    />
  );
}
