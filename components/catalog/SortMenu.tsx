"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Check, ChevronDown } from "lucide-react";
import type { SortValue } from "@/lib/catalog/filters";

const SORT_OPTIONS: readonly {
  value: SortValue;
  label: string;
}[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

interface SortMenuProps {
  value: SortValue;
  onChange: (value: SortValue) => void;
}

export function SortMenu({ value, onChange }: SortMenuProps) {
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const listId = useId();

  const current =
    SORT_OPTIONS.find((option) => option.value === value) ?? SORT_OPTIONS[0]!;

  useEffect(() => {
    if (!open) return;

    listRef.current
      ?.querySelector<HTMLElement>('[aria-selected="true"]')
      ?.focus();

    function handlePointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  function closeAndRestore() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  function select(next: SortValue) {
    onChange(next);
    closeAndRestore();
  }

  function handleButtonKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function handleListKeyDown(event: ReactKeyboardEvent<HTMLUListElement>) {
    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [],
    );

    const index = items.indexOf(document.activeElement as HTMLElement);

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        items[(index + 1) % items.length]?.focus();
        break;

      case "ArrowUp":
        event.preventDefault();
        items[(index - 1 + items.length) % items.length]?.focus();
        break;

      case "Home":
        event.preventDefault();
        items[0]?.focus();
        break;

      case "End":
        event.preventDefault();
        items[items.length - 1]?.focus();
        break;

      case "Escape":
        event.preventDefault();
        closeAndRestore();
        break;

      case "Tab":
        setOpen(false);
        break;

      default:
        break;
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        onKeyDown={handleButtonKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        className="inline-flex h-11 items-center gap-2 text-sm tracking-[0.03em] text-ink transition-colors duration-300 hover:text-wine"
      >
        <span className="hidden text-ink-muted sm:inline">Sort by</span>

        <span className="font-medium">{current.label}</span>

        <ChevronDown
          aria-hidden="true"
          strokeWidth={1.5}
          className={`size-4 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Sort products"
          onKeyDown={handleListKeyDown}
          className="absolute right-0 top-full z-30 mt-1 min-w-56 border border-warm-300 bg-warm py-1.5"
        >
          {SORT_OPTIONS.map((option) => {
            const selected = option.value === value;

            return (
              <li
                key={option.value}
                role="option"
                aria-selected={selected}
                tabIndex={-1}
                onClick={() => select(option.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    select(option.value);
                  }
                }}
                className={`flex cursor-pointer items-center justify-between gap-6 px-4 py-2.5 text-sm tracking-[0.02em] outline-none transition-colors duration-200 hover:bg-warm-200 focus-visible:bg-warm-200 ${
                  selected ? "font-medium text-wine" : "text-ink"
                }`}
              >
                {option.label}

                {selected ? (
                  <Check
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-4"
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
