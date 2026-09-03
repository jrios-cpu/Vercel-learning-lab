import type { Article, HomeContent, Industry, ResourceItem } from "@/lib/rxl/types/content";

export const homeContent: HomeContent = {
  eyebrow: "RXL Digital Platform",
  title: "Redefining What's Possible.",
  description:
    "Advanced fabrication. Precision engineering. Turnkey infrastructure solutions designed, manufactured, and installed by one engineering partner.",
  primaryCta: { label: "Start Your Project", href: "/configurator" },
  secondaryCta: { label: "Explore Solutions", href: "/products" },
};

export const industries: Industry[] = [
  {
    slug: "hyperscale-ai",
    title: "Hyperscale & AI",
    summary: "Representative application content for high-density compute, accelerated deployment, and evolving thermal requirements.",
    applications: ["High-density compute rows", "Containment", "Liquid-cooling distribution"],
    featuredProductCategories: ["cabinets", "containment", "cooling"],
  },
  {
    slug: "colocation",
    title: "Colocation",
    summary: "Representative application content for repeatable infrastructure programs across multi-tenant environments.",
    applications: ["Repeatable cabinet programs", "Aisle containment", "Project-specific fabrication"],
    featuredProductCategories: ["cabinets", "containment"],
  },
  {
    slug: "enterprise-edge",
    title: "Enterprise & Edge",
    summary: "Representative application content for constrained rooms, retrofit work, and distributed infrastructure.",
    applications: ["Retrofit enclosures", "Network rooms", "Custom assemblies"],
    featuredProductCategories: ["cabinets", "cooling"],
  },
];

export const articles: Article[] = [
  {
    slug: "hyperscale-row-eleven-weeks",
    title: "Hyperscale row delivered in eleven weeks",
    type: "Case Study",
    summary: "A representative case-study concept for a 52U hyperscale cabinet program delivered inside a single quarter.",
    body: [
      "This Preview article demonstrates the approved case-study layout and content hierarchy.",
      "Project facts, customer names, metrics, photography, and outcomes must be replaced with verified RXL material before Production use.",
    ],
    status: "representative",
  },
  {
    slug: "liquid-cooling-live-hall",
    title: "Liquid cooling retrofit in a live hall",
    type: "Case Study",
    summary: "Representative content showing how a live-environment retrofit story will be presented.",
    body: [
      "The final article will combine engineering context, project constraints, execution detail, and measurable outcomes.",
      "This record intentionally contains no unverified customer or performance claims.",
    ],
    status: "representative",
  },
  {
    slug: "containment-suppression-testing",
    title: "Containment that survives suppression testing",
    type: "Engineering",
    summary: "Representative engineering insight on containment and suppression-system coordination.",
    body: [
      "Engineering articles will explain design decisions in practical terms for technical buyers.",
      "Final claims and specifications require RXL engineering approval.",
    ],
    status: "representative",
  },
  {
    slug: "shop-fabrication-field-welding",
    title: "Shop fabrication versus field welding",
    type: "Engineering",
    summary: "Representative insight about shifting fabrication work into a controlled shop environment.",
    body: [
      "This Preview entry demonstrates article taxonomy and layout only.",
      "Verified process details and photography will be supplied by RXL before launch.",
    ],
    status: "representative",
  },
  {
    slug: "reno-fabrication-capacity",
    title: "RXL expands Reno fabrication capacity",
    type: "News",
    summary: "Representative news-card copy from the supplied prototype; not a verified announcement.",
    body: [
      "News content will be managed through the future content provider.",
      "This sample must not be treated as a current public announcement.",
    ],
    status: "representative",
  },
  {
    slug: "gpu-density-cabinet-selection",
    title: "Selecting a cabinet for GPU density",
    type: "Engineering",
    summary: "Representative technical content about load, airflow, and cable-volume considerations.",
    body: [
      "The production article can connect technical guidance to relevant catalog records.",
      "Specific ratings and recommendations must come from verified product data.",
    ],
    status: "representative",
  },
];

export const resources: ResourceItem[] = [
  { id: "resource-specs", title: "Product specification library", type: "Spec Sheet", href: null, status: "representative" },
  { id: "resource-manuals", title: "Installation and operations manuals", type: "Manual", href: null, status: "representative" },
  { id: "resource-cad", title: "CAD and drawing library", type: "CAD", href: null, status: "representative" },
  { id: "resource-cert", title: "Certificates and compliance documents", type: "Certificate", href: null, status: "representative" },
];
