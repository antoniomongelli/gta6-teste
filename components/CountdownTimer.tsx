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
      const now = Date.now();
      const total = Math.max(0, DATA_LANCAMENTO.getTime() - now);
      const seconds = Math.floor((total / 1000) % 60);
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const hours = Math.floor((total / 1000 / 60 / 60) % 24);
      const days = Math.floor(total / 1000 / 60 / 60 / 24);
      setDiff({ days, hours, minutes, seconds });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  const Box = ({ value, label }: { value: number; label: string }) => (
    <div style={{ textAlign: "center" }}>
      <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 14px", minWidth: 52 }}>
        <span style={{ color: "#fff", fontSize: 22, fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>{pad(value)}</span>
      </div>
      <div style={{ color: "#555", fontSize: 9, fontWeight: 700, letterSpacing: 1, marginTop: 4 }}>{label}</div>
    </div>
  );

  return (
    <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 10, padding: 16 }}>
      <div style={{ color: "#826092", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>⏳ LANÇAMENTO EM</div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <Box value={diff.days} label="DIAS" />
        <div style={{ color: "#333", fontSize: 20, fontWeight: 900, alignSelf: "center", paddingBottom: 16 }}>:</div>
        <Box value={diff.hours} label="HORAS" />
        <div style={{ color: "#333", fontSize: 20, fontWeight: 900, alignSelf: "center", paddingBottom: 16 }}>:</div>
        <Box value={diff.minutes} label="MIN" />
        <div style={{ color: "#333", fontSize: 20, fontWeight: 900, alignSelf: "center", paddingBottom: 16 }}>:</div>
        <Box value={diff.seconds} label="SEG" />
      </div>
      <div style={{ textAlign: "center", marginTop: 10, color: "#444", fontSize: 10 }}>26 de Maio de 2026 · PS5 & Xbox Series</div>
    </div>
  );
}
