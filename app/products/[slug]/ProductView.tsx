"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Star,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

import {
  PRODUCTS,
  SIZES,
  type ColorVariant,
  type Product,
  type ProductImage,
  type Review,
  type Size,
} from "./products";

import { useCart } from "@/components/cart/CartProvider";

const SIZE_CHART: readonly {
  size: Size;
  bust: string;
  waist: string;
  hip: string;
}[] = [
  { size: "XS", bust: "80 – 84", waist: "62 – 66", hip: "88 – 92" },
  { size: "S", bust: "84 – 88", waist: "66 – 70", hip: "92 – 96" },
  { size: "M", bust: "88 – 92", waist: "70 – 74", hip: "96 – 100" },
  { size: "L", bust: "92 – 96", waist: "74 – 78", hip: "100 – 104" },
  { size: "XL", bust: "96 – 102", waist: "78 – 84", hip: "104 – 110" },
];

/* Sample policy copy: replace with your real policies */
const SHIPPING_INFO: readonly string[] = [
  "Delivery inside Dhaka takes 1–2 working days; elsewhere in Bangladesh, 3–5 working days.",
  "Cash on delivery is available on all orders.",
  "Unworn pieces with tags attached can be returned or exchanged within 7 days of delivery.",
  "To start a return, contact us with your order number.",
];

/* ==========================================================================
   Constants & helpers
   ========================================================================== */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const MAX_QTY = 10;
const LOW_STOCK = 3;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* Fixed locales avoid server/client hydration mismatches */
const priceFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

function stockOf(color: ColorVariant, size: Size): number {
  return color.stock[size] ?? 0;
}

function sizesOf(color: ColorVariant): Size[] {
  return SIZES.filter((size) => size in color.stock);
}

function totalStock(color: ColorVariant): number {
  return SIZES.reduce((sum, size) => sum + stockOf(color, size), 0);
}

function getReviewStats(reviews: readonly Review[]) {
  const count = reviews.length;

  const average =
    count > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / count
      : 0;

  const distribution = ([5, 4, 3, 2, 1] as const).map((stars) => ({
    stars,
    count: reviews.filter((review) => review.rating === stars).length,
  }));

  return { count, average, distribution };
}

function getRelatedProducts(current: Product, limit: number): Product[] {
  const others = PRODUCTS.filter((product) => product.id !== current.id);

  const sameCategory = others.filter(
    (product) => product.category === current.category,
  );

  const rest = others.filter(
    (product) => product.category !== current.category,
  );

  return [...sameCategory, ...rest].slice(0, limit);
}

const labelClasses =
  "text-xs font-medium uppercase tracking-[0.22em] text-wine";

/* ==========================================================================
   Dialog behaviour shared by the lightbox and the size guide:
   scroll lock, Escape, Tab focus trap, initial focus, focus return.
   Both dialogs are mounted only while open, so this runs once per opening.
   ========================================================================== */

function useDialogBehavior(
  panelRef: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const { body, documentElement } = document;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = "hidden";

    if (scrollbar > 0) {
      body.style.paddingRight = `${scrollbar}px`;
    }

    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!panel.contains(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;

      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [panelRef]);
}

/* ==========================================================================
   Stars
   ========================================================================== */

function Stars({
  value,
  className = "size-4",
}: {
  value: number;
  className?: string;
}) {
  const filled = Math.round(value);

  return (
    <span aria-hidden="true" className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((number) => (
        <Star
          key={number}
          strokeWidth={1.5}
          className={`${className} ${
            number <= filled ? "fill-wine text-wine" : "text-warm-300"
          }`}
        />
      ))}
    </span>
  );
}

/* ==========================================================================
   Lightbox
   ========================================================================== */

