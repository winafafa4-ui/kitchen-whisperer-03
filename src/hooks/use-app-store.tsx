import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CATALOG_BY_ID } from "@/data/ingredients";
import { RECIPE_BY_ID } from "@/data/recipes";
import { buildAvailableSet } from "@/lib/matching";
import { storage } from "@/lib/storage";
import { slugify } from "@/lib/format";
import type {
  CookingHistoryEntry,
  IngredientInventory,
  Preferences,
  Unit,
} from "@/types";

interface AddIngredientInput {
  ingredientId?: string;
  name: string;
  category?: IngredientInventory["category"];
  quantity?: number;
  unit?: Unit;
  useSoon?: boolean;
  expiryDate?: string;
}

interface AppStore {
  ready: boolean;
  ingredients: IngredientInventory[];
  available: Set<string>;
  saved: string[];
  history: CookingHistoryEntry[];
  preferences: Preferences;
  onboardingDone: boolean;
  addIngredient: (input: AddIngredientInput) => void;
  updateIngredient: (id: string, patch: Partial<IngredientInventory>) => void;
  removeIngredient: (id: string) => void;
  clearIngredients: () => void;
  hasIngredient: (ingredientId: string) => boolean;
  toggleQuickIngredient: (ingredientId: string) => void;
  toggleSaved: (recipeId: string) => void;
  isSaved: (recipeId: string) => boolean;
  addHistory: (recipeId: string, rating?: CookingHistoryEntry["rating"]) => void;
  rateHistory: (entryId: string, rating: CookingHistoryEntry["rating"]) => void;
  clearHistory: () => void;
  setPreferences: (patch: Partial<Preferences>) => void;
  completeOnboarding: () => void;
  restartOnboarding: () => void;
  resetAll: () => void;
  importData: (data: {
    ingredients: IngredientInventory[];
    savedRecipes: string[];
    cookingHistory: CookingHistoryEntry[];
    preferences: Preferences;
  }) => void;
}

