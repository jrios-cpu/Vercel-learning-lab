import "../rxl-marketing.css";
import "../rxl-catalog.css";
import "../rxl-product.css";
import "../rxl-configurator.css";
import "../rxl-careers.css";
import "../rxl-analytics.css";
import { AnalyticsProvider } from "@/components/rxl/analytics/AnalyticsProvider";
import { isPreviewEnvironment } from "@/lib/rxl/site";
export default function MarketingLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <div className="rxl-marketing"><AnalyticsProvider preview={isPreviewEnvironment()}>{children}</AnalyticsProvider></div>; }
