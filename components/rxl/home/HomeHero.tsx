import Image from "next/image";
import Link from "next/link";
import type { HomeContent } from "@/lib/rxl/types/content";
import { HeroArtwork } from "./HomeArtwork";

const HERO_IMAGE = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1800&q=84";

export function HomeHero({ content }: { content: HomeContent }) {
  return (
    <section className="rxl-home-hero">
      <div className="rxl-home-hero-art" aria-hidden="true"><HeroArtwork /></div>
      <div className="rxl-home-hero-photo" aria-hidden="true">
        <Image src={HERO_IMAGE} alt="" fill priority sizes="100vw" />
      </div>
      <div className="rxl-hero-play" aria-hidden="true">
        <svg viewBox="0 0 18 18"><path d="M4 2l11 7-11 7V2z" fill="currentColor" /></svg>
      </div>
      <div className="rxl-hero-ticks" aria-hidden="true"><i className="active" /><i /><i /><i /></div>
      <div className="rxl-wrap rxl-home-hero-inner">
        <div className="rxl-home-hero-copy">
          <span className="rxl-eyebrow rxl-eyebrow-left">{content.eyebrow}</span>
          <h1>Redefining<br />What&apos;s <span>Possible.</span></h1>
          <p>Advanced fabrication. Precision engineering. Turnkey infrastructure solutions designed, manufactured, and installed by one engineering partner. From the first CAD line to final commissioning, RXL owns the entire build.</p>
          <div className="rxl-actions">
            <Link className="rxl-btn rxl-btn-primary rxl-btn-lg" href={content.primaryCta.href}>{content.primaryCta.label}</Link>
            <Link className="rxl-btn rxl-btn-ghost rxl-btn-lg" href="/contact?intent=drawings">Upload Your Drawings</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
