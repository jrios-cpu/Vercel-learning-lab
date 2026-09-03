"use client";

import { useRef, useState } from "react";
import { trackAnalytics } from "@/lib/rxl/analytics/client";

type Values = { name: string; email: string; company: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;
const initialValues: Values = { name: "", email: "", company: "", message: "" };

export function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  function update(key: keyof Values, value: string) { setValues((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: undefined })); }
  function validate() {
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) next.email = "Enter a valid work email.";
    if (values.company.length > 120) next.company = "Company must be 120 characters or fewer.";
    if (values.message.trim().length < 12) next.message = "Add at least 12 characters of project context.";
    setErrors(next); return Object.keys(next).length === 0;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busyRef.current || !validate()) return;
    busyRef.current = true; setBusy(true); setStatus("Sending inquiry…");
    const controller = new AbortController(); const timeout = window.setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch("/api/forms/contact", { method: "POST", headers: { "content-type": "application/json", "x-idempotency-key": window.crypto.randomUUID() }, body: JSON.stringify({ ...values, website }), signal: controller.signal });
      const result = await response.json() as { ok?: boolean; error?: string; requestId?: string; delivery?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "Inquiry could not be accepted.");
      trackAnalytics("contact_submit", { delivery: result.delivery ?? "not-configured" });
      setValues(initialValues); setStatus("Inquiry accepted. Delivery is not configured in this Preview.");
    } catch (error) { setStatus(error instanceof DOMException && error.name === "AbortError" ? "Request timed out. Try again." : error instanceof Error ? error.message : "Network error. Try again."); }
    finally { window.clearTimeout(timeout); busyRef.current = false; setBusy(false); }
  }

  return (
    <form className="rxl-contact-form" onSubmit={submit} noValidate>
      <label className="rxl-field" htmlFor="contact-name"><span>Name</span><input id="contact-name" required maxLength={80} value={values.name} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined} onChange={(event) => update("name", event.target.value)} /></label>
      {errors.name && <p className="rxl-field-error" id="contact-name-error">{errors.name}</p>}
      <label className="rxl-field" htmlFor="contact-email"><span>Work email</span><input id="contact-email" required type="email" maxLength={254} value={values.email} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} onChange={(event) => update("email", event.target.value)} /></label>
      {errors.email && <p className="rxl-field-error" id="contact-email-error">{errors.email}</p>}
      <label className="rxl-field" htmlFor="contact-company"><span>Company</span><input id="contact-company" maxLength={120} value={values.company} aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? "contact-company-error" : undefined} onChange={(event) => update("company", event.target.value)} /></label>
      {errors.company && <p className="rxl-field-error" id="contact-company-error">{errors.company}</p>}
      <label className="rxl-field" htmlFor="contact-message"><span>How can we help?</span><textarea id="contact-message" required rows={7} maxLength={3000} value={values.message} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : undefined} onChange={(event) => update("message", event.target.value)} /></label>
      {errors.message && <p className="rxl-field-error" id="contact-message-error">{errors.message}</p>}
      <label className="rxl-honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
      <button className="rxl-btn rxl-btn-primary" type="submit" disabled={busy}>{busy ? "Sending…" : "Send inquiry"}</button>
      <p className="rxl-form-status" role="status" aria-live="polite">{status}</p>
    </form>
  );
}
