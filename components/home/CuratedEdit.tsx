"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */
export interface CuratedProduct {
  readonly id: string;
  readonly name: string;
  /** Price in whole BDT (formatted by `formatPrice`) */
  readonly price: number;
  readonly href: string;
  readonly image: {
    /** Path inside /public (or a remote URL allowed in next.config) */
    readonly src: string;
    readonly alt: string;
    /** CSS object-position, e.g. "50% 20%": keeps the subject in frame */
    readonly objectPosition?: string;
  };
}

export interface CuratedEditContent {
  readonly eyebrow: string;
  /** Heading lead line, followed by an italic accent line */
  readonly headingLead: string;
  readonly headingAccent: string;
  readonly description: string;
  /** Small label on the photograph */
  readonly imageLabel: string;
  readonly image: {
    /** Path inside /public */
    readonly src: string;
    readonly alt: string;
    /** CSS object-position: keeps the subject in frame */
    readonly objectPosition?: string;
  };
}

interface CuratedEditProps {
  content?: CuratedEditContent;
  /** Exactly four products are designed for; more or fewer will still render */
  products?: readonly CuratedProduct[];
}

/* --------------------------------------------------------------------------
   Content: replace copy and the main photograph here
   -------------------------------------------------------------------------- */
const CURATED_CONTENT: CuratedEditContent = {
  eyebrow: "The Curated Edit",
  headingLead: "A Look,",
  headingAccent: "Thoughtfully Curated",
  description:
    "Discover the pieces that come together to create a look of effortless elegance.",
  imageLabel: "Look 01",
  image: {
    src: "/images/editorial/curated-look.avif",
    alt: "Model wearing a complete coordinated outfit: a satin midi dress layered with a soft tailored blazer, carrying a shoulder bag",
    objectPosition: "50% 20%",
  },
};

/* --------------------------------------------------------------------------
   Product data: placeholder demo products, replace names, prices, links
   and images here
   -------------------------------------------------------------------------- */
export const CURATED_PRODUCTS: readonly CuratedProduct[] = [
  {
    id: "satin-midi-dress",
    name: "The Satin Midi Dress",
    price: 2850,
    href: "/products/satin-midi-dress",
    image: {
      src: "/images/products/product-09.avif",
      alt: "The Satin Midi Dress in a fluid satin finish",
      objectPosition: "50% 20%",
    },
  },
  {
    id: "soft-tailored-blazer",
    name: "The Soft Tailored Blazer",
    price: 3450,
    href: "/products/soft-tailored-blazer",
    image: {
      src: "/images/products/product-10.avif",
      alt: "The Soft Tailored Blazer with a relaxed, structured shoulder",
      objectPosition: "50% 20%",
    },
  },
  {
    id: "everyday-shoulder-bag",
    name: "The Everyday Shoulder Bag",
    price: 1950,
    href: "/products/everyday-shoulder-bag",
    image: {
      src: "/images/products/product-11.avif",
      alt: "The Everyday Shoulder Bag in a refined, minimal shape",
      objectPosition: "50% 50%",
    },
  },
  {
    id: "minimal-gold-earrings",
    name: "The Minimal Gold Earrings",
    price: 850,
    href: "/products/minimal-gold-earrings",
    image: {
      src: "/images/products/product-12.avif",
      alt: "The Minimal Gold Earrings, a pair of slim modern drops",
      objectPosition: "50% 50%",
    },
  },
];

/* --------------------------------------------------------------------------
   Constants & helpers
   -------------------------------------------------------------------------- */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Fixed locale avoids server/client hydration mismatches */
const priceFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

/* --------------------------------------------------------------------------
   Product item
   -------------------------------------------------------------------------- */
interface ProductItemProps {
  product: CuratedProduct;
}

