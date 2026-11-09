"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import type { Size } from "@/app/products/[slug]/products";
import {
  addCartItem,
  clearCart,
  getServerSnapshot,
  getSnapshot,
  removeCartItem,
  setCartItemQuantity,
  subscribe,
} from "@/lib/cart/cart-store";
import {
  calculateSubtotal,
  countItems,
  getCartItemId,
  type CartItem,
  type NewCartItem,
} from "@/lib/cart/types";

interface CartContextValue {
  readonly items: readonly CartItem[];
  /** Total units across all lines */
  readonly itemCount: number;
  readonly subtotal: number;
  /** False on the server and during hydration, true once localStorage is read */
  readonly isReady: boolean;
  readonly addItem: (
    item: NewCartItem,
    quantity: number,
    limit?: number,
  ) => void;
  readonly updateQuantity: (
    id: string,
    quantity: number,
    limit?: number,
  ) => void;
  readonly removeItem: (id: string) => void;
  readonly clearCart: () => void;
  readonly getQuantity: (
    productId: string,
    colorId: string,
    size: Size,
  ) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

const subscribeToNothing = () => () => {};

/** false during SSR + hydration, true afterwards, with no effect or setState. */
function useIsHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isReady = useIsHydrated();

  const getQuantity = useCallback(
    (productId: string, colorId: string, size: Size): number => {
      const id = getCartItemId(productId, colorId, size);
      return items.find((line) => line.id === id)?.quantity ?? 0;
    },
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: countItems(items),
      subtotal: calculateSubtotal(items),
      isReady,
      addItem: addCartItem,
      updateQuantity: setCartItemQuantity,
      removeItem: removeCartItem,
      clearCart,
      getQuantity,
    }),
    [items, isReady, getQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>.");
  }
  return context;
}
