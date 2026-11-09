import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import { ImageReveal, Reveal } from "../../components/about/Reveal";

export const metadata: Metadata = {
  title: "About | Maison Vérane",
  description:
    "A considered approach to modern femininity, where timeless design meets effortless expression.",
};

/**
 * Heading font. If your layout exposes Cormorant Garamond under a different
 * CSS variable name, change `--font-cormorant` here. Body text inherits Jost
 * from your root layout.
 */
const display: CSSProperties = {
  fontFamily:
    "var(--font-cormorant, 'Cormorant Garamond'), Georgia, 'Times New Roman', serif",
};

const IMG = "/images/about";

type PhotoProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

function Photo({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
}: PhotoProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}

const principles = [
  {
    title: "Timeless by Nature",
    body: "We design for the long view. Lines are drawn to stay relevant long after the season has turned, so a piece feels as right on a quiet Tuesday as it does at a celebration.",
  },
  {
    title: "Thoughtful in Every Detail",
    body: "A neckline, a hem, the way a sleeve falls. We give attention to the small decisions, because they are what make a garment feel considered rather than merely made.",
  },
  {
    title: "Confidence in Simplicity",
    body: "Restraint is not the absence of style. When a silhouette is clean and a palette is calm, the woman wearing it becomes the focus.",
  },
];

const dressing = [
  {
    title: "Refined silhouettes",
    body: "Clean, balanced shapes that flatter without effort and hold their own with very little around them.",
  },
  {
    title: "Versatile pieces",
    body: "Designed to move from morning to evening, and to meet the pieces already in your wardrobe as easily as the new ones.",
  },
  {
    title: "Effortless styling",
    body: "Begin with one considered piece and let the rest follow. Dressing well should feel like instinct, not instruction.",
  },
];

const commitments = [
  {
    title: "Thoughtful Design",
    body: "Every piece begins with a question: how will she wear it, and how will it make her feel? The answer shapes each line we draw.",
  },
  {
    title: "Everyday Comfort",
    body: "Elegance should never ask you to hold your breath. We design pieces to move with you through the whole of your day.",
  },
  {
    title: "Refined Details",
    body: "A precise line, a measured proportion, an understated finish. The quiet decisions are the ones we return to most.",
  },
];

const wrap = "mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16";

