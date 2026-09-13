import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { AppShell, EmptyState, PageHeader } from "@/components/AppShell";
import { RecipeCardList } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/hooks/use-app-store";
import { getRecommendedRecipes, type RecipeFilters } from "@/lib/matching";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cook")({
  head: () => ({
    meta: [
      { title: "What Can I Cook? — Cooking Kitchen Partners" },
      {
        name: "description",
        content:
          "Meals matched to the ingredients you already have, sorted by what you can cook right now.",
      },
      { property: "og:title", content: "What Can I Cook? — Cooking Kitchen Partners" },
      {
        property: "og:description",
        content: "Ready now, almost there, or worth a try — matched to your kitchen.",
      },
    ],
  }),
  component: CookPage,
});

const TIME_OPTIONS = [
  { value: "any", label: "Any time" },
  { value: "15", label: "Under 15 min" },
  { value: "30", label: "15–30 min" },
  { value: "60", label: "30–60 min" },
] as const;

const DIFFICULTY_OPTIONS = ["any", "Easy", "Medium", "Advanced"] as const;
const MEAL_OPTIONS = ["any", "Breakfast", "Lunch", "Dinner", "Snack"] as const;

function Chips<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  labels?: Record<string, string>;
}) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={cn(
            "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium",
            value === o
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground",
          )}
        >
          {labels?.[o] ?? (o === "any" ? "Any" : o)}
        </button>
      ))}
    </div>
  );
}

function CookPage() {
  const { available, ingredients } = useAppStore();
  const [query, setQuery] = useState("");
  const [time, setTime] = useState<NonNullable<RecipeFilters["time"]>>("any");
  const [difficulty, setDifficulty] =
    useState<NonNullable<RecipeFilters["difficulty"]>>("any");
  const [meal, setMeal] = useState<NonNullable<RecipeFilters["meal"]>>("any");

  const { cookNow, almostThere, couldTry } = getRecommendedRecipes(available, {
    query,
    time,
    difficulty,
    meal,
  });

  const nothing =
    cookNow.length === 0 && almostThere.length === 0 && couldTry.length === 0;

  return (
    <AppShell>
      <PageHeader
        title="What can I cook?"
        subtitle="Matched against everything in your kitchen"
      />

      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes"
            aria-label="Search recipes"
            className="pl-9"
          />
        </div>
        <Chips
          options={TIME_OPTIONS.map((t) => t.value)}
          value={time}
          onChange={setTime}
          labels={Object.fromEntries(TIME_OPTIONS.map((t) => [t.value, t.label]))}
        />
        <Chips options={MEAL_OPTIONS} value={meal} onChange={setMeal} />
        <Chips
          options={DIFFICULTY_OPTIONS}
          value={difficulty}
          onChange={setDifficulty}
        />
      </div>

      <div className="mt-5 space-y-6">
        {ingredients.length === 0 && (
          <EmptyState
            emoji="🧺"
            title="Add ingredients first"
            description="Once your kitchen has a few things in it, we can match real recipes to it."
            action={
              <Button asChild className="rounded-xl">
                <Link to="/kitchen">Go to My Kitchen</Link>
              </Button>
            }
          />
        )}

        {cookNow.length > 0 && (
          <section>
            <h2 className="mb-2 text-sm font-semibold text-foreground">
              Ready to cook now ({cookNow.length})
            </h2>
            <RecipeCardList matches={cookNow} />
          </section>
        )}

        {almostThere.length > 0 && (
          <section>
            <h2 className="mb-2 text-sm font-semibold text-foreground">
              Almost there ({almostThere.length})
            </h2>
            <RecipeCardList matches={almostThere} missingLabel />
          </section>
        )}

        {couldTry.length > 0 && (
          <section>
            <h2 className="mb-2 text-sm font-semibold text-foreground">
              Could try ({couldTry.length})
            </h2>
            <RecipeCardList matches={couldTry} missingLabel />
          </section>
        )}

        {ingredients.length > 0 && nothing && (
          <EmptyState
            emoji="🤔"
            title="No matches yet"
            description="Try clearing the filters, or add a couple more staples like rice, eggs or onion."
            action={
              <Button asChild variant="secondary" className="rounded-xl">
                <Link to="/discover">Browse all recipes</Link>
              </Button>
            }
          />
        )}
      </div>
    </AppShell>
  );
}
