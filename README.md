# Kitchen Companion

Build a complete production-ready responsive mobile-first web application called Cooking Kitchen Partners.

The app is an offline-first personal cooking companion that helps users answer one simple question:

“What can I cook with the ingredients I already have?”

The application must work fully offline after installation/build. Do NOT use Supabase, Firebase, external databases, authentication, accounts, cloud sync, AI APIs, or any backend service.

The app must be suitable for export to Android Studio using Capacitor.

CORE PRODUCT IDEA

Cooking Kitchen Partners is NOT primarily a recipe browsing application.

Its main purpose is to compare the user's kitchen inventory with a built-in recipe database and recommend recipes based on what the user already has.

The experience should be:

Add ingredients → analyze kitchen → discover recipes → cook.

The application should feel simple, friendly, practical, fast, and useful rather than complicated.

TECHNOLOGY REQUIREMENTS

Use:

React

TypeScript

Vite

Tailwind CSS

LocalStorage for all user-generated data

Static bundled recipe and ingredient data

Responsive mobile-first UI

Capacitor-compatible implementation

Do not add:

Supabase

Firebase

Authentication

User accounts

Backend APIs

AI APIs

External database

Cloud synchronization

Server-side functionality

All user data must persist locally using LocalStorage.

Create a clean data/service layer for LocalStorage so application state is separated from UI components.

Use React Context or a simple local state architecture where appropriate.

Avoid unnecessary libraries and unnecessary complexity.

OFFLINE-FIRST REQUIREMENT

The application must continue working when:

Wi-Fi is disabled

mobile data is disabled

the device is in airplane mode

All recipes, ingredient definitions, matching logic, substitutions, icons, and core application functionality must be bundled with the application.

Do not make API calls for normal application functionality.

Do not depend on external image URLs for important UI functionality.

APP NAVIGATION

Use a bottom navigation bar on mobile with four primary sections:

Home

My Kitchen

Discover

Saved

Use icons and labels.

The active navigation item should be visually obvious.

The design must also work well on desktop/tablet, but mobile is the primary target.

1. HOME

Create a friendly dashboard.

Header:

Good morning, Kitchen Partner 👋

Subtitle:

What can we cook today?

Show a prominent search/action area:

What do you have in your kitchen?

Primary button:

+ Add Ingredients

Then show a compact kitchen summary.

Example:

YOUR KITCHEN

Eggs · 6
Rice · 2 cups
Chicken · 500 g
Onion · 3

Button:

🍳 What Can I Cook?

This is the most important CTA in the application.

COOK NOW section

Show recipes where the user has all required non-optional ingredients.

Example:

Chicken Fried Rice

100% match

15 min · Easy · 2 servings

Button:
View Recipe

If there are no perfect matches, display:

No perfect matches yet

Then encourage the user to check "Almost There" recipes.

ALMOST THERE section

Show recipes with approximately 70–99% ingredient compatibility.

Example:

Creamy Chicken Pasta

82% match

Missing:
Milk

Button:
View Recipe

USE SOON section

If the user has ingredients marked "Use Soon", display them prominently.

Example:

Ingredients to Use Soon

Spinach
Tomatoes
Chicken

Button:

Find Recipes

This section should recommend recipes that can consume those ingredients.

If the user has no ingredients marked Use Soon, hide this section or show a subtle empty state.

QUICK ADD

Provide quick ingredient chips for common ingredients:

Egg
Rice
Chicken
Potato
Onion
Garlic
Noodles
Tomato
Tofu
Carrot

Tapping one should quickly add it to the kitchen.

2. MY KITCHEN

Create a clean inventory management screen.

Header:

My Kitchen

Subtitle:

Keep track of what you have available.

Primary button:

+ Add Ingredient

Group ingredients by category.

Categories:

Vegetables

Fruits

Meat

Seafood

Eggs & Dairy

Rice & Grains

Pasta & Noodles

Spices

Sauces

Canned & Frozen

Baking

Other

Each ingredient card should display:

