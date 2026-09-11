import type { CatalogIngredient, IngredientCategory, Unit } from "@/types";

type Row = [name: string, category: IngredientCategory, unit: Unit, emoji?: string];

const ROWS: Row[] = [
  // Vegetables
  ["Onion", "Vegetables", "pieces", "🧅"],
  ["Shallot", "Vegetables", "pieces", "🧅"],
  ["Garlic", "Vegetables", "cloves", "🧄"],
  ["Spring Onion", "Vegetables", "pieces", "🌱"],
  ["Tomato", "Vegetables", "pieces", "🍅"],
  ["Potato", "Vegetables", "pieces", "🥔"],
  ["Sweet Potato", "Vegetables", "pieces", "🍠"],
  ["Carrot", "Vegetables", "pieces", "🥕"],
  ["Cabbage", "Vegetables", "g", "🥬"],
  ["Bok Choy", "Vegetables", "g", "🥬"],
  ["Spinach", "Vegetables", "g", "🥬"],
  ["Water Spinach", "Vegetables", "g", "🥬"],
  ["Mustard Greens", "Vegetables", "g", "🥬"],
  ["Bean Sprouts", "Vegetables", "g", "🌱"],
  ["Green Beans", "Vegetables", "g", "🫛"],
  ["Broccoli", "Vegetables", "g", "🥦"],
  ["Cauliflower", "Vegetables", "g", "🥦"],
  ["Mushroom", "Vegetables", "g", "🍄"],
  ["Chili", "Vegetables", "pieces", "🌶️"],
  ["Bell Pepper", "Vegetables", "pieces", "🫑"],
  ["Cucumber", "Vegetables", "pieces", "🥒"],
  ["Corn", "Vegetables", "pieces", "🌽"],
  ["Lettuce", "Vegetables", "g", "🥬"],
  ["Celery", "Vegetables", "g", "🌿"],
  ["Zucchini", "Vegetables", "pieces", "🥒"],
  ["Eggplant", "Vegetables", "pieces", "🍆"],
  ["Ginger", "Vegetables", "g", "🫚"],
  ["Avocado", "Vegetables", "pieces", "🥑"],
  ["Peas", "Vegetables", "g", "🫛"],
  ["Pumpkin", "Vegetables", "g", "🎃"],
  ["Chayote", "Vegetables", "pieces", "🥒"],
  // Fruits
  ["Banana", "Fruits", "pieces", "🍌"],
  ["Apple", "Fruits", "pieces", "🍎"],
  ["Lemon", "Fruits", "pieces", "🍋"],
  ["Lime", "Fruits", "pieces", "🍋"],
  ["Orange", "Fruits", "pieces", "🍊"],
  ["Strawberry", "Fruits", "g", "🍓"],
  ["Mango", "Fruits", "pieces", "🥭"],
  ["Pineapple", "Fruits", "g", "🍍"],
  ["Raisins", "Fruits", "g", "🍇"],
  // Meat
  ["Chicken", "Meat", "g", "🍗"],
  ["Chicken Breast", "Meat", "g", "🍗"],
  ["Chicken Thigh", "Meat", "g", "🍗"],
  ["Beef", "Meat", "g", "🥩"],
  ["Ground Beef", "Meat", "g", "🥩"],
  ["Pork", "Meat", "g", "🥓"],
  ["Bacon", "Meat", "g", "🥓"],
  ["Sausage", "Meat", "pieces", "🌭"],
  ["Meatball", "Meat", "pieces", "🍢"],
  // Seafood
  ["Shrimp", "Seafood", "g", "🍤"],
  ["Fish Fillet", "Seafood", "g", "🐟"],
  ["Squid", "Seafood", "g", "🦑"],
  ["Anchovies", "Seafood", "g", "🐟"],
  ["Sardine", "Seafood", "package", "🐟"],
  ["Tuna", "Seafood", "package", "🐟"],
  // Eggs & Dairy
  ["Egg", "Eggs & Dairy", "pieces", "🥚"],
  ["Milk", "Eggs & Dairy", "ml", "🥛"],
  ["Soy Milk", "Eggs & Dairy", "ml", "🥛"],
  ["Butter", "Eggs & Dairy", "g", "🧈"],
  ["Margarine", "Eggs & Dairy", "g", "🧈"],
  ["Cheese", "Eggs & Dairy", "g", "🧀"],
  ["Cheddar", "Eggs & Dairy", "g", "🧀"],
  ["Cream", "Eggs & Dairy", "ml", "🥛"],
  ["Yogurt", "Eggs & Dairy", "g", "🥛"],
  ["Mozzarella", "Eggs & Dairy", "g", "🧀"],
  // Rice & Grains
  ["Rice", "Rice & Grains", "cups", "🍚"],
  ["Cooked Rice", "Rice & Grains", "cups", "🍚"],
  ["Oats", "Rice & Grains", "cups", "🥣"],
  ["Bread", "Rice & Grains", "pieces", "🍞"],
  ["Tortilla", "Rice & Grains", "pieces", "🌯"],
  ["Flour", "Rice & Grains", "cups", "🌾"],
  ["Cornstarch", "Rice & Grains", "tbsp", "🌽"],
  ["Breadcrumbs", "Rice & Grains", "cups", "🍞"],
  // Pasta & Noodles
  ["Pasta", "Pasta & Noodles", "g", "🍝"],
  ["Spaghetti", "Pasta & Noodles", "g", "🍝"],
  ["Macaroni", "Pasta & Noodles", "g", "🍝"],
  ["Noodles", "Pasta & Noodles", "package", "🍜"],
  ["Instant Noodles", "Pasta & Noodles", "package", "🍜"],
  ["Rice Noodles", "Pasta & Noodles", "g", "🍜"],
  ["Vermicelli", "Pasta & Noodles", "g", "🍜"],
  // Spices
  ["Salt", "Spices", "tsp", "🧂"],
  ["Pepper", "Spices", "tsp", "🌑"],
  ["Sugar", "Spices", "tsp", "🍬"],
  ["Chili Powder", "Spices", "tsp", "🌶️"],
  ["Turmeric", "Spices", "tsp", "🟡"],
  ["Coriander", "Spices", "tsp", "🌿"],
  ["Cumin", "Spices", "tsp", "🌿"],
  ["Curry Powder", "Spices", "tsp", "🍛"],
  ["Garlic Powder", "Spices", "tsp", "🧄"],
  ["Paprika", "Spices", "tsp", "🌶️"],
  ["Oregano", "Spices", "tsp", "🌿"],
  ["Basil", "Spices", "tsp", "🌿"],
  ["Cinnamon", "Spices", "tsp", "🟤"],
  ["Bay Leaf", "Spices", "pieces", "🍃"],
  ["Lemongrass", "Spices", "pieces", "🌾"],
  ["Chicken Bouillon", "Spices", "tsp", "🧊"],
  // Sauces
  ["Soy Sauce", "Sauces", "tbsp", "🍶"],
  ["Sweet Soy Sauce", "Sauces", "tbsp", "🍶"],
  ["Oyster Sauce", "Sauces", "tbsp", "🍶"],
  ["Fish Sauce", "Sauces", "tbsp", "🍶"],
  ["Chili Sauce", "Sauces", "tbsp", "🌶️"],
  ["Sambal", "Sauces", "tbsp", "🌶️"],
  ["Tomato Sauce", "Sauces", "ml", "🍅"],
  ["Ketchup", "Sauces", "tbsp", "🍅"],
  ["Mayonnaise", "Sauces", "tbsp", "🥣"],
  ["Cooking Oil", "Sauces", "tbsp", "🫗"],
  ["Sesame Oil", "Sauces", "tsp", "🫗"],
  ["Olive Oil", "Sauces", "tbsp", "🫗"],
  ["Vinegar", "Sauces", "tbsp", "🍶"],
  ["Teriyaki Sauce", "Sauces", "tbsp", "🍶"],
  ["Peanut Butter", "Sauces", "tbsp", "🥜"],
  ["Honey", "Sauces", "tbsp", "🍯"],
  ["Mustard", "Sauces", "tsp", "🌭"],
  // Canned & Frozen
  ["Canned Tomato", "Canned & Frozen", "package", "🥫"],
  ["Canned Corn", "Canned & Frozen", "package", "🥫"],
  ["Canned Beans", "Canned & Frozen", "package", "🥫"],
  ["Coconut Milk", "Canned & Frozen", "ml", "🥥"],
  ["Frozen Vegetables", "Canned & Frozen", "g", "🧊"],
  ["Frozen Peas", "Canned & Frozen", "g", "🧊"],
  ["Chicken Stock", "Canned & Frozen", "ml", "🍲"],
  ["Vegetable Stock", "Canned & Frozen", "ml", "🍲"],
  // Baking
  ["Baking Powder", "Baking", "tsp", "🥄"],
  ["Vanilla Extract", "Baking", "tsp", "🍦"],
  ["Cocoa Powder", "Baking", "tbsp", "🍫"],
  ["Chocolate", "Baking", "g", "🍫"],
  ["Brown Sugar", "Baking", "tbsp", "🍬"],
  // Other
  ["Tofu", "Other", "g", "⬜"],
  ["Tempeh", "Other", "g", "🟫"],
  ["Peanuts", "Other", "g", "🥜"],
  ["Sesame Seeds", "Other", "tsp", "⚪"],
  ["Water", "Other", "ml", "💧"],
  ["Crackers", "Other", "package", "🍘"],
];

