import {
  PRODUCTS,
  SIZES,
  type Category,
  type Product,
  type ProductImage,
} from "@/app/products/[slug]/products";

export type { Category };

export interface CatalogProduct {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly price: number;
  readonly category: Category;
  readonly href: string;
  readonly inStock: boolean;
  readonly isNew: boolean;
  readonly releasedAt: string;
  readonly image: ProductImage;
}

interface MerchandisingInfo {
  readonly releasedAt: string;
  readonly isNew?: boolean;
}

const MERCHANDISING: Readonly<Record<string, MerchandisingInfo>> = {
  "satin-slip-dress": {
    releasedAt: "2026-10-28",
    isNew: true,
  },
  "tailored-wool-blazer": {
    releasedAt: "2026-10-22",
    isNew: true,
  },
  "fine-knit-cardigan": {
    releasedAt: "2026-09-30",
  },
  "pleated-midi-skirt": {
    releasedAt: "2026-09-12",
  },
  "linen-blend-shirt": {
    releasedAt: "2026-08-18",
  },
  "classic-midi-dress": {
    releasedAt: "2026-11-02",
    isNew: true,
  },
  "everyday-knit-top": {
    releasedAt: "2026-08-02",
  },
  "relaxed-wide-trousers": {
    releasedAt: "2026-07-20",
  },

  // Co-ord Sets
  "linen-co-ord-set": {
    releasedAt: "2026-11-10",
    isNew: true,
  },
  "tailored-co-ord-set": {
    releasedAt: "2026-11-10",
    isNew: true,
  },
  "satin-co-ord-set": {
    releasedAt: "2026-11-10",
    isNew: true,
  },
  "knit-co-ord-set": {
    releasedAt: "2026-11-10",
    isNew: true,
  },
};

function hasAvailableStock(product: Product): boolean {
  return product.colors.some((color) =>
    SIZES.some((size) => (color.stock[size] ?? 0) > 0),
  );
}

function toCatalogProduct(product: Product): CatalogProduct | null {
  const image = product.images[0];

  if (!image) {
    return null;
  }

  const merchandising = MERCHANDISING[product.slug];

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    category: product.category,
    href: `/products/${product.slug}`,
    inStock: hasAvailableStock(product),
    isNew: merchandising?.isNew ?? false,
    releasedAt: merchandising?.releasedAt ?? "",
    image,
  };
}

export const CATALOG_PRODUCTS: readonly CatalogProduct[] = PRODUCTS.map(
  toCatalogProduct,
).filter((product): product is CatalogProduct => product !== null);

export const NEW_IN_PRODUCTS: readonly CatalogProduct[] =
  CATALOG_PRODUCTS.filter((product) => product.isNew).sort(
    (a, b) =>
      new Date(b.releasedAt).getTime() - new Date(a.releasedAt).getTime(),
  );

export const DRESSES_PRODUCTS: readonly CatalogProduct[] =
  CATALOG_PRODUCTS.filter((product) => product.category === "Dresses");

export const TOPS_PRODUCTS: readonly CatalogProduct[] = CATALOG_PRODUCTS.filter(
  (product) => product.category === "Tops",
);

export const CO_ORD_PRODUCTS: readonly CatalogProduct[] =
  CATALOG_PRODUCTS.filter((product) => product.category === "Co-ord Sets");

export const CATALOG_CATEGORIES: readonly Category[] = [
  "Dresses",
  "Tops",
  "Co-ord Sets",
  "Bottoms",
];

export function getAvailableCategories(
  products: readonly CatalogProduct[],
): Category[] {
  return CATALOG_CATEGORIES.filter((category) =>
    products.some((product) => product.category === category),
  );
}
