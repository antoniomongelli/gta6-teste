import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { categoriaConfig } from "@/lib/mock-data";
import NewsCard from "@/components/NewsCard";
import { getNoticiaPorSlug, getNoticiasRelacionadas } from "@/lib/db";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  return `há ${Math.floor(h / 24)}d`;
}

export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const noticia = await getNoticiaPorSlug(slug);
  if (!noticia) notFound();

  const cat = categoriaConfig[noticia.categoria as keyof typeof categoriaConfig] || categoriaConfig.rumor;
  const relacionadas = await getNoticiasRelacionadas(noticia.id, 3);
  const waText = encodeURIComponent(`🎮 *${noticia.titulo}*\n\n${noticia.resumo_ia}\n\nLeia mais: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://gta6.news'}/noticias/${noticia.slug}`);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32 }}>
        <article>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 20, color: "#444", fontSize: 12 }}>
            <Link href="/" style={{ color: "#826092" }}>Home</Link>
            <span>›</span>
            <Link href="/noticias" style={{ color: "#826092" }}>Notícias</Link>
            <span>›</span>
            <span style={{ color: "#666" }}>{noticia.titulo.slice(0, 40)}...</span>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14 }}>
            <span style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.color}55`, fontSize: 10, fontWeight: 800, letterSpacing: 1.5, padding: "4px 10px", borderRadius: 4 }}>{cat.label}</span>
            <span style={{ color: "#555", fontSize: 12 }}>{timeAgo(noticia.criado_em)}</span>
            <span style={{ color: "#333", fontSize: 12 }}>·</span>
            <span style={{ color: "#555", fontSize: 12 }}>👁 {(noticia.views || 0).toLocaleString("pt-BR")} views</span>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.3, color: "#fff", marginBottom: 20 }}>{noticia.titulo}</h1>

          {noticia.resumo_ia && (
            <div style={{ background: "#E3998612", border: "1px solid #E3998640", borderRadius: 10, padding: "14px 16px", marginBottom: 24 }}>
              <div style={{ color: "#E39986", fontSize: 11, fontWeight: 800, letterSpacing: 1, marginBottom: 6 }}>🤖 RESUMO GERADO POR IA</div>
              <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.6 }}>{noticia.resumo_ia}</p>
            </div>
          )}

          {noticia.imagem_url && (
            <div style={{ position: "relative", height: 360, borderRadius: 10, overflow: "hidden", marginBottom: 28 }}>
              <Image src={noticia.imagem_url} alt={noticia.titulo} fill style={{ objectFit: "cover" }} unoptimized />
            </div>
          )}

          <div style={{ color: "#ccc", fontSize: 15, lineHeight: 1.8 }}>
            {(noticia.conteudo || noticia.resumo || '').split("\n\n").map((p: string, i: number) => (
              <p key={i} style={{ marginBottom: 16 }}>{p}</p>
            ))}
          </div>

          {noticia.fonte_url && (
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: "#444", fontSize: 12 }}>Fonte:</span>
              <a href={noticia.fonte_url} target="_blank" rel="noopener noreferrer" style={{ color: "#826092", fontSize: 12, fontWeight: 600 }}>
                {noticia.fonte} ↗
              </a>
            </div>
          )}

          <a href={`https://wa.me/?text=${waText}`} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 20, background: "#25D366", color: "#fff", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 13 }}>
            📤 Compartilhar no WhatsApp
          </a>
        </article>

        <aside>
          <div style={{ position: "sticky", top: 20 }}>
            <div style={{ color: "#444", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #1a1a1a" }}>RELACIONADAS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {relacionadas.map((n: any) => <NewsCard key={n.id} noticia={n} />)}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
