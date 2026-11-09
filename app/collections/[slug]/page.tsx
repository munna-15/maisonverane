import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EDITORIAL_COLLECTIONS } from "@/lib/catalog/collections";
import { PRODUCTS } from "@/app/products/[slug]/products";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return EDITORIAL_COLLECTIONS.map((collection) => ({
    slug: collection.slug,
  }));
}

async function CollectionDetailContent({ params }: CollectionPageProps) {
  const { slug } = await params;

  const collection = EDITORIAL_COLLECTIONS.find((item) => item.slug === slug);

  if (!collection) {
    notFound();
  }

  const collectionProducts = collection.productSlugs
    .map((productSlug) =>
      PRODUCTS.find((product) => product.slug === productSlug),
    )
    .filter((product) => product !== undefined);

  return (
    <main className="min-h-screen bg-[#F1E8DE] text-[#292426]">
      <section className="px-4 pt-6 sm:px-8 lg:px-12">
        <Link
          href="/collections"
          className="inline-flex items-center text-xs uppercase tracking-[0.18em] text-[#713849] transition-colors hover:text-[#421C2A]"
        >
          ← All Collections
        </Link>

        {/* Collection Hero */}
        <div className="relative mt-6 aspect-[4/5] overflow-hidden bg-[#E8DED3] sm:aspect-[16/8] lg:aspect-[2/1] xl:aspect-[2.15/1]">
          <Image
            src={collection.image}
            alt={collection.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_50%] sm:object-[center_35%] lg:object-[center_24%] xl:object-[center_22%]"
          />

          <div className="absolute inset-0 bg-black/25" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-[#F1E8DE]">
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] sm:text-xs">
              {collection.subtitle}
            </p>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl">
              {collection.title}
            </h1>
          </div>
        </div>

        <p className="mx-auto max-w-2xl py-10 text-center font-serif text-xl leading-relaxed text-[#713849] sm:text-2xl">
          {collection.description}
        </p>
      </section>

      {/* Collection Products */}
      <section className="px-4 pb-20 sm:px-8 lg:px-12">
        <div className="mb-8 flex items-end justify-between border-b border-[#C5A88A]/50 pb-5">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#713849]">
              Curated for you
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl">The Pieces</h2>
          </div>

          <span className="text-xs text-[#713849]">
            {collectionProducts.length} Pieces
          </span>
        </div>

        {collectionProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
            {collectionProducts.map((product) => {
              const image = product.images[0];

              if (!image) return null;

              const inStock = product.colors.some((color) =>
                Object.values(color.stock).some(
                  (quantity) => (quantity ?? 0) > 0,
                ),
              );

              return (
                <Link
                  key={product.slug}
                  href={`/products/${product.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#E8DED3]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-[center_35%] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.045]"
                    />

                    {!inStock && (
                      <span className="absolute bottom-3 left-3 bg-[#F1E8DE] px-3 py-1.5 text-[9px] uppercase tracking-[0.16em]">
                        Sold Out
                      </span>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-2 pt-3">
                    <h3 className="font-serif text-base sm:text-lg">
                      {product.name}
                    </h3>

                    <span className="shrink-0 text-xs text-[#713849]">
                      ৳{product.price.toLocaleString("en-BD")}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="py-16 text-center font-serif text-xl text-[#713849]">
            Pieces from this collection will be available soon.
          </p>
        )}
      </section>
    </main>
  );
}

export default function CollectionDetailPage({ params }: CollectionPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F1E8DE]" />}>
      <CollectionDetailContent params={params} />
    </Suspense>
  );
}
