"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { VialThumb } from "./VialThumb";
import { ProductImage } from "./ProductImage";
import WriteReview from "./WriteReview";
import ProductRating from "./ProductRating";
import {
  PlusIcon,
  MinusIcon,
  CheckIcon,
  FlaskIcon,
  PenIcon,
  VialIcon,
} from "./icons";

// Standard research-peptide storage — shown in the bullets and the spec table.
const STORAGE_LABEL = "Store lyophilised at −20 °C, protect from light";
const STORAGE_SPEC = "−20 °C, protect from light";

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart, fmt, setCartOpen } = useStore();
  const [variant, setVariant] = useState(product.variants[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const mainImage = variant.image ?? product.images?.[0];
  const lineTotal = variant.price * qty;

  function handleAdd() {
    addToCart(
      { productId: product.id, name: product.name, variantLabel: variant.label, unitPrice: variant.price, cap: product.cap, form: product.form },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  function buyNow() {
    addToCart(
      { productId: product.id, name: product.name, variantLabel: variant.label, unitPrice: variant.price, cap: product.cap, form: product.form },
      qty
    );
    setCartOpen(true);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mono mb-8 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.08em] text-ink-soft">
        <Link href="/" className="hover:text-rosegold-deep">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-rosegold-deep">Catalogue</Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-14 lg:grid-cols-2">
        {/* ===== Left: image + editorial + purchase ===== */}
        <div>
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-card border border-line bg-gradient-to-br from-blush via-white to-blush-deep">
            <span className="absolute inset-x-0 top-0 h-1" style={{ background: product.cap }} />
            <div className="flex h-full w-full items-center justify-center p-6">
              {product.form === "vial" && !mainImage ? (
                <VialThumb cap={product.cap} form={product.form} size={220} />
              ) : (
                <ProductImage
                  src={mainImage}
                  name={product.name}
                  dose={variant.label}
                  accent={product.cap}
                  penWidth={460}
                  imgClassName="max-h-full w-auto object-contain"
                />
              )}
            </div>
            <span className="mono absolute left-5 top-5 flex items-center gap-1.5 rounded-card border border-line bg-white/85 px-3 py-1 text-[0.65rem] uppercase tracking-[0.06em] text-ink-soft backdrop-blur">
              {product.form === "vial" ? <VialIcon width={14} height={14} /> : <PenIcon width={14} height={14} />}
              {product.form === "vial" ? "Sterile Vial" : "Injection Pen"}
            </span>
          </div>
          {product.variants.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.variants.slice(0, 6).map((v) => (
                <button
                  key={v.label}
                  onClick={() => setVariant(v)}
                  className={`flex h-20 flex-1 items-center justify-center overflow-hidden rounded-card border bg-mist/40 p-1 transition-colors ${
                    variant.label === v.label ? "border-plum" : "border-line hover:border-rosegold"
                  }`}
                  aria-label={`${product.name} ${v.label}`}
                >
                  <ProductImage src={v.image ?? product.images?.[0]} name={product.name} accent={product.cap} penWidth={150} imgClassName="max-h-full w-auto object-contain" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="mono inline-flex items-center gap-1.5 rounded-card bg-blush px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.08em] text-ink-soft">
              <span className="h-2 w-2 rounded-full" style={{ background: product.cap }} />
              {product.category}
            </span>
            <ProductRating productId={product.id} />
            <WriteReview productId={product.id} productName={product.name} />
          </div>

          <h1 className="font-display mt-4 text-5xl leading-[0.98] text-ink sm:text-6xl">{product.name}</h1>
          {product.subtitle && <p className="mono mt-2 text-xs uppercase tracking-[0.08em] text-rosegold-deep">{product.subtitle}</p>}
          <p className="font-display mt-5 max-w-lg text-xl italic leading-snug text-ink-soft">“{product.mechanism}”</p>

          <ul className="mt-6 space-y-2 text-sm text-ink-soft">
            {[product.summary, `≥ ${product.purity} purity (HPLC)`, STORAGE_LABEL, product.form === "vial" ? "Lyophilised powder, single sealed vial" : "Pre-filled injection pen"].map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 bg-rosegold-deep" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-xs italic leading-relaxed text-ink-soft">
            For laboratory research use only. Not for human consumption, therapeutic use, diagnostic application, or veterinary use.
          </p>

          <Link href={`/coa/${product.id}`} className="mono mt-4 inline-flex items-center gap-2 rounded-card border border-line px-4 py-2 text-[0.68rem] uppercase tracking-[0.06em] text-ink transition-colors hover:border-rosegold hover:text-rosegold-deep">
            <FlaskIcon width={14} height={14} />
            Certificate of Analysis (COA)
          </Link>

          {/* Variant selector */}
          <div className="mt-8 border-t border-line pt-6">
            <span className="mono text-[0.65rem] uppercase tracking-[0.08em] text-ink-soft">Select Size</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.label}
                  onClick={() => setVariant(v)}
                  className={`rounded-card border px-4 py-2.5 text-left transition-colors ${variant.label === v.label ? "border-plum bg-plum/5" : "border-line hover:border-rosegold"}`}
                >
                  <span className="block text-sm font-medium text-ink">{v.label}</span>
                  <span className="mono block text-xs text-ink-soft">{fmt(v.price)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + total + actions */}
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <div className="flex items-center rounded-card border border-line">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-11 w-11 items-center justify-center text-ink-soft hover:text-plum" aria-label="Decrease quantity">
                <MinusIcon />
              </button>
              <span className="w-10 text-center font-medium text-ink">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="flex h-11 w-11 items-center justify-center text-ink-soft hover:text-plum" aria-label="Increase quantity">
                <PlusIcon />
              </button>
            </div>
            <div>
              <span className="mono text-[0.6rem] uppercase tracking-[0.08em] text-ink-soft">Total</span>
              <p className="font-display text-3xl text-ink">{fmt(lineTotal)}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button onClick={handleAdd} className={`btn-primary flex-1 ${added ? "!bg-instock" : ""}`}>
              {added ? <><CheckIcon width={18} height={18} /> Added to cart</> : <><PlusIcon width={18} height={18} /> Add to Cart</>}
            </button>
            <button onClick={buyNow} className="btn-ghost flex-1">Buy Now</button>
          </div>
          <button onClick={() => setCartOpen(true)} className="mono mt-3 text-[0.68rem] uppercase tracking-[0.06em] text-ink-soft hover:text-plum">
            View cart →
          </button>
        </div>

        {/* ===== Right: persistent Certificate of Analysis panel ===== */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden rounded-card bg-plum p-8 text-white sm:p-10">
            <svg className="pointer-events-none absolute -bottom-10 -right-10 opacity-[0.08]" width="260" height="260" viewBox="0 0 200 200">
              <g fill="none" stroke="#fff" strokeWidth="1.2">
                <line x1="100" y1="20" x2="100" y2="70" /><line x1="100" y1="70" x2="145" y2="95" /><line x1="100" y1="70" x2="55" y2="95" />
                <line x1="145" y1="95" x2="145" y2="145" /><line x1="55" y1="95" x2="55" y2="145" /><line x1="145" y1="145" x2="100" y2="170" /><line x1="55" y1="145" x2="100" y2="170" />
                {[[100, 20], [100, 70], [145, 95], [55, 95], [145, 145], [55, 145], [100, 170]].map(([cx, cy]) => (
                  <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" />
                ))}
              </g>
            </svg>

            <div className="relative flex items-start justify-between">
              <span className="mono text-[0.68rem] uppercase tracking-[0.16em] text-rosegold">Certificate of Analysis</span>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rosegold">
                <CheckIcon width={18} height={18} className="text-rosegold" />
              </div>
            </div>

            <div className="relative mt-6 text-white/90">
              <div className="spec-row"><span className="text-white/45">CAS Number</span><span>{product.molecular.cas ?? "—"}</span></div>
              <div className="spec-row"><span className="text-white/45">Molecular Formula</span><span>{product.molecular.formula ?? "—"}</span></div>
              <div className="spec-row"><span className="text-white/45">Molecular Weight</span><span>{product.molecular.weight ?? "—"}</span></div>
              {product.molecular.sequence && (
                <div className="spec-row"><span className="text-white/45">Sequence</span><span>{product.molecular.sequence}</span></div>
              )}
              <div className="spec-row"><span className="text-white/45">Purity (HPLC)</span><span>≥ {product.purity}</span></div>
              <div className="spec-row"><span className="text-white/45">Form</span><span>{product.form === "vial" ? "Lyophilised Powder" : "Pre-filled Pen"}</span></div>
              <div className="spec-row"><span className="text-white/45">Storage</span><span>{STORAGE_SPEC}</span></div>
            </div>

            <p className="relative mono mt-6 text-[0.68rem] leading-relaxed text-white/45">
              Independently third-party tested. Manufactured under sterile conditions with full
              endotoxin screening. COA available on request for every batch.
            </p>
          </div>

          <div className="mt-6 rounded-card border border-line bg-mist/40 px-6 py-5">
            <p className="mono text-[0.65rem] uppercase tracking-[0.08em] text-ink">Research Use Only</p>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-ink-soft">
              This product is intended for laboratory research use only. It is not a drug, food, or
              cosmetic, and is not intended for human or animal use, diagnosis, treatment, cure, or
              prevention of any disease. By purchasing, you confirm you are a qualified researcher or
              institution acquiring this material for lawful research purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
