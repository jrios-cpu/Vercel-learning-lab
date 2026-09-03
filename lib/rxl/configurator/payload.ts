import type { ConfiguratorState } from "@/components/rxl/configurator/configuratorReducer";

export type QuoteContact = { name: string; email: string; company?: string | null };
export type Attribution = { source: string | null; medium: string | null; campaign: string | null; landingPage: string; sessionId: string };
export type QuotePayload = {
  quoteRef: string;
  submittedAt: string;
  contact: QuoteContact;
  application: string;
  productLine: string;
  configuration: { selections: Record<string, string>; accessories: string[]; partNumbers: string[] };
  quantity: number;
  targetTimeline: string | null;
  notes: string | null;
  attribution: Attribution;
  routing: { status: "unconfigured" };
};

function stableRef(state: ConfiguratorState, contact: QuoteContact) {
  const source = [contact.email, state.application, state.productLine, ...state.partNumbers, String(state.quantity)].join("|");
  let hash = 5381;
  for (let index = 0; index < source.length; index += 1) hash = ((hash << 5) + hash) ^ source.charCodeAt(index);
  return `RXL-${(hash >>> 0).toString(36).toUpperCase().padStart(7, "0").slice(0, 7)}`;
}

export function buildQuotePayload(state: ConfiguratorState, contact: QuoteContact, attribution: Attribution): QuotePayload {
  return {
    quoteRef: stableRef(state, contact),
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
