import {
  Dumbbell, BookOpen, Brain, GlassWater, Users, TrendingUp, Wallet, Heart,
  Moon, Zap, Target, Coffee, Code, Music, Footprints, Apple, Droplet, Pencil,
  Briefcase, GraduationCap, Scissors, Phone, Sparkles, Flame, Bike, Waves,
  Sun, Utensils, Camera, Leaf, type LucideIcon,
} from "lucide-react";

// Kuratiertes Icon-Set für Aktivitäten (key -> Icon).
export const ICONS: Record<string, LucideIcon> = {
  dumbbell: Dumbbell,
  footprints: Footprints,
  bike: Bike,
  waves: Waves,
  book: BookOpen,
  brain: Brain,
  graduation: GraduationCap,
  code: Code,
  pencil: Pencil,
  trending: TrendingUp,
  wallet: Wallet,
  briefcase: Briefcase,
  scissors: Scissors,
  smoothie: GlassWater,
  droplet: Droplet,
  apple: Apple,
  utensils: Utensils,
  coffee: Coffee,
  users: Users,
  phone: Phone,
  heart: Heart,
  leaf: Leaf,
  moon: Moon,
  sun: Sun,
  music: Music,
  camera: Camera,
  flame: Flame,
  zap: Zap,
  target: Target,
  sparkles: Sparkles,
};

export const ICON_KEYS = Object.keys(ICONS);

export function iconFor(key: string | undefined): LucideIcon {
  return (key && ICONS[key]) || Target;
}
