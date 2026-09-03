export const SITE_URL = "https://vercel-learning-lab.vercel.app";
export const SITE_NAME = "Vercel Learning Lab";
export const SITE_DESCRIPTION =
  "A refined industrial product, careers and Vercel operations reference experience.";

export const publicNav = [
  ["Products", "/products"],
  ["Careers", "/careers"],
  ["Lab", "/lab"],
  ["Contact", "/contact"],
  ["Request Quote", "/rfq"],
] as const;

export const labModules = [
  "deployments",
  "observability",
  "preview-production",
  "environment",
  "feature-flags",
  "performance",
  "error-handling",
] as const;

export function isProduction() {
  return process.env.VERCEL_ENV === "production";
}

export function featureFlags() {
  const explicit = process.env.FEATURE_NEW_CONFIGURATOR;
  return {
    newConfigurator: {
      enabled:
        explicit === "true"
          ? true
          : explicit === "false"
            ? false
            : !isProduction(),
      source: explicit ? "environment variable" : "Preview-on / Production-off policy",
    },
    careersApplyFlow: {
      enabled: process.env.FEATURE_CAREERS_APPLY === "true",
      source: process.env.FEATURE_CAREERS_APPLY
        ? "environment variable"
        : "safe default",
    },
    sanityIntegration: { enabled: false, source: "v5 release policy" },
  };
}