Ingredient name
Quantity if provided
Unit
Use Soon indicator if enabled

Examples:

Eggs
6 pieces

Chicken Breast
500 g

Salt
Available

Cooking Oil
Available

IMPORTANT:

Quantity should NOT always be required.

Support two inventory modes:

Quantified
Example:
Chicken: 500 g

Simple availability
Example:
Salt: Available

This is important because users often do not know the exact quantity of pantry ingredients.

ADD INGREDIENT

Create an easy modal/sheet.

Fields:

Ingredient search

Quantity
Optional

Unit
g / kg / ml / L / pieces / cups / tbsp / tsp / package / available

Use Soon toggle

Expiry Date
Optional

The ingredient search should search the built-in ingredient catalog.

When selecting an ingredient, automatically determine a sensible default unit where possible.

Example:
Egg → pieces
Rice → cups or g
Milk → ml
Chicken → g
Salt → tsp or available

Allow the user to edit the unit.

EDIT INGREDIENT

Users must be able to:

Change quantity

Change unit

Toggle Use Soon

Change expiry date

Delete ingredient

Use confirmation before deleting.

LOW/EXPIRING INGREDIENTS

Ingredients marked Use Soon should have a small visual indicator.

If an expiry date exists and is close, display:

Use soon

Do not implement complicated food-safety calculations. This is only a personal organization feature.

3. WHAT CAN I COOK

Create a dedicated recipe matching experience.

Header:

What Can I Cook?

Subtitle:

Recipes based on what's already in your kitchen.

Show filter controls:

Cooking time:

Under 15 min

15–30 min

30–60 min

Any

Difficulty:

Easy

Medium

Advanced

Any

Meal:

Breakfast

Lunch

Dinner

Snack

Any

Diet/style:

Vegetarian

High Protein

Light

Comfort Food

Any

Then display three groups.

COOK NOW

Recipes where all required ingredients are available.

Show:

Recipe name
Match percentage
Cooking time
Difficulty
Servings
Short description

Use a progress indicator for ingredient matching.

100% should be clearly represented as a complete match.

ALMOST THERE

Recipes missing only a small number of ingredients.

Show:

Recipe name
Match percentage

Available:
Egg
Rice
Onion
Chicken

Missing:
Spring Onion

Show:

You are almost ready to cook this.

YOU COULD TRY

Recipes with approximately 50–79% compatibility.

These should be shown lower on the page.

The user should clearly understand that these recipes may require additional ingredients.

4. RECIPE MATCHING ENGINE

Do NOT use AI.

Create a deterministic local matching engine.

Every recipe should define:

Required ingredients

Optional ingredients

Ingredient alternatives/substitutions

Calculate the match percentage based on required ingredients.

Example:

Recipe requires 5 ingredients.

User has 5:

100%

User has 4:

80%

User has 3:

60%

Optional ingredients should NOT reduce the match percentage.

Recipes should be sorted intelligently:

Highest compatibility

Shortest cooking time

Easier difficulty

For Cook Now, prioritize recipes with 100% availability.

For Almost There, prioritize recipes with the highest compatibility.

Create reusable utility functions such as:

calculateRecipeMatch()
getMissingIngredients()
getAvailableIngredients()
getRecommendedRecipes()

Do not hard-code matching logic inside individual UI components.

5. RECIPE DATABASE

Create a substantial built-in recipe dataset.

Include at least approximately 100 recipes.

Recipes should cover a mixture of Indonesian, Asian, and international everyday food.

Include categories such as:

Indonesian

Nasi Goreng

Nasi Goreng Ayam

Nasi Goreng Telur

Nasi Goreng Sayur

Mie Goreng

Mie Goreng Ayam

Capcay

Tumis Kangkung

Sayur Sop

Orek Tempe

Tempe Goreng

Tahu Goreng

Telur Balado

Telur Kecap

Ayam Kecap

Ayam Goreng

Ayam Bumbu Sederhana

Perkedel Kentang

Sayur Bening

