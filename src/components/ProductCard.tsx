"use client";

import Link from "next/link";
import { useState } from "react";
import { Product, fromPrice } from "@/lib/products";
import { useStore } from "@/lib/store";
import { VialThumb } from "./VialThumb";
import { ProductImage } from "./ProductImage";
import ProductRating from "./ProductRating";
import { PlusIcon, CheckIcon, PenIcon, VialIcon } from "./icons";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, fmt } = useStore();
  const [added, setAdded] = useState(false);

  const cheapest = product.variants.reduce((a, b) => (a.price <= b.price ? a : b));
  const repImage = product.variants.find((v) => v.image)?.image ?? product.images?.[0];

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      variantLabel: cheapest.label,
      unitPrice: cheapest.price,
      cap: product.cap,
      form: product.form,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <Link
      href={`/shop/${product.id}`}
      className="group surface-card relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-rosegold-soft hover:shadow-[0_24px_48px_-24px_rgba(35,43,61,0.35)]"
    >
      {/* cap accent line */}
      <span className="absolute inset-x-0 top-0 h-1" style={{ background: product.cap }} />

      {/* Thumb */}
      <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-blush/70 via-white to-blush-deep/40">
        {product.form === "vial" && !repImage ? (
          <div className="transition-transform duration-500 group-hover:scale-110">
            <VialThumb cap={product.cap} form={product.form} size={92} />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center p-2 transition-transform duration-500 ease-out group-hover:scale-[1.05]">
            <ProductImage
              src={repImage}
              name={product.name}
              accent={product.cap}
              penWidth={430}
              penClassName="rotate-[-15deg]"
              imgClassName="max-h-full w-auto object-contain"
            />
          </div>
        )}
        <span className="mono absolute right-3 top-3 flex items-center gap-1 rounded-card border border-line bg-white/85 px-2 py-1 text-[0.6rem] uppercase tracking-[0.06em] text-ink-soft backdrop-blur">
          {product.form === "vial" ? <VialIcon width={12} height={12} /> : <PenIcon width={12} height={12} />}
          {product.form === "vial" ? "Vial" : "Pen"}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <h3 className="font-display text-lg leading-tight text-ink">{product.name}</h3>
        <div className="mt-1">
          <ProductRating productId={product.id} />
        </div>
        {product.subtitle && (
          <p className="mono mt-0.5 line-clamp-1 text-[0.68rem] text-ink-soft">{product.subtitle}</p>
        )}
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-soft">{product.summary}</p>

        <div className="mono mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[0.62rem] uppercase tracking-[0.04em] text-ink-soft">
          <span>Research Grade</span>
          <span className="text-rosegold-deep">{product.purity} Purity</span>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-line pt-3">
          <div>
            <span className="mono text-[0.6rem] uppercase tracking-[0.08em] text-ink-soft">From</span>
            <p className="font-display text-xl text-ink">{fmt(fromPrice(product))}</p>
          </div>
          <button
            onClick={quickAdd}
            className={`flex h-10 w-10 items-center justify-center rounded-card transition-all ${
              added
                ? "bg-instock text-white"
                : "bg-plum text-white hover:bg-rosegold-deep"
            }`}
            aria-label={`Quick add ${product.name}`}
          >
            {added ? <CheckIcon width={18} height={18} /> : <PlusIcon width={18} height={18} />}
          </button>
        </div>
      </div>
    </Link>
  );
}
