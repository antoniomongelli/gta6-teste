"use client";

import { useState, useEffect } from "react";
import { categoriaConfig, Categoria } from "@/lib/mock-data";
import NewsCard from "@/components/NewsCard";
import { getNoticias } from "@/lib/db";

const filtros: { key: Categoria | "todos"; label: string }[] = [
  { key: "todos",    label: "Recentes" },
  { key: "oficial",  label: "Oficial" },
  { key: "leak",     label: "Leaks" },
  { key: "rumor",    label: "Rumores" },
  { key: "trailer",  label: "Trailers" },
  { key: "analise",  label: "Análises" },
  { key: "breaking", label: "Breaking" },
  { key: "online",   label: "Online" },
];

export default function NoticiasPage() {
  const [filtro, setFiltro] = useState<Categoria | "todos">("todos");
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getNoticias(filtro).then(data => {
      setLista(data);
      setLoading(false);
    });
  }, [filtro]);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: "#E39986", letterSpacing: 2 }}>TODAS AS NOTÍCIAS</h1>
        <p style={{ color: "#555", fontSize: 13, marginTop: 6 }}>Atualizado em tempo real pelo agente IA</p>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid #1a1a1a" }}>
        {filtros.map((f) => {
          const ativo = filtro === f.key;
          const cor = f.key !== "todos" ? categoriaConfig[f.key as Categoria]?.color : "#826092";
          return (
            <button key={f.key} onClick={() => setFiltro(f.key)}
              style={{ background: ativo ? (cor ?? "#826092") : "#111", color: ativo ? "#fff" : "#888", border: `1px solid ${ativo ? (cor ?? "#826092") : "#2a2a2a"}`, padding: "6px 16px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              {f.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p style={{ color: "#444", textAlign: "center", padding: "60px 0" }}>Carregando...</p>
      ) : lista.length === 0 ? (
        <p style={{ color: "#444", textAlign: "center", padding: "60px 0" }}>Nenhuma notícia encontrada.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {lista.map((n) => <NewsCard key={n.id} noticia={n} />)}
        </div>
      )}
    </div>
  );
}
