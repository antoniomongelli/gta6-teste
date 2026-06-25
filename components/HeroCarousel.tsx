"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { categoriaConfig } from "@/lib/mock-data";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  return `há ${Math.floor(h / 24)}d`;
}

const FALLBACK = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80",
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80",
  "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&q=80",
  "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=1200&q=80",
  "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200&q=80",
];

export default function HeroCarousel({ noticias }: { noticias: any[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const touchEnd   = useRef<number | null>(null);

  const items = noticias.slice(0, 6);

  const next = useCallback(() => setCurrent((c) => (c + 1) % items.length), [items.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [paused, next, items.length]);

  // Touch / swipe support
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    touchEnd.current = null;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const dist = touchStart.current - touchEnd.current;
    if (Math.abs(dist) > 50) dist > 0 ? next() : prev();
  };

  if (!items.length) return (
    <div style={{ height: 400, background: "#0f0f18", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#444" }}>Carregando notícias...</p>
    </div>
  );

  const item = items[current];
  const cat  = categoriaConfig[item.categoria as keyof typeof categoriaConfig] || categoriaConfig.rumor;
  const img  = item.imagem_url || FALLBACK[current % FALLBACK.length];

  return (
    <div
      style={{ position: "relative", borderRadius: 16, overflow: "hidden", height: "clamp(300px, 50vw, 480px)", cursor: "grab" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      {items.map((it, i) => (
        <div key={it.id || i} style={{
          position: "absolute", inset: 0,
          opacity: i === current ? 1 : 0,
          transition: "opacity 0.7s ease",
          pointerEvents: i === current ? "auto" : "none",
        }}>
          <Image
            src={it.imagem_url || FALLBACK[i % FALLBACK.length]}
            alt={it.titulo}
            fill
            style={{ objectFit: "cover" }}
            unoptimized
            priority={i === 0}
          />
        </div>
      ))}

      {/* Gradient overlay — GTA 6 cover inspired */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(10,0,20,0.15) 0%, rgba(40,10,70,0.4) 35%, rgba(130,96,146,0.35) 60%, rgba(7,2,15,0.97) 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(90deg, rgba(7,2,15,0.5) 0%, transparent 35%, transparent 65%, rgba(7,2,15,0.5) 100%)",
      }} />

      {/* Bottom salmon glow */}
      <div style={{
        position: "absolute", bottom: 0, left: "15%", right: "15%", height: 160,
        background: "radial-gradient(ellipse at 50% 100%, rgba(227,153,134,0.2), transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "clamp(16px,4vw,32px) clamp(16px,4vw,36px)" }}>

        {/* Badges */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.color}66`, fontSize: "clamp(8px,2vw,10px)", fontWeight: 800, letterSpacing: 1.5, padding: "3px 10px", borderRadius: 4 }}>
            {cat.label}
          </span>
          <span style={{ background: "rgba(227,153,134,0.2)", color: "#E39986", border: "1px solid rgba(227,153,134,0.4)", fontSize: "clamp(8px,2vw,10px)", fontWeight: 700, padding: "3px 10px", borderRadius: 4 }}>
            🔥 EM ALTA
          </span>
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "clamp(9px,2vw,11px)", alignSelf: "center" }}>
            {timeAgo(item.criado_em)}
          </span>
        </div>

        {/* Título */}
        <Link href={`/noticias/${item.slug}`} style={{ textDecoration: "none" }}>
          <h2 style={{
            color: "#fff",
            fontSize: "clamp(16px,3.5vw,26px)",
            fontWeight: 900, lineHeight: 1.25, marginBottom: 12,
            textShadow: "0 2px 20px rgba(0,0,0,0.9)",
            maxWidth: 660,
          }}>
            {item.titulo}
          </h2>
        </Link>

        {/* Resumo IA */}
        {item.resumo_ia && (
          <div style={{
            background: "rgba(227,153,134,0.1)", border: "1px solid rgba(227,153,134,0.25)",
            borderRadius: 8, padding: "8px 12px", maxWidth: 580, marginBottom: 16,
            display: "none",
          }} className="carousel-ia">
            <span style={{ color: "#E39986", fontSize: 10, fontWeight: 700 }}>🤖 </span>
            <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>{item.resumo_ia}</span>
          </div>
        )}

        {/* Dots + nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {items.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className="carousel-dot" style={{
              width: i === current ? 24 : 8,
              background: i === current ? "#E39986" : "rgba(255,255,255,0.25)",
            }} />
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {[{ fn: prev, icon: "‹" }, { fn: next, icon: "›" }].map(({ fn, icon }) => (
              <button key={icon} onClick={fn} style={{
                background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff", width: 36, height: 36, borderRadius: "50%", cursor: "pointer",
                fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(4px)",
              }}>
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {!paused && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.08)" }}>
          <div key={current} style={{
            height: "100%",
            background: "linear-gradient(90deg, #826092, #E39986)",
            animation: "progress 5.5s linear",
          }} />
        </div>
      )}

      <style>{`
        @keyframes progress { from { width:0% } to { width:100% } }
        @media (min-width: 640px) { .carousel-ia { display: block !important; } }
      `}</style>
    </div>
  );
}
