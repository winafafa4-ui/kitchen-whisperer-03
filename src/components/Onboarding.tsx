import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CATALOG_BY_ID, QUICK_ADD_IDS } from "@/data/ingredients";
import { useAppStore } from "@/hooks/use-app-store";

const SLIDES = [
  {
    emoji: "🥘",
    title: "Cooking Kitchen Partners",
    body: "Your kitchen. Your ingredients. Your next meal.",
  },
  {
    emoji: "🧺",
    title: "Tell it what you have",
    body: "Add the ingredients sitting in your kitchen right now. No accounts, no internet — everything stays on your device.",
  },
  {
    emoji: "👩‍🍳",
    title: "Get real meal ideas",
    body: "See what you can cook today, what you're one ingredient away from, and simple swaps when something's missing.",
  },
];

export function Onboarding() {
  const [step, setStep] = useState(0);
  const { completeOnboarding, toggleQuickIngredient, hasIngredient } = useAppStore();
  const navigate = useNavigate();
  const isPicker = step === SLIDES.length;

  const finish = () => {
    completeOnboarding();
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 py-10">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        {isPicker ? (
          <div className="flex flex-1 flex-col">
            <div className="text-4xl" aria-hidden>
              🧺
            </div>
            <h1 className="mt-3 text-2xl font-bold text-foreground">
              What do you have?
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap a few staples to get started. You can add more any time.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {QUICK_ADD_IDS.map((id) => {
                const item = CATALOG_BY_ID[id];
                const on = hasIngredient(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleQuickIngredient(id)}
                    className={cn(
                      "rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                      on
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground",
                    )}
                  >
                    {item?.emoji} {item?.name ?? id}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col justify-center text-center">
            <div className="text-6xl" aria-hidden>
              {SLIDES[step].emoji}
            </div>
            <h1 className="mt-6 text-2xl font-bold text-foreground">
              {SLIDES[step].title}
            </h1>
            <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">
              {SLIDES[step].body}
            </p>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <div className="flex justify-center gap-1.5">
            {[...SLIDES, "picker"].map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === step ? "w-6 bg-primary" : "w-1.5 bg-border",
                )}
              />
            ))}
          </div>
          <Button
            className="h-12 w-full rounded-full text-base"
            onClick={() => (isPicker ? finish() : setStep(step + 1))}
          >
            {isPicker ? "Start cooking" : "Continue"}
          </Button>
          <button
            type="button"
            onClick={finish}
            className="w-full py-1 text-sm text-muted-foreground"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
