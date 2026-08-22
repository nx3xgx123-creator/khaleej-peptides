import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import TrustBar from "@/components/TrustBar";
import Reviews from "@/components/Reviews";
import HeroVisual from "@/components/HeroVisual";
import Reveal from "@/components/Reveal";
import { ArrowRight } from "@/components/icons";
import { DnaMark } from "@/components/Logo";

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      {/* ============== HERO ============== */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(1200px 500px at 15% -10%, rgba(235,224,200,0.55), transparent), radial-gradient(900px 500px at 100% 0%, rgba(35,43,61,0.1), transparent)",
          }}
        />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
          {/* Left */}
          <div style={{ animation: "var(--animate-slide-up)" }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-1.5 backdrop-blur">
              <DnaMark size={16} />
              <span className="eyebrow text-rosegold-deep">Premium Research Peptides · UAE</span>
            </div>
            <h1 className="font-display text-5xl font-medium leading-[1.05] text-plum-deep sm:text-6xl lg:text-7xl">
              Research-Grade Peptides.
              <br />
              <span className="text-rosegold-gradient">Gulf-Grade Purity.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft">
              Research-grade peptides, synthesized to a minimum{" "}
              <strong className="text-ink">99% purity</strong> and independently third-party
              tested. Pens and vials, discreetly packaged with fast delivery across the UAE.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/shop" className="btn-primary">
                Shop Our Catalog
                <ArrowRight width={18} height={18} />
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {[
                ["99%+", "Verified Purity"],
                ["3rd-Party", "Lab Tested"],
                ["UAE", "Fast Delivery"],
              ].map(([big, small]) => (
                <div key={small}>
                  <p className="font-display text-2xl font-semibold text-plum">{big}</p>
                  <p className="text-xs uppercase tracking-wider text-ink-soft">{small}</p>
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
      <section className="bg-blush/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow text-rosegold-deep">Best Sellers</span>
                <h2 className="font-display mt-2 text-4xl font-medium text-plum-deep sm:text-5xl">
                  Featured Compounds
                </h2>
              </div>
              <Link href="/shop" className="btn-ghost text-sm">
                View all
                <ArrowRight width={16} height={16} />
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Reviews />

      {/* ============== TONE / TRUST CLOSER ============== */}
      <section className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <Reveal>
          <div className="lux-rule mb-6">
            <DnaMark size={20} />
          </div>
          <h2 className="font-display text-3xl font-medium leading-snug text-plum-deep sm:text-4xl">
            Peptide science. <span className="text-rosegold-gradient">Verified purity.</span>
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
