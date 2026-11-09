export type ChatRole = "assistant" | "user";

export interface ChatLink {
  readonly label: string;
  readonly href: string;
}

export interface ChatMessageData {
  readonly id: string;
  readonly role: ChatRole;
  readonly text: string;
  /** Optional internal links shown under an assistant message */
  readonly links?: readonly ChatLink[];
}

/** What the reply handler receives (the full conversation so far) */
export interface AssistantRequest {
  readonly messages: readonly ChatMessageData[];
  readonly signal: AbortSignal;
}

/** What the reply handler returns */
export interface AssistantReply {
  readonly text: string;
  readonly links?: readonly ChatLink[];
}
