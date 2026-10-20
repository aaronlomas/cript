/**
 * Canonical Tailwind class strings shared by the UI primitives.
 * Centralizing them keeps the visual language consistent and prevents
 * duplicated class strings from growing across feature components.
 */

export const FIELD_STYLES = {
  label: "text-xs font-medium text-text-secondary",
  /** Container for inputs that render leading/trailing icons. */
  box: "grid items-center gap-2 w-full px-3 py-2 bg-surface/5 border border-surface/10 rounded-lg transition-colors focus-within:border-accent/50 focus-within:bg-surface/8",
  input:
    "w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none disabled:cursor-not-allowed disabled:opacity-50",
  textarea:
    "w-full min-h-24 resize-y px-3 py-2 bg-surface/5 border border-surface/10 rounded-lg text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:bg-surface/8 disabled:cursor-not-allowed disabled:opacity-50",
  error: "text-xs text-danger",
} as const;

export const ICON_BUTTON_STYLES = {
  base: "inline-flex items-center justify-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
  variants: {
    default: "text-text-muted hover:text-text-primary rounded-full",
    danger: "text-text-muted hover:text-danger",
    accent: "text-text-muted hover:text-accent",
    ghost: "text-text-secondary hover:text-text-primary",
    primary: "bg-accent text-white",
  },
  sizes: {
    empty: "",
    sm: "p-1.5",
    md: "p-2",
  },
  active: "text-text-primary bg-surface/10",
} as const;

export const MENU_STYLES = {
  panel:
    "absolute z-20 mt-1 min-w-44 overflow-hidden rounded-xl border border-surface/15 bg-panel shadow-2xl shadow-black/30 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150",
  item: "w-full flex items-center gap-2 p-2 px-3 text-sm transition-colors cursor-pointer text-left",
  itemDefault:
    "text-text-secondary hover:bg-surface/10 hover:text-text-primary",
  itemDanger: "text-danger hover:bg-danger/8",
  itemActive: "text-accent bg-accent/5 font-bold",
  separator: "h-px bg-surface/8 mx-2 my-1",
} as const;

export const CHIP_STYLES = {
  base: "inline-flex items-center gap-1 p-2 border text-xs font-semibold leading-none transition-all cursor-pointer",
  active: "bg-accent text-white border-accent shadow-sm shadow-accent/30",
  inactive:
    "bg-surface/5 text-text-muted border-surface/10 hover:border-accent/40 hover:text-text-primary",
} as const;
