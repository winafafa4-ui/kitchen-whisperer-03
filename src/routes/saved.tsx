import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, EmptyState, PageHeader } from "@/components/AppShell";
import { RecipeCardList } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { RECIPE_BY_ID } from "@/data/recipes";
import { useAppStore } from "@/hooks/use-app-store";
import { calculateRecipeMatch } from "@/lib/matching";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Recipes — Cooking Kitchen Partners" },
      {
        name: "description",
        content:
          "Your bookmarked recipes, kept on your device and ready to cook whenever you are.",
      },
      { property: "og:title", content: "Saved Recipes — Cooking Kitchen Partners" },
      {
        property: "og:description",
        content: "The meals you keep coming back to, saved offline.",
      },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { saved, available } = useAppStore();
  const matches = saved
    .map((id) => RECIPE_BY_ID[id])
    .filter((r): r is NonNullable<typeof r> => Boolean(r))
    .map((r) => calculateRecipeMatch(r, available));

  return (
    <AppShell>
      <PageHeader
        title="Saved"
        subtitle={`${matches.length} recipe${matches.length === 1 ? "" : "s"} bookmarked`}
      />
      {matches.length === 0 ? (
        <EmptyState
          emoji="🔖"
          title="No saved recipes yet"
          description="Tap the bookmark on any recipe to keep it here for later."
          action={
            <Button asChild className="rounded-xl">
              <Link to="/discover">Browse recipes</Link>
            </Button>
          }
        />
      ) : (
        <RecipeCardList matches={matches} missingLabel />
      )}
    </AppShell>
  );
}
