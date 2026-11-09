import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductView } from "./ProductView";
import { PRODUCTS, PRODUCT_BY_SLUG } from "./products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

async function ProductPageContent({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = PRODUCT_BY_SLUG.get(slug);

  if (!product) {
    notFound();
  }

  return <ProductView product={product} />;
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F1E8DE]" />}>
      <ProductPageContent params={params} />
    </Suspense>
  );
}
