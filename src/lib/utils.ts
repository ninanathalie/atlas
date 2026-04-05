import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names with conflict resolution.
 * Combines clsx (conditional classes) with tailwind-merge (deduplication).
 */
export function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

/**
 * Formats bytes into a human-readable string (e.g., "1.5 MB").
 */
export function formatBytes(bytes: number, decimals = 1): string {
 if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
 const k = 1024;
 const sizes = ["B", "KB", "MB", "GB"];
 const precision = Math.min(100, Math.max(0, Math.trunc(decimals)));
 const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
 return `${parseFloat((bytes / Math.pow(k, i)).toFixed(precision))} ${sizes[i]}`;
}

/**
 * Validates that a URL uses http or https protocol.
 * Prevents XSS/open-redirect from javascript: or other unsafe protocols.
 */
export function isSafeUrl(url: string): boolean {
 try {
  const parsed = new URL(url);
  return parsed.protocol === "http:" || parsed.protocol === "https:";
 } catch {
  return false;
 }
}
