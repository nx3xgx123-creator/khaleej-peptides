"use client";

import { useMemo, useState } from "react";
import {
  PRODUCTS,
  FOCUS_META,
  Focus,
  Form,
  ALL_GOALS,
  fromPrice,
} from "@/lib/products";
import ProductCard from "./ProductCard";
import { FilterIcon, CloseIcon } from "./icons";

const FOCUS_KEYS: Focus[] = ["weightloss", "growth", "recovery", "antiaging", "wellness"];
const FORMS: { key: Form; label: string }[] = [
  { key: "pen", label: "Injection Pens" },
  { key: "vial", label: "Vials" },
];

type Sort = "featured" | "low" | "high" | "az";

export default function ShopClient({ initialFocus }: { initialFocus?: Focus }) {
  const [forms, setForms] = useState<Form[]>([]);
  const [focuses, setFocuses] = useState<Focus[]>(initialFocus ? [initialFocus] : []);
  const [goals, setGoals] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>("featured");
  const [mobileFilters, setMobileFilters] = useState(false);

  const toggle = <T,>(arr: T[], set: (v: T[]) => void, val: T) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (forms.length && !forms.includes(p.form)) return false;
      if (focuses.length && !p.focus.some((f) => focuses.includes(f))) return false;
      if (goals.length && !p.goals.some((g) => goals.includes(g))) return false;
      return true;
    });
    list = [...list];
    if (sort === "low") list.sort((a, b) => fromPrice(a) - fromPrice(b));
    else if (sort === "high") list.sort((a, b) => fromPrice(b) - fromPrice(a));
    else if (sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return list;
  }, [forms, focuses, goals, sort]);

  const activeCount = forms.length + focuses.length + goals.length;

  const FilterPanel = (
    <div className="space-y-7">
      <FilterGroup title="Form">
        {FORMS.map((f) => (
          <CheckRow
            key={f.key}
            label={f.label}
            checked={forms.includes(f.key)}
            onClick={() => toggle(forms, setForms, f.key)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Category">
        {FOCUS_KEYS.map((k) => (
          <CheckRow
            key={k}
            label={FOCUS_META[k].short}
            cap={FOCUS_META[k].cap}
            checked={focuses.includes(k)}
            onClick={() => toggle(focuses, setFocuses, k)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Treatment Goal">
        <div className="flex flex-wrap gap-1.5">
          {ALL_GOALS.map((g) => (
            <button
              key={g}
              onClick={() => toggle(goals, setGoals, g)}
              className={`rounded-full border px-2.5 py-1 text-[0.7rem] font-medium transition-colors ${
                goals.includes(g)
                  ? "border-plum bg-plum text-white"
                  : "border-line text-ink-soft hover:border-rosegold"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </FilterGroup>

      {activeCount > 0 && (
        <button
          onClick={() => {
            setForms([]);
            setFocuses([]);
            setGoals([]);
          }}
          className="text-xs font-semibold text-plum underline-offset-4 hover:underline"
        >
          Clear all filters ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <span className="eyebrow text-rosegold-deep">Catalog</span>
        <h1 className="font-display mt-2 text-4xl font-medium text-plum-deep sm:text-5xl">
          {focuses.length === 1 ? FOCUS_META[focuses[0]].title : "All Compounds"}
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Research grade · Third-party tested · Minimum 99% purity
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Desktop filter panel */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">{FilterPanel}</div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="mb-5 flex items-center justify-between gap-3">
            <button
              onClick={() => setMobileFilters(true)}
              className="btn-ghost px-4 py-2 text-sm lg:hidden"
            >
              <FilterIcon width={16} height={16} />
              Filters {activeCount > 0 && `(${activeCount})`}
            </button>
            <p className="hidden text-sm text-ink-soft sm:block">
              {filtered.length} {filtered.length === 1 ? "compound" : "compounds"}
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="ml-auto rounded-full border border-line bg-white px-4 py-2 text-sm text-ink outline-none focus:border-rosegold"
            >
              <option value="featured">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="az">Name: A–Z</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="surface-card flex flex-col items-center justify-center gap-3 py-20 text-center">
              <p className="text-sm text-ink-soft">No compounds match your filters.</p>
              <button
                onClick={() => {
                  setForms([]);
                  setFocuses([]);
                  setGoals([]);
                }}
                className="btn-ghost text-sm"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div
            className="absolute inset-0 bg-plum-ink/40"
            onClick={() => setMobileFilters(false)}
          />
          <div
            className="absolute left-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto bg-white p-6 shadow-2xl"
            style={{ animation: "fade-in 0.2s ease both" }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-medium text-plum-deep">Filters</h2>
              <button
                onClick={() => setMobileFilters(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-blush"
              >
                <CloseIcon />
              </button>
            </div>
            {FilterPanel}
            <button
              onClick={() => setMobileFilters(false)}
              className="btn-primary mt-8 w-full text-sm"
            >
              Show {filtered.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-plum-deep">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onClick,
  cap,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
  cap?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-lg px-1 py-1.5 text-left text-sm text-ink transition-colors hover:text-plum"
    >
      <span
        className={`flex h-4.5 w-4.5 items-center justify-center rounded border transition-colors ${
          checked ? "border-plum bg-plum text-white" : "border-line bg-white"
        }`}
        style={{ height: "1.05rem", width: "1.05rem" }}
      >
        {checked && (
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
            <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {cap && <span className="h-2.5 w-2.5 rounded-full" style={{ background: cap }} />}
      <span className="font-medium">{label}</span>
    </button>
  );
}
