import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { NEW_IN_PRODUCTS } from "@/lib/catalog/listing";

export default function NewInPage() {
  return (
    <CatalogBrowser
      products={NEW_IN_PRODUCTS}
      eyebrow="Just Arrived"
      title="New In"
      description="Discover the latest additions to our collection. Considered silhouettes, thoughtful details and pieces made to be worn your way."
      initialSort="newest"
      gridClassName="grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-14"
    />
  );
}
