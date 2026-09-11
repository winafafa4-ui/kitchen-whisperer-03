import { RECIPES, RECIPE_BY_ID } from "@/data/recipes";
import { substitutesFor } from "@/data/substitutions";
import { CATALOG_BY_ID } from "@/data/ingredients";
import type {
  Difficulty,
  IngredientInventory,
  MatchResult,
  MealType,
  Recipe,
  RecipeIngredient,
} from "@/types";

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  Easy: 0,
  Medium: 1,
  Advanced: 2,
};

/** Set of ingredient ids the user currently has available. */
export function buildAvailableSet(inventory: IngredientInventory[]): Set<string> {
  const set = new Set<string>();
  for (const item of inventory) {
    if (!item || item.isAvailable === false) continue;
    set.add(item.ingredientId);
    // "rice" also satisfies "cooked rice" and vice versa
    if (item.ingredientId === "rice") set.add("cooked-rice");
    if (item.ingredientId === "cooked-rice") set.add("rice");
    if (item.ingredientId === "chicken-breast" || item.ingredientId === "chicken-thigh")
      set.add("chicken");
  }
  return set;
}

export function calculateRecipeMatch(
  recipe: Recipe,
  available: Set<string>,
): MatchResult {
  const req = recipe.ingredients;
  const availableList: RecipeIngredient[] = [];
  const missing: RecipeIngredient[] = [];
  const substituted: { ingredient: RecipeIngredient; using: string }[] = [];

  for (const ing of req) {
    if (available.has(ing.ingredientId)) {
      availableList.push(ing);
      continue;
    }
    const sub = substitutesFor(ing.ingredientId).find((s) => available.has(s));
    if (sub) {
      availableList.push(ing);
      substituted.push({
        ingredient: ing,
        using: CATALOG_BY_ID[sub]?.name ?? sub,
      });
      continue;
    }
    missing.push(ing);
  }

  const percent = req.length === 0 ? 100 : Math.round((availableList.length / req.length) * 100);

  return { recipe, percent, available: availableList, missing, substituted };
}

export function getMissingIngredients(
  recipe: Recipe,
  available: Set<string>,
): RecipeIngredient[] {
  return calculateRecipeMatch(recipe, available).missing;
}

export function getAvailableIngredients(
  recipe: Recipe,
  available: Set<string>,
): RecipeIngredient[] {
  return calculateRecipeMatch(recipe, available).available;
}

export interface RecipeFilters {
  time?: "15" | "30" | "60" | "any";
  difficulty?: Difficulty | "any";
  meal?: MealType | "any";
  style?: "Vegetarian" | "High Protein" | "Light" | "Comfort Food" | "any";
  query?: string;
}

export function applyFilters(recipes: Recipe[], f: RecipeFilters): Recipe[] {
  const q = f.query?.trim().toLowerCase() ?? "";
  return recipes.filter((r) => {
    if (f.time === "15" && r.cookingTime > 15) return false;
    if (f.time === "30" && (r.cookingTime < 15 || r.cookingTime > 30)) return false;
    if (f.time === "60" && (r.cookingTime < 30 || r.cookingTime > 60)) return false;
    if (f.difficulty && f.difficulty !== "any" && r.difficulty !== f.difficulty)
      return false;
    if (f.meal && f.meal !== "any" && !r.mealType.includes(f.meal)) return false;
    if (f.style && f.style !== "any") {
      const tag = f.style.toLowerCase();
      if (!r.tags.some((t) => t.toLowerCase() === tag)) return false;
    }
    if (q) {
      const haystack = [
        r.name,
        r.description,
        r.category,
        ...r.mealType,
        ...r.tags,
        ...r.ingredients.map((i) => i.name),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function sortMatches(a: MatchResult, b: MatchResult): number {
  if (b.percent !== a.percent) return b.percent - a.percent;
  if (a.recipe.cookingTime !== b.recipe.cookingTime)
    return a.recipe.cookingTime - b.recipe.cookingTime;
  return (
    DIFFICULTY_ORDER[a.recipe.difficulty] - DIFFICULTY_ORDER[b.recipe.difficulty]
  );
}

export interface RecommendationGroups {
  cookNow: MatchResult[];
  almostThere: MatchResult[];
  couldTry: MatchResult[];
  hasInventory: boolean;
}

export function getRecommendedRecipes(
  available: Set<string>,
  filters: RecipeFilters = {},
  pool: Recipe[] = RECIPES,
): RecommendationGroups {
  const recipes = applyFilters(pool, filters);
  const results = recipes.map((r) => calculateRecipeMatch(r, available));
  const cookNow = results.filter((r) => r.percent === 100).sort(sortMatches);
  const almostThere = results
    .filter((r) => r.percent >= 70 && r.percent < 100)
    .sort(sortMatches);
  const couldTry = results
    .filter((r) => r.percent >= 50 && r.percent < 70)
    .sort(sortMatches);
  return { cookNow, almostThere, couldTry, hasInventory: available.size > 0 };
}

/** Recipes that use at least one of the given ingredient ids. */
export function getRecipesUsing(
  ingredientIds: string[],
  available: Set<string>,
  limit = 12,
): MatchResult[] {
  const ids = new Set(ingredientIds);
  return RECIPES.filter((r) => r.ingredients.some((i) => ids.has(i.ingredientId)))
    .map((r) => calculateRecipeMatch(r, available))
    .sort(sortMatches)
    .slice(0, limit);
}

export function searchRecipes(query: string, limit = 40): Recipe[] {
  return applyFilters(RECIPES, { query }).slice(0, limit);
}

export function getRecipe(id: string): Recipe | undefined {
  return RECIPE_BY_ID[id];
}
