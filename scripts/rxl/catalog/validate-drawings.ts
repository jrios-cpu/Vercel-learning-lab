import { readFile, rename, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { isAllowedRxlDrawingUrl } from "@/lib/rxl/drawings";
import type { DrawingValidation, ImportedOdooProduct } from "@/lib/rxl/catalog/schema";

const TERMINAL = new Set<DrawingValidation["status"]>(["live", "stale", "invalid"]);

function result(
  url: string,
  status: DrawingValidation["status"],
  httpStatus: number | null,
  contentType: string | null,
  error: string | null = null,
): DrawingValidation {
  return { url, status, httpStatus, contentType, checkedAt: new Date().toISOString(), error };
}

export async function validateDrawingUrl(url: string, fetchImpl: typeof fetch = fetch): Promise<DrawingValidation> {
  if (!isAllowedRxlDrawingUrl(url)) return result(url, "invalid", null, null, "URL is outside the approved RXL drawing allowlist");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  let response: Response;
  try {
    response = await fetchImpl(url, { signal: controller.signal, redirect: "follow" });
  } catch (error) {
    clearTimeout(timer);
    return result(url, "invalid", null, null, error instanceof Error ? error.message : String(error));
  }
  clearTimeout(timer);

  const contentType = response.headers.get("content-type");
  const finalUrl = response.url || url;
  if (!isAllowedRxlDrawingUrl(finalUrl)) {
    return result(url, "invalid", response.status, contentType, "Redirect left the approved RXL drawing allowlist");
  }
  if (response.status === 404 || response.status === 410) return result(url, "stale", response.status, contentType);
  if (!response.ok) return result(url, "invalid", response.status, contentType, `HTTP ${response.status}`);

  let bytes: Uint8Array;
  try {
    bytes = new Uint8Array(await response.arrayBuffer());
  } catch (error) {
    return result(url, "invalid", response.status, contentType, error instanceof Error ? error.message : String(error));
  }

  if (bytes.length < 5 || new TextDecoder("ascii").decode(bytes.subarray(0, 5)) !== "%PDF-") {
    return result(url, "invalid", response.status, contentType, "Response does not start with the PDF signature");
  }

  const loadingTask = getDocument({ data: bytes });
  try {
    const document = await loadingTask.promise;
    if (document.numPages < 1) throw new Error("PDF has no pages");
    await document.getPage(1);
    return result(url, "live", response.status, contentType);
  } catch (error) {
    return result(url, "invalid", response.status, contentType, error instanceof Error ? error.message : String(error));
  } finally {
    await loadingTask.destroy();
  }
}

function flag(name: string): string | null {
  const index = process.argv.indexOf(name);
  if (index < 0) return null;
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`Missing value for ${name}`);
  return value;
}

async function readCache(path: string): Promise<Record<string, DrawingValidation>> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as Record<string, DrawingValidation>;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw error;
  }
}

async function writeCacheAtomic(path: string, cache: Record<string, DrawingValidation>) {
  const temp = `${path}.tmp`;
  await writeFile(temp, `${JSON.stringify(cache, null, 2)}\n`, "utf8");
  await rename(temp, path);
}

async function main() {
  const productsPath = flag("--products");
  const cachePath = flag("--cache");
  const concurrency = Math.min(20, Math.max(1, Number(flag("--concurrency") ?? "6")));
  if (!productsPath || !cachePath || !Number.isFinite(concurrency)) {
    throw new Error("Usage: npm run catalog:validate-drawings -- --products <imported-products.json> --cache <drawing-validation.json> --concurrency 6");
  }

  const products = JSON.parse(await readFile(resolve(productsPath), "utf8")) as ImportedOdooProduct[];
  const urls = [...new Set(products.flatMap((product) => product.drawingPdfUrl ? [product.drawingPdfUrl] : []))].sort();
  const resolvedCache = resolve(cachePath);
  const cache = await readCache(resolvedCache);
  const pending = urls.filter((url) => !cache[url] || !TERMINAL.has(cache[url].status));
  let cursor = 0;
  let completed = 0;
  let saveChain = Promise.resolve();

  const checkpoint = () => {
    saveChain = saveChain.then(() => writeCacheAtomic(resolvedCache, cache));
    return saveChain;
  };

  async function worker() {
    while (true) {
      const index = cursor++;
      if (index >= pending.length) return;
      const url = pending[index]!;
      cache[url] = await validateDrawingUrl(url);
      completed += 1;
      if (completed % 25 === 0) await checkpoint();
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, pending.length || 1) }, () => worker()));
  await checkpoint();

  const entries = urls.map((url) => cache[url]).filter((entry): entry is DrawingValidation => Boolean(entry));
  const counts = entries.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.status] = (acc[entry.status] ?? 0) + 1;
    return acc;
  }, {});
  console.log(JSON.stringify({ uniqueDrawingUrls: urls.length, reused: urls.length - pending.length, fetched: pending.length, statusCounts: counts }, null, 2));
}

if (process.argv[1] && /validate-drawings\.(?:ts|js)$/.test(process.argv[1])) {
  void main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
