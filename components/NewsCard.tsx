"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { categoriaConfig } from "@/lib/mock-data";

const FALLBACK = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
  "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&q=80",
  "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=800&q=80",
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  return `há ${Math.floor(h / 24)}d`;
}

function fmtViews(n: number) {
  if (!n) return "";
  if (n >= 1e6) return `${(n/1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n/1e3).toFixed(1)}k`;
  return String(n);
}

export default function NewsCard({ noticia, size = "normal" }: { noticia: any; size?: "normal" | "large" }) {
  const fallback = FALLBACK[Math.abs((noticia.titulo?.charCodeAt(0) || 0)) % FALLBACK.length];
  const [imgSrc, setImgSrc] = useState(noticia.imagem_url || fallback);
  const [pressed, setPressed] = useState(false);

  const cat = categoriaConfig[noticia.categoria as keyof typeof categoriaConfig] || categoriaConfig.rumor;

  return (
    <Link href={`/noticias/${noticia.slug}`} style={{ display: "block", height: "100%" }}>
      <div
        className="news-card-wrap"
        style={{
          background: "linear-gradient(180deg, #0f0f1e 0%, #080814 100%)",
          borderRadius: 14, overflow: "hidden",
          border: `1px solid ${pressed ? "#826092" : "rgba(130,96,146,0.2)"}`,
          height: "100%",
          transform: pressed ? "scale(0.98)" : "scale(1)",
          transition: "all 0.2s ease",
          boxShadow: pressed ? "0 4px 20px rgba(130,96,146,0.2)" : "none",
        }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
      >
        {/* Imagem */}
        <div style={{ position: "relative", height: size === "large" ? 240 : 180, overflow: "hidden" }}>
          <Image
            src={imgSrc}
            alt={noticia.titulo}
            fill
            style={{ objectFit: "cover", transform: pressed ? "scale(1.04)" : "scale(1)", transition: "transform 0.4s ease" }}
            unoptimized
            onError={() => setImgSrc(fallback)}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, transparent 40%, rgba(8,8,20,0.92) 100%)" }} />

          {/* Badges */}
          <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 5 }}>
            <span style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.color}55`, fontSize: 8, fontWeight: 800, letterSpacing: 1.2, padding: "3px 8px", borderRadius: 4 }}>
              {cat.label}
            </span>
          </div>
          <span style={{ position: "absolute", top: 10, right: 10, background: "#E39986", color: "#000", fontSize: 8, fontWeight: 800, padding: "3px 7px", borderRadius: 4 }}>
            NOVO
          </span>
        </div>

        {/* Texto */}
        <div style={{ padding: "12px 14px" }}>
          <h3 style={{ color: "#f0f0f0", fontSize: size === "large" ? 15 : 13, fontWeight: 800, lineHeight: 1.4, marginBottom: 8 }}>
            {noticia.titulo}
          </h3>

          {size === "large" && noticia.resumo_ia && (
            <div style={{ background: "rgba(227,153,134,0.07)", border: "1px solid rgba(227,153,134,0.2)", borderRadius: 6, padding: "6px 9px", marginBottom: 8 }}>
              <span style={{ color: "#E39986", fontSize: 9, fontWeight: 700 }}>🤖 </span>
              <span style={{ color: "#888", fontSize: 11, lineHeight: 1.4 }}>{noticia.resumo_ia}</span>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#555", fontSize: 10 }}>{timeAgo(noticia.criado_em)}</span>
            {noticia.views > 0 && <span style={{ color: "#444", fontSize: 10 }}>👁 {fmtViews(noticia.views)}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
