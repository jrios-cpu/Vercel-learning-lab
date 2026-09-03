import Link from "next/link";
import { contentProvider } from "@/lib/rxl/providers/content";

export default async function ResourcesPage() {
  const resources = await contentProvider.listResources();
  return <main id="main-content"><section className="rxl-page-head"><div className="rxl-wrap"><div className="rxl-breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Resources</span></div><h1>Technical resources, organized around the product.</h1><p>The Preview shows the future document-library structure without publishing fake downloads.</p></div></section><section className="rxl-section"><div className="rxl-wrap"><div className="rxl-legal-note">Download destinations remain disabled until verified RXL files are supplied. Product documents will later be managed by the content provider and linked by part number.</div>{resources.map((resource) => <div className="rxl-resource-row" key={resource.id}><div><h3>{resource.title}</h3><p>{resource.type} · representative content slot</p></div><span className="rxl-demo-badge">Awaiting verified asset</span></div>)}</div></section></main>;
}