Tumis Tauge

Asian

Chicken Fried Rice

Egg Fried Rice

Vegetable Fried Rice

Chicken Stir Fry

Beef Stir Fry

Teriyaki Chicken

Garlic Noodles

Stir Fried Noodles

Simple Curry

Egg Curry

Tofu Stir Fry

Spicy Noodles

Vegetable Noodles

Chicken Noodle Soup

Western / International

Omelette

Scrambled Eggs

Pancakes

French Toast

Spaghetti Aglio e Olio

Tomato Pasta

Creamy Chicken Pasta

Garlic Butter Pasta

Chicken Sandwich

Egg Sandwich

Tuna Sandwich

Chicken Wrap

Potato Hash

Mashed Potato

Vegetable Soup

Chicken Soup

Tomato Soup

Grilled Cheese

Baked Potato

Simple Chicken Salad

Add many additional practical recipes to reach at least approximately 100.

Prioritize recipes that use common inexpensive ingredients.

Do not create recipes that require obscure ingredients unnecessarily.

Each recipe should contain:

id
name
description
category
mealType
difficulty
cookingTime
servings
ingredients
optionalIngredients
instructions
tags
substitutions

Make recipes realistic and internally consistent.

6. RECIPE DETAIL PAGE

Create a beautiful recipe detail screen.

Example:

Chicken Fried Rice

Short description:

A quick and simple fried rice using everyday kitchen ingredients.

Show:

Easy
15 min
2 servings
95% match

YOUR INGREDIENTS

Show ingredient availability.

✓ Rice
✓ Chicken
✓ Egg
✓ Onion
✓ Garlic
✓ Soy Sauce

Missing:

Spring Onion

Optional ingredients should be labeled:

Optional

INGREDIENTS

Display each ingredient with quantity.

Example:

Cooked rice — 2 cups
Chicken — 200 g
Egg — 2
Onion — ½
Garlic — 2 cloves
Soy sauce — 1 tbsp
Cooking oil — 1 tbsp

SERVINGS CALCULATOR

Default:
2 servings

Provide plus/minus controls.

Example:

Servings
− 2 +

When servings change, automatically scale ingredient quantities.

Examples:

2 servings:
Chicken 200 g

4 servings:
Chicken 400 g

6 servings:
Chicken 600 g

Handle fractions sensibly.

Do not produce ugly decimals when avoidable.

For example:
0.5 → ½
1.5 → 1½

INSTRUCTIONS

Display numbered cooking steps.

Make instructions readable and easy to follow while cooking.

SUBSTITUTIONS

If available, show:

Possible Substitutions

Milk → Soy Milk
Chicken → Tofu
Spring Onion → Onion

Use cautious wording:

Possible substitute

Do not claim that every substitute is nutritionally or chemically identical.

ACTIONS

Buttons:

♡ Save Recipe

Cook This

The Cook This action should record the recipe in local cooking history.

7. DISCOVER

Create a recipe discovery screen for users who simply want inspiration.

Header:

Discover

Subtitle:

Find something worth cooking.

Sections:

Popular Everyday Recipes
Quick Meals
Budget Friendly
15 Minute Meals
Breakfast Ideas
Comfort Food
Vegetarian
High Protein
Indonesian Favorites
Asian Favorites

Each category should show recipe cards.

Recipe cards should contain:

Recipe name
Cooking time
Difficulty
Match percentage if kitchen ingredients exist
Short description

If the user has no ingredients, do not show misleading match percentages.

8. SAVED

Create:

Saved Recipes

Display all recipes the user has favorited.

If empty:

No saved recipes yet

Subtitle:

Save recipes you want to cook later.

Button:

Discover Recipes

9. COOKING HISTORY

Add a lightweight cooking history section, accessible from Saved or Settings.

Display:

Recently Cooked

Example:

Chicken Fried Rice
Today

Omelette
Yesterday

Mie Goreng
3 days ago

After pressing Cook This, ask:

How was it?

Options:

