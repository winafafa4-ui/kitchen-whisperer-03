export type IngredientCategory =
  | "Vegetables"
  | "Fruits"
  | "Meat"
  | "Seafood"
  | "Eggs & Dairy"
  | "Rice & Grains"
  | "Pasta & Noodles"
  | "Spices"
  | "Sauces"
  | "Canned & Frozen"
  | "Baking"
  | "Other";

export const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  "Vegetables",
  "Fruits",
  "Meat",
  "Seafood",
  "Eggs & Dairy",
  "Rice & Grains",
  "Pasta & Noodles",
  "Spices",
  "Sauces",
  "Canned & Frozen",
  "Baking",
  "Other",
];

export type Unit =
  | "g"
  | "kg"
  | "ml"
  | "L"
  | "pieces"
  | "cups"
  | "tbsp"
  | "tsp"
  | "cloves"
  | "package"
  | "available";

export const UNITS: Unit[] = [
  "g",
  "kg",
  "ml",
  "L",
  "pieces",
  "cups",
  "tbsp",
  "tsp",
  "cloves",
  "package",
  "available",
];

export interface CatalogIngredient {
  id: string;
  name: string;
  category: IngredientCategory;
  defaultUnit: Unit;
  emoji?: string;
}

export interface IngredientInventory {
  id: string;
  ingredientId: string;
  name: string;
  category: IngredientCategory;
  quantity?: number;
  unit: Unit;
  isAvailable: boolean;
  useSoon: boolean;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type Difficulty = "Easy" | "Medium" | "Advanced";
export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";
export type RecipeCategory = "Indonesian" | "Asian" | "Western";

export interface RecipeIngredient {
  ingredientId: string;
  name: string;
  amount?: number;
  unit: Unit;
  optional?: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: RecipeCategory;
  mealType: MealType[];
  difficulty: Difficulty;
  cookingTime: number;
  servings: number;
  ingredients: RecipeIngredient[];
  optionalIngredients: RecipeIngredient[];
  instructions: string[];
  tags: string[];
  substitutions: Record<string, string[]>;
}

export interface CookingHistoryEntry {
  id: string;
  recipeId: string;
  recipeName: string;
  cookedAt: string;
  rating?: "loved" | "okay" | "no";
}

export interface Preferences {
  appearance: "system" | "light" | "dark";
  measurement: "metric" | "imperial";
}

export interface MatchResult {
  recipe: Recipe;
  percent: number;
  available: RecipeIngredient[];
  missing: RecipeIngredient[];
  substituted: { ingredient: RecipeIngredient; using: string }[];
}
