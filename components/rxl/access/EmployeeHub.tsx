"use client";

import { trackAnalytics } from "@/lib/rxl/analytics/client";
export type EmployeeAuthState = "not-configured" | "preview-demo" | "authenticated";
const groups = [
  ["HR / SharePoint", "People resources and internal documents"],
  ["Epicor", "Operations and ERP launch point"],
  ["IT Support", "Service desk and technical support"],
  ["Safety / Training", "Training and compliance resources"],
  ["Timesheets / Payroll", "Time and payroll systems"],
  ["Drawing Systems", "Engineering drawings and document control"],
] as const;
export function EmployeeHub({ authState }: { authState: EmployeeAuthState }) { const preview = authState !== "authenticated"; return <section className="rxl-employee-hub"><div className="rxl-employee-intro"><span className="rxl-eyebrow">Employee hub</span><h1>One launchpad, clear system boundaries.</h1><p>{preview ? "Preview demo — Entra authentication and real internal destinations are not configured." : "Authenticated employee launchpad."}</p></div><div className="rxl-employee-grid">{groups.map(([label, description]) => <button type="button" disabled={preview} className="rxl-employee-tool" key={label} onClick={() => trackAnalytics("employee_tool_open", { tool: label })}><span>{label}</span><small>{description}</small><b>{preview ? "Not connected" : "Open"}</b></button>)}</div></section>; }