const StoreContext = createContext<AppStore | null>(null);

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [ingredients, setIngredients] = useState<IngredientInventory[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [history, setHistory] = useState<CookingHistoryEntry[]>([]);
  const [preferences, setPrefsState] = useState<Preferences>({
    appearance: "system",
    measurement: "metric",
  });
  const [onboardingDone, setOnboardingDone] = useState(true);

  // Load persisted data after hydration (avoids SSR mismatch).
  useEffect(() => {
    setIngredients(storage.loadIngredients());
    setSaved(storage.loadSaved());
    setHistory(storage.loadHistory());
    setPrefsState(storage.loadPreferences());
    setOnboardingDone(storage.loadOnboarding());
    setReady(true);
  }, []);

  // Apply appearance preference.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const apply = () => {
      const dark =
        preferences.appearance === "dark" ||
        (preferences.appearance === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", dark);
    };
    apply();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [preferences.appearance]);

  const persistIngredients = useCallback((next: IngredientInventory[]) => {
    setIngredients(next);
    storage.saveIngredients(next);
  }, []);

  const addIngredient = useCallback(
    (input: AddIngredientInput) => {
      const id = input.ingredientId ?? slugify(input.name);
      const catalog = CATALOG_BY_ID[id];
      const now = new Date().toISOString();
      setIngredients((prev) => {
        const existing = prev.find((i) => i.ingredientId === id);
        const next = existing
          ? prev.map((i) =>
              i.ingredientId === id
                ? {
                    ...i,
                    quantity: input.quantity ?? i.quantity,
                    unit: input.unit ?? i.unit,
                    isAvailable: true,
                    useSoon: input.useSoon ?? i.useSoon,
                    expiryDate: input.expiryDate ?? i.expiryDate,
                    updatedAt: now,
                  }
                : i,
            )
          : [
              {
                id: uid(),
                ingredientId: id,
                name: catalog?.name ?? input.name.trim(),
                category: input.category ?? catalog?.category ?? "Other",
                quantity: input.quantity,
                unit: input.unit ?? catalog?.defaultUnit ?? "available",
                isAvailable: true,
                useSoon: input.useSoon ?? false,
                expiryDate: input.expiryDate,
                createdAt: now,
                updatedAt: now,
              },
              ...prev,
            ];
        storage.saveIngredients(next);
        return next;
      });
    },
    [],
  );

  const updateIngredient = useCallback(
    (id: string, patch: Partial<IngredientInventory>) => {
      setIngredients((prev) => {
        const next = prev.map((i) =>
          i.id === id ? { ...i, ...patch, updatedAt: new Date().toISOString() } : i,
        );
        storage.saveIngredients(next);
        return next;
      });
    },
    [],
  );

  const removeIngredient = useCallback((id: string) => {
    setIngredients((prev) => {
      const next = prev.filter((i) => i.id !== id);
      storage.saveIngredients(next);
      return next;
    });
  }, []);

  const clearIngredients = useCallback(() => persistIngredients([]), [
    persistIngredients,
  ]);

  const hasIngredient = useCallback(
    (ingredientId: string) =>
      ingredients.some((i) => i.ingredientId === ingredientId && i.isAvailable),
    [ingredients],
  );

  const toggleQuickIngredient = useCallback(
    (ingredientId: string) => {
      const existing = ingredients.find((i) => i.ingredientId === ingredientId);
      if (existing) removeIngredient(existing.id);
      else
        addIngredient({
          ingredientId,
          name: CATALOG_BY_ID[ingredientId]?.name ?? ingredientId,
        });
    },
    [ingredients, addIngredient, removeIngredient],
  );

  const toggleSaved = useCallback((recipeId: string) => {
    setSaved((prev) => {
      const next = prev.includes(recipeId)
        ? prev.filter((r) => r !== recipeId)
        : [recipeId, ...prev];
      storage.saveSaved(next);
      return next;
    });
  }, []);

  const addHistory = useCallback(
    (recipeId: string, rating?: CookingHistoryEntry["rating"]) => {
      const entry: CookingHistoryEntry = {
        id: uid(),
        recipeId,
        recipeName: RECIPE_BY_ID[recipeId]?.name ?? recipeId,
        cookedAt: new Date().toISOString(),
        rating,
      };
      setHistory((prev) => {
        const next = [entry, ...prev].slice(0, 300);
        storage.saveHistory(next);
        return next;
      });
    },
    [],
  );

  const rateHistory = useCallback(
    (entryId: string, rating: CookingHistoryEntry["rating"]) => {
      setHistory((prev) => {
        const next = prev.map((h) => (h.id === entryId ? { ...h, rating } : h));
        storage.saveHistory(next);
        return next;
      });
    },
    [],
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    storage.saveHistory([]);
  }, []);

  const setPreferences = useCallback((patch: Partial<Preferences>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...patch };
      storage.savePreferences(next);
      return next;
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    setOnboardingDone(true);
    storage.saveOnboarding(true);
  }, []);

  const restartOnboarding = useCallback(() => {
    setOnboardingDone(false);
    storage.saveOnboarding(false);
  }, []);

  const resetAll = useCallback(() => {
    storage.clearAll();
    setIngredients([]);
    setSaved([]);
    setHistory([]);
    setPrefsState({ appearance: "system", measurement: "metric" });
    setOnboardingDone(false);
  }, []);

  const importData = useCallback<AppStore["importData"]>((data) => {
    setIngredients(data.ingredients);
    storage.saveIngredients(data.ingredients);
    setSaved(data.savedRecipes);
    storage.saveSaved(data.savedRecipes);
    setHistory(data.cookingHistory);
    storage.saveHistory(data.cookingHistory);
    setPrefsState(data.preferences);
    storage.savePreferences(data.preferences);
    setOnboardingDone(true);
    storage.saveOnboarding(true);
  }, []);

  const available = useMemo(() => buildAvailableSet(ingredients), [ingredients]);

  const value: AppStore = {
    ready,
    ingredients,
    available,
    saved,
    history,
    preferences,
    onboardingDone,
    addIngredient,
    updateIngredient,
    removeIngredient,
    clearIngredients,
    hasIngredient,
    toggleQuickIngredient,
    toggleSaved,
    isSaved: (id) => saved.includes(id),
    addHistory,
    rateHistory,
    clearHistory,
    setPreferences,
    completeOnboarding,
    restartOnboarding,
    resetAll,
    importData,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore(): AppStore {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useAppStore must be used inside AppStoreProvider");
  return ctx;
}
