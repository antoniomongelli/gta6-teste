"use client";

import { useEffect, useState } from "react";
import { DATA_LANCAMENTO } from "@/lib/mock-data";

function pad(n: number) { return String(n).padStart(2, "0"); }

export default function CountdownTimer() {
  const [diff, setDiff] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calc() {
      const total = Math.max(0, DATA_LANCAMENTO.getTime() - Date.now());
      setDiff({
        days:    Math.floor(total / 86400000),
        hours:   Math.floor((total % 86400000) / 3600000),
        minutes: Math.floor((total % 3600000) / 60000),
        seconds: Math.floor((total % 60000) / 1000),
      });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { value: diff.days,    label: "DIAS",  color: "#E39986" },
    { value: diff.hours,   label: "HORAS", color: "#826092" },
    { value: diff.minutes, label: "MIN",   color: "#64759D" },
    { value: diff.seconds, label: "SEG",   color: "#64759D" },
  ];

  return (
    <div style={{
      background: "linear-gradient(135deg, #0d0820 0%, #1a0533 50%, #0d0820 100%)",
      border: "1px solid rgba(130,96,146,0.35)",
      borderRadius: 16, padding: "18px 16px 14px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Glow */}
      <div style={{
        position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)",
        width: 180, height: 180,
        background: "radial-gradient(circle, rgba(130,96,146,0.25), transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, position: "relative" }}>
        <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#E39986", display: "inline-block" }} />
        <span style={{ color: "#826092", fontSize: 9, fontWeight: 800, letterSpacing: 3 }}>LANÇAMENTO EM</span>
      </div>

      <div style={{ display: "flex", gap: 6, alignItems: "flex-start", position: "relative" }}>
        {units.map((u, i) => (
          <div key={u.label} style={{ display: "flex", alignItems: "flex-start", gap: 6, flex: 1 }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{
                background: "linear-gradient(180deg, #1a1030 0%, #0d0820 100%)",
                border: `1px solid ${u.color}33`,
                borderRadius: 10, padding: "clamp(8px,2vw,14px) 4px",
                position: "relative", overflow: "hidden",
                boxShadow: `0 0 16px ${u.color}18, inset 0 1px 0 rgba(255,255,255,0.04)`,
              }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 1,
                  background: `linear-gradient(90deg, transparent, ${u.color}55, transparent)`,
                }} />
                <span style={{
                  color: "#fff",
                  fontSize: "clamp(24px,5vw,40px)",
                  fontWeight: 900, letterSpacing: -1, display: "block", lineHeight: 1,
                  textShadow: `0 0 24px ${u.color}88`,
                  fontVariantNumeric: "tabular-nums",
                }}>{pad(u.value)}</span>
              </div>
              <div style={{ color: u.color, fontSize: 8, fontWeight: 800, letterSpacing: 2, marginTop: 6 }}>{u.label}</div>
            </div>
            {i < 3 && (
              <div style={{ color: `${u.color}55`, fontSize: "clamp(18px,4vw,30px)", fontWeight: 900, paddingTop: "clamp(6px,2vw,12px)", flexShrink: 0 }}>:</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 12, color: "rgba(255,255,255,0.25)", fontSize: 9, letterSpacing: 1.5 }}>
        19 NOV 2026 · PS5 & XBOX SERIES X|S
      </div>
    </div>
  );
}
