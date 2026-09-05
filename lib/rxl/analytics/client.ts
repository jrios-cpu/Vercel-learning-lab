import type { AnalyticsEventName } from "@/lib/rxl/types/analytics";

export type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;
export type AnalyticsDispatch = { name: AnalyticsEventName; params: AnalyticsParams; at: number };

export function trackAnalytics(name: AnalyticsEventName, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<AnalyticsDispatch>("rxl:analytics", { detail: { name, params, at: Date.now() } }));
}
