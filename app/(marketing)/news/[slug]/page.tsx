import Link from "next/link";
import { notFound } from "next/navigation";
import { contentProvider } from "@/lib/rxl/providers/content";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await contentProvider.getArticle(slug);
  if (!article) notFound();
  return <main id="main-content"><section className="rxl-page-head"><div className="rxl-wrap"><div className="rxl-breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/news">Case Studies</Link><span>/</span><span>{article.type}</span></div><span className="rxl-demo-badge">Representative Preview content</span><h1>{article.title}</h1><p>{article.summary}</p></div></section><article className="rxl-section"><div className="rxl-wrap rxl-copy">{article.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<div className="rxl-legal-note">This page demonstrates the approved content structure. Customer names, project facts, photography, metrics, and engineering claims require RXL verification before Production publication.</div><Link className="rxl-card-link" href="/news">← Back to case studies</Link></div></article></main>;
}
