import type { Metadata } from "next";
import { Barlow_Semi_Condensed, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./rxl.css";
import "./rxl-polish.css";
import { RxlFooter } from "@/components/rxl/layout/RxlFooter";
import { RxlHeader } from "@/components/rxl/layout/RxlHeader";
import { RXL_SITE, isPreviewEnvironment } from "@/lib/rxl/site";
const barlow = Barlow_Semi_Condensed({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-barlow", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-jetbrains", display: "swap" });
export const metadata: Metadata = { metadataBase: new URL(RXL_SITE.productionUrl), title: { default: RXL_SITE.name, template: `%s | ${RXL_SITE.name}` }, description: RXL_SITE.description, alternates: { canonical: RXL_SITE.productionUrl }, openGraph: { title: RXL_SITE.name, description: RXL_SITE.description, url: RXL_SITE.productionUrl, siteName: RXL_SITE.name, type: "website" }, twitter: { card: "summary", title: RXL_SITE.name, description: RXL_SITE.description } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { const preview = isPreviewEnvironment(); return <html lang="en" className={`${barlow.variable} ${inter.variable} ${jetbrains.variable}`}><body><a className="skip" href="#main-content">Skip to main content</a><RxlHeader preview={preview} />{children}<RxlFooter /></body></html>; }
