import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { CATALOG_CATEGORIES, CATALOG_PRODUCTS } from "@/lib/catalog/listing";

export default function ClothingPage() {
  return (
    <CatalogBrowser
      products={CATALOG_PRODUCTS}
      eyebrow="The Collection"
      title="Clothing"
      description="Thoughtfully considered pieces for a wardrobe that feels entirely your own."
      initialSort="featured"
      filterCategories={CATALOG_CATEGORIES}
    />
  );
}
