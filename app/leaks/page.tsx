"use client";

import { useState } from "react";
import { leaks, leakStatusConfig } from "@/lib/mock-data";

export default function LeaksPage() {
  const [filtro, setFiltro] = useState<string>("todos");

  const lista = filtro === "todos" ? leaks : leaks.filter((l) => l.status === filtro);
  const sorted = [...lista].sort((a, b) => b.credibilidade - a.credibilidade);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: "#826092", letterSpacing: 2 }}>LEAK TRACKER</h1>
        <p style={{ color: "#555", fontSize: 13, marginTop: 6 }}>
          Avaliamos a credibilidade de cada rumor para você. Clique em qualquer linha para detalhes.
        </p>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[
          { key: "todos", label: "Todos", color: "#888" },
          { key: "confirmado", label: "Confirmados", color: "#34d399" },
          { key: "provavel", label: "Prováveis", color: "#E39986" },
          { key: "rumor", label: "Rumores", color: "#826092" },
          { key: "falso", label: "Falsos", color: "#f87171" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            style={{
              background: filtro === f.key ? f.color + "22" : "#111",
              color: filtro === f.key ? f.color : "#555",
              border: `1px solid ${filtro === f.key ? f.color : "#222"}`,
              padding: "7px 16px", borderRadius: 20,
              fontSize: 11, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, overflow: "hidden" }}>
        {/* Header da tabela */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 100px 100px", padding: "12px 20px", borderBottom: "1px solid #1a1a1a" }}>
          <span style={{ color: "#444", fontSize: 10, fontWeight: 700, letterSpacing: 2 }}>LEAK / RUMOR</span>
          <span style={{ color: "#444", fontSize: 10, fontWeight: 700, letterSpacing: 2 }}>STATUS</span>
          <span style={{ color: "#444", fontSize: 10, fontWeight: 700, letterSpacing: 2, textAlign: "center" }}>CREDIB.</span>
          <span style={{ color: "#444", fontSize: 10, fontWeight: 700, letterSpacing: 2, textAlign: "right" }}>FONTE</span>
        </div>

        {sorted.map((leak, i) => {
          const cfg = leakStatusConfig[leak.status];
          return (
            <div
              key={leak.id}
              style={{
                display: "grid", gridTemplateColumns: "1fr 120px 100px 100px",
                padding: "16px 20px", borderBottom: i < sorted.length - 1 ? "1px solid #151515" : "none",
                alignItems: "center", transition: "background 0.15s", cursor: "default",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#161616")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{leak.titulo}</div>
                <div style={{ color: "#555", fontSize: 11 }}>{leak.descricao}</div>
              </div>
              <div>
                <span style={{ background: cfg.color + "22", color: cfg.color, border: `1px solid ${cfg.color}44`, fontSize: 9, fontWeight: 800, padding: "4px 10px", borderRadius: 4, letterSpacing: 1 }}>
                  {cfg.label}
                </span>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ marginBottom: 4 }}>
                  <span style={{ color: cfg.color, fontSize: 14, fontWeight: 900 }}>{leak.credibilidade}%</span>
                </div>
                <div style={{ background: "#1a1a1a", borderRadius: 4, height: 4, overflow: "hidden" }}>
                  <div style={{ width: `${leak.credibilidade}%`, height: "100%", background: cfg.color, borderRadius: 4 }} />
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ color: "#444", fontSize: 10 }}>{leak.fonte}</span>
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ color: "#333", fontSize: 11, textAlign: "center", marginTop: 16 }}>
        Classificações atualizadas semanalmente com base em novas evidências · Última atualização: Jun 2026
      </p>
    </div>
  );
}
