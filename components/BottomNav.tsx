"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/",            icon: "🏠", label: "Home" },
  { href: "/noticias",    icon: "📰", label: "Notícias" },
  { href: "/mapa",        icon: "🗺️", label: "Mapa" },
  { href: "/personagens", icon: "👤", label: "Elenco" },
  { href: "/leaks",       icon: "🕵️", label: "Leaks" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 3, padding: "10px 4px",
            color: active ? "#E39986" : "#555",
            transition: "color 0.15s",
            position: "relative",
          }}>
            {active && (
              <div style={{
                position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                width: 24, height: 2,
                background: "linear-gradient(90deg, #826092, #E39986)",
                borderRadius: "0 0 2px 2px",
              }} />
            )}
            <span style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</span>
            <span style={{ fontSize: 9, fontWeight: active ? 800 : 500, letterSpacing: 0.5 }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
