import Link from "next/link";
import { notFound } from "next/navigation";
import { contentProvider } from "@/lib/rxl/providers/content";

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = await contentProvider.getIndustry(slug);
  if (!industry) notFound();
  return <main id="main-content"><section className="rxl-page-head"><div className="rxl-wrap"><div className="rxl-breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/industries">Industries</Link><span>/</span><span>{industry.title}</span></div><h1>{industry.title}</h1><p>{industry.summary}</p></div></section><section className="rxl-section"><div className="rxl-wrap"><div className="rxl-copy"><span className="rxl-demo-badge">Representative Preview content</span><h2>Application priorities</h2><ul>{industry.applications.map((application) => <li key={application}>{application}</li>)}</ul><h2>Relevant solution families</h2><div className="rxl-industry-meta">{industry.featuredProductCategories.map((category) => <Link className="rxl-pill" href={`/products/${category}`} key={category}>{category.replaceAll("-", " ")}</Link>)}</div></div></div></section><section className="rxl-cta"><div className="rxl-wrap rxl-cta-inner"><h2>Translate the application into a buildable configuration.</h2><Link className="rxl-btn rxl-btn-ghost" href="/configurator">Start Your Project</Link></div></section></main>;
}
