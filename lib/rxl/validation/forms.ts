import type { NextRequest } from "next/server";

export const BODY_LIMIT = 16 * 1024;
const WINDOW_MS = 60_000;
const RATE_LIMIT = 5;
const IDEMPOTENCY_MS = 120_000;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
type Hit = { count: number; resetAt: number };
type Cached = { expiresAt: number; status: number; body: Record<string, unknown> };

declare global {
  var __rxlFormRate: Map<string, Hit> | undefined;
  var __rxlFormIdempotency: Map<string, Cached> | undefined;
}
const rate = globalThis.__rxlFormRate ?? (globalThis.__rxlFormRate = new Map());
const idempotency = globalThis.__rxlFormIdempotency ?? (globalThis.__rxlFormIdempotency = new Map());

export function text(value: unknown) { return typeof value === "string" ? value.trim() : ""; }
export function validEmail(value: string) { return value.length <= 254 && emailPattern.test(value); }
export function clientIp(req: NextRequest) { return (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim(); }
export function isRateLimited(scope: string, ip: string) { const now = Date.now(); const key = `${scope}:${ip}`; const current = rate.get(key); if (!current || current.resetAt <= now) { rate.set(key, { count: 1, resetAt: now + WINDOW_MS }); return false; } current.count += 1; return current.count > RATE_LIMIT; }
export function getIdempotent(scope: string, key: string) { if (!key) return null; const item = idempotency.get(`${scope}:${key}`); if (!item || item.expiresAt <= Date.now()) return null; return item; }
export function rememberIdempotent(scope: string, key: string, status: number, body: Record<string, unknown>) { if (key) idempotency.set(`${scope}:${key}`, { expiresAt: Date.now() + IDEMPOTENCY_MS, status, body }); }

export async function readJson(req: NextRequest): Promise<Record<string, unknown>> {
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
  const decoded = new TextDecoder().decode(merged);
  const parsed = JSON.parse(decoded || "{}");
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("INVALID_JSON");
  return parsed as Record<string, unknown>;
}
