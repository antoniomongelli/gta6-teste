"use client";

import { useEffect, useState } from "react";
import { DATA_LANCAMENTO } from "@/lib/mock-data";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CountdownTimer() {
  const [diff, setDiff] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calc() {
      const total = Math.max(0, DATA_LANCAMENTO.getTime() - Date.now());
      setDiff({
        seconds: Math.floor((total / 1000) % 60),
        minutes: Math.floor((total / 1000 / 60) % 60),
        hours:   Math.floor((total / 1000 / 60 / 60) % 24),
        days:    Math.floor(total / 1000 / 60 / 60 / 24),
      });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  const Box = ({ value, label, color }: { value: number; label: string; color: string }) => (
    <div style={{ textAlign: "center", flex: 1 }}>
      <div style={{
        background: "linear-gradient(180deg, #1a1030 0%, #0d0820 100%)",
        border: `1px solid ${color}44`,
        borderRadius: 12,
        padding: "16px 8px",
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 0 20px ${color}22, inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}>
        {/* Glow top */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${color}66, transparent)`,
        }} />
        <span style={{
          color: "#fff",
          fontSize: 42,
          fontWeight: 900,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: -1,
          display: "block",
          lineHeight: 1,
          textShadow: `0 0 30px ${color}88`,
        }}>
          {pad(value)}
        </span>
      </div>
      <div style={{ color: color, fontSize: 9, fontWeight: 800, letterSpacing: 3, marginTop: 8, textTransform: "uppercase" }}>{label}</div>
    </div>
  );

  return (
    <div style={{
      background: "linear-gradient(135deg, #0d0820 0%, #1a0533 50%, #0d0820 100%)",
      border: "1px solid rgba(130,96,146,0.3)",
      borderRadius: 16,
      padding: "20px 20px 16px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)",
        width: 200, height: 200,
        background: "radial-gradient(circle, rgba(130,96,146,0.2), transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, position: "relative" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#E39986", boxShadow: "0 0 8px #E39986" }} className="pulse-dot" />
        <span style={{ color: "#826092", fontSize: 10, fontWeight: 800, letterSpacing: 3 }}>LANÇAMENTO EM</span>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", position: "relative" }}>
        <Box value={diff.days}    label="Dias"   color="#E39986" />
        <div style={{ color: "rgba(227,153,134,0.4)", fontSize: 32, fontWeight: 900, paddingTop: 12, flexShrink: 0 }}>:</div>
        <Box value={diff.hours}   label="Horas"  color="#826092" />
        <div style={{ color: "rgba(130,96,146,0.4)", fontSize: 32, fontWeight: 900, paddingTop: 12, flexShrink: 0 }}>:</div>
        <Box value={diff.minutes} label="Min"    color="#64759D" />
        <div style={{ color: "rgba(100,117,157,0.4)", fontSize: 32, fontWeight: 900, paddingTop: 12, flexShrink: 0 }}>:</div>
        <Box value={diff.seconds} label="Seg"    color="#64759D" />
      </div>

      <div style={{ textAlign: "center", marginTop: 14, color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: 1 }}>
        19 NOV 2026 · PS5 & XBOX SERIES X|S
      </div>
    </div>
  );
}
