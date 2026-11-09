"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog/listing";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const priceFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatCatalogPrice(value: number): string {
  return priceFormatter.format(value);
}

interface CatalogProductCardProps {
  product: CatalogProduct;
  isWished: boolean;
  onToggleWish: (id: string) => void;
  priority: boolean;
  reduceMotion: boolean;
}

export const CatalogProductCard = memo(function CatalogProductCard({
  product,
  isWished,
  onToggleWish,
  priority,
  reduceMotion,
}: CatalogProductCardProps) {
  const { id, name, price, href, image, isNew, inStock } = product;

  return (
    <motion.li
      className="group relative"
      initial={{
        opacity: reduceMotion ? 1 : 0,
        y: reduceMotion ? 0 : 12,
      }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.6,
        ease: EASE,
      }}
    >
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-3/4 overflow-hidden rounded-md bg-warm-200"
      >
        <Image
          src={image.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 24vw, (min-width: 768px) 31vw, 47vw"
          quality={85}
          priority={priority}
          className="object-cover motion-safe:transition-transform motion-safe:duration-[1400ms] motion-safe:ease-out motion-safe:group-hover:scale-105 motion-safe:group-focus-within:scale-105"
          style={{
            objectPosition: image.objectPosition ?? "center",
          }}
        />
      </Link>

      {isNew && inStock ? (
        <span className="pointer-events-none absolute left-2.5 top-2.5 bg-warm/90 px-2 py-1 text-[0.625rem] font-medium uppercase leading-none tracking-[0.2em] text-burgundy sm:left-3 sm:top-3">
          New
        </span>
      ) : null}

      <motion.button
        type="button"
        onClick={() => onToggleWish(id)}
        aria-pressed={isWished}
        aria-label={
          isWished ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`
        }
        whileTap={reduceMotion ? undefined : { scale: 0.88 }}
        className={`absolute right-1 top-1 inline-flex size-10 items-center justify-center transition-colors duration-300 sm:right-1.5 sm:top-1.5 ${
          isWished ? "text-wine" : "text-warm hover:text-wine"
        }`}
      >
        <span
          aria-hidden="true"
          className={`inline-flex size-8 items-center justify-center rounded-full transition-colors duration-300 ${
            isWished ? "bg-warm" : "bg-ink/20 group-hover:bg-warm/90"
          }`}
        >
          <Heart
            strokeWidth={1.5}
            className={`size-4 ${isWished ? "fill-current" : ""}`}
          />
        </span>
      </motion.button>

      <div className="mt-3.5 flex flex-col gap-0.5 sm:mt-4">
        <h3 className="font-serif text-lg font-medium leading-snug tracking-normal text-ink sm:text-xl">
          <Link
            href={href}
            className="transition-colors duration-500 hover:text-wine focus-visible:text-wine"
          >
            {name}
          </Link>
        </h3>

        <p className="text-sm tracking-[0.03em] text-ink-muted">
          {formatCatalogPrice(price)}

          {!inStock ? (
            <span className="ml-3 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-wine">
              Sold out
            </span>
          ) : null}
        </p>
      </div>
    </motion.li>
  );
});
