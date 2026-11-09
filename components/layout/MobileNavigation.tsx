"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Heart, Menu, User, X, type LucideIcon } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */
export interface NavLink {
  readonly label: string;
  readonly href: string;
}

interface MobileNavigationProps {
  links: readonly NavLink[];
}

interface SecondaryLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

/* --------------------------------------------------------------------------
   Constants
   -------------------------------------------------------------------------- */
const SECONDARY_LINKS: readonly SecondaryLink[] = [
  { label: "Account", href: "/account", icon: User },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FOCUSABLE_SELECTOR = "a[href], button:not([disabled])";
const DESKTOP_QUERY = "(min-width: 1024px)"; // matches Tailwind `lg`

const wordmarkClasses =
  "whitespace-nowrap text-center font-serif text-[1.375rem] font-medium leading-none tracking-[0.05em] sm:text-[1.75rem]";

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */
export function MobileNavigation({ links }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const closeMenu = useCallback((restoreFocus = true) => {
    setIsOpen(false);
    if (restoreFocus) menuButtonRef.current?.focus();
  }, []);

  /* Lock background scroll while open (compensates for scrollbar width) */
  useEffect(() => {
    if (!isOpen) return;

    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [isOpen]);

  /* Initial focus, Escape to close, and Tab focus trap */
  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }
      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!dialog.contains(active)) {
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
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeMenu]);

  /* Close if the viewport grows to desktop (e.g. tablet rotation) */
  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);

    function handleChange(event: MediaQueryListEvent) {
      if (event.matches) setIsOpen(false);
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  /* Motion definitions (respect reduced-motion preference) */
  const listVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: reduceMotion ? 0 : 0.12,
        staggerChildren: reduceMotion ? 0 : 0.06,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.5, ease: EASE },
    },
  };

  return (
    <>
      <button
        ref={menuButtonRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? dialogId : undefined}
        className="-ml-3 inline-flex size-11 items-center justify-center text-ink transition-colors duration-300 hover:text-wine lg:hidden"
      >
        <Menu aria-hidden="true" strokeWidth={1.5} className="size-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-navigation"
            ref={dialogRef}
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE }}
            className="on-dark fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-burgundy text-warm lg:hidden"
          >
            {/* Top bar mirrors the header so the close button sits exactly where the menu button was */}
            <div className="shrink-0 border-b border-warm/15">
              <div className="container-editorial">
                <div className="grid h-(--header-height) grid-cols-[1fr_auto_1fr] items-center">
                  <div className="flex items-center justify-start">
                    <button
                      ref={closeButtonRef}
                      type="button"
                      onClick={() => closeMenu()}
                      aria-label="Close menu"
                      className="-ml-3 inline-flex size-11 items-center justify-center text-warm transition-colors duration-300 hover:text-champagne"
                    >
                      <X
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className="size-5"
                      />
                    </button>
                  </div>

                  <Link
                    href="/"
                    aria-label="Maison Vérane, home"
                    onClick={() => closeMenu(false)}
                    className={`${wordmarkClasses} text-warm`}
                  >
                    Maison Vérane
                  </Link>

                  <span aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* Navigation + secondary links */}
            <motion.div
              className="container-editorial flex flex-1 flex-col pb-8 pt-4"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              <nav aria-label="Mobile primary">
                <ul>
                  {links.map((link, index) => (
                    <motion.li
                      key={link.href}
                      variants={itemVariants}
                      className="border-b border-warm/15"
                    >
                      <Link
                        href={link.href}
                        onClick={() => closeMenu(false)}
                        className="group flex items-baseline justify-between py-5"
                      >
                        <span className="font-serif text-[clamp(2.25rem,9.5vw,3.5rem)] font-light leading-none tracking-[-0.01em] transition-colors duration-300 group-hover:text-champagne group-focus-visible:text-champagne">
                          {link.label}
                        </span>
                        <span
                          aria-hidden="true"
                          className="text-xs tabular-nums tracking-[0.22em] text-champagne"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <motion.div variants={itemVariants} className="mt-auto pt-10">
                <ul className="flex items-center gap-8">
                  {SECONDARY_LINKS.map(({ label, href, icon: Icon }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => closeMenu(false)}
                        className="inline-flex items-center gap-2.5 text-sm tracking-[0.04em] text-warm transition-colors duration-300 hover:text-champagne"
                      >
                        <Icon
                          aria-hidden="true"
                          strokeWidth={1.5}
                          className="size-5"
                        />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-xs uppercase tracking-[0.22em] text-warm/60">
                  Contemporary Womenswear
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
