import { PRODUCTS, fromPrice, formatPrice } from "@/lib/products";
import { CheckIcon } from "./icons";

/** Certificate-of-Analysis style specimen card — clinical counterpart to the hero's editorial headline. */
export default function HeroVisual() {
  const featured = PRODUCTS.find((p) => p.id === "rt-10") ?? PRODUCTS[0];

  return (
    <div className="relative w-full overflow-hidden rounded-card border border-line bg-gradient-to-br from-blush via-white to-blush-deep p-8 sm:p-12">
      {/* ambient drifting glow */}
      <div
        className="float-a absolute -right-16 -top-16 h-72 w-72 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(168,96,46,0.45), transparent 70%)" }}
      />
      <div
        className="float-b absolute -bottom-20 -left-12 h-72 w-72 rounded-full opacity-45 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(20,23,31,0.4), transparent 70%)" }}
      />

      {/* molecular line-art motif */}
      <svg
        className="pointer-events-none absolute -right-10 -top-10 opacity-[0.14]"
        width="260"
        height="260"
        viewBox="0 0 200 200"
      >
        <g fill="none" stroke="var(--color-plum)" strokeWidth="1.2">
          <line x1="100" y1="20" x2="100" y2="70" />
          <line x1="100" y1="70" x2="145" y2="95" />
          <line x1="100" y1="70" x2="55" y2="95" />
          <line x1="145" y1="95" x2="145" y2="145" />
          <line x1="55" y1="95" x2="55" y2="145" />
          <line x1="145" y1="145" x2="100" y2="170" />
          <line x1="55" y1="145" x2="100" y2="170" />
          {[
            [100, 20],
            [100, 70],
            [145, 95],
            [55, 95],
            [145, 145],
            [55, 145],
            [100, 170],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" />
          ))}
        </g>
      </svg>

      <div className="relative rounded-card bg-plum p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="mono text-[0.68rem] uppercase tracking-[0.16em] text-rosegold">
              Certificate of Analysis
            </div>
            <div className="font-display mt-2 text-3xl">{featured.name}</div>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rosegold">
            <CheckIcon width={18} height={18} className="text-rosegold" />
          </div>
        </div>

        <div className="mono mt-6 text-xs">
          <div className="spec-row">
            <span className="text-white/45">Molecular Wt.</span>
            <span>{featured.molecular.weight ?? "—"}</span>
          </div>
          <div className="spec-row">
            <span className="text-white/45">Purity (HPLC)</span>
            <span>≥ {featured.purity}</span>
          </div>
          <div className="spec-row">
            <span className="text-white/45">Storage</span>
            <span>−20°C, dark</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-charcoal-soft pt-4">
          <span className="mono text-[0.65rem] text-white/45">LOT KP-2026-0731</span>
          <span className="font-display text-xl">{formatPrice(fromPrice(featured))}</span>
        </div>
      </div>

      <div className="relative mt-6 flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-rosegold-soft" />
        <span className="eyebrow text-rosegold-deep">Khaleej Peptides · UAE</span>
        <span className="h-px w-10 bg-rosegold-soft" />
      </div>
    </div>
  );
}
