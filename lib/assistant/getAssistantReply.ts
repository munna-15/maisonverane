import type {
  AssistantReply,
  AssistantRequest,
} from "@/components/assistant/types";

/* ==========================================================================
   TEMPORARY MOCK. No AI is connected.

   Replace the body of `getAssistantReply` with a call to your own server
   route (keep the AI key on the server), for example:

     const response = await fetch("/api/assistant", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ messages }),
       signal,
     });
     if (!response.ok) throw new Error("Assistant request failed");
     return (await response.json()) as AssistantReply;

   Then set ASSISTANT_PREVIEW_NOTE to `undefined` (or delete it and its use
   in FloatingAssistant.tsx) so the "Preview mode" line disappears.
   ========================================================================== */

export const ASSISTANT_PREVIEW_NOTE: string | undefined =
  "Preview mode: replies are sample responses.";

function abortError(): DOMException {
  return new DOMException("Aborted", "AbortError");
}

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(abortError());
      return;
    }

    const timeoutId = window.setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    function onAbort() {
      window.clearTimeout(timeoutId);
      reject(abortError());
    }

    signal.addEventListener("abort", onAbort, { once: true });
  });
}

function matchIntent(input: string): AssistantReply {
  const text = input.toLowerCase();

  if (
    /\b(order|track|tracking|deliver|delivery|shipping|return|exchange|refund)/.test(
      text,
    )
  ) {
    return {
      text: "I can't look up individual orders just yet. Delivery, returns and exchange details are listed on every product page, and our team can help with anything about an existing order.",
      links: [{ label: "Contact us", href: "/contact" }],
    };
  }

  if (/\b(size|sizing|fit|measure|measurement)/.test(text)) {
    return {
      text: "Every product page has a Size Guide with bust, waist and hip measurements in centimetres. If you are between two sizes, we suggest choosing the larger one. Tell me which piece you are considering and I will point you to it.",
      links: [{ label: "Browse clothing", href: "/clothing" }],
    };
  }

  if (/\b(new|arrival|arrivals|latest|just in)\b/.test(text)) {
    return {
      text: "Our latest pieces include fluid satin, soft tailoring and fine knitwear, all selected for the season. Here is where to begin.",
      links: [
        { label: "Shop New In", href: "/new-in" },
        { label: "Satin Slip Dress", href: "/products/satin-slip-dress" },
      ],
    };
  }

  if (/\b(dress|dresses|gown|midi|occasion|evening)/.test(text)) {
    return {
      text: "For dresses, the Satin Slip Dress is a fluid, bias-cut favourite for evenings, and the Classic Midi Dress has a defined waist that works from the office to dinner. Is it for a particular occasion?",
      links: [
        { label: "Shop Dresses", href: "/dresses" },
        { label: "Satin Slip Dress", href: "/products/satin-slip-dress" },
        { label: "Classic Midi Dress", href: "/products/classic-midi-dress" },
      ],
    };
  }

  if (/^\s*(hi|hello|hey|salam|assalamu)/.test(text)) {
    return {
      text: "Hello, and welcome. I can help you find a dress, explore new arrivals or choose a size. What would you like to start with?",
    };
  }

  return {
    text: "I would be glad to help. Could you tell me a little more, such as the occasion, the piece you have in mind or your size? In the meantime, you can browse the full collection.",
    links: [{ label: "Browse clothing", href: "/clothing" }],
  };
}

export async function getAssistantReply({
  messages,
  signal,
}: AssistantRequest): Promise<AssistantReply> {
  // Simulated "thinking" time so the typing indicator is visible
  await wait(900 + Math.random() * 500, signal);

  const lastUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");

  return matchIntent(lastUserMessage?.text ?? "");
}
