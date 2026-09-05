"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution } from "@/lib/rxl/analytics/attribution";
import { trackAnalytics } from "@/lib/rxl/analytics/client";
import { AnalyticsInspector } from "./AnalyticsInspector";

export function AnalyticsProvider({ children, preview }: { children: React.ReactNode; preview: boolean }) {
  const pathname = usePathname();
  useEffect(() => {
    captureAttribution(new URL(window.location.href), window.sessionStorage);
    trackAnalytics("page_view", { path: pathname });
  }, [pathname]);
  return <>{children}{preview ? <AnalyticsInspector /> : null}</>;
}
