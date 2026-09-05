import type { Attribution } from "@/lib/rxl/configurator/payload";

const STORAGE_KEY = "rxl-attribution-v1";

function fallback(): Attribution {
  return { source: null, medium: null, campaign: null, landingPage: "/", sessionId: "unavailable" };
}

export function captureAttribution(url: URL, storage: Storage): Attribution {
  const existing = storage.getItem(STORAGE_KEY);
  if (existing) {
    try { return JSON.parse(existing) as Attribution; } catch { storage.removeItem(STORAGE_KEY); }
  }
  const attribution: Attribution = {
    source: url.searchParams.get("utm_source") || "direct",
    medium: url.searchParams.get("utm_medium"),
    campaign: url.searchParams.get("utm_campaign"),
    landingPage: `${url.pathname}${url.search}`,
    sessionId: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `session-${Date.now().toString(36)}`,
  };
  storage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  return attribution;
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return fallback();
  return captureAttribution(new URL(window.location.href), window.sessionStorage);
}
