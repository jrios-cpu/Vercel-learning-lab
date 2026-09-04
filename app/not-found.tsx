import "./rxl-rc1.css";
import Link from "next/link";
import { RxlFooter } from "@/components/rxl/layout/RxlFooter";
import { RxlHeader } from "@/components/rxl/layout/RxlHeader";
import { isPreviewEnvironment } from "@/lib/rxl/site";

export default function NotFound() {
  const preview = isPreviewEnvironment();
  return (
    <>
      <RxlHeader preview={preview} />
      <main id="main-content" className="rxl-not-found-hero">
        <div className="rxl-wrap">
          <section className="rxl-not-found-copy">
            <span className="rxl-eyebrow">404 · Route not found</span>
            <h1>This path is outside the RXL system.</h1>
            <p>No fallback product, invented article, or fabricated destination is shown. Return to the approved site structure or browse engineered solutions.</p>
            <div className="rxl-actions"><Link className="rxl-btn rxl-btn-primary" href="/">Return home</Link><Link className="rxl-btn rxl-btn-ghost" href="/products">Explore solutions</Link></div>
          </section>
        </div>
      </main>
      <RxlFooter />
    </>
  );
}
