import Link from "next/link";
import { QuickQuoteForm } from "@/components/rxl/forms/QuickQuoteForm";
import { catalogProvider } from "@/lib/rxl/providers/catalog";

export const metadata = {
  title: "Request a Quote",
  description: "Request a fast RXL quote starting from a product, quantity, and project context.",
};

export default async function RequestQuotePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const candidate = typeof params.part === "string" ? params.part : typeof params.product === "string" ? params.product : "";
  const products = await catalogProvider.listProducts();
  const initialProduct = candidate ? products.find((product) => product.partNumber === candidate || product.slug === candidate) ?? null : null;

  return (
    <main id="main-content" className="rxl-rfq-page">
      <section className="rxl-rfq-hero">
        <div className="rxl-wrap">
          <nav className="rxl-breadcrumbs rxl-rfq-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Request a Quote</span></nav>
          <span className="rxl-eyebrow">Fast commercial path</span>
          <h1>Know the product? Get the quote request moving.</h1>
          <p>Choose the product, quantity, and project context. If you need engineering options first, use the full configurator instead.</p>
          <div className="rxl-actions"><Link className="rxl-btn rxl-btn-outline-light" href="/configurator">Configure / Start Project</Link></div>
        </div>
      </section>
      <section className="rxl-section rxl-rfq-section">
        <div className="rxl-wrap rxl-rfq-grid">
          <aside className="rxl-rfq-context">
            <span className="rxl-eyebrow">Request a Quote</span>
            <h2>Product first. Project context second.</h2>
            <p>This is the fast path for buyers who already know the system they want quoted.</p>
            <ol>
              <li><span>01</span><div><strong>Select the product</strong><p>Part number carries directly from the catalog or PDP when available.</p></div></li>
              <li><span>02</span><div><strong>Add quantity</strong><p>Capture the commercial scale without pretending live inventory or pricing exists.</p></div></li>
              <li><span>03</span><div><strong>Describe the project</strong><p>Give the sales team enough context to continue the conversation.</p></div></li>
            </ol>
            <div className="rxl-rfq-note">Quick RFQ and the five-step Configurator use the same hardened quote endpoint. CRM/email delivery remains intentionally disconnected until the real integration is approved.</div>
          </aside>
          <div className="rxl-rfq-form-card">
            <div className="rxl-rfq-form-head"><span>Quote request</span><strong>{initialProduct ? `Preselected: ${initialProduct.partNumber}` : "Select a product below"}</strong></div>
            <QuickQuoteForm products={products} initialProduct={initialProduct} />
          </div>
        </div>
      </section>
    </main>
  );
}
