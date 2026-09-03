import type { MetadataRoute } from "next";
import { buildRobotsRules } from "@/lib/rxl/seo/metadata";
import { RXL_SITE } from "@/lib/rxl/site";
export default function robots(): MetadataRoute.Robots { const production = process.env.VERCEL_ENV === "production"; return { rules: buildRobotsRules({ production }), sitemap: `${RXL_SITE.productionUrl}/sitemap.xml` }; }
