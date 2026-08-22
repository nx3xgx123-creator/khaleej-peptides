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
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-white">
          {product.form === "vial" && !repImage ? (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blush/60 via-white to-blush-deep/30 transition-transform duration-500 group-hover:scale-110">
              <VialThumb cap={product.cap} form={product.form} size={100} />
            </div>
          ) : (
            <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]">
              <ProductImage
                src={repImage}
                name={product.name}
                accent={product.cap}
                penWidth={190}
                penClassName="flex h-full w-full items-center justify-center rotate-[-18deg] bg-gradient-to-br from-blush/60 via-white to-blush-deep/30"
                imgClassName="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <span className="mono text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-gold">
          {categoryLabel}
        </span>
        <Link href={`/shop/${product.id}`}>
          <h3 className="mt-1 text-xl font-bold uppercase tracking-tight text-ink">{product.name}</h3>
        </Link>
        <div className="mt-1">
          <ProductRating productId={product.id} />
        </div>
        <p className="mt-2 text-lg font-bold text-gold">{fmt(variant.price)}</p>

        {product.variants.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((v, idx) => (
              <button
                key={v.label}
                onClick={(e) => selectVariant(e, idx)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  idx === variantIdx
                    ? "border-plum bg-plum text-white"
                    : "border-gold/40 bg-white text-ink hover:border-gold"
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
              : "bg-gold text-white hover:bg-gold-deep"
          }`}
        >
          {added ? <CheckIcon width={16} height={16} /> : <CartIcon width={16} height={16} />}
          {added ? "Added" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
