import Link from "next/link";
import { RxlFooter } from "@/components/rxl/layout/RxlFooter";
import { RxlHeader } from "@/components/rxl/layout/RxlHeader";
import { isPreviewEnvironment } from "@/lib/rxl/site";

export default function NotFound() {
  const preview = isPreviewEnvironment();
  return <><RxlHeader preview={preview} /><main id="main-content" className="rxl-access-page"><div className="rxl-wrap"><section className="rxl-access-card"><span className="rxl-eyebrow">404</span><h1>That route does not exist.</h1><p>The requested page is not part of the RXL site. No fallback product or fabricated content is shown.</p><Link className="rxl-btn rxl-btn-primary" href="/">Return home</Link></section></div></main><RxlFooter /></>;
}
