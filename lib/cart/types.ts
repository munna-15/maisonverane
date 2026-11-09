import type { ProductImage, Size } from "@/app/products/[slug]/products";

/** Hard ceiling for a single cart line, regardless of stock. */
export const MAX_LINE_QUANTITY = 10;

export interface CartItem {
  /** Deterministic key: product + colour + size */
  readonly id: string;
  readonly productId: string;
  readonly slug: string;
  readonly name: string;
  readonly image: ProductImage;
  readonly colorId: string;
  readonly colorName: string;
  readonly size: Size;
  readonly unitPrice: number;
  readonly quantity: number;
}

export type NewCartItem = Omit<CartItem, "id" | "quantity">;

export function getCartItemId(
  productId: string,
  colorId: string,
  size: Size,
): string {
  return `${productId}::${colorId}::${size}`;
}

export function countItems(items: readonly CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function calculateSubtotal(items: readonly CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}
