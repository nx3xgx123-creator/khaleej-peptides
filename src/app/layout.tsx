import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFAB from "@/components/WhatsAppFAB";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Khaleej Peptides — Premium Research Peptides · UAE",
  description:
    "Premium research-grade peptides, third-party tested to a minimum 99% purity. Pens & vials with fast delivery across the UAE.",
  openGraph: {
    title: "Khaleej Peptides — Premium Research Peptides · UAE",
    description:
      "Premium research-grade peptides, third-party tested to a minimum 99% purity.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        {/* Google tag (gtag.js) — Google Ads AW-18299175469 (site-wide, once per page) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18299175469"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18299175469');
          `}
        </Script>
        <StoreProvider>
          <AgeGate />
          {/* Research-Use-Only notice — visible above the fold on every page */}
          <p
            role="note"
            className="bg-plum-deep px-4 py-1.5 text-center text-[0.68rem] font-medium leading-snug text-white"
          >
            Research Use Only — for laboratory research use, not for human consumption. Not
            evaluated by any regulatory authority.
          </p>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppFAB />
        </StoreProvider>
      </body>
    </html>
  );
}
