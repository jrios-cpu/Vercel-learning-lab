export const PUBLIC_ROUTE_PATHS = [
  "/",
  "/about",
  "/about/team",
  "/workflow",
  "/case-studies",
  "/industries",
  "/products",
  "/search",
  "/configurator",
  "/rfq",
  "/resources",
  "/news",
  "/careers",
  "/contact",
  "/customer-portal",
  "/employees",
  "/legal/privacy",
  "/legal/terms",
] as const;

export const RXL_SITE = {
  name: "RXL USA",
  description: "Engineered infrastructure solutions for mission-critical environments.",
  productionUrl: "https://vercel-learning-lab.vercel.app",
  primaryCta: { label: "Start Project", href: "/configurator" },
  contact: {
    phone: null as string | null,
    email: null as string | null,
    address: null as string | null,
  },
  external: {
    customerPortalUrl: null as string | null,
    employeeLoginUrl: null as string | null,
  },
  integrations: {
    content: "local-provider",
    catalogSearch: "local-provider",
    ats: "not-connected",
    customerPortal: "not-connected",
    employeeIdentity: "not-connected",
    quoteDelivery: "not-connected",
  },
} as const;

export function isPreviewEnvironment() {
  return process.env.VERCEL_ENV !== "production";
}
