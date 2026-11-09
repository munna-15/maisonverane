"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  ASSISTANT_PREVIEW_NOTE,
  getAssistantReply,
} from "@/lib/assistant/getAssistantReply";
import { ChatWindow } from "./ChatWindow";
import type { ChatMessageData } from "./types";

const WELCOME_MESSAGE: ChatMessageData = {
  id: "welcome",
  role: "assistant",
  text: "Welcome to Maison Vérane. I'm here to help you discover pieces that feel like you. What can I help you find today?",
};

const FALLBACK_REPLY =
  "I'm sorry, I couldn't respond just now. Please try again in a moment.";

export function FloatingAssistant() {
  const reduceMotion = useReducedMotion() ?? false;
  const panelId = useId();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<readonly ChatMessageData[]>([
    WELCOME_MESSAGE,
  ]);
  const [draft, setDraft] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<readonly ChatMessageData[]>(messages);
  const pendingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const idCounterRef = useRef(0);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  /* Cancel any in-flight reply if the assistant is unmounted */
  useEffect(() => () => abortRef.current?.abort(), []);

  const nextId = useCallback((): string => {
    idCounterRef.current += 1;
    return `message-${idCounterRef.current}`;
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || pendingRef.current) return;

      pendingRef.current = true;
      const userMessage: ChatMessageData = { id: nextId(), role: "user", text };
      const conversation = [...messagesRef.current, userMessage];

      setMessages(conversation);
      setDraft("");
      setIsReplying(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const reply = await getAssistantReply({
          messages: conversation,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;

        setMessages((current) => [
          ...current,
          {
            id: nextId(),
            role: "assistant",
            text: reply.text,
            links: reply.links,
          },
        ]);
      } catch {
        if (controller.signal.aborted) return;
        setMessages((current) => [
          ...current,
          { id: nextId(), role: "assistant", text: FALLBACK_REPLY },
        ]);
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
          pendingRef.current = false;
          setIsReplying(false);
        }
      }
    },
    [nextId],
  );

  const closeAndRestoreFocus = useCallback(() => {
    setIsOpen(false);
    launcherRef.current?.focus({ preventScroll: true });
  }, []);

  const closeForNavigation = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <ChatWindow
            key="assistant-window"
            id={panelId}
            messages={messages}
            isReplying={isReplying}
            draft={draft}
            onDraftChange={setDraft}
            onSend={send}
            onClose={closeAndRestoreFocus}
            onNavigate={closeForNavigation}
            inputRef={inputRef}
            note={ASSISTANT_PREVIEW_NOTE}
          />
        ) : null}
      </AnimatePresence>

      {/* Launcher */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => (isOpen ? closeAndRestoreFocus() : setIsOpen(true))}
        aria-label={
          isOpen
            ? "Close Maison Vérane Assistant"
            : "Open Maison Vérane Assistant"
        }
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        aria-haspopup="dialog"
        className="on-dark fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 inline-flex size-14 items-center justify-center rounded-full bg-burgundy text-warm shadow-[0_8px_24px_-10px_rgb(66_28_42/0.55)] transition-colors duration-300 hover:bg-wine focus-visible:bg-wine sm:bottom-6 sm:right-6"
      >
        {/* Subtle champagne ring */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-1 rounded-full border border-champagne/70"
        />

        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              aria-hidden="true"
              className="inline-flex"
              initial={{ opacity: 0, rotate: reduceMotion ? 0 : -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: reduceMotion ? 0 : 45 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            >
              <X strokeWidth={1.5} className="size-5" />
            </motion.span>
          ) : (
            <motion.span
              key="monogram"
              aria-hidden="true"
              className="font-serif text-xl font-light leading-none tracking-[0.04em]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            >
              MV
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </>
  );
}
