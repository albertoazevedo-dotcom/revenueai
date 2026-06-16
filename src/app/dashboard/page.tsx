'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Stage { id: string; label: string; }
interface Pipeline { id: string; label: string; stages: Stage[]; }
interface MonthData { month: string; ganhos: number; perdidos: number; aberto: number; wonAmount: number; }
interface Deal {
  id: string; name: string; company: string; stage: string;
  amount: number; probability: number; closeDate: string;
}
interface LossReason { reason: string; count: number; }
interface DealsData {
  summary: { totalDeals: number; won: number; lost: number; open: number; wonAmount: number; conversionRate: number; };
  byMonth: MonthData[];
  openDeals: Deal[];
  lossReasons: LossReason[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const brl = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
const fmtDate = (s: string) => { const [y,m,d] = s.split('-'); return `${d}/${m}/${y}`; };

const STAGE_LABELS: Record<string, string> = {
  qualificacao: 'Qualificação', demo: 'Demo Agendada', proposta: 'Proposta Enviada',
  negociacao: 'Em Negociação', fechamento: 'Fechamento', ganho: 'Ganho', perdido: 'Perdido',
};

const tooltipStyle = {
  background: '#111827', border: '1px solid #1e2d4a', borderRadius: 8, fontSize: 12, color: '#e2e8f0',
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function Skeleton({ h = 80 }: { h?: number }) {
  return (
    <div style={{
      height: h, borderRadius: 10, background: 'var(--bg-card)',
      border: '1px solid var(--border-color)', animation: 'pulse 1.5s ease-in-out infinite',
    }} />
  );
}

function KpiCard({ label, value, sub, subColor = 'var(--text-secondary)', accent }: {
  label: string; value: string; sub?: string; subColor?: string; accent: string;
}) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '20px 22px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: accent, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, fontWeight: 600, color: subColor, marginTop: 8 }}>{sub}</div>}
    </div>
  );
}

function SectionCard({ title, children, style }: { title: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '22px 24px', ...style }}>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 18, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{title}</h3>
      {children}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [period, setPeriod] = useState<'30d'|'90d'|'6m'|'1a'>('1a');
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState('default');
  const [data, setData] = useState<DealsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pipelines').then(r => r.json()).then(setPipelines);
    fetch('/api/deals').then(r => r.json()).then((d: DealsData) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  const periodLabels = { '30d': '30 dias', '90d': '90 dias', '6m': '6 meses', '1a': '1 ano' };

  const stageCounts = data
    ? Object.entries(
        data.openDeals.reduce((acc: Record<string, number>, d) => {
          acc[d.stage] = (acc[d.stage] || 0) + 1;
          return acc;
        }, {})
      ).map(([stage, count]) => ({ stage: STAGE_LABELS[stage] || stage, count }))
        .sort((a, b) => b.count - a.count)
    : [];

  const maxStage = stageCounts.length ? Math.max(...stageCounts.map(s => s.count)) : 1;
  const topDeals = data ? [...data.openDeals].sort((a, b) => b.probability - a.probability).slice(0, 8) : [];

  const donutData = data ? [
    { name: 'Ganhos', value: data.summary.won, color: '#22c55e' },
    { name: 'Perdidos', value: data.summary.lost, color: '#ef4444' },
    { name: 'Em Aberto', value: data.summary.open, color: '#f97316' },
  ] : [];

  const maxLossCount = data ? Math.max(...data.lossReasons.map(l => l.count)) : 1;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '32px 36px', color: 'var(--text-primary)' }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>Pipeline Intelligence</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '7px 16px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-green)', display: 'inline-block', boxShadow: '0 0 8px var(--color-green)', flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-green)' }}>HubSpot Conectado</span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 4 }}>
          {(['30d','90d','6m','1a'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: '6px 16px', borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none',
              background: period === p ? 'var(--accent-purple)' : 'transparent',
              color: period === p ? '#fff' : 'var(--text-secondary)',
            }}>{periodLabels[p]}</button>
          ))}
        </div>
        <select
          value={selectedPipeline}
          onChange={e => setSelectedPipeline(e.target.value)}
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10,
            color: 'var(--text-primary)', fontSize: 13, padding: '8px 14px', cursor: 'pointer',
          }}
        >
          {pipelines.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        <button style={{
          background: 'var(--accent-purple)', border: 'none', borderRadius: 10, color: '#fff',
          fontSize: 13, fontWeight: 700, padding: '8px 20px', cursor: 'pointer',
        }}>Aplicar</button>
      </div>

      {/* KPI Row */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginBottom: 24 }}>
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} h={100} />)}
        </div>
      ) : data && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginBottom: 24 }}>
          <KpiCard label="Total Deals" value={String(data.summary.totalDeals)} sub="últimos 12 meses" accent="var(--text-primary)" />
          <KpiCard label="Ganhos" value={String(data.summary.won)} sub={brl(data.summary.wonAmount)} subColor="var(--color-green)" accent="var(--color-green)" />
          <KpiCard label="Perdidos" value={String(data.summary.lost)} sub="deals encerrados" accent="var(--color-red)" />
          <KpiCard label="Em Aberto" value={String(data.summary.open)} sub="em andamento" accent="#f97316" />
          <KpiCard label="Taxa de Conversão" value={`${data.summary.conversionRate}%`} sub="won / (won+lost)" accent="#60a5fa" />
          <KpiCard label="Receita Ganha" value={brl(data.summary.wonAmount)} sub="total acumulado" subColor="var(--color-green)" accent="var(--color-green)" />
        </div>
      )}

      {/* Charts Row 1: 60/40 */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '60fr 40fr', gap: 20, marginBottom: 24 }}>
          <Skeleton h={300} /><Skeleton h={300} />
        </div>
      ) : data && (
        <div style={{ display: 'grid', gridTemplateColumns: '60fr 40fr', gap: 20, marginBottom: 24 }}>
          <SectionCard title="Volume por Mês">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.byMonth} margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#ffffff08' }} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                <Bar dataKey="ganhos" name="Ganhos" stackId="a" fill="#22c55e" />
                <Bar dataKey="perdidos" name="Perdidos" stackId="a" fill="#ef4444" />
                <Bar dataKey="aberto" name="Em Aberto" stackId="a" fill="#f97316" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>

          <SectionCard title="Status dos Deals">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {donutData.map(item => {
                const total = data.summary.totalDeals;
                const pct = ((item.value / total) * 100).toFixed(1);
                return (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.value}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      )}

      {/* Charts Row 2: 50/50 */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <Skeleton h={320} /><Skeleton h={320} />
        </div>
      ) : data && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <SectionCard title="Funil por Estágio">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stageCounts.map(({ stage, count }) => (
                <div key={stage}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{stage}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-purple)' }}>{count}</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-primary)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(count / maxStage) * 100}%`, background: 'var(--accent-purple)', borderRadius: 99, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Top Deals em Aberto">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 280, overflowY: 'auto' }}>
              {topDeals.map(deal => (
                <div key={deal.id} style={{ background: 'var(--bg-primary)', borderRadius: 8, padding: '10px 12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{deal.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{deal.company} · {STAGE_LABELS[deal.stage] || deal.stage}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-green)' }}>{brl(deal.amount)}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{fmtDate(deal.closeDate)}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 4, background: 'var(--bg-card)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${deal.probability}%`, background: deal.probability >= 70 ? '#22c55e' : deal.probability >= 40 ? '#f97316' : '#ef4444', borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: deal.probability >= 70 ? '#22c55e' : deal.probability >= 40 ? '#f97316' : '#ef4444', minWidth: 32 }}>{deal.probability}%</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* Charts Row 3: 55/45 */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '55fr 45fr', gap: 20 }}>
          <Skeleton h={280} /><Skeleton h={280} />
        </div>
      ) : data && (
        <div style={{ display: 'grid', gridTemplateColumns: '55fr 45fr', gap: 20 }}>
          <SectionCard title="Motivos de Perda">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.lossReasons.map(({ reason, count }, i) => (
                <div key={reason} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', minWidth: 18, textAlign: 'right' }}>{i + 1}.</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{reason}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-red)', background: '#ef444418', borderRadius: 6, padding: '2px 8px' }}>{count}</span>
                    </div>
                    <div style={{ height: 5, background: 'var(--bg-primary)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(count / maxLossCount) * 100}%`, background: 'var(--color-red)', borderRadius: 99 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Tendência de Receita">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data.byMonth} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [brl(v), 'Receita Ganha']} />
                <Area type="monotone" dataKey="wonAmount" stroke="#22c55e" strokeWidth={2} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>
      )}
    </div>
  );
}
