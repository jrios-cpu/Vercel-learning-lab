export const LAB_MODULES = ["deployments", "observability", "preview-production", "environment", "feature-flags", "performance", "error-handling"] as const;
export type LabModule = (typeof LAB_MODULES)[number];
export function isLabModule(value: string): value is LabModule { return LAB_MODULES.includes(value as LabModule); }
export function labFlags() { return { configurator: true, careersProvider: true, contentProvider: "local-representative", sanityIntegration: false, externalDelivery: false, environment: process.env.VERCEL_ENV || "development" }; }
