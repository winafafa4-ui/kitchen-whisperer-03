import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { AppShell, EmptyState, PageHeader } from "@/components/AppShell";
import { RecipeCard } from "@/components/RecipeCard";
import { Input } from "@/components/ui/input";
import { DISCOVER_SECTIONS, RECIPES } from "@/data/recipes";
import { useAppStore } from "@/hooks/use-app-store";
import { applyFilters, calculateRecipeMatch } from "@/lib/matching";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover Recipes — Cooking Kitchen Partners" },
      {
        name: "description",
        content:
          "Browse around 100 Indonesian, Asian and Western recipes by style, speed and mood — all stored offline.",
      },
      { property: "og:title", content: "Discover Recipes — Cooking Kitchen Partners" },
      {
        property: "og:description",
        content: "Quick meals, budget dinners, vegetarian picks and comfort classics.",
      },
    ],
  }),
  component: DiscoverPage,
});

const CATEGORIES = ["All", "Indonesian", "Asian", "Western"] as const;

function DiscoverPage() {
  const { available } = useAppStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");

  const searching = query.trim().length > 0;
  const pool = RECIPES.filter((r) => category === "All" || r.category === category);
  const results = applyFilters(pool, { query });

  return (
    <AppShell>
      <PageHeader
        title="Discover"
        subtitle={`${RECIPES.length} recipes stored on your device`}
      />

      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or ingredient"
            aria-label="Search recipes"
            className="pl-9"
          />
        </div>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium",
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-6">
        {searching ? (
          results.length > 0 ? (
            <section>
              <h2 className="mb-2 text-sm font-semibold text-foreground">
                {results.length} result{results.length === 1 ? "" : "s"}
              </h2>
              <div className="space-y-2.5">
                {results.slice(0, 60).map((r) => (
                  <RecipeCard
                    key={r.id}
                    recipe={r}
                    match={calculateRecipeMatch(r, available)}
                  />
                ))}
              </div>
            </section>
          ) : (
            <EmptyState
              emoji="🔍"
              title="Nothing found"
              description="Try a shorter word, like 'rice' or 'egg'."
            />
          )
        ) : (
          <>
            {DISCOVER_SECTIONS.map((section) => {
              const items = pool.filter(section.match).slice(0, 8);
              if (items.length === 0) return null;
              return (
                <section key={section.title}>
                  <h2 className="mb-2 text-sm font-semibold text-foreground">
                    {section.title}
                  </h2>
                  <div className="space-y-2.5">
                    {items.map((r) => (
                      <RecipeCard
                        key={r.id}
                        recipe={r}
                        match={calculateRecipeMatch(r, available)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
            <section>
              <h2 className="mb-2 text-sm font-semibold text-foreground">
                All {category === "All" ? "recipes" : category}
              </h2>
              <div className="space-y-2.5">
                {pool.map((r) => (
                  <RecipeCard
                    key={r.id}
                    recipe={r}
                    match={calculateRecipeMatch(r, available)}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}
