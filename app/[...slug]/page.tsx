import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactForm, PerformanceProbe, RfqForm, SelfTest, StatusTools } from "@/components/Interactive";
import { jobBySlug, jobs, productBySlug, products, type Product } from "@/lib/data";
import { featureFlags, isProduction, labModules, SITE_URL } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const pathOf = (slug: string[]) => `/${slug.join("/")}`;
const canonical = (path: string) => `${SITE_URL}${path}`;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = pathOf(slug);
  if (path.startsWith("/lab")) return { title: path === "/lab" ? "Lab" : path.split("/").pop()!.replaceAll("-", " "), robots: { index: false, follow: false, nocache: true } };
  if (path === "/products") return { title: "Products", description: "Engineered product systems, specifications and quote-ready detail pages.", alternates: { canonical: canonical(path) } };
  if (path === "/careers") return { title: "Careers", alternates: { canonical: canonical(path) } };
  if (path === "/contact") return { title: "Contact", alternates: { canonical: canonical(path) } };
  if (path === "/rfq") return { title: "Request Quote", alternates: { canonical: canonical(path) } };
  if (slug[0] === "products" && slug[1]) {
    const product = productBySlug(slug[1]);
    if (product) return { title: `${product.name} (${product.partNumber})`, description: product.summary, alternates: { canonical: canonical(path) } };
  }
  if (slug[0] === "careers" && slug[1]) {
    const job = jobBySlug(slug[1]);
    if (job) return { title: job.title, description: job.summary, alternates: { canonical: canonical(path) } };
  }
  return { title: "Not Found", robots: { index: false } };
}

function JsonLd({ value }: { value: unknown }) { return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(value) }} />; }
function ProductCard({ product }: { product: Product }) { return <article className="productCard"><div className="productImage"><Image src={product.image} alt={product.imageAlt} fill sizes="(max-width: 940px) 50vw, 33vw" /></div><div className="productBody"><div className="productMeta"><span>{product.category}</span><span>{product.partNumber}</span></div><h2>{product.name}</h2><p>{product.summary}</p><Link className="textLink" href={`/products/${product.slug}`}>Explore system →</Link></div></article>; }
function LabNav() { return <nav className="labnav" aria-label="Lab navigation"><Link href="/lab">Lab Home</Link>{labModules.map((module) => <Link href={`/lab/${module}`} key={module}>{module.replaceAll("-", " ")}</Link>)}</nav>; }
function PageHero({ eyebrow, title, lede }: { eyebrow: string; title: string; lede: string }) { return <section className="hero compact"><div className="shell"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p className="lede">{lede}</p></div></section>; }

