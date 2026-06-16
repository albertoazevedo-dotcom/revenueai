'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

interface Deal {
  id: string; name: string; company: string; stage: string;
  amount: number; probability: number; closeDate: string;
}
interface DealsData { openDeals: Deal[]; }

const brl = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
const fmtDate = (s: string) => { const [y,m,d] = s.split('-'); return `${d}/${m}/${y}`; };

const STAGE_LABELS: Record<string, string> = {
  qualificacao: 'Qualificação', demo: 'Demo Agendada', proposta: 'Proposta Enviada',
  negociacao: 'Em Negociação', fechamento: 'Fechamento', ganho: 'Ganho', perdido: 'Perdido',
};

type SortKey = 'name' | 'amount' | 'probability' | 'closeDate';

function StatusBadge({ probability }: { probability: number }) {
  const hot = probability >= 70;
  const mid = probability >= 40;
  const color = hot ? '#22c55e' : mid ? '#f97316' : '#60a5fa';
  const label = hot ? 'Quente' : mid ? 'Médio' : 'Frio';
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}44`, borderRadius: 6, padding: '3px 10px' }}>
      {label}
    </span>
  );
}

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('probability');
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    fetch('/api/deals').then(r => r.json()).then((d: DealsData) => {
      setDeals(d.openDeals);
      setLoading(false);
    });
  }, []);

  const filtered = deals
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.company.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const va = a[sortKey]; const vb = b[sortKey];
      if (typeof va === 'string' && typeof vb === 'string') return sortDesc ? vb.localeCompare(va) : va.localeCompare(vb);
      return sortDesc ? (vb as number) - (va as number) : (va as number) - (vb as number);
    });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDesc(d => !d);
    else { setSortKey(key); setSortDesc(true); }
  }

  const thStyle: React.CSSProperties = {
    padding: '12px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
    textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'left', cursor: 'pointer',
    borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap',
  };
  const tdStyle: React.CSSProperties = {
    padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)',
    borderBottom: '1px solid var(--border-color)',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '32px 36px', color: 'var(--text-primary)' }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Pipeline de Deals</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Todos os deals em aberto com busca e ordenação</p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, padding: '8px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>
          {loading ? '...' : `${filtered.length} deals`}
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 400, marginBottom: 24 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome ou empresa..."
          style={{
            width: '100%', boxSizing: 'border-box', paddingLeft: 38, paddingRight: 16, paddingTop: 10, paddingBottom: 10,
            background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10,
            color: 'var(--text-primary)', fontSize: 13, outline: 'none',
          }}
        />
      </div>

      {loading ? (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, height: 400, animation: 'pulse 1.5s ease-in-out infinite' }} />
      ) : (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)' }}>
                <th style={thStyle} onClick={() => toggleSort('name')}>
                  Deal / Empresa {sortKey === 'name' ? (sortDesc ? '↓' : '↑') : ''}
                </th>
                <th style={thStyle}>Estágio</th>
                <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => toggleSort('amount')}>
                  Valor {sortKey === 'amount' ? (sortDesc ? '↓' : '↑') : ''}
                </th>
                <th style={thStyle} onClick={() => toggleSort('closeDate')}>
                  Fechamento {sortKey === 'closeDate' ? (sortDesc ? '↓' : '↑') : ''}
                </th>
                <th style={{ ...thStyle }} onClick={() => toggleSort('probability')}>
                  Probabilidade {sortKey === 'probability' ? (sortDesc ? '↓' : '↑') : ''}
                </th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((deal, i) => (
                <tr key={deal.id} style={{ background: i % 2 === 0 ? 'transparent' : '#ffffff04' }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{deal.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{deal.company}</div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontSize: 12, color: 'var(--accent-purple)', background: '#6366f118', borderRadius: 6, padding: '3px 10px', fontWeight: 600 }}>
                      {STAGE_LABELS[deal.stage] || deal.stage}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: 'var(--color-green)' }}>{brl(deal.amount)}</td>
                  <td style={tdStyle}>{fmtDate(deal.closeDate)}</td>
                  <td style={{ ...tdStyle, minWidth: 140 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 5, background: 'var(--bg-primary)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${deal.probability}%`, background: deal.probability >= 70 ? '#22c55e' : deal.probability >= 40 ? '#f97316' : '#60a5fa', borderRadius: 99 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', minWidth: 32 }}>{deal.probability}%</span>
                    </div>
                  </td>
                  <td style={tdStyle}><StatusBadge probability={deal.probability} /></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ ...tdStyle, textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Nenhum deal encontrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
