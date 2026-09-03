"use client";

import { useEffect, useState } from "react";
import type { AnalyticsDispatch } from "@/lib/rxl/analytics/client";

const conversions = new Set(["quote_submit", "contact_submit", "careers_apply_click", "portal_click"]);

export function AnalyticsInspector() {
  const [events, setEvents] = useState<AnalyticsDispatch[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<AnalyticsDispatch>).detail;
      if (detail) setEvents((current) => [detail, ...current].slice(0, 30));
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("rxl:analytics", listener);
    window.addEventListener("keydown", escape);
    return () => { window.removeEventListener("rxl:analytics", listener); window.removeEventListener("keydown", escape); };
  }, []);
  return <div className={`rxl-analytics-inspector${open ? " open" : ""}`}><button type="button" className="rxl-analytics-toggle" aria-expanded={open} onClick={() => setOpen((value) => !value)}>Analytics {events.length ? `(${events.length})` : ""}</button>{open && <section aria-label="Preview analytics inspector"><header><div><strong>Preview analytics</strong><span>Local event bus only</span></div><button type="button" onClick={() => setEvents([])}>Clear</button></header><div className="rxl-analytics-events">{events.length ? events.map((event, index) => <article key={`${event.at}-${index}`} className={conversions.has(event.name) ? "conversion" : ""}><div><strong>{event.name}</strong><time>{new Date(event.at).toLocaleTimeString()}</time></div><pre>{JSON.stringify(event.params, null, 2)}</pre></article>) : <p>No events captured yet.</p>}</div></section>}</div>;
}
