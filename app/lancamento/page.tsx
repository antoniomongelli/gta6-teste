import CountdownTimer from "@/components/CountdownTimer";

const plataformas = [
  { nome: "PlayStation 5", data: "19 Nov 2026", acesso: "16 Nov 2026", cor: "#003087", icone: "🎮" },
  { nome: "Xbox Series X|S", data: "19 Nov 2026", acesso: "16 Nov 2026", cor: "#107c10", icone: "🎮" },
  { nome: "PC (Windows)", data: "2027 (estimado)", acesso: "—", cor: "#555", icone: "💻" },
];

const edicoes = [
  {
    nome: "Standard",
    preco: "$79.99",
    cor: "#64759D",
    itens: ["Jogo base", "Acesso antecipado (72h)", "$500k GTA Online", "Tema exclusivo PS5/Xbox"],
  },
  {
    nome: "Deluxe",
    preco: "$99.99",
    cor: "#826092",
    destaque: true,
    itens: ["Tudo do Standard", "$1.5M GTA Online", "Pacote de veículos exclusivos", "Conteúdo adicional de história", "Carro Leonida Runner"],
  },
  {
    nome: "Collector's",
    preco: "$179.99",
    cor: "#E39986",
    itens: ["Tudo do Deluxe", "Steelbook físico", "Estatueta 30cm Lucia & Jason", "Mapa de tecido de Leonida", "Pôster exclusivo assinado"],
  },
];

const linha_do_tempo = [
  { data: "Dez 2023", evento: "Trailer 1 lançado — mundo explode", tipo: "marco" },
  { data: "Jun 2025", evento: "Trailer 2 — novos personagens e Vice City à noite", tipo: "marco" },
  { data: "Abr 2026", evento: "Data de 19 de Novembro confirmada oficialmente", tipo: "oficial" },
  { data: "Jun 25, 2026", evento: "Trailer 3 + pré-venda abre — vilão revelado", tipo: "marco" },
  { data: "Nov 16, 2026", evento: "Acesso antecipado para pré-vendas", tipo: "futuro" },
  { data: "Nov 19, 2026", evento: "🚀 LANÇAMENTO GLOBAL — PS5 e Xbox Series", tipo: "lancamento" },
  { data: "2027", evento: "Versão para PC (estimativa)", tipo: "futuro" },
];

const tipoCor: Record<string, string> = {
  marco: "#826092",
  oficial: "#64759D",
  futuro: "#444",
  lancamento: "#E39986",
};

export default function LancamentoPage() {
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>

      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 56, padding: "48px 24px", background: "linear-gradient(180deg, #826092 0%, #0a0a0a 100%)", borderRadius: 16, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, #82609240, transparent 70%)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ color: "#E39986", fontSize: 11, fontWeight: 800, letterSpacing: 4, marginBottom: 12 }}>DATA OFICIAL DE LANÇAMENTO</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 8 }}>
            19 de Novembro
          </h1>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: "#E39986", marginBottom: 24 }}>2026</h2>
          <p style={{ color: "#888", fontSize: 15, marginBottom: 32 }}>PS5 · Xbox Series X|S · Acesso antecipado a partir de 16 de Novembro</p>
          <div style={{ maxWidth: 460, margin: "0 auto" }}>
            <CountdownTimer />
          </div>
        </div>
      </div>

      {/* Plataformas */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: 2, marginBottom: 20 }}>PLATAFORMAS</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {plataformas.map((p) => (
            <div key={p.nome} style={{ background: "#111", border: `1px solid ${p.cor}44`, borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{p.icone}</div>
              <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 800, marginBottom: 6 }}>{p.nome}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div>
                  <span style={{ color: "#444", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>LANÇAMENTO: </span>
                  <span style={{ color: p.cor === "#555" ? "#555" : "#fff", fontSize: 12, fontWeight: 700 }}>{p.data}</span>
                </div>
                <div>
                  <span style={{ color: "#444", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>ACESSO ANTECIPADO: </span>
                  <span style={{ color: p.acesso === "—" ? "#333" : "#E39986", fontSize: 12, fontWeight: 700 }}>{p.acesso}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Edições */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: 2, marginBottom: 20 }}>EDIÇÕES DISPONÍVEIS</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {edicoes.map((e) => (
            <div
              key={e.nome}
              style={{
                background: "#111",
                border: `1px solid ${e.destaque ? e.cor : "#1a1a1a"}`,
                borderRadius: 12, padding: "24px 20px",
                position: "relative",
                transform: e.destaque ? "scale(1.02)" : "none",
              }}
            >
              {e.destaque && (
                <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#826092", color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 12px", borderRadius: 20, letterSpacing: 1 }}>
                  MAIS POPULAR
                </div>
              )}
              <div style={{ color: e.cor, fontSize: 10, fontWeight: 800, letterSpacing: 2, marginBottom: 6 }}>EDIÇÃO</div>
              <h3 style={{ color: "#fff", fontSize: 22, fontWeight: 900, marginBottom: 4 }}>{e.nome}</h3>
              <div style={{ color: e.cor, fontSize: 28, fontWeight: 900, marginBottom: 20 }}>{e.preco}</div>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {e.itens.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <span style={{ color: e.cor, fontSize: 12, marginTop: 1 }}>✓</span>
                    <span style={{ color: "#ccc", fontSize: 13 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Linha do tempo */}
      <section>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: 2, marginBottom: 24 }}>LINHA DO TEMPO</h2>
        <div style={{ position: "relative", paddingLeft: 24 }}>
          <div style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 2, background: "linear-gradient(180deg, #826092, #64759D, #E39986)" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {linha_do_tempo.map((item, i) => (
              <div key={i} style={{ position: "relative", paddingBottom: 24 }}>
                <div style={{ position: "absolute", left: -28, top: 4, width: 12, height: 12, borderRadius: "50%", background: tipoCor[item.tipo], border: "2px solid #0a0a0a" }} />
                <div style={{ background: item.tipo === "lancamento" ? "#E3998615" : "#111", border: `1px solid ${item.tipo === "lancamento" ? "#E3998644" : "#1a1a1a"}`, borderRadius: 8, padding: "12px 16px" }}>
                  <div style={{ color: tipoCor[item.tipo], fontSize: 10, fontWeight: 800, letterSpacing: 1, marginBottom: 4 }}>{item.data}</div>
                  <div style={{ color: item.tipo === "lancamento" ? "#E39986" : "#ddd", fontSize: 14, fontWeight: item.tipo === "lancamento" ? 900 : 600 }}>{item.evento}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
