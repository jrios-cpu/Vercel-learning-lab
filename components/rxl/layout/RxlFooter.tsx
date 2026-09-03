import Link from "next/link";
import { RxlLogo } from "./RxlLogo";

const footerLinks = [
  ["Capabilities", "/about"],
  ["Solutions", "/products"],
  ["Workflow", "/#workflow"],
  ["Case Studies", "/news"],
  ["Contact", "/contact"],
] as const;

export function RxlFooter() {
  return (
    <footer className="rxl-footer">
      <div className="rxl-wrap">
        <div className="rxl-footer-top">
          <div className="rxl-footer-brand"><RxlLogo /></div>
          <div className="rxl-footer-contact-item"><span className="rxl-footer-dot">⌖</span><div><strong>Headquarters</strong><span>Reno, Nevada</span></div></div>
          <div className="rxl-footer-contact-item"><span className="rxl-footer-dot">◌</span><div><strong>Tel</strong><Link href="/contact">Contact RXL</Link></div></div>
          <div className="rxl-footer-contact-item"><span className="rxl-footer-dot">✉</span><div><strong>Email</strong><Link href="/contact">Contact RXL</Link></div></div>
        </div>
        <div className="rxl-footer-bar">
          <nav aria-label="Footer navigation">{footerLinks.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav>
          <div className="rxl-footer-social" aria-label="Social profiles pending verification"><span>f</span><span>×</span><span>in</span><span>▶</span><span>◎</span></div>
        </div>
        <div className="rxl-footer-copyright">Copyright © RXL Inc. 2026. All rights reserved.</div>
      </div>
    </footer>
  );
}
