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
