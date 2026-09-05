import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import ExcelJS from "exceljs";
import type { ImportedOdooProduct } from "@/lib/rxl/catalog/schema";
import { parseOdooRows } from "./normalize";

export async function readOdooWorkbook(path: string): Promise<ImportedOdooProduct[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path);
  const worksheet = workbook.worksheets[0];
  if (!worksheet) throw new Error("Odoo workbook has no worksheets");

  const rows: string[][] = [];
  worksheet.eachRow({ includeEmpty: false }, (row) => {
    rows.push(Array.from({ length: 6 }, (_, index) => row.getCell(index + 1).text));
  });
  return parseOdooRows(rows);
}

async function main() {
  const input = process.argv[2];
  const output = process.argv[3] ?? "lib/rxl/data/generated/catalog/source-products.json";
  if (!input) {
    console.error("Usage: npm run catalog:import -- <Odoo Export.xlsx> [output.json]");
    process.exitCode = 2;
    return;
  }

  const inputPath = resolve(input);
  const outputPath = resolve(output);
  const products = await readOdooWorkbook(inputPath);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");

  const categories = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] ?? 0) + 1;
    return acc;
  }, {});
  const fallbacks = products.filter((product) => product.descriptionSource === "display-name-plus-variants").length;
  const drawingUrls = products.map((product) => product.drawingPdfUrl).filter((url): url is string => Boolean(url));

  console.log(JSON.stringify({
    input: inputPath,
    output: outputPath,
    skuCount: products.length,
    categoryCounts: categories,
    descriptionFallbacks: fallbacks,
    skusWithDrawingUrl: drawingUrls.length,
    skusWithoutDrawingUrl: products.length - drawingUrls.length,
    uniqueDrawingUrls: new Set(drawingUrls).size,
  }, null, 2));
}

if (process.argv[1] && /import-odoo\.(?:ts|js)$/.test(process.argv[1])) {
  void main();
}
