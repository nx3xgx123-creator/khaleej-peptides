"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useStore, buildWhatsAppOrder } from "@/lib/store";
import { CloseIcon, MinusIcon, PlusIcon, CartIcon, WhatsAppIcon } from "./icons";
import { VialThumb } from "./VialThumb";

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cart, fmt, subtotal, setQty, removeFromCart } = useStore();

  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  if (!cartOpen) return null;

  function orderNow() {
    const url = buildWhatsAppOrder(cart);
    window.open(url, "_blank");
  }

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div
        className="absolute inset-0 bg-plum-ink/40"
        style={{ animation: "scrim-in 0.25s ease both" }}
        onClick={() => setCartOpen(false)}
      />
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        style={{ animation: "drawer-in 0.32s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-2xl font-medium text-plum-deep">Your Selection</h2>
          <button
            onClick={() => setCartOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-blush"
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Items */}
        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blush text-rosegold-deep">
              <CartIcon width={28} height={28} />
            </div>
            <p className="text-sm text-ink-soft">Your cart is empty.</p>
            <Link href="/shop" onClick={() => setCartOpen(false)} className="btn-ghost text-sm">
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <ul className="divide-y divide-line">
              {cart.map((l) => (
                <li key={`${l.productId}-${l.variantLabel}`} className="flex gap-4 py-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-line bg-mist/50">
                    <VialThumb cap={l.cap} form={l.form} size={44} />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/shop/${l.productId}`}
                          onClick={() => setCartOpen(false)}
                          className="text-sm font-semibold text-ink hover:text-plum"
                        >
                          {l.name}
                        </Link>
                        <p className="text-[0.72rem] text-ink-soft">{l.variantLabel}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(l.productId, l.variantLabel)}
                        className="text-ink-soft/60 hover:text-plum"
                        aria-label="Remove"
                      >
                        <CloseIcon width={16} height={16} />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-line">
                        <button
                          onClick={() => setQty(l.productId, l.variantLabel, l.qty - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-ink-soft hover:text-plum"
                          aria-label="Decrease"
                        >
                          <MinusIcon width={14} height={14} />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold text-ink">{l.qty}</span>
                        <button
                          onClick={() => setQty(l.productId, l.variantLabel, l.qty + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-ink-soft hover:text-plum"
                          aria-label="Increase"
                        >
                          <PlusIcon width={14} height={14} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-plum-deep">
                        {fmt(l.unitPrice * l.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-line px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-soft">Subtotal</span>
              <span className="font-display text-2xl font-medium text-plum-deep">{fmt(subtotal)}</span>
            </div>
            <button
              onClick={orderNow}
              className="btn-primary mt-4 flex w-full items-center justify-center gap-2 text-sm"
            >
              <WhatsAppIcon width={18} height={18} />
              Order via WhatsApp
            </button>
            <button
              onClick={() => setCartOpen(false)}
              className="mt-2 w-full py-2 text-center text-xs font-medium text-ink-soft hover:text-plum"
            >
              Continue browsing
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
