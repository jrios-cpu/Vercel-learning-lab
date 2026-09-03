import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/data";
import { isProduction } from "@/lib/site";

const BODY_LIMIT = 16 * 1024;
const WINDOW_MS = 60_000;
const RATE_LIMIT = 5;
const IDEMPOTENCY_MS = 120_000;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Hit = { count: number; resetAt: number };
type Cached = { expiresAt: number; status: number; body: Record<string, unknown> };

declare global {
  var __vllRate: Map<string, Hit> | undefined;
  var __vllIdempotency: Map<string, Cached> | undefined;
}
const rate = globalThis.__vllRate ?? (globalThis.__vllRate = new Map());
const idempotency = globalThis.__vllIdempotency ?? (globalThis.__vllIdempotency = new Map());

function json(body: Record<string, unknown>, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers });
}
function pathParts(context: { params: Promise<{ slug: string[] }> }) { return context.params.then(({ slug }) => slug || []); }
function clientIp(req: NextRequest) { return (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim(); }
function limited(key: string) {
  const now = Date.now();
  const current = rate.get(key);
  if (!current || current.resetAt <= now) { rate.set(key, { count: 1, resetAt: now + WINDOW_MS }); return false; }
  current.count += 1; return current.count > RATE_LIMIT;
}
async function readJson(req: NextRequest) {
  const length = Number(req.headers.get("content-length") || 0);
  if (length > BODY_LIMIT) throw new Error("PAYLOAD_TOO_LARGE");
  if (!req.body) return {};
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) { total += value.byteLength; if (total > BODY_LIMIT) throw new Error("PAYLOAD_TOO_LARGE"); chunks.push(value); }
  }
  const merged = new Uint8Array(total); let offset = 0;
  for (const chunk of chunks) { merged.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(merged));
}
function text(value: unknown) { return typeof value === "string" ? value.trim() : ""; }
function validEmail(value: string) { return value.length <= 254 && emailPattern.test(value); }

export async function GET(req: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  const parts = await pathParts(context);
  const requestId = randomUUID();
  if (parts[0] !== "lab") return json({ error: "Not found.", requestId }, 404);
  if (parts[1] === "performance") return json({ generatedAt: new Date().toISOString(), environment: process.env.VERCEL_ENV || "development", note: "Inspect Cache-Control, x-vercel-cache and Age on the real response." }, 200, { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" });
  if (parts[1] === "self-test") {
    if (isProduction()) return json({ error: "Not found.", requestId }, 404);
    return json({ requestId, ok: true, checks: { emailValidation: validEmail("qa@example.com"), bodyLimitBytes: BODY_LIMIT, production500Blocked: true, sanityConnected: false } });
  }
  if (parts[1] === "status" && parts[2]) {
    const code = Number(parts[2]);
    if (![200, 400, 404, 500].includes(code)) return json({ error: "Unsupported status.", requestId }, 400);
    if (code === 500 && isProduction()) return json({ error: "Not found.", requestId }, 404);
    return json({ requestId, generatedStatus: code }, code);
  }
  return json({ error: "Not found.", requestId }, 404);
}

export async function POST(req: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  const parts = await pathParts(context);
  const requestId = randomUUID();
  if (parts[0] !== "forms" || !["contact", "rfq"].includes(parts[1])) return json({ error: "Not found.", requestId }, 404);
  const key = `${parts[1]}:${clientIp(req)}`;
  if (limited(key)) return json({ error: "Too many requests. Please try again shortly.", requestId }, 429);
  const idem = req.headers.get("x-idempotency-key")?.slice(0, 128) || "";
  const cached = idem ? idempotency.get(`${parts[1]}:${idem}`) : undefined;
  if (cached && cached.expiresAt > Date.now()) return json(cached.body, cached.status);
  let body: Record<string, unknown>;
  try { body = await readJson(req); }
  catch (error) {
    if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") return json({ error: "Payload exceeds 16 KB.", requestId }, 413);
    return json({ error: "Invalid JSON payload.", requestId }, 400);
  }
  if (text(body.website)) return json({ message: "Request received.", requestId });
  const name = text(body.name), email = text(body.email);
  if (name.length < 2 || name.length > 80) return json({ error: "Name must be between 2 and 80 characters.", requestId }, 400);
  if (!validEmail(email)) return json({ error: "Enter a valid email address.", requestId }, 400);
  let responseBody: Record<string, unknown>;
  if (parts[1] === "contact") {
    const company = text(body.company), message = text(body.message);
    if (company.length > 120) return json({ error: "Company is too long.", requestId }, 400);
    if (message.length < 12 || message.length > 3000) return json({ error: "Message must be between 12 and 3000 characters.", requestId }, 400);
    console.info("contact_request", { requestId, hasCompany: Boolean(company) });
    responseBody = { message: "Request received. This learning app does not persist or email submissions yet.", requestId };
  } else {
    const product = text(body.product), notes = text(body.notes), quantity = Number(body.quantity);
    if (!products.some((item) => item.slug === product)) return json({ error: "Select a valid product.", requestId }, 400);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100000) return json({ error: "Quantity must be an integer between 1 and 100000.", requestId }, 400);
    if (notes.length < 8 || notes.length > 3000) return json({ error: "Project notes must be between 8 and 3000 characters.", requestId }, 400);
    console.info("rfq_request", { requestId, product });
    responseBody = { message: "Quote request received. No CRM is connected yet.", requestId };
  }
  if (idem) idempotency.set(`${parts[1]}:${idem}`, { expiresAt: Date.now() + IDEMPOTENCY_MS, status: 200, body: responseBody });
  return json(responseBody);
}
