"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface OpenDeal {
  id: string; name: string; amount: number; stage: string;
  closeDate: string | null; probability: number | null; pipeline: string;
}

const BRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);

const fmtDate = (s: string | null) => {
  if (!s) return "—";
  try { return new Date(s).toLocaleDateString("pt-BR"); } catch { return s; }
};

function Badge({ p }: { p: number | null }) {
  if (p === null) return <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: "#1e2d4a", color: "#64748b" }}>—</span>;
  const [bg, color, label] =
    p >= 70 ? ["#14532d", "#22c55e", "Quente"] :
    p >= 40 ? ["#431407", "#f97316", "Médio"] :
               ["#450a0a", "#ef4444", "Frio"];
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: bg, color }}>{label}</span>;
}

export default function PipelinePage() {
  const [deals, setDeals] = useState<OpenDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"probability" | "amount" | "closeDate">("probability");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetch("/api/deals?start=2025-01-01&end=2025-12-31")
      .then(r => r.json())
      .then(d => { setDeals(d.openDeals || []); setLoading(false); });
  }, []);

  const today = new Date();

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sorted = [...deals]
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.stage.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let va: number, vb: number;
      if (sortKey === "probability") { va = a.probability ?? -1; vb = b.probability ?? -1; }
      else if (sortKey === "amount") { va = a.amount; vb = b.amount; }
      else { va = a.closeDate ? new Date(a.closeDate).getTime() : 0; vb = b.closeDate ? new Date(b.closeDate).getTime() : 0; }
      return sortDir === "desc" ? vb - va : va - vb;
    });

  const totalOpen = sorted.reduce((s, d) => s + d.amount, 0);

  const thStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase",
    letterSpacing: "0.06em", padding: "10px 14px", borderBottom: "1px solid var(--border-color)",
    textAlign: "left", whiteSpace: "nowrap", cursor: "pointer", userSelect: "none",
  };
  const tdStyle: React.CSSProperties = { padding: "12px 14px", borderBottom: "1px solid var(--border-color)", fontSize: 13 };

  return (
    <div style={{ color: "var(--text-primary)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Deals em Aberto</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>Pipeline ativo ordenado por probabilidade de fechamento</p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            <span style={{ fontWeight: 700, color: "var(--color-orange)" }}>{sorted.length}</span> deals •{" "}
            <span style={{ fontWeight: 700, color: "var(--color-green)" }}>{BRL(totalOpen)}</span> em pipeline
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <Search size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome ou estágio..."
          style={{ background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 13, flex: 1 }}
        />
      </div>

      {/* Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-secondary)" }}>
                <th style={thStyle}>Deal</th>
                <th style={thStyle}>Estágio</th>
                <th style={{ ...thStyle }} onClick={() => toggleSort("amount")}>
                  Valor {sortKey === "amount" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                </th>
                <th style={{ ...thStyle }} onClick={() => toggleSort("closeDate")}>
                  Fecha em {sortKey === "closeDate" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                </th>
                <th style={{ ...thStyle }} onClick={() => toggleSort("probability")}>
                  Prob. {sortKey === "probability" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                </th>
                <th style={thStyle}>Barra</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ ...tdStyle, textAlign: "center", color: "var(--text-muted)", padding: 40 }}>Carregando...</td></tr>
              ) : sorted.length === 0 ? (
                <tr><td colSpan={7} style={{ ...tdStyle, textAlign: "center", color: "var(--text-muted)", padding: 40 }}>Nenhum deal encontrado</td></tr>
              ) : sorted.map(d => {
                const p = d.probability ?? null;
                const color = p === null ? "#64748b" : p >= 70 ? "#22c55e" : p >= 40 ? "#f97316" : "#ef4444";
                const isOverdue = d.closeDate && new Date(d.closeDate) < today;
                return (
                  <tr key={d.id} style={{ transition: "background .1s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-secondary)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ ...tdStyle, fontWeight: 600, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</td>
                    <td style={{ ...tdStyle, color: "var(--text-secondary)" }}>{d.stage}</td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{BRL(d.amount)}</td>
                    <td style={{ ...tdStyle, color: isOverdue ? "#ef4444" : "var(--text-secondary)" }}>
                      {fmtDate(d.closeDate)}{isOverdue ? " ⚠" : ""}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 700, color }}>{p !== null ? `${p}%` : "—"}</td>
                    <td style={tdStyle}>
                      <div style={{ width: 80, height: 5, background: "var(--bg-secondary)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${p ?? 0}%`, background: color, borderRadius: 3 }} />
                      </div>
                    </td>
                    <td style={tdStyle}><Badge p={p} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
