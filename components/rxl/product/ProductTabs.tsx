"use client";

import { useState } from "react";
import type { Product } from "@/lib/rxl/types/catalog";
import { ProductDocuments } from "./ProductDocuments";

const tabs = ["Specifications", "Description", "What Is Included", "Documents", "Compliance", "CAD / Drawings", "Applications"] as const;
type Tab = (typeof tabs)[number];
const tabId = (tab: Tab) => `tab-${tab.replaceAll(" ", "-").toLowerCase()}`;

export function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<Tab>("Specifications");
  const activate = (tab: Tab) => {
    setActive(tab);
    window.requestAnimationFrame(() => document.getElementById(tabId(tab))?.focus());
  };
  return (
    <section className="rxl-pdp-detail-tabs" aria-label="Product details">
      <div className="rxl-pdp-tablist" role="tablist" aria-label="Product details">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            id={tabId(tab)}
            type="button"
            role="tab"
            aria-selected={active === tab}
            aria-controls="rxl-product-panel"
            tabIndex={active === tab ? 0 : -1}
            onClick={() => setActive(tab)}
            onKeyDown={(event) => {
              if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              if (event.key === "Home") return activate(tabs[0]);
              if (event.key === "End") return activate(tabs[tabs.length - 1]);
              const offset = event.key === "ArrowRight" ? 1 : -1;
              activate(tabs[(index + offset + tabs.length) % tabs.length]);
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div id="rxl-product-panel" role="tabpanel" aria-labelledby={tabId(active)} className="rxl-pdp-panel">
        {active === "Specifications" && (
          <dl className="rxl-spec-table">
            {Object.entries(product.specifications).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
        )}
        {active === "Description" && <p>{product.longDescription}</p>}
        {active === "What Is Included" && (product.components.length ? <ul>{product.components.map((component) => <li key={component.partNumber}>{component.quantity} × {component.name} <code>{component.partNumber}</code></li>)}</ul> : <p>Included-component data is not connected in this Preview.</p>)}
        {active === "Documents" && <ProductDocuments documents={product.documents} />}
        {active === "Compliance" && <p>Compliance and certification claims are intentionally withheld until verified RXL source data is connected.</p>}
        {active === "CAD / Drawings" && <p>CAD, Revit, STEP, and drawing downloads are adapter-ready but not connected in this Preview.</p>}
        {active === "Applications" && <ul>{product.applications.map((application) => <li key={application}>{application}</li>)}</ul>}
      </div>
    </section>
  );
}
