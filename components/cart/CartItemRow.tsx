"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

import { formatPrice } from "@/lib/cart/format";
import { getLineLimit } from "@/lib/cart/stock";
import type { CartItem } from "@/lib/cart/types";

import { useCart } from "./CartProvider";

const EASE = [0.22, 1, 0.36, 1] as const;

export function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const reduceMotion = useReducedMotion() ?? false;

  const limit = getLineLimit(item);
  const unavailable = limit === 0;
  const overStock = !unavailable && item.quantity > limit;
  const atMax = item.quantity >= limit;

  const variantLabel = `${item.name}, ${item.colorName}, size ${item.size}`;

  return (
    <motion.li
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE }}
      className="overflow-hidden border-b border-border"
    >
      <div className="flex gap-4 py-6 sm:gap-6 sm:py-8">
        {/* Thumbnail (decorative: the product name link carries the label) */}
        <Link
          href={`/products/${item.slug}`}
          aria-hidden="true"
          tabIndex={-1}
          className="relative block aspect-3/4 w-24 shrink-0 self-start overflow-hidden rounded-md bg-warm-200 sm:w-32"
        >
          <Image
            src={item.image.src}
            alt=""
            fill
            sizes="(min-width: 640px) 128px, 96px"
            quality={80}
            className="object-cover"
            style={{ objectPosition: item.image.objectPosition ?? "center" }}
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Name + line total */}
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-serif text-lg font-medium leading-snug tracking-normal text-ink sm:text-xl">
              <Link
                href={`/products/${item.slug}`}
                className="transition-colors duration-300 hover:text-wine focus-visible:text-wine"
              >
                {item.name}
              </Link>
            </h3>

            <p className="shrink-0 text-base tabular-nums text-ink">
              <span className="sr-only">Line total: </span>
              {formatPrice(item.unitPrice * item.quantity)}
            </p>
          </div>

          {/* Variant details */}
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-sm">
            <dt className="text-ink-muted">Colour</dt>
            <dd className="text-ink">{item.colorName}</dd>
            <dt className="text-ink-muted">Size</dt>
            <dd className="text-ink">{item.size}</dd>
          </dl>

          {item.quantity > 1 ? (
            <p className="mt-1.5 text-sm tabular-nums text-ink-muted">
              {formatPrice(item.unitPrice)} each
            </p>
          ) : null}

          {unavailable ? (
            <p role="status" className="mt-2 text-sm text-wine">
              This piece is no longer available. Please remove it from your bag.
            </p>
          ) : overStock ? (
            <p role="status" className="mt-2 text-sm text-wine">
              Only {limit} available in this size.
            </p>
          ) : null}

          {/* Quantity + remove */}
          <div className="mt-auto flex items-center justify-between gap-4 pt-5">
            <div
              role="group"
              aria-label={`Quantity for ${variantLabel}`}
              className="inline-flex h-10 items-center border border-warm-300"
            >
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                aria-label={`Decrease quantity of ${variantLabel}`}
                className="inline-flex size-10 items-center justify-center text-ink transition-colors duration-300 hover:text-wine disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:text-ink"
              >
                <Minus
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-4"
                />
              </button>

              <span
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="w-8 text-center text-base tabular-nums text-ink"
              >
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  updateQuantity(item.id, item.quantity + 1, limit)
                }
                disabled={atMax}
                aria-label={`Increase quantity of ${variantLabel}`}
                className="inline-flex size-10 items-center justify-center text-ink transition-colors duration-300 hover:text-wine disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:text-ink"
              >
                <Plus aria-hidden="true" strokeWidth={1.5} className="size-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${variantLabel} from your bag`}
              className="py-2 text-sm text-ink underline decoration-champagne decoration-1 underline-offset-4 transition-colors duration-300 hover:text-wine hover:decoration-wine"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </motion.li>
  );
}
