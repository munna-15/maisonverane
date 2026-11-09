"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageSquare, Phone, X } from "lucide-react";

const PHONE_NUMBER = "+8801792960160";
const WHATSAPP_NUMBER = "8801792960160";

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hello Maison Vérane! I would like to know more about your collection.",
)}`;

const ease = [0.22, 1, 0.36, 1] as const;

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const transition = reduceMotion ? { duration: 0 } : { duration: 0.35, ease };

  return (
    <div
      ref={containerRef}
      className="on-dark fixed bottom-[calc(max(1rem,env(safe-area-inset-bottom))+5rem)] right-[max(1rem,env(safe-area-inset-right))] z-40 flex flex-col items-end gap-3 sm:bottom-[5.75rem] sm:right-6"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={transition}
            className="flex flex-col items-end gap-3"
          >
            {/* Call */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...transition, delay: reduceMotion ? 0 : 0.04 }}
              className="flex items-center gap-3"
            >
              <span className="rounded-sm bg-ink px-3 py-2 text-xs tracking-[0.12em] text-warm shadow-lg">
                Call us
              </span>

              <a
                href={`tel:${PHONE_NUMBER}`}
                aria-label="Call Maison Vérane"
                onClick={() => setIsOpen(false)}
                className="on-dark relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-10px_rgba(0,0,0,0.4)] transition-colors duration-300 hover:bg-[#1DAF58] focus-visible:outline-white"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-1 rounded-full border border-white/45"
                />
                <Phone size={30} strokeWidth={2.2} />
              </a>
            </motion.div>

            {/* WhatsApp */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...transition, delay: reduceMotion ? 0 : 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="rounded-sm bg-ink px-3 py-2 text-xs tracking-[0.12em] text-warm shadow-lg">
                WhatsApp
              </span>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Maison Vérane on WhatsApp"
                onClick={() => setIsOpen(false)}
                className="on-dark relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-10px_rgba(0,0,0,0.4)] transition-colors duration-300 hover:bg-[#1DAF58] focus-visible:outline-white"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-1 rounded-full border border-white/45"
                />

                <svg
                  viewBox="0 0 32 32"
                  width="32"
                  height="32"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M16.02 3C8.85 3 3.02 8.82 3.02 15.98c0 2.29.6 4.53 1.74 6.5L3 29l6.68-1.73a12.95 12.95 0 0 0 6.34 1.62h.01c7.16 0 12.99-5.82 12.99-12.98A12.9 12.9 0 0 0 16.02 3Zm0 23.68h-.01a10.8 10.8 0 0 1-5.5-1.5l-.4-.24-3.97 1.03 1.06-3.87-.26-.4a10.72 10.72 0 0 1-1.65-5.72c0-5.94 4.83-10.77 10.78-10.77 2.88 0 5.59 1.12 7.63 3.16a10.7 10.7 0 0 1 3.15 7.62c0 5.95-4.84 10.77-10.78 10.77Zm5.91-8.06c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.5-.16-.7.16-.2.32-.8 1.05-.98 1.27-.18.21-.36.24-.68.08-.32-.16-1.35-.5-2.57-1.6-.95-.85-1.6-1.9-1.79-2.22-.18-.32-.02-.49.14-.65.14-.14.32-.36.48-.53.16-.18.21-.32.32-.53.1-.22.05-.4-.03-.56-.08-.16-.7-1.68-.97-2.3-.26-.6-.52-.52-.7-.53h-.6c-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.22 2.22 3.4 5.38 4.77.75.32 1.33.52 1.78.67.75.24 1.44.2 1.98.12.6-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37Z" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main launcher */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
        aria-label={isOpen ? "Close contact options" : "Open contact options"}
        aria-expanded={isOpen}
        className="on-dark relative inline-flex size-14 items-center justify-center rounded-full bg-burgundy text-warm shadow-[0_8px_24px_-10px_rgb(66_28_42/0.55)] transition-colors duration-300 hover:bg-wine focus-visible:bg-wine"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-1 rounded-full border border-champagne/70"
        />

        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: reduceMotion ? 0 : -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: reduceMotion ? 0 : 45 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            >
              <X size={22} strokeWidth={1.5} />
            </motion.span>
          ) : (
            <motion.span
              key="message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            >
              <MessageSquare size={22} strokeWidth={1.6} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
