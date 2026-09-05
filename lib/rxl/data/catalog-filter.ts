import type { Product } from "@/lib/rxl/types/catalog";

export type CatalogSort = "relevance" | "az" | "part" | "availability";
export type CatalogQuery = { query?: string; category?: string | string[]; series?: string[]; rackUnits?: string[]; width?: string[]; material?: string[]; leadTime?: string[]; sort?: CatalogSort; page?: number; perPage?: number; filters?: Record<string, string[]>; };
export type CatalogFacetCounts = { category: Record<string, number>; series: Record<string, number>; rackUnits: Record<string, number>; width: Record<string, number>; material: Record<string, number>; leadTime: Record<string, number>; };
export type CatalogQueryResult = { items: Product[]; total: number; page: number; pages: number; facets: CatalogFacetCounts; facetCounts: CatalogFacetCounts; };

const normalize = (value: string) => value.trim().toLowerCase();
const spec = (product: Product, label: string) => product.specifications[label] ?? "";
const matchesAny = (value: string, selected: string[] | undefined) => !selected?.length || selected.some((item) => normalize(item) === normalize(value));
function increment(target: Record<string, number>, value: string | null | undefined) { if (value) target[value] = (target[value] ?? 0) + 1; }

export function applyCatalogQuery(products: Product[], input: CatalogQuery = {}): CatalogQueryResult {
  const query = normalize(input.query ?? "");
  const merged = { series: input.series ?? input.filters?.series, rackUnits: input.rackUnits ?? input.filters?.rackUnits ?? input.filters?.ru, width: input.width ?? input.filters?.width, material: input.material ?? input.filters?.material ?? input.filters?.mat, leadTime: input.leadTime ?? input.filters?.leadTime ?? input.filters?.lead };
  const categories = Array.isArray(input.category) ? input.category : input.category ? [input.category] : [];
  let filtered = products.filter((product) => {
    if (query) {
      const haystack = [product.title, product.partNumber, product.series, product.shortDescription, product.longDescription, product.category, ...product.applications].join(" ").toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (categories.length && !categories.some((category) => normalize(category) === normalize(product.categorySlug))) return false;
    if (!matchesAny(product.series, merged.series)) return false;
    if (!matchesAny(spec(product, "Rack Units"), merged.rackUnits)) return false;
    if (!matchesAny(spec(product, "Width"), merged.width)) return false;
    if (!matchesAny(spec(product, "Material"), merged.material)) return false;
    if (!matchesAny(product.leadTime ?? "", merged.leadTime)) return false;
    return true;
  });
  const sort = input.sort ?? "relevance";
  filtered = [...filtered].sort((a, b) => {
    if (sort === "az") return a.title.localeCompare(b.title);
    if (sort === "part") return a.partNumber.localeCompare(b.partNumber);
    if (sort === "availability") return (a.leadTime ?? "zzzz").localeCompare(b.leadTime ?? "zzzz");
    if (query) {
      const aPart = a.partNumber.toLowerCase().includes(query) ? 0 : 1;
      const bPart = b.partNumber.toLowerCase().includes(query) ? 0 : 1;
      if (aPart !== bPart) return aPart - bPart;
    }
    return a.partNumber.localeCompare(b.partNumber);
  });
  const facets: CatalogFacetCounts = { category: {}, series: {}, rackUnits: {}, width: {}, material: {}, leadTime: {} };
  filtered.forEach((product) => { increment(facets.category, product.categorySlug); increment(facets.series, product.series); increment(facets.rackUnits, spec(product, "Rack Units")); increment(facets.width, spec(product, "Width")); increment(facets.material, spec(product, "Material")); increment(facets.leadTime, product.leadTime); });
  const perPage = Math.max(1, input.perPage ?? 12); const pages = Math.max(1, Math.ceil(filtered.length / perPage)); const page = Math.min(Math.max(1, input.page ?? 1), pages); const start = (page - 1) * perPage;
  return { items: filtered.slice(start, start + perPage), total: filtered.length, page, pages, facets, facetCounts: facets };
}
