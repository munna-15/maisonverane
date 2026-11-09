import type { CatalogProduct, Category } from "./listing";

export type SortValue = "featured" | "newest" | "price-asc" | "price-desc";

export interface FilterState {
  readonly categories: readonly Category[];
  readonly minPrice: string;
  readonly maxPrice: string;
  readonly inStockOnly: boolean;
}

export interface PriceRange {
  readonly min: number | null;
  readonly max: number | null;
  readonly invalid: boolean;
  readonly active: boolean;
}

export const EMPTY_FILTERS: FilterState = {
  categories: [],
  minPrice: "",
  maxPrice: "",
  inStockOnly: false,
};

export function getPriceRange(filters: FilterState): PriceRange {
  const min = filters.minPrice.trim() === "" ? null : Number(filters.minPrice);

  const max = filters.maxPrice.trim() === "" ? null : Number(filters.maxPrice);

  const invalid =
    (min !== null && (!Number.isFinite(min) || min < 0)) ||
    (max !== null && (!Number.isFinite(max) || max < 0)) ||
    (min !== null && max !== null && min > max);

  return {
    min,
    max,
    invalid,
    active: !invalid && (min !== null || max !== null),
  };
}

export function applyFiltersAndSort(
  products: readonly CatalogProduct[],
  filters: FilterState,
  price: PriceRange,
  sort: SortValue,
): CatalogProduct[] {
  if (!Array.isArray(products)) {
    console.error("[Catalog] Expected products to be an array.", products);

    return [];
  }

  const selectedCategories = Array.isArray(filters.categories)
    ? filters.categories
    : [];

  const filtered = products.filter((product) => {
    if (!product) return false;

    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(product.category)
    ) {
      return false;
    }

    if (filters.inStockOnly && !product.inStock) {
      return false;
    }

    if (price.active) {
      if (price.min !== null && product.price < price.min) {
        return false;
      }

      if (price.max !== null && product.price > price.max) {
        return false;
      }
    }

    return true;
  });

  const originalOrder = new Map(
    products.map((product, index) => [product.id, index]),
  );

  return filtered.sort((a, b) => {
    const fallback =
      (originalOrder.get(a.id) ?? 0) - (originalOrder.get(b.id) ?? 0);

    switch (sort) {
      case "newest":
        return b.releasedAt.localeCompare(a.releasedAt) || fallback;

      case "price-asc":
        return a.price - b.price || fallback;

      case "price-desc":
        return b.price - a.price || fallback;

      case "featured":
      default:
        return fallback;
    }
  });
}
