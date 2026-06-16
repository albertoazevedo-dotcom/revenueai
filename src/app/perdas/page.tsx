'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie,
} from 'recharts';

interface LossReason { reason: string; count: number; }
interface DealsData {
  summary: { lost: number; totalDeals: number; won: number; };
  lossReasons: LossReason[];
}

const tooltipStyle = {
  background: '#111827', border: '1px solid #1e2d4a', borderRadius: 8, fontSize: 12, color: '#e2e8f0',
};

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#06b6d4'];

function Skeleton({ h = 80 }: { h?: number }) {
  return <div style={{ height: h, borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border-color)', animation: 'pulse 1.5s ease-in-out infinite' }} />;
}

export default function PerdasPage() {
  const [data, setData] = useState<DealsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/deals').then(r => r.json()).then((d: DealsData) => { setData(d); setLoading(false); });
  }, []);

  const totalLost = data?.summary.lost ?? 0;
  const totalDeals = data?.summary.totalDeals ?? 1;
  const lossRate = data ? (((data.summary.lost) / (data.summary.won + data.summary.lost)) * 100).toFixed(1) : '0';
  const topReason = data?.lossReasons[0];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '32px 36px', color: 'var(--text-primary)' }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Análise de Perdas</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Entenda por que os deals estão sendo perdidos e onde atuar</p>
      </div>

      {/* Summary Cards */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          {[0,1,2].map(i => <Skeleton key={i} h={100} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '20px 22px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Deals Perdidos</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-red)', lineHeight: 1 }}>{totalLost}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>últimos 12 meses</div>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '20px 22px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Taxa de Perda</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#f97316', lineHeight: 1 }}>{lossRate}%</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>perdidos / (ganhos + perdidos)</div>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '20px 22px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Principal Motivo</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginTop: 4 }}>{topReason?.reason ?? '—'}</div>
            <div style={{ fontSize: 12, color: 'var(--color-red)', marginTop: 8 }}>{topReason?.count} casos registrados</div>
          </div>
        </div>
      )}

      {/* Charts Row */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '60fr 40fr', gap: 20, marginBottom: 24 }}>
          <Skeleton h={360} /><Skeleton h={360} />
        </div>
      ) : data && (
        <div style={{ display: 'grid', gridTemplateColumns: '60fr 40fr', gap: 20, marginBottom: 24 }}>
          {/* Horizontal Bar Chart */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '22px 24px' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 18, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Motivos de Perda por Volume</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.lossReasons} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 10 }} barSize={16}>
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="reason" width={180} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#ffffff08' }} formatter={(v: number) => [v, 'Deals perdidos']} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {data.lossReasons.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Chart */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '22px 24px' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 18, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Proporção</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={data.lossReasons} dataKey="count" nameKey="reason" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {data.lossReasons.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number, name: string) => [v, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
              {data.lossReasons.map(({ reason, count }, i) => {
                const total = data.lossReasons.reduce((s, l) => s + l.count, 0);
                const pct = ((count / total) * 100).toFixed(0);
                return (
                  <div key={reason} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ width: 9, height: 9, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{reason}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Insight Card */}
      {!loading && data && topReason && (
        <div style={{ background: '#92400e18', border: '1px solid #d9770644', borderRadius: 12, padding: '20px 24px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Insight Estratégico
          </div>
          <p style={{ fontSize: 14, color: '#fcd34d', lineHeight: 1.65, margin: 0 }}>
            O motivo <strong>"{topReason.reason}"</strong> foi responsável por{' '}
            <strong>{topReason.count} das {totalLost} perdas</strong>{' '}
            ({((topReason.count / totalLost) * 100).toFixed(0)}% do total).
            {' '}Isso indica uma oportunidade de revisão de estratégia de precificação ou reposicionamento competitivo.
            Considere criar playbooks específicos para superar esta objeção e treinar o time de vendas com casos de sucesso documentados.
          </p>
        </div>
      )}
    </div>
  );
}
