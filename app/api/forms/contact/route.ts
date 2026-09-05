import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { clientIp, getIdempotent, isRateLimited, readJson, rememberIdempotent, text, validEmail } from "@/lib/rxl/validation/forms";
function json(body: Record<string, unknown>, status = 200) { return NextResponse.json(body, { status }); }
export async function POST(req: NextRequest) {
  const requestId = randomUUID();
  if (isRateLimited("contact", clientIp(req))) return json({ error: "Too many requests. Please try again shortly.", requestId }, 429);
  const idem = req.headers.get("x-idempotency-key")?.slice(0, 128) || "";
  const cached = getIdempotent("contact", idem); if (cached) return json(cached.body, cached.status);
  let body: Record<string, unknown>;
  try { body = await readJson(req); } catch (error) { if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") return json({ error: "Payload exceeds 16 KB.", requestId }, 413); return json({ error: "Invalid JSON payload.", requestId }, 400); }
  if (text(body.website)) return json({ ok: true, delivery: "not-configured", requestId });
  const name = text(body.name), email = text(body.email), company = text(body.company), message = text(body.message);
  if (name.length < 2 || name.length > 80) return json({ error: "Name must be between 2 and 80 characters.", requestId }, 400);
  if (!validEmail(email)) return json({ error: "Enter a valid email address.", requestId }, 400);
  if (company.length > 120) return json({ error: "Company is too long.", requestId }, 400);
  if (message.length < 12 || message.length > 3000) return json({ error: "Message must be between 12 and 3000 characters.", requestId }, 400);
  const responseBody = { ok: true, delivery: "not-configured", requestId };
  console.info("rxl_contact_request", { requestId, hasCompany: Boolean(company) });
  rememberIdempotent("contact", idem, 200, responseBody);
  return json(responseBody);
}