function slug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const INGREDIENT_CATALOG: CatalogIngredient[] = ROWS.map(
  ([name, category, defaultUnit, emoji]) => ({
    id: slug(name),
    name,
    category,
    defaultUnit,
    emoji,
  }),
);

export const CATALOG_BY_ID: Record<string, CatalogIngredient> =
  Object.fromEntries(INGREDIENT_CATALOG.map((i) => [i.id, i]));

export function findCatalogIngredient(id: string): CatalogIngredient | undefined {
  return CATALOG_BY_ID[id];
}

export function searchIngredients(query: string, limit = 30): CatalogIngredient[] {
  const q = query.trim().toLowerCase();
  if (!q) return INGREDIENT_CATALOG.slice(0, limit);
  const starts: CatalogIngredient[] = [];
  const contains: CatalogIngredient[] = [];
  for (const item of INGREDIENT_CATALOG) {
    const n = item.name.toLowerCase();
    if (n.startsWith(q)) starts.push(item);
    else if (n.includes(q)) contains.push(item);
  }
  return [...starts, ...contains].slice(0, limit);
}

/** Chips shown for quick adding on Home and in onboarding. */
export const QUICK_ADD_IDS = [
  "egg",
  "rice",
  "chicken",
  "potato",
  "onion",
  "garlic",
  "noodles",
  "tomato",
  "tofu",
  "carrot",
];