interface LightboxProps {
  images: readonly ProductImage[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

function Lightbox({ images, index, onIndexChange, onClose }: LightboxProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const panelRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const count = images.length;

  useDialogBehavior(panelRef, onClose);

  const go = useCallback(
    (delta: number) => {
      onIndexChange((index + delta + count) % count);
    },
    [index, count, onIndexChange],
  );

  useEffect(() => {
    if (count < 2) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") go(-1);
      else if (event.key === "ArrowRight") go(1);
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [count, go]);

  const image = images[index];

  if (!image) return null;

  const navButton =
    "absolute top-1/2 z-10 inline-flex size-12 -translate-y-1/2 items-center justify-center text-warm transition-colors duration-300 hover:text-champagne";

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Product images"
      className="on-dark fixed inset-0 z-[70] flex flex-col bg-ink/95 text-warm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.3 }}
    >
      <div className="flex shrink-0 items-center justify-between px-4 py-2 sm:px-6">
        <p
          aria-live="polite"
          className="order-1 text-sm tracking-[0.18em] text-warm/80"
        >
          {index + 1} / {count}
        </p>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="order-2 -mr-3 inline-flex size-12 items-center justify-center transition-colors duration-300 hover:text-champagne"
        >
          <X aria-hidden="true" strokeWidth={1.5} className="size-6" />
        </button>
      </div>

      <div
        className="relative min-h-0 flex-1 px-4 pb-6 sm:px-20"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const start = touchStartX.current;
          touchStartX.current = null;

          const end = event.changedTouches[0]?.clientX;

          if (start === null || end === undefined || count < 2) return;

          const delta = end - start;

          if (Math.abs(delta) > 50) {
            go(delta < 0 ? 1 : -1);
          }
        }}
      >
        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className={`${navButton} left-0 sm:left-4`}
            >
              <ChevronLeft
                aria-hidden="true"
                strokeWidth={1.5}
                className="size-7"
              />
            </button>

            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className={`${navButton} right-0 sm:right-4`}
            >
              <ChevronRight
                aria-hidden="true"
                strokeWidth={1.5}
                className="size-7"
              />
            </button>
          </>
        ) : null}

        <motion.div
          key={image.src}
          className="relative mx-auto h-full w-full max-w-3xl"
          initial={{ opacity: reduceMotion ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.35 }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="100vw"
            quality={90}
            className="object-contain"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   Product gallery
   ========================================================================== */

function ProductGallery({ images }: { images: readonly ProductImage[] }) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const active = images[index] ?? images[0];

  if (!active) return null;

  return (
    <div className="flex min-w-0 flex-col gap-3 lg:flex-row-reverse lg:gap-4">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Open larger view: ${active.alt}`}
        className="group relative block aspect-3/4 w-full cursor-zoom-in overflow-hidden rounded-md bg-warm-200 lg:flex-1"
      >
        <div className="absolute inset-0 motion-safe:transition-transform motion-safe:duration-[1400ms] motion-safe:ease-out motion-safe:group-hover:scale-[1.03]">
          {images.map((image, i) => (
            <Image
              key={image.src}
              src={image.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={90}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              className={`object-cover transition-opacity duration-500 motion-reduce:transition-none ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
              style={{
                objectPosition: image.objectPosition ?? "center",
              }}
            />
          ))}
        </div>
      </button>

      {images.length > 1 ? (
        <ul className="flex gap-2 lg:w-20 lg:shrink-0 lg:flex-col lg:gap-3">
          {images.map((image, i) => {
            const isActive = i === index;

            return (
              <li key={image.src} className="w-16 sm:w-20 lg:w-full">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show image ${i + 1} of ${images.length}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative block aspect-3/4 w-full overflow-hidden rounded-sm bg-warm-200 transition-opacity duration-300 ${
                    isActive
                      ? "opacity-100 ring-1 ring-burgundy ring-offset-2 ring-offset-warm"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="80px"
                    quality={70}
                    className="object-cover"
                    style={{
                      objectPosition: image.objectPosition ?? "center",
                    }}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      <AnimatePresence>
        {lightboxOpen ? (
          <Lightbox
            key="lightbox"
            images={images}
            index={index}
            onIndexChange={setIndex}
            onClose={() => setLightboxOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================================
   Size guide dialog
   ========================================================================== */

function SizeGuideDialog({ onClose }: { onClose: () => void }) {
  const reduceMotion = useReducedMotion() ?? false;
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useDialogBehavior(panelRef, onClose);

  const duration = reduceMotion ? 0 : 0.4;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-ink/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.3 }}
        onClick={onClose}
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative max-h-[90dvh] w-full max-w-xl overflow-y-auto bg-warm px-6 pb-8 pt-6 sm:px-10 sm:pb-10 sm:pt-8"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
        transition={{ duration, ease: EASE }}
      >
        <div className="flex items-start justify-between gap-6">
          <h2
            id={titleId}
            className="font-serif text-3xl font-light text-burgundy sm:text-4xl"
          >
            Size Guide
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close size guide"
            className="-mr-3 -mt-2 inline-flex size-11 shrink-0 items-center justify-center text-ink transition-colors duration-300 hover:text-wine"
          >
            <X aria-hidden="true" strokeWidth={1.5} className="size-5" />
          </button>
        </div>

        <p
          id={descriptionId}
          className="mt-3 text-[0.9375rem] leading-[1.7] text-ink-muted"
        >
          Body measurements in centimetres. If you are between two sizes, we
          suggest choosing the larger one.
        </p>

        <table className="mt-6 w-full text-left text-sm">
          <caption className="sr-only">
            Body measurements in centimetres by size
          </caption>

          <thead>
            <tr className="border-b border-warm-300 text-xs uppercase tracking-[0.18em] text-wine">
              <th scope="col" className="py-3 pr-4 font-medium">
                Size
              </th>
              <th scope="col" className="py-3 pr-4 font-medium">
                Bust (cm)
              </th>
              <th scope="col" className="py-3 pr-4 font-medium">
                Waist (cm)
              </th>
              <th scope="col" className="py-3 font-medium">
                Hip (cm)
              </th>
            </tr>
          </thead>

          <tbody>
            {SIZE_CHART.map((row) => (
              <tr key={row.size} className="border-b border-border">
                <th scope="row" className="py-3 pr-4 font-medium text-ink">
                  {row.size}
                </th>
                <td className="py-3 pr-4 tabular-nums text-ink-muted">
                  {row.bust}
                </td>
                <td className="py-3 pr-4 tabular-nums text-ink-muted">
                  {row.waist}
                </td>
                <td className="py-3 tabular-nums text-ink-muted">{row.hip}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8">
          <h3 className={labelClasses}>How to measure</h3>

          <ul className="mt-3 space-y-2 text-[0.9375rem] leading-[1.7] text-ink-muted">
            <li>
              <span className="text-ink">Bust:</span> around the fullest part of
              the chest.
            </li>
            <li>
              <span className="text-ink">Waist:</span> around the narrowest part
              of the torso.
            </li>
            <li>
              <span className="text-ink">Hip:</span> around the fullest part of
              the hips.
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

/* ==========================================================================
   Accordion
   ========================================================================== */

interface AccordionItem {
  readonly id: string;
  readonly title: string;
  readonly content: ReactNode;
}

function Accordion({
  items,
  defaultOpenId,
}: {
  items: readonly AccordionItem[];
  defaultOpenId?: string;
}) {
  const baseId = useId();
  const reduceMotion = useReducedMotion() ?? false;
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className="border-t border-border">
      {items.map((item) => {
        const open = item.id === openId;
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <div key={item.id} className="border-b border-border">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={open ? panelId : undefined}
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left font-sans text-sm font-medium uppercase leading-snug tracking-[0.18em] text-ink transition-colors duration-300 hover:text-wine"
              >
                {item.title}

                {open ? (
                  <Minus
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-4 shrink-0"
                  />
                ) : (
                  <Plus
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-4 shrink-0"
                  />
                )}
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.4,
                    ease: EASE,
                  }}
                >
                  <div className="pb-6 text-[0.9375rem] leading-[1.75] text-ink-muted">
                    {item.content}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-[0.7em] h-px w-3 shrink-0 bg-champagne"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ==========================================================================
   Reviews
   ========================================================================== */

function ReviewsSection({
  productName,
  reviews,
}: {
  productName: string;
  reviews: readonly Review[];
}) {
  const stats = useMemo(() => getReviewStats(reviews), [reviews]);
  const [noticeOpen, setNoticeOpen] = useState(false);

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="border-t border-border"
    >
      <div className="container-editorial py-16 sm:py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20">
          <div>
            <p className="eyebrow">Reviews</p>

            <h2
              id="reviews-heading"
              className="mt-4 text-[clamp(2rem,1.5rem+2vw,3rem)] font-light text-burgundy"
            >
              Customer Reviews
            </h2>

            {stats.count > 0 ? (
              <>
                <div className="mt-8 flex items-center gap-5">
                  <p className="font-serif text-6xl font-light leading-none text-burgundy">
                    {stats.average.toFixed(1)}
                  </p>

                  <div>
                    <Stars value={stats.average} className="size-5" />

                    <p className="mt-1.5 text-sm text-ink-muted">
                      <span className="sr-only">
                        Average rating {stats.average.toFixed(1)} out of 5.{" "}
                      </span>
                      Based on {stats.count}{" "}
                      {stats.count === 1 ? "review" : "reviews"}
                    </p>
                  </div>
                </div>

                <ul
                  aria-label="Rating distribution"
                  className="mt-8 max-w-sm space-y-2.5"
                >
                  {stats.distribution.map(({ stars, count }) => (
                    <li key={stars} className="flex items-center gap-3 text-sm">
                      <span className="w-14 shrink-0 text-ink-muted">
                        {stars} stars
                      </span>

                      <span
                        aria-hidden="true"
                        className="h-1 flex-1 bg-warm-200"
                      >
                        <span
                          className="block h-full bg-wine"
                          style={{
                            width: `${(count / stats.count) * 100}%`,
                          }}
                        />
                      </span>

                      <span className="w-6 text-right tabular-nums text-ink-muted">
                        {count}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <div className="mt-10">
              <button
                type="button"
                onClick={() => setNoticeOpen((open) => !open)}
                aria-expanded={noticeOpen}
                className="border-b border-ink pb-1.5 text-xs font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:border-wine hover:text-wine"
              >
                Write a Review
              </button>

              {noticeOpen ? (
                <p
                  role="status"
                  className="mt-4 max-w-sm text-sm leading-[1.7] text-ink-muted"
                >
                  Reviews can be shared by customers who have purchased this
                  piece. Review submission will be available once customer
                  accounts are connected.
                </p>
              ) : null}
            </div>
          </div>

          <div>
            {stats.count > 0 ? (
              <ul>
                {reviews.map((review) => (
                  <li key={review.id}>
                    <article className="border-b border-border py-8 first:pt-0 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <Stars value={review.rating} />

                        <span className="sr-only">
                          Rated {review.rating} out of 5
                        </span>
                      </div>

                      <h3 className="mt-3 font-serif text-xl font-medium leading-snug text-ink">
                        {review.title}
                      </h3>

                      <p className="mt-2 max-w-xl text-[0.9375rem] leading-[1.75] text-ink-muted">
                        {review.body}
                      </p>

                      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-ink-muted">
                        {review.author} ·{" "}
                        {dateFormatter.format(new Date(review.date))}
                      </p>
                    </article>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="max-w-md lg:pt-10">
                <h3 className="font-serif text-3xl font-light text-burgundy">
                  No reviews{" "}
                  <em className="font-normal italic text-wine">yet.</em>
                </h3>

                <p className="mt-4 text-base leading-[1.75] text-ink-muted">
                  Be the first to share how the {productName} fits and feels.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Related products
   ========================================================================== */

function RelatedProducts({ product }: { product: Product }) {
  const reduceMotion = useReducedMotion() ?? false;

  const related = useMemo(() => getRelatedProducts(product, 4), [product]);

  return (
    <section
      aria-labelledby="related-heading"
      className="border-t border-border"
    >
      <div className="container-editorial py-16 sm:py-20 lg:py-24">
        <p className="eyebrow">Complete the Look</p>

        <h2
          id="related-heading"
          className="mt-4 text-[clamp(2rem,1.5rem+2vw,3rem)] font-light text-burgundy"
        >
          You May Also Like
        </h2>

        <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:mt-12 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
          {related.map((item, index) => {
            const image = item.images[0];

            if (!image) return null;

            return (
              <motion.li
                key={item.id}
                initial={{
                  opacity: reduceMotion ? 1 : 0,
                  y: reduceMotion ? 0 : 20,
                }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.8,
                  delay: reduceMotion ? 0 : index * 0.08,
                  ease: EASE,
                }}
              >
                <Link
                  href={`/products/${item.slug}`}
                  className="group block focus-visible:outline-offset-4"
                >
                  <div className="relative aspect-3/4 overflow-hidden rounded-md bg-warm-200">
                    <Image
                      src={image.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 24vw, 47vw"
                      quality={85}
                      className="object-cover motion-safe:transition-transform motion-safe:duration-[1400ms] motion-safe:ease-out motion-safe:group-hover:scale-105 motion-safe:group-focus-visible:scale-105"
                      style={{
                        objectPosition: image.objectPosition ?? "center",
                      }}
                    />
                  </div>

                  <div className="mt-3.5 flex flex-col gap-0.5 sm:mt-4">
                    <h3 className="font-serif text-lg font-medium leading-snug tracking-normal text-ink transition-colors duration-500 group-hover:text-wine group-focus-visible:text-wine sm:text-xl">
                      {item.name}
                    </h3>

                    <p className="text-sm tracking-[0.03em] text-ink-muted">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ==========================================================================
   Product view
   ========================================================================== */

export function ProductView({ product }: { product: Product }) {
  const reduceMotion = useReducedMotion() ?? false;
  const cart = useCart();

  const initialColor =
    product.colors.find((color) => totalStock(color) > 0) ?? product.colors[0];

  const [colorId, setColorId] = useState(initialColor.id);
  const [size, setSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSizeError, setShowSizeError] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [confirmation, setConfirmation] = useState("");

  const sizeGroupRef = useRef<HTMLFieldSetElement>(null);
  const resetTimer = useRef<number | undefined>(undefined);
  const errorId = useId();

  useEffect(() => {
    return () => window.clearTimeout(resetTimer.current);
  }, []);

  /* ---- Derived state ---- */

  const color =
    product.colors.find((item) => item.id === colorId) ?? product.colors[0];

  const galleryImages = color.images ?? product.images;
  const galleryKey = color.images ? color.id : "default";

  const availableSizes = sizesOf(color);
  const colorSoldOut = totalStock(color) === 0;

  const stockCap = size
    ? stockOf(color, size)
    : Math.max(0, ...availableSizes.map((item) => stockOf(color, item)));

  const inBag = size ? cart.getQuantity(product.id, color.id, size) : 0;

  const maxQty = Math.min(MAX_QTY, Math.max(0, stockCap - inBag));
  const qty = Math.min(quantity, Math.max(1, maxQty));

  const canAdd = !colorSoldOut && (size === null || maxQty > 0);

  const stats = useMemo(
    () => getReviewStats(product.reviews),
    [product.reviews],
  );

  let availabilityLabel = "In stock";
  let availabilityTone: "in" | "low" | "out" = "in";

  if (colorSoldOut) {
    availabilityLabel = "Sold out";
    availabilityTone = "out";
  } else if (size) {
    const left = stockOf(color, size);

    if (left <= LOW_STOCK) {
      availabilityLabel = `Only ${left} left in ${size}`;
      availabilityTone = "low";
    }
  }

  const dotClasses = {
    in: "bg-champagne",
    low: "bg-wine",
    out: "bg-ink-muted",
  }[availabilityTone];

  /* ---- Handlers ---- */

  function clearFeedback() {
    window.clearTimeout(resetTimer.current);
    setJustAdded(false);
    setConfirmation("");
  }

  function handleColorChange(id: string) {
    const next = product.colors.find((item) => item.id === id);

    if (!next) return;

    setColorId(id);

    if (size && stockOf(next, size) === 0) {
      setSize(null);
    }

    clearFeedback();
  }

  function handleSizeChange(next: Size) {
    setSize(next);
    setShowSizeError(false);
    clearFeedback();
  }

  function handleAddToBag() {
    if (colorSoldOut) return;

    if (!size) {
      setShowSizeError(true);

      sizeGroupRef.current
        ?.querySelector<HTMLInputElement>('input[type="radio"]:not(:disabled)')
        ?.focus();

      return;
    }

    if (maxQty < 1) return;

    const image = galleryImages[0] ?? product.images[0];

    if (!image) return;

    cart.addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image,
        colorId: color.id,
        colorName: color.name,
        size,
        unitPrice: product.price,
      },
      qty,
      stockOf(color, size),
    );

    const total = cart.itemCount + qty;

    setConfirmation(
      `Added ${product.name} · ${color.name} · ${size} × ${qty}. ${total} ${
        total === 1 ? "item" : "items"
      } in your bag.`,
    );

    setJustAdded(true);
    setQuantity(1);

    window.clearTimeout(resetTimer.current);

    resetTimer.current = window.setTimeout(() => {
      setJustAdded(false);
      setConfirmation("");
    }, 4000);
  }

  const buttonLabel = justAdded
    ? "Added to Bag"
    : colorSoldOut
      ? "Sold Out"
      : size && maxQty < 1
        ? "Maximum in Bag"
        : "Add to Bag";

  const hasSale =
    product.compareAtPrice !== undefined &&
    product.compareAtPrice > product.price;

  const accordionItems: AccordionItem[] = [
    {
      id: "description",
      title: "Product Description",
      content: (
        <div className="space-y-4">
          {product.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <BulletList items={product.details} />
        </div>
      ),
    },
    {
      id: "materials",
      title: "Materials & Care",
      content: (
        <div className="space-y-4">
          <p>{product.materials}</p>
          <BulletList items={product.care} />
        </div>
      ),
    },
    {
      id: "shipping",
      title: "Shipping & Returns",
      content: <BulletList items={SHIPPING_INFO} />,
    },
  ];

  return (
    <>
      {/* Breadcrumb */}

      <div className="container-editorial pt-6 sm:pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs uppercase tracking-[0.18em] text-ink-muted">
            <li>
              <Link
                href="/"
                className="transition-colors duration-300 hover:text-wine"
              >
                Home
              </Link>
            </li>

            <li aria-hidden="true">/</li>

            <li>
              <Link
                href="/clothing"
                className="transition-colors duration-300 hover:text-wine"
              >
                Clothing
              </Link>
            </li>

            <li aria-hidden="true">/</li>

            <li aria-current="page" className="text-ink">
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      {/* Gallery + information */}

      <section
        aria-labelledby="product-title"
        className="container-editorial pb-16 pt-6 sm:pb-20 sm:pt-8 lg:pb-24"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16 xl:gap-20">
          <ProductGallery key={galleryKey} images={galleryImages} />

          <div className="min-w-0">
            <p className="eyebrow">{product.category}</p>

            <h1
              id="product-title"
              className="mt-4 text-[clamp(2.25rem,1.6rem+2.4vw,3.5rem)] font-light leading-[1.04] text-burgundy"
            >
              {product.name}
            </h1>

            <a
              href="#reviews"
              className="mt-4 inline-flex items-center gap-3 text-sm text-ink-muted transition-colors duration-300 hover:text-wine"
            >
              {stats.count > 0 ? (
                <>
                  <Stars value={stats.average} />

                  <span>
                    <span className="sr-only">
                      Rated {stats.average.toFixed(1)} out of 5.{" "}
                    </span>
                    {stats.average.toFixed(1)} · {stats.count}{" "}
                    {stats.count === 1 ? "review" : "reviews"}
                  </span>
                </>
              ) : (
                <span>No reviews yet</span>
              )}
            </a>

            <p className="mt-5 flex items-baseline gap-3 text-xl tracking-[0.02em] text-ink">
              <span className={hasSale ? "text-wine" : undefined}>
                <span className="sr-only">Price: </span>
                {formatPrice(product.price)}
              </span>

              {hasSale && product.compareAtPrice !== undefined ? (
                <s className="text-base text-ink-muted">
                  <span className="sr-only">Original price: </span>
                  {formatPrice(product.compareAtPrice)}
                </s>
              ) : null}
            </p>

            <p className="mt-5 max-w-md text-base leading-[1.75] text-ink-muted">
              {product.shortDescription}
            </p>

            <p className="mt-5 flex items-center gap-2.5 text-sm text-ink">
              <span
                aria-hidden="true"
                className={`size-2 rounded-full ${dotClasses}`}
              />
              {availabilityLabel}
            </p>

            {/* Colour */}

            <fieldset className="mt-8">
              <legend className={labelClasses}>
                Colour
                <span className="ml-3 font-sans text-sm font-normal normal-case tracking-normal text-ink">
                  {color.name}
                </span>
              </legend>

              <div className="mt-4 flex flex-wrap gap-3">
                {product.colors.map((item) => (
                  <label key={item.id} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="color"
                      value={item.id}
                      checked={item.id === color.id}
                      onChange={() => handleColorChange(item.id)}
                      className="peer sr-only"
                    />

                    <span className="block size-10 rounded-full p-1 ring-1 ring-transparent transition-shadow duration-300 hover:ring-warm-300 peer-checked:ring-burgundy peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-wine">
                      <span
                        className="block size-full rounded-full border border-ink/15"
                        style={{ backgroundColor: item.swatch }}
                      />
                    </span>

                    <span className="sr-only">
                      {item.name}
                      {totalStock(item) === 0 ? " (sold out)" : ""}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Size */}

            <fieldset
              ref={sizeGroupRef}
              className="mt-8"
              aria-describedby={showSizeError ? errorId : undefined}
            >
              <div className="flex items-baseline justify-between gap-4">
                <legend className={labelClasses}>
                  Size
                  {size ? (
                    <span className="ml-3 font-sans text-sm font-normal normal-case tracking-normal text-ink">
                      {size}
                    </span>
                  ) : null}
                </legend>

                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  aria-haspopup="dialog"
                  className="py-1 text-sm text-ink underline decoration-champagne decoration-1 underline-offset-4 transition-colors duration-300 hover:text-wine hover:decoration-wine"
                >
                  Size Guide
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {availableSizes.map((item) => {
                  const disabled = stockOf(color, item) === 0;

                  return (
                    <label
                      key={item}
                      className={`relative ${
                        disabled ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      <input
                        type="radio"
                        name="size"
                        value={item}
                        checked={size === item}
                        disabled={disabled}
                        onChange={() => handleSizeChange(item)}
                        className="peer sr-only"
                      />

                      <span className="flex h-12 min-w-14 items-center justify-center border border-warm-300 px-4 text-sm tracking-[0.04em] text-ink transition-colors duration-300 hover:border-ink peer-checked:border-burgundy peer-checked:bg-burgundy peer-checked:text-warm peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-wine peer-disabled:border-warm-200 peer-disabled:text-ink-muted/50 peer-disabled:line-through peer-disabled:hover:border-warm-200">
                        {item}

                        {disabled ? (
                          <span className="sr-only"> (out of stock)</span>
                        ) : null}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Quantity */}

            <div className="mt-8">
              <p id="quantity-label" className={labelClasses}>
                Quantity
              </p>

              <div
                role="group"
                aria-labelledby="quantity-label"
                className="mt-4 inline-flex h-12 items-center border border-warm-300"
              >
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, qty - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                  className="inline-flex size-12 items-center justify-center text-ink transition-colors duration-300 hover:text-wine disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:text-ink"
                >
                  <Minus
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-4"
                  />
                </button>

                <span
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  className="w-10 text-center text-base tabular-nums text-ink"
                >
                  {qty}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(maxQty, qty + 1))}
                  disabled={qty >= maxQty}
                  aria-label="Increase quantity"
                  className="inline-flex size-12 items-center justify-center text-ink transition-colors duration-300 hover:text-wine disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:text-ink"
                >
                  <Plus
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-4"
                  />
                </button>
              </div>
            </div>

            {/* Add to bag */}

            <div className="mt-8">
              <motion.button
                type="button"
                onClick={handleAddToBag}
                disabled={!canAdd && !justAdded}
                whileTap={
                  reduceMotion || (!canAdd && !justAdded)
                    ? undefined
                    : { scale: 0.985 }
                }
                className={`flex h-14 w-full items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
                  justAdded
                    ? "bg-wine text-warm"
                    : !canAdd
                      ? "cursor-not-allowed bg-warm-200 text-ink-muted"
                      : "bg-burgundy text-warm hover:bg-wine focus-visible:bg-wine"
                }`}
              >
                {justAdded ? (
                  <Check
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-4"
                  />
                ) : null}

                {buttonLabel}
              </motion.button>

              <div
                role="status"
                aria-live="polite"
                className="mt-4 min-h-6 text-sm leading-relaxed"
              >
                {showSizeError ? (
                  <span id={errorId} className="text-wine">
                    Please select a size before adding to your bag.
                  </span>
                ) : (
                  <span className="text-wine">{confirmation}</span>
                )}
              </div>
            </div>

            {/* Information accordions */}

            <div className="mt-8">
              <Accordion items={accordionItems} defaultOpenId="description" />
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection productName={product.name} reviews={product.reviews} />

      <RelatedProducts product={product} />

      <AnimatePresence>
        {sizeGuideOpen ? (
          <SizeGuideDialog
            key="size-guide"
            onClose={() => setSizeGuideOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
