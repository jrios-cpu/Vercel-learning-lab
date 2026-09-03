export type ProductMedia = {
  id: string;
  kind: "image" | "diagram";
  src: string;
  alt: string;
  caption?: string;
};

export type ProductDocument = {
  id: string;
  title: string;
  type: "spec-sheet" | "manual" | "certificate" | "cad" | "drawing" | "revit" | "step" | "other";
  href: string | null;
  format?: string;
  size?: string;
};

export type ProductComponent = {
  partNumber: string;
  name: string;
  quantity: number;
  note?: string;
};

export type ProductSeo = {
  title?: string;
  description?: string;
  canonicalPath?: string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  partNumber: string;
  series: string;
  category: string;
  categorySlug: string;
  shortDescription: string;
  longDescription: string;
  status: "representative" | "verified";
  availability?: string | null;
  leadTime?: string | null;
  finish?: string | null;
  specifications: Record<string, string>;
  applications: string[];
  media: ProductMedia[];
  documents: ProductDocument[];
  components: ProductComponent[];
  relatedPartNumbers: string[];
  accessories: string[];
  configurator: {
    enabled: boolean;
    productLine: string;
    defaults?: Record<string, string>;
  };
  seo: ProductSeo;
};
