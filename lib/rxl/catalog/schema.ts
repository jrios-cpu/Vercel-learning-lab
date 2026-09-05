export const ODOO_CATEGORY_MAP = {
  "Section 1: Cable Pathways": { name: "Cable Pathways", slug: "cable-pathways" },
  "Section 2: Open Racks": { name: "Open Racks", slug: "open-racks" },
  "Section 3: Cable Management": { name: "Cable Management", slug: "cable-management" },
  "Section 4: Wall Mounts": { name: "Wall Mounts", slug: "wall-mounts" },
  "Section 5: Cabinets and Enclosures": { name: "Cabinets & Enclosures", slug: "cabinets-enclosures" },
} as const;

export type OdooCategoryKey = keyof typeof ODOO_CATEGORY_MAP;
export type DrawingStatus = "live" | "stale" | "invalid" | "missing";
export type DescriptionSource = "odoo" | "display-name-plus-variants";

export type OdooSourceRow = {
  competitorCross: string;
  internalReference: string;
  displayName: string;
  salesDescription: string;
  variantValues: string;
  urlLink: string;
};

export type ImportedOdooProduct = {
  partNumber: string;
  familyId: string;
  title: string;
  category: string;
  categorySlug: string;
  salesDescription: string;
  descriptionSource: DescriptionSource;
  competitorCross: string | null;
  specifications: Record<string, string>;
  drawingPdfUrl: string | null;
};

export type RuntimeCatalogProduct = {
  objectID: string;
  partNumber: string;
  familyId: string;
  title: string;
  category: string;
  categorySlug: string;
  salesDescription: string;
  descriptionSource: DescriptionSource;
  competitorCross: string | null;
  specifications: Record<string, string>;
  drawingPdfUrl: string | null;
  drawingStatus: DrawingStatus;
  imageUrl: string | null;
  source: "odoo";
  canonicalPath: string;
};

export type DrawingValidation = {
  url: string;
  status: Exclude<DrawingStatus, "missing">;
  httpStatus: number | null;
  contentType: string | null;
  checkedAt: string;
  error: string | null;
};

export type CatalogManifest = {
  sourceSha256: string;
  generatedAt: string;
  skuCount: number;
  categoryCounts: Record<string, number>;
  descriptionsFromOdoo: number;
  descriptionFallbacks: number;
  skusWithDrawingUrl: number;
  skusWithoutDrawingUrl: number;
  uniqueDrawingUrls: number;
};

export function normalizeText(value: unknown): string {
  return String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\t ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
}

function canonicalCategoryKey(section: string): OdooCategoryKey {
  const cleaned = normalizeText(section)
    .replace(/\s*\(\d[\d,]*\)\s*$/, "")
    .replace(/\s*&\s*/g, " and ")
    .replace(/\s+/g, " ")
    .trim();

  const match = (Object.keys(ODOO_CATEGORY_MAP) as OdooCategoryKey[]).find(
    (key) => key.toLowerCase() === cleaned.toLowerCase(),
  );
  if (!match) throw new Error(`Unknown Odoo catalog section: ${section}`);
  return match;
}

export function normalizeCategory(section: string) {
  return ODOO_CATEGORY_MAP[canonicalCategoryKey(section)];
}

export function deriveFamilyId(partNumber: string, displayName: string): string {
  const exactPartNumber = normalizeText(partNumber);
  const withoutSkuPrefix = normalizeText(displayName).replace(/^\[[^\]]+\]\s*/, "");
  const beforeVariants = withoutSkuPrefix.split("(", 1)[0]?.trim() ?? "";
  const familyToken = beforeVariants.match(/\bRXL-[A-Z0-9]+(?:-[A-Z0-9]+)*\b/i)?.[0];
  return familyToken ? familyToken.toUpperCase() : exactPartNumber;
}
