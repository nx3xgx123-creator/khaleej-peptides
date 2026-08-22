import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS, getProduct } from "@/lib/products";
import { CheckIcon } from "@/components/icons";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return { title: "COA not found | Khaleej Peptides" };
  return {
    title: `Certificate of Analysis — ${product.name} | Khaleej Peptides`,
    description: `Certificate of Analysis (COA) information for ${product.name}, research-grade material tested to ${product.purity} purity.`,
  };
}

export default async function CoaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <nav className="mono mb-8 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.08em] text-ink-soft">
        <Link href="/" className="hover:text-rosegold-deep">Home</Link>
        <span>/</span>
        <Link href="/coa" className="hover:text-rosegold-deep">COA Library</Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <span className="eyebrow text-rosegold-deep">Quality Assurance</span>
      <h1 className="font-display mt-2 text-5xl text-ink sm:text-6xl">Certificate of Analysis</h1>
      <p className="mono mt-3 text-xs uppercase tracking-[0.08em] text-ink-soft">
        {product.name}
        {product.subtitle ? ` · ${product.subtitle}` : ""}
      </p>

      <div className="relative mt-8 overflow-hidden rounded-card bg-plum p-8 text-white sm:p-10">
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
          <span className="mono text-[0.68rem] uppercase tracking-[0.16em] text-rosegold">Batch Specification</span>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rosegold">
            <CheckIcon width={18} height={18} className="text-rosegold" />
          </div>
        </div>

        <div className="relative mt-6">
          {[
            ["Product", product.name],
            ["CAS Number", product.molecular.cas],
            ["Molecular Formula", product.molecular.formula],
            ["Molecular Weight", product.molecular.weight],
            ["Sequence", product.molecular.sequence],
            ["Purity (Specification)", `≥ ${product.purity}`],
            ["Analysis Method", "HPLC · MS"],
            ["Storage", "−20 °C, protect from light"],
          ].map(([k, v]) => (
            <div key={k} className="spec-row">
              <span className="text-white/45">{k}</span>
              <span>{v ?? "—"}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-card border border-line bg-mist/40 px-6 py-5">
        <p className="mono text-[0.65rem] uppercase tracking-[0.08em] text-ink">Batch COA</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          A batch-specific Certificate of Analysis (identity and purity by HPLC and mass
          spectrometry) is available on request for every lot. Email{" "}
          <a
            href="mailto:support@khaleejpeptides.com"
            className="text-rosegold-deep underline-offset-4 hover:underline"
          >
            support@khaleejpeptides.com
          </a>{" "}
          with your order reference and we will provide the COA PDF for the lot supplied.
        </p>
        <p className="mt-3 text-[0.7rem] italic text-ink-soft">
          Research Use Only — for laboratory research use, not for human consumption. Not
          evaluated by any regulatory authority.
        </p>
      </div>

      <p className="mono mt-8 text-center text-[0.68rem] uppercase tracking-[0.06em] text-ink-soft">
        <Link href={`/shop/${product.id}`} className="hover:text-rosegold-deep">
          ← Back to {product.name}
        </Link>
        {" · "}
        <Link href="/coa" className="hover:text-rosegold-deep">
          COA Library
        </Link>
        {" · "}
        <Link href="/compliance" className="hover:text-rosegold-deep">
          Compliance
        </Link>
      </p>
    </div>
  );
}
