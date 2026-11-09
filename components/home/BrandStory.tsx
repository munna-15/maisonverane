"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";

interface HeadingLine {
  readonly text: string;
  readonly accent?: boolean;
}

export interface BrandStoryContent {
  readonly eyebrow: string;
  readonly heading: readonly HeadingLine[];
  readonly description: string;
  readonly cta: {
    readonly label: string;
    readonly href: string;
  };
  readonly monogram: readonly [string, string];
  readonly closingStatement: readonly string[];
  readonly image: {
    readonly src: string;
    readonly alt: string;
    readonly objectPosition?: string;
  };
}

interface BrandStoryProps {
  content?: BrandStoryContent;
}

const BRAND_STORY: BrandStoryContent = {
  eyebrow: "A Little About Us",
  heading: [
    { text: "Style is an expression." },
    { text: "Make it your own.", accent: true },
  ],
  description:
    "Maison Vérane is a celebration of modern femininity — where timeless design meets a contemporary spirit.",
  cta: {
    label: "Our Story",
    href: "/about",
  },
  monogram: ["M", "V"],
  closingStatement: ["Timeless Style.", "Modern You."],
  image: {
    src: "/images/editorial/brand-story.png",
    alt: "Model wearing a flowing burgundy dress in a warm editorial portrait",
    objectPosition: "50% 25%",
  },
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function BrandStory({ content = BRAND_STORY }: BrandStoryProps) {
  const reduceMotion = useReducedMotion() ?? false;

  const {
    eyebrow,
    heading,
    description,
    cta,
    monogram,
    closingStatement,
    image,
  } = content;

  const itemVariants: Variants = {
    hidden: {
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.85,
        ease: EASE,
      },
    },
  };

  const copyVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: reduceMotion ? 0 : 0.1,
        staggerChildren: reduceMotion ? 0 : 0.12,
      },
    },
  };

  const portraitVariants: Variants = {
    hidden: {
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : 25,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 1.1,
        ease: EASE,
      },
    },
  };

  const asideVariants: Variants = {
    hidden: {
      opacity: reduceMotion ? 1 : 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0 : 1,
        delay: reduceMotion ? 0 : 0.35,
        ease: EASE,
      },
    },
  };

  return (
    <section
      aria-labelledby="brand-story-heading"
      className="on-dark overflow-hidden bg-burgundy text-warm lg:h-[80svh] lg:min-h-[620px] lg:max-h-[820px]"
    >
      <div className="mx-auto grid w-full max-w-[96rem] grid-cols-1 gap-12 px-6 py-16 sm:gap-14 sm:px-10 sm:py-20 lg:h-full lg:grid-cols-[minmax(0,48fr)_minmax(0,33fr)_minmax(0,19fr)] lg:items-center lg:gap-0 lg:px-0 lg:py-0">
        {/* Left: Brand statement */}
        <motion.div
          className="flex flex-col justify-center lg:py-10 lg:pl-12 lg:pr-8 xl:pl-20 xl:pr-12"
          variants={copyVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p
            variants={itemVariants}
            className="flex items-center gap-5 text-[10px] font-medium uppercase leading-none tracking-[0.22em] text-warm/75 sm:text-xs lg:gap-6"
          >
            <span className="shrink-0">{eyebrow}</span>
            <span
              aria-hidden="true"
              className="h-px w-12 bg-champagne/60 sm:w-20 lg:w-24"
            />
          </motion.p>

          <motion.h2
            id="brand-story-heading"
            variants={itemVariants}
            className="mt-7 font-serif text-[clamp(2.25rem,8vw,3.5rem)] font-normal leading-[1.04] tracking-[-0.035em] text-warm sm:mt-9 sm:text-[clamp(2.75rem,5vw,4rem)] lg:mt-10 lg:text-[clamp(2.4rem,4.2vw,4.65rem)]"
          >
            {heading.map((line) => (
              <span
                key={line.text}
                className={line.accent ? "block italic" : "block"}
              >
                {line.text}
              </span>
            ))}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-[23em] text-sm leading-[1.8] text-warm/80 sm:mt-8 sm:text-base lg:mt-7 lg:text-[clamp(0.9rem,1.15vw,1.125rem)]"
          >
            {description}
          </motion.p>

          <motion.div variants={itemVariants} className="mt-8 sm:mt-10 lg:mt-9">
            <Link
              href={cta.href}
              className="inline-block border-b border-warm/75 pb-2 text-xs font-medium uppercase tracking-[0.16em] text-warm transition-colors duration-300 hover:border-champagne hover:text-champagne focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne sm:text-sm"
            >
              {cta.label}
            </Link>
          </motion.div>
        </motion.div>

        {/* Centre: Arched fashion portrait */}
        <motion.div
          className="mx-auto w-full max-w-sm sm:max-w-md lg:mx-0 lg:flex lg:h-[88%] lg:max-w-none lg:self-end"
          variants={portraitVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-t-full bg-wine/40 lg:h-full lg:aspect-auto">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1536px) 32rem, (min-width: 1024px) 33vw, (min-width: 640px) 28rem, 90vw"
              quality={90}
              className="object-cover motion-safe:transition-transform motion-safe:duration-[1600ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] lg:group-hover:scale-[1.035]"
              style={{
                objectPosition: image.objectPosition ?? "center",
              }}
            />
          </div>
        </motion.div>

        {/* Right: Monogram and brand signature */}
        <motion.div
          className="flex flex-col items-center justify-center gap-5 text-center sm:gap-7 lg:gap-10 lg:px-3"
          variants={asideVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <span
            aria-hidden="true"
            className="inline-flex items-start font-serif text-[5rem] font-light leading-none text-champagne/75 sm:text-[6rem] lg:text-[clamp(4rem,6.5vw,7rem)]"
          >
            <span>{monogram[0]}</span>
            <span className="-ml-[0.3em] mt-[0.42em] text-[0.9em]">
              {monogram[1]}
            </span>
          </span>

          <p className="text-[10px] font-medium uppercase leading-[2.1] tracking-[0.22em] text-champagne/85 sm:text-xs">
            {closingStatement.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
