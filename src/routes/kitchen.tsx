import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell, EmptyState, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CATALOG_BY_ID, searchIngredients } from "@/data/ingredients";
import { INGREDIENT_CATEGORIES, UNITS, type Unit } from "@/types";
import { useAppStore } from "@/hooks/use-app-store";
import { daysUntil, formatQuantity } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/kitchen")({
  head: () => ({
    meta: [
      { title: "My Kitchen — Cooking Kitchen Partners" },
      {
        name: "description",
        content:
          "Keep track of every ingredient in your kitchen, with quantities, units and use-soon reminders.",
      },
      { property: "og:title", content: "My Kitchen — Cooking Kitchen Partners" },
      {
        property: "og:description",
        content: "Your offline pantry list: add, edit and organise your ingredients.",
      },
    ],
  }),
  component: KitchenPage,
});

function AddIngredientDialog() {
  const { addIngredient } = useAppStore();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [ingredientId, setIngredientId] = useState<string | undefined>();
  const [category, setCategory] = useState<string>("Other");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<Unit>("available");
  const [useSoon, setUseSoon] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");

  const results = useMemo(
    () => (query.trim() ? searchIngredients(query, 8) : []),
    [query],
  );

  const reset = () => {
    setQuery("");
    setName("");
    setIngredientId(undefined);
    setCategory("Other");
    setQuantity("");
    setUnit("available");
    setUseSoon(false);
    setExpiryDate("");
  };

  const submit = () => {
    const finalName = name.trim() || query.trim();
    if (!finalName) {
      toast.error("Give the ingredient a name first.");
      return;
    }
    const qty = quantity.trim() ? Number(quantity) : undefined;
    if (qty !== undefined && (!Number.isFinite(qty) || qty <= 0)) {
      toast.error("Enter a valid amount.");
      return;
    }
    addIngredient({
      ingredientId,
      name: finalName,
      category: category as never,
      quantity: qty,
      unit,
      useSoon,
      expiryDate: expiryDate || undefined,
    });
    toast.success(`${finalName} added to your kitchen`);
    reset();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="rounded-xl">Add</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle>Add an ingredient</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="ing-search">Ingredient</Label>
            <Input
              id="ing-search"
              value={name || query}
              placeholder="e.g. Chicken breast"
              onChange={(e) => {
                setQuery(e.target.value);
                setName("");
                setIngredientId(undefined);
              }}
            />
            {results.length > 0 && !name && (
              <ul className="mt-1.5 space-y-1 rounded-xl border border-border bg-card p-1">
                {results.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setIngredientId(r.id);
                        setName(r.name);
                        setCategory(r.category);
                        setUnit(r.defaultUnit);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-secondary"
                    >
                      <span>{r.emoji}</span>
                      <span className="flex-1">{r.name}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {r.category}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="ing-qty">Amount (optional)</Label>
              <Input
                id="ing-qty"
                inputMode="decimal"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="500"
              />
            </div>
            <div>
              <Label>Unit</Label>
              <Select value={unit} onValueChange={(v) => setUnit(v as Unit)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u === "available" ? "just have it" : u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INGREDIENT_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="ing-exp">Use before (optional)</Label>
            <Input
              id="ing-exp"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2">
            <Label htmlFor="ing-soon" className="text-sm">
              Use soon
            </Label>
            <Switch id="ing-soon" checked={useSoon} onCheckedChange={setUseSoon} />
          </div>

          <Button className="w-full rounded-xl" onClick={submit}>
            Add to kitchen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function KitchenPage() {
  const { ingredients, removeIngredient, updateIngredient, clearIngredients } =
    useAppStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = ingredients.filter((i) => {
    if (category !== "all" && i.category !== category) return false;
    if (query.trim() && !i.name.toLowerCase().includes(query.trim().toLowerCase()))
      return false;
    return true;
  });

  const grouped = INGREDIENT_CATEGORIES.map((c) => ({
    category: c,
    items: filtered.filter((i) => i.category === c),
  })).filter((g) => g.items.length > 0);

  return (
    <AppShell>
      <PageHeader
        title="My Kitchen"
        subtitle={`${ingredients.length} ingredient${ingredients.length === 1 ? "" : "s"} on hand`}
        action={<AddIngredientDialog />}
      />

      <div className="mb-3 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your ingredients"
            aria-label="Search your ingredients"
            className="pl-9"
          />
        </div>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {["all", ...INGREDIENT_CATEGORIES].map((c) => (
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
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </div>

      {ingredients.length === 0 ? (
        <EmptyState
          emoji="🥕"
          title="Nothing here yet"
          description="Add what's in your fridge and cupboards to start getting recipe ideas."
        />
      ) : grouped.length === 0 ? (
        <EmptyState
          emoji="🔍"
          title="No matches"
          description="Try a different word or category."
        />
      ) : (
        <div className="space-y-5">
          {grouped.map((g) => (
            <section key={g.category}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {g.category}
              </h2>
              <ul className="space-y-2">
                {g.items.map((i) => {
                  const d = daysUntil(i.expiryDate);
                  const soon = i.useSoon || (d !== null && d <= 3);
                  return (
                    <li
                      key={i.id}
                      className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2.5"
                    >
                      <span className="text-xl" aria-hidden>
                        {CATALOG_BY_ID[i.ingredientId]?.emoji ?? "🍽️"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {i.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {formatQuantity(i.quantity, i.unit) || "Available"}
                          {d !== null &&
                            ` · ${d < 0 ? "past date" : d === 0 ? "use today" : `${d} days left`}`}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-pressed={soon}
                        aria-label="Mark use soon"
                        onClick={() => updateIngredient(i.id, { useSoon: !i.useSoon })}
                        className={cn(
                          "rounded-full px-2 py-1 text-[11px] font-semibold",
                          soon
                            ? "bg-accent text-accent-foreground"
                            : "bg-secondary text-muted-foreground",
                        )}
                      >
                        Soon
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove ${i.name}`}
                        onClick={() => removeIngredient(i.id)}
                        className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive"
                      >
                        <X className="size-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}

          <Button
            variant="ghost"
            className="w-full rounded-xl text-destructive"
            onClick={() => {
              clearIngredients();
              toast.success("Kitchen cleared");
            }}
          >
            <Trash2 className="size-4" /> Clear all ingredients
          </Button>
        </div>
      )}
    </AppShell>
  );
}
