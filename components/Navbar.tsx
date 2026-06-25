"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/noticias",    label: "NOTÍCIAS",   icon: "📰" },
  { href: "/leaks",       label: "LEAKS",      icon: "🕵️" },
  { href: "/mapa",        label: "MAPA",       icon: "🗺️" },
  { href: "/personagens", label: "PERSONAGENS",icon: "👤" },
  { href: "/lancamento",  label: "LANÇAMENTO", icon: "🚀" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha menu ao navegar
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: scrolled ? "rgba(7,2,15,0.97)" : "rgba(7,2,15,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(130,96,146,0.2)",
        transition: "background 0.3s ease",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <Link href="/" style={{ fontWeight: 900, fontSize: 18, letterSpacing: 2, color: "#E39986", flexShrink: 0 }}>
            GTA6<span style={{ color: "#826092" }}>.</span>NEWS
          </Link>

          {/* Desktop links */}
          <div style={{ display: "flex", gap: 24, alignItems: "center" }} className="hidden-mobile">
            {links.map((l) => (
              <Link key={l.href} href={l.href} style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
                color: pathname.startsWith(l.href) ? "#E39986" : "#666",
                transition: "color 0.15s",
                whiteSpace: "nowrap",
              }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA + ao vivo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }} className="hidden-mobile">
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#f87171", display: "inline-block" }} />
              <span style={{ color: "#f87171", fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>AO VIVO</span>
            </div>
            <a href="https://wa.me/" style={{
              background: "linear-gradient(135deg, #826092, #64759D)",
              color: "#fff", fontSize: 10, fontWeight: 700,
              padding: "8px 14px", borderRadius: 8, letterSpacing: 0.5, whiteSpace: "nowrap",
            }}>
              🔔 WHATSAPP
            </a>
          </div>

          {/* Mobile: ao vivo + hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="show-mobile">
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span className="pulse-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: "#f87171", display: "inline-block" }} />
              <span style={{ color: "#f87171", fontSize: 8, fontWeight: 700 }}>AO VIVO</span>
            </div>
            <button
              onClick={() => setOpen(!open)}
              className="touch-btn"
              style={{ color: "#fff", fontSize: 22 }}
              aria-label="Menu"
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      {open && (
        <div className="mobile-menu-overlay" onClick={() => setOpen(false)}>
          <div style={{ maxWidth: 400, margin: "0 auto", padding: "80px 32px 32px", flex: 1 }} onClick={e => e.stopPropagation()}>
            {/* Logo */}
            <div style={{ fontWeight: 900, fontSize: 28, letterSpacing: 2, color: "#E39986", marginBottom: 48, textAlign: "center" }}>
              GTA6<span style={{ color: "#826092" }}>.</span>NEWS
            </div>

            {/* Links */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {links.map((l, i) => (
                <Link key={l.href} href={l.href} style={{
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "16px 20px", borderRadius: 14,
                  background: pathname.startsWith(l.href) ? "rgba(130,96,146,0.2)" : "transparent",
                  border: `1px solid ${pathname.startsWith(l.href) ? "rgba(130,96,146,0.4)" : "transparent"}`,
                  color: pathname.startsWith(l.href) ? "#E39986" : "#ccc",
                  fontSize: 16, fontWeight: 700, letterSpacing: 1,
                  transition: "all 0.15s",
                  animationDelay: `${i * 0.05}s`,
                }}
                  className="slide-up"
                >
                  <span style={{ fontSize: 22 }}>{l.icon}</span>
                  {l.label}
                  {pathname.startsWith(l.href) && <span style={{ marginLeft: "auto", color: "#826092" }}>→</span>}
                </Link>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a href="https://wa.me/" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              marginTop: 32, padding: "16px", borderRadius: 14,
              background: "linear-gradient(135deg, #826092, #64759D)",
              color: "#fff", fontSize: 14, fontWeight: 800, letterSpacing: 1,
            }}>
              🔔 Receber Notificações no WhatsApp
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
