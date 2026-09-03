import type { AnalyticsEventName } from "@/lib/rxl/types/analytics";
export function trackAnalytics(name: AnalyticsEventName, params: Record<string, string | number | boolean | null | undefined> = {}): void { if (typeof window === "undefined") return; window.dispatchEvent(new CustomEvent("rxl:analytics", { detail: { name, params, at: Date.now() } })); }
