import Link from "next/link";
export default function NotFound() {
  return <main id="main-content"><section className="hero"><div className="shell"><span className="eyebrow">404</span><h1>That route does not exist.</h1><p className="lede">A real HTTP 404 is returned for unknown routes.</p><Link className="button" href="/">Return home</Link></div></section></main>;
}
