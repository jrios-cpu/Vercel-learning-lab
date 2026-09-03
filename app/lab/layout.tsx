import type { Metadata } from "next";
import "../rxl-lab.css";
export const metadata: Metadata = { title: { default: "RXL Engineering Lab", template: "%s | RXL Engineering Lab" }, robots: { index: false, follow: false, nocache: true } };
export default function LabLayout({ children }: { children: React.ReactNode }) { return <div className="rxl-lab-shell">{children}</div>; }
