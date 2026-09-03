export type Product = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  status: string;
  partNumber: string;
  image: string;
  imageAlt: string;
  specs: Record<string, string>;
  uses: string[];
  downloads: string[];
  related: string[];
};

export const products: Product[] = [
  {
    slug: "structural-frame-x1",
    name: "Structural Frame X1",
    category: "Framing",
    summary:
      "Modular steel frame system engineered for repeatable commercial and mission-critical builds.",
    status: "Configured",
    partNumber: "SFX1-240",
    image:
      "https://images.unsplash.com/photo-1643119775771-54a727776db5?auto=format&fit=crop&w=1800&q=82",
    imageAlt: "Curved metal architectural facade",
    specs: { Material: "Galvanized steel", Height: "2400 mm", Load: "18 kN", Finish: "G90" },
    uses: ["Commercial structures", "Mission-critical facilities", "Repeatable modular assemblies"],
    downloads: ["Technical data sheet", "Installation guide"],
    related: ["thermal-panel-t40", "rackshield-r2"],
  },
  {
    slug: "thermal-panel-t40",
    name: "Thermal Panel T40",
    category: "Envelope",
    summary: "High-performance insulated panel for clean, efficient building envelopes.",
    status: "In review",
    partNumber: "TPT40-120",
    image:
      "https://images.unsplash.com/photo-1772300704502-410f0fbd43bb?auto=format&fit=crop&w=1800&q=82",
    imageAlt: "Minimal industrial interior with polished concrete floor",
    specs: { Core: "PIR", Thickness: "120 mm", "R-value": "R-32", Width: "1000 mm" },
    uses: ["High-performance envelopes", "Temperature-controlled facilities", "Architectural industrial projects"],
    downloads: ["Thermal performance", "Warranty overview"],
    related: ["structural-frame-x1", "rackshield-r2"],
  },
  {
    slug: "rackshield-r2",
    name: "RackShield R2",
    category: "Protection",
    summary: "Protective rack and equipment enclosure for demanding industrial facilities.",
    status: "Ready",
    partNumber: "RSR2-48",
    image:
      "https://images.unsplash.com/photo-1774770080861-bc2c50829c92?auto=format&fit=crop&w=1800&q=82",
    imageAlt: "Modern architectural atrium with structured balconies",
    specs: { Material: "Powder-coated steel", Width: "48 in", Rating: "NEMA 3R", Mount: "Floor" },
    uses: ["Equipment protection", "Industrial operations", "Critical infrastructure rooms"],
    downloads: ["Product brochure", "Maintenance guide"],
    related: ["structural-frame-x1", "thermal-panel-t40"],
  },
];

export type Job = {
  slug: string;
  title: string;
  team: string;
  location: string;
  type: string;
  summary: string;
  responsibilities: string[];
  strengths: string[];
};

export const jobs: Job[] = [
  {
    slug: "frontend-platform-engineer",
    title: "Frontend Platform Engineer",
    team: "Digital",
    location: "Remote / Americas",
    type: "Full-time",
    summary: "Own reusable frontend systems, deployment quality and performance.",
    responsibilities: [
      "Build and maintain reusable frontend foundations across product experiences.",
      "Improve deployment quality, performance, accessibility and observability.",
      "Partner with design and product teams to turn patterns into durable systems.",
    ],
    strengths: ["Next.js", "TypeScript", "CI/CD", "Accessibility"],
  },
  {
    slug: "product-content-specialist",
    title: "Product Content Specialist",
    team: "Marketing",
    location: "Remote / US",
    type: "Full-time",
    summary: "Translate technical product information into structured digital content.",
    responsibilities: [
      "Turn technical source material into clear product content and structured data.",
      "Maintain consistent specifications, terminology and metadata across experiences.",
      "Work with product and commercial teams to make complex information easier to use.",
    ],
    strengths: ["Product content", "Structured data", "Technical writing", "Content QA"],
  },
  {
    slug: "solutions-engineer",
    title: "Solutions Engineer",
    team: "Commercial",
    location: "Dallas, TX",
    type: "Full-time",
    summary: "Connect customer requirements with configurable product solutions.",
    responsibilities: [
      "Translate customer requirements into practical product configurations.",
      "Support technical discovery and commercial handoff for complex opportunities.",
      "Partner with product teams on recurring requirements and solution gaps.",
    ],
    strengths: ["Technical discovery", "Solution design", "Customer communication", "Commercial systems"],
  },
  {
    slug: "product-designer",
    title: "Product Designer",
    team: "Digital",
    location: "Remote / Americas",
    type: "Full-time",
    summary: "Shape clear, elegant workflows for technical and commercial product experiences.",
    responsibilities: [
      "Design product and workflow experiences that make complex systems easier to understand.",
      "Create reusable interaction patterns with strong accessibility and responsive behavior.",
      "Partner closely with engineering to carry design quality through implementation.",
    ],
    strengths: ["Product design", "Systems thinking", "Prototyping", "Accessibility"],
  },
  {
    slug: "deployment-reliability-engineer",
    title: "Deployment Reliability Engineer",
    team: "Platform",
    location: "Remote / Americas",
    type: "Full-time",
    summary: "Improve deployment confidence, runtime visibility and production resilience.",
    responsibilities: [
      "Own deployment guardrails and release-quality tooling across environments.",
      "Improve observability, runtime diagnosis and safe failure behavior.",
      "Turn recurring incidents into platform improvements and automated checks.",
    ],
    strengths: ["Vercel", "Observability", "CI/CD", "Reliability engineering"],
  },
  {
    slug: "customer-success-systems-specialist",
    title: "Customer Success Systems Specialist",
    team: "Customer Experience",
    location: "Chicago, IL",
    type: "Full-time",
    summary: "Build the systems and operating rhythms that make customer work easier to manage.",
    responsibilities: [
      "Improve customer workflows, handoffs and internal operating visibility.",
      "Translate recurring customer friction into process and tooling improvements.",
      "Partner across commercial, product and operations teams on service quality.",
    ],
    strengths: ["Customer operations", "Process design", "Systems thinking", "Cross-functional delivery"],
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const jobBySlug = (slug: string) => jobs.find((j) => j.slug === slug);
