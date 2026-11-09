"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before the animation starts. */
  delay?: number;
  /** Animate on page load instead of when scrolled into view. */
  immediate?: boolean;
};

/**
 * Quiet fade and short rise for text blocks.
 * Renders a plain div when the visitor prefers reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  immediate = false,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const visible = { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      {...(immediate
        ? { animate: visible }
        : {
            whileInView: visible,
            viewport: { once: true, margin: "0px 0px -10% 0px" },
          })}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Gentle curtain reveal for photography, with a slow settle from a slight zoom.
 * The wrapper keeps its own size, so nothing shifts while it animates.
 * The caller supplies positioning (relative / absolute) and sizing classes.
 */
export function ImageReveal({
  children,
  className = "",
  delay = 0,
}: Omit<RevealProps, "immediate">) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={`overflow-hidden ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.3, ease, delay }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
        transition={{ duration: 1.8, ease, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
