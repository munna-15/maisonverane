"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export interface CategoryItem {
  readonly id: string;
  readonly name: string;
  readonly href: string;
  readonly image: {
    readonly src: string;
    readonly alt: string;
    readonly objectPosition?: string;
  };
}

interface ShopByCategoryProps {
  categories?: readonly CategoryItem[];
}

export const CATEGORIES: readonly CategoryItem[] = [
  {
    id: "dresses",
    name: "Dresses",
    href: "/dresses",
    image: {
      src: "/images/categories/dresses.jpg",
      alt: "Elegant women's dress collection",
      objectPosition: "center 25%",
    },
  },
  {
    id: "tops",
    name: "Tops",
    href: "/tops",
    image: {
      src: "/images/categories/tops.jpg",
      alt: "Contemporary women's tops collection",
      objectPosition: "center 25%",
    },
  },
  {
    id: "co-ord-sets",
    name: "Co-ord Sets",
    href: "/collections/co-ord-sets",
    image: {
      src: "/images/categories/co-ord-sets.jpg",
      alt: "Matching women's co-ord sets",
      objectPosition: "center 25%",
    },
  },
  {
    id: "new-in",
    name: "New In",
    href: "/new-in",
    image: {
      src: "/images/categories/new-in.jpg",
      alt: "Latest women's fashion arrivals",
      objectPosition: "center 25%",
    },
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: EASE,
    },
  },
};

function CategoryCard({
  category,
  priority = false,
}: {
  category: CategoryItem;
  priority?: boolean;
}) {
  const { name, href, image } = category;

  return (
    <Link
      href={href}
      aria-label={`Explore ${name}`}
      className="group block text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-warm sm:rounded-lg lg:aspect-[5/6]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 23vw, 50vw"
          quality={90}
          priority={priority}
          className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045] motion-reduce:transition-none"
          style={{
            objectPosition: image.objectPosition ?? "center",
          }}
        />
      </div>

      <div className="mt-3 text-center sm:mt-4 lg:mt-5">
        <h3 className="font-serif text-lg leading-snug tracking-[-0.02em] text-ink transition-colors duration-500 group-hover:text-wine sm:text-xl lg:text-2xl">
          {name}
        </h3>
      </div>
    </Link>
  );
}

export function ShopByCategory({
  categories = CATEGORIES,
}: ShopByCategoryProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section
      aria-labelledby="shop-by-category-heading"
      className="pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14"
    >
      <div className="container-editorial">
        <motion.header
          className="mx-auto max-w-xl text-center"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.8,
                ease: EASE,
              },
            },
          }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="eyebrow">Explore the Collection</p>

          <h2
            id="shop-by-category-heading"
            className="mt-2.5 font-serif text-[clamp(2rem,3.5vw,3rem)] leading-[1.08] tracking-[-0.035em] text-ink"
          >
            Find Your{" "}
            <span className="font-normal italic text-wine">Style</span>
          </h2>
        </motion.header>

        <motion.ul
          role="list"
          className="mx-auto mt-8 grid max-w-7xl grid-cols-2 gap-x-3 gap-y-8 sm:mt-10 sm:gap-x-6 sm:gap-y-10 lg:mt-12 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12 xl:gap-x-8"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.1,
              },
            },
          }}
          viewport={{ once: true, amount: 0.08 }}
        >
          {categories.map((category, index) => (
            <motion.li
              key={category.id}
              variants={reduceMotion ? undefined : cardVariants}
            >
              <CategoryCard category={category} priority={index < 2} />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
