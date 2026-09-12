import { Link } from "@tanstack/react-router";
import { Clock, Users, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/hooks/use-app-store";
import type { MatchResult, Recipe } from "@/types";

const CATEGORY_EMOJI: Record<string, string> = {
  Indonesian: "🍚",
  Asian: "🥢",
  Western: "🍝",
};

export function MatchBadge({ percent }: { percent: number }) {
  const tone =
    percent === 100
      ? "bg-primary text-primary-foreground"
      : percent >= 70
        ? "bg-accent text-accent-foreground"
        : "bg-secondary text-secondary-foreground";
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", tone)}>
      {percent}% match
    </span>
  );
}

export function SaveButton({ recipeId }: { recipeId: string }) {
  const { isSaved, toggleSaved } = useAppStore();
  const saved = isSaved(recipeId);
  return (
    <button
      type="button"
      aria-label={saved ? "Remove from saved" : "Save recipe"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaved(recipeId);
      }}
      className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      <Bookmark className={cn("size-4", saved && "fill-primary text-primary")} />
    </button>
  );
}

export function RecipeCard({
  recipe,
  match,
  missingLabel,
}: {
  recipe: Recipe;
  match?: MatchResult;
  missingLabel?: boolean;
}) {
  const missing = match?.missing ?? [];
  return (
    <Link
      to="/recipe/$recipeId"
      params={{ recipeId: recipe.id }}
      className="flex gap-3 rounded-2xl border border-border bg-card p-3 transition-colors hover:border-primary/40"
    >
      <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl">
        {CATEGORY_EMOJI[recipe.category] ?? "🍽️"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {recipe.name}
          </h3>
          <SaveButton recipeId={recipe.id} />
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {recipe.description}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          {match && <MatchBadge percent={match.percent} />}
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" /> {recipe.cookingTime} min
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3" /> {recipe.servings}
          </span>
          <span>{recipe.difficulty}</span>
        </div>
        {missingLabel && missing.length > 0 && (
          <p className="mt-1.5 text-[11px] font-medium text-accent-foreground">
            Missing: {missing.map((m) => m.name).join(", ")}
          </p>
        )}
      </div>
    </Link>
  );
}

export function RecipeCardList({
  matches,
  missingLabel,
}: {
  matches: MatchResult[];
  missingLabel?: boolean;
}) {
  return (
    <div className="space-y-2.5">
      {matches.map((m) => (
        <RecipeCard
          key={m.recipe.id}
          recipe={m.recipe}
          match={m}
          missingLabel={missingLabel}
        />
      ))}
    </div>
  );
}
