import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { TOPS_PRODUCTS } from "@/lib/catalog/listing";

export default function TopsPage() {
  return (
    <CatalogBrowser
      products={TOPS_PRODUCTS}
      eyebrow="The Top Edit"
      title="Tops"
      description="Thoughtfully designed essentials, refined silhouettes and versatile pieces made to bring effortless elegance to everyday dressing."
      initialSort="featured"
      gridClassName="grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-14"
    />
  );
}
