"use client";

import { useState } from "react";
import { locaisMapa, LocalMapa, localStatusConfig } from "@/lib/mock-data";

const tipoLabel: Record<string, string> = {
  cidade: "🏙️ Cidade Principal",
  cidade_pequena: "🏘️ Cidade",
  area_natural: "🌿 Área Natural",
  ilha: "🏝️ Ilha / Arquipélago",
};

export default function MapaPage() {
  const [selected, setSelected] = useState<LocalMapa | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const statusCfg = localStatusConfig;

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 4, height: 28, background: "#E39986", borderRadius: 2 }} />
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: 3 }}>MAP EXPLORER</h1>
        </div>
        <p style={{ color: "#555", fontSize: 13 }}>
          Clique nos marcadores para explorar localizações confirmadas e vazadas do Estado de Leonida
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>

        {/* Mapa SVG */}
        <div style={{ background: "#0d1a1a", border: "1px solid #1a2e2e", borderRadius: 12, overflow: "hidden", position: "relative" }}>
          <svg viewBox="0 0 800 520" style={{ width: "100%", height: "auto", display: "block" }}>
            <defs>
              <radialGradient id="mapGrad" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#0d2020" />
                <stop offset="100%" stopColor="#050f0f" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Fundo oceano */}
            <rect width="800" height="520" fill="#061215" />

            {/* Ilha principal de Leonida */}
            <path
              d="M 80 180 Q 60 140 90 110 Q 130 80 180 75 Q 240 65 300 70 Q 370 68 430 75 Q 500 80 560 95 Q 610 108 640 130 Q 670 155 665 190 Q 660 220 640 250 Q 620 280 590 305 Q 560 330 530 350 Q 500 368 460 380 Q 420 392 380 400 Q 340 408 300 405 Q 260 402 225 392 Q 185 380 155 360 Q 125 338 105 310 Q 82 278 80 250 Q 78 215 80 180 Z"
              fill="#0e2a1e"
              stroke="#1a3d2a"
              strokeWidth="1.5"
            />

            {/* Detalhes internos - estradas */}
            <path d="M 200 380 Q 280 340 380 320 Q 460 305 540 290" stroke="#1a3d2a" strokeWidth="1" fill="none" strokeDasharray="4,4" opacity="0.6" />
            <path d="M 380 320 Q 380 250 390 180" stroke="#1a3d2a" strokeWidth="1" fill="none" strokeDasharray="4,4" opacity="0.6" />

            {/* Área pantanosa */}
            <ellipse cx="300" cy="200" rx="100" ry="60" fill="#0a2218" opacity="0.6" />
            <ellipse cx="280" cy="210" rx="40" ry="20" fill="#0c261c" opacity="0.4" />

            {/* Keys / Arquipélago sul */}
            <ellipse cx="495" cy="430" rx="28" ry="10" fill="#0e2a1e" stroke="#1a3d2a" strokeWidth="1" />
            <ellipse cx="540" cy="445" rx="18" ry="7" fill="#0e2a1e" stroke="#1a3d2a" strokeWidth="1" />
            <ellipse cx="465" cy="442" rx="14" ry="6" fill="#0e2a1e" stroke="#1a3d2a" strokeWidth="1" />

            {/* Cidade pequena ao sul */}
            <ellipse cx="560" cy="418" rx="12" ry="5" fill="#0e2a1e" stroke="#1a3d2a" strokeWidth="1" opacity="0.7" />

            {/* Grade de referência */}
            <line x1="400" y1="60" x2="400" y2="480" stroke="#1a3d2a" strokeWidth="0.5" strokeDasharray="6,8" opacity="0.3" />
            <line x1="60" y1="260" x2="700" y2="260" stroke="#1a3d2a" strokeWidth="0.5" strokeDasharray="6,8" opacity="0.3" />

            {/* Norte indicator */}
            <text x="720" y="95" fill="#444" fontSize="11" fontFamily="monospace">N</text>
            <line x1="724" y1="98" x2="724" y2="118" stroke="#444" strokeWidth="1" />
            <polygon points="720,98 724,88 728,98" fill="#444" />

            {/* Marcadores */}
            {locaisMapa.map((local) => {
              const cx = (local.x / 100) * 760 + 20;
              const cy = (local.y / 100) * 460 + 30;
              const cfg = statusCfg[local.status];
              const isHovered = hovered === local.id;
              const isSelected = selected?.id === local.id;
              const radius = isHovered || isSelected ? 10 : 7;

              return (
                <g key={local.id}>
                  {/* Anel externo animado */}
                  {(isHovered || isSelected) && (
                    <circle cx={cx} cy={cy} r={18} fill="none" stroke={cfg.color} strokeWidth="1" opacity="0.4" />
                  )}
                  {/* Círculo principal */}
                  <circle
                    cx={cx} cy={cy} r={radius}
                    fill={cfg.color + "33"}
                    stroke={cfg.color}
                    strokeWidth="2"
                    style={{ cursor: "pointer", transition: "all 0.2s" }}
                    filter={isHovered || isSelected ? "url(#glow)" : undefined}
                    onClick={() => setSelected(local)}
                    onMouseEnter={() => setHovered(local.id)}
                    onMouseLeave={() => setHovered(null)}
                  />
                  {/* Ponto central */}
                  <circle cx={cx} cy={cy} r={3} fill={cfg.color} style={{ pointerEvents: "none" }} />
                  {/* Label */}
                  <text
                    x={cx} y={cy - 15}
                    textAnchor="middle"
                    fill={isHovered || isSelected ? cfg.color : "#aaa"}
                    fontSize="10"
                    fontFamily="sans-serif"
                    fontWeight={isSelected ? "bold" : "normal"}
                    style={{ pointerEvents: "none", transition: "fill 0.2s" }}
                  >
                    {local.nome}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legenda */}
          <div style={{ position: "absolute", bottom: 14, left: 14, display: "flex", gap: 14 }}>
            {Object.entries(statusCfg).map(([key, val]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: val.color }} />
                <span style={{ color: val.color, fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>{val.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Painel lateral */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Info do local selecionado */}
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 10, padding: 20, minHeight: 160 }}>
            {selected ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: localStatusConfig[selected.status].color }}>
                    {tipoLabel[selected.tipo]}
                  </span>
                  <span style={{ background: localStatusConfig[selected.status].color + "22", color: localStatusConfig[selected.status].color, fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 4 }}>
                    {localStatusConfig[selected.status].label}
                  </span>
                </div>
                <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 900, marginBottom: 10 }}>{selected.nome}</h3>
                <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.6 }}>{selected.descricao}</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 120, color: "#333" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📍</div>
                <p style={{ fontSize: 12, textAlign: "center" }}>Clique em um marcador no mapa para explorar a localização</p>
              </div>
            )}
          </div>

          {/* Lista de locais */}
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 10, padding: 16 }}>
            <div style={{ color: "#444", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>TODAS AS LOCALIZAÇÕES</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {locaisMapa.map((local) => {
                const cfg = localStatusConfig[local.status];
                const isActive = selected?.id === local.id;
                return (
                  <div
                    key={local.id}
                    onClick={() => setSelected(local)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                      background: isActive ? "#1a1a2e" : "transparent",
                      border: `1px solid ${isActive ? "#826092" : "transparent"}`,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#1a1a1a"; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
                      <span style={{ color: isActive ? "#fff" : "#ccc", fontSize: 13, fontWeight: isActive ? 700 : 400 }}>{local.nome}</span>
                    </div>
                    <span style={{ color: cfg.color, fontSize: 9, fontWeight: 800, letterSpacing: 1 }}>{cfg.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
