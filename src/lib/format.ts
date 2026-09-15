import type { Unit } from "@/types";

const FRACTIONS: [number, string][] = [
  [0.125, "\u215B"],
  [0.25, "\u00BC"],
  [0.333, "\u2153"],
  [0.375, "\u215C"],
  [0.5, "\u00BD"],
  [0.625, "\u215D"],
  [0.666, "\u2154"],
  [0.75, "\u00BE"],
  [0.875, "\u215E"],
];

/** Formats a number as a friendly mixed fraction (1.5 -> 1½). */
export function formatAmount(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "";
  if (value >= 10) return String(Math.round(value));
  const whole = Math.floor(value);
  const frac = value - whole;
  if (frac < 0.06) return String(whole || 0);
  let best = FRACTIONS[0]!;
  let bestDiff = Infinity;
  for (const f of FRACTIONS) {
    const d = Math.abs(f[0] - frac);
    if (d < bestDiff) {
      bestDiff = d;
      best = f;
    }
  }
  if (bestDiff > 0.06) {
    const rounded = Math.round(value * 10) / 10;
    return String(rounded);
  }
  return whole > 0 ? `${whole}${best[1]}` : best[1];
}

const GRAM_UNITS: Unit[] = ["g", "kg", "ml", "L"];

export function scaleAmount(amount: number, from: number, to: number): number {
  if (!from) return amount;
  return (amount * to) / from;
}

export function formatQuantity(
  amount: number | undefined,
  unit: Unit,
): string {
  if (unit === "available") return "Available";
  if (amount === undefined || amount === null) return "";
  if (GRAM_UNITS.includes(unit)) {
    const rounded = amount >= 50 ? Math.round(amount / 5) * 5 : Math.round(amount);
    return `${rounded} ${unit}`;
  }
  const label = formatAmount(amount);
  if (!label) return "";
  if (unit === "pieces") return `${label}`;
  return `${label} ${unit}`;
}

export function relativeDay(iso: string): string {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return "Recently";
  const startOf = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOf(new Date()) - startOf(then)) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "Last week";
  if (days < 60) return `${Math.round(days / 7)} weeks ago`;
  return then.toLocaleDateString();
}

export function daysUntil(iso?: string): number | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const startOf = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  return Math.round((startOf(d) - startOf(new Date())) / 86400000);
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