👍 Loved it
🙂 It was okay
👎 Not for me

Store the rating locally.

Add:

Cook Again

button for previously cooked recipes.

Do not build social features.

10. INGREDIENT SUBSTITUTION SYSTEM

Create a static substitution map.

Examples:

Chicken:

Tofu

Tempeh

Mushroom

Milk:

Soy milk

Coconut milk

Butter:

Margarine

Cooking oil

Spring onion:

Onion

Chicken stock:

Vegetable stock

Tomato:

Canned tomato

Pasta:

Noodles where appropriate

Egg:

Tofu in selected recipes where appropriate

The substitution system should only show substitutions defined for that recipe or ingredient.

Do not blindly substitute every ingredient.

11. QUICK INGREDIENT MODE

Create a particularly fast experience.

Allow users to select several ingredients from chips.

Example:

I Have...

[Egg] [Rice] [Chicken] [Potato] [Onion] [Garlic]

Selected ingredients should be visually highlighted.

Button:

Find Recipes

Then immediately show matching recipes.

This should work without requiring the user to create a permanent inventory item.

This is useful for someone who wants to quickly ask:

“I have eggs, potatoes and onions. What can I make?”

12. SEARCH

Add local search for:

Recipes
Ingredients

Search must work offline.

Recipe search should match:

Recipe name

Description

Tags

Category

Meal type

Ingredient search should match ingredient names.

13. LOCAL STORAGE

Store all user-specific data locally.

Use a centralized storage utility.

Suggested keys:

ckp_ingredients
ckp_saved_recipes
ckp_cooking_history
ckp_preferences
ckp_onboarding_complete

Create safe JSON serialization/deserialization.

Handle corrupted or missing LocalStorage data gracefully.

The application must never crash simply because local data is empty.

14. DATA MODEL

Use TypeScript interfaces.

IngredientInventory:

id
ingredientId
name
category
quantity
unit
isAvailable
useSoon
expiryDate
createdAt
updatedAt

Recipe:

id
name
description
category
mealType
difficulty
cookingTime
servings
ingredients
optionalIngredients
instructions
tags
substitutions

RecipeIngredient:

ingredientId
name
amount
unit
optional

CookingHistory:

id
recipeId
recipeName
cookedAt
rating

15. ONBOARDING

Keep onboarding extremely short.

Screen:

Welcome to Cooking Kitchen Partners 🍳

Cook with what you already have.

Subtitle:

Add a few ingredients and discover what you can make.

Then:

What do you have in your kitchen?

Quick-select ingredients:

Eggs
Rice
Chicken
Onion
Garlic
Potato
Noodles
Tomato
Tofu
Carrot

Button:

Build My Kitchen

The user should be able to skip this.

Do not create a long tutorial.

16. EMPTY STATES

Every major section must have a useful empty state.

My Kitchen:

Your kitchen is empty

Add a few ingredients and we'll help you find something to cook.

Button:
Add Ingredients

Saved:

Nothing saved yet

Discover a recipe and save it for later.

History:

No cooking history yet

Cook your first recipe to see it here.

Cook Now:

No perfect matches

Try adding a few more ingredients or check Almost There.

17. SETTINGS

Create a simple Settings screen.

Include:

Appearance:

System

Light

Dark

Measurement preference:

Metric

Imperial

Data:

Export My Data

Export the user's LocalStorage data as a downloadable JSON file.

Import My Data

Allow users to restore previously exported data.

Clear All Data

Show a strong confirmation dialog.

Text:

This will permanently remove your kitchen ingredients, saved recipes, preferences, and cooking history from this device.

Button:

Clear All Data

Do not delete the built-in recipe database.

Add:

About Cooking Kitchen Partners

Version number.

Privacy statement:

Your kitchen data stays on this device. Cooking Kitchen Partners does not require an account or send your personal kitchen data to a server.

18. DESIGN SYSTEM

The visual identity should feel warm, friendly, modern, and practical.

Primary feeling:

A helpful kitchen companion.

