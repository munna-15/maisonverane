"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */
interface HeadingLine {
  readonly text: string;
  /** Renders the line in wine italic as the typographic accent */
  readonly accent?: boolean;
}

export interface CampaignContent {
  readonly eyebrow: string;
  readonly heading: readonly HeadingLine[];
  readonly description: string;
  readonly cta: {
    readonly label: string;
    readonly href: string;
  };
  readonly image: {
    /** Path inside /public */
    readonly src: string;
    readonly alt: string;
    /** CSS object-position: keeps the subject in frame */
    readonly objectPosition?: string;
  };
}

interface EditorialCampaignProps {
  content?: CampaignContent;
}

/* --------------------------------------------------------------------------
   Content: replace copy, link and image here
   -------------------------------------------------------------------------- */
const CAMPAIGN: CampaignContent = {
  eyebrow: "The Seasonal Edit",
  heading: [
    { text: "A New Perspective" },
    { text: "on Modern Femininity", accent: true },
  ],
  description:
    "An expression of effortless confidence. Discover thoughtfully selected pieces that bring together refined silhouettes, beautiful textures and contemporary femininity.",
  cta: {
    label: "Discover the Edit",
    href: "/collections/seasonal-edit",
  },
  image: {
    src: "/images/hero/hero-02.jpg",
    alt: "Model in a flowing burgundy satin drape with gold earrings, photographed in soft warm light",
    objectPosition: "45% 20%",
  },
};

/* --------------------------------------------------------------------------
   Constants
   -------------------------------------------------------------------------- */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* --------------------------------------------------------------------------
   Section
   -------------------------------------------------------------------------- */
export function EditorialCampaign({
  content = CAMPAIGN,
}: EditorialCampaignProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const { eyebrow, heading, description, cta, image } = content;

  const imageVariants: Variants = {
    hidden: { opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: reduceMotion ? 0 : 1.3, ease: EASE },
    },
  };

  const copyVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: reduceMotion ? 0 : 0.15,
        staggerChildren: reduceMotion ? 0 : 0.13,
      },
    },
  };

  const copyItemVariants: Variants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.9, ease: EASE },
    },
  };

  return (
    <section
      aria-labelledby="editorial-campaign-heading"
      className="overflow-hidden bg-warm mb-12"
    >
      <div className="grid grid-cols-1 lg:min-h-[34rem] lg:grid-cols-[56fr_44fr] xl:min-h-[38rem]">
        {/* Photograph: full-bleed to the left edge */}
        <div className="relative aspect-4/5 overflow-hidden bg-warm-200 sm:aspect-3/2 lg:aspect-auto">
          <motion.div
            className="group absolute inset-0"
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 56vw, 100vw"
              quality={90}
              className="object-cover motion-safe:transition-transform motion-safe:duration-1600 motion-safe:ease-out lg:motion-safe:group-hover:scale-[1.04]"
              style={{ objectPosition: image.objectPosition ?? "center" }}
            />
          </motion.div>
        </div>

        {/* Content panel */}
        <div className="flex items-center px-6 py-12 sm:px-10 sm:py-14 lg:px-12 lg:py-16 xl:px-20">
          <motion.div
            className="w-full max-w-xl"
            variants={copyVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Eyebrow with trailing hairline */}
            <motion.p
              variants={copyItemVariants}
              className="eyebrow flex items-center gap-5 text-wine/80"
            >
              <span className="shrink-0">{eyebrow}</span>
              <span
                aria-hidden="true"
                className="h-px max-w-20 flex-1 bg-champagne/70"
              />
            </motion.p>

            {/* Heading */}
            <motion.h2
              id="editorial-campaign-heading"
              variants={copyItemVariants}
              className="mt-7 text-[clamp(2.25rem,9vw,3.5rem)] font-light leading-[1.04] tracking-[-0.02em] text-burgundy sm:text-[clamp(2.5rem,1.6rem+3.2vw,3.5rem)] lg:mt-9 lg:text-[clamp(2.5rem,0.9rem+2.9vw,4.25rem)]"
            >
              {heading.map((line) => (
                <span
                  key={line.text}
                  className={
                    line.accent ? "block font-normal italic text-wine" : "block"
                  }
                >
                  {line.text}
                </span>
              ))}
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={copyItemVariants}
              className="mt-7 max-w-md text-base leading-[1.75] text-ink sm:text-[1.0625rem]"
            >
              {description}
            </motion.p>

            {/* CTA: understated uppercase text link */}
            <motion.div variants={copyItemVariants} className="mt-9 lg:mt-11">
              <Link
                href={cta.href}
                className="inline-block border-b border-ink pb-1.5 text-xs font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:border-wine hover:text-wine focus-visible:border-wine focus-visible:text-wine"
              >
                {cta.label}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
