"use client";

import { useEffect, useId, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

import { EMPTY_FILTERS, type FilterState } from "@/lib/catalog/filters";
import type { CatalogProduct, Category } from "@/lib/catalog/listing";
import { formatCatalogPrice } from "./CatalogProductCard";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface FilterDrawerProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  onClose: () => void;
  resultCount: number;
  priceInvalid: boolean;
  products: readonly CatalogProduct[];
  categories: readonly Category[];
}

function countLabel(count: number): string {
  return `${count} ${count === 1 ? "piece" : "pieces"}`;
}

export function FilterDrawer({
  filters,
  onChange,
  onClose,
  resultCount,
  priceInvalid,
  products,
  categories,
}: FilterDrawerProps) {
  const reduceMotion = useReducedMotion() ?? false;

  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const titleId = useId();
  const minId = useId();
  const maxId = useId();

  const selectedCategories = Array.isArray(filters.categories)
    ? filters.categories
    : [];

  const prices = products.map((product) => product.price);

  const catalogMin = prices.length ? Math.min(...prices) : 0;
  const catalogMax = prices.length ? Math.max(...prices) : 10000;

  const hasPriceInput = filters.minPrice !== "" || filters.maxPrice !== "";

  const hasAnyFilter =
    selectedCategories.length > 0 || hasPriceInput || filters.inStockOnly;

  useEffect(() => {
    const { body, documentElement } = document;

    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;

    const scrollbar = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = "hidden";

    if (scrollbar > 0) {
      body.style.paddingRight = `${scrollbar}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, []);

  useEffect(() => {
    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;

      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!panel.contains(active)) {
        event.preventDefault();
        first?.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function toggleCategory(category: Category) {
    const next = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];

    onChange({
      ...filters,
      categories: next,
    });
  }

  function setPrice(field: "minPrice" | "maxPrice", raw: string) {
    onChange({
      ...filters,
      [field]: raw.replace(/\D/g, "").slice(0, 6),
    });
  }

  function clearPrice() {
    onChange({
      ...filters,
      minPrice: "",
      maxPrice: "",
    });
  }

  function clearAll() {
    onChange(EMPTY_FILTERS);
  }

  const duration = reduceMotion ? 0 : 0.45;

  const sectionHeading =
    "text-xs font-medium uppercase tracking-[0.22em] text-wine";

  const inputClasses =
    "w-full border-0 border-b border-warm-300 bg-transparent py-2 pl-6 pr-1 text-base text-ink outline-none transition-colors duration-300 placeholder:text-ink-muted/60 focus:border-wine";

  return (
    <div className="fixed inset-0 z-[60]">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-ink/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.3 }}
        onClick={onClose}
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-warm"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration, ease: EASE }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 id={titleId} className="font-serif text-2xl font-medium">
            Filter
          </h2>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="-mr-3 inline-flex size-11 items-center justify-center text-ink transition-colors duration-300 hover:text-wine"
          >
            <X aria-hidden="true" strokeWidth={1.5} className="size-5" />
          </button>
        </div>

        {/* Filter content */}
        <div className="flex-1 space-y-10 overflow-y-auto overscroll-contain px-6 py-8">
          {/* Category */}
          <fieldset>
            <legend className={sectionHeading}>Category</legend>

            <ul className="mt-4 space-y-1">
              {categories.map((category) => {
                const id = `filter-category-${category
                  .replace(/\W+/g, "-")
                  .toLowerCase()}`;

                const total = products.filter(
                  (product) => product.category === category,
                ).length;

                return (
                  <li key={category}>
                    <label
                      htmlFor={id}
                      className="flex min-h-11 cursor-pointer items-center gap-3 text-[0.9375rem] text-ink"
                    >
                      <input
                        id={id}
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="size-4 accent-wine"
                      />

                      <span>{category}</span>

                      <span className="text-sm text-ink-muted">({total})</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>

          {/* Price */}
          <fieldset>
            <div className="flex items-baseline justify-between">
              <legend className={sectionHeading}>Price</legend>

              {hasPriceInput ? (
                <button
                  type="button"
                  onClick={clearPrice}
                  className="py-1 text-sm text-ink underline decoration-champagne underline-offset-4 transition-colors duration-300 hover:text-wine hover:decoration-wine"
                >
                  Clear price
                </button>
              ) : null}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-6">
              {(
                [
                  {
                    id: minId,
                    label: "Minimum",
                    field: "minPrice",
                    placeholder: catalogMin,
                  },
                  {
                    id: maxId,
                    label: "Maximum",
                    field: "maxPrice",
                    placeholder: catalogMax,
                  },
                ] as const
              ).map(({ id, label, field, placeholder }) => (
                <div key={id}>
                  <label htmlFor={id} className="text-sm text-ink-muted">
                    {label}
                  </label>

                  <div className="relative mt-1">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-base text-ink-muted"
                    >
                      ৳
                    </span>

                    <input
                      id={id}
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      value={filters[field]}
                      onChange={(event) => setPrice(field, event.target.value)}
                      placeholder={String(placeholder)}
                      aria-invalid={priceInvalid}
                      className={inputClasses}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p
              role={priceInvalid ? "alert" : undefined}
              className={`mt-3 text-sm ${
                priceInvalid ? "text-wine" : "text-ink-muted"
              }`}
            >
              {priceInvalid
                ? "The minimum price is higher than the maximum."
                : `Pieces range from ${formatCatalogPrice(
                    catalogMin,
                  )} to ${formatCatalogPrice(catalogMax)}.`}
            </p>
          </fieldset>

          {/* Availability */}
          <fieldset>
            <legend className={sectionHeading}>Availability</legend>

            <label
              htmlFor="filter-in-stock"
              className="mt-4 flex min-h-11 cursor-pointer items-center gap-3 text-[0.9375rem] text-ink"
            >
              <input
                id="filter-in-stock"
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(event) =>
                  onChange({
                    ...filters,
                    inStockOnly: event.target.checked,
                  })
                }
                className="size-4 accent-wine"
              />
              In Stock
            </label>
          </fieldset>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={clearAll}
            disabled={!hasAnyFilter}
            className="py-2 text-sm text-ink underline decoration-champagne underline-offset-4 transition-colors duration-300 hover:text-wine hover:decoration-wine disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline"
          >
            Clear all
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-burgundy px-6 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-warm transition-colors duration-300 hover:bg-wine focus-visible:bg-wine"
          >
            Show {countLabel(resultCount)}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
