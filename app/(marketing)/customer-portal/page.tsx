import { CustomerPortalView } from "@/components/rxl/access/CustomerPortalView";
function portalUrl() { const raw = process.env.RXL_EPICOR_PORTAL_URL; if (!raw) return null; try { const url = new URL(raw); return url.protocol === "https:" ? url.toString() : null; } catch { return null; } }
export const metadata = { title: "Customer Portal", robots: { index: false, follow: false } };
export default function CustomerPortalPage() { return <main id="main-content" className="rxl-access-page"><div className="rxl-wrap"><CustomerPortalView portalUrl={portalUrl()} /></div></main>; }
