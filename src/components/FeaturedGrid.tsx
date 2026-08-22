import Link from "next/link";
import { Product, fromPrice, formatPrice } from "@/lib/products";

/** Blends are authored with "blend" in the summary and no molecular data (see products.ts). */
function isBlend(p: Product): boolean {
  return p.summary.toLowerCase().includes("blend");
}

/** Asymmetric editorial showcase for a fixed set of 4 products — one large "Certificate" card + three supporting cards. */
export default function FeaturedGrid({ products }: { products: Product[] }) {
  const [big, wide, small1, small2] = products;
  if (!big || !wide || !small1 || !small2) return null;

  return (
    <div className="grid grid-cols-4 gap-4" style={{ gridAutoRows: "200px" }}>
      <BigCard product={big} />
      <WideCard product={wide} />
      <SmallCard product={small1} dark />
      <SmallCard product={small2} />
    </div>
  );
}

function MoleculeMotif() {
  return (
    <svg className="pointer-events-none absolute -bottom-8 -right-8 opacity-[0.12]" width="220" height="220" viewBox="0 0 200 200">
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <line x1="100" y1="20" x2="100" y2="70" />
        <line x1="100" y1="70" x2="145" y2="95" />
        <line x1="100" y1="70" x2="55" y2="95" />
        <line x1="145" y1="95" x2="145" y2="145" />
        <line x1="55" y1="95" x2="55" y2="145" />
        <line x1="145" y1="145" x2="100" y2="170" />
        <line x1="55" y1="145" x2="100" y2="170" />
        {[[100, 20], [100, 70], [145, 95], [55, 95], [145, 145], [55, 145], [100, 170]].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" />
        ))}
      </g>
    </svg>
  );
}

function BigCard({ product: p }: { product: Product }) {
  return (
    <Link
      href={`/shop/${p.id}`}
      className="relative col-span-2 row-span-2 flex flex-col overflow-hidden rounded-card bg-plum p-7 text-white transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="text-plum/40"><MoleculeMotif /></div>
      <div className="relative flex items-start justify-between">
        <span className="mono text-[0.65rem] uppercase tracking-[0.14em] text-rosegold">Featured Compound</span>
        <span className="mono text-[0.65rem] text-white/45">{p.purity} Purity</span>
      </div>
      <div className="relative mt-auto">
        <div className="font-display text-4xl">{p.name}</div>
        <div className="mt-2 text-sm text-white/60">{p.summary}</div>
        <div className="mt-5 flex items-center justify-between border-t border-charcoal-soft pt-4">
          <span className="mono text-[0.68rem] text-white/45">CAS {p.molecular.cas ?? "—"}</span>
          <span className="font-display text-xl">{formatPrice(fromPrice(p))}</span>
        </div>
      </div>
    </Link>
  );
}

function WideCard({ product: p }: { product: Product }) {
  return (
    <Link
      href={`/shop/${p.id}`}
      className="surface-card col-span-2 flex flex-col justify-center px-6 transition-transform duration-300 hover:-translate-y-1"
    >
      <span className="mono text-[0.65rem] uppercase tracking-[0.1em] text-ink-soft">
        {p.form === "vial" ? "Vial" : "Injection Pen"}
      </span>
      <div className="font-display mt-1 text-2xl text-ink">{p.name}</div>
      <div className="mono mt-1 truncate text-xs text-ink-soft">{p.subtitle ?? p.summary}</div>
      <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
        <span className="mono text-[0.65rem] text-rosegold-deep">{p.purity}</span>
        <span className="font-display text-lg text-ink">{formatPrice(fromPrice(p))}</span>
      </div>
    </Link>
  );
}

function SmallCard({ product: p, dark }: { product: Product; dark?: boolean }) {
  return (
    <Link
      href={`/shop/${p.id}`}
      className={`flex flex-col rounded-card p-5 transition-transform duration-300 hover:-translate-y-1 ${
        dark ? "bg-plum text-white" : "surface-card"
      }`}
    >
      <span className={`mono text-[0.62rem] uppercase tracking-[0.1em] ${dark ? "text-white/45" : "text-ink-soft"}`}>
        {isBlend(p) ? "Blend" : "Single Compound"}
      </span>
      <div className="font-display mt-auto text-xl">{p.name}</div>
      <div
        className={`mt-3 flex items-center justify-between border-t pt-3 ${
          dark ? "border-charcoal-soft" : "border-line"
        }`}
      >
        <span className={`mono text-[0.62rem] ${dark ? "text-rosegold" : "text-rosegold-deep"}`}>{p.purity}</span>
        <span className="font-display text-base">{formatPrice(fromPrice(p))}</span>
      </div>
    </Link>
  );
}
