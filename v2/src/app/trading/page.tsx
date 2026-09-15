"use client";

import { TrendingUp } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function TradingPage() {
  return (
    <ComingSoon
      title="Trading"
      subtitle="FTMO-Fortschritt, Regeln & Journal"
      icon={TrendingUp}
      color="var(--area-trading)"
      features={[
        "FTMO-Kontostand, Ziel & verbleibende Tage",
        "A+-Setup-Checkliste vor jedem Trade abhaken",
        "Regel-Streak: „X Tage regelkonform“",
        "Trades der Woche: W/L & ø RR",
        "Direktlink zur Voice-Journal-App",
      ]}
    />
  );
}
