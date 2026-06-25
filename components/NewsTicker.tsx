import { noticias } from "@/lib/mock-data";

export default function NewsTicker() {
  const items = [...noticias, ...noticias];

  return (
    <div style={{ background: "#111", borderBottom: "1px solid #1a1a1a", overflow: "hidden", height: 36, display: "flex", alignItems: "center" }}>
      <div style={{ background: "#826092", padding: "0 14px", height: "100%", display: "flex", alignItems: "center", flexShrink: 0, zIndex: 1 }}>
        <span style={{ color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: 2 }}>ÚLTIMAS</span>
      </div>
      <div style={{ overflow: "hidden", flex: 1, position: "relative" }}>
        <div className="ticker-track">
          {items.map((n, i) => (
            <span key={i} style={{ color: "#aaa", fontSize: 12, padding: "0 24px", borderRight: "1px solid #2a2a2a" }}>
              <span style={{ color: "#E39986", marginRight: 8 }}>►</span>
              {n.titulo}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
