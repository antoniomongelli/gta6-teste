"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { personagens } from "@/lib/mock-data";

const CHAR_IMGS: Record<string, string> = {
  "lucia":        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=90",
  "jason":        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=90",
  "victor-crane": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=90",
  "figura-misteriosa": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=600&q=90",
  "cal-henderson": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=90",
};

const STATUS_COR: Record<string, string> = {
  confirmado: "#34d399",
  leaked: "#E39986",
  rumor: "#826092",
};

const STATS = [
  { key: "combate",     label: "COMBATE",    color: "#f87171" },
  { key: "direcao",     label: "DIREÇÃO",    color: "#38bdf8" },
  { key: "furtividade", label: "FURTIV.",    color: "#826092" },
  { key: "carisma",     label: "CARISMA",   color: "#E39986" },
  { key: "hacking",     label: "HACK",      color: "#34d399" },
];

export default function PersonagensCarousel() {
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);
  const touchEnd   = useRef<number | null>(null);

  const next = () => setActive(a => (a + 1) % personagens.length);
  const prev = () => setActive(a => (a - 1 + personagens.length) % personagens.length);

  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; touchEnd.current = null; };
  const onTouchMove  = (e: React.TouchEvent) => { touchEnd.current = e.touches[0].clientX; };
  const onTouchEnd   = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const d = touchStart.current - touchEnd.current;
    if (Math.abs(d) > 50) d > 0 ? next() : prev();
  };

  const p = personagens[active];
  const cor = STATUS_COR[p.status] || "#826092";
  const img = CHAR_IMGS[p.id] || p.imagem;

  return (
    <div>
      {/* Mobile: carrossel 1 por 1 */}
      <div className="chars-mobile">
        <div
          style={{ position: "relative", userSelect: "none" }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <Link href="/personagens" style={{ textDecoration: "none", display: "block" }}>
            <div style={{
              background: "linear-gradient(180deg, #1a0533, #0f0f18)",
              border: `1px solid ${cor}33`,
              borderRadius: 18, overflow: "hidden",
              boxShadow: `0 0 30px ${cor}15`,
            }}>
              {/* Imagem grande */}
              <div style={{ position: "relative", height: 280 }}>
                <Image src={img} alt={p.nome} fill style={{ objectFit: "cover", objectPosition: "top" }} unoptimized />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 35%, ${cor}10 65%, #0f0f18 100%)` }} />
                {/* Status badge */}
                <div style={{ position: "absolute", top: 14, left: 14 }}>
                  <span style={{ background: cor+"22", color: cor, border: `1px solid ${cor}55`, fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 20, letterSpacing: 1 }}>
                    {p.status.toUpperCase()}
                  </span>
                </div>
                {/* Tipo */}
                <div style={{ position: "absolute", top: 14, right: 14 }}>
                  <span style={{ background: "rgba(0,0,0,0.6)", color: "#ccc", fontSize: 9, fontWeight: 700, padding: "4px 10px", borderRadius: 20, backdropFilter: "blur(4px)" }}>
                    {p.tipo.toUpperCase()}
                  </span>
                </div>
                {/* Nome sobre imagem */}
                <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                  <h3 style={{ color: "#fff", fontSize: 24, fontWeight: 900, textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
                    {p.nome}
                  </h3>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: "16px 18px 20px" }}>
                <p style={{ color: "#888", fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
                  {p.descricao}
                </p>

                {/* Stats */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {STATS.map(s => (
                    <div key={s.key}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ color: "#555", fontSize: 9, fontWeight: 700, letterSpacing: 1.5 }}>{s.label}</span>
                        <span style={{ color: s.color, fontSize: 9, fontWeight: 900 }}>
                          {(p.stats as any)[s.key]}
                        </span>
                      </div>
                      <div style={{ background: "#1a1a2e", borderRadius: 4, height: 5, overflow: "hidden" }}>
                        <div style={{
                          width: `${(p.stats as any)[s.key]}%`, height: "100%",
                          background: `linear-gradient(90deg, ${s.color}88, ${s.color})`,
                          borderRadius: 4, transition: "width 0.6s ease",
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Link>

          {/* Nav buttons */}
          <button onClick={prev} style={{
            position: "absolute", left: -14, top: "50%", transform: "translateY(-50%)",
            background: "rgba(130,96,146,0.9)", border: "none", color: "#fff",
            width: 36, height: 36, borderRadius: "50%", fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
          }}>‹</button>
          <button onClick={next} style={{
            position: "absolute", right: -14, top: "50%", transform: "translateY(-50%)",
            background: "rgba(130,96,146,0.9)", border: "none", color: "#fff",
            width: 36, height: 36, borderRadius: "50%", fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
          }}>›</button>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
          {personagens.map((pp, i) => (
            <button key={pp.id} onClick={() => setActive(i)} style={{
              width: i === active ? 20 : 7, height: 7, borderRadius: 4,
              background: i === active ? cor : "rgba(255,255,255,0.2)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>

        {/* Hint deslize */}
        <p style={{ textAlign: "center", color: "#444", fontSize: 10, marginTop: 8 }}>
          ← deslize para navegar →
        </p>
      </div>

      {/* Desktop: grid 3 colunas */}
      <div className="chars-desktop">
        <div className="grid-responsive-3">
          {personagens.slice(0, 3).map((pp) => {
            const c = STATUS_COR[pp.status] || "#826092";
            const im = CHAR_IMGS[pp.id] || pp.imagem;
            return (
              <Link key={pp.id} href="/personagens" style={{ textDecoration: "none" }}>
                <div style={{
                  background: "linear-gradient(180deg,#1a0533,#0f0f18)",
                  border: `1px solid ${c}22`, borderRadius: 14, overflow: "hidden",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=c+"55"; e.currentTarget.style.transform="translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=c+"22"; e.currentTarget.style.transform="translateY(0)"; }}
                >
                  <div style={{ position: "relative", height: 200 }}>
                    <Image src={im} alt={pp.nome} fill style={{ objectFit: "cover", objectPosition: "top" }} unoptimized />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, #1a0533 100%)" }} />
                    <span style={{ position: "absolute", top: 10, right: 10, background: c+"22", color: c, border: `1px solid ${c}44`, fontSize: 8, fontWeight: 800, padding: "2px 7px", borderRadius: 4 }}>
                      {pp.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ color: "#826092", fontSize: 8, fontWeight: 700, letterSpacing: 2, marginBottom: 3 }}>{pp.tipo.toUpperCase()}</div>
                    <div style={{ color: "#fff", fontSize: 15, fontWeight: 900, marginBottom: 8 }}>{pp.nome}</div>
                    {STATS.slice(0, 3).map(s => (
                      <div key={s.key} style={{ marginBottom: 5 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                          <span style={{ color: "#444", fontSize: 7, fontWeight: 700, letterSpacing: 1 }}>{s.label}</span>
                          <span style={{ color: s.color, fontSize: 7, fontWeight: 900 }}>{(pp.stats as any)[s.key]}</span>
                        </div>
                        <div style={{ background: "#1a1a2e", borderRadius: 3, height: 3 }}>
                          <div style={{ width: `${(pp.stats as any)[s.key]}%`, height: "100%", background: s.color, borderRadius: 3 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .chars-mobile  { display: block; padding: 0 14px; }
          .chars-desktop { display: none; }
        }
        @media (min-width: 768px) {
          .chars-mobile  { display: none; }
          .chars-desktop { display: block; }
        }
      `}</style>
    </div>
  );
}
