import type { Product } from "@/lib/rxl/types/catalog";

type RawProduct = readonly [
  partNumber: string,
  title: string,
  categorySlug: "cabinets" | "containment" | "cooling",
  series: string,
  rackUnits: number | null,
  width: number | null,
  depth: number | null,
  material: string,
  finish: string,
  load: number | null,
  leadTime: string,
  shortDescription: string,
];

export const PRODUCT_CATEGORIES = {
  cabinets: { name: "Cabinets & Racks", slug: "cabinets", blurb: "High performance infrastructure designed to support evolving technology environments." },
  containment: { name: "Containment Systems", slug: "containment", blurb: "Designed to maximize airflow efficiency, improve cable management, and support mission critical loads." },
  cooling: { name: "Cooling & Manifolds", slug: "cooling", blurb: "Engineered cooling distribution systems manufactured to exact project specifications." },
} as const;

const RAW_PRODUCTS: RawProduct[] = [
  ["RXL-VL-4260-BK","VaultLine 42U Server Cabinet 600 x 1200","cabinets","VaultLine",42,600,1200,"Steel","Textured Black",1500,"In stock","The workhorse enclosure for standard server deployments with high open-area doors and serviceable cable routing."],
  ["RXL-VL-4280-BK","VaultLine 42U Server Cabinet 800 x 1200","cabinets","VaultLine",42,800,1200,"Steel","Textured Black",1500,"In stock","Wide-bay enclosure with additional vertical cable-management space for dense patching."],
  ["RXL-VL-4780-BK","VaultLine 47U Server Cabinet 800 x 1200","cabinets","VaultLine",47,800,1200,"Steel","Textured Black",1600,"2 to 3 weeks","Extended-height enclosure for deployments where rack-unit density matters."],
  ["RXL-VL-4880-GY","VaultLine 48U High Density Cabinet 800 x 1200","cabinets","VaultLine",48,800,1200,"Steel","Light Grey",1800,"2 to 3 weeks","Reinforced high-density enclosure concept for heavier compute deployments."],
  ["RXL-VL-4260-GY","VaultLine 42U Server Cabinet 600 x 1000","cabinets","VaultLine",42,600,1000,"Steel","Light Grey",1360,"In stock","Shallow-depth enclosure concept for edge rooms and constrained retrofit spaces."],
  ["RXL-VL-5280-GY","VaultLine 52U Hyperscale Cabinet 800 x 1200","cabinets","VaultLine",52,800,1200,"Steel","Light Grey",2000,"6 to 8 weeks","Tall cabinet concept for hyperscale rows and high-density floor plans."],
  ["RXL-VL-2460-BK","VaultLine 24U Wall Mount Cabinet","cabinets","VaultLine",24,600,600,"Steel","Textured Black",90,"In stock","Wall-mounted enclosure concept for IDF closets and distributed edge deployments."],
  ["RXL-VL-1260-BK","VaultLine 12U Wall Mount Cabinet","cabinets","VaultLine",12,600,450,"Steel","Textured Black",60,"In stock","Compact wall enclosure concept for branch, security, and building-control applications."],
  ["RXL-NB-4260-BK","NetBay 42U Network Cabinet 600 x 800","cabinets","NetBay",42,600,800,"Steel","Textured Black",1200,"In stock","Network-oriented cabinet concept with cable-management space for switching environments."],
  ["RXL-NB-4580-BK","NetBay 45U Network Cabinet 800 x 800","cabinets","NetBay",45,800,800,"Steel","Textured Black",1200,"2 to 3 weeks","Wide network-bay concept for chassis switching and front-to-rear airflow."],
  ["RXL-NB-4270-BK","NetBay 42U Colocation Cabinet, dual compartment","cabinets","NetBay",42,700,1200,"Steel","Textured Black",1400,"2 to 3 weeks","Dual-compartment cabinet concept for multi-tenant colocation environments."],
  ["RXL-OF-4245-BK","OpenFrame 42U Two Post Rack","cabinets","OpenFrame",42,483,150,"Aluminum","Textured Black",450,"In stock","Lightweight two-post frame concept for patching fields and light network gear."],
  ["RXL-OF-4545-BK","OpenFrame 45U Four Post Rack","cabinets","OpenFrame",45,483,760,"Aluminum","Textured Black",900,"In stock","Adjustable four-post frame concept for deeper chassis and rail-mounted equipment."],
  ["RXL-OF-4845-GY","OpenFrame 48U Four Post Rack","cabinets","OpenFrame",48,483,900,"Aluminum","Light Grey",900,"2 to 3 weeks","Tall open-frame concept for deep chassis and cable-dense rows."],
  ["RXL-AP-HAC-STD","Aisle Pro Hot Aisle Containment, standard bay","containment","Aisle Pro",null,1200,null,"Steel and Polycarbonate","Clear Anodized",null,"2 to 3 weeks","Modular hot-aisle containment concept designed around cabinet-row integration."],
  ["RXL-AP-HAC-EXT","Aisle Pro Hot Aisle Containment, extended height bay","containment","Aisle Pro",null,1200,null,"Steel and Polycarbonate","Clear Anodized",null,"6 to 8 weeks","Extended-height containment concept for taller rooms and overhead return strategies."],
  ["RXL-AP-CAC-STD","Aisle Pro Cold Aisle Containment, standard bay","containment","Aisle Pro",null,1200,null,"Steel and Polycarbonate","Clear Anodized",null,"2 to 3 weeks","Cold-aisle containment concept intended to isolate supply air at the row."],
  ["RXL-AP-DR-SL","Aisle Pro Sliding End Door Assembly","containment","Aisle Pro",null,1800,null,"Aluminum","Clear Anodized",null,"2 to 3 weeks","Sliding end-door concept for aisles where swing clearance is constrained."],
  ["RXL-AP-DR-SW","Aisle Pro Swing End Door Assembly","containment","Aisle Pro",null,1800,null,"Aluminum","Clear Anodized",null,"In stock","Swing end-door concept for containment runs with conventional aisle clearance."],
  ["RXL-AP-BR-KIT","Aisle Pro Row Transition Bridge Kit","containment","Aisle Pro",null,600,null,"Aluminum","Clear Anodized",null,"In stock","Transition bridge concept for maintaining containment across structural interruptions."],
  ["RXL-TS-CP-600","ThermaSeal Ceiling Panel 600mm","containment","ThermaSeal",null,600,null,"Steel and Polycarbonate","Clear",null,"In stock","Rigid ceiling-panel concept sized around a 600 mm cabinet pitch."],
  ["RXL-TS-CP-800","ThermaSeal Ceiling Panel 800mm","containment","ThermaSeal",null,800,null,"Steel and Polycarbonate","Clear",null,"In stock","Rigid ceiling-panel concept sized around an 800 mm cabinet pitch."],
  ["RXL-TS-VP-42","ThermaSeal Vertical Blanking Panel Kit 42U","containment","ThermaSeal",42,483,null,"Steel","Textured Black",null,"In stock","Full-height blanking-panel concept for managing bypass airflow in unused rack space."],
  ["RXL-TS-GS-STD","ThermaSeal Gap Seal Brush Kit","containment","ThermaSeal",null,null,null,"Steel","Textured Black",null,"In stock","Brush-and-gasket concept for cable entries, row ends, and cabinet-to-cabinet gaps."],
  ["RXL-SP-DP-600","SkyPanel Drop Away Ceiling Panel 600mm","containment","SkyPanel",null,600,null,"Aluminum","Clear",null,"2 to 3 weeks","Drop-away ceiling-panel concept for fire-suppression clearance planning."],
  ["RXL-SP-DP-800","SkyPanel Drop Away Ceiling Panel 800mm","containment","SkyPanel",null,800,null,"Aluminum","Clear",null,"2 to 3 weeks","Wide-bay drop-away panel concept for containment ceiling systems."],
  ["RXL-FC-MAN-08","FlowCore 8 Port Cooling Manifold","cooling","FlowCore",null,null,null,"Stainless Steel","Brushed",null,"2 to 3 weeks","Eight-port liquid-cooling manifold concept with branch isolation."],
  ["RXL-FC-MAN-12","FlowCore 12 Port Cooling Manifold","cooling","FlowCore",null,null,null,"Stainless Steel","Brushed",null,"2 to 3 weeks","Twelve-port manifold concept for row-level liquid-cooling distribution."],
  ["RXL-FC-MAN-16","FlowCore 16 Port Cooling Manifold","cooling","FlowCore",null,null,null,"Stainless Steel","Brushed",null,"6 to 8 weeks","Sixteen-port manifold concept for denser direct-to-chip deployment layouts."],
  ["RXL-FC-MAN-24","FlowCore 24 Port Cooling Manifold","cooling","FlowCore",null,null,null,"Stainless Steel","Brushed",null,"6 to 8 weeks","Twenty-four-port manifold concept for large row-level distribution requirements."],
  ["RXL-FC-QD-KIT","FlowCore Quick Disconnect Hose Kit","cooling","FlowCore",null,null,null,"Stainless Steel","Brushed",null,"In stock","Quick-disconnect hose concept for serviceable liquid-cooling branch connections."],
  ["RXL-CL-SEC-350","CDU Link Secondary Loop Assembly 350kW","cooling","CDU Link",null,null,null,"Copper","Insulated",null,"6 to 8 weeks","Prefabricated secondary-loop concept for a 350 kW-class cooling distribution unit."],
  ["RXL-CL-SEC-500","CDU Link Secondary Loop Assembly 500kW","cooling","CDU Link",null,null,null,"Copper","Insulated",null,"6 to 8 weeks","Prefabricated secondary-loop concept for a 500 kW-class cooling distribution unit."],
  ["RXL-CL-PIP-STD","CDU Link Prefabricated Pipe Run, standard span","cooling","CDU Link",null,null,null,"Copper","Insulated",null,"2 to 3 weeks","Shop-fabricated pipe-run concept intended to reduce field fabrication."],
  ["RXL-RD-HX-42","RearDoor Heat Exchanger 42U Passive","cooling","RearDoor",42,600,null,"Copper","Textured Black",null,"6 to 8 weeks","Passive rear-door heat-exchanger concept for capturing rack exhaust."],
  ["RXL-RD-HX-48A","RearDoor Heat Exchanger 48U Active","cooling","RearDoor",48,800,null,"Copper","Textured Black",null,"6 to 8 weeks","Active rear-door heat-exchanger concept with fan-assisted airflow."],
];

