import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { CheckIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Certificate of Analysis Library | Khaleej Peptides",
  description: "Certificate of Analysis (COA) specifications for every compound in the Khaleej Peptides catalogue.",
};

export default function CoaLibraryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="eyebrow text-rosegold-deep">Quality Assurance</span>
      <h1 className="font-display mt-2 text-5xl text-ink sm:text-6xl">COA Library</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
        Identity, purity, and specification data for every compound in the catalogue. Batch-specific
        Certificates of Analysis are available on request for any lot supplied.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p) => (
          <Link
            key={p.id}
            href={`/coa/${p.id}`}
            className="group flex items-center justify-between rounded-card border border-line bg-white px-5 py-4 transition-colors hover:border-rosegold"
          >
            <div>
              <div className="font-display text-lg text-ink">{p.name}</div>
              <div className="mono mt-0.5 text-[0.65rem] uppercase tracking-[0.06em] text-ink-soft">
                {p.form === "vial" ? "Vial" : "Injection Pen"} &nbsp;·&nbsp; {p.purity}
              </div>
            </div>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-rosegold-deep transition-colors group-hover:border-rosegold">
              <CheckIcon width={14} height={14} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
