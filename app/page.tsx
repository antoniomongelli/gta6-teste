"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { leaks, locaisMapa, personagens, localStatusConfig } from "@/lib/mock-data";
import CountdownTimer from "@/components/CountdownTimer";
import HeroCarousel from "@/components/HeroCarousel";
import NewsCard from "@/components/NewsCard";
import { getNoticias } from "@/lib/db";

const CHAR_IMAGES: Record<string, string> = {
  "lucia":        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=90",
  "jason":        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=90",
  "victor-crane": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=90",
};

const leakCfg = {
  confirmado: { label: "CONFIRMADO", color: "#34d399" },
  provavel:   { label: "PROVÁVEL",   color: "#E39986" },
  rumor:      { label: "RUMOR",      color: "#826092" },
  falso:      { label: "FALSO",      color: "#f87171" },
} as const;

export default function Home() {
  const [noticias, setNoticias] = useState<any[]>([]);

  useEffect(() => {
    getNoticias("todos", 12).then(setNoticias);
  }, []);

  const topNoticias     = noticias.slice(0, 5);
  const gridNoticias    = noticias.slice(0, 9);
  const sidebarNoticias = noticias.slice(0, 5);

  return (
    <>
      {/* ── HERO SECTION com gradiente GTA 6 ─────────────────── */}
      <div style={{
        background: "linear-gradient(180deg, #1a0533 0%, #2d0f55 20%, #3d1f6b 40%, #1a0533 70%, #07020f 100%)",
        padding: "0 0 40px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Vice City sunset glow */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "60%",
          background: "linear-gradient(180deg, transparent, rgba(227,153,134,0.12) 60%, rgba(227,153,134,0.05) 100%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: 0, right: 0, width: "40%", height: "100%",
          background: "radial-gradient(ellipse at 100% 0%, rgba(100,117,157,0.15), transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.65fr 1fr", gap: 20 }}>

            {/* Carrossel */}
            <HeroCarousel noticias={topNoticias} />

            {/* Sidebar direita */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <CountdownTimer />

              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(130,96,146,0.2)",
                borderRadius: 14, padding: "14px 16px", flex: 1,
              }}>
                <div style={{ color: "rgba(130,96,146,0.8)", fontSize: 10, fontWeight: 800, letterSpacing: 2, marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid rgba(130,96,146,0.15)" }}>
                  🔴 ÚLTIMAS NOTÍCIAS
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {sidebarNoticias.map((n) => (
                    <Link key={n.id} href={`/noticias/${n.slug}`} style={{ textDecoration: "none" }}>
                      <div style={{
                        background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "9px 12px",
                        borderLeft: "2px solid #826092", transition: "background 0.15s",
                      }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(130,96,146,0.1)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                      >
                        <div style={{ color: "#e0e0e0", fontSize: 11, fontWeight: 600, lineHeight: 1.35, marginBottom: 3 }}>{n.titulo}</div>
                        <div style={{ color: "#555", fontSize: 9 }}>
                          {new Date(n.criado_em).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTEÚDO PRINCIPAL ────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 24px" }}>

        {/* Grid de notícias */}
        <section style={{ marginBottom: 60 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 3, height: 20, background: "linear-gradient(180deg, #826092, #E39986)", borderRadius: 2 }} />
              <h2 style={{ color: "#fff", fontSize: 13, fontWeight: 800, letterSpacing: 3 }}>TODAS AS NOTÍCIAS</h2>
            </div>
            <Link href="/noticias" style={{ color: "#826092", fontSize: 11, fontWeight: 700 }}>Ver todas →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {gridNoticias.map((n) => <NewsCard key={n.id} noticia={n} />)}
          </div>
        </section>

        {/* Personagens */}
        <section style={{ marginBottom: 60 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 3, height: 20, background: "linear-gradient(180deg, #E39986, #826092)", borderRadius: 2 }} />
              <h2 style={{ color: "#fff", fontSize: 13, fontWeight: 800, letterSpacing: 3 }}>PERSONAGENS</h2>
            </div>
            <Link href="/personagens" style={{ color: "#826092", fontSize: 11, fontWeight: 700 }}>Ver todos →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {personagens.slice(0, 3).map((p) => {
              const stCor: Record<string, string> = { confirmado: "#34d399", leaked: "#E39986", rumor: "#826092" };
              const cor = stCor[p.status] || "#826092";
              const img = CHAR_IMAGES[p.id] || p.imagem;
              return (
                <Link key={p.id} href="/personagens" style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "linear-gradient(180deg, #1a0533, #0f0f18)",
                    border: "1px solid rgba(130,96,146,0.25)", borderRadius: 14, overflow: "hidden",
                    transition: "all 0.25s",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#826092"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(130,96,146,0.25)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div style={{ position: "relative", height: 200 }}>
                      <Image src={img} alt={p.nome} fill style={{ objectFit: "cover", objectPosition: "top" }} unoptimized />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, #1a0533 100%)" }} />
                      <div style={{ position: "absolute", top: 10, right: 10 }}>
                        <span style={{ background: cor + "22", color: cor, border: `1px solid ${cor}55`, fontSize: 8, fontWeight: 800, padding: "2px 7px", borderRadius: 4 }}>
                          {p.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: "14px 16px" }}>
                      <div style={{ color: "#826092", fontSize: 9, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>{p.tipo.toUpperCase()}</div>
                      <div style={{ color: "#fff", fontSize: 16, fontWeight: 900, marginBottom: 10 }}>{p.nome}</div>
                      <p style={{ color: "#666", fontSize: 11, lineHeight: 1.5, marginBottom: 12 }}>{p.descricao}</p>
                      {/* Stats */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        {[
                          { label: "COMBATE", value: p.stats.combate, color: "#f87171" },
                          { label: "DIREÇÃO", value: p.stats.direcao, color: "#38bdf8" },
                          { label: "CARISMA", value: p.stats.carisma, color: "#E39986" },
                        ].map(s => (
                          <div key={s.label}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                              <span style={{ color: "#555", fontSize: 8, fontWeight: 700, letterSpacing: 1 }}>{s.label}</span>
                              <span style={{ color: s.color, fontSize: 8, fontWeight: 900 }}>{s.value}</span>
                            </div>
                            <div style={{ background: "#1a1a2e", borderRadius: 3, height: 4, overflow: "hidden" }}>
                              <div style={{ width: `${s.value}%`, height: "100%", background: s.color, borderRadius: 3 }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Leak Tracker + Map */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 60 }}>

          {/* Leak Tracker */}
          <section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 3, height: 20, background: "linear-gradient(180deg, #826092, #64759D)", borderRadius: 2 }} />
                <h2 style={{ color: "#fff", fontSize: 13, fontWeight: 800, letterSpacing: 3 }}>LEAK-O-METER</h2>
              </div>
              <Link href="/leaks" style={{ color: "#826092", fontSize: 11, fontWeight: 700 }}>Ver todos →</Link>
            </div>
            <div style={{ background: "linear-gradient(180deg, #0f0f18, #07020f)", border: "1px solid rgba(130,96,146,0.2)", borderRadius: 12, overflow: "hidden" }}>
              {leaks.slice(0, 6).map((leak, i) => {
                const cfg = leakCfg[leak.status as keyof typeof leakCfg];
                return (
                  <div key={leak.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <span style={{ background: cfg.color + "18", color: cfg.color, border: `1px solid ${cfg.color}33`, fontSize: 8, fontWeight: 800, padding: "2px 7px", borderRadius: 4, letterSpacing: 1, flexShrink: 0, minWidth: 74, textAlign: "center" }}>{cfg.label}</span>
                    <span style={{ color: "#ccc", fontSize: 12, flex: 1, lineHeight: 1.3 }}>{leak.titulo}</span>
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                      <div style={{ color: cfg.color, fontSize: 11, fontWeight: 900 }}>{leak.credibilidade}%</div>
                      <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 3, height: 3, width: 48, overflow: "hidden", marginTop: 2 }}>
                        <div style={{ width: `${leak.credibilidade}%`, height: "100%", background: cfg.color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Map preview */}
          <section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 3, height: 20, background: "linear-gradient(180deg, #34d399, #64759D)", borderRadius: 2 }} />
                <h2 style={{ color: "#fff", fontSize: 13, fontWeight: 800, letterSpacing: 3 }}>MAP EXPLORER</h2>
              </div>
              <Link href="/mapa" style={{ color: "#34d399", fontSize: 11, fontWeight: 700 }}>Explorar →</Link>
            </div>
            <Link href="/mapa" style={{ textDecoration: "none", display: "block" }}>
              <div style={{
                background: "linear-gradient(135deg, #0d1a1a, #07020f)",
                border: "1px solid rgba(52,211,153,0.2)", borderRadius: 12, padding: 20, cursor: "pointer",
                transition: "border-color 0.2s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#34d399")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(52,211,153,0.2)")}
              >
                <p style={{ color: "#666", fontSize: 12, marginBottom: 16, lineHeight: 1.5 }}>
                  Explore o Estado de Leonida — clique nos marcadores para ver localizações confirmadas e vazadas do mundo aberto de GTA VI.
                </p>
                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  {Object.entries(localStatusConfig).map(([key, val]) => (
                    <div key={key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: val.color, boxShadow: `0 0 6px ${val.color}` }} />
                      <span style={{ color: val.color, fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>{val.label}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {locaisMapa.slice(0, 4).map(l => {
                    const cor = localStatusConfig[l.status as keyof typeof localStatusConfig]?.color || "#555";
                    return (
                      <span key={l.id} style={{ background: cor + "15", color: cor, border: `1px solid ${cor}33`, fontSize: 10, padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>
                        📍 {l.nome}
                      </span>
                    );
                  })}
                </div>
                <div style={{ marginTop: 16, background: "rgba(52,211,153,0.06)", borderRadius: 8, padding: "10px 14px", textAlign: "center", color: "#34d399", fontSize: 12, fontWeight: 700, border: "1px solid rgba(52,211,153,0.15)" }}>
                  Abrir Map Explorer Interativo →
                </div>
              </div>
            </Link>
          </section>
        </div>

      </div>
    </>
  );
}
