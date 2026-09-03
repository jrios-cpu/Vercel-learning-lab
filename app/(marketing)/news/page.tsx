import Link from "next/link";
import { contentProvider } from "@/lib/rxl/providers/content";

export default async function NewsPage() {
  const articles = await contentProvider.listArticles();
  return <main id="main-content"><section className="rxl-page-head"><div className="rxl-wrap"><div className="rxl-breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Case Studies</span></div><h1>Case studies and engineering insight.</h1><p>How the finished system connects back to constraints, engineering decisions, fabrication, and delivery.</p></div></section><section className="rxl-section rxl-section-gray"><div className="rxl-wrap"><div className="rxl-article-grid">{articles.map((article) => <Link className="rxl-article-card" href={`/news/${article.slug}`} key={article.slug}><span className="rxl-article-type">{article.type}</span><h2>{article.title}</h2><p>{article.summary}</p><span className="rxl-demo-badge">Preview content</span></Link>)}</div></div></section></main>;
}
