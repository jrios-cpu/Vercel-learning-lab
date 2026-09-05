import {
  cleanDisplayName,
  deriveFamilyId,
  normalizeCategory,
  normalizeText,
  type ImportedOdooProduct,
} from "@/lib/rxl/catalog/schema";

export type OdooMatrixRow = readonly unknown[];

type DraftProduct = {
  partNumber: string;
  familyId: string;
  title: string;
  rawDisplayName: string;
  category: string;
  categorySlug: string;
  salesDescription: string;
  competitorCross: string | null;
  drawingPdfUrl: string | null;
  specificationValues: Record<string, string[]>;
};

function parseVariantEntry(rawValue: unknown): { key: string; value: string } | null {
  const normalized = normalizeText(rawValue).replace(/^Section\s+\d+\s*:\s*/i, "");
  if (!normalized) return null;
  const colon = normalized.indexOf(":");
  if (colon < 1) throw new Error(`Invalid Odoo Variant Values entry: ${normalized}`);
  const key = normalizeText(normalized.slice(0, colon));
  const value = normalizeText(normalized.slice(colon + 1));
  if (!key || !value) throw new Error(`Invalid Odoo Variant Values entry: ${normalized}`);
  return { key, value };
}

function addVariant(target: Record<string, string[]>, rawValue: unknown) {
  const parsed = parseVariantEntry(rawValue);
  if (!parsed) return;
  const values = target[parsed.key] ?? [];
  if (!values.includes(parsed.value)) values.push(parsed.value);
  target[parsed.key] = values;
}

function finalizeDraft(draft: DraftProduct): ImportedOdooProduct {
  const specifications = Object.fromEntries(
    Object.entries(draft.specificationValues).map(([key, values]) => [key, values.join(" / ")]),
  );
  const sourceDescription = normalizeText(draft.salesDescription);
  const fallbackVariants = Object.entries(draft.specificationValues)
    .flatMap(([key, values]) => values.map((value) => `${key}: ${value}`))
    .join("\n");
  const salesDescription = sourceDescription || [draft.rawDisplayName, fallbackVariants].filter(Boolean).join("\n");

  return {
    partNumber: draft.partNumber,
    familyId: draft.familyId,
    title: draft.title,
    rawDisplayName: draft.rawDisplayName,
    category: draft.category,
    categorySlug: draft.categorySlug,
    salesDescription,
    descriptionSource: sourceDescription ? "odoo" : "display-name-plus-variants",
    competitorCross: draft.competitorCross,
    specifications,
    specificationValues: draft.specificationValues,
    drawingPdfUrl: draft.drawingPdfUrl,
  };
}

export function parseOdooRows(rows: readonly OdooMatrixRow[]): ImportedOdooProduct[] {
  if (rows.length === 0) return [];
  const header = rows[0]?.map((value) => normalizeText(value)).slice(0, 6) ?? [];
  const expected = ["Competitor Cross", "Internal Reference", "Display Name", "Sales Description", "Variant Values", "URL Link"];
  if (expected.some((name, index) => header[index] !== name)) {
    throw new Error(`Unexpected Odoo export header: ${header.join(" | ")}`);
  }

  const products: ImportedOdooProduct[] = [];
  const seen = new Set<string>();
  let currentSection = "";
  let draft: DraftProduct | null = null;

  const flush = () => {
    if (!draft) return;
    const product = finalizeDraft(draft);
    if (seen.has(product.partNumber)) throw new Error(`Duplicate Odoo Internal Reference: ${product.partNumber}`);
    seen.add(product.partNumber);
    products.push(product);
    draft = null;
  };

  for (const row of rows.slice(1)) {
    const competitorCross = normalizeText(row[0]);
    const partNumber = normalizeText(row[1]);
    const displayName = normalizeText(row[2]);
    const salesDescription = normalizeText(row[3]);
    const variantValue = row[4];
    const drawingUrl = normalizeText(row[5]);

    if (!partNumber && competitorCross.startsWith("Section ")) {
      flush();
      currentSection = competitorCross;
      continue;
    }

    if (partNumber) {
      flush();
      if (!currentSection) throw new Error(`SKU ${partNumber} appeared before an Odoo section heading`);
      if (!displayName) throw new Error(`SKU ${partNumber} is missing Display Name`);
      const category = normalizeCategory(currentSection);
      const specificationValues: Record<string, string[]> = {};
      addVariant(specificationValues, variantValue);
      draft = {
        partNumber,
        familyId: deriveFamilyId(partNumber, displayName),
        title: cleanDisplayName(partNumber, displayName),
        rawDisplayName: displayName,
        category: category.name,
        categorySlug: category.slug,
        salesDescription,
        competitorCross: competitorCross || null,
        drawingPdfUrl: drawingUrl || null,
        specificationValues,
      };
      continue;
    }

    if (draft && normalizeText(variantValue)) addVariant(draft.specificationValues, variantValue);
  }

  flush();
  return products;
}
