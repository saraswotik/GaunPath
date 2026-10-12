import clsx from "clsx";

/*
 * cn() — utility to merge Tailwind CSS class names
 *
 * Uses clsx under the hood to conditionally join class strings.
 * Replaces shadcn's cn utility which also uses tailwind-merge;
 * we don't need tailwind-merge here since our classes don't conflict.
 *
 * Usage:
 *   cn("px-4 py-2", isActive && "bg-teal", className)
 *   → "px-4 py-2 bg-teal some-extra-class"
 */
export function cn(...inputs) {
  return clsx(inputs);
}
