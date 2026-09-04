import type { Product } from "@/lib/rxl/types/catalog";

export const VERIFIED_PRODUCTS: Product[] = [
  {
    id: "RXL-5001-BK",
    title: "RXL-5001 LED Light Bar — Black",
    slug: "rxl-5001-bk",
    partNumber: "RXL-5001-BK",
    series: "RXL-5001",
    category: "Cabinets & Enclosures",
    categorySlug: "cabinets",
    shortDescription: "LED light bar.",
    longDescription: "RXL-5001 LED light bar. Product identity, color, and drawing source are taken from the supplied Odoo export.",
    status: "verified",
    availability: null,
    leadTime: null,
    finish: "Black",
    specifications: { Color: "Black" },
    applications: ["Cabinets & enclosures"],
    media: [],
    documents: [
      {
        id: "RXL-5001-BK-drawing",
        title: "RXL-5001 technical drawing",
        type: "drawing",
        href: "https://www.rxlusa.com/wp-content/uploads/SolidDrawings/RXL-5001-X.pdf",
        format: "PDF",
      },
    ],
    components: [],
    relatedPartNumbers: [],
    accessories: [],
    configurator: { enabled: true, productLine: "RXL-5001", defaults: { partNumber: "RXL-5001-BK" } },
    seo: {
      title: "RXL-5001 LED Light Bar — Black",
      description: "RXL-5001 LED light bar, black finish.",
      canonicalPath: "/products/cabinets/RXL-5001-BK",
    },
  },
];
