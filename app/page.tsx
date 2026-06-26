"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { leaks, locaisMapa, localStatusConfig } from "@/lib/mock-data";
import CountdownTimer from "@/components/CountdownTimer";
import HeroCarousel from "@/components/HeroCarousel";
import NewsCard from "@/components/NewsCard";
import PersonagensCarousel from "@/components/PersonagensCarousel";
import { getNoticias } from "@/lib/db";

const leakCfg = {
  confirmado: { label: "CONFIRMADO", color: "#34d399" },
  provavel:   { label: "PROVÁVEL",   color: "#E39986" },
  rumor:      { label: "RUMOR",      color: "#826092" },
  falso:      { label: "FALSO",      color: "#f87171" },
} as const;

function SectionHeader({ title, bar, link, linkLabel }: { title: string; bar: string; link: string; linkLabel?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 3, height: 20, borderRadius: 2, background: bar }} />
        <span style={{ color: "#fff", fontSize: 12, fontWeight: 800, letterSpacing: 3 }}>{title}</span>
      </div>
      {linkLabel && (
        <Link href={link} style={{ color: "#826092", fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: 20, border: "1px solid rgba(130,96,146,0.3)", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background="rgba(130,96,146,0.1)"; e.currentTarget.style.color="#E39986"; }}
          onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#826092"; }}
        >
          {linkLabel} →
        </Link>
      )}
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
      {/* ── HERO ────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(180deg, #1a0533 0%, #2d0f55 25%, #3d1f6b 45%, #1a0533 70%, #07020f 100%)",
        paddingBottom: "clamp(24px, 5vw, 40px)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(180deg, transparent, rgba(227,153,134,0.1) 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: "40%", height: "100%", background: "radial-gradient(ellipse at 100% 0%, rgba(100,117,157,0.12), transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(16px,4vw,24px) clamp(12px,4vw,16px) 0" }}>
          <div className="hero-grid">
            {/* Carousel */}
            {loading ? (
              <div style={{ height: "clamp(280px,45vw,460px)", background: "rgba(255,255,255,0.03)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div className="spinner" />
                  <p style={{ color: "#555", fontSize: 12, marginTop: 12 }}>Carregando...</p>
                </div>
              </div>
            ) : (
              <HeroCarousel noticias={topNoticias} />
            )}

            {/* Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <CountdownTimer />
              <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(130,96,146,0.15)", borderRadius: 14, padding: "14px", flex: 1 }}>
                <div style={{ color: "rgba(130,96,146,0.7)", fontSize: 9, fontWeight: 800, letterSpacing: 2.5, marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid rgba(130,96,146,0.1)" }}>
                  🔴 ÚLTIMAS NOTÍCIAS
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {sideNoticias.map((n) => (
                    <Link key={n.id} href={`/noticias/${n.slug}`} style={{ textDecoration: "none" }}>
                      <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: "9px 11px", borderLeft: "2px solid rgba(130,96,146,0.4)", transition: "background 0.15s" }}
                        onMouseEnter={e => (e.currentTarget.style.background="rgba(130,96,146,0.08)")}
                        onMouseLeave={e => (e.currentTarget.style.background="rgba(255,255,255,0.02)")}>
                        <div style={{ color: "#ddd", fontSize: 11, fontWeight: 600, lineHeight: 1.35, marginBottom: 2 }}>{n.titulo}</div>
                        <div style={{ color: "#444", fontSize: 9 }}>
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

      {/* ── CONTEÚDO ────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(24px,5vw,40px) clamp(12px,4vw,24px)" }}>

        {/* Notícias */}
        <section style={{ marginBottom: "clamp(40px,6vw,60px)" }}>
          <SectionHeader title="NOTÍCIAS" bar="linear-gradient(180deg,#826092,#E39986)" link="/noticias" linkLabel="Ver todas" />
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div className="spinner" style={{ margin: "0 auto" }} />
            </div>
          ) : (
            <div className="grid-responsive-3">
              {gridNoticias.map((n) => <NewsCard key={n.id} noticia={n} />)}
            </div>
          )}
        </section>

        {/* Personagens — carrossel no mobile, grid no desktop */}
        <section style={{ marginBottom: "clamp(40px,6vw,60px)" }}>
          <div style={{ padding: "0 clamp(0px,2vw,0px)" }}>
            <SectionHeader title="PERSONAGENS" bar="linear-gradient(180deg,#E39986,#826092)" link="/personagens" linkLabel="Ver todos" />
          </div>
          <PersonagensCarousel />
        </section>

        {/* Leak + Map */}
        <div className="grid-responsive-2" style={{ marginBottom: "clamp(40px,6vw,60px)" }}>

          {/* Leak Tracker */}
          <section>
            <SectionHeader title="LEAK-O-METER" bar="linear-gradient(180deg,#826092,#64759D)" link="/leaks" linkLabel="Ver todos" />
            <div style={{ background: "linear-gradient(180deg,#0f0f18,#07020f)", border: "1px solid rgba(130,96,146,0.12)", borderRadius: 14, overflow: "hidden" }}>
              {leaks.slice(0, 6).map((l, i) => {
                const cfg = leakCfg[l.status as keyof typeof leakCfg];
                return (
                  <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "clamp(10px,2vw,13px) 14px", borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                    <span style={{ background: cfg.color+"14", color: cfg.color, border: `1px solid ${cfg.color}28`, fontSize: 7, fontWeight: 800, padding: "2px 6px", borderRadius: 4, letterSpacing: 1, flexShrink: 0, minWidth: 68, textAlign: "center" }}>
                      {cfg.label}
                    </span>
                    <span style={{ color: "#bbb", fontSize: "clamp(10px,2.5vw,12px)", flex: 1, lineHeight: 1.4 }}>{l.titulo}</span>
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                      <div style={{ color: cfg.color, fontSize: 11, fontWeight: 900 }}>{l.credibilidade}%</div>
                      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 2, height: 3, width: 36, overflow: "hidden", marginTop: 2 }}>
                        <div style={{ width: `${l.credibilidade}%`, height: "100%", background: cfg.color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Map Explorer */}
          <section>
            <SectionHeader title="MAP EXPLORER" bar="linear-gradient(180deg,#34d399,#64759D)" link="/mapa" linkLabel="Explorar" />
            <Link href="/mapa" style={{ textDecoration: "none", display: "block" }}>
              <div style={{
                background: "linear-gradient(135deg,#0d1a1a,#07020f)",
                border: "1px solid rgba(52,211,153,0.12)", borderRadius: 14, padding: "clamp(14px,4vw,20px)",
                cursor: "pointer", transition: "border-color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor="#34d39944")}
                onMouseLeave={e => (e.currentTarget.style.borderColor="rgba(52,211,153,0.12)")}
              >
                <p style={{ color: "#555", fontSize: "clamp(11px,2.5vw,13px)", marginBottom: 14, lineHeight: 1.6 }}>
                  Explore o Estado de Leonida — localizações confirmadas e vazadas.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                  {Object.entries(localStatusConfig).map(([k, v]) => (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: v.color, boxShadow: `0 0 5px ${v.color}` }} />
                      <span style={{ color: v.color, fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>{v.label}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {locaisMapa.slice(0, 4).map(l => {
                    const c = localStatusConfig[l.status as keyof typeof localStatusConfig]?.color || "#555";
                    return (
                      <span key={l.id} style={{ background: c+"10", color: c, border: `1px solid ${c}22`, fontSize: "clamp(9px,2vw,10px)", padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>
                        📍 {l.nome}
                      </span>
                    );
                  })}
                </div>
                <div style={{ marginTop: 16, background: "rgba(52,211,153,0.05)", borderRadius: 10, padding: "12px", textAlign: "center", color: "#34d399", fontSize: "clamp(11px,2.5vw,13px)", fontWeight: 700, border: "1px solid rgba(52,211,153,0.1)" }}>
                  🗺️ Abrir Map Explorer Interativo →
                </div>
              </div>
            </Link>
          </section>
        </div>

      </div>

      <style>{`
        .spinner {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 3px solid rgba(130,96,146,0.3);
          border-top-color: #826092;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
