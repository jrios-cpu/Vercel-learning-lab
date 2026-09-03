import Link from "next/link";
import type { HomeContent } from "@/lib/rxl/types/content";

export function HomeHero({ content }: { content: HomeContent }) {
  return (
    <section className="rxl-home-hero">
      <div className="rxl-home-hero-art" aria-hidden="true">
        <div className="rxl-rack-field" />
      </div>
      <div className="rxl-wrap rxl-home-hero-inner">
        <div className="rxl-home-hero-copy">
          <span className="rxl-eyebrow">{content.eyebrow}</span>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
          <div className="rxl-actions">
            <Link className="rxl-btn rxl-btn-primary" href={content.primaryCta.href}>{content.primaryCta.label}</Link>
            {content.secondaryCta && <Link className="rxl-btn rxl-btn-ghost" href={content.secondaryCta.href}>{content.secondaryCta.label}</Link>}
          </div>
        </div>
      </div>
    </section>
  );
}
