"use client";

import { useState } from "react";
import Image from "next/image";
import { personagens, Personagem } from "@/lib/mock-data";

const statusConfig = {
  confirmado: { label: "CONFIRMADO", color: "#34d399" },
  leaked:     { label: "LEAKED",     color: "#E39986" },
  rumor:      { label: "RUMOR",      color: "#826092" },
};

const tipoConfig = {
  protagonista: { label: "PROTAGONISTA", color: "#64759D" },
  antagonista:  { label: "ANTAGONISTA",  color: "#f87171" },
  misterio:     { label: "MISTÉRIO",     color: "#a78bfa" },
  coadjuvante:  { label: "COADJUVANTE",  color: "#E39986" },
};

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ color: "#888", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{label}</span>
        <span style={{ color: "#fff", fontSize: 10, fontWeight: 900 }}>{value}</span>
      </div>
      <div style={{ background: "#1a1a1a", borderRadius: 4, height: 6, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

function PersonagemCard({ p, onClick }: { p: Personagem; onClick: () => void }) {
  const st = statusConfig[p.status];
  const tp = tipoConfig[p.tipo];

  return (
    <div
      onClick={onClick}
      style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#826092"; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1a1a1a"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ position: "relative", height: 200 }}>
        <Image src={p.imagem} alt={p.nome} fill style={{ objectFit: "cover", objectPosition: "top" }} unoptimized />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, #111 100%)" }} />
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
          <span style={{ background: tp.color + "22", color: tp.color, border: `1px solid ${tp.color}55`, fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 4, letterSpacing: 1 }}>{tp.label}</span>
        </div>
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <span style={{ background: st.color + "22", color: st.color, border: `1px solid ${st.color}55`, fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 4 }}>{st.label}</span>
        </div>
      </div>
      <div style={{ padding: "16px 18px" }}>
        <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 900, marginBottom: 6 }}>{p.nome}</h3>
        <p style={{ color: "#888", fontSize: 12, lineHeight: 1.5, marginBottom: 14 }}>{p.descricao}</p>
        <div>
          <StatBar label="COMBATE" value={p.stats.combate} color="#f87171" />
          <StatBar label="DIREÇÃO" value={p.stats.direcao} color="#38bdf8" />
          <StatBar label="FURTIVIDADE" value={p.stats.furtividade} color="#826092" />
          <StatBar label="CARISMA" value={p.stats.carisma} color="#E39986" />
          <StatBar label="HACKING" value={p.stats.hacking} color="#34d399" />
        </div>
      </div>
    </div>
  );
}

function Modal({ p, onClose }: { p: Personagem; onClose: () => void }) {
  const st = statusConfig[p.status];
  const tp = tipoConfig[p.tipo];

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={onClose}
    >
      <div
        style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: 14, maxWidth: 700, width: "100%", maxHeight: "90vh", overflow: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ position: "relative", height: 260 }}>
          <Image src={p.imagem} alt={p.nome} fill style={{ objectFit: "cover", objectPosition: "top" }} unoptimized />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, #111 100%)" }} />
          <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "#000a", color: "#fff", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>×</button>
          <div style={{ position: "absolute", bottom: 20, left: 24, display: "flex", gap: 8 }}>
            <span style={{ background: tp.color + "22", color: tp.color, border: `1px solid ${tp.color}55`, fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 4 }}>{tp.label}</span>
            <span style={{ background: st.color + "22", color: st.color, border: `1px solid ${st.color}55`, fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 4 }}>{st.label}</span>
          </div>
        </div>
        <div style={{ padding: "24px 28px 28px" }}>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 900, marginBottom: 16 }}>{p.nome}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ color: "#444", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>HISTÓRIA</div>
              <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.7 }}>{p.historia}</p>
              {p.trailer && (
                <div style={{ marginTop: 16, background: "#a78bfa15", border: "1px solid #a78bfa33", borderRadius: 8, padding: "10px 12px" }}>
                  <span style={{ color: "#a78bfa", fontSize: 10, fontWeight: 700 }}>🎬 </span>
                  <span style={{ color: "#888", fontSize: 11 }}>{p.trailer}</span>
                </div>
              )}
            </div>
            <div>
              <div style={{ color: "#444", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 14 }}>ATRIBUTOS</div>
              <StatBar label="COMBATE" value={p.stats.combate} color="#f87171" />
              <StatBar label="DIREÇÃO" value={p.stats.direcao} color="#38bdf8" />
              <StatBar label="FURTIVIDADE" value={p.stats.furtividade} color="#826092" />
              <StatBar label="CARISMA" value={p.stats.carisma} color="#E39986" />
              <StatBar label="HACKING" value={p.stats.hacking} color="#34d399" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PersonagensPage() {
  const [selected, setSelected] = useState<Personagem | null>(null);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: "#E39986", letterSpacing: 2 }}>PERSONAGENS</h1>
        <p style={{ color: "#555", fontSize: 13, marginTop: 6 }}>
          Tudo confirmado, vazado e especulado sobre o elenco de GTA VI
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {personagens.map((p) => (
          <PersonagemCard key={p.id} p={p} onClick={() => setSelected(p)} />
        ))}
      </div>

      {selected && <Modal p={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
