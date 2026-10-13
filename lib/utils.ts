import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatPercent(num: number): string {
  return `${Math.round(num * 100)}%`;
}

export function formatSentimentScore(score: number): string {
  const sign = score > 0 ? "+" : "";
  return `${sign}${score.toFixed(2)}`;
}

export function formatDate(dateString: string | Date): string {
  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  } catch {
    return String(dateString);
  }
}
