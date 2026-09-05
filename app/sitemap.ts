import type { MetadataRoute } from "next";
import { articles, industries } from "@/lib/rxl/data/content";
import { PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/rxl/data/products";
import { RXL_SITE } from "@/lib/rxl/site";

const staticPaths = [
  "/",
  "/about",
  "/about/team",
  "/workflow",
  "/case-studies",
  "/industries",
  "/products",
  "/configurator",
  "/rfq",
  "/resources",
  "/news",
  "/careers",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...industries.map((item) => `/industries/${item.slug}`),
    ...Object.keys(PRODUCT_CATEGORIES).map((category) => `/products/${category}`),
    ...PRODUCTS.map((product) => `/products/${product.categorySlug}/${encodeURIComponent(product.partNumber)}`),
    ...articles.map((article) => `/news/${article.slug}`),
  ];
  return paths.map((path) => ({ url: `${RXL_SITE.productionUrl}${path}` }));
}
