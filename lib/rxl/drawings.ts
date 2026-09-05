import type { Product } from "@/lib/rxl/types/catalog";

const DRAWING_HOSTS = new Set(["rxlusa.com", "www.rxlusa.com"]);
const DRAWING_PATH_PREFIX = "/wp-content/uploads/SolidDrawings/";

export function isAllowedRxlDrawingUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      DRAWING_HOSTS.has(url.hostname.toLowerCase()) &&
      url.pathname.startsWith(DRAWING_PATH_PREFIX) &&
      url.pathname.toLowerCase().endsWith(".pdf") &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export function getDrawingProxyUrl(drawingUrl: string): string {
  if (!isAllowedRxlDrawingUrl(drawingUrl)) throw new Error("Unsupported RXL drawing URL");
  return `/api/catalog/drawing-pdf?src=${encodeURIComponent(drawingUrl)}`;
}

export function getProductDrawingUrl(product: Product): string | null {
  const href = product.documents.find((document) => document.type === "drawing" && document.href)?.href ?? null;
  return href && isAllowedRxlDrawingUrl(href) ? href : null;
}
