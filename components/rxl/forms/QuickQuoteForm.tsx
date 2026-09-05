"use client";

import { useMemo, useRef, useState } from "react";
import { getAttribution } from "@/lib/rxl/analytics/attribution";
import { trackAnalytics } from "@/lib/rxl/analytics/client";
import { buildQuickQuotePayload } from "@/lib/rxl/configurator/payload";
import type { Product } from "@/lib/rxl/types/catalog";

type Values = { name: string; email: string; product: string; quantity: number; notes: string };
type Errors = Partial<Record<keyof Values, string>>;

export function QuickQuoteForm({ products, initialProduct }: { products: Product[]; initialProduct?: Product | null }) {
  const initialPartNumber = initialProduct?.partNumber ?? products[0]?.partNumber ?? "";
  const [values, setValues] = useState<Values>({ name: "", email: "", product: initialPartNumber, quantity: 1, notes: "" });
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const selectedProduct = useMemo(() => products.find((product) => product.partNumber === values.product) ?? null, [products, values.product]);

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function validate() {
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) next.email = "Enter a valid work email.";
    if (!selectedProduct) next.product = "Select a valid product.";
    if (!Number.isInteger(values.quantity) || values.quantity < 1 || values.quantity > 100000) next.quantity = "Quantity must be between 1 and 100000.";
    if (values.notes.trim().length < 8) next.notes = "Add at least 8 characters of project context.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busyRef.current || !validate() || !selectedProduct) return;
    busyRef.current = true;
    setBusy(true);
    setStatus("Creating quote request…");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    try {
      const payload = {
        ...buildQuickQuotePayload({ name: values.name, email: values.email, product: selectedProduct, quantity: values.quantity, notes: values.notes }, getAttribution()),
        website,
      };
      const response = await fetch("/api/forms/quote", {
        method: "POST",
        headers: { "content-type": "application/json", "x-idempotency-key": window.crypto.randomUUID() },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const result = await response.json() as { ok?: boolean; quoteRef?: string; delivery?: string; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "Quote request could not be accepted.");
      trackAnalytics("quote_submit", { source: "quick_rfq", quoteRef: result.quoteRef ?? null, delivery: result.delivery ?? "not-configured" });
      setStatus(`Request accepted as ${result.quoteRef}. Delivery is not configured yet.`);
    } catch (error) {
      setStatus(error instanceof DOMException && error.name === "AbortError" ? "Request timed out. Try again." : error instanceof Error ? error.message : "Network error. Try again.");
    } finally {
      window.clearTimeout(timeout);
      busyRef.current = false;
      setBusy(false);
    }
  }

  return (
    <form className="rxl-quick-quote-form" aria-label="Request a quote" onSubmit={submit} noValidate>
      <label className="rxl-field" htmlFor="rfq-name"><span>Name</span><input id="rfq-name" required maxLength={80} autoComplete="name" value={values.name} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "rfq-name-error" : undefined} onChange={(event) => update("name", event.target.value)} /></label>
      {errors.name && <p className="rxl-field-error" id="rfq-name-error">{errors.name}</p>}

      <label className="rxl-field" htmlFor="rfq-email"><span>Work email</span><input id="rfq-email" required type="email" maxLength={254} autoComplete="email" value={values.email} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "rfq-email-error" : undefined} onChange={(event) => update("email", event.target.value)} /></label>
      {errors.email && <p className="rxl-field-error" id="rfq-email-error">{errors.email}</p>}

      <label className="rxl-field" htmlFor="rfq-product"><span>Product</span><select id="rfq-product" required value={values.product} aria-invalid={Boolean(errors.product)} aria-describedby={errors.product ? "rfq-product-error" : undefined} onChange={(event) => update("product", event.target.value)}>{products.map((product) => <option value={product.partNumber} key={product.partNumber}>{product.partNumber} — {product.title}</option>)}</select></label>
      {errors.product && <p className="rxl-field-error" id="rfq-product-error">{errors.product}</p>}

      <label className="rxl-field" htmlFor="rfq-quantity"><span>Quantity</span><input id="rfq-quantity" required type="number" min={1} max={100000} step={1} value={values.quantity} aria-invalid={Boolean(errors.quantity)} aria-describedby={errors.quantity ? "rfq-quantity-error" : undefined} onChange={(event) => update("quantity", Number(event.target.value))} /></label>
      {errors.quantity && <p className="rxl-field-error" id="rfq-quantity-error">{errors.quantity}</p>}

      <label className="rxl-field" htmlFor="rfq-notes"><span>Project notes</span><textarea id="rfq-notes" required rows={7} minLength={8} maxLength={3000} value={values.notes} aria-invalid={Boolean(errors.notes)} aria-describedby={errors.notes ? "rfq-notes-error" : undefined} onChange={(event) => update("notes", event.target.value)} /></label>
      {errors.notes && <p className="rxl-field-error" id="rfq-notes-error">{errors.notes}</p>}

      <label className="rxl-honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
      <button className="rxl-btn rxl-btn-primary" type="submit" disabled={busy}>{busy ? "Submitting…" : "Request quote"}</button>
      <p className="rxl-form-status" role="status" aria-live="polite">{status}</p>
    </form>
  );
}
