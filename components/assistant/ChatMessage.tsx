"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { memo } from "react";
import type { ChatMessageData } from "./types";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const speakerLabel =
  "mb-1.5 text-[0.625rem] font-medium uppercase leading-none tracking-[0.22em] text-wine";

interface ChatMessageProps {
  message: ChatMessageData;
  /** Called when an internal link inside the message is followed */
  onNavigate: () => void;
}

export const ChatMessage = memo(function ChatMessage({
  message,
  onNavigate,
}: ChatMessageProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const isUser = message.role === "user";

  return (
    <motion.div
      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
      initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE }}
    >
      <span className="sr-only">
        {isUser ? "You said:" : "Assistant said:"}
      </span>

      {isUser ? (
        <div className="max-w-[85%] rounded-lg rounded-br-sm bg-burgundy px-4 py-3 text-[0.9375rem] leading-relaxed text-warm">
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        </div>
      ) : (
        <div className="max-w-[92%]">
          <p aria-hidden="true" className={speakerLabel}>
            Maison Vérane
          </p>
          <div className="border-l border-champagne pl-4 text-[0.9375rem] leading-[1.7] text-ink">
            <p className="whitespace-pre-wrap break-words">{message.text}</p>

            {message.links && message.links.length > 0 ? (
              <ul className="mt-3 flex flex-col items-start gap-1">
                {message.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onNavigate}
                      className="inline-block py-1 text-sm font-medium text-ink underline decoration-champagne decoration-1 underline-offset-[5px] transition-colors duration-300 hover:text-wine hover:decoration-wine focus-visible:text-wine"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      )}
    </motion.div>
  );
});

/* --------------------------------------------------------------------------
   Typing indicator
   -------------------------------------------------------------------------- */
export function TypingIndicator() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className="flex flex-col items-start">
      <p aria-hidden="true" className={speakerLabel}>
        Maison Vérane
      </p>
      <div className="flex h-7 items-center gap-1.5 border-l border-champagne pl-4">
        <span className="sr-only">Maison Vérane Assistant is typing</span>
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            aria-hidden="true"
            className="size-1.5 rounded-full bg-wine"
            animate={
              reduceMotion ? { opacity: 0.6 } : { opacity: [0.25, 1, 0.25] }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 1.2,
                    repeat: Infinity,
                    delay: dot * 0.18,
                    ease: "easeInOut",
                  }
            }
          />
        ))}
      </div>
    </div>
  );
}
