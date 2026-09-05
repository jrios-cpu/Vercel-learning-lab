import { createHash } from "node:crypto";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import ExcelJS from "exceljs";
import type { ImportedOdooProduct } from "@/lib/rxl/catalog/schema";
import { parseOdooRows } from "./normalize";

export async function readOdooWorkbook(path: string): Promise<ImportedOdooProduct[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path);
  const worksheet = workbook.getWorksheet("Sheet1") ?? workbook.worksheets[0];
  if (!worksheet) throw new Error("Odoo workbook has no worksheets");

  const rows: string[][] = [];
  worksheet.eachRow({ includeEmpty: false }, (row) => {
    rows.push(Array.from({ length: 6 }, (_, index) => row.getCell(index + 1).text));
  });
  return parseOdooRows(rows);
}

function readFlag(name: string): string | null {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`Missing value for ${name}`);
  return value;
}

export async function sha256File(path: string): Promise<string> {
  const bytes = await readFile(path);
  return createHash("sha256").update(bytes).digest("hex");
}

async function main() {
  const input = readFlag("--input");
  const out = readFlag("--out");
  if (!input || !out) {
    console.error('Usage: npm run catalog:import -- --input "/absolute/path/Odoo Export.xlsx" --out "/absolute/path/catalog-work"');
    process.exitCode = 2;
    return;
  }

  const inputPath = resolve(input);
  const outDir = resolve(out);
  const products = await readOdooWorkbook(inputPath);
  const sourceSha256 = await sha256File(inputPath);
  await mkdir(outDir, { recursive: true });

  const categoryCounts = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.categorySlug] = (acc[product.categorySlug] ?? 0) + 1;
    return acc;
  }, {});
  const descriptionFallbacks = products.filter((product) => product.descriptionSource === "display-name-plus-variants").length;
  const drawingUrls = products.map((product) => product.drawingPdfUrl).filter((url): url is string => Boolean(url));
  const sourceMeta = {
    inputBasename: inputPath.split(/[\\/]/).pop() ?? "Odoo Export.xlsx",
    sourceSha256,
    skuCount: products.length,
    categoryCounts,
    descriptionsFromOdoo: products.length - descriptionFallbacks,
    descriptionFallbacks,
    skusWithDrawingUrl: drawingUrls.length,
    skusWithoutDrawingUrl: products.length - drawingUrls.length,
    uniqueDrawingUrls: new Set(drawingUrls).size,
  };

  await writeFile(resolve(outDir, "imported-products.json"), `${JSON.stringify(products, null, 2)}\n`, "utf8");
  await writeFile(resolve(outDir, "source-meta.json"), `${JSON.stringify(sourceMeta, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(sourceMeta, null, 2));
}

if (process.argv[1] && /import-odoo\.(?:ts|js)$/.test(process.argv[1])) {
  void main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
