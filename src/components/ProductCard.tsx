"use client";

import Link from "next/link";
import { useState } from "react";
import { Product, FOCUS_META } from "@/lib/products";
import { useStore } from "@/lib/store";
import { VialThumb } from "./VialThumb";
import { ProductImage } from "./ProductImage";
import ProductRating from "./ProductRating";
import { CartIcon, CheckIcon } from "./icons";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, fmt } = useStore();
  const [added, setAdded] = useState(false);
  const [variantIdx, setVariantIdx] = useState(0);

  const variant = product.variants[variantIdx];
  const repImage = variant.image ?? product.variants.find((v) => v.image)?.image ?? product.images?.[0];
  const categoryLabel = FOCUS_META[product.focus[0]]?.short ?? product.category;

  function selectVariant(e: React.MouseEvent, idx: number) {
    e.preventDefault();
    e.stopPropagation();
    setVariantIdx(idx);
  }

  function addToCartClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      variantLabel: variant.label,
      unitPrice: variant.price,
      cap: product.cap,
      form: product.form,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-rosegold-soft hover:shadow-[0_24px_48px_-24px_rgba(35,43,61,0.35)]">
      <Link href={`/shop/${product.id}`} className="block">
        <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-blush/60 via-white to-blush-deep/30 p-6">
          {product.form === "vial" && !repImage ? (
            <div className="transition-transform duration-500 group-hover:scale-110">
              <VialThumb cap={product.cap} form={product.form} size={100} />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center transition-transform duration-500 ease-out group-hover:scale-[1.05]">
              <ProductImage
                src={repImage}
                name={product.name}
                accent={product.cap}
                penWidth={190}
                penClassName="rotate-[-18deg]"
                imgClassName="max-h-full w-auto rotate-[-18deg] object-contain"
              />
            </div>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <span className="mono text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-rosegold-deep">
          {categoryLabel}
        </span>
        <Link href={`/shop/${product.id}`}>
          <h3 className="mt-1 text-xl font-bold uppercase tracking-tight text-ink">{product.name}</h3>
        </Link>
        <div className="mt-1">
          <ProductRating productId={product.id} />
        </div>
        <p className="mt-2 text-lg font-bold text-rosegold-deep">{fmt(variant.price)}</p>

        {product.variants.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((v, idx) => (
              <button
                key={v.label}
                onClick={(e) => selectVariant(e, idx)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  idx === variantIdx
                    ? "border-plum bg-plum text-white"
                    : "border-line bg-white text-ink hover:border-rosegold"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={addToCartClick}
          className={`mt-4 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
            added
              ? "bg-instock text-white"
              : "bg-rosegold-deep text-white hover:bg-plum"
          }`}
        >
          {added ? <CheckIcon width={16} height={16} /> : <CartIcon width={16} height={16} />}
          {added ? "Added" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
