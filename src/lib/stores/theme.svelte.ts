// ─── Types ────────────────────────────────────────────────────────────────────

export type ColorScheme = "dark" | "light" | "system";

export interface ThemeState {
  colorScheme: ColorScheme;
}

// ─── Constants & Helpers ──────────────────────────────────────────────────────

const STORAGE_KEY = "cript_theme_settings";

const BRAND_ACCENT = "#7c3aed";
const BRAND_ACCENT_LIGHT = "#a78bfa";
const BRAND_ACCENT_GLOW = "rgba(124, 58, 237, 0.35)";
const BRAND_ACCENT_DIM = "rgba(124, 58, 237, 0.15)";

/**
 * Resolves whether the active visual mode is dark, accounting for system preferences.
 */
function resolveIsDark(scheme: ColorScheme): boolean {
  if (typeof window === "undefined") return true;
  if (scheme === "system") {
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true;
  }
  return scheme === "dark";
}

/**
 * Persist the theme state to localStorage.
 */
function persistState(state: ThemeState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save theme to localStorage:", e);
  }
}

// ─── Theme Store ──────────────────────────────────────────────────────────────

class ThemeStore {
  colorScheme = $state<ColorScheme>("dark");

  get isDark(): boolean {
    return resolveIsDark(this.colorScheme);
  }

  applyToDom(): void {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const dark = this.isDark;

    root.classList.toggle("light-mode", !dark);

    // Accent colors (consistent Cript violet branding)
    root.style.setProperty("--color-accent", BRAND_ACCENT);
    root.style.setProperty("--color-accent-light", BRAND_ACCENT_LIGHT);
    root.style.setProperty("--color-accent-glow", BRAND_ACCENT_GLOW);
    root.style.setProperty("--color-accent-dim", BRAND_ACCENT_DIM);

    // Surface and typography contrast
    if (dark) {
      root.style.setProperty("--text-primary", "#ffffff");
      root.style.setProperty("--text-secondary", "#9999a3");
      root.style.setProperty("--bg-solid-color", "#07070e");
      root.style.setProperty(
        "--bg-image-layer",
        "radial-gradient(ellipse 80% 60% at 50% -10%, #17112c 0%, #07070e 100%)"
      );
    } else {
      root.style.setProperty("--text-primary", "#0f172a");
      root.style.setProperty("--text-secondary", "#475569");
      root.style.setProperty("--bg-solid-color", "#f8fafc");
      root.style.setProperty(
        "--bg-image-layer",
        "radial-gradient(ellipse 80% 60% at 50% -10%, #ede9fe 0%, #f8fafc 100%)"
      );
    }
  }

  async init(): Promise<void> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<ThemeState>;
        if (
          parsed.colorScheme === "dark" ||
          parsed.colorScheme === "light" ||
          parsed.colorScheme === "system"
        ) {
          this.colorScheme = parsed.colorScheme;
        } else {
          this.colorScheme = "dark";
        }
      } else {
        this.colorScheme = "dark";
      }

      this.applyToDom();

      if (typeof window !== "undefined" && window.matchMedia) {
        window
          .matchMedia("(prefers-color-scheme: dark)")
          .addEventListener("change", () => {
            if (this.colorScheme === "system") {
              this.applyToDom();
            }
          });
      }
    } catch (e) {
      console.warn("Could not load theme preferences from localStorage:", e);
      this.colorScheme = "dark";
      this.applyToDom();
    }
  }

  async setColorScheme(scheme: ColorScheme): Promise<void> {
    this.colorScheme = scheme;
    this.applyToDom();
    persistState({ colorScheme: scheme });
  }

  async resetToDefaults(): Promise<void> {
    this.colorScheme = "dark";
    this.applyToDom();
    persistState({ colorScheme: "dark" });
  }
}

export const themeStore = new ThemeStore();
