/**
 * Minimal design tokens shared by the remaining composite primitives.
 * Visual primitives own their classes through `ui-styles.ts`; this file only
 * keeps the tokens still consumed by Alert, Badge and Modal.
 */

export const COLORS = {
  surface: {
    5: "bg-surface/5",
    10: "bg-surface/10",
    20: "bg-surface/20",
    borderLight: "border-surface/10",
    borderMedium: "border-surface/20",
  },
  accent: {
    DEFAULT: "bg-accent",
    text: "text-accent",
    hover: "hover:bg-accent/90",
  },
  text: {
    primary: "text-text-primary",
    secondary: "text-text-secondary",
    muted: "text-text-muted",
    danger: "text-danger",
    warning: "text-warning",
    success: "text-success",
  },
  status: {
    danger: "bg-danger/10 text-danger border-danger/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    success: "bg-success/10 text-success border-success/20",
  },
} as const;

export const SIZING = {
  modal: "p-6 rounded-2xl",
} as const;

export const ANIMATION = {
  transitionColors: "transition-colors duration-200",
} as const;
