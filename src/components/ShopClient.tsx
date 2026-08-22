"use client";

import { useMemo, useState } from "react";
import { PRODUCTS, Form, fromPrice } from "@/lib/products";
import ProductCard from "./ProductCard";
import { ProductImage } from "./ProductImage";
import { ArrowRight } from "./icons";

type Sort = "featured" | "low" | "high" | "az";

export default function ShopClient() {
  const [forms, setForms] = useState<Form[]>([]);
  const [sort, setSort] = useState<Sort>("featured");

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (forms.length && !forms.includes(p.form)) return false;
      return true;
    });
    list = [...list];
    if (sort === "low") list.sort((a, b) => fromPrice(a) - fromPrice(b));
    else if (sort === "high") list.sort((a, b) => fromPrice(b) - fromPrice(a));
    else if (sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return list;
  }, [forms, sort]);

  const activeCount = forms.length;

  const formCounts = useMemo(
    () => ({
      pen: PRODUCTS.filter((p) => p.form === "pen").length,
      vial: PRODUCTS.filter((p) => p.form === "vial").length,
    }),
    []
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <span className="eyebrow text-rosegold-deep">Catalog</span>
        <h1 className="font-display mt-2 text-4xl font-medium text-plum-deep sm:text-5xl">
          All Compounds
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Research grade · Third-party tested · Minimum 99% purity
        </p>
      </div>

      {/* Pens vs. Vials chooser */}
      <div className="mb-14">
        <span className="eyebrow text-rosegold-deep">Choose Your Format</span>
        <h2 className="font-display mt-2 text-3xl font-medium text-plum-deep sm:text-4xl">
          Pens or vials.
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <FormatCard
            label="Injection Pens"
            desc="Pre-filled, ready-dosed pens for straightforward research handling — no reconstitution required."
            count={formCounts.pen}
            active={forms.length === 1 && forms[0] === "pen"}
            onClick={() => setForms(forms.length === 1 && forms[0] === "pen" ? [] : ["pen"])}
            image="/products/retatrutide-10mg.png"
            name="GLP3 Reta"
          />
          <FormatCard
            label="Vials"
            desc="Lyophilised powder in sealed vials for custom reconstitution and dosing control."
            count={formCounts.vial}
            active={forms.length === 1 && forms[0] === "vial"}
            onClick={() => setForms(forms.length === 1 && forms[0] === "vial" ? [] : ["vial"])}
            image="/products/retatrutide-vial-60mg.png"
            name="GLP3 Reta"
          />
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          {filtered.length} {filtered.length === 1 ? "compound" : "compounds"}
          {activeCount > 0 && (
            <button
              onClick={() => setForms([])}
              className="ml-3 font-semibold text-plum underline-offset-4 hover:underline"
            >
              Clear filter
            </button>
          )}
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="mono ml-auto rounded-card border border-line bg-white px-4 py-2 text-xs uppercase tracking-[0.04em] text-ink outline-none focus:border-rosegold"
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
          <button onClick={() => setForms([])} className="btn-ghost text-sm">
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function FormatCard({
  label,
  desc,
  count,
  active,
  onClick,
  image,
  name,
}: {
  label: string;
  desc: string;
  count: number;
  active: boolean;
  onClick: () => void;
  image: string;
  name: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-stretch gap-5 rounded-card border bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:border-gold sm:p-6 ${
        active ? "border-plum ring-1 ring-plum" : "border-line"
      }`}
    >
      <span className="relative flex h-28 w-24 shrink-0 items-center justify-center overflow-hidden rounded-card bg-white sm:h-32 sm:w-28">
        <span className="transition-transform duration-500 ease-out group-hover:scale-105">
          <ProductImage
            src={image}
            name={name}
            accent="#ad8434"
            penWidth={110}
            imgClassName="max-h-24 w-auto object-contain sm:max-h-28"
          />
        </span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="font-display text-xl font-medium text-plum-deep sm:text-2xl">{label}</span>
        <span className="mono mt-1 text-[0.62rem] uppercase tracking-[0.08em] text-ink-soft">
          {count} {count === 1 ? "compound" : "compounds"} available
        </span>
        <span className="mt-2 text-sm leading-snug text-ink-soft">{desc}</span>
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.04em] text-gold">
          Browse {label}
          <ArrowRight width={13} height={13} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </span>
    </button>
  );
}
