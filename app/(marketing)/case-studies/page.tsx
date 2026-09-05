import Link from "next/link";
import { articles } from "@/lib/rxl/data/content";
import { RackArtwork } from "@/components/rxl/home/HomeArtwork";

export const metadata = {
  title: "Case Studies",
  description: "Representative RXL case-study layouts for engineered infrastructure programs.",
};

export default function CaseStudiesPage() {
  const caseStudies = articles.filter((article) => article.type === "Case Study");
  return (
    <main id="main-content">
      <section className="rxl-page-head">
        <div className="rxl-wrap">
          <nav className="rxl-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Case Studies</span></nav>
          <h1>Engineering success stories.</h1>
          <p>Representative project stories demonstrate the intended RXL narrative structure. Customer names, metrics, photography, and outcomes stay explicitly unverified until approved source material is connected.</p>
        </div>
      </section>
      <section className="rxl-section rxl-section-gray">
        <div className="rxl-wrap rxl-home-split">
          <div className="rxl-case-copy">
            <span className="rxl-section-eyebrow rxl-section-eyebrow-left">Case Study Framework</span>
            <h2>Challenge. Engineering. <em>Fabrication. Installation.</em></h2>
            <p>Each story is structured around the real work: project constraints, engineering decisions, controlled fabrication, field execution, and verified outcomes once RXL approves them.</p>
            <Link className="rxl-btn rxl-btn-primary" href="/configurator">Start Project</Link>
          </div>
          <div className="rxl-case-art" aria-hidden="true"><RackArtwork cols={8} /></div>
        </div>
      </section>
      <section className="rxl-section">
        <div className="rxl-wrap">
          <div className="rxl-section-head">
            <span className="rxl-section-eyebrow rxl-section-eyebrow-left">Representative Projects</span>
            <h2>Preview stories ready for verified RXL content.</h2>
          </div>
          <div className="rxl-article-grid">
            {caseStudies.map((article) => (
              <article className="rxl-article-card" key={article.slug}>
                <span className="rxl-article-type">{article.type}</span>
                <h2>{article.title}</h2>
                <p>{article.summary}</p>
                <span className="rxl-demo-badge">Representative</span>
                <div style={{ marginTop: 18 }}><Link className="rxl-card-link" href={`/news/${article.slug}`}>Read case study →</Link></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
