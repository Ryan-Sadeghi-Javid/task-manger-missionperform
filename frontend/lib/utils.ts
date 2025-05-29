// frontend/lib/utils.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to conditionally join class names and intelligently merge Tailwind CSS classes.
 * - `clsx` handles conditional class merging.
 * - `twMerge` resolves conflicting Tailwind class names (e.g., `p-2` vs `p-4`).
 * 
 * @param inputs - List of class values (strings, arrays, or conditional objects)
 * @returns A single merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a Date object or ISO date string into a human-readable date format.
 * Example: "May 28, 2025"
 * 
 * @param date - A Date object or date string
 * @returns A formatted date string in "Month Day, Year" format
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * Shortens a string and appends ellipsis (...) if it exceeds a given length.
 * Prevents UI overflow or long strings from breaking layout.
 * 
 * @param str - The string to be truncated
 * @param length - Maximum allowed length before truncation
 * @returns The original or truncated string
 */
export function truncateString(str: string, length: number): string {
  if (!str) return ""
  return str.length > length ? `${str.substring(0, length)}...` : str
}

/**
 * Returns a debounced version of a given function.
 * Useful for reducing the number of times a function is called (e.g. input events, API requests).
 * 
 * @param fn - The original function to debounce
 * @param ms - Delay time in milliseconds (default: 300ms)
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, ms = 300) {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}
