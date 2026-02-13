"use client";

import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "stable";
  icon: LucideIcon;
  color?: string;
}

function BlockBar({ value, total = 20 }: { value: number; total?: number }) {
  const filled = Math.round((value / 100) * total);
  return (
    <div className="flex gap-0.5 mt-2">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn("w-2 h-3", i < filled ? "bg-white" : "bg-white/10")}
          style={
            i < filled
              ? { animation: `fill-block 0.3s ease-out ${i * 50}ms forwards` }
              : undefined
          }
        />
      ))}
    </div>
  );
}

export default function MetricCard({
  label,
  value,
  change,
  trend = "stable",
  icon: Icon,
  color = "text-white",
}: MetricCardProps) {
  const trendColor =
    trend === "up"
      ? "text-green-400"
      : trend === "down"
        ? "text-red-400"
        : "text-white/40";

  // Extract numeric percentage from value for block bar
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
  const showBar = !isNaN(numericValue) && numericValue <= 100;

  return (
    <div className="border border-white/10 bg-black/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-white/40">
          {label}
        </span>
        <Icon className={cn("w-4 h-4", color)} />
      </div>
      <div className="text-2xl font-mono font-bold text-white">{value}</div>
      {change && (
        <div
          className={cn(
            "flex items-center gap-1 mt-1 text-xs font-mono",
            trendColor,
          )}
        >
          {trend === "up" && <TrendingUp className="w-3 h-3" />}
          {trend === "down" && <TrendingDown className="w-3 h-3" />}
          {trend === "stable" && <Minus className="w-3 h-3" />}
          <span>{change}</span>
        </div>
      )}
    </div>
  );
}
