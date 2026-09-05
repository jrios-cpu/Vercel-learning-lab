import { EmployeeHub } from "@/components/rxl/access/EmployeeHub";
export const metadata = { title: "Employee Hub", robots: { index: false, follow: false } };
export default function EmployeesPage() { return <main id="main-content" className="rxl-access-page"><div className="rxl-wrap"><EmployeeHub authState="preview-demo" /></div></main>; }
