import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import FeaturedGrid from "@/components/FeaturedGrid";
import TrustBar from "@/components/TrustBar";
import Reviews from "@/components/Reviews";
import HeroVisual from "@/components/HeroVisual";
import Reveal from "@/components/Reveal";
import { ArrowRight } from "@/components/icons";
import { DnaMark } from "@/components/Logo";

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4);
  const compoundCount = PRODUCTS.length;

  return (
    <>
      {/* ============== HERO ============== */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          {/* Left */}
          <div style={{ animation: "var(--animate-slide-up)" }}>
            <div className="mono mb-6 text-xs uppercase tracking-[0.16em] text-rosegold-deep">
              Batch-Verified &nbsp;·&nbsp; Est. Dubai, UAE
            </div>
            <h1 className="font-display text-6xl font-medium leading-[0.98] text-ink sm:text-7xl lg:text-8xl">
              Research
              <br />
              peptides,
              <br />
              <span className="italic text-rosegold-deep">verified.</span>
            </h1>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-ink-soft">
              A curated laboratory catalogue of synthetic peptides and research compounds —
              each lot independently characterised by HPLC and released only above{" "}
              <strong className="text-ink">99% purity</strong>. Supplied strictly for in vitro
              research.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link href="/shop" className="btn-primary">
                View the Catalogue
                <ArrowRight width={18} height={18} />
              </Link>
              <Link href="/compliance" className="mono text-xs uppercase tracking-[0.08em] text-ink underline underline-offset-4">
                Read the Compliance Notice
              </Link>
            </div>

            <div className="mt-16 flex flex-wrap gap-x-14 gap-y-4 border-t border-line pt-7">
              {[
                ["99.4%", "Avg. HPLC Purity"],
                [String(compoundCount), "Compounds in Stock"],
                ["24h", "UAE Dispatch"],
              ].map(([big, small]) => (
                <div key={small}>
                  <p className="font-display text-4xl text-ink">{big}</p>
                  <p className="mono mt-1 text-[0.65rem] uppercase tracking-[0.1em] text-ink-soft">{small}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="relative" style={{ animation: "var(--animate-slide-up)", animationDelay: "0.1s" }}>
            <HeroVisual />
          </div>
        </div>
      </section>

      <TrustBar />

      {/* ============== FEATURED PRODUCTS ============== */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
              <div>
                <span className="eyebrow text-rosegold-deep">Catalogue &nbsp;/&nbsp; 01</span>
                <h2 className="font-display mt-2 text-4xl text-ink sm:text-5xl">
                  Featured Compounds
                </h2>
              </div>
              <Link href="/shop" className="mono text-xs uppercase tracking-[0.08em] text-ink underline underline-offset-4">
                View All {PRODUCTS.length} Compounds →
              </Link>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-8">
              <FeaturedGrid products={featured} />
            </div>
          </Reveal>
        </div>
      </section>

      <Reviews />

      {/* ============== TONE / TRUST CLOSER ============== */}
      <section className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <Reveal>
          <div className="lux-rule mb-6">
            <DnaMark size={20} />
          </div>
          <h2 className="font-display text-3xl leading-snug text-ink sm:text-4xl">
            Peptide science. <span className="italic text-rosegold-deep">Verified purity.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-soft">
            Khaleej Peptides offers a curated range of research peptides and related compounds,
            each characterised for identity and purity and backed by rigorous third-party
            testing — supplied for laboratory research use only.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="btn-primary">Browse the Catalog</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
