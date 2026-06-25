"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { leaks, locaisMapa, personagens, localStatusConfig } from "@/lib/mock-data";
import CountdownTimer from "@/components/CountdownTimer";
import HeroCarousel from "@/components/HeroCarousel";
import NewsCard from "@/components/NewsCard";
import { getNoticias } from "@/lib/db";

const CHAR_IMGS: Record<string, string> = {
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

function SectionHeader({ title, bar, link, linkLabel }: { title: string; bar: string; link: string; linkLabel?: string }) {
  return (
    <div className="section-header">
      <div className="section-title">
        <div className="section-bar" style={{ background: bar }} />
        {title}
      </div>
      {linkLabel && <Link href={link} className="section-link">{linkLabel} →</Link>}
    </div>
  );
}

export default function Home() {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNoticias("todos", 12).then(d => { setNoticias(d); setLoading(false); });
  }, []);

  const topNoticias  = noticias.slice(0, 6);
  const gridNoticias = noticias.slice(0, 9);
  const sideNoticias = noticias.slice(0, 5);

  return (
    <>
      {/* ── HERO SECTION ─────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(180deg, #1a0533 0%, #2d0f55 25%, #3d1f6b 45%, #1a0533 70%, #07020f 100%)",
        paddingBottom: 40, position: "relative", overflow: "hidden",
      }}>
        {/* Decorative glows */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(180deg, transparent, rgba(227,153,134,0.1) 70%, rgba(227,153,134,0.04) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: "40%", height: "100%", background: "radial-gradient(ellipse at 100% 0%, rgba(100,117,157,0.12), transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 16px 0" }}>
          <div className="hero-grid">
            {/* Carousel */}
            {loading ? (
              <div style={{ height: 400, background: "rgba(255,255,255,0.03)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #826092", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
                  <p style={{ color: "#555", fontSize: 12 }}>Carregando notícias...</p>
                </div>
              </div>
            ) : (
              <HeroCarousel noticias={topNoticias} />
            )}

            {/* Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <CountdownTimer />
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(130,96,146,0.18)", borderRadius: 14, padding: "14px 14px", flex: 1 }}>
                <div style={{ color: "rgba(130,96,146,0.8)", fontSize: 9, fontWeight: 800, letterSpacing: 2.5, marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid rgba(130,96,146,0.12)" }}>
                  🔴 ÚLTIMAS NOTÍCIAS
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {sideNoticias.map((n) => (
                    <Link key={n.id} href={`/noticias/${n.slug}`} style={{ textDecoration: "none" }}>
                      <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 8, padding: "9px 11px", borderLeft: "2px solid rgba(130,96,146,0.5)", transition: "background 0.15s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(130,96,146,0.1)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}>
                        <div style={{ color: "#ddd", fontSize: 11, fontWeight: 600, lineHeight: 1.35, marginBottom: 2 }}>{n.titulo}</div>
                        <div style={{ color: "#444", fontSize: 9 }}>{new Date(n.criado_em).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <div className="page-container">

        {/* Grid de notícias */}
        <section style={{ marginBottom: 52 }}>
          <SectionHeader title="TODAS AS NOTÍCIAS" bar="linear-gradient(180deg,#826092,#E39986)" link="/noticias" linkLabel="Ver todas" />
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#444" }}>Carregando...</div>
          ) : (
            <div className="grid-responsive-3">
              {gridNoticias.map((n) => <NewsCard key={n.id} noticia={n} />)}
            </div>
          )}
        </section>

        {/* Personagens */}
        <section style={{ marginBottom: 52 }}>
          <SectionHeader title="PERSONAGENS" bar="linear-gradient(180deg,#E39986,#826092)" link="/personagens" linkLabel="Ver todos" />
          <div className="grid-responsive-3">
            {personagens.slice(0, 3).map((p) => {
              const stCor: Record<string,string> = { confirmado: "#34d399", leaked: "#E39986", rumor: "#826092" };
              const cor = stCor[p.status] || "#826092";
              return (
                <Link key={p.id} href="/personagens" style={{ textDecoration: "none" }}>
                  <div style={{ background: "linear-gradient(180deg,#1a0533,#0f0f18)", border: "1px solid rgba(130,96,146,0.2)", borderRadius: 14, overflow: "hidden", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor="#826092"; e.currentTarget.style.transform="translateY(-3px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(130,96,146,0.2)"; e.currentTarget.style.transform="translateY(0)"; }}>
                    <div style={{ position: "relative", height: 180 }}>
                      <Image src={CHAR_IMGS[p.id] || p.imagem} alt={p.nome} fill style={{ objectFit: "cover", objectPosition: "top" }} unoptimized />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, #1a0533 100%)" }} />
                      <span style={{ position: "absolute", top: 10, right: 10, background: cor+"22", color: cor, border: `1px solid ${cor}44`, fontSize: 8, fontWeight: 800, padding: "2px 7px", borderRadius: 4 }}>
                        {p.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ padding: "12px 14px" }}>
                      <div style={{ color: "#826092", fontSize: 8, fontWeight: 700, letterSpacing: 2, marginBottom: 3 }}>{p.tipo.toUpperCase()}</div>
                      <div style={{ color: "#fff", fontSize: 15, fontWeight: 900, marginBottom: 8 }}>{p.nome}</div>
                      {[
                        { label: "COMBATE", v: p.stats.combate, c: "#f87171" },
                        { label: "DIREÇÃO",  v: p.stats.direcao,  c: "#38bdf8" },
                        { label: "CARISMA", v: p.stats.carisma, c: "#E39986" },
                      ].map(s => (
                        <div key={s.label} style={{ marginBottom: 5 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                            <span style={{ color: "#444", fontSize: 7, fontWeight: 700, letterSpacing: 1 }}>{s.label}</span>
                            <span style={{ color: s.c, fontSize: 7, fontWeight: 900 }}>{s.v}</span>
                          </div>
                          <div style={{ background: "#1a1a2e", borderRadius: 3, height: 3 }}>
                            <div style={{ width: `${s.v}%`, height: "100%", background: s.c, borderRadius: 3 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Leak + Map */}
        <div className="grid-responsive-2" style={{ marginBottom: 52 }}>

          {/* Leak Tracker */}
          <section>
            <SectionHeader title="LEAK-O-METER" bar="linear-gradient(180deg,#826092,#64759D)" link="/leaks" linkLabel="Ver todos" />
            <div style={{ background: "linear-gradient(180deg,#0f0f18,#07020f)", border: "1px solid rgba(130,96,146,0.15)", borderRadius: 12, overflow: "hidden" }}>
              {leaks.slice(0, 6).map((l, i) => {
                const cfg = leakCfg[l.status as keyof typeof leakCfg];
                return (
                  <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                    <span style={{ background: cfg.color+"15", color: cfg.color, border: `1px solid ${cfg.color}30`, fontSize: 7, fontWeight: 800, padding: "2px 6px", borderRadius: 4, letterSpacing: 1, flexShrink: 0, minWidth: 70, textAlign: "center" }}>{cfg.label}</span>
                    <span style={{ color: "#bbb", fontSize: 11, flex: 1, lineHeight: 1.3 }}>{l.titulo}</span>
                    <div style={{ flexShrink: 0 }}>
                      <div style={{ color: cfg.color, fontSize: 10, fontWeight: 900, textAlign: "right" }}>{l.credibilidade}%</div>
                      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 2, height: 3, width: 40, overflow: "hidden", marginTop: 2 }}>
                        <div style={{ width: `${l.credibilidade}%`, height: "100%", background: cfg.color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Map */}
          <section>
            <SectionHeader title="MAP EXPLORER" bar="linear-gradient(180deg,#34d399,#64759D)" link="/mapa" linkLabel="Explorar" />
            <Link href="/mapa" style={{ textDecoration: "none", display: "block" }}>
              <div style={{ background: "linear-gradient(135deg,#0d1a1a,#07020f)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: 12, padding: 18, cursor: "pointer", transition: "border-color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor="#34d399")}
                onMouseLeave={e => (e.currentTarget.style.borderColor="rgba(52,211,153,0.15)")}>
                <p style={{ color: "#555", fontSize: 12, marginBottom: 14, lineHeight: 1.6 }}>
                  Explore o Estado de Leonida — localizações confirmadas e vazadas do mundo aberto de GTA VI.
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                  {Object.entries(localStatusConfig).map(([k, v]) => (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: v.color, boxShadow: `0 0 5px ${v.color}` }} />
                      <span style={{ color: v.color, fontSize: 8, fontWeight: 700, letterSpacing: 1 }}>{v.label}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {locaisMapa.slice(0, 4).map(l => {
                    const c = localStatusConfig[l.status as keyof typeof localStatusConfig]?.color || "#555";
                    return <span key={l.id} style={{ background: c+"12", color: c, border: `1px solid ${c}28`, fontSize: 9, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>📍 {l.nome}</span>;
                  })}
                </div>
                <div style={{ marginTop: 14, background: "rgba(52,211,153,0.05)", borderRadius: 8, padding: "10px", textAlign: "center", color: "#34d399", fontSize: 12, fontWeight: 700, border: "1px solid rgba(52,211,153,0.12)" }}>
                  Abrir Map Explorer →
                </div>
              </div>
            </Link>
          </section>
        </div>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
