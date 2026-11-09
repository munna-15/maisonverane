"use client";

import { SendHorizontal } from "lucide-react";
import {
  useEffect,
  type FormEvent,
  type KeyboardEvent,
  type RefObject,
} from "react";

const MAX_LENGTH = 500;

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Called with no arguments; the parent reads the current draft */
  onSubmit: () => void;
  /** True while the assistant is replying: typing is allowed, sending is not */
  isBusy: boolean;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  /** Optional small note under the field */
  note?: string;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isBusy,
  inputRef,
  note,
}: ChatInputProps) {
  const isEmpty = value.trim().length === 0;
  const canSend = !isEmpty && !isBusy;

  /* Auto-grow the textarea up to its max height */
  useEffect(() => {
    const element = inputRef.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [value, inputRef]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSend) onSubmit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends; Shift+Enter inserts a new line; ignore Enter while composing (IME)
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }
    event.preventDefault();
    if (canSend) onSubmit();
  }

  return (
    <div className="shrink-0 border-t border-warm-200 bg-warm px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <label htmlFor="assistant-message" className="sr-only">
          Message Maison Vérane Assistant
        </label>
        <textarea
          id="assistant-message"
          ref={inputRef}
          rows={1}
          value={value}
          maxLength={MAX_LENGTH}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about pieces, sizes or orders…"
          enterKeyHint="send"
          autoComplete="off"
          className="max-h-28 min-h-11 w-full resize-none border-0 border-b border-warm-300 bg-transparent px-0 py-2.5 text-base leading-snug text-ink outline-none transition-colors duration-300 placeholder:text-ink-muted/70 focus:border-wine"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className="inline-flex size-11 shrink-0 items-center justify-center bg-burgundy text-warm transition-colors duration-300 hover:bg-wine focus-visible:bg-wine disabled:cursor-not-allowed disabled:bg-warm-200 disabled:text-ink-muted"
        >
          <SendHorizontal
            aria-hidden="true"
            strokeWidth={1.5}
            className="size-5"
          />
        </button>
      </form>

      {note ? (
        <p className="mt-2 text-[0.6875rem] leading-snug tracking-[0.03em] text-ink-muted">
          {note}
        </p>
      ) : null}
    </div>
  );
}
