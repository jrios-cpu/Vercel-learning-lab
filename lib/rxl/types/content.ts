export type HomeContent = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export type Industry = {
  slug: string;
  title: string;
  summary: string;
  applications: string[];
  featuredProductCategories: string[];
};

export type Article = {
  slug: string;
  title: string;
  type: "Case Study" | "Engineering" | "News";
  summary: string;
  body: string[];
  publishedAt?: string;
  status: "representative" | "verified";
};

export type ResourceItem = {
  id: string;
  title: string;
  type: "Spec Sheet" | "Manual" | "Certificate" | "CAD" | "Drawing" | "Other";
  href: string | null;
  status: "representative" | "verified";
};
