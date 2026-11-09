import type { Size } from "@/app/products/[slug]/products";

import {
  MAX_LINE_QUANTITY,
  getCartItemId,
  type CartItem,
  type NewCartItem,
} from "./types";

/* ==========================================================================
   Module-level external store, consumed with useSyncExternalStore.
   - Server snapshot is always an empty cart (matches the first client render).
   - Client snapshot is loaded lazily from localStorage, once.
   ========================================================================== */

const STORAGE_KEY = "maison-verane:cart:v1";
const EMPTY_CART: readonly CartItem[] = [];

let cartItems: readonly CartItem[] = EMPTY_CART;
let isLoaded = false;
const listeners = new Set<() => void>();

/* ---- Storage ---- */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseItem(value: unknown): CartItem | null {
  if (!isRecord(value)) return null;

  const {
    productId,
    slug,
    name,
    image,
    colorId,
    colorName,
    size,
    unitPrice,
    quantity,
  } = value;

  if (
    typeof productId !== "string" ||
    typeof slug !== "string" ||
    typeof name !== "string" ||
    typeof colorId !== "string" ||
    typeof colorName !== "string" ||
    typeof size !== "string"
  ) {
    return null;
  }

  if (!isRecord(image)) return null;
  const { src, alt, objectPosition } = image;
  if (typeof src !== "string" || typeof alt !== "string") return null;

  if (
    typeof unitPrice !== "number" ||
    !Number.isFinite(unitPrice) ||
    unitPrice < 0
  ) {
    return null;
  }

  if (
    typeof quantity !== "number" ||
    !Number.isInteger(quantity) ||
    quantity < 1
  ) {
    return null;
  }

  const typedSize = size as Size;

  return {
    id: getCartItemId(productId, colorId, typedSize),
    productId,
    slug,
    name,
    image: {
      src,
      alt,
      ...(typeof objectPosition === "string" ? { objectPosition } : {}),
    },
    colorId,
    colorName,
    size: typedSize,
    unitPrice,
    quantity: Math.min(quantity, MAX_LINE_QUANTITY),
  };
}

function readFromStorage(): readonly CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_CART;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY_CART;

    // Merge any duplicate lines defensively
    const merged = new Map<string, CartItem>();
    for (const entry of parsed) {
      const item = parseItem(entry);
      if (!item) continue;

      const existing = merged.get(item.id);
      merged.set(
        item.id,
        existing
          ? {
              ...existing,
              quantity: Math.min(
                existing.quantity + item.quantity,
                MAX_LINE_QUANTITY,
              ),
            }
          : item,
      );
    }

    return merged.size > 0 ? Array.from(merged.values()) : EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
}

function writeToStorage(items: readonly CartItem[]): void {
  try {
    if (items.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  } catch {
    // Storage unavailable (private mode, quota): the cart still works in memory.
  }
}

/* ---- External store contract ---- */

function emit(): void {
  listeners.forEach((listener) => listener());
}

function handleStorageEvent(event: StorageEvent): void {
  // key === null means the whole storage area was cleared
  if (event.key !== null && event.key !== STORAGE_KEY) return;
  cartItems = readFromStorage();
  isLoaded = true;
  emit();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", handleStorageEvent);
    }
  };
}

export function getSnapshot(): readonly CartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;

  if (!isLoaded) {
    cartItems = readFromStorage();
    isLoaded = true;
  }
  return cartItems;
}

export function getServerSnapshot(): readonly CartItem[] {
  return EMPTY_CART;
}

function commit(next: readonly CartItem[]): void {
  cartItems = next.length === 0 ? EMPTY_CART : next;
  isLoaded = true;
  writeToStorage(cartItems);
  emit();
}

/* ---- Actions ---- */

/**
 * Adds a product variant to the bag. The same product + colour + size merges
 * into one line; any other combination becomes a separate line.
 * `limit` is the most the shopper may hold on this line (e.g. stock).
 */
export function addCartItem(
  item: NewCartItem,
  quantity: number,
  limit: number = MAX_LINE_QUANTITY,
): void {
  const cap = Math.min(Math.max(0, Math.floor(limit)), MAX_LINE_QUANTITY);
  const amount = Math.floor(quantity);
  if (amount < 1 || cap < 1) return;

  const current = getSnapshot();
  const id = getCartItemId(item.productId, item.colorId, item.size);
  const existing = current.find((line) => line.id === id);

  if (existing) {
    const nextQuantity = Math.min(existing.quantity + amount, cap);
    if (nextQuantity === existing.quantity) return;

    commit(
      current.map((line) =>
        line.id === id
          ? {
              ...line,
              name: item.name,
              image: item.image,
              colorName: item.colorName,
              unitPrice: item.unitPrice,
              quantity: nextQuantity,
            }
          : line,
      ),
    );
    return;
  }

  commit([...current, { ...item, id, quantity: Math.min(amount, cap) }]);
}

/** Sets a line's quantity. A quantity below 1 removes the line. */
export function setCartItemQuantity(
  id: string,
  quantity: number,
  limit: number = MAX_LINE_QUANTITY,
): void {
  const current = getSnapshot();
  const existing = current.find((line) => line.id === id);
  if (!existing) return;

  const cap = Math.min(Math.max(0, Math.floor(limit)), MAX_LINE_QUANTITY);
  const next = Math.min(Math.floor(quantity), cap);

  if (next < 1) {
    commit(current.filter((line) => line.id !== id));
    return;
  }
  if (next === existing.quantity) return;

  commit(
    current.map((line) =>
      line.id === id ? { ...line, quantity: next } : line,
    ),
  );
}

export function removeCartItem(id: string): void {
  const current = getSnapshot();
  if (!current.some((line) => line.id === id)) return;
  commit(current.filter((line) => line.id !== id));
}

export function clearCart(): void {
  if (getSnapshot().length === 0) return;
  commit(EMPTY_CART);
}
