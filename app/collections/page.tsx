"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EDITORIAL_COLLECTIONS } from "@/lib/catalog/collections";

export default function CollectionsPage() {
  const reduceMotion = useReducedMotion();
  const shouldReduceMotion = reduceMotion ?? false;

  const featured = EDITORIAL_COLLECTIONS[0];
  const collections = EDITORIAL_COLLECTIONS.slice(1);

  const reveal: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 22,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <main className="min-h-screen bg-[#F1E8DE] text-[#292426]">
      {/* Introduction */}
      <section className="px-5 pb-12 pt-16 text-center sm:px-8 sm:pb-16 sm:pt-20 lg:pb-20 lg:pt-24 ">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={reveal}
          className="mx-auto max-w-3xl"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#713849]">
            Maison Vérane · Curated Stories
          </span>

          <h1 className="mt-5 font-[family-name:var(--font-cormorant)] text-[52px] font-normal leading-[0.95] tracking-[-0.035em] sm:text-7xl lg:text-[88px]">
            The Collections
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-[12px] leading-6 text-[#77706A] sm:text-sm sm:leading-7">
            A considered selection of stories, silhouettes and timeless pieces.
            Discover a collection that speaks to your own sense of style.
          </p>
        </motion.div>
      </section>

      {/* Featured Collection */}
      {featured && (
        <section className="px-4 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={reveal}
          >
            <Link
              href={`/collections/${featured.slug}`}
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/9] lg:aspect-[2.15/1]">
                <Image
                  src={featured.image}
                  alt={featured.imageAlt}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
                />

                <div className="absolute inset-0 bg-black/20 transition-colors duration-700 group-hover:bg-black/30" />

                <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-white">
                  <span className="text-[9px] uppercase tracking-[0.3em] sm:text-[10px]">
                    Featured Collection
                  </span>

                  <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-5xl font-normal leading-none sm:text-7xl lg:text-[90px]">
                    {featured.title}
                  </h2>

                  <p className="mt-4 text-[10px] uppercase tracking-[0.2em] sm:text-xs">
                    {featured.subtitle}
                  </p>

                  <span className="mt-8 border-b border-white/80 pb-2 text-[9px] uppercase tracking-[0.24em] sm:text-[10px]">
                    Explore Collection
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-6 text-[#77706A] sm:mt-7 sm:text-sm">
            {featured.description}
          </p>
        </section>
      )}

      {/* Collection Grid */}
      <section className="px-4 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28 lg:px-12 lg:pt-32">
        <div className="mx-auto mb-10 flex max-w-7xl items-end justify-between border-b border-[#292426]/15 pb-5 sm:mb-14">
          <div>
            <span className="text-[9px] uppercase tracking-[0.28em] text-[#713849] sm:text-[10px]">
              Discover More
            </span>

            <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-4xl font-normal sm:text-5xl">
              Explore the edits
            </h2>
          </div>

          <span className="hidden text-[10px] uppercase tracking-[0.18em] text-[#77706A] sm:block">
            {String(EDITORIAL_COLLECTIONS.length).padStart(2, "0")} Curated
            Stories
          </span>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:gap-x-12 lg:gap-y-20">
          {collections.map((collection, index) => (
            <motion.article
              key={collection.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
              variants={reveal}
              className={index % 2 === 1 ? "sm:mt-24" : ""}
            >
              <Link
                href={`/collections/${collection.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#E6DDD2]">
                  <Image
                    src={collection.image}
                    alt={collection.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 45vw"
                    className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
                  />
                </div>

                <div className="mt-5 flex items-start justify-between gap-4 sm:mt-7">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.22em] text-[#713849] sm:text-[10px]">
                      {collection.subtitle}
                    </span>

                    <h3 className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl font-normal sm:text-4xl">
                      {collection.title}
                    </h3>
                  </div>

                  <span className="mt-2 shrink-0 border-b border-[#292426]/50 pb-1 text-[9px] uppercase tracking-[0.17em] transition-colors group-hover:border-[#713849] group-hover:text-[#713849] sm:text-[10px]">
                    Explore
                  </span>
                </div>

                <p className="mt-3 max-w-md text-xs leading-6 text-[#77706A] sm:text-[13px]">
                  {collection.description}
                </p>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
