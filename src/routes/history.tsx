import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Trash2 } from "lucide-react";
import { AppShell, EmptyState, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/hooks/use-app-store";
import { relativeDay } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CookingHistoryEntry } from "@/types";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Cooking History — Cooking Kitchen Partners" },
      {
        name: "description",
        content:
          "Everything you have cooked, with your own ratings, stored offline on your device.",
      },
      { property: "og:title", content: "Cooking History — Cooking Kitchen Partners" },
      {
        property: "og:description",
        content: "Look back at the meals you cooked and how much you liked them.",
      },
    ],
  }),
  component: HistoryPage,
});

const RATINGS: { value: NonNullable<CookingHistoryEntry["rating"]>; emoji: string; label: string }[] =
  [
    { value: "loved", emoji: "😍", label: "Loved it" },
    { value: "okay", emoji: "🙂", label: "It was okay" },
    { value: "no", emoji: "😕", label: "Not again" },
  ];

function HistoryPage() {
  const { history, rateHistory, clearHistory } = useAppStore();

  const loved = history.filter((h) => h.rating === "loved").length;

  return (
    <AppShell>
      <div className="mb-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden /> Home
        </Link>
      </div>

      <PageHeader
        title="Cooking history"
        subtitle={
          history.length
            ? `${history.length} meal${history.length === 1 ? "" : "s"} cooked · ${loved} loved`
            : "Your cooked meals will show up here"
        }
        action={
          history.length > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={clearHistory}
            >
              <Trash2 className="size-4" aria-hidden />
              <span className="sr-only sm:not-sr-only">Clear</span>
            </Button>
          ) : undefined
        }
      />

      {history.length === 0 ? (
        <EmptyState
          emoji="🍳"
          title="Nothing cooked yet"
          description="When you finish a recipe and tap “I cooked this”, it lands here so you can rate it and find it again."
          action={
            <Button asChild>
              <Link to="/cook">Find something to cook</Link>
            </Button>
          }
        />
      ) : (
        <ul className="space-y-3">
          {history.map((entry) => (
            <li
              key={entry.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    to="/recipe/$recipeId"
                    params={{ recipeId: entry.recipeId }}
                    className="block truncate text-sm font-semibold text-foreground"
                  >
                    {entry.recipeName}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {relativeDay(entry.cookedAt)}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex gap-2" role="group" aria-label="Rate this meal">
                {RATINGS.map((r) => {
                  const active = entry.rating === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      aria-pressed={active}
                      aria-label={r.label}
                      onClick={() => rateHistory(entry.id, r.value)}
                      className={cn(
                        "flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors",
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground",
                      )}
                    >
                      <span aria-hidden>{r.emoji}</span>
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
