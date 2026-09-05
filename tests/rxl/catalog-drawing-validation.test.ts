import { describe, expect, it } from "vitest";
import { validateDrawingUrl } from "@/scripts/rxl/catalog/validate-drawings";

const VALID_URL = "https://www.rxlusa.com/wp-content/uploads/SolidDrawings/RXL-TEST.pdf";

function minimalPdf(): Uint8Array {
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 100 100] /Resources << >> /Contents 4 0 R >>\nendobj\n",
    "4 0 obj\n<< /Length 0 >>\nstream\n\nendstream\nendobj\n",
  ];
  let body = "%PDF-1.4\n";
  const offsets = [0];
  for (const object of objects) {
    offsets.push(new TextEncoder().encode(body).length);
    body += object;
  }
  const xrefOffset = new TextEncoder().encode(body).length;
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) body += `${String(offset).padStart(10, "0")} 00000 n \n`;
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return new TextEncoder().encode(body);
}

function response(bytes: BodyInit | null, status = 200, contentType = "application/pdf") {
  return new Response(bytes, { status, headers: { "content-type": contentType } });
}

describe("RXL drawing validator", () => {
  it("marks a parseable official PDF live", async () => {
    const fetchImpl: typeof fetch = async () => response(minimalPdf());
    expect(await validateDrawingUrl(VALID_URL, fetchImpl)).toMatchObject({ status: "live", httpStatus: 200 });
  });

  it("marks 404 and 410 official drawings stale", async () => {
    const notFound: typeof fetch = async () => response("not found", 404, "text/plain");
    const gone: typeof fetch = async () => response("gone", 410, "text/plain");
    expect(await validateDrawingUrl(VALID_URL, notFound)).toMatchObject({ status: "stale", httpStatus: 404 });
    expect(await validateDrawingUrl(VALID_URL, gone)).toMatchObject({ status: "stale", httpStatus: 410 });
  });

  it("rejects HTML responses and non-allowlisted URLs", async () => {
    const html: typeof fetch = async () => response("<html>error</html>", 200, "text/html");
    expect(await validateDrawingUrl(VALID_URL, html)).toMatchObject({ status: "invalid" });
    expect(await validateDrawingUrl("https://example.com/file.pdf", html)).toMatchObject({ status: "invalid", httpStatus: null });
  });

  it("marks network failures invalid", async () => {
    const failure: typeof fetch = async () => { throw new Error("network down"); };
    expect(await validateDrawingUrl(VALID_URL, failure)).toMatchObject({ status: "invalid", httpStatus: null });
  });
});
