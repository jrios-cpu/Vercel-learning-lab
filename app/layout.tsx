import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { isProduction, publicNav, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: { title: SITE_NAME, description: SITE_DESCRIPTION, url: SITE_URL, siteName: SITE_NAME, type: "website" },
  twitter: { card: "summary", title: SITE_NAME, description: SITE_DESCRIPTION },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const production = isProduction();
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main-content">Skip to main content</a>
        {!production && <div className="preview"><strong>Preview environment</strong><span>This is not Production.</span></div>}
        <header>
          <div className="shell nav">
            <Link className="brand" href="/" aria-label="Vercel Learning Lab home">
              <span className="brandMark">VL</span>
              <span className="brandCopy"><b>Learning Lab</b><small>Industrial systems · digital operations</small></span>
            </Link>
            <nav className="desktop" aria-label="Primary navigation">
              {publicNav.map(([label, href]) => <Link className={href === "/rfq" ? "navCta" : undefined} href={href} key={href}>{label}</Link>)}
            </nav>
            <details className="mobile"><summary>Menu</summary><nav aria-label="Mobile navigation">{publicNav.map(([label, href]) => <Link className={href === "/rfq" ? "navCta" : undefined} href={href} key={href}>{label}</Link>)}</nav></details>
          </div>
        </header>
        {children}
        <footer><div className="shell footer"><div><strong>Vercel Learning Lab</strong><p>Industrial product experience, careers and a hardened technical Lab.</p></div><div><small>Release</small><p>v5.1 Visual Polish</p></div><div><small>Sanity</small><p>Not connected yet</p></div></div></footer>
      </body>
    </html>
  );
}
