"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore, buildWhatsAppOrder } from "@/lib/store";
import {
  EMPTY_DETAILS,
  validateCheckout,
  type CheckoutDetails,
  type CheckoutErrors,
} from "@/lib/checkout";
import { CloseIcon, MinusIcon, PlusIcon, CartIcon, WhatsAppIcon } from "./icons";
import { VialThumb } from "./VialThumb";
import CheckoutForm from "./CheckoutForm";

const DETAILS_KEY = "kp_checkout_details";

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cart, fmt, subtotal, setQty, removeFromCart } = useStore();

  const [step, setStep] = useState<"cart" | "details">("cart");
  // Restore previously entered details so a repeat order isn't retyped. Read
  // lazily rather than in an effect — the drawer renders null until opened, so
  // there is no server/client markup to mismatch.
  const [details, setDetails] = useState<CheckoutDetails>(() => {
    if (typeof window === "undefined") return EMPTY_DETAILS;
    try {
      const saved = localStorage.getItem(DETAILS_KEY);
      return saved ? { ...EMPTY_DETAILS, ...JSON.parse(saved) } : EMPTY_DETAILS;
    } catch {
      return EMPTY_DETAILS;
    }
  });
  const [errors, setErrors] = useState<CheckoutErrors>({});

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  if (!cartOpen) return null;

  /** Close and rewind to the cart step, so reopening never lands mid-checkout. */
  function closeCart() {
    setStep("cart");
    setErrors({});
    setCartOpen(false);
  }

  function patchDetails(patch: Partial<CheckoutDetails>) {
    setDetails((d) => ({ ...d, ...patch }));
    // Clear a field's error as soon as the customer edits it.
    setErrors((e) => {
      const next = { ...e };
      for (const k of Object.keys(patch)) delete next[k as keyof CheckoutErrors];
      return next;
    });
  }

  function orderNow() {
    const found = validateCheckout(details);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    try {
      localStorage.setItem(DETAILS_KEY, JSON.stringify(details));
    } catch {}

    // A real, unique reference for this order. We generate it, send it in the
    // WhatsApp message (so it can be reconciled), and use it as the Google Ads
    // transaction_id so repeat clicks of the same order de-dupe.
    const signature = cart
      .map((l) => `${l.productId}:${l.variantLabel}:${l.qty}`)
      .join("|");

    let fired: Record<string, string> = {};
    try {
      fired = JSON.parse(sessionStorage.getItem("kp_conv_fired") || "{}");
    } catch {}

    const alreadyFired = Boolean(fired[signature]);
    const orderRef =
      fired[signature] ??
      `KP-${
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
      }`;

    // "WhatsApp Cart Order" (Purchase) conversion — fire exactly once per order.
    // This is a click handler, so refresh / back-button never re-fire it; the
    // sessionStorage guard prevents a repeat click of the same cart counting twice.
    if (!alreadyFired) {
      try {
        const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
        if (typeof gtag === "function") {
          gtag("event", "conversion", {
            send_to: "AW-18299175469/1NwMCN6jn88cEK2E3ZVE",
            value: subtotal ?? 0,
            currency: "AED",
            transaction_id: orderRef,
          });
        }
        fired[signature] = orderRef;
        sessionStorage.setItem("kp_conv_fired", JSON.stringify(fired));
      } catch (e) {
        console.error("WhatsApp conversion tracking error", e);
      }
    }

    const url = buildWhatsAppOrder(cart, orderRef, details);
    window.open(url, "_blank");
  }

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div
        className="absolute inset-0 bg-plum-ink/40"
        style={{ animation: "scrim-in 0.25s ease both" }}
        onClick={closeCart}
      />
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        style={{ animation: "drawer-in 0.32s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-2xl font-medium text-plum-deep">
            {step === "cart" ? "Your Selection" : "Delivery Details"}
          </h2>
          <button
            onClick={closeCart}
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
            <Link href="/shop" onClick={closeCart} className="btn-ghost text-sm">
              Browse Catalog
            </Link>
          </div>
        ) : step === "details" ? (
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <CheckoutForm details={details} errors={errors} onChange={patchDetails} />
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
                          onClick={closeCart}
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
            {step === "cart" ? (
              <>
                <button
                  onClick={() => setStep("details")}
                  className="btn-primary mt-4 flex w-full items-center justify-center gap-2 text-sm"
                >
                  Continue to Delivery Details
                </button>
                <button
                  onClick={closeCart}
                  className="mt-2 w-full py-2 text-center text-xs font-medium text-ink-soft hover:text-plum"
                >
                  Continue browsing
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={orderNow}
                  className="btn-primary mt-4 flex w-full items-center justify-center gap-2 text-sm"
                >
                  <WhatsAppIcon width={18} height={18} />
                  Send Order on WhatsApp
                </button>
                <button
                  onClick={() => setStep("cart")}
                  className="mt-2 w-full py-2 text-center text-xs font-medium text-ink-soft hover:text-plum"
                >
                  Back to cart
                </button>
              </>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
