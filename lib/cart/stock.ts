import { PRODUCT_BY_SLUG } from "@/app/products/[slug]/products";

import { MAX_LINE_QUANTITY, type CartItem } from "./types";

/** Units in stock for this exact product / colour / size (0 if it no longer exists). */
export function getAvailableStock(item: CartItem): number {
  const product = PRODUCT_BY_SLUG.get(item.slug);
  const color = product?.colors.find((c) => c.id === item.colorId);
  return color?.stock[item.size] ?? 0;
}

/** Highest quantity the shopper may hold for this line. */
export function getLineLimit(item: CartItem): number {
  return Math.min(MAX_LINE_QUANTITY, getAvailableStock(item));
}
