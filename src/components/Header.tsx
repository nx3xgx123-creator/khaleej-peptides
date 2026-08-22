"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { useStore } from "@/lib/store";
import { CartIcon, CloseIcon, FilterIcon } from "./icons";
import SearchBox from "./SearchBox";

export default function Header() {
  const { cartCount, setCartOpen } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Logo size={24} />
        </Link>

        {/* Desktop nav */}
        <nav className="mono ml-6 hidden items-center gap-6 text-[0.72rem] font-medium uppercase tracking-[0.14em] lg:flex">
          <Link href="/shop" className="text-ink transition-colors hover:text-rosegold-deep">
            Catalogue
          </Link>
          <Link href="/coa" className="text-ink transition-colors hover:text-rosegold-deep">
            COA Library
          </Link>
          <Link href="/reviews" className="text-ink transition-colors hover:text-rosegold-deep">
            Reviews
          </Link>
        </nav>

        {/* Right utilities */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden md:block">
            <SearchBox />
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-blush"
            aria-label="Open cart"
          >
            <CartIcon width={21} height={21} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-plum px-1 text-[0.65rem] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-blush lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <CloseIcon /> : <FilterIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-line bg-white px-4 py-4 lg:hidden" style={{ animation: "fade-in 0.2s ease both" }}>
          <div className="mb-3">
            <SearchBox compact />
          </div>
          <Link href="/shop" onClick={() => setMobileOpen(false)} className="mono block px-3 py-2.5 text-[0.72rem] font-medium uppercase tracking-[0.1em] text-ink hover:bg-blush">
            Catalogue
          </Link>
          <Link href="/coa" onClick={() => setMobileOpen(false)} className="mono block px-3 py-2.5 text-[0.72rem] font-medium uppercase tracking-[0.1em] text-ink hover:bg-blush">
            COA Library
          </Link>
          <Link href="/reviews" onClick={() => setMobileOpen(false)} className="mono block px-3 py-2.5 text-[0.72rem] font-medium uppercase tracking-[0.1em] text-ink hover:bg-blush">
            Reviews
          </Link>
        </div>
      )}
    </header>
  );
}