export default async function LegacyFallback({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const path = pathOf(slug);
  const production = isProduction();

  if (path === "/products") return <main id="main-content"><PageHero eyebrow="Engineered systems" title="Products built around real constraints." lede="Legacy product preview retained temporarily while the RXL catalog is being migrated." /><section className="section"><div className="shell grid three">{products.map((product) => <ProductCard product={product} key={product.slug} />)}</div></section></main>;
  if (slug[0] === "products" && slug[1] && slug.length === 2) {
    const product = productBySlug(slug[1]); if (!product) notFound();
    const related = product.related.map(productBySlug).filter(Boolean) as Product[];
    return <main id="main-content"><JsonLd value={{ "@context": "https://schema.org", "@type": "Product", name: product.name, sku: product.partNumber, category: product.category, description: product.summary, url: canonical(path) }} /><section className="section"><div className="shell detailGrid"><div className="detailCopy"><span className="eyebrow">{product.category} · {product.status}</span><h1>{product.name}</h1><p className="lede">{product.summary}</p><div className="actions"><Link className="button" href={`/rfq?product=${product.slug}`}>Request Quote</Link></div></div><div className="detailImage"><Image src={product.image} alt={product.imageAlt} fill priority sizes="(max-width: 940px) 100vw, 55vw" /></div></div></section><section className="section"><div className="shell grid two">{related.map((item) => <ProductCard product={item} key={item.slug} />)}</div></section></main>;
  }
  if (path === "/careers") return <main id="main-content"><PageHero eyebrow="Career Center" title="Careers migration in progress." lede="Legacy representative roles remain available while the RXL careers provider is being built." /><section className="section"><div className="shell careerList">{jobs.map((job) => <Link className="careerRow" href={`/careers/${job.slug}`} key={job.slug}><strong>{job.title}</strong><span>{job.team}</span><span>{job.location}</span><b>→</b></Link>)}</div></section></main>;
  if (slug[0] === "careers" && slug[1] && slug.length === 2) {
    const job = jobBySlug(slug[1]); if (!job) notFound();
    return <main id="main-content"><PageHero eyebrow={job.team} title={job.title} lede={job.summary} /></main>;
  }
  if (path === "/contact") return <main id="main-content"><PageHero eyebrow="Contact" title="Start with the problem." lede="Tell us what you are trying to solve." /><section className="section"><div className="shell specGrid"><div><p className="lede">Requests are acknowledged by the Preview API but are not persisted or emailed yet.</p></div><ContactForm /></div></section></main>;
  if (path === "/rfq") { const initial = typeof query.product === "string" ? query.product : undefined; return <main id="main-content"><PageHero eyebrow="Request Quote" title="Bring the project into focus." lede="Product and project context are validated without pretending a CRM is connected." /><section className="section"><div className="shell specGrid"><div><p className="lede">Temporary legacy quote form retained during configurator migration.</p></div><RfqForm initial={initial} /></div></section></main>; }
  if (path.startsWith("/lab")) {
    const labModule = slug[1];
    const env = process.env.VERCEL_ENV || "development";
    if (!labModule) return <><LabNav /><main id="main-content"><PageHero eyebrow="Technical Lab · noindex" title="Engineering behavior, kept out of the public story." lede="Deployment, observability, environment behavior, feature flags, performance and error handling." /></main></>;
    if (!labModules.includes(labModule as (typeof labModules)[number])) notFound();
    let content: React.ReactNode;
    if (labModule === "deployments") content = <><PageHero eyebrow="Deployments" title="Deployment context without exposing Production internals." lede="Use Vercel as the source of truth for environment and deployment state." /><section className="section"><div className="shell card"><h2>{env}</h2><p>{production ? "Detailed deployment identifiers are intentionally hidden in Production." : `Deployment ID: ${process.env.VERCEL_DEPLOYMENT_ID || "not available"}`}</p></div></section></>;
    else if (labModule === "observability") content = <><PageHero eyebrow="Observability" title="Generate controlled runtime signals." lede="Safe status probes remain available while intentional Production 500 generation is blocked." /><section className="section"><div className="shell"><StatusTools production={production} /></div></section></>;
    else if (labModule === "preview-production") content = <PageHero eyebrow="Preview vs Production" title="Environment changes behavior, not just labels." lede="Preview is visibly marked. Production removes the banner and locks unsafe tooling." />;
    else if (labModule === "environment") content = <PageHero eyebrow="Environment Variables" title="Show enough context to learn, not enough to leak." lede="Environment data is intentionally bounded in Production." />;
    else if (labModule === "feature-flags") { const flags = featureFlags(); content = <><PageHero eyebrow="Feature Flags" title="Small switches, explicit policy." lede="Flags expose their source so behavior can be explained." /><section className="section"><div className="shell result">{JSON.stringify(flags, null, 2)}</div></section></>; }
    else if (labModule === "performance") content = <><PageHero eyebrow="Performance" title="Observe real cache behavior." lede="The probe reads headers returned by Vercel instead of inventing cache state." /><section className="section"><div className="shell"><PerformanceProbe /></div></section></>;
    else content = <><PageHero eyebrow="Error Handling" title="Safe probes without Production foot-guns." lede="Self-test and intentional 500 generation are restricted in Production." /><section className="section"><div className="shell"><SelfTest production={production} /></div></section></>;
    return <><LabNav /><main id="main-content">{content}</main></>;
  }
  notFound();
}
