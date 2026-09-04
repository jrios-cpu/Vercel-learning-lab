import Link from "next/link";
import { DeliveryFlow } from "@/components/rxl/home/DeliveryFlow";
import { HomeHero } from "@/components/rxl/home/HomeHero";
import { LogoBandArtwork, RackArtwork } from "@/components/rxl/home/HomeArtwork";
import { PRODUCT_CATEGORIES } from "@/lib/rxl/data/products";
import { contentProvider } from "@/lib/rxl/providers/content";

const featured = ["containment", "cooling", "cabinets"] as const;
const caseStudyStages = ["Challenge", "Engineering Process", "Fabrication", "Installation"] as const;

export default async function HomePage() {
  const home = await contentProvider.getHome();

  return (
    <main id="main-content">
      <HomeHero content={home} />

      <section className="rxl-section rxl-section-gray rxl-about-home">
        <div className="rxl-wrap">
          <div className="rxl-section-head rxl-section-head-center">
            <span className="rxl-section-eyebrow">About RXL Digital Platform</span>
            <h2>Engineering the Future.<br />Delivering <em>With Precision.</em></h2>
          </div>
          <div className="rxl-home-split">
            <div className="rxl-home-rack-visual"><div className="rxl-home-halo" /><RackArtwork tone="light" cols={5} /></div>
            <div className="rxl-home-copy">
              <p>RXL is more than a manufacturer. We are an engineering-driven infrastructure partner specializing in the design, fabrication, and installation of mission-critical solutions. From concept to commissioning, we provide a seamless, end-to-end approach that helps organizations build reliable, scalable, and high-performance environments.</p>
              <p>Driven by innovation and technical expertise, our team collaborates closely with data center operators, contractors, consultants, and enterprise clients to transform complex requirements into engineered solutions. Every project is backed by meticulous planning and precision execution.</p>
              <Link className="rxl-btn rxl-btn-primary" href="/about">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="rxl-section rxl-featured-solutions">
        <div className="rxl-wrap">
          <div className="rxl-section-head rxl-section-head-center">
            <span className="rxl-section-eyebrow">Featured Solutions</span>
            <h2>Engineered Infrastructure<br /><em>Solutions</em></h2>
          </div>
          <div className="rxl-feature-card-grid">
            {featured.map((slug, index) => {
              const category = PRODUCT_CATEGORIES[slug];
              return (
                <Link className={`rxl-feature-card${index === 1 ? " rxl-feature-card-accent" : ""}`} href={`/products/${slug}`} key={slug}>
                  <div className="rxl-feature-card-art"><RackArtwork cols={5} /></div>
                  <div className="rxl-feature-card-body">
                    <h3>{category.name}</h3>
                    <p>{category.blurb}</p>
                    <span>Read More <b>→</b></span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="rxl-home-center-action"><Link className="rxl-btn rxl-btn-primary" href="/resources">Download Specifications</Link></div>
        </div>
      </section>

      <section className="rxl-section rxl-workflow-section" id="workflow">
        <div className="rxl-workflow-art" aria-hidden="true"><RackArtwork cols={16} /></div>
        <div className="rxl-wrap rxl-workflow-content">
          <div className="rxl-section-head rxl-section-head-center rxl-on-dark">
            <span className="rxl-section-eyebrow">Engineering Workflow</span>
            <h2>From Requirements To<br /><em>Installation</em></h2>
          </div>
          <DeliveryFlow />
          <div className="rxl-home-center-action"><Link className="rxl-btn rxl-btn-ghost" href="/workflow">Explore Full Workflow</Link></div>
        </div>
      </section>

      <section className="rxl-section rxl-why-home">
        <div className="rxl-wrap">
          <div className="rxl-section-head rxl-section-head-center">
            <span className="rxl-section-eyebrow">Why RXL</span>
            <h2>Engineering Excellence From<br /><em>Concept to Completion</em></h2>
          </div>
          <div className="rxl-value-grid">
            <div className="rxl-value"><h3>Engineer</h3><p>Our engineering specialists transform complex project requirements into intelligent, manufacturable solutions.</p></div>
            <div className="rxl-value"><h3>Fabricate</h3><p>Manufactured in house using advanced fabrication processes and rigorous quality control.</p></div>
            <div className="rxl-value"><h3>Install</h3><p>Our experienced installation teams ensure every system is deployed safely, efficiently, and according to engineering specifications.</p></div>
          </div>
        </div>
      </section>

      <section className="rxl-logo-band"><LogoBandArtwork /></section>

      <section className="rxl-section rxl-section-gray rxl-case-home">
        <div className="rxl-wrap rxl-home-split">
          <div className="rxl-case-copy">
            <span className="rxl-section-eyebrow rxl-section-eyebrow-left">Case Studies</span>
            <h2>Engineering<br />Success <em>Stories</em></h2>
            <p>Explore how RXL transforms complex engineering challenges into fully integrated infrastructure solutions through innovative design, precision manufacturing, and expert installation.</p>
            <div className="rxl-case-stages">{caseStudyStages.map((stage) => <div key={stage}><i><b /></i>{stage}</div>)}</div>
            <Link className="rxl-btn rxl-btn-primary" href="/case-studies">Learn More</Link>
          </div>
          <div className="rxl-case-art"><RackArtwork cols={7} /></div>
        </div>
      </section>
    </main>
  );
}