function ProductItem({ product }: ProductItemProps) {
  const { name, price, href, image } = product;

  return (
    <Link href={href} className="group block focus-visible:outline-offset-4">
      <div className="relative aspect-4/5 overflow-hidden rounded-md bg-warm-200">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 22vw, (min-width: 640px) 42vw, 46vw"
          quality={85}
          className="object-cover motion-safe:transition-transform motion-safe:duration-1400 motion-safe:ease-out motion-safe:group-hover:scale-105 motion-safe:group-focus-visible:scale-105"
          style={{ objectPosition: image.objectPosition ?? "center" }}
        />
      </div>

      <div className="mt-3 flex flex-col gap-0.5 sm:mt-4">
        <h3 className="font-serif text-base font-medium leading-snug tracking-normal text-ink transition-colors duration-500 group-hover:text-wine group-focus-visible:text-wine sm:text-lg">
          {name}
        </h3>
        <p className="text-sm tracking-[0.03em] text-ink-muted">
          {formatPrice(price)}
        </p>
      </div>
    </Link>
  );
}

/* --------------------------------------------------------------------------
   Section
   -------------------------------------------------------------------------- */
export function CuratedEdit({
  content = CURATED_CONTENT,
  products = CURATED_PRODUCTS,
}: CuratedEditProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const {
    eyebrow,
    headingLead,
    headingAccent,
    description,
    imageLabel,
    image,
  } = content;

  const imageVariants: Variants = {
    hidden: { opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 1.04 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: reduceMotion ? 0 : 1.2, ease: EASE },
    },
  };

  const headerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: reduceMotion ? 0 : 0.1,
        staggerChildren: reduceMotion ? 0 : 0.12,
      },
    },
  };

  const headerItemVariants: Variants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.9, ease: EASE },
    },
  };

  const listVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.1 },
    },
  };

  const productVariants: Variants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 26 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.9, ease: EASE },
    },
  };

  return (
    <section
      aria-labelledby="curated-edit-heading"
      className="py-16 sm:py-20 lg:py-24"
    >
      <div className="container-editorial">
        <div className="grid grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-[53fr_47fr] lg:items-stretch lg:gap-14 xl:gap-20">
          {/* Editorial photograph: stretches to the height of the shopping column */}
          <motion.div
            className="lg:h-full"
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="group relative aspect-4/5 overflow-hidden rounded-lg bg-warm-200 sm:aspect-square lg:aspect-auto lg:h-full lg:min-h-[40rem]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 53vw, 100vw"
                quality={90}
                className="object-cover motion-safe:transition-transform motion-safe:duration-1600 motion-safe:ease-out lg:motion-safe:group-hover:scale-[1.03]"
                style={{ objectPosition: image.objectPosition ?? "center" }}
              />

              <span className="absolute bottom-3 left-3 bg-warm/90 px-2.5 py-1.5 text-[0.625rem] font-medium uppercase leading-none tracking-[0.2em] text-burgundy sm:bottom-4 sm:left-4">
                {imageLabel}
              </span>
            </div>
          </motion.div>

          {/* Shopping column */}
          <div className="flex flex-col justify-center">
            <motion.header
              variants={headerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.p
                variants={headerItemVariants}
                className="eyebrow flex items-center gap-4"
              >
                <span aria-hidden="true" className="h-px w-8 bg-champagne" />
                {eyebrow}
              </motion.p>

              <motion.h2
                id="curated-edit-heading"
                variants={headerItemVariants}
                className="mt-5 text-[clamp(2.25rem,1.6rem+2.6vw,3.5rem)] font-light leading-[1.04] tracking-[-0.02em] text-burgundy"
              >
                <span className="block">{headingLead}</span>
                <span className="block font-normal italic text-wine">
                  {headingAccent}
                </span>
              </motion.h2>

              <motion.p
                variants={headerItemVariants}
                className="mt-5 max-w-sm text-base leading-[1.75] text-ink-muted"
              >
                {description}
              </motion.p>
            </motion.header>

            {/* Products: always two columns */}
            <motion.ul
              role="list"
              className="mt-9 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-10 sm:gap-x-5 sm:gap-y-9 lg:mt-12"
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {products.map((product) => (
                <motion.li key={product.id} variants={productVariants}>
                  <ProductItem product={product} />
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
}
