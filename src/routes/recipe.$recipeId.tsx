import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Clock, Minus, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { AppShell, EmptyState, PageHeader } from "@/components/AppShell";
import { MatchBadge, SaveButton } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { CATALOG_BY_ID } from "@/data/ingredients";
import { substitutesFor } from "@/data/substitutions";
import { useAppStore } from "@/hooks/use-app-store";
import { calculateRecipeMatch, getRecipe } from "@/lib/matching";
import { formatQuantity, scaleAmount } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recipe/$recipeId")({
  head: () => ({
    meta: [
      { title: "Recipe — Cooking Kitchen Partners" },
      {
        name: "description",
        content:
          "Step-by-step instructions, scalable servings, ingredient swaps and what you're missing.",
      },
      { property: "og:title", content: "Recipe — Cooking Kitchen Partners" },
      {
        property: "og:description",
        content: "Cook it step by step with the ingredients you already have.",
      },
    ],
  }),
  component: RecipeDetailPage,
});

function RecipeDetailPage() {
  const { recipeId } = useParams({ from: "/recipe/$recipeId" });
  const recipe = getRecipe(recipeId);
  const { available, addIngredient, addHistory, hasIngredient } = useAppStore();
  const [done, setDone] = useState<number[]>([]);

  if (!recipe) {
    return (
      <AppShell>
        <EmptyState
          emoji="🍽️"
          title="Recipe not found"
          description="This recipe isn't in the cookbook."
          action={
            <Button asChild className="rounded-xl">
              <Link to="/discover">Browse recipes</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  const [servings, setServings] = useState(recipe.servings);
  const match = calculateRecipeMatch(recipe, available);
  const allIngredients = [...recipe.ingredients, ...recipe.optionalIngredients];

  return (
    <AppShell>
      <div className="mb-3 flex items-center justify-between">
        <Link
          to="/cook"
          aria-label="Back"
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm text-muted-foreground hover:bg-secondary"
        >
          <ArrowLeft className="size-4" /> Back
        </Link>
        <SaveButton recipeId={recipe.id} />
      </div>

      <PageHeader title={recipe.name} subtitle={recipe.description} />

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <MatchBadge percent={match.percent} />
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" /> {recipe.cookingTime} min
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="size-3.5" /> {recipe.servings} base
        </span>
        <span>{recipe.difficulty}</span>
        <span>{recipe.category}</span>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-card px-3 py-2">
        <span className="text-sm font-medium text-foreground">Servings</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Fewer servings"
            onClick={() => setServings((s) => Math.max(1, s - 1))}
            className="rounded-full bg-secondary p-1.5"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-6 text-center text-sm font-semibold">{servings}</span>
          <button
            type="button"
            aria-label="More servings"
            onClick={() => setServings((s) => Math.min(12, s + 1))}
            className="rounded-full bg-secondary p-1.5"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      <section className="mt-5">
        <h2 className="mb-2 text-sm font-semibold text-foreground">Ingredients</h2>
        <ul className="space-y-2">
          {allIngredients.map((ing) => {
            const have = hasIngredient(ing.ingredientId);
            const sub = !have
              ? substitutesFor(ing.ingredientId).find((s) => hasIngredient(s))
              : undefined;
            const amount =
              ing.amount !== undefined
                ? scaleAmount(ing.amount, recipe.servings, servings)
                : undefined;
            return (
              <li
                key={`${ing.ingredientId}-${ing.name}`}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2.5"
              >
                <span className="text-lg" aria-hidden>
                  {CATALOG_BY_ID[ing.ingredientId]?.emoji ?? "🍽️"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {ing.name}
                    {ing.optional && (
                      <span className="ml-1 text-[11px] text-muted-foreground">
                        optional
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatQuantity(amount, ing.unit) || "to taste"}
                    {sub && ` · using ${CATALOG_BY_ID[sub]?.name ?? sub}`}
                  </p>
                </div>
                {have || sub ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    <Check className="size-3" /> Have it
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      addIngredient({
                        ingredientId: ing.ingredientId,
                        name: ing.name,
                      });
                      toast.success(`${ing.name} added to your kitchen`);
                    }}
                    className="rounded-full bg-secondary px-2 py-1 text-[11px] font-semibold text-foreground"
                  >
                    Add
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {match.missing.length > 0 && (
        <section className="mt-4 rounded-2xl border border-accent/40 bg-accent/10 p-3">
          <h2 className="text-sm font-semibold text-foreground">
            You're missing {match.missing.length}
          </h2>
          <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
            {match.missing.map((m) => {
              const subs = substitutesFor(m.ingredientId)
                .map((s) => CATALOG_BY_ID[s]?.name ?? s)
                .slice(0, 3);
              return (
                <li key={m.ingredientId}>
                  <span className="font-medium text-foreground">{m.name}</span>
                  {subs.length > 0 && ` — try ${subs.join(", ")}`}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="mt-5">
        <h2 className="mb-2 text-sm font-semibold text-foreground">Instructions</h2>
        <ol className="space-y-2">
          {recipe.instructions.map((step, idx) => {
            const isDone = done.includes(idx);
            return (
              <li key={idx}>
                <button
                  type="button"
                  aria-pressed={isDone}
                  onClick={() =>
                    setDone((prev) =>
                      prev.includes(idx)
                        ? prev.filter((i) => i !== idx)
                        : [...prev, idx],
                    )
                  }
                  className={cn(
                    "flex w-full gap-3 rounded-2xl border border-border bg-card p-3 text-left",
                    isDone && "opacity-60",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                      isDone
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground",
                    )}
                  >
                    {isDone ? <Check className="size-3.5" /> : idx + 1}
                  </span>
                  <span
                    className={cn(
                      "text-sm text-foreground",
                      isDone && "line-through",
                    )}
                  >
                    {step}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      {recipe.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {recipe.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <Button
        className="mt-6 w-full rounded-xl"
        onClick={() => {
          addHistory(recipe.id);
          toast.success("Added to your cooking history");
        }}
      >
        I cooked this
      </Button>
    </AppShell>
  );
}
