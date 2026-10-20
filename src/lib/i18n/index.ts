import { init, register, getLocaleFromNavigator, locale } from "svelte-i18n";
import { invoke } from "@tauri-apps/api/core";

// Register locales
register("en", () => import("./locales/en.json"));
register("es", () => import("./locales/es.json"));

// Language preference is persisted in localStorage because it must be read
// before the encrypted vault is unlocked (the vault-backed preference store is
// unavailable on startup). This mirrors the theme/performance stores.
const LANGUAGE_STORAGE_KEY = "cript_language";
const SUPPORTED_LOCALES = ["en", "es"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

function normalizeLocale(raw: string | null | undefined): SupportedLocale | null {
  if (!raw) return null;
  const base = raw.toLowerCase().split("-")[0];
  return (SUPPORTED_LOCALES as readonly string[]).includes(base)
    ? (base as SupportedLocale)
    : null;
}

function readStoredLocale(): SupportedLocale | null {
  try {
    return normalizeLocale(localStorage.getItem(LANGUAGE_STORAGE_KEY));
  } catch {
    // localStorage unavailable (e.g. during SSR)
    return null;
  }
}

function writeStoredLocale(lang: SupportedLocale): void {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch (e) {
    console.error("Failed to save language preference:", e);
  }
}

let isInitialized = false;

export async function initI18n() {
  if (isInitialized) return;

  // localStorage is the source of truth (readable before the vault is unlocked).
  let initialLocale =
    readStoredLocale() ?? normalizeLocale(getLocaleFromNavigator()) ?? "en";

  // Best-effort fallback to the vault preference (only available after unlock);
  // never blocks startup if the vault is locked or Tauri is unavailable.
  if (!readStoredLocale()) {
    try {
      const savedLanguage = await invoke<string | null>("get_preference", {
        key: "language",
      });
      const vaultLocale = normalizeLocale(savedLanguage);
      if (vaultLocale) {
        initialLocale = vaultLocale;
      }
    } catch {
      // Vault locked or command unavailable — keep the navigator/default locale.
    }
  }

  init({
    fallbackLocale: "en",
    initialLocale,
  });

  isInitialized = true;
}

// Function to change language and persist it
export async function changeLanguage(lang: SupportedLocale) {
  locale.set(lang);
  writeStoredLocale(lang);
  // Best-effort mirror into the vault preferences once it is unlocked.
  try {
    await invoke("set_preference", { key: "language", value: lang });
  } catch (error) {
    console.error("Failed to save language preference:", error);
  }
}

/**
 * Robust translation helper with fallback
 * Usage: t("key", "Default Text")
 */
import { _ } from "svelte-i18n";
import { get } from "svelte/store";

export function t(key: string, defaultText?: string, vars?: any): string {
  const translate = get(_);
  const result = translate(key, vars);
  
  // svelte-i18n returns the key if it's missing
  if (result === key && defaultText) {
    return defaultText;
  }
  
  return result;
}
