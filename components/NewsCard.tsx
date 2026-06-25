"use client";

import Link from "next/link";
import Image from "next/image";
import { Noticia, categoriaConfig } from "@/lib/mock-data";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  return `há ${Math.floor(h / 24)}d`;
}

function formatViews(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function NewsCard({ noticia, size = "normal" }: { noticia: Noticia; size?: "normal" | "large" }) {
  const cat = categoriaConfig[noticia.categoria];
  const isLarge = size === "large";

  return (
    <Link href={`/noticias/${noticia.slug}`} style={{ display: "block", textDecoration: "none" }}>
      <div
        style={{
          background: "#111",
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid #1a1a1a",
          transition: "border-color 0.2s, transform 0.2s",
          cursor: "pointer",
          height: "100%",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "#826092";
          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "#1a1a1a";
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        }}
      >
        {/* Imagem */}
        <div style={{ position: "relative", height: isLarge ? 240 : 180 }}>
          <Image
            src={noticia.imagem}
            alt={noticia.titulo}
            fill
            style={{ objectFit: "cover" }}
            unoptimized
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, #111 100%)" }} />
          {/* Badge categoria */}
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <span style={{
              background: cat.bg,
              color: cat.color,
              border: `1px solid ${cat.color}55`,
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: 1.5,
              padding: "3px 8px",
              borderRadius: 4,
            }}>
              {cat.label}
            </span>
          </div>
          {/* Badge NOVO */}
          <div style={{ position: "absolute", top: 10, right: 10 }}>
            <span style={{ background: "#E39986", color: "#000", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 4 }}>
              NOVO
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div style={{ padding: isLarge ? "16px 18px" : "12px 14px" }}>
          <h3 style={{
            color: "#fff",
            fontSize: isLarge ? 16 : 13,
            fontWeight: 800,
            lineHeight: 1.4,
            marginBottom: 8,
          }}>
            {noticia.titulo}
          </h3>

          {isLarge && (
            <div style={{ background: "#E3998615", border: "1px solid #E3998633", borderRadius: 6, padding: "8px 10px", marginBottom: 10 }}>
              <span style={{ color: "#E39986", fontSize: 10, fontWeight: 700 }}>🤖 IA: </span>
              <span style={{ color: "#aaa", fontSize: 11 }}>{noticia.resumo_ia}</span>
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
