import { Home, Wallet, TrendingUp, HeartPulse, GraduationCap, type LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  color: string;
  ready: boolean;
};

export const NAV: NavItem[] = [
  { href: "/", label: "Start", icon: Home, color: "var(--accent)", ready: true },
  { href: "/finanzen", label: "Finanzen", icon: Wallet, color: "var(--area-finance)", ready: true },
  { href: "/trading", label: "Trading", icon: TrendingUp, color: "var(--area-trading)", ready: false },
  { href: "/koerper", label: "Körper", icon: HeartPulse, color: "var(--area-gym)", ready: false },
  { href: "/wissen", label: "Wissen", icon: GraduationCap, color: "var(--area-education)", ready: false },
];
