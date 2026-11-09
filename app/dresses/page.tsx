import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { DRESSES_PRODUCTS } from "@/lib/catalog/listing";

export default function DressesPage() {
  return (
    <CatalogBrowser
      products={DRESSES_PRODUCTS}
      eyebrow="The Dress Edit"
      title="Dresses"
      description="Effortless silhouettes, considered details and timeless pieces designed to make every moment feel special."
      initialSort="featured"
      gridClassName="grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-14"
    />
  );
}
