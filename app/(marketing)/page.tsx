import Link from "next/link";
import { DeliveryFlow } from "@/components/rxl/home/DeliveryFlow";
import { HomeHero } from "@/components/rxl/home/HomeHero";
import { contentProvider } from "@/lib/rxl/providers/content";

const solutions = [
  ["cabinets", "Cabinets & Racks", "High-performance infrastructure designed to support evolving technology environments."],
  ["containment", "Containment Systems", "Designed to improve airflow efficiency, cable management, and mission-critical load support."],
  ["cooling", "Cooling Manifolds", "Engineered cooling-distribution systems manufactured to project requirements."],
] as const;

export default async function HomePage() {
  const home = await contentProvider.getHome();
  const articles = (await contentProvider.listArticles()).slice(0, 2);
  return (
    <main id="main-content">
      <HomeHero content={home} />
      <section className="rxl-section rxl-section-gray">
        <div className="rxl-wrap">
          <div className="rxl-section-head"><span>Integrated solutions</span><h2>Engineered around the real project.</h2><p>The Preview uses representative product families while preserving the information architecture and conversion path of the approved RXL prototype.</p></div>
          <div className="rxl-solution-grid">
            {solutions.map(([slug, title, copy]) => <Link className="rxl-solution-card" href={`/products/${slug}`} key={slug}><div className="rxl-card-art" /><div className="rxl-card-body"><small>Representative family</small><h3>{title}</h3><p>{copy}</p><span className="rxl-card-link">Explore solutions →</span></div></Link>)}
          </div>
        </div>
      </section>
      <section className="rxl-section rxl-section-dark" id="workflow">
        <div className="rxl-wrap"><div className="rxl-section-head"><span>One engineering partner</span><h2>From requirements to commissioning.</h2><p>The approved RXL concept presents delivery as one coordinated workflow rather than a collection of disconnected services.</p></div><DeliveryFlow /></div>
      </section>
      <section className="rxl-section"><div className="rxl-wrap"><div className="rxl-value-grid"><div className="rxl-value"><h3>Engineer</h3><p>Turn project requirements into coordinated infrastructure and manufacturable detail.</p></div><div className="rxl-value"><h3>Fabricate</h3><p>Move critical work into a controlled environment with repeatable quality.</p></div><div className="rxl-value"><h3>Deliver</h3><p>Coordinate hardware, documentation, sequencing, and field integration as one system.</p></div></div></div></section>
      <section className="rxl-section rxl-section-gray"><div className="rxl-wrap"><div className="rxl-section-head"><span>Case studies & insight</span><h2>Show the engineering, not just the finished object.</h2></div><div className="rxl-article-grid">{articles.map((article) => <Link className="rxl-article-card" href={`/news/${article.slug}`} key={article.slug}><span className="rxl-article-type">{article.type}</span><h2>{article.title}</h2><p>{article.summary}</p><span className="rxl-demo-badge">Preview content</span></Link>)}</div></div></section>
      <section className="rxl-cta"><div className="rxl-wrap rxl-cta-inner"><h2>Bring the next infrastructure challenge into focus.</h2><Link className="rxl-btn rxl-btn-ghost" href="/configurator">Start Your Project</Link></div></section>
    </main>
  );
}