Use:

Warm cream/off-white backgrounds

Fresh green primary actions

Warm orange/yellow accent elements

Dark charcoal text

Soft borders

Rounded cards

Subtle shadows

Large readable typography

Large touch targets

Do not make it look like a restaurant delivery application.

Do not overuse gradients.

Do not overuse glassmorphism.

Do not make every element a card.

Use whitespace intelligently.

The application should look polished enough to be published as a consumer mobile application.

19. ICONS

Use a consistent icon library such as Lucide if already available.

Use icons for:

Home

Kitchen

Discover

Saved

Search

Add

Delete

Edit

Clock

Difficulty

Ingredients

Cooking

Favorites

Settings

Filter

Do not use random emoji as the primary UI icon system.

Emoji may be used selectively for friendly empty states or ingredient visualization.

20. RESPONSIVE DESIGN

Mobile is the primary experience.

Optimize for approximately:

360px
375px
390px
414px

The UI must not overflow horizontally.

Bottom navigation should be thumb-friendly.

Modals should behave like mobile bottom sheets where appropriate.

On larger screens, center the mobile-style application within a comfortable responsive layout rather than stretching everything excessively.

21. ACCESSIBILITY

Use:

Semantic HTML

Proper labels

Accessible buttons

Sufficient contrast

Keyboard accessibility

Visible focus states

Appropriate aria-labels where needed

Do not rely on color alone to communicate recipe matching.

For example:

100% Match
80% Match
Missing 1 ingredient

should all have text labels.

22. PERFORMANCE

The application should load quickly.

Avoid unnecessary dependencies.

Do not load huge external assets.

Recipe data should be statically bundled.

Use efficient filtering and memoization where appropriate.

Do not introduce a backend merely to optimize the application.

23. ERROR HANDLING

Never allow an invalid ingredient or recipe record to crash the entire application.

Handle:

Empty inventory

Missing recipe

Missing LocalStorage data

Invalid quantity

Invalid imported JSON

Deleted saved recipe references

Gracefully recover wherever possible.

24. IMPORTANT PRODUCT BEHAVIOR

The application should never claim to provide:

Medical advice

Professional nutrition advice

Food safety certification

Guaranteed substitution equivalence

This is simply a cooking organization and recipe recommendation tool.

25. FINAL UI FLOW

The ideal user flow should be:

OPEN APP

↓

Home

“What can we cook today?”

↓

Add ingredients

Egg
Rice
Chicken
Onion
Garlic

↓

“What Can I Cook?”

↓

Cook Now

Chicken Fried Rice
100% Match

↓

View Recipe

↓

Adjust servings

↓

Cook

↓

Rate recipe

↓

Recipe appears in Cooking History

↓

User can save recipe for later.

26. IMPORTANT IMPLEMENTATION RULES

Build the complete application, not a prototype.

Do not create placeholder pages.

Do not leave TODO sections.

Do not create fake backend integrations.

Do not require users to log in.

Do not use Supabase.

Do not use Firebase.

Do not use AI APIs.

Do not require internet access.

Do not depend on external APIs for recipes.

Do not build unnecessary social functionality.

Do not split the implementation into phases.

The app should be usable immediately after the build completes.

All core functionality must actually work.

Ensure:

Navigation works

Ingredient CRUD works

LocalStorage persistence works

Recipe matching works

Search works

Filtering works

Serving calculator works

Favorites work

Cooking history works

Substitutions work

Use Soon works

Import/export works

Dark/light/system appearance works

Empty states work

Mobile layout works

Offline operation works

BRAND

Application name:

Cooking Kitchen Partners

Suggested tagline:

Your kitchen. Your ingredients. Your next meal.

Use this tagline naturally in onboarding and appropriate empty states.

The overall product should feel like a small, clever kitchen assistant that lives on the user's phone and helps them turn whatever is already in their kitchen into practical meal ideas.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://kitchen-whisperer-03.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a933074a-ebbd-47d9-8769-4bb46fd7343a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
