"use client";

import { useEffect, useState, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, AreaChart, Area, CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Target, AlertCircle, Activity, RefreshCw } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MonthData { total: number; won: number; lost: number; open: number; amount: number; }
interface OpenDeal { id: string; name: string; amount: number; stage: string; closeDate: string | null; probability: number | null; pipeline: string; }

interface Summary {
  total: number; won: number; lost: number; open: number;
  conversionRate: number; totalAmount: number; wonAmount: number;
  byMonth: Record<string, MonthData>;
  lossReasons: [string, number][];
  openDeals: OpenDeal[];
}

interface Pipeline { id: string; label: string; }

// ─── Helpers ─────────────────────────────────────────────────────────────────

const BRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);

const fmtDate = (s: string | null) => {
  if (!s) return "—";
  try { return new Date(s).toLocaleDateString("pt-BR"); } catch { return s; }
};

const toISO = (d: Date) => d.toISOString().slice(0, 10);

function daysFromNow(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() - n);
  return r;
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, color, icon }: {
  label: string; value: string; sub?: string; color: string; icon: React.ReactNode;
}) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase" }}>{label}</span>
        <span style={{ color, background: `${color}18`, borderRadius: 8, padding: "5px 6px", display: "flex", alignItems: "center" }}>{icon}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{sub}</div>}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function Card({ title, sub, children, style }: { title: string; sub?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: "20px 24px", ...style }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

// ─── Chart tooltip ────────────────────────────────────────────────────────────

const chartTooltipStyle = {
  contentStyle: { background: "#111827", border: "1px solid #1e2d4a", borderRadius: 8, fontSize: 12, color: "#e2e8f0" },
  cursor: { fill: "#ffffff08" },
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ h = 32, w = "80px" }: { h?: number; w?: string }) {
  return <div style={{ height: h, width: w, borderRadius: 6, background: "linear-gradient(90deg,#1e2d4a 25%,#2a3a5c 50%,#1e2d4a 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />;
}

// ─── Stage bar ────────────────────────────────────────────────────────────────

function StageBar({ label, count, max, color }: { label: string; count: number; max: number; color: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{count}</span>
      </div>
      <div style={{ height: 5, background: "var(--bg-secondary)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.round((count / max) * 100)}%`, background: color, borderRadius: 99, transition: "width .6s ease" }} />
      </div>
    </div>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: "5px 14px", borderRadius: 99, fontSize: 12, cursor: "pointer", border: "1px solid",
      borderColor: active ? "var(--accent-purple)" : "var(--border-color)",
      background: active ? "#6366f120" : "transparent",
      color: active ? "var(--text-primary)" : "var(--text-secondary)",
      transition: "all .15s",
    }}>{label}</button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(90);
  const [pipeline, setPipelineFilter] = useState("");

  const load = useCallback(async (days: number, pipe: string) => {
    setLoading(true);
    try {
      const end = new Date();
      const start = daysFromNow(end, days);
      const params = new URLSearchParams({ start: toISO(start), end: toISO(end), pipeline: pipe });
      const r = await fetch("/api/deals?" + params);
      setData(await r.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/pipelines").then(r => r.json()).then(setPipelines).catch(() => {});
    load(period, pipeline);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePeriod = (days: number) => { setPeriod(days); load(days, pipeline); };
  const handlePipeline = (pipe: string) => { setPipelineFilter(pipe); load(period, pipe); };

  // Derived chart data
  const months = data ? Object.entries(data.byMonth).map(([k, v]) => {
    const [y, m] = k.split("-");
    const label = new Date(+y, +m - 1).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
    return { label, ...v };
  }) : [];

  const donutData = data ? [
    { name: "Ganhos", value: data.won, fill: "#22c55e" },
    { name: "Perdidos", value: data.lost, fill: "#ef4444" },
    { name: "Em Aberto", value: data.open, fill: "#f97316" },
  ] : [];

  const topStages = data
    ? Array.from(data.openDeals.reduce((acc, d) => {
        acc.set(d.stage, (acc.get(d.stage) || 0) + 1);
        return acc;
      }, new Map<string, number>())).map(([s, c]) => ({ stage: s, count: c })).sort((a, b) => b.count - a.count)
    : [];
  const maxStage = topStages[0]?.count || 1;

  const stageColors = ["#3b82f6", "#6366f1", "#f97316", "#22d3ee", "#eab308", "#22c55e"];

  const revenueArea = months.map(m => ({ label: m.label, receita: m.amount }));

  const lossMax = data?.lossReasons[0]?.[1] || 1;

  const today = new Date();

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <style>{`@keyframes shimmer{0%{background-position:200%}100%{background-position:-200%}}`}</style>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Pipeline Intelligence</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>Visão executiva do funil comercial</p>
        </div>
        <button
          onClick={() => load(period, pipeline)}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-secondary)", fontSize: 13, cursor: "pointer" }}
        >
          <RefreshCw size={14} />
          Atualizar
        </button>
      </div>

      {/* ── Filters ── */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Período:</span>
        <div style={{ display: "flex", gap: 6 }}>
          {[30, 90, 180, 365].map(d => (
            <Chip key={d} label={d === 365 ? "1 ano" : d === 180 ? "6 meses" : `${d} dias`} active={period === d} onClick={() => handlePeriod(d)} />
          ))}
        </div>
        <select
          value={pipeline}
          onChange={e => handlePipeline(e.target.value)}
          style={{ marginLeft: "auto", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", borderRadius: 7, padding: "6px 10px", fontSize: 13 }}
        >
          <option value="">Todos os pipelines</option>
          {pipelines.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
      </div>

      {/* ── KPIs ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 20 }}>
        {loading ? Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: "20px 22px" }}>
            <Skeleton h={10} w="60%" /><div style={{ marginTop: 12 }}><Skeleton h={28} w="70%" /></div>
          </div>
        )) : data ? <>
          <KpiCard label="Total de Deals" value={String(data.total)} sub="no período" color="var(--text-primary)" icon={<Activity size={16} />} />
          <KpiCard label="Ganhos" value={String(data.won)} sub={BRL(data.wonAmount)} color="var(--color-green)" icon={<TrendingUp size={16} />} />
          <KpiCard label="Perdidos" value={String(data.lost)} sub={data.total ? `${Math.round(data.lost / data.total * 100)}% do total` : "—"} color="var(--color-red)" icon={<TrendingDown size={16} />} />
          <KpiCard label="Em Aberto" value={String(data.open)} sub="deals ativos" color="var(--color-orange)" icon={<AlertCircle size={16} />} />
          <KpiCard label="Conversão" value={`${data.conversionRate}%`} sub="ganhos / criados" color="var(--accent-blue)" icon={<Target size={16} />} />
          <KpiCard label="Receita Ganha" value={BRL(data.wonAmount)} sub="no período" color="var(--color-green)" icon={<DollarSign size={16} />} />
        </> : null}
      </div>

      {/* ── Row 1: Bar chart + Donut ── */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16, marginBottom: 16 }}>
        <Card title="Volume por Mês" sub="Deals criados por mês no período (ganhos / perdidos / em aberto)">
          <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
            {[["Ganhos", "#22c55e"], ["Perdidos", "#ef4444"], ["Em Aberto", "#f97316"]].map(([l, c]) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-muted)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: "inline-block" }} />{l}
              </span>
            ))}
          </div>
          {loading ? <Skeleton h={220} w="100%" /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={months} {...chartTooltipStyle}>
                <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="won" name="Ganhos" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} />
                <Bar dataKey="lost" name="Perdidos" stackId="a" fill="#ef4444" />
                <Bar dataKey="open" name="Em Aberto" stackId="a" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card title="Distribuição" sub="Status dos deals no período">
          {loading ? <Skeleton h={220} w="100%" /> : data && (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {donutData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle.contentStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginTop: 8 }}>
                {donutData.map(d => (
                  <span key={d.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-secondary)" }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: d.fill, display: "inline-block" }} />
                    {d.name}: <strong style={{ color: d.fill }}>{d.value}</strong>
                  </span>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* ── Row 2: Funil + Top Deals ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card title="Funil por Estágio" sub="Deals em aberto por estágio atual">
          {loading ? <Skeleton h={200} w="100%" /> : topStages.map((s, i) => (
            <StageBar key={s.stage} label={s.stage} count={s.count} max={maxStage} color={stageColors[i % stageColors.length]} />
          ))}
        </Card>

        <Card title="Top Deals em Aberto" sub="Ordenados por probabilidade de fechamento">
          {loading ? <Skeleton h={200} w="100%" /> : data && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.openDeals.slice(0, 8).map(d => {
                const p = d.probability ?? 0;
                const color = p >= 70 ? "#22c55e" : p >= 40 ? "#f97316" : "#ef4444";
                const isOverdue = d.closeDate && new Date(d.closeDate) < today;
                return (
                  <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "var(--bg-secondary)", borderRadius: 8, border: "1px solid var(--border-color)" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{d.stage}</div>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>{BRL(d.amount)}</div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color }}>{p}%</div>
                      <div style={{ fontSize: 10, color: isOverdue ? "#ef4444" : "var(--text-muted)" }}>{fmtDate(d.closeDate)}{isOverdue ? " ⚠" : ""}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* ── Row 3: Loss reasons + Revenue trend ── */}
      <div style={{ display: "grid", gridTemplateColumns: "55fr 45fr", gap: 16 }}>
        <Card title="Motivos de Perda" sub="Ranking por frequência">
          {loading ? <Skeleton h={200} w="100%" /> : data && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {data.lossReasons.map(([label, count]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
                  <div style={{ width: 100, height: 4, background: "var(--bg-secondary)", borderRadius: 2, flexShrink: 0 }}>
                    <div style={{ height: "100%", width: `${Math.round((count / lossMax) * 100)}%`, background: "#ef4444", borderRadius: 2, opacity: 0.8 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", minWidth: 24, textAlign: "right" }}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Tendência de Receita" sub="Receita ganha por mês (R$)">
          {loading ? <Skeleton h={200} w="100%" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueArea} {...chartTooltipStyle}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e2d4a" strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip {...chartTooltipStyle} formatter={(v: number) => [BRL(v), "Receita"]} />
                <Area type="monotone" dataKey="receita" stroke="#22c55e" strokeWidth={2} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
}
