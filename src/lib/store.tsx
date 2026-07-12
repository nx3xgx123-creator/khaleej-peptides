"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { formatPrice, PRODUCTS } from "./products";
import { WHATSAPP_NUMBER } from "./constants";

export interface CartLine {
  productId: string;
  name: string;
  variantLabel: string;
  unitPrice: number; // AED
  qty: number;
  cap: string;
  form: string;
}

interface StoreState {
  fmt: (aed: number) => string;

  cart: CartLine[];
  addToCart: (line: Omit<CartLine, "qty">, qty?: number) => void;
  removeFromCart: (productId: string, variantLabel: string) => void;
  setQty: (productId: string, variantLabel: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number; // AED

  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;

  verified: boolean;
  verify: () => void;
}

const StoreContext = createContext<StoreState | null>(null);

const CART_KEY = "peptiva_cart_v1";
const AGE_KEY = "peptiva_verified_v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [verified, setVerified] = useState(true); // assume true until hydrated to avoid SSR flash
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY);
      if (c) setCart(JSON.parse(c));
      setVerified(localStorage.getItem(AGE_KEY) === "1");
    } catch {
      setVerified(false);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  const fmt = useCallback((aed: number) => formatPrice(aed), []);

  const addToCart = useCallback(
    (line: Omit<CartLine, "qty">, qty = 1) => {
      setCart((prev) => {
        const idx = prev.findIndex(
          (l) => l.productId === line.productId && l.variantLabel === line.variantLabel
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + qty };
          return next;
        }
        return [...prev, { ...line, qty }];
      });
      setCartOpen(true);
    },
    []
  );

  const removeFromCart = useCallback((productId: string, variantLabel: string) => {
    setCart((prev) =>
      prev.filter((l) => !(l.productId === productId && l.variantLabel === variantLabel))
    );
  }, []);

  const setQty = useCallback((productId: string, variantLabel: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((l) =>
          l.productId === productId && l.variantLabel === variantLabel
            ? { ...l, qty: Math.max(0, qty) }
            : l
        )
        .filter((l) => l.qty > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const verify = useCallback(() => {
    setVerified(true);
    try {
      localStorage.setItem(AGE_KEY, "1");
    } catch {}
  }, []);

  const cartCount = cart.reduce((n, l) => n + l.qty, 0);
  const subtotal = cart.reduce((s, l) => s + l.unitPrice * l.qty, 0);

  return (
    <StoreContext.Provider
      value={{
        fmt,
        cart,
        addToCart,
        removeFromCart,
        setQty,
        clearCart,
        cartCount,
        subtotal,
        cartOpen,
        setCartOpen,
        verified: hydrated ? verified : true,
        verify,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

/** Build a WhatsApp order link from cart lines */
export function buildWhatsAppOrder(cart: CartLine[], orderRef?: string): string {
  const subtotal = cart.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  const lines: string[] = [
    "Hi Khaleej Peptides! I'd like to place the following order:",
    "",
    ...cart.map(
      (l, i) =>
        `${i + 1}. ${l.name} — ${l.variantLabel} ×${l.qty}  →  ${formatPrice(l.unitPrice * l.qty)}`
    ),
    "",
    `Total: ${formatPrice(subtotal)}`,
    ...(orderRef ? ["", `Order Ref: ${orderRef}`] : []),
    "",
    "Please confirm availability and next steps. Thank you!",
  ];
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/** Helper to look up product name list for search */
export const PRODUCT_INDEX = PRODUCTS.map((p) => ({
  id: p.id,
  name: p.name,
  subtitle: p.subtitle ?? "",
}));
