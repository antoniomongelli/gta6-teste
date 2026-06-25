import Link from "next/link";
import Image from "next/image";
import { categoriaConfig, leaks, locaisMapa, personagens, leakStatusConfig, localStatusConfig } from "@/lib/mock-data";
import NewsCard from "@/components/NewsCard";
import CountdownTimer from "@/components/CountdownTimer";
import { getNoticias, getNoticiaDestaque } from "@/lib/db";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  return `há ${Math.floor(h / 24)}d`;
}

function StatMini({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ background: "#1a1a1a", borderRadius: 3, height: 4, overflow: "hidden", flex: 1 }}>
      <div style={{ width: `${value}%`, height: "100%", background: color }} />
    </div>
  );
}

export default async function Home() {
  const [destaque, todasNoticias] = await Promise.all([
    getNoticiaDestaque(),
    getNoticias("todos", 10),
  ]);

  const sidebar = todasNoticias.filter((n: any) => n.id !== destaque?.id).slice(0, 4);
  const grid = todasNoticias.filter((n: any) => n.id !== destaque?.id).slice(0, 6);
  const topLeaks = leaks.slice(0, 5);
  const cat = destaque ? (categoriaConfig[destaque.categoria as keyof typeof categoriaConfig] || categoriaConfig.rumor) : categoriaConfig.rumor;

  if (!destaque) {
    return (
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <p style={{ color: "#555", fontSize: 16 }}>O agente ainda está coletando notícias. Volte em breve!</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px" }}>

      {/* HERO */}
      <section style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 48 }}>
        <Link href={`/noticias/${destaque.slug}`} style={{ display: "block", textDecoration: "none" }}>
          <div style={{ background: "#111", borderRadius: 12, overflow: "hidden", border: "1px solid #1a1a1a", cursor: "pointer", height: "100%" }}>
            <div style={{ position: "relative", height: 300 }}>
              {destaque.imagem_url && (
                <Image src={destaque.imagem_url} alt={destaque.titulo} fill style={{ objectFit: "cover" }} unoptimized />
              )}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, #111 100%)" }} />
              <div style={{ position: "absolute", top: 14, left: 14 }}>
                <span style={{ background: "#E39986", color: "#000", fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 4, letterSpacing: 1 }}>🔥 DESTAQUE</span>
              </div>
            </div>
            <div style={{ padding: "20px 22px 22px" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <span style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.color}55`, fontSize: 9, fontWeight: 800, letterSpacing: 1.5, padding: "3px 8px", borderRadius: 4 }}>{cat.label}</span>
                <span style={{ color: "#555", fontSize: 11 }}>{timeAgo(destaque.criado_em)}</span>
              </div>
              <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 900, lineHeight: 1.35, marginBottom: 12 }}>{destaque.titulo}</h2>
              {destaque.resumo_ia && (
                <div style={{ background: "#E3998612", border: "1px solid #E3998630", borderRadius: 8, padding: "10px 12px" }}>
                  <span style={{ color: "#E39986", fontSize: 11, fontWeight: 700 }}>🤖 Resumo IA: </span>
                  <span style={{ color: "#aaa", fontSize: 12 }}>{destaque.resumo_ia}</span>
                </div>
              )}
            </div>
          </div>
        </Link>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <CountdownTimer />
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 10, padding: "14px 16px", flex: 1 }}>
            <div style={{ color: "#444", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid #1a1a1a" }}>ÚLTIMAS NOTÍCIAS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sidebar.map((n: any) => {
                const c = categoriaConfig[n.categoria as keyof typeof categoriaConfig] || categoriaConfig.rumor;
                return (
                  <Link key={n.id} href={`/noticias/${n.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 8, padding: "9px 12px", borderLeft: `3px solid ${c.color}`, cursor: "pointer" }}>
                      <div style={{ color: "#ddd", fontSize: 12, fontWeight: 700, lineHeight: 1.3, marginBottom: 3 }}>{n.titulo}</div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: c.color, fontSize: 9, fontWeight: 700 }}>{c.label}</span>
                        <span style={{ color: "#444", fontSize: 9 }}>{timeAgo(n.criado_em)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* GRID NOTÍCIAS */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <h2 style={{ color: "#fff", fontSize: 13, fontWeight: 800, letterSpacing: 2 }}>TODAS AS NOTÍCIAS</h2>
          <Link href="/noticias" style={{ color: "#826092", fontSize: 11, fontWeight: 700 }}>Ver todas →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {grid.map((n: any) => <NewsCard key={n.id} noticia={n} />)}
        </div>
      </section>

      {/* PERSONAGENS */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <h2 style={{ color: "#fff", fontSize: 13, fontWeight: 800, letterSpacing: 2 }}>PERSONAGENS</h2>
          <Link href="/personagens" style={{ color: "#826092", fontSize: 11, fontWeight: 700 }}>Ver todos →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {personagens.slice(0, 3).map((p) => {
            const stCor: Record<string, string> = { confirmado: "#34d399", leaked: "#E39986", rumor: "#826092" };
            return (
              <Link key={p.id} href="/personagens" style={{ textDecoration: "none" }}>
                <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ position: "relative", height: 140 }}>
                    <Image src={p.imagem} alt={p.nome} fill style={{ objectFit: "cover", objectPosition: "top" }} unoptimized />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, #111 100%)" }} />
                  </div>
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ color: "#826092", fontSize: 9, fontWeight: 700, letterSpacing: 1, marginBottom: 3 }}>{p.tipo.toUpperCase()}</div>
                    <div style={{ color: "#fff", fontSize: 14, fontWeight: 800, marginBottom: 8 }}>{p.nome}</div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <StatMini value={p.stats.combate} color="#f87171" />
                      <StatMini value={p.stats.direcao} color="#38bdf8" />
                      <StatMini value={p.stats.furtividade} color="#826092" />
                      <StatMini value={p.stats.carisma} color="#E39986" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* LEAK TRACKER */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <h2 style={{ color: "#fff", fontSize: 13, fontWeight: 800, letterSpacing: 2 }}>LEAK-O-METER</h2>
          <Link href="/leaks" style={{ color: "#826092", fontSize: 11, fontWeight: 700 }}>Ver todos →</Link>
        </div>
        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 10, overflow: "hidden" }}>
          {topLeaks.map((leak, i) => {
            const cfg = { confirmado: { label: "CONFIRMADO", color: "#34d399" }, provavel: { label: "PROVÁVEL", color: "#E39986" }, rumor: { label: "RUMOR", color: "#826092" }, falso: { label: "FALSO", color: "#f87171" } }[leak.status];
            return (
              <div key={leak.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderBottom: i < topLeaks.length - 1 ? "1px solid #151515" : "none" }}>
                <span style={{ background: cfg!.color + "22", color: cfg!.color, border: `1px solid ${cfg!.color}44`, fontSize: 8, fontWeight: 800, padding: "3px 8px", borderRadius: 4, letterSpacing: 1, flexShrink: 0, minWidth: 80, textAlign: "center" }}>{cfg!.label}</span>
                <span style={{ color: "#ddd", fontSize: 13, flex: 1 }}>{leak.titulo}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <div style={{ background: "#1a1a1a", borderRadius: 4, height: 6, width: 80, overflow: "hidden" }}>
                    <div style={{ width: `${leak.credibilidade}%`, height: "100%", background: cfg!.color }} />
                  </div>
                  <span style={{ color: cfg!.color, fontSize: 12, fontWeight: 900 }}>{leak.credibilidade}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MAP PREVIEW */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <h2 style={{ color: "#fff", fontSize: 13, fontWeight: 800, letterSpacing: 2 }}>MAP EXPLORER</h2>
          <Link href="/mapa" style={{ color: "#826092", fontSize: 11, fontWeight: 700 }}>Explorar mapa →</Link>
        </div>
        <Link href="/mapa" style={{ textDecoration: "none", display: "block" }}>
          <div style={{ background: "#0d1a1a", border: "1px solid #1a2e2e", borderRadius: 12, padding: 20, cursor: "pointer" }}>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>Explore o estado de Leonida — localizações confirmadas e vazadas</p>
            <div style={{ display: "flex", gap: 16 }}>
              {Object.entries(localStatusConfig).map(([key, val]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: val.color }} />
                  <span style={{ color: val.color, fontSize: 10, fontWeight: 700 }}>{val.label}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, background: "#0a1212", borderRadius: 8, padding: "12px 16px", border: "1px solid #1a2e2e", textAlign: "center", color: "#34d399", fontSize: 13, fontWeight: 700 }}>
              Clique para abrir o Map Explorer interativo →
            </div>
          </div>
        </Link>
      </section>

    </div>
  );
}
