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
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_24px_48px_-24px_rgba(35,43,61,0.35)]">
      <Link href={`/shop/${product.id}`} className="block">
        <div className="relative flex h-36 w-full items-center justify-center overflow-hidden bg-white p-4 sm:h-40">
          {product.form === "vial" && !repImage ? (
            <div className="flex h-full w-full items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <VialThumb cap={product.cap} form={product.form} size={80} />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center transition-transform duration-500 ease-out group-hover:scale-[1.04]">
              <ProductImage
                src={repImage}
                name={product.name}
                accent={product.cap}
                penWidth={140}
                penClassName="flex h-full w-full items-center justify-center rotate-[-18deg]"
                imgClassName="max-h-full w-auto object-contain"
              />
            </div>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <span className="mono text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-gold">
          {categoryLabel}
        </span>
        <Link href={`/shop/${product.id}`}>
          <h3 className="mt-1 text-base font-bold uppercase leading-tight tracking-tight text-ink">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1">
          <ProductRating productId={product.id} />
        </div>
        <p className="mt-1.5 text-base font-bold text-gold">{fmt(variant.price)}</p>

        {product.variants.length > 1 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {product.variants.map((v, idx) => (
              <button
                key={v.label}
                onClick={(e) => selectVariant(e, idx)}
                className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold transition-colors ${
                  idx === variantIdx
                    ? "border-plum bg-plum text-white"
                    : "border-line bg-white text-ink hover:border-gold"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={addToCartClick}
          className={`mt-3 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${
            added
              ? "bg-instock text-white"
              : "bg-gold text-white hover:bg-gold-deep"
          }`}
        >
          {added ? <CheckIcon width={14} height={14} /> : <CartIcon width={14} height={14} />}
          {added ? "Added" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
