import { PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/rxl/data/products";
import { applyCatalogQuery, type CatalogQuery, type CatalogQueryResult, type CatalogSort } from "@/lib/rxl/data/catalog-filter";
import type { Product } from "@/lib/rxl/types/catalog";

export type CatalogSearchInput = { query: string; category?: string; filters: Record<string, string[]>; sort: CatalogSort; page: number; perPage: number; };
export type CatalogSearchResult = CatalogQueryResult;
export interface CatalogProvider { listProducts(): Promise<Product[]>; getProductByPartNumber(partNumber: string): Promise<Product | null>; listCategories(): Promise<typeof PRODUCT_CATEGORIES>; search(input: CatalogSearchInput): Promise<CatalogSearchResult>; }
const localCatalogProvider: CatalogProvider = {
  async listProducts() { return PRODUCTS; },
  async getProductByPartNumber(partNumber) { return PRODUCTS.find((product) => product.partNumber.toLowerCase() === decodeURIComponent(partNumber).toLowerCase()) ?? null; },
  async listCategories() { return PRODUCT_CATEGORIES; },
  async search(input) { const query: CatalogQuery = { query: input.query, category: input.category, filters: input.filters, sort: input.sort, page: input.page, perPage: input.perPage }; return applyCatalogQuery(PRODUCTS, query); },
};
export const catalogProvider: CatalogProvider = localCatalogProvider;
