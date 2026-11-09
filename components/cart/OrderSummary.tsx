"use client";

import Link from "next/link";
import { useState } from "react";

import { formatPrice, pluralizeItems } from "@/lib/cart/format";

interface OrderSummaryProps {
  itemCount: number;
  subtotal: number;
}

export function OrderSummary({ itemCount, subtotal }: OrderSummaryProps) {
  const [noticeOpen, setNoticeOpen] = useState(false);

  return (
    <aside
      aria-labelledby="order-summary-heading"
      className="bg-warm-50 px-6 py-8 sm:px-8 sm:py-10 lg:sticky lg:top-[calc(var(--header-height)+2rem)]"
    >
      <p className="eyebrow">Summary</p>
      <h2
        id="order-summary-heading"
        className="mt-3 text-3xl font-light text-burgundy sm:text-4xl"
      >
        Order Summary
      </h2>

      <dl className="mt-8 space-y-4 text-[0.9375rem]">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-ink-muted">
            Subtotal
            <span className="ml-2 text-xs tracking-[0.04em]">
              ({pluralizeItems(itemCount)})
            </span>
          </dt>
          <dd className="tabular-nums text-ink">{formatPrice(subtotal)}</dd>
        </div>

        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-ink-muted">Shipping</dt>
          <dd className="text-right text-ink-muted">Calculated at checkout</dd>
        </div>

        <div className="flex items-baseline justify-between gap-4 border-t border-warm-300 pt-5">
          <dt className="font-serif text-xl text-ink">Total</dt>
          <dd className="font-serif text-2xl tabular-nums text-burgundy">
            {formatPrice(subtotal)}
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-xs leading-relaxed text-ink-muted">
        Delivery is confirmed at checkout once your address is added.
      </p>

      <button
        type="button"
        onClick={() => setNoticeOpen(true)}
        className="mt-8 flex h-14 w-full items-center justify-center bg-burgundy text-xs font-medium uppercase tracking-[0.2em] text-warm transition-colors duration-300 hover:bg-wine focus-visible:bg-wine"
      >
        Proceed to Checkout
      </button>

      {/* Placeholder: checkout and payment are not connected yet */}
      <div role="status" aria-live="polite">
        {noticeOpen ? (
          <p className="mt-4 text-sm leading-[1.7] text-wine">
            Checkout is not available yet. Your bag is saved and will be here
            when it opens.
          </p>
        ) : null}
      </div>

      <Link
        href="/clothing"
        className="mt-6 block text-center text-sm text-ink underline decoration-champagne decoration-1 underline-offset-4 transition-colors duration-300 hover:text-wine hover:decoration-wine"
      >
        Continue Shopping
      </Link>
    </aside>
  );
}
