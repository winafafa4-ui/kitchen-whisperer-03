import { createFileRoute, Link } from "@tanstack/react-router";
import { ChefHat, Plus, Settings, Sparkles } from "lucide-react";
import { AppShell, EmptyState, PageHeader } from "@/components/AppShell";
import { RecipeCardList } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { CATALOG_BY_ID, QUICK_ADD_IDS } from "@/data/ingredients";
import { useAppStore } from "@/hooks/use-app-store";
import { getRecommendedRecipes } from "@/lib/matching";
import { daysUntil, relativeDay } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cooking Kitchen Partners — Cook with what you have" },
      {
        name: "description",
        content:
          "Add the ingredients in your kitchen and instantly see meals you can cook tonight. Works fully offline.",
      },
      {
        property: "og:title",
        content: "Cooking Kitchen Partners — Cook with what you have",
      },
      {
        property: "og:description",
        content:
          "Offline cooking companion: real meal ideas from the ingredients you already own.",
      },
    ],
  }),
  component: HomePage,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 11) return "Good morning";
  if (h < 16) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Late night kitchen";
}

function HomePage() {
  const { ingredients, available, history, hasIngredient, toggleQuickIngredient } =
    useAppStore();
  const { cookNow, almostThere } = getRecommendedRecipes(available);

  const useSoon = ingredients.filter((i) => {
    const d = daysUntil(i.expiryDate);
    return i.useSoon || (d !== null && d <= 3);
  });

  return (
    <AppShell>
      <PageHeader
        title={greeting()}
        subtitle="Your kitchen. Your ingredients. Your next meal."
        action={
          <Link
            to="/settings"
            aria-label="Settings"
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Settings className="size-5" />
          </Link>
        }
      />

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Ingredients", value: ingredients.length },
          { label: "Cook now", value: cookNow.length },
          { label: "Cooked", value: history.length },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-3 text-center"
          >
            <div className="text-xl font-bold text-foreground">{s.value}</div>
            <div className="text-[11px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Button asChild className="flex-1 rounded-xl">
          <Link to="/cook">
            <ChefHat className="size-4" /> What can I cook?
          </Link>
        </Button>
        <Button asChild variant="secondary" className="flex-1 rounded-xl">
          <Link to="/kitchen">
            <Plus className="size-4" /> Add ingredients
          </Link>
        </Button>
      </div>

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold text-foreground">Quick add</h2>
        <div className="flex flex-wrap gap-2">
          {QUICK_ADD_IDS.map((id) => {
            const item = CATALOG_BY_ID[id];
            const on = hasIngredient(id);
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => toggleQuickIngredient(id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  on
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/40",
                )}
              >
                {item?.emoji} {item?.name ?? id}
              </button>
            );
          })}
        </div>
      </section>

      {useSoon.length > 0 && (
        <section className="mt-6 rounded-2xl border border-accent/40 bg-accent/10 p-3">
          <h2 className="text-sm font-semibold text-foreground">Use these soon</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {useSoon.map((i) => i.name).join(", ")}
          </p>
        </section>
      )}

      <section className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            <Sparkles className="mr-1 inline size-4 text-primary" />
            Ready to cook
          </h2>
          <Link to="/cook" className="text-xs font-medium text-primary">
            See all
          </Link>
        </div>
        {cookNow.length > 0 ? (
          <RecipeCardList matches={cookNow.slice(0, 4)} />
        ) : almostThere.length > 0 ? (
          <RecipeCardList matches={almostThere.slice(0, 4)} missingLabel />
        ) : (
          <EmptyState
            emoji="🧺"
            title="Your kitchen is empty"
            description="Add a few ingredients and we'll show you meals you can make right now."
            action={
              <Button asChild className="rounded-xl">
                <Link to="/kitchen">Add ingredients</Link>
              </Button>
            }
          />
        )}
      </section>

      {history.length > 0 && (
        <section className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Recently cooked</h2>
            <Link to="/history" className="text-xs font-medium text-primary">
              History
            </Link>
          </div>
          <ul className="space-y-2">
            {history.slice(0, 3).map((h) => (
              <li key={h.id}>
                <Link
                  to="/recipe/$recipeId"
                  params={{ recipeId: h.recipeId }}
                  className="flex items-center justify-between rounded-2xl border border-border bg-card px-3 py-2.5 text-sm"
                >
                  <span className="truncate font-medium text-foreground">
                    {h.recipeName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {relativeDay(h.cookedAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </AppShell>
  );
}
