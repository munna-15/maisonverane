"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import {
  memo,
  useCallback,
  useEffect,
  useReducer,
  useState,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
  type SyntheticEvent,
} from "react";

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */

export interface HeroSlide {
  readonly id: string;
  readonly heading: string;
  readonly image: {
    readonly src: string;
    readonly alt: string;
    readonly objectPosition?: string;
    readonly mobileObjectPosition?: string;
  };
}

interface HeroProps {
  slides?: readonly HeroSlide[];
  autoplayInterval?: number;
}

type LayerStatus = "base" | "incoming" | "idle";

/* --------------------------------------------------------------------------
   Slide Data
   -------------------------------------------------------------------------- */

const DEFAULT_HERO_SLIDES: readonly HeroSlide[] = [
  {
    id: "hero-01",
    heading: "Elegance, Unscripted.",
    image: {
      src: "/images/hero/hero-07.avif",
      alt: "Elegant contemporary women's fashion editorial",
      objectPosition: "50% 30%",
      mobileObjectPosition: "50% 25%",
    },
  },
  {
    id: "hero-02",
    heading: "A Softer Statement.",
    image: {
      src: "/images/hero/hero-03.avif",
      alt: "Sophisticated women's fashion campaign",
      objectPosition: "50% 30%",
      mobileObjectPosition: "50% 25%",
    },
  },
  {
    id: "hero-03",
    heading: "The Art of Being Her.",
    image: {
      src: "/images/hero/hero-04.avif",
      alt: "Modern feminine fashion editorial campaign",
      objectPosition: "50% 30%",
      mobileObjectPosition: "50% 25%",
    },
  },
];

/* --------------------------------------------------------------------------
   Constants
   -------------------------------------------------------------------------- */

const DEFAULT_AUTOPLAY_MS = 6000;
const MIN_AUTOPLAY_MS = 3000;
const FADE_MS = 1200;
const SETTLE_MS = 100;
const LOAD_FAILSAFE_MS = 8000;

const LAYER_Z: Record<LayerStatus, string> = {
  incoming: "z-20",
  base: "z-10",
  idle: "z-0",
};

/* --------------------------------------------------------------------------
   Carousel State Machine
   -------------------------------------------------------------------------- */

interface CarouselState {
  readonly selected: number;
  readonly base: number;
  readonly incoming: number | null;
  readonly loaded: Readonly<Record<number, true>>;
}

type CarouselAction =
  | { readonly type: "select"; readonly index: number }
  | { readonly type: "loaded"; readonly index: number }
  | { readonly type: "complete" };

const INITIAL_STATE: CarouselState = {
  selected: 0,
  base: 0,
  incoming: null,
  loaded: { 0: true },
};

function startIfReady(state: CarouselState): CarouselState {
  if (state.incoming !== null) return state;
  if (state.selected === state.base) return state;
  if (!state.loaded[state.selected]) return state;

  return {
    ...state,
    incoming: state.selected,
  };
}

function carouselReducer(
  state: CarouselState,
  action: CarouselAction,
): CarouselState {
  switch (action.type) {
    case "select": {
      if (action.index === state.selected) return state;

      return startIfReady({
        ...state,
        selected: action.index,
      });
    }

    case "loaded": {
      if (state.loaded[action.index]) return state;

      return startIfReady({
        ...state,
        loaded: {
          ...state.loaded,
          [action.index]: true,
        },
      });
    }

    case "complete": {
      if (state.incoming === null) return state;

      return startIfReady({
        ...state,
        base: state.incoming,
        incoming: null,
      });
    }

    default:
      return state;
  }
}

/* --------------------------------------------------------------------------
   Slide Layer
   -------------------------------------------------------------------------- */

interface HeroSlideLayerProps {
  slide: HeroSlide;
  index: number;
  total: number;
  status: LayerStatus;
  isSelected: boolean;
  fadeMs: number;
  onLoaded: (index: number) => void;
}

