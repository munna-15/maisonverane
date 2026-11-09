"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Search,
  ShoppingBag,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { MobileNavigation, type NavLink } from "./MobileNavigation";
import { useCart } from "@/components/cart/CartProvider";

const NAV_LINKS: readonly NavLink[] = [
  { label: "New In", href: "/new-in" },
  { label: "Clothing", href: "/clothing" },
  { label: "Dresses", href: "/dresses" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

interface IconLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  desktopOnly?: boolean;
}

function IconLink({
  href,
  label,
  icon: Icon,
  desktopOnly = false,
}: IconLinkProps) {
  const display = desktopOnly ? "hidden lg:inline-flex" : "inline-flex";

  return (
    <Link
      href={href}
      aria-label={label}
      className={`${display} size-11 items-center justify-center text-ink transition-colors duration-300 hover:text-wine`}
    >
      <Icon aria-hidden="true" strokeWidth={1.5} className="size-5" />
    </Link>
  );
}

function BagLink() {
  const { itemCount } = useCart();

  const label =
    itemCount > 0
      ? `Shopping bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}`
      : "Shopping bag";

  return (
    <Link
      href="/cart"
      aria-label={label}
      className="relative inline-flex size-11 items-center justify-center text-ink transition-colors duration-300 hover:text-wine"
    >
      <ShoppingBag aria-hidden="true" strokeWidth={1.5} className="size-5" />

      {itemCount > 0 && (
        <span
          aria-hidden="true"
          className="absolute right-0.5 top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-burgundy px-1 text-[0.625rem] font-medium leading-none tabular-nums text-warm"
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}

function DesktopNavigation({
  links,
  reduceMotion,
}: {
  links: readonly NavLink[];
  reduceMotion: boolean | null;
}) {
  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center gap-5 xl:gap-8">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group relative inline-flex whitespace-nowrap py-3 text-[0.9375rem] font-medium tracking-[0.015em] text-ink transition-colors duration-500 hover:text-burgundy focus-visible:text-burgundy"
            >
              <span className="relative z-10">{link.label}</span>

              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-1 h-px origin-left scale-x-0 bg-champagne transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />

              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-1 h-px origin-right scale-x-100 bg-burgundy/15 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-0 group-focus-visible:scale-x-0"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const wasSearchOpenRef = useRef(false);

  const reduceMotion = useReducedMotion();

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      wasSearchOpenRef.current = true;
      searchInputRef.current?.focus();
      return;
    }

    if (wasSearchOpenRef.current) {
      wasSearchOpenRef.current = false;
      searchButtonRef.current?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeSearch();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen, closeSearch]);

  const transition = {
    duration: reduceMotion ? 0 : 0.35,
    ease: EASE,
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-warm">
      <div className="container-editorial">
        <div className="relative h-[82px] lg:h-[104px]">
          {/* Normal header */}

          <motion.div
            aria-hidden={isSearchOpen}
            inert={isSearchOpen}
            animate={{
              opacity: isSearchOpen ? 0 : 1,
            }}
            transition={transition}
            className={`absolute inset-0 grid grid-cols-[1fr_auto_1fr] items-center ${
              isSearchOpen ? "pointer-events-none" : "pointer-events-auto"
            }`}
          >
            {/* Left navigation */}

            <div className="flex min-w-0 items-center justify-start">
              <MobileNavigation links={NAV_LINKS} />

              <DesktopNavigation
                links={NAV_LINKS}
                reduceMotion={reduceMotion}
              />
            </div>

            {/* Centre brand logo */}

            <Link
              href="/"
              aria-label="Maison Vérane, home"
              tabIndex={isSearchOpen ? -1 : 0}
              className="relative flex h-full min-w-0 items-center justify-center"
            >
              <Image
                src="/images/brand/logo.png"
                alt="Maison Vérane"
                width={600}
                height={225}
                priority
                sizes="(max-width: 639px) 190px, (max-width: 1023px) 230px, 300px"
                className="h-auto max-h-[66px] w-auto max-w-[175px] object-contain sm:max-h-[76px] sm:max-w-[230px] lg:max-h-[90px] lg:max-w-[300px]"
              />
            </Link>

            {/* Right utility icons */}

            <div className="-mr-2 flex items-center justify-end sm:-mr-3">
              <button
                ref={searchButtonRef}
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search"
                aria-expanded={isSearchOpen}
                className="inline-flex size-11 items-center justify-center text-ink transition-colors duration-300 hover:text-wine"
              >
                <Search
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-5"
                />
              </button>

              <IconLink
                href="/account"
                label="Account"
                icon={User}
                desktopOnly
              />

              <IconLink
                href="/wishlist"
                label="Wishlist"
                icon={Heart}
                desktopOnly
              />

              <BagLink />
            </div>
          </motion.div>

          {/* Search panel */}

          <motion.div
            aria-hidden={!isSearchOpen}
            inert={!isSearchOpen}
            animate={{
              opacity: isSearchOpen ? 1 : 0,
            }}
            transition={transition}
            className={`absolute inset-0 z-10 flex items-center ${
              isSearchOpen ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            <form
              action="/search"
              method="GET"
              role="search"
              className="flex w-full items-center gap-3"
            >
              <Search
                aria-hidden="true"
                strokeWidth={1.5}
                className="size-5 shrink-0 text-ink"
              />

              <input
                ref={searchInputRef}
                type="text"
                name="q"
                placeholder="What are you looking for?"
                aria-label="Search products"
                autoComplete="off"
                tabIndex={isSearchOpen ? 0 : -1}
                className="min-w-0 flex-1 bg-transparent py-3 font-sans text-base text-ink outline-none placeholder:text-ink/45 sm:text-lg"
              />

              <button
                type="button"
                onClick={closeSearch}
                aria-label="Close search"
                tabIndex={isSearchOpen ? 0 : -1}
                className="inline-flex size-11 shrink-0 items-center justify-center text-ink transition-colors duration-300 hover:text-wine"
              >
                <X aria-hidden="true" strokeWidth={1.5} className="size-5" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
