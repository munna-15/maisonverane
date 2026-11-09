"use client";

import { AnimatePresence } from "framer-motion";

import { pluralizeItems } from "@/lib/cart/format";

import { CartItemRow } from "./CartItemRow";
import { useCart } from "./CartProvider";
import { EmptyCart } from "./EmptyCart";
import { OrderSummary } from "./OrderSummary";

export function CartView() {
  const { items, itemCount, subtotal, isReady } = useCart();

  /* Until localStorage has been read, reserve the space instead of flashing
     the empty state. Server render and first client render both land here,
     so there is no hydration mismatch. */
  if (!isReady) {
    return (
      <div className="container-editorial">
        <div role="status" className="min-h-[60dvh] py-16">
          <span className="sr-only">Loading your bag</span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container-editorial pb-20 pt-10 sm:pt-14 lg:pb-28">
      <header>
        <h1 className="text-[clamp(2.25rem,1.6rem+2.4vw,3.5rem)] font-light leading-[1.05] text-burgundy">
          Your Bag
        </h1>
        <p
          aria-live="polite"
          className="mt-3 text-xs uppercase tracking-[0.18em] text-ink-muted"
        >
          {pluralizeItems(itemCount)}
        </p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:mt-14 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-20 xl:gap-24">
        <section aria-label="Items in your bag" className="min-w-0">
          <ul className="border-t border-border">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </ul>
        </section>

        <div className="min-w-0">
          <OrderSummary itemCount={itemCount} subtotal={subtotal} />
        </div>
      </div>
    </div>
  );
}
