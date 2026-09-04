"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { RXL_SITE } from "@/lib/rxl/site";
import { MegaMenu } from "../navigation/MegaMenu";
import { RxlLogo } from "./RxlLogo";

const nav = [
  ["Capabilities", "/about"],
  ["Solutions", "/products"],
  ["Workflow", "/workflow"],
  ["Case Studies", "/case-studies"],
  ["Contact", "/contact"],
] as const;

export function RxlHeader({ preview }: { preview: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const closeMenus = () => { setMobileOpen(false); setSolutionsOpen(false); };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMobileOpen(false); setSolutionsOpen(false); }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      {preview && <div className="rxl-preview" role="status"><strong>RXL Preview</strong><span>Representative content. External integrations are not live.</span></div>}
      <header className="rxl-header">
        <div className="rxl-header-inner">
          <Link className="rxl-brand" href="/" aria-label="RXL home" onClick={closeMenus}><RxlLogo /></Link>
          <nav className="rxl-desktop-nav" aria-label="Primary navigation">
            {nav.map(([label, href]) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              if (label === "Solutions") {
                return (
                  <div className="rxl-nav-item" key={href}>
                    <Link className={`rxl-nav-link${active ? " active" : ""}`} href={href} onClick={closeMenus}>{label}</Link>
                    <button className="rxl-mega-trigger" type="button" aria-label={solutionsOpen ? "Close Solutions menu" : "Open Solutions menu"} aria-expanded={solutionsOpen} aria-controls="rxl-solutions-menu" onClick={() => setSolutionsOpen((value) => !value)}>
                      <svg viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <MegaMenu open={solutionsOpen} onClose={() => setSolutionsOpen(false)} />
                  </div>
                );
              }
              return <Link className={`rxl-nav-link${active ? " active" : ""}`} href={href} key={href} onClick={closeMenus}>{label}</Link>;
            })}
          </nav>
          <div className="rxl-header-actions">
            {RXL_SITE.contact.phone && <a className="rxl-phone" href={`tel:${RXL_SITE.contact.phone.replace(/[^+\d]/g, "")}`}>{RXL_SITE.contact.phone}</a>}
            <Link className="rxl-btn rxl-btn-primary rxl-btn-sm" href={RXL_SITE.primaryCta.href} onClick={closeMenus}>{RXL_SITE.primaryCta.label}</Link>
            <button className={`rxl-burger${mobileOpen ? " open" : ""}`} type="button" aria-label="Menu" aria-expanded={mobileOpen} aria-controls="rxl-mobile-nav" onClick={() => setMobileOpen((value) => !value)}><span /></button>
          </div>
        </div>
        <nav className={`rxl-mobile-nav${mobileOpen ? " open" : ""}`} id="rxl-mobile-nav" aria-label="Mobile navigation">
          {nav.map(([label, href]) => <Link href={href} key={href} onClick={closeMenus}>{label}</Link>)}
          <Link href="/careers" onClick={closeMenus}>Careers</Link>
          <Link href="/customer-portal" onClick={closeMenus}>Customer Portal</Link>
          <Link href="/employees" onClick={closeMenus}>Employee Login</Link>
          <Link className="rxl-btn rxl-btn-primary" href={RXL_SITE.primaryCta.href} onClick={closeMenus}>{RXL_SITE.primaryCta.label}</Link>
        </nav>
      </header>
    </>
  );
}
