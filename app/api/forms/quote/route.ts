import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/rxl/data/products";
import { clientIp, getIdempotent, isRateLimited, readJson, rememberIdempotent, text, validEmail } from "@/lib/rxl/validation/forms";

function json(body: Record<string, unknown>, status = 200) { return NextResponse.json(body, { status }); }

export async function POST(req: NextRequest) {
  const requestId = randomUUID();
  if (isRateLimited("quote", clientIp(req))) return json({ error: "Too many requests. Please try again shortly.", requestId }, 429);
  const idem = req.headers.get("x-idempotency-key")?.slice(0, 128) || "";
  const cached = getIdempotent("quote", idem);
  if (cached) return json(cached.body, cached.status);
  let body: Record<string, unknown>;
  try { body = await readJson(req); }
  catch (error) {
    if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") return json({ error: "Payload exceeds 16 KB.", requestId }, 413);
    return json({ error: "Invalid JSON payload.", requestId }, 400);
  }
  if (text(body.website)) return json({ ok: true, delivery: "not-configured", requestId });
  const contact = body.contact && typeof body.contact === "object" && !Array.isArray(body.contact) ? body.contact as Record<string, unknown> : {};
  const name = text(contact.name), email = text(contact.email), company = text(contact.company);
  if (name.length < 2 || name.length > 80) return json({ error: "Name must be between 2 and 80 characters.", requestId }, 400);
  if (!validEmail(email)) return json({ error: "Enter a valid email address.", requestId }, 400);
  if (company.length > 120) return json({ error: "Company is too long.", requestId }, 400);
  const application = text(body.application), productLine = text(body.productLine), notes = text(body.notes), targetTimeline = text(body.targetTimeline), quantity = Number(body.quantity);
  if (!application || application.length > 120) return json({ error: "Select a valid application.", requestId }, 400);
  if (!productLine || productLine.length > 120) return json({ error: "Select a valid product line.", requestId }, 400);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100000) return json({ error: "Quantity must be an integer between 1 and 100000.", requestId }, 400);
  if (notes.length > 3000 || targetTimeline.length > 120) return json({ error: "Project details exceed allowed length.", requestId }, 400);
  const configuration = body.configuration && typeof body.configuration === "object" && !Array.isArray(body.configuration) ? body.configuration as Record<string, unknown> : {};
  const partNumbers = Array.isArray(configuration.partNumbers) ? configuration.partNumbers.map(text).filter(Boolean) : [];
  if (!partNumbers.length || partNumbers.length > 20 || partNumbers.some((partNumber) => !PRODUCTS.some((product) => product.partNumber === partNumber))) return json({ error: "Select valid representative products.", requestId }, 400);
  const quoteRef = `RXL-${randomUUID().slice(0, 8).toUpperCase()}`;
  const responseBody = { ok: true, quoteRef, delivery: "not-configured", requestId };
  console.info("rxl_quote_request", { requestId, quoteRef, partCount: partNumbers.length });
  rememberIdempotent("quote", idem, 200, responseBody);
  return json(responseBody);
}
