import { RxlLogo } from "@/components/rxl/layout/RxlLogo";

export function HeroArtwork() {
  const bars = Array.from({ length: 14 }, (_, index) => {
    const x = 760 + index * 52;
    const height = 330 + Math.sin(index * 0.9) * 90;
    return <rect key={index} x={x} y={480 - height} width="40" height={height} fill="#8fb0ff" opacity={index % 3 === 1 ? 0.13 : 0.06} />;
  });

  return (
    <svg viewBox="0 0 1440 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="rxl-hg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#04091a" />
          <stop offset="55%" stopColor="#0d2158" />
          <stop offset="100%" stopColor="#1b45d7" />
        </linearGradient>
        <linearGradient id="rxl-xg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6d97ff" stopOpacity=".8" />
          <stop offset="100%" stopColor="#1b45d7" stopOpacity=".28" />
        </linearGradient>
        <linearGradient id="rxl-scrim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#04091a" stopOpacity=".97" />
          <stop offset="52%" stopColor="#04091a" stopOpacity=".72" />
          <stop offset="100%" stopColor="#04091a" stopOpacity=".25" />
        </linearGradient>
        <clipPath id="rxl-hero-clip"><rect width="1440" height="640" /></clipPath>
      </defs>
      <rect width="1440" height="640" fill="url(#rxl-hg)" />
      <g clipPath="url(#rxl-hero-clip)" opacity=".5">{bars}</g>
      <g clipPath="url(#rxl-hero-clip)">
        <path d="M640 -120 L1130 -120 L1560 760 L1070 760 Z" fill="url(#rxl-xg)" />
        <path d="M1560 -120 L1130 -120 L640 760 L1070 760 Z" fill="url(#rxl-xg)" opacity=".72" />
        <path d="M760 -120 L810 -120 L1250 760 L1200 760 Z" fill="#a8c3ff" opacity=".32" />
        <path d="M1440 -120 L1490 -120 L1050 760 L1000 760 Z" fill="#a8c3ff" opacity=".24" />
      </g>
      <rect width="1440" height="640" fill="url(#rxl-scrim)" />
    </svg>
  );
}

export function RackArtwork({ tone = "dark", cols = 9, className }: { tone?: "dark" | "light"; cols?: number; className?: string }) {
  const bg = tone === "dark" ? "#04091a" : "#e4e9f1";
  const bar = tone === "dark" ? "#12307e" : "#8f9fb8";
  const hot = tone === "dark" ? "#2b5ce6" : "#1b45d7";
  const low = tone === "dark" ? 0.22 : 0.5;
  const high = tone === "dark" ? 0.38 : 0.72;
  const rackWidth = 740 / cols;

  return (
    <svg className={className} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="800" height="300" fill={bg} />
      {Array.from({ length: cols }, (_, index) => {
        const x = 30 + index * rackWidth;
        const width = rackWidth - 9;
        const height = 190 + Math.sin(index * 1.4) * 34;
        const y = 300 - height;
        const lit = index % 3 === 1;
        return (
          <g key={index}>
            <rect x={x} y={y} width={width} height={height} fill={lit ? hot : bar} opacity={lit ? high : low} />
            {Array.from({ length: 13 }, (_, slot) => {
              const slotY = y + 8 + slot * ((height - 14) / 13);
              return <rect key={slot} x={x + 4} y={slotY} width={width - 8} height="2.2" fill={tone === "dark" ? "#8fb0ff" : "#ffffff"} opacity={(tone === "dark" ? 0.1 : 0.3) + (slot % 4 === 0 ? 0.3 : 0)} />;
            })}
          </g>
        );
      })}
      <rect width="800" height="300" fill={bg} opacity={tone === "dark" ? 0.2 : 0.12} />
    </svg>
  );
}

export function LogoBandArtwork() {
  return (
    <div className="rxl-logo-band-art" aria-hidden="true">
      <div className="rxl-logo-band-grid"><RackArtwork cols={18} /></div>
      <RxlLogo className="rxl-logo-band-mark" title="" />
    </div>
  );
}
