"use client";

import { trackAnalytics } from "@/lib/rxl/analytics/client";
export function CustomerPortalView({ portalUrl }: { portalUrl: string | null }) {
  return <section className="rxl-access-card"><span className="rxl-eyebrow">Customer portal</span><h1>Continue to your external account workspace.</h1><p>This site never collects portal credentials. When a verified Epicor portal URL is configured, the handoff opens the external system directly.</p><div className="rxl-access-boundary"><strong>{portalUrl ? "External handoff configured" : "Portal endpoint not configured"}</strong><span>No username or password fields are rendered here.</span></div>{portalUrl ? <a className="rxl-btn rxl-btn-primary" href={portalUrl} rel="noopener noreferrer" onClick={() => trackAnalytics("portal_click", { configured: true })}>Continue to the Portal</a> : <button className="rxl-btn rxl-btn-primary" type="button" disabled>Continue to the Portal</button>}</section>;
}
