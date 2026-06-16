"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from "recharts";

interface Summary {
  lost: number;
  total: number;
  lossReasons: [string, number][];
}

const COLORS = ["#ef4444", "#f97316", "#3b82f6", "#a855f7", "#22c55e", "#eab308", "#22d3ee", "#ec4899"];

const chartTooltipStyle = {
  contentStyle: { background: "#111827", border: "1px solid #1e2d4a", borderRadius: 8, fontSize: 12, color: "#e2e8f0" },
};

export default function PerdasPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/deals?start=2025-01-01&end=2025-12-31")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); });
  }, []);

  const reasons = data?.lossReasons ?? [];
  const maxCount = reasons[0]?.[1] ?? 1;
  const totalLost = reasons.reduce((s, [, c]) => s + c, 0);

  const barData = reasons.map(([label, value], i) => ({ label: label.length > 22 ? label.slice(0, 22) + "…" : label, fullLabel: label, value, fill: COLORS[i % COLORS.length] }));
  const donutData = reasons.map(([name, value], i) => ({ name, value, fill: COLORS[i % COLORS.length] }));

  const topReason = reasons[0];

  return (
    <div style={{ color: "var(--text-primary)" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Análise de Perdas</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>Por que os deals foram perdidos?</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Perdidos", value: loading ? "—" : String(data?.lost ?? 0), color: "#ef4444" },
          { label: "Taxa de Perda", value: loading ? "—" : (data?.total ? `${Math.round((data.lost / data.total) * 100)}%` : "—"), color: "#f97316" },
          { label: "Motivos Registrados", value: loading ? "—" : String(totalLost), color: "#3b82f6" },
          { label: "Principal Motivo", value: loading ? "—" : (topReason ? topReason[0].split("/")[0].trim() : "—"), color: "#ef4444" },
        ].map(c => (
          <div key={c.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16, marginBottom: 16 }}>
        {/* Bar chart */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: "20px 24px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 16 }}>Ranking por Frequência</div>
          {loading ? (
            <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>Carregando...</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 24, top: 0, bottom: 0 }} barSize={14}>
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="label" width={170} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} formatter={(v: number, _, p) => [v, p.payload.fullLabel]} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {barData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Donut */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: "20px 24px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 16 }}>Proporção Visual</div>
          {loading ? (
            <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>Carregando...</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                    {donutData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle.contentStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                {donutData.map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: d.fill, flexShrink: 0, display: "inline-block" }} />
                    <span style={{ flex: 1, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
                    <span style={{ fontWeight: 700, color: d.fill }}>{Math.round((d.value / totalLost) * 100)}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Insight */}
      {!loading && topReason && (
        <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", borderRadius: 12, padding: "18px 22px", display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fca5a5", marginBottom: 6 }}>Principal causa de perda no período</div>
            <p style={{ fontSize: 13, color: "#fcd9d9", lineHeight: 1.6 }}>
              <strong>"{topReason[0]}"</strong> representa <strong>{Math.round((topReason[1] / totalLost) * 100)}%</strong> de todos os {totalLost} deals com motivo registrado ({topReason[1]} ocorrências).
              Revise a estratégia de qualificação de budget na entrada do funil para reduzir esse índice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
