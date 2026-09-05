import { RxlFooter } from "@/components/rxl/layout/RxlFooter";
import { RxlHeader } from "@/components/rxl/layout/RxlHeader";
import { isPreviewEnvironment } from "@/lib/rxl/site";
export default function EmployeeLayout({ children }: { children: React.ReactNode }) { return <><RxlHeader preview={isPreviewEnvironment()} />{children}<RxlFooter /></>; }