export default function AboutPage() {
  return (
    <main className="overflow-x-clip bg-[#F1E8DE] text-[#292426]">
      {/* 1. Editorial hero */}
      <section
        aria-labelledby="about-hero-heading"
        className="bg-[#421C2A] text-[#F1E8DE]"
      >
        <div className="mx-auto grid max-w-[1600px] lg:grid-cols-12">
          <div className="order-2 flex min-w-0 flex-col justify-end px-6 pb-16 pt-12 sm:px-10 lg:order-1 lg:col-span-6 lg:px-16 lg:pb-24 lg:pt-40">
            <Reveal immediate delay={0.15}>
              <h1
                id="about-hero-heading"
                style={display}
                className="text-[clamp(3rem,6vw,6.25rem)] font-light leading-[0.95] tracking-[-0.01em]"
              >
                <span className="block">Elegance,</span>
                <span className="block">Beyond Trends.</span>
              </h1>
            </Reveal>
            <Reveal immediate delay={0.45} className="mt-8 flex max-w-md gap-6">
              <span
                aria-hidden="true"
                className="mt-3 block h-px w-12 shrink-0 bg-[#C5A88A]"
              />
              <p className="text-base leading-relaxed text-[#F1E8DE]/80 md:text-lg">
                A considered approach to modern femininity, where timeless
                design meets effortless expression.
              </p>
            </Reveal>
          </div>

          {/* Hero image is static so it can load as the priority image. */}
          <div className="relative order-1 aspect-[4/5] w-full overflow-hidden bg-[#713849] lg:order-2 lg:col-span-6 lg:aspect-auto lg:h-[min(100svh,56rem)]">
            <Photo
              src={`${IMG}/hero-editorial.avif`}
              alt="A woman in a burgundy tailored coat stands against a pale architectural wall in soft natural light."
              sizes="(min-width: 1600px) 800px, (min-width: 1024px) 50vw, 100vw"
              priority
              className="object-[50%_20%]"
            />
          </div>
        </div>
      </section>

      {/* 2. Brand introduction */}
      <section aria-labelledby="about-intro-heading" className="py-24 md:py-36">
        <div className={`${wrap} grid gap-14 lg:grid-cols-12 lg:gap-x-8`}>
          <div className="min-w-0 lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:pt-10">
            <Reveal>
              <p className="text-xs tracking-[0.28em] text-[#713849]">
                THE WORLD OF MAISON VÉRANE
              </p>
              <h2
                id="about-intro-heading"
                style={display}
                className="mt-6 text-[clamp(2.5rem,4.6vw,4.5rem)] font-light leading-[1.02]"
              >
                More Than What We Wear.
              </h2>
              <div className="mt-10 max-w-xl space-y-6 text-base leading-[1.85] text-[#292426]/85 md:text-[1.0625rem]">
                <p>
                  Maison Vérane begins with a simple conviction: a woman is
                  never a trend to be followed. She is an individual, and what
                  she wears should feel like a continuation of her, not a
                  costume borrowed for the season.
                </p>
                <p>
                  We approach modern femininity as something quiet and assured.
                  It does not need to announce itself. It lives in a considered
                  line, a calm palette, and the ease of a piece that simply
                  feels right.
                </p>
                <p>
                  Our work is to design with thought and then step back, so that
                  personal expression remains yours.
                </p>
              </div>
            </Reveal>

            <ImageReveal
              delay={0.1}
              className="relative mt-16 hidden aspect-square w-[58%] bg-[#E3D5C4] md:block"
            >
              <Photo
                src={`${IMG}/intro-fabric.avif`}
                alt="Close view of a soft, draped neutral fabric catching natural light."
                sizes="(min-width: 1024px) 25vw, 40vw"
              />
            </ImageReveal>
          </div>

          <ImageReveal className="relative aspect-[3/4] w-full bg-[#E3D5C4] lg:col-span-5 lg:col-start-1 lg:row-start-1">
            <Photo
              src={`${IMG}/intro-portrait.avif`}
              alt="A woman in a neutral knit and wide trousers, photographed in profile in a minimal room."
              sizes="(min-width: 1440px) 560px, (min-width: 1024px) 40vw, 100vw"
            />
          </ImageReveal>
        </div>
      </section>

      {/* 3. Our philosophy */}
      <section
        aria-labelledby="about-philosophy-heading"
        className="bg-[#E9DDCF] py-24 md:py-36"
      >
        <div className={`${wrap} grid gap-14 lg:grid-cols-12 lg:gap-x-8`}>
          <div className="min-w-0 lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
            <Reveal>
              <h2
                id="about-philosophy-heading"
                style={display}
                className="text-[clamp(2.5rem,4.6vw,4.5rem)] font-light leading-[1.02]"
              >
                Designed With Intention.
              </h2>
            </Reveal>
            <ImageReveal className="relative mt-10 aspect-[4/3] w-full bg-[#D9C9B6] md:max-w-sm lg:aspect-[4/5]">
              <Photo
                src={`${IMG}/philosophy-portrait.avif`}
                alt="Detail of a burgundy garment with a clean collar and precise seam."
                sizes="(min-width: 1024px) 24vw, (min-width: 768px) 384px, 100vw"
              />
            </ImageReveal>
          </div>

          <div className="min-w-0 lg:col-span-6 lg:col-start-7">
            {principles.map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 0.08}
                className={`border-t border-[#C5A88A] pb-16 pt-8 last:pb-0 md:pt-10 ${
                  i === 1 ? "lg:ml-16" : ""
                }`}
              >
                <h3
                  style={display}
                  className="text-3xl font-normal leading-tight text-[#421C2A] md:text-[2.5rem]"
                >
                  {item.title}
                </h3>
                <p className="mt-5 max-w-md text-base leading-[1.85] text-[#292426]/85">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Editorial campaign */}
      <section
        aria-labelledby="about-campaign-heading"
        className="relative aspect-[4/5] w-full overflow-hidden bg-[#292426] md:aspect-auto md:h-[88svh] md:min-h-[600px]"
      >
        <ImageReveal className="absolute inset-0">
          <Photo
            src={`${IMG}/campaign-tall.avif`}
            alt="A woman in a long wine-coloured dress walks through a bright, minimal corridor."
            sizes="100vw"
            className="md:hidden"
          />
          <Photo
            src={`${IMG}/campaign-wide.avif`}
            alt="A woman in a long wine-coloured dress walks through a bright, minimal corridor."
            sizes="100vw"
            className="hidden md:block"
          />
        </ImageReveal>
        {/* Flat tint for legibility, no gradient */}
        <div aria-hidden="true" className="absolute inset-0 bg-[#292426]/25" />
        <div className="absolute inset-x-0 bottom-0">
          <div className={`${wrap} pb-10 md:pb-16`}>
            <Reveal>
              <h2
                id="about-campaign-heading"
                style={display}
                className="max-w-3xl text-[clamp(2.75rem,6.5vw,6.5rem)] font-light leading-[0.98] text-[#F1E8DE]"
              >
                The Art of Being Her.
              </h2>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. The art of dressing */}
      <section
        aria-labelledby="about-dressing-heading"
        className="py-24 md:py-36"
      >
        <div className={`${wrap} grid gap-14 lg:grid-cols-12 lg:gap-x-8`}>
          <ImageReveal className="relative aspect-[4/5] w-full bg-[#E3D5C4] lg:col-span-5 lg:aspect-[3/4]">
            <Photo
              src={`${IMG}/dressing-main.avif`}
              alt="A woman in a champagne-toned tailored set, standing with one hand in a pocket."
              sizes="(min-width: 1440px) 560px, (min-width: 1024px) 40vw, 100vw"
            />
          </ImageReveal>

          <div className="min-w-0 lg:col-span-6 lg:col-start-7">
            <Reveal>
              <h2
                id="about-dressing-heading"
                style={display}
                className="text-[clamp(2.5rem,4.6vw,4.5rem)] font-light leading-[1.02]"
              >
                Style That Feels Like You.
              </h2>
              <p className="mt-8 max-w-xl text-base leading-[1.85] text-[#292426]/85 md:text-[1.0625rem]">
                At Maison Vérane, dressing is a quiet, personal act. We make
                pieces to be worn your way: layered, simplified, repeated and
                reimagined.
              </p>
            </Reveal>

            <dl className="mt-12 space-y-8">
              {dressing.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.08}>
                  <dt
                    style={display}
                    className="text-2xl font-normal italic text-[#713849] md:text-3xl"
                  >
                    {item.title}
                  </dt>
                  <dd className="mt-2 max-w-md text-base leading-[1.8] text-[#292426]/85">
                    {item.body}
                  </dd>
                </Reveal>
              ))}
            </dl>

            <div className="mt-14 grid grid-cols-2 gap-4 md:gap-6">
              <ImageReveal className="relative aspect-[4/5] bg-[#E3D5C4]">
                <Photo
                  src={`${IMG}/dressing-silhouette.avif`}
                  alt="A softly structured silhouette in a warm neutral tone, seen from the side."
                  sizes="(min-width: 1024px) 22vw, 45vw"
                />
              </ImageReveal>
              <ImageReveal
                delay={0.12}
                className="relative mt-10 aspect-square bg-[#E3D5C4] md:mt-16"
              >
                <Photo
                  src={`${IMG}/dressing-fabric.avif`}
                  alt="Refined fabric detail with a soft fold and a single fine seam."
                  sizes="(min-width: 1024px) 22vw, 45vw"
                />
              </ImageReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Our commitment */}
      <section
        aria-labelledby="about-commitment-heading"
        className="bg-[#292426] py-24 text-[#F1E8DE] md:py-36"
      >
        <div className={wrap}>
          <Reveal className="grid gap-8 lg:grid-cols-12 lg:gap-x-8">
            <h2
              id="about-commitment-heading"
              style={display}
              className="text-[clamp(2.5rem,4.6vw,4.5rem)] font-light leading-[1.02] lg:col-span-7"
            >
              Considered, Always.
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-x-12 gap-y-14 md:mt-24 md:grid-cols-3">
            {commitments.map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 0.1}
                className="border-t border-[#C5A88A]/50 pt-8"
              >
                <h3
                  style={display}
                  className="text-3xl font-normal leading-tight text-[#C5A88A]"
                >
                  {item.title}
                </h3>
                <p className="mt-5 max-w-sm text-base leading-[1.85] text-[#F1E8DE]/80">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Closing statement */}
      <section
        aria-labelledby="about-closing-heading"
        className="bg-[#421C2A] px-6 py-28 text-center text-[#F1E8DE] md:py-48"
      >
        <Reveal className="mx-auto max-w-4xl">
          <h2
            id="about-closing-heading"
            style={display}
            className="text-[clamp(3rem,8vw,7.5rem)] font-light leading-[0.98]"
          >
            Make It Your Own.
          </h2>
          <span
            aria-hidden="true"
            className="mx-auto mt-10 block h-px w-16 bg-[#C5A88A]"
          />
          <p className="mx-auto mt-10 max-w-md text-base leading-relaxed text-[#F1E8DE]/80 md:text-lg">
            An expression of who you are, in every detail.
          </p>
        </Reveal>
      </section>
    </main>
  );
}
