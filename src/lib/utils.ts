import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function sentimentToColor(s: number): string {
  if (s > 0.3) return "#10b981";
  if (s > 0) return "#22d3ee";
  if (s > -0.3) return "#f59e0b";
  return "#ef4444";
}

export function sentimentToLabel(s: number): string {
  if (s > 0.5) return "Very Positive";
  if (s > 0.2) return "Positive";
  if (s > -0.2) return "Neutral";
  if (s > -0.5) return "Negative";
  return "Very Negative";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
