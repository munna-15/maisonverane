"use client";

import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessage, TypingIndicator } from "./ChatMessage";
import type { ChatMessageData } from "./types";

const QUICK_SUGGESTIONS = [
  "Discover New Arrivals",
  "Find a Dress",
  "Size Guide",
  "Order Assistance",
] as const;

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface ChatWindowProps {
  /** DOM id, referenced by the launcher's aria-controls */
  id: string;
  messages: readonly ChatMessageData[];
  isReplying: boolean;
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: (text: string) => void;
  /** Close and return focus to the launcher */
  onClose: () => void;
  /** Close without moving focus (used when following a link) */
  onNavigate: () => void;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  note?: string;
}

export function ChatWindow({
  id,
  messages,
  isReplying,
  draft,
  onDraftChange,
  onSend,
  onClose,
  onNavigate,
  inputRef,
  note,
}: ChatWindowProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  const showSuggestions = messages.length === 1 && !isReplying;

  /* On open: focus the field on devices with a fine pointer. On touch devices,
     focus the panel instead so the on-screen keyboard doesn't jump up. */
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (finePointer) inputRef.current?.focus({ preventScroll: true });
    else panelRef.current?.focus({ preventScroll: true });
  }, [inputRef]);

  /* Keep the newest message in view (instant on open, smooth afterwards) */
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    element.scrollTo({
      top: element.scrollHeight,
      behavior: reduceMotion || !hasScrolledRef.current ? "auto" : "smooth",
    });
    hasScrolledRef.current = true;
  }, [messages.length, isReplying, reduceMotion]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
    }
  }

  return (
    <>
      {/* Backdrop: small screens only (the desktop panel doesn't block the page) */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 z-[54] bg-ink/30 sm:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.3 }}
        onClick={onClose}
      />

      <motion.div
        ref={panelRef}
        id={id}
        role="dialog"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="fixed bottom-0 z-[55] flex h-[min(82dvh,40rem)] w-full flex-col overflow-hidden rounded-t-xl border-t border-champagne/40 bg-warm text-ink outline-none max-sm:inset-x-0 sm:bottom-24 sm:right-6 sm:h-[min(560px,calc(100dvh-8rem))] sm:w-[min(390px,calc(100vw-3rem))] sm:rounded-lg sm:border sm:border-warm-300"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : 32 }}
        transition={{ duration: reduceMotion ? 0 : 0.45, ease: EASE }}
      >
        {/* Header */}
        <header className="on-dark flex shrink-0 items-center justify-between gap-4 bg-burgundy px-5 py-4 text-warm">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="font-serif text-xl font-medium leading-tight tracking-[0.01em]"
            >
              Maison Vérane Assistant
            </h2>
            <p className="mt-1 text-[0.625rem] font-medium uppercase leading-none tracking-[0.22em] text-champagne">
              Personal Shopping Companion
            </p>
            <p className="mt-2 flex items-center gap-2 text-xs text-warm/80">
              <span aria-hidden="true" className="relative inline-flex size-2">
                <span className="absolute inset-0 rounded-full bg-champagne motion-safe:animate-ping motion-safe:opacity-60" />
                <span className="relative size-2 rounded-full bg-champagne" />
              </span>
              Online
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
            className="-mr-3 inline-flex size-11 shrink-0 items-center justify-center text-warm transition-colors duration-300 hover:text-champagne"
          >
            <X aria-hidden="true" strokeWidth={1.5} className="size-5" />
          </button>
        </header>

        {/* Conversation */}
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6"
        >
          <div
            role="log"
            aria-label="Conversation"
            aria-live="polite"
            aria-relevant="additions"
            className="space-y-5"
          >
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onNavigate={onNavigate}
              />
            ))}
            {isReplying ? <TypingIndicator /> : null}
          </div>

          {showSuggestions ? (
            <div role="group" aria-label="Suggested questions" className="mt-6">
              <p className="text-[0.625rem] font-medium uppercase tracking-[0.22em] text-ink-muted">
                Suggestions
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {QUICK_SUGGESTIONS.map((suggestion) => (
                  <li key={suggestion}>
                    <button
                      type="button"
                      onClick={() => onSend(suggestion)}
                      className="border border-champagne/80 px-3.5 py-2.5 text-sm tracking-[0.02em] text-ink transition-colors duration-300 hover:border-burgundy hover:bg-burgundy hover:text-warm focus-visible:border-burgundy focus-visible:bg-burgundy focus-visible:text-warm"
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <ChatInput
          value={draft}
          onChange={onDraftChange}
          onSubmit={() => onSend(draft)}
          isBusy={isReplying}
          inputRef={inputRef}
          note={note}
        />
      </motion.div>
    </>
  );
}
