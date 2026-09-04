import { notFound } from "next/navigation";
import Link from "next/link";
import { jobsProvider } from "@/lib/rxl/providers/jobs";

export default async function JobPage({ params }: { params: Promise<{ job: string }> }) {
  const { job: slug } = await params;
  const job = await jobsProvider.getJob(slug);
  if (!job) notFound();
  const related = (await jobsProvider.listJobs()).filter((item) => item.slug !== job.slug).slice(0, 3);
  return (
    <main id="main-content">
      <section className="rxl-page-head">
        <div className="rxl-wrap">
          <nav className="rxl-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/careers">Careers</Link><span>/</span><span>{job.id}</span></nav>
          <span className="rxl-demo-badge">Representative role</span><h1>{job.title}</h1><p>{job.summary}</p>
          <div className="rxl-job-meta"><span>{job.department}</span><span>{job.location}</span><span>{job.employmentType}</span></div>
        </div>
      </section>
      <section className="rxl-section">
        <div className="rxl-wrap rxl-job-detail-grid">
          <article><h2>What you would own</h2><ul>{job.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul><h2>What helps</h2><ul>{job.qualifications.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <aside><span className="rxl-eyebrow">Application boundary</span><h2>Application system not connected</h2><p>There is no fake apply form in this Preview. When a verified ATS endpoint is supplied, this mount point can hand off safely without redesigning the page.</p><Link className="rxl-btn rxl-btn-outline" href="/careers">Back to careers</Link></aside>
        </div>
      </section>
      {related.length > 0 && <section className="rxl-section rxl-section-gray"><div className="rxl-wrap"><div className="rxl-section-head"><span className="rxl-section-eyebrow rxl-section-eyebrow-left">Related representative roles</span><h2>Keep exploring the team.</h2></div><div className="rxl-jobs-list">{related.map((item) => <Link className="rxl-job-row" href={`/careers/${item.slug}`} key={item.id}><div><span>{item.id}</span><h2>{item.title}</h2></div><div><span>{item.department}</span><strong>{item.location}</strong></div><div><span>{item.employmentType}</span><b aria-hidden="true">→</b></div></Link>)}</div></div></section>}
    </main>
  );
}
