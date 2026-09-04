import Link from "next/link";
import { DeliveryFlow } from "@/components/rxl/home/DeliveryFlow";
import { RackArtwork } from "@/components/rxl/home/HomeArtwork";

export const metadata = {
  title: "Workflow",
  description: "Explore the representative RXL engineering workflow from client requirements through project completion.",
};

export default function WorkflowPage() {
  return (
    <main id="main-content">
      <section className="rxl-page-head">
        <div className="rxl-wrap">
          <nav className="rxl-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Workflow</span></nav>
          <h1>From requirements to installation.</h1>
          <p>The approved RXL experience presents engineering, fabrication, factory integration, field installation, and closeout as one connected delivery workflow.</p>
        </div>
      </section>
      <section className="rxl-section rxl-workflow-section">
        <div className="rxl-workflow-art" aria-hidden="true"><RackArtwork cols={16} /></div>
        <div className="rxl-wrap rxl-workflow-content">
          <div className="rxl-section-head rxl-section-head-center rxl-on-dark">
            <span className="rxl-section-eyebrow">Engineering Workflow</span>
            <h2>One coordinated path from <em>concept to completion</em>.</h2>
          </div>
          <DeliveryFlow />
        </div>
      </section>
      <section className="rxl-section">
        <div className="rxl-wrap">
          <div className="rxl-value-grid">
            <div className="rxl-value"><h3>Engineer</h3><p>Translate project constraints into manufacturable infrastructure solutions and coordinated documentation.</p></div>
            <div className="rxl-value"><h3>Fabricate</h3><p>Move controlled fabrication, quality review, and assembly into an integrated production environment.</p></div>
            <div className="rxl-value"><h3>Install</h3><p>Carry the approved design intent through site coordination, installation, commissioning support, and closeout.</p></div>
          </div>
          <div className="rxl-home-center-action"><Link className="rxl-btn rxl-btn-primary" href="/configurator">Start Project</Link></div>
        </div>
      </section>
    </main>
  );
}
