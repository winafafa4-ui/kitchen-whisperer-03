import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, RotateCcw, Upload } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/hooks/use-app-store";
import { buildExport, parseImport } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Cooking Kitchen Partners" },
      {
        name: "description",
        content:
          "Choose your theme and measurements, back up your kitchen data, or start fresh. Everything stays on your device.",
      },
      { property: "og:title", content: "Settings — Cooking Kitchen Partners" },
      {
        property: "og:description",
        content: "Theme, measurements, backups and reset — all stored locally.",
      },
    ],
  }),
  component: SettingsPage,
});

const APPEARANCES = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const;

const MEASUREMENTS = [
  { value: "metric", label: "Metric (g, ml)" },
  { value: "imperial", label: "Imperial (cups, oz)" },
] as const;

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Choices<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "min-h-9 rounded-full border px-4 text-xs font-medium transition-colors",
            value === o.value
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-background text-muted-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SettingsPage() {
  const {
    preferences,
    setPreferences,
    ingredients,
    saved,
    history,
    importData,
    restartOnboarding,
    resetAll,
  } = useAppStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const bundle = buildExport();
      const blob = new Blob([JSON.stringify(bundle, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kitchen-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Backup file saved");
    } catch {
      toast.error("Could not create the backup file");
    }
  };

  const handleImport = async (file: File) => {
    const text = await file.text();
    const result = parseImport(text);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    importData({
      ingredients: result.data.ingredients,
      savedRecipes: result.data.savedRecipes,
      cookingHistory: result.data.cookingHistory,
      preferences: result.data.preferences,
    });
    toast.success("Backup restored");
  };

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
        title="Settings"
        subtitle="Everything is stored on this device only — no account, no internet needed."
      />

      <div className="space-y-4">
        <Section title="Appearance">
          <Choices
            label="Appearance"
            value={preferences.appearance}
            options={APPEARANCES}
            onChange={(appearance) => setPreferences({ appearance })}
          />
        </Section>

        <Section title="Measurements" description="Used when showing recipe amounts.">
          <Choices
            label="Measurements"
            value={preferences.measurement}
            options={MEASUREMENTS}
            onChange={(measurement) => setPreferences({ measurement })}
          />
        </Section>

        <Section title="Your data">
          <dl className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: "Ingredients", value: ingredients.length },
              { label: "Saved", value: saved.length },
              { label: "Cooked", value: history.length },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-muted/60 py-3">
                <dt className="text-[11px] text-muted-foreground">{s.label}</dt>
                <dd className="text-lg font-semibold text-foreground">{s.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="flex-1" onClick={handleExport}>
              <Download className="size-4" aria-hidden /> Export backup
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="size-4" aria-hidden /> Import backup
            </Button>
            <Label htmlFor="backup-file" className="sr-only">
              Choose a backup file
            </Label>
            <input
              id="backup-file"
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleImport(file);
                e.target.value = "";
              }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Importing replaces what is currently in the app.
          </p>
        </Section>

        <Section title="Cooking history">
          <Button asChild variant="outline" className="w-full">
            <Link to="/history">View cooking history</Link>
          </Button>
        </Section>

        <Section title="Start over">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                restartOnboarding();
                toast.success("Welcome tour will show again");
              }}
            >
              <RotateCcw className="size-4" aria-hidden /> Replay welcome
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                if (
                  window.confirm(
                    "Erase all ingredients, saved recipes and history from this device?",
                  )
                ) {
                  resetAll();
                  toast.success("Everything has been cleared");
                }
              }}
            >
              Erase all data
            </Button>
          </div>
        </Section>

        <p className="pb-2 text-center text-xs text-muted-foreground">
          Cooking Kitchen Partners · works fully offline
        </p>
      </div>
    </AppShell>
  );
}
