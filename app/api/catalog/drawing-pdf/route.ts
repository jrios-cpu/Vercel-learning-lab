import { isAllowedRxlDrawingUrl } from "@/lib/rxl/drawings";

export const runtime = "nodejs";

const MAX_PDF_BYTES = 16 * 1024 * 1024;
const MAX_REDIRECTS = 3;

async function fetchDrawing(url: string, redirects = 0): Promise<Response> {
  if (!isAllowedRxlDrawingUrl(url)) throw new Error("Drawing URL is not allowed");
  if (redirects > MAX_REDIRECTS) throw new Error("Too many drawing redirects");

  const response = await fetch(url, {
    redirect: "manual",
    headers: { Accept: "application/pdf" },
    signal: AbortSignal.timeout(10_000),
  });

  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    if (!location) throw new Error("Drawing redirect did not include a location");
    return fetchDrawing(new URL(location, url).toString(), redirects + 1);
  }

  return response;
}

export async function GET(request: Request) {
  const src = new URL(request.url).searchParams.get("src") ?? "";
  if (!isAllowedRxlDrawingUrl(src)) {
    return Response.json({ error: "Invalid RXL drawing URL" }, { status: 400 });
  }

  try {
    const upstream = await fetchDrawing(src);
    if (!upstream.ok) {
      return Response.json({ error: "RXL drawing could not be loaded" }, { status: 502 });
    }

    const declaredLength = Number(upstream.headers.get("content-length") ?? 0);
    if (declaredLength > MAX_PDF_BYTES) {
      return Response.json({ error: "Drawing PDF is too large" }, { status: 413 });
    }

    const bytes = new Uint8Array(await upstream.arrayBuffer());
    if (bytes.byteLength > MAX_PDF_BYTES) {
      return Response.json({ error: "Drawing PDF is too large" }, { status: 413 });
    }

    const signature = String.fromCharCode(...bytes.slice(0, 5));
    if (signature !== "%PDF-") {
      return Response.json({ error: "Upstream response was not a PDF" }, { status: 502 });
    }

    return new Response(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
        "Content-Disposition": "inline",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return Response.json({ error: "Drawing preview is temporarily unavailable" }, { status: 502 });
  }
}
