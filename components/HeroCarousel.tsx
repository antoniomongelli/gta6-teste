"use client";

import { useState, useEffect, useCallback } from "react";
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

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80",
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80",
  "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&q=80",
  "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=1200&q=80",
];

export default function HeroCarousel({ noticias }: { noticias: any[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const items = noticias.slice(0, 5);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % items.length);
  }, [items.length]);

  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next, items.length]);

  if (!items.length) return null;

  const item = items[current];
  const cat = categoriaConfig[item.categoria as keyof typeof categoriaConfig] || categoriaConfig.rumor;
  const img = item.imagem_url || FALLBACK_IMAGES[current % FALLBACK_IMAGES.length];

  return (
    <div
      style={{ position: "relative", borderRadius: 16, overflow: "hidden", height: 480 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image */}
      <div style={{ position: "absolute", inset: 0 }}>
        <Image
          src={img}
          alt={item.titulo}
          fill
          style={{ objectFit: "cover" }}
          unoptimized
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGES[0];
          }}
        />
        {/* GTA 6 cover-inspired gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(10,0,20,0.2) 0%, rgba(30,10,50,0.5) 30%, rgba(130,96,146,0.4) 60%, rgba(10,0,20,0.95) 100%)"
        }} />
        {/* Side vignette */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, rgba(10,0,20,0.6) 0%, transparent 30%, transparent 70%, rgba(10,0,20,0.6) 100%)"
        }} />
      </div>

      {/* Glow decoration */}
      <div style={{
        position: "absolute", bottom: 0, left: "20%", right: "20%", height: 200,
        background: "radial-gradient(ellipse at 50% 100%, rgba(227,153,134,0.25), transparent 70%)",
        pointerEvents: "none"
      }} />

      {/* Content */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "32px 36px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <span style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.color}66`, fontSize: 10, fontWeight: 800, letterSpacing: 2, padding: "4px 12px", borderRadius: 4 }}>{cat.label}</span>
          <span style={{ background: "rgba(227,153,134,0.2)", color: "#E39986", border: "1px solid rgba(227,153,134,0.4)", fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 4 }}>🔥 EM ALTA</span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, alignSelf: "center" }}>{timeAgo(item.criado_em)}</span>
        </div>

        <Link href={`/noticias/${item.slug}`} style={{ textDecoration: "none" }}>
          <h2 style={{
            color: "#fff", fontSize: 26, fontWeight: 900, lineHeight: 1.3, marginBottom: 14,
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
            maxWidth: 680,
            cursor: "pointer",
          }}>
            {item.titulo}
          </h2>
        </Link>

        {item.resumo_ia && (
          <div style={{
            background: "rgba(227,153,134,0.1)", border: "1px solid rgba(227,153,134,0.3)",
            borderRadius: 8, padding: "10px 14px", maxWidth: 620, marginBottom: 20
          }}>
            <span style={{ color: "#E39986", fontSize: 11, fontWeight: 700 }}>🤖 </span>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{item.resumo_ia}</span>
          </div>
        )}

        {/* Navigation dots */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 24 : 8, height: 8,
                borderRadius: 4, border: "none", cursor: "pointer",
                background: i === current ? "#E39986" : "rgba(255,255,255,0.3)",
                transition: "all 0.3s ease", padding: 0,
              }}
            />
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button onClick={prev} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 14 }}>‹</button>
            <button onClick={next} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 14 }}>›</button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {!paused && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.1)" }}>
          <div
            key={current}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #826092, #E39986)",
              animation: "progress 5s linear",
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes progress {
          from { width: 0% }
          to { width: 100% }
        }
      `}</style>
    </div>
  );
}
