import { JobList } from "@/components/rxl/careers/JobList";
import { jobsProvider } from "@/lib/rxl/providers/jobs";

export const metadata = { title: "Careers", description: "Explore representative RXL roles and the future ATS-ready careers boundary." };

export default async function CareersPage() {
  const jobs = await jobsProvider.listJobs();
  return (
    <main id="main-content">
      <section className="rxl-career-hero">
        <div className="rxl-wrap rxl-career-hero-grid">
          <div><span className="rxl-eyebrow">Careers</span><h1>Build the systems behind critical infrastructure.</h1><p>Representative roles show the intended Career Center experience. The ATS is deliberately not connected yet.</p></div>
          <div className="rxl-career-art" aria-hidden="true"><span>Design</span><span>Fabricate</span><span>Install</span><span>Support</span></div>
        </div>
      </section>
      <section className="rxl-section">
        <div className="rxl-wrap">
          <div className="rxl-section-head"><span className="rxl-section-eyebrow rxl-section-eyebrow-left">Representative openings</span><h2>Roles across engineering, fabrication, field, and commercial work.</h2><p>These openings are Preview content and must not be treated as verified live postings until an ATS provider is connected.</p></div>
          <JobList jobs={jobs} />
        </div>
      </section>
      <section className="rxl-section rxl-section-gray">
        <div className="rxl-wrap">
          <div className="rxl-section-head rxl-section-head-center"><span className="rxl-section-eyebrow">Career Center Structure</span><h2>Designed around the same <em>end-to-end mindset.</em></h2><p>The production Career Center can connect verified culture, benefits, recruiting content, and live ATS records without changing this page architecture.</p></div>
          <div className="rxl-career-values">
            <article className="rxl-career-value"><span>01</span><h3>Engineer</h3><p>Technical roles can show the problems, tools, and ownership expected across the design-to-fabrication handoff.</p></article>
            <article className="rxl-career-value"><span>02</span><h3>Build</h3><p>Fabrication and operations roles can present the production environment without inventing compensation or benefit claims.</p></article>
            <article className="rxl-career-value"><span>03</span><h3>Deliver</h3><p>Field and customer-facing roles can connect directly to the future ATS once RXL approves the recruiting source of truth.</p></article>
          </div>
        </div>
      </section>
    </main>
  );
}
