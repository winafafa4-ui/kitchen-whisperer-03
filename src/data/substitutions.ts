/**
 * Static, hand-curated substitution map. Keys and values are ingredient ids.
 * Only ingredients listed here ever show a possible substitute.
 */
export const SUBSTITUTIONS: Record<string, string[]> = {
  chicken: ["tofu", "tempeh", "mushroom"],
  "chicken-breast": ["chicken", "tofu", "tempeh"],
  beef: ["chicken", "tempeh", "mushroom"],
  milk: ["soy-milk", "coconut-milk"],
  butter: ["margarine", "cooking-oil"],
  "spring-onion": ["onion"],
  "chicken-stock": ["vegetable-stock"],
  tomato: ["canned-tomato"],
  pasta: ["noodles"],
  spaghetti: ["noodles", "pasta"],
  noodles: ["pasta"],
  egg: ["tofu"],
  shallot: ["onion"],
  onion: ["shallot"],
  garlic: ["garlic-powder"],
  "soy-sauce": ["sweet-soy-sauce", "oyster-sauce"],
  "sweet-soy-sauce": ["soy-sauce"],
  "oyster-sauce": ["soy-sauce"],
  cheese: ["cheddar"],
  cheddar: ["cheese"],
  yogurt: ["milk"],
  cream: ["milk", "coconut-milk"],
  "coconut-milk": ["milk"],
  tofu: ["tempeh"],
  tempeh: ["tofu"],
  cabbage: ["bok-choy", "carrot"],
  "bok-choy": ["spinach", "cabbage"],
  spinach: ["bok-choy", "water-spinach"],
  "water-spinach": ["spinach"],
  "bean-sprouts": ["cabbage"],
  potato: ["sweet-potato"],
  rice: ["cooked-rice"],
  "cooked-rice": ["rice"],
  "lime": ["lemon"],
  lemon: ["lime"],
  "chili": ["chili-powder"],
  "tuna": ["chicken", "sardine"],
  "vegetable-stock": ["chicken-stock"],
  "bread": ["tortilla"],
};

export function substitutesFor(ingredientId: string): string[] {
  return SUBSTITUTIONS[ingredientId] ?? [];
}
