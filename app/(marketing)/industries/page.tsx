import Link from "next/link";
import { contentProvider } from "@/lib/rxl/providers/content";

export default async function IndustriesPage() {
  const industries = await contentProvider.listIndustries();
  return <main id="main-content"><section className="rxl-page-head"><div className="rxl-wrap"><div className="rxl-breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Industries</span></div><h1>Infrastructure shaped by the environment it serves.</h1><p>Representative industry content demonstrates the intended navigation and relationship between applications and solution families.</p></div></section><section className="rxl-section"><div className="rxl-wrap"><div className="rxl-content-grid">{industries.map((industry) => <Link className="rxl-content-card" href={`/industries/${industry.slug}`} key={industry.slug}><div className="rxl-card-art" /><div className="rxl-card-body"><small>Representative application</small><h3>{industry.title}</h3><p>{industry.summary}</p><span className="rxl-card-link">Explore application →</span></div></Link>)}</div></div></section></main>;
}
