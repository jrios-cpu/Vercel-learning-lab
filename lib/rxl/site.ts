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
} as const;

export function isPreviewEnvironment() {
  return process.env.VERCEL_ENV !== "production";
}
