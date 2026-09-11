import type {
  CookingHistoryEntry,
  IngredientInventory,
  Preferences,
} from "@/types";

export const STORAGE_KEYS = {
  ingredients: "ckp_ingredients",
  saved: "ckp_saved_recipes",
  history: "ckp_cooking_history",
  preferences: "ckp_preferences",
  onboarding: "ckp_onboarding_complete",
} as const;

const isBrowser = () => typeof window !== "undefined" && !!window.localStorage;

export function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed === null || parsed === undefined) return fallback;
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — keep the app running */
  }
}

export const DEFAULT_PREFERENCES: Preferences = {
  appearance: "system",
  measurement: "metric",
};

function sanitizeInventory(items: unknown): IngredientInventory[] {
  if (!Array.isArray(items)) return [];
  return items.filter(
    (i): i is IngredientInventory =>
      !!i &&
      typeof i === "object" &&
      typeof (i as IngredientInventory).id === "string" &&
      typeof (i as IngredientInventory).ingredientId === "string" &&
      typeof (i as IngredientInventory).name === "string",
  );
}

function sanitizeHistory(items: unknown): CookingHistoryEntry[] {
  if (!Array.isArray(items)) return [];
  return items.filter(
    (i): i is CookingHistoryEntry =>
      !!i &&
      typeof i === "object" &&
      typeof (i as CookingHistoryEntry).recipeId === "string" &&
      typeof (i as CookingHistoryEntry).cookedAt === "string",
  );
}

function sanitizeSaved(items: unknown): string[] {
  if (!Array.isArray(items)) return [];
  return items.filter((i): i is string => typeof i === "string");
}

export const storage = {
  loadIngredients: () =>
    sanitizeInventory(readJSON<unknown>(STORAGE_KEYS.ingredients, [])),
  saveIngredients: (v: IngredientInventory[]) =>
    writeJSON(STORAGE_KEYS.ingredients, v),

  loadSaved: () => sanitizeSaved(readJSON<unknown>(STORAGE_KEYS.saved, [])),
  saveSaved: (v: string[]) => writeJSON(STORAGE_KEYS.saved, v),

  loadHistory: () => sanitizeHistory(readJSON<unknown>(STORAGE_KEYS.history, [])),
  saveHistory: (v: CookingHistoryEntry[]) => writeJSON(STORAGE_KEYS.history, v),

  loadPreferences: (): Preferences => {
    const p = readJSON<Partial<Preferences>>(STORAGE_KEYS.preferences, {});
    return {
      appearance:
        p.appearance === "light" || p.appearance === "dark" || p.appearance === "system"
          ? p.appearance
          : DEFAULT_PREFERENCES.appearance,
      measurement:
        p.measurement === "imperial" ? "imperial" : DEFAULT_PREFERENCES.measurement,
    };
  },
  savePreferences: (v: Preferences) => writeJSON(STORAGE_KEYS.preferences, v),

  loadOnboarding: () => readJSON<boolean>(STORAGE_KEYS.onboarding, false) === true,
  saveOnboarding: (v: boolean) => writeJSON(STORAGE_KEYS.onboarding, v),

  clearAll: () => {
    if (!isBrowser()) return;
    Object.values(STORAGE_KEYS).forEach((k) => {
      try {
        window.localStorage.removeItem(k);
      } catch {
        /* ignore */
      }
    });
  },
};

export interface ExportBundle {
  app: "cooking-kitchen-partners";
  version: 1;
  exportedAt: string;
  ingredients: IngredientInventory[];
  savedRecipes: string[];
  cookingHistory: CookingHistoryEntry[];
  preferences: Preferences;
}

export function buildExport(): ExportBundle {
  return {
    app: "cooking-kitchen-partners",
    version: 1,
    exportedAt: new Date().toISOString(),
    ingredients: storage.loadIngredients(),
    savedRecipes: storage.loadSaved(),
    cookingHistory: storage.loadHistory(),
    preferences: storage.loadPreferences(),
  };
}

export function parseImport(raw: string):
  | { ok: true; data: ExportBundle }
  | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return { ok: false, error: "That file doesn't look like a backup file." };
    }
    const data: ExportBundle = {
      app: "cooking-kitchen-partners",
      version: 1,
      exportedAt: new Date().toISOString(),
      ingredients: sanitizeInventory(parsed.ingredients),
      savedRecipes: sanitizeSaved(parsed.savedRecipes),
      cookingHistory: sanitizeHistory(parsed.cookingHistory),
      preferences: {
        appearance:
          parsed?.preferences?.appearance === "light" ||
          parsed?.preferences?.appearance === "dark"
            ? parsed.preferences.appearance
            : "system",
        measurement:
          parsed?.preferences?.measurement === "imperial" ? "imperial" : "metric",
      },
    };
    return { ok: true, data };
  } catch {
    return { ok: false, error: "That file could not be read." };
  }
}
