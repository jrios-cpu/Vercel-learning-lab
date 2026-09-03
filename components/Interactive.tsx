"use client";

import { FormEvent, useRef, useState } from "react";
import { products } from "@/lib/data";

type State = { kind: "idle" | "pending" | "success" | "error"; message: string };

async function postJson(endpoint: string, payload: unknown, idempotencyKey: string) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Idempotency-Key": idempotencyKey },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `Request failed (${response.status}).`);
    return body;
  } finally {
    window.clearTimeout(timeout);
  }
}

function errorMessage(error: unknown) {
  if (error instanceof DOMException && error.name === "AbortError")
    return "The request timed out. Please try again.";
  if (error instanceof TypeError) return "Network error. Check your connection and try again.";
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export function ContactForm() {
  const [state, setState] = useState<State>({ kind: "idle", message: "" });
  const busy = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    setState({ kind: "pending", message: "Sending…" });
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const body = await postJson(
        "/api/forms/contact",
        {
          name: data.get("name"),
          email: data.get("email"),
          company: data.get("company"),
          message: data.get("message"),
          website: data.get("website"),
        },
        crypto.randomUUID(),
      );
      setState({ kind: "success", message: body.message || "Request received." });
      form.reset();
    } catch (error) {
      setState({ kind: "error", message: errorMessage(error) });
    } finally {
      busy.current = false;
    }
  }
  return (
    <form className="form" onSubmit={submit}>
      <label>Name<input name="name" required minLength={2} maxLength={80} autoComplete="name" /></label>
      <label>Email<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
      <label>Company<input name="company" maxLength={120} autoComplete="organization" /></label>
      <label className="wide">Message<textarea name="message" required minLength={12} maxLength={3000} rows={7} /></label>
      <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} maxLength={100} autoComplete="off" /></label>
      <button className="button" disabled={state.kind === "pending"}>{state.kind === "pending" ? "Sending…" : "Send request"}</button>
      <p className={`state ${state.kind}`} role="status" aria-live="polite" aria-atomic="true">{state.message}</p>
    </form>
  );
}

export function RfqForm({ initial }: { initial?: string }) {
  const selected = products.some((product) => product.slug === initial) ? initial! : products[0].slug;
  const [state, setState] = useState<State>({ kind: "idle", message: "" });
  const busy = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    setState({ kind: "pending", message: "Creating quote request…" });
    const data = new FormData(event.currentTarget);
    try {
      const body = await postJson(
        "/api/forms/rfq",
        {
          name: data.get("name"),
          email: data.get("email"),
          product: data.get("product"),
          quantity: Number(data.get("quantity")),
          notes: data.get("notes"),
          website: data.get("website"),
        },
        crypto.randomUUID(),
      );
      setState({ kind: "success", message: body.message || "Quote request received." });
    } catch (error) {
      setState({ kind: "error", message: errorMessage(error) });
    } finally {
      busy.current = false;
    }
  }
  return (
    <form className="form" onSubmit={submit}>
      <label>Name<input name="name" required minLength={2} maxLength={80} /></label>
      <label>Email<input name="email" type="email" required maxLength={254} /></label>
      <label>Product<select name="product" defaultValue={selected}>{products.map((product) => <option value={product.slug} key={product.slug}>{product.name} · {product.partNumber}</option>)}</select></label>
      <label>Quantity<input name="quantity" type="number" required min={1} max={100000} step={1} defaultValue={1} /></label>
      <label className="wide">Project notes<textarea name="notes" required minLength={8} maxLength={3000} rows={7} /></label>
      <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} maxLength={100} autoComplete="off" /></label>
      <button className="button" disabled={state.kind === "pending"}>{state.kind === "pending" ? "Submitting…" : "Request quote"}</button>
      <p className={`state ${state.kind}`} role="status" aria-live="polite" aria-atomic="true">{state.message}</p>
    </form>
  );
}

export function PerformanceProbe() {
  const [result, setResult] = useState("Run the probe to inspect the response actually returned.");
  async function probe() {
    setResult("Probing…");
    try {
      const response = await fetch("/api/lab/performance");
      const body = await response.json();
      setResult(JSON.stringify({
        status: response.status,
        cacheControl: response.headers.get("cache-control"),
        vercelCache: response.headers.get("x-vercel-cache") || "header not present",
        age: response.headers.get("age") || "header not present",
        body,
      }, null, 2));
    } catch {
      setResult("Network error while probing.");
    }
  }
  return <><button className="button secondary" onClick={probe}>Run real cache probe</button><pre className="result" aria-live="polite">{result}</pre></>;
}

export function SelfTest({ production }: { production: boolean }) {
  const [result, setResult] = useState("Not run.");
  async function run() {
    setResult("Running…");
    try {
      const response = await fetch("/api/lab/self-test", { cache: "no-store" });
      setResult(JSON.stringify({ status: response.status, ...(await response.json()) }, null, 2));
    } catch {
      setResult("Network error while running self tests.");
    }
  }
  return <><button className="button secondary" disabled={production} onClick={run}>{production ? "Self tests disabled in Production" : "Run preview self tests"}</button><pre className="result" aria-live="polite">{result}</pre></>;
}

export function StatusTools({ production }: { production: boolean }) {
  const [result, setResult] = useState("No request generated yet.");
  async function generate(code: number) {
    try {
      const response = await fetch(`/api/lab/status/${code}`, { cache: "no-store" });
      const body = await response.json().catch(() => null);
      setResult(JSON.stringify({ status: response.status, body }, null, 2));
    } catch {
      setResult("Network error while generating the request.");
    }
  }
  return <><div className="grid four">{[200, 400, 404, 500].map((code) => <div className="card" key={code}><button className="button secondary" disabled={production && code === 500} onClick={() => generate(code)}>Generate {code}</button><p>{production && code === 500 ? "Disabled in Production" : `Trigger HTTP ${code}`}</p></div>)}</div><pre className="result" aria-live="polite">{result}</pre></>;
}