function applicationsFor(categorySlug: RawProduct[2]) {
  if (categorySlug === "cabinets") return ["Data center white space", "Network rooms", "Edge infrastructure"];
  if (categorySlug === "containment") return ["Hot aisle containment", "Cold aisle containment", "Airflow management"];
  return ["Liquid cooling distribution", "High-density compute", "Data center thermal management"];
}

function toSpecifications(raw: RawProduct) {
  const [, , , , rackUnits, width, depth, material, finish, load] = raw;
  return Object.fromEntries([
    rackUnits ? ["Rack Units", `${rackUnits}U`] : null,
    width ? ["Width", `${width} mm`] : null,
    depth ? ["Depth", `${depth} mm`] : null,
    ["Material", material],
    ["Finish", finish],
    load ? ["Representative Load", `${load} kg`] : null,
  ].filter((entry): entry is [string, string] => Boolean(entry)));
}

export const PRODUCTS: Product[] = RAW_PRODUCTS.map((raw) => {
  const [partNumber, title, categorySlug, series, , , , , finish, , leadTime, shortDescription] = raw;
  const category = PRODUCT_CATEGORIES[categorySlug];
  return {
    id: partNumber,
    title,
    slug: partNumber.toLowerCase(),
    partNumber,
    series,
    category: category.name,
    categorySlug,
    shortDescription,
    longDescription: `${shortDescription} This is representative Preview content derived from the approved RXL prototype and is not live commercial data.`,
    status: "representative",
    availability: null,
    leadTime,
    finish,
    specifications: toSpecifications(raw),
    applications: applicationsFor(categorySlug),
    media: [],
    documents: [{ id: `${partNumber}-spec`, title: `${title} specification sheet`, type: "spec-sheet", href: null, format: "PDF" }],
    components: [],
    relatedPartNumbers: RAW_PRODUCTS.filter((candidate) => candidate[3] === series && candidate[0] !== partNumber).slice(0, 3).map((candidate) => candidate[0]),
    accessories: [],
    configurator: { enabled: true, productLine: series, defaults: { partNumber } },
    seo: { title, description: shortDescription, canonicalPath: `/products/${categorySlug}/${encodeURIComponent(partNumber)}` },
  };
});

export const PRODUCT_SERIES = [...new Set(PRODUCTS.map((product) => product.series))].sort();