const HeroSlideLayer = memo(function HeroSlideLayer({
  slide,
  index,
  total,
  status,
  isSelected,
  fadeMs,
  onLoaded,
}: HeroSlideLayerProps) {
  const {
    src,
    alt,
    objectPosition = "50% 30%",
    mobileObjectPosition,
  } = slide.image;

  const isFirst = index === 0;

  useEffect(() => {
    const id = window.setTimeout(() => onLoaded(index), LOAD_FAILSAFE_MS);

    return () => window.clearTimeout(id);
  }, [index, onLoaded]);

  function handleLoad(event: SyntheticEvent<HTMLImageElement>) {
    const img = event.currentTarget;

    const decoded =
      typeof img.decode === "function"
        ? img.decode().catch(() => undefined)
        : Promise.resolve();

    void decoded.then(() => onLoaded(index));
  }

  const imageStyle = {
    "--pos-wide": objectPosition,
    "--pos-narrow": mobileObjectPosition ?? objectPosition,
    objectPosition: "var(--pos)",
  } as CSSProperties;

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}`}
      aria-hidden={!isSelected}
      className={`absolute inset-0 transition-opacity ease-in-out ${
        LAYER_Z[status]
      } ${status === "idle" ? "opacity-0" : "opacity-100"}`}
      style={{
        transitionDuration: status === "incoming" ? `${fadeMs}ms` : "0ms",
      }}
    >
      {/* Fashion Image */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) calc(100vw - 4rem), (min-width: 640px) calc(100vw - 2.5rem), calc(100vw - 1.5rem)"
        quality={85}
        loading="eager"
        fetchPriority={isFirst ? "high" : "auto"}
        onLoad={handleLoad}
        onError={() => onLoaded(index)}
        className="object-cover [--pos:var(--pos-narrow)] sm:[--pos:var(--pos-wide)]"
        style={imageStyle}
      />

      {/* Subtle Bottom Scrim */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(25,18,22,0.48)_0%,rgba(25,18,22,0.16)_35%,transparent_72%)]"
      />

      {/* Editorial Heading */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-6 pb-9 sm:p-10 sm:pb-12 lg:p-14 lg:pb-16 xl:p-16 xl:pb-[4.5rem]">
        <h2 className="max-w-[90%] font-serif text-[clamp(2rem,4.2vw,4.5rem)] font-normal leading-[0.98] tracking-[-0.035em] text-[#F8F2EA] sm:max-w-[75%] lg:max-w-[65%]">
          {slide.heading}
        </h2>
      </div>
    </div>
  );
});

/* --------------------------------------------------------------------------
   Hero
   -------------------------------------------------------------------------- */

export function Hero({
  slides = DEFAULT_HERO_SLIDES,
  autoplayInterval = DEFAULT_AUTOPLAY_MS,
}: HeroProps) {
  const reduceMotion = useReducedMotion() ?? false;

  const count = slides.length;
  const interval = Math.max(MIN_AUTOPLAY_MS, autoplayInterval);
  const fadeMs = reduceMotion ? 0 : FADE_MS;

  const [state, dispatch] = useReducer(carouselReducer, INITIAL_STATE);

  const [isHovered, setIsHovered] = useState(false);
  const [isKeyboardFocused, setIsKeyboardFocused] = useState(false);

  const { selected, base, incoming } = state;

  const isPaused = isHovered || isKeyboardFocused;

  const handleLoaded = useCallback((index: number) => {
    dispatch({
      type: "loaded",
      index,
    });
  }, []);

  /* Complete current transition */

  useEffect(() => {
    if (incoming === null) return;

    const id = window.setTimeout(
      () => dispatch({ type: "complete" }),
      fadeMs + SETTLE_MS,
    );

    return () => window.clearTimeout(id);
  }, [incoming, fadeMs]);

  /* Autoplay */

  useEffect(() => {
    if (isPaused || reduceMotion || count < 2) return;

    const id = window.setTimeout(
      () =>
        dispatch({
          type: "select",
          index: (selected + 1) % count,
        }),
      interval,
    );

    return () => window.clearTimeout(id);
  }, [isPaused, reduceMotion, count, interval, selected]);

  if (count === 0) return null;

  /* Interaction handlers */

  function handlePointerEnter(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse") {
      setIsHovered(true);
    }
  }

  function handlePointerLeave(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse") {
      setIsHovered(false);
    }
  }

  function handleFocus(event: FocusEvent<HTMLElement>) {
    if (event.target.matches(":focus-visible")) {
      setIsKeyboardFocused(true);
    }
  }

  function handleBlur(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsKeyboardFocused(false);
    }
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured fashion images"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="relative mx-3 mb-2 mt-3 sm:mx-5 sm:mb-5 sm:mt-5 lg:mx-8 lg:mb-8 lg:mt-8"
    >
      {/* Hero Image Frame */}

      <div
        aria-live={isPaused ? "polite" : "off"}
        className="relative isolate aspect-[4/5] max-h-[34rem] w-full overflow-hidden rounded-2xl bg-warm-200 sm:aspect-[4/3] sm:max-h-[36rem] sm:rounded-3xl lg:aspect-[2/1] lg:max-h-[min(44rem,calc(100svh_-_var(--header-height,4.5rem)_-_4rem))] lg:min-h-[30rem]"
      >
        {slides.map((slide, index) => {
          const status: LayerStatus =
            index === incoming ? "incoming" : index === base ? "base" : "idle";

          return (
            <HeroSlideLayer
              key={slide.id}
              slide={slide}
              index={index}
              total={count}
              status={status}
              isSelected={index === selected}
              fadeMs={fadeMs}
              onLoaded={handleLoaded}
            />
          );
        })}
      </div>

      {/* Slide Indicators */}

      <div
        role="group"
        aria-label="Choose image"
        className="mt-1.5 flex items-center justify-center sm:pointer-events-none sm:absolute sm:inset-x-0 sm:bottom-5 sm:mt-0 lg:bottom-7"
      >
        {slides.map((slide, index) => {
          const isActive = index === selected;

          return (
            <button
              key={slide.id}
              type="button"
              onClick={() =>
                dispatch({
                  type: "select",
                  index,
                })
              }
              aria-label={`Show image ${index + 1} of ${count}`}
              aria-current={isActive ? "true" : undefined}
              className="group inline-flex h-8 items-center justify-center px-1.5 sm:pointer-events-auto sm:focus-visible:outline-warm"
            >
              <span
                aria-hidden="true"
                className={`block h-1.5 rounded-full transition-[width,background-color] duration-700 ease-out sm:shadow-[0_0_0_1px_rgb(41_36_38/0.12)] ${
                  isActive
                    ? "w-7 bg-burgundy sm:bg-warm"
                    : "w-1.5 bg-burgundy/30 group-hover:bg-burgundy/60 sm:bg-warm/55 sm:group-hover:bg-warm"
                }`}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
