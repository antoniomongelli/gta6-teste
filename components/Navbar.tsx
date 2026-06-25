"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/noticias", label: "NOTÍCIAS" },
  { href: "/leaks", label: "LEAKS" },
  { href: "/mapa", label: "MAPA" },
  { href: "/personagens", label: "PERSONAGENS" },
  { href: "/lancamento", label: "LANÇAMENTO" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1a1a", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <Link href="/" style={{ fontWeight: 900, fontSize: 18, letterSpacing: 2, color: "#E39986", flexShrink: 0 }}>
          GTA6<span style={{ color: "#826092" }}>.</span>NEWS
        </Link>

        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: pathname.startsWith(l.href) ? "#E39986" : "#666",
                transition: "color 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { if (!pathname.startsWith(l.href)) (e.target as HTMLElement).style.color = "#ccc"; }}
              onMouseLeave={(e) => { if (!pathname.startsWith(l.href)) (e.target as HTMLElement).style.color = "#666"; }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#f87171", display: "inline-block" }} />
            <span style={{ color: "#f87171", fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>AO VIVO</span>
          </div>
          <a
            href="https://wa.me/"
            style={{
              background: "#826092",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              padding: "7px 14px",
              borderRadius: 6,
              letterSpacing: 0.5,
              whiteSpace: "nowrap",
            }}
          >
            🔔 RECEBER NO WHATSAPP
          </a>
        </div>
      </div>
    </nav>
  );
}
