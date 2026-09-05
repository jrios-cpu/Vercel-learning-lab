import type { ConfiguratorState } from "@/components/rxl/configurator/configuratorReducer";
import type { Product } from "@/lib/rxl/types/catalog";

export type QuoteSource = "configurator" | "quick_rfq";
export type QuoteContact = { name: string; email: string; company?: string | null };
export type Attribution = { source: string | null; medium: string | null; campaign: string | null; landingPage: string; sessionId: string };
export type QuotePayload = {
  source: QuoteSource;
  quoteRef: string;
  submittedAt: string;
  contact: QuoteContact;
  application: string | null;
  productLine: string;
  configuration: { selections: Record<string, string>; accessories: string[]; partNumbers: string[] };
  quantity: number;
  targetTimeline: string | null;
  notes: string | null;
  attribution: Attribution;
  routing: { status: "unconfigured" };
};

export type QuickQuoteInput = {
  name: string;
  email: string;
  product: Product;
  quantity: number;
  notes: string;
};

function stableRef(parts: string[]) {
  const source = parts.join("|");
  let hash = 5381;
  for (let index = 0; index < source.length; index += 1) hash = ((hash << 5) + hash) ^ source.charCodeAt(index);
  return `RXL-${(hash >>> 0).toString(36).toUpperCase().padStart(7, "0").slice(0, 7)}`;
}

export function buildQuotePayload(state: ConfiguratorState, contact: QuoteContact, attribution: Attribution): QuotePayload {
  return {
    source: "configurator",
    quoteRef: stableRef(["configurator", contact.email, state.application, state.productLine, ...state.partNumbers, String(state.quantity)]),
    submittedAt: new Date().toISOString(),
    contact,
    application: state.application,
    productLine: state.productLine,
    configuration: { selections: { ...state.selections }, accessories: [...state.accessories], partNumbers: [...state.partNumbers] },
    quantity: state.quantity,
    targetTimeline: state.targetTimeline.trim() || null,
    notes: state.notes.trim() || null,
    attribution,
    routing: { status: "unconfigured" },
  };
}

export function buildQuickQuotePayload(input: QuickQuoteInput, attribution: Attribution): QuotePayload {
  return {
    source: "quick_rfq",
    quoteRef: stableRef(["quick_rfq", input.email, input.product.partNumber, String(input.quantity)]),
    submittedAt: new Date().toISOString(),
    contact: { name: input.name.trim(), email: input.email.trim(), company: null },
    application: null,
    productLine: input.product.series,
    configuration: { selections: {}, accessories: [], partNumbers: [input.product.partNumber] },
    quantity: input.quantity,
    targetTimeline: null,
    notes: input.notes.trim() || null,
    attribution,
    routing: { status: "unconfigured" },
  };
}
