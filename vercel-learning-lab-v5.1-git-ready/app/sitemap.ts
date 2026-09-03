import type { MetadataRoute } from "next";
import { jobs, products } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/products", "/careers", "/contact", "/rfq", ...products.map((p) => `/products/${p.slug}`), ...jobs.map((j) => `/careers/${j.slug}`)].map((path) => ({ url: `${SITE_URL}${path === "/" ? "/" : path}` }));
}
