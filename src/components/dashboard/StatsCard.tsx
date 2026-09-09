import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatsCard({
  icon: Icon,
  label,
  value,
  accent = "cyan",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accent?: "cyan" | "electric" | "violet";
}) {
  const accentClass = { cyan: "text-cyan", electric: "text-electric", violet: "text-violet" }[accent];
  return (
    <div className="card-surface rounded-2xl p-6">
      <Icon className={cn("h-5 w-5", accentClass)} />
      <div className="mt-4 font-display text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-sm text-white/45">{label}</div>
    </div>
  );
}
