import type { MetadataRoute } from "next";
import type { Product } from "@/lib/rxl/types/catalog";
import type { Article } from "@/lib/rxl/types/content";
import type { Job } from "@/lib/rxl/types/jobs";
import { RXL_SITE } from "@/lib/rxl/site";

export function organizationJsonLd() {
  return { "@context": "https://schema.org", "@type": "Organization", name: RXL_SITE.name, url: RXL_SITE.productionUrl };
}

export function productJsonLd(product: Product) {
  return { "@context": "https://schema.org", "@type": "Product", name: product.title, sku: product.partNumber, category: product.category, description: product.shortDescription, url: `${RXL_SITE.productionUrl}/products/${product.categorySlug}/${encodeURIComponent(product.partNumber)}` };
}

export function articleJsonLd(article: Article) {
  return { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.summary, url: `${RXL_SITE.productionUrl}/news/${article.slug}`, ...(article.publishedAt ? { datePublished: article.publishedAt } : {}) };
}

export function jobJsonLd(job: Job) {
  if (job.status !== "verified") return null;
  return { "@context": "https://schema.org", "@type": "JobPosting", title: job.title, description: job.summary, employmentType: job.employmentType, hiringOrganization: { "@type": "Organization", name: RXL_SITE.name, sameAs: RXL_SITE.productionUrl } };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: `${RXL_SITE.productionUrl}${item.path}` })) };
}

export function buildRobotsRules({ production }: { production: boolean }): MetadataRoute.Robots["rules"] {
  if (!production) return { userAgent: "*", disallow: "/" };
  return { userAgent: "*", allow: "/", disallow: ["/lab", "/lab/", "/api/lab/", "/api/forms/", "/search", "/customer-portal", "/employees"] };
}
