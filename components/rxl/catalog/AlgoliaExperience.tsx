import Script from "next/script";
import { getAlgoliaExperienceScriptUrl } from "@/lib/rxl/algolia/experience";

export function AlgoliaExperience() {
  return (
    <section className="rxl-algolia-experience" aria-labelledby="rxl-algolia-heading">
      <div className="rxl-algolia-intro">
        <span className="rxl-section-eyebrow rxl-section-eyebrow-left">Algolia Search</span>
        <h2 id="rxl-algolia-heading">Search the RXL catalog</h2>
        <p>Fast product discovery powered by the connected RXL Algolia experience. Browse filters remain available below while the full Odoo catalog is being indexed.</p>
      </div>
      <div id="autocomplete" className="rxl-algolia-autocomplete" />
      <Script id="rxl-algolia-experiences" src={getAlgoliaExperienceScriptUrl()} strategy="afterInteractive" />
    </section>
  );
}
