"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { categoriaConfig } from "@/lib/mock-data";

const FALLBACK_IMGS = [
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

function formatViews(n: number) {
  if (!n) return "0";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function NewsCard({ noticia, size = "normal" }: { noticia: any; size?: "normal" | "large" }) {
  const [imgSrc, setImgSrc] = useState(
    noticia.imagem_url || FALLBACK_IMGS[Math.abs(noticia.titulo?.charCodeAt(0) || 0) % FALLBACK_IMGS.length]
  );
  const [hovered, setHovered] = useState(false);

  const cat = categoriaConfig[noticia.categoria as keyof typeof categoriaConfig] || categoriaConfig.rumor;
  const isLarge = size === "large";

  return (
    <Link href={`/noticias/${noticia.slug}`} style={{ display: "block", textDecoration: "none", height: "100%" }}>
      <div
        style={{
          background: "#0f0f18",
          borderRadius: 12,
          overflow: "hidden",
          border: `1px solid ${hovered ? "#826092" : "#1a1a2e"}`,
          transition: "all 0.25s ease",
          cursor: "pointer",
          height: "100%",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          boxShadow: hovered ? "0 8px 30px rgba(130,96,146,0.2)" : "none",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Imagem */}
        <div style={{ position: "relative", height: isLarge ? 260 : 190 }}>
          <Image
            src={imgSrc}
            alt={noticia.titulo}
            fill
            style={{ objectFit: "cover", transition: "transform 0.4s ease", transform: hovered ? "scale(1.03)" : "scale(1)" }}
            unoptimized
            onError={() => setImgSrc(FALLBACK_IMGS[0])}
          />
          {/* Gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 40%, rgba(10,0,20,0.9) 100%)"
          }} />
          {/* Badges */}
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <span style={{
              background: cat.bg, color: cat.color, border: `1px solid ${cat.color}66`,
              fontSize: 9, fontWeight: 800, letterSpacing: 1.5, padding: "3px 8px", borderRadius: 4,
            }}>{cat.label}</span>
          </div>
          <div style={{ position: "absolute", top: 10, right: 10 }}>
            <span style={{ background: "#E39986", color: "#000", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 4 }}>NOVO</span>
          </div>
        </div>

        {/* Conteúdo */}
        <div style={{ padding: isLarge ? "16px 18px" : "12px 14px" }}>
          <h3 style={{ color: "#fff", fontSize: isLarge ? 16 : 13, fontWeight: 800, lineHeight: 1.4, marginBottom: 8 }}>
            {noticia.titulo}
          </h3>

          {isLarge && noticia.resumo_ia && (
            <div style={{ background: "rgba(227,153,134,0.08)", border: "1px solid rgba(227,153,134,0.2)", borderRadius: 6, padding: "7px 10px", marginBottom: 10 }}>
              <span style={{ color: "#E39986", fontSize: 10, fontWeight: 700 }}>🤖 </span>
              <span style={{ color: "#999", fontSize: 11 }}>{noticia.resumo_ia}</span>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#555", fontSize: 10 }}>{timeAgo(noticia.criado_em)}</span>
            <span style={{ color: "#444", fontSize: 10 }}>👁 {formatViews(noticia.views)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
