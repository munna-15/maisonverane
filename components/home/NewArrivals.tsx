"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly href: string;
  readonly isNew?: boolean;
  readonly image: {
    readonly src: string;
    readonly alt: string;
    readonly objectPosition?: string;
  };
}

interface NewArrivalsProps {
  products?: readonly Product[];
}

export const PRODUCTS: readonly Product[] = [
  {
    id: "satin-slip-dress",
    name: "Satin Slip Dress",
    price: 2450,
    href: "/products/satin-slip-dress",
    isNew: true,
    image: {
      src: "/images/products/product-01.avif",
      alt: "Model wearing an elegant satin slip dress",
      objectPosition: "50% 20%",
    },
  },
  {
    id: "tailored-wool-blazer",
    name: "Tailored Wool Blazer",
    price: 3200,
    href: "/products/tailored-wool-blazer",
    isNew: true,
    image: {
      src: "/images/products/product-07.avif",
      alt: "Model wearing a tailored wool blazer",
      objectPosition: "50% 20%",
    },
  },
  {
    id: "fine-knit-cardigan",
    name: "Fine Knit Cardigan",
    price: 1850,
    href: "/products/fine-knit-cardigan",
    isNew: true,
    image: {
      src: "/images/products/product-03.avif",
      alt: "Model wearing a fine-knit cardigan",
      objectPosition: "50% 20%",
    },
  },
  {
    id: "pleated-midi-skirt",
    name: "Pleated Midi Skirt",
    price: 1650,
    href: "/products/pleated-midi-skirt",
    isNew: true,
    image: {
      src: "/images/products/product-04.avif",
      alt: "Model wearing a flowing pleated midi skirt",
      objectPosition: "50% 20%",
    },
  },
  {
    id: "linen-blend-shirt",
    name: "Linen Blend Shirt",
    price: 1950,
    href: "/products/linen-blend-shirt",
    isNew: true,
    image: {
      src: "/images/products/product-05.avif",
      alt: "Model wearing a relaxed linen blend shirt",
      objectPosition: "50% 20%",
    },
  },
  {
    id: "classic-midi-dress",
    name: "Classic Midi Dress",
    price: 2850,
    href: "/products/classic-midi-dress",
    image: {
      src: "/images/products/product-06.avif",
      alt: "Model wearing a classic midi dress",
      objectPosition: "50% 20%",
    },
  },
  {
    id: "everyday-knit-top",
    name: "Everyday Knit Top",
    price: 1450,
    href: "/products/everyday-knit-top",
    image: {
      src: "/images/products/product-02.avif",
      alt: "Model wearing a minimal everyday knit top",
      objectPosition: "50% 20%",
    },
  },
  {
    id: "relaxed-wide-trousers",
    name: "Relaxed Wide Trousers",
    price: 2250,
    href: "/products/relaxed-wide-trousers",
    image: {
      src: "/images/products/product-08.avif",
      alt: "Model wearing relaxed wide-leg trousers",
      objectPosition: "50% 20%",
    },
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const priceFormatter = new Intl.NumberFormat("en-BD", {
  maximumFractionDigits: 0,
});

function formatPrice(value: number): string {
  return `৳ ${priceFormatter.format(value)}`;
}

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE },
  },
};

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

function ProductCard({ product, priority = false }: ProductCardProps) {
  const { name, price, href, image, isNew } = product;

  return (
    <Link
      href={href}
      aria-label={`${name}, ${formatPrice(price)}`}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-warm">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 24vw, 50vw"
          quality={85}
          priority={priority}
          className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045] motion-reduce:transition-none"
          style={{
            objectPosition: image.objectPosition ?? "center",
          }}
        />

        {isNew && (
          <span className="absolute left-2 top-2 bg-warm/90 px-2 py-1 text-[0.55rem] font-medium uppercase tracking-[0.15em] text-burgundy sm:left-3 sm:top-3 sm:text-[0.6rem]">
            New
          </span>
        )}
      </div>

      <div className="mt-2.5 flex flex-col gap-1 sm:mt-3">
        <h3 className="font-serif text-base leading-snug tracking-[-0.01em] text-ink transition-colors duration-500 group-hover:text-wine sm:text-lg lg:text-xl">
          {name}
        </h3>

        <p className="text-xs font-medium tracking-[0.02em] text-ink-muted sm:text-sm">
          {formatPrice(price)}
        </p>
      </div>
    </Link>
  );
}

export function NewArrivals({ products = PRODUCTS }: NewArrivalsProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const visibleProducts = products.slice(0, 8);

  return (
    <section
      aria-labelledby="new-arrivals-heading"
      className="pb-14 pt-8 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-12"
    >
      <div className="container-editorial">
        <motion.header
          className="mx-auto max-w-xl text-center"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          variants={headerVariants}
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="eyebrow">Just Arrived</p>

          <h2
            id="new-arrivals-heading"
            className="mt-2.5 font-serif text-[clamp(2rem,3.5vw,3rem)] leading-[1.08] tracking-[-0.035em] text-ink"
          >
            New <span className="font-normal italic text-wine">Arrivals</span>
          </h2>

          <p className="mx-auto mt-2.5 max-w-sm text-xs leading-6 text-ink-muted sm:text-sm">
            Discover the latest pieces, thoughtfully selected for the season.
          </p>
        </motion.header>

        <motion.ul
          role="list"
          className="mt-7 grid grid-cols-2 gap-x-3 gap-y-7 sm:mt-9 sm:gap-x-5 sm:gap-y-9 lg:mt-11 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          variants={gridVariants}
          viewport={{ once: true, amount: 0.06 }}
        >
          {visibleProducts.map((product, index) => (
            <motion.li
              key={product.id}
              variants={reduceMotion ? undefined : cardVariants}
            >
              <ProductCard product={product} priority={index < 4} />
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-9 text-center sm:mt-11">
          <Link
            href="/new-in"
            className="inline-block border-b border-champagne pb-1 text-[0.65rem] font-medium uppercase tracking-[0.15em] text-burgundy transition-colors duration-300 hover:border-wine hover:text-wine focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
