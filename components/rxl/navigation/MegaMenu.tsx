"use client";

import Link from "next/link";
import { useEffect } from "react";

const groups = [
  {
    label: "Cabinets & Racks",
    href: "/products/cabinets",
    links: [
      ["VaultLine", "/products/cabinets?series=VaultLine"],
      ["NetBay", "/products/cabinets?series=NetBay"],
    ],
  },
  {
    label: "Containment Systems",
    href: "/products/containment",
    links: [
      ["Cold aisle containment", "/products/containment"],
      ["Hot aisle containment", "/products/containment"],
    ],
  },
  {
    label: "Cooling Manifolds",
    href: "/products/cooling",
    links: [
      ["Distribution manifolds", "/products/cooling"],
      ["Project-built assemblies", "/products/cooling"],
    ],
  },
] as const;

export function MegaMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="rxl-mega" role="region" aria-label="Solutions menu">
      {groups.map((group) => (
        <div className="rxl-mega-group" key={group.label}>
          <h3>{group.label}</h3>
          {group.links.map(([label, href]) => (
            <Link href={href} key={`${group.label}-${label}`} onClick={onClose}>
              {label}
              <span>Representative preview family</span>
            </Link>
          ))}
          <Link className="rxl-mega-all" href={group.href} onClick={onClose}>
            View all {group.label.toLowerCase()}
          </Link>
        </div>
      ))}
    </div>
  );
}
