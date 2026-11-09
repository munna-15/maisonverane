"use client";

import { AnimatePresence, useReducedMotion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

import {
  EMPTY_FILTERS,
  applyFiltersAndSort,
  getPriceRange,
  type FilterState,
  type SortValue,
} from "@/lib/catalog/filters";

import {
  getAvailableCategories,
  type CatalogProduct,
  type Category,
} from "@/lib/catalog/listing";

import { CatalogProductCard } from "./CatalogProductCard";
import { FilterDrawer } from "./FilterDrawer";
import { SortMenu } from "./SortMenu";

interface CatalogBrowserProps {
  products: readonly CatalogProduct[];
  eyebrow: string;
  title: string;
  description: string;
  initialSort?: SortValue;
  gridClassName?: string;
  filterCategories?: readonly Category[];
}

interface ActiveChip {
  readonly key: string;
  readonly label: string;
  readonly onRemove: () => void;
}

function countLabel(count: number): string {
  return `${count} ${count === 1 ? "piece" : "pieces"}`;
}

const priceFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function CatalogBrowser({
  products,
  eyebrow,
  title,
  description,
  initialSort = "featured",
  gridClassName = "grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14",
  filterCategories,
}: CatalogBrowserProps) {
  const reduceMotion = useReducedMotion() ?? false;

  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortValue>(initialSort);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [wishlist, setWishlist] = useState<ReadonlySet<string>>(
    () => new Set(),
  );

  const filterButtonRef = useRef<HTMLButtonElement>(null);

  // Validate catalogue data before using it.
  const validProducts: readonly CatalogProduct[] = useMemo(() => {
    if (!Array.isArray(products)) {
      console.error("[CatalogBrowser] Invalid products prop:", {
        title,
        products,
        productsType: typeof products,
      });

      return [];
    }

    return products.filter(
      (product): product is CatalogProduct =>
        product !== null &&
        typeof product === "object" &&
        typeof product.id === "string" &&
        typeof product.price === "number" &&
        typeof product.category === "string",
    );
  }, [products, title]);

  const selectedCategories = Array.isArray(filters.categories)
    ? filters.categories
    : [];

  const price = useMemo(() => getPriceRange(filters), [filters]);

  const visibleProducts = useMemo(
    () => applyFiltersAndSort(validProducts, filters, price, sort),
    [validProducts, filters, price, sort],
  );

  const categories = useMemo(
    () => filterCategories ?? getAvailableCategories(validProducts),
    [filterCategories, validProducts],
  );

  const chips = useMemo<ActiveChip[]>(() => {
    const list: ActiveChip[] = selectedCategories.map((category) => ({
      key: `category-${category}`,
      label: category,
      onRemove: () =>
        setFilters((current) => ({
          ...current,
          categories: current.categories.filter((item) => item !== category),
        })),
    }));

    if (price.active) {
      const label =
        price.min !== null && price.max !== null
          ? `${formatPrice(price.min)} – ${formatPrice(price.max)}`
          : price.min !== null
            ? `From ${formatPrice(price.min)}`
            : `Up to ${formatPrice(price.max ?? 0)}`;

      list.push({
        key: "price",
        label,
        onRemove: () =>
          setFilters((current) => ({
            ...current,
            minPrice: "",
            maxPrice: "",
          })),
      });
    }

    if (filters.inStockOnly) {
      list.push({
        key: "in-stock",
        label: "In Stock",
        onRemove: () =>
          setFilters((current) => ({
            ...current,
            inStockOnly: false,
          })),
      });
    }

    return list;
  }, [selectedCategories, price, filters.inStockOnly]);

  const activeCount = chips.length;

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    filterButtonRef.current?.focus();
  }, []);

  const clearAll = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, []);

  const toggleWish = useCallback((id: string) => {
    setWishlist((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const resultText =
    activeCount > 0
      ? `Showing ${visibleProducts.length} of ${countLabel(validProducts.length)}`
      : countLabel(visibleProducts.length);

  return (
    <>
      {/* Introduction */}
      <section
        aria-labelledby="catalog-heading"
        className="container-editorial pb-8 pt-12 sm:pt-16 lg:pb-10 lg:pt-20"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <p className="eyebrow">{eyebrow}</p>

            <h1 id="catalog-heading" className="mt-4 font-light text-burgundy">
              {title}
            </h1>
          </div>

          <div className="lg:max-w-md lg:pb-2">
            <p className="text-base leading-[1.75] text-ink-muted sm:text-[1.0625rem]">
              {description}
            </p>

            <p className="mt-3 text-xs font-medium uppercase tracking-[0.22em] text-wine">
              {countLabel(validProducts.length)}
            </p>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section aria-label="Sort and filter" className="container-editorial">
        <div className="flex items-center justify-between gap-4 border-y border-border py-1.5">
          <p
            role="status"
            aria-live="polite"
            className="text-sm tracking-[0.03em] text-ink-muted"
          >
            {resultText}
          </p>

          <div className="flex items-center gap-5 sm:gap-8">
            <SortMenu value={sort} onChange={setSort} />

            <button
              ref={filterButtonRef}
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={drawerOpen}
              className="inline-flex h-11 items-center gap-2 text-sm font-medium tracking-[0.03em] text-ink transition-colors duration-300 hover:text-wine"
            >
              <SlidersHorizontal
                aria-hidden="true"
                strokeWidth={1.5}
                className="size-4"
              />
              Filter
              {activeCount > 0 ? (
                <span className="text-wine">({activeCount})</span>
              ) : null}
            </button>
          </div>
        </div>

        {/* Active filters */}
        {activeCount > 0 ? (
          <ul
            aria-label="Active filters"
            className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-4"
          >
            {chips.map((chip) => (
              <li key={chip.key}>
                <button
                  type="button"
                  onClick={chip.onRemove}
                  aria-label={`Remove filter: ${chip.label}`}
                  className="inline-flex items-center gap-2 border border-warm-300 px-3 py-1.5 text-sm text-ink transition-colors duration-300 hover:border-wine hover:text-wine"
                >
                  {chip.label}

                  <X
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-3.5"
                  />
                </button>
              </li>
            ))}

            <li>
              <button
                type="button"
                onClick={clearAll}
                className="py-1.5 pl-1 text-sm text-ink underline decoration-champagne underline-offset-4 transition-colors duration-300 hover:text-wine hover:decoration-wine"
              >
                Clear all
              </button>
            </li>
          </ul>
        ) : null}
      </section>

      {/* Product grid / empty state */}
      <section
        aria-label="Products"
        className="container-editorial pb-20 pt-8 sm:pb-24 sm:pt-10 lg:pb-28"
      >
        {visibleProducts.length > 0 ? (
          <ul role="list" className={`grid ${gridClassName}`}>
            {visibleProducts.map((product, index) => (
              <CatalogProductCard
                key={product.id}
                product={product}
                isWished={wishlist.has(product.id)}
                onToggleWish={toggleWish}
                priority={index < 4}
                reduceMotion={reduceMotion}
              />
            ))}
          </ul>
        ) : (
          <div className="mx-auto flex max-w-md flex-col items-center px-2 py-16 text-center sm:py-24">
            <h2 className="text-[clamp(2rem,1.5rem+2vw,3rem)] font-light text-burgundy">
              No pieces <em className="font-normal italic text-wine">found.</em>
            </h2>

            <p className="mt-5 text-base leading-[1.75] text-ink-muted">
              Nothing matches this combination of filters. Try widening the
              price range or removing a category to see more of the collection.
            </p>

            <button
              type="button"
              onClick={clearAll}
              className="mt-8 border-b border-ink pb-1.5 text-xs font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:border-wine hover:text-wine"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* Filter drawer */}
      <AnimatePresence>
        {drawerOpen ? (
          <FilterDrawer
            key="filter-drawer"
            filters={filters}
            onChange={setFilters}
            onClose={closeDrawer}
            resultCount={visibleProducts.length}
            priceInvalid={price.invalid}
            products={validProducts}
            categories={categories}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
