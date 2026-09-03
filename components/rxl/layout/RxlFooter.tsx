import Link from "next/link";
import { RXL_SITE } from "@/lib/rxl/site";
import { RxlLogo } from "./RxlLogo";

const footerLinks = [
  ["Capabilities", "/about"],
  ["Solutions", "/products"],
  ["Industries", "/industries"],
  ["Resources", "/resources"],
  ["Careers", "/careers"],
  ["Case Studies", "/news"],
  ["Customer Portal", "/customer-portal"],
  ["Employees", "/employees"],
  ["Contact", "/contact"],
] as const;

export function RxlFooter() {
  return (
    <footer className="rxl-footer">
      <div className="rxl-wrap">
        <div className="rxl-footer-top">
          <div className="rxl-footer-brand">
            <RxlLogo />
            <p>{RXL_SITE.description}</p>
          </div>
          <div className="rxl-footer-meta">
            <strong>Project access</strong>
            <Link href="/configurator">Start Project</Link>
            <Link href="/customer-portal">Customer Portal</Link>
            <Link href="/employees">Employee Login</Link>
          </div>
          <div className="rxl-footer-meta">
            <strong>Contact</strong>
            {RXL_SITE.contact.email ? <a href={`mailto:${RXL_SITE.contact.email}`}>{RXL_SITE.contact.email}</a> : <Link href="/contact">Contact RXL</Link>}
            <span>Business contact details pending verification.</span>
          </div>
        </div>
        <div className="rxl-footer-bar">
          <nav aria-label="Footer navigation">
            {footerLinks.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          </nav>
          <div className="rxl-footer-legal">
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
