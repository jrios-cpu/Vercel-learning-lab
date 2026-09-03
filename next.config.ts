import type { NextConfig } from "next";
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Content-Security-Policy", value: "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: blob:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; upgrade-insecure-requests" },
];
const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
  async redirects() { return [
    { source: "/admin/deployments", destination: "/lab/deployments", permanent: true },
    { source: "/observability", destination: "/lab/observability", permanent: true },
    { source: "/preview-lab", destination: "/lab/preview-production", permanent: true },
    { source: "/env-lab", destination: "/lab/environment", permanent: true },
    { source: "/feature-flags", destination: "/lab/feature-flags", permanent: true },
    { source: "/performance-lab", destination: "/lab/performance", permanent: true },
    { source: "/loading-demo", destination: "/lab/error-handling", permanent: true },
    { source: "/enterprise-demo", destination: "/lab", permanent: true },
    { source: "/rfq", destination: "/configurator", permanent: true },
    { source: "/products/structural-frame-x1", destination: "/products", permanent: true },
    { source: "/products/thermal-panel-t40", destination: "/products", permanent: true },
    { source: "/products/rackshield-r2", destination: "/products", permanent: true },
  ]; },
  async headers() { return [
    { source: "/:path*", headers: securityHeaders },
    { source: "/lab/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    { source: "/api/lab/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
  ]; },
};
export default nextConfig;
