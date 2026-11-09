import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { CO_ORD_PRODUCTS } from "@/lib/catalog/listing";

export default function CoOrdSetsPage() {
  return (
    <CatalogBrowser
      products={CO_ORD_PRODUCTS}
      eyebrow="The Co-ord Edit"
      title="Co-ord Sets"
      description="Beautifully coordinated pieces, considered proportions and effortless pairings designed to make getting dressed feel instinctive."
      initialSort="featured"
      gridClassName="grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-14"
    />
  );
}
