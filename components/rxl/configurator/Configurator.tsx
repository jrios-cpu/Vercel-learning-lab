"use client";

import { useMemo, useReducer, useRef, useState } from "react";
import { getAttribution } from "@/lib/rxl/analytics/attribution";
import { trackAnalytics } from "@/lib/rxl/analytics/client";
import { buildQuotePayload } from "@/lib/rxl/configurator/payload";
import type { Product } from "@/lib/rxl/types/catalog";
import { CONFIGURATOR_STEPS, canAdvance, configuratorReducer, initialConfiguratorState } from "./configuratorReducer";

const APPLICATIONS = ["Data center white space", "Network / IDF", "Colocation", "High-density liquid cooling", "Retrofit / expansion"];
const ACCESSORIES = ["Cable management", "Blanking / airflow kit", "Containment transition kit", "Quick disconnect kit"];

export function Configurator({ products, initialProduct }: { products: Product[]; initialProduct?: Product | null }) {
  const [state, dispatch] = useReducer(configuratorReducer, { ...initialConfiguratorState, ...(initialProduct ? { productLine: initialProduct.series, partNumbers: [initialProduct.partNumber], selections: initialProduct.finish ? { finish: initialProduct.finish } : {} } : {}) });
  const [contact, setContact] = useState({ name: "", email: "", company: "" });
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const lines = useMemo(() => [...new Set(products.map((product) => product.series))].sort(), [products]);
  const lineProducts = useMemo(() => products.filter((product) => product.series === state.productLine), [products, state.productLine]);
  const selectedProduct = products.find((product) => state.partNumbers.includes(product.partNumber));
  const next = () => { if (canAdvance(state)) { trackAnalytics("configurator_step", { step: state.step, direction: "next" }); dispatch({ type: "NEXT" }); } };
  const previous = () => { trackAnalytics("configurator_step", { step: state.step, direction: "back" }); dispatch({ type: "BACK" }); };

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busyRef.current) return;
    if (!contact.name.trim() || !contact.email.trim() || !state.partNumbers.length) { setStatus("Complete your name, work email, and product selection."); return; }
    busyRef.current = true; setBusy(true); setStatus("Submitting representative quote request…");
    const controller = new AbortController(); const timeout = window.setTimeout(() => controller.abort(), 8000);
    try {
      const payload = { ...buildQuotePayload(state, { name: contact.name.trim(), email: contact.email.trim(), company: contact.company.trim() || null }, getAttribution()), website };
      const response = await fetch("/api/forms/quote", { method: "POST", headers: { "content-type": "application/json", "x-idempotency-key": window.crypto.randomUUID() }, body: JSON.stringify(payload), signal: controller.signal });
      const result = await response.json() as { ok?: boolean; quoteRef?: string; delivery?: string; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "Quote request could not be accepted.");
      trackAnalytics("quote_submit", { quoteRef: result.quoteRef ?? null, delivery: result.delivery ?? "not-configured" });
      setStatus(`Request accepted as ${result.quoteRef}. Delivery is not configured yet.`);
    } catch (error) { setStatus(error instanceof DOMException && error.name === "AbortError" ? "Request timed out. Try again." : error instanceof Error ? error.message : "Network error. Try again."); }
    finally { window.clearTimeout(timeout); busyRef.current = false; setBusy(false); }
  }

  return <form className="rxl-configurator" onSubmit={submit}><div className="rxl-config-main"><ol className="rxl-config-steps" aria-label="Configurator progress">{CONFIGURATOR_STEPS.map((label, index) => <li className={state.step === index + 1 ? "active" : state.step > index + 1 ? "done" : ""} key={label}><span>{index + 1}</span>{label}</li>)}</ol><section className="rxl-config-panel"><span className="rxl-eyebrow">Step {state.step} of 5</span>{state.step === 1 && <><h2>Where will this system work?</h2><div className="rxl-choice-grid">{APPLICATIONS.map((application) => <label key={application}><input type="radio" name="application" checked={state.application === application} onChange={() => dispatch({ type: "SET_APPLICATION", value: application })} /><span>{application}</span></label>)}</div></>}{state.step === 2 && <><h2>Select a product line.</h2><label className="rxl-field"><span>Product line</span><select value={state.productLine} onChange={(event) => dispatch({ type: "SET_PRODUCT_LINE", value: event.target.value })}><option value="">Choose a line</option>{lines.map((line) => <option key={line}>{line}</option>)}</select></label><label className="rxl-field"><span>Representative product</span><select value={state.partNumbers[0] ?? ""} disabled={!state.productLine} onChange={(event) => dispatch({ type: "SET_PART_NUMBER", value: event.target.value })}><option value="">Choose a product</option>{lineProducts.map((product) => <option value={product.partNumber} key={product.partNumber}>{product.partNumber} — {product.title}</option>)}</select></label></>}{state.step === 3 && <><h2>Set the working configuration.</h2><label className="rxl-field"><span>Finish / option summary</span><input maxLength={120} value={state.selections.finish ?? selectedProduct?.finish ?? ""} onChange={(event) => dispatch({ type: "SET_SELECTION", key: "finish", value: event.target.value })} /></label><label className="rxl-field"><span>Quantity</span><input type="number" min="1" max="100000" value={state.quantity} onChange={(event) => dispatch({ type: "SET_QUANTITY", value: Number(event.target.value) })} /></label><p className="rxl-config-hint">Configuration fields are representative until the Epicor/Sanity product model is connected.</p></>}{state.step === 4 && <><h2>Add project accessories.</h2><div className="rxl-choice-grid">{ACCESSORIES.map((accessory) => <label key={accessory}><input type="checkbox" checked={state.accessories.includes(accessory)} onChange={() => dispatch({ type: "TOGGLE_ACCESSORY", value: accessory })} /><span>{accessory}</span></label>)}</div><p className="rxl-config-hint">Accessories are optional representative choices.</p></>}{state.step === 5 && <><h2>Project details.</h2><div className="rxl-form-grid"><label className="rxl-field"><span>Name</span><input required maxLength={80} value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} /></label><label className="rxl-field"><span>Work email</span><input required type="email" maxLength={254} value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} /></label><label className="rxl-field"><span>Company</span><input maxLength={120} value={contact.company} onChange={(event) => setContact({ ...contact, company: event.target.value })} /></label><label className="rxl-field"><span>Target timeline</span><input maxLength={120} value={state.targetTimeline} onChange={(event) => dispatch({ type: "SET_TIMELINE", value: event.target.value })} /></label><label className="rxl-field rxl-field-wide"><span>Project notes</span><textarea maxLength={3000} rows={5} value={state.notes} onChange={(event) => dispatch({ type: "SET_NOTES", value: event.target.value })} /></label><label className="rxl-honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label></div><div className="rxl-config-api-note">Preview acknowledgment only. No CRM, email delivery, pricing, or inventory workflow is connected.</div></>}<div className="rxl-config-nav"><button className="rxl-btn rxl-btn-outline" type="button" disabled={state.step === 1} onClick={previous}>Back</button>{state.step < 5 ? <button className="rxl-btn rxl-btn-primary" type="button" disabled={!canAdvance(state)} onClick={next}>Continue</button> : <button className="rxl-btn rxl-btn-primary" type="submit" disabled={busy}>{busy ? "Submitting…" : "Submit project request"}</button>}</div><p className="rxl-form-status" role="status" aria-live="polite">{status}</p></section></div><aside className="rxl-config-summary" aria-label="Configuration summary"><span>Project summary</span><h3>{state.productLine || "Product line pending"}</h3><dl><div><dt>Application</dt><dd>{state.application || "—"}</dd></div><div><dt>Part number</dt><dd>{state.partNumbers[0] || "—"}</dd></div><div><dt>Quantity</dt><dd>{state.quantity}</dd></div><div><dt>Accessories</dt><dd>{state.accessories.length || "—"}</dd></div></dl><p>Representative Preview configuration. Commercial validation happens only after real systems are connected.</p></aside></form>;
}
