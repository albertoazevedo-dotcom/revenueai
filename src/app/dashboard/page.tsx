'use client';

import {
  Users,
  Target,
  Clock,
  DollarSign,
  Percent,
  BarChart2,
  Tag,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

interface KpiCard {
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  icon: React.ReactNode;
  iconColor: string;
  extra?: string;
}

interface PipelineStage {
  name: string;
  count: number;
  color: string;
  max: number;
}

interface ChannelConversion {
  name: string;
  pct: number;
  color: string;
}

interface LostDeal {
  company: string;
  contact: string;
  reason: string;
  badgeColor: string;
}

interface GapSeller {
  name: string;
  days: number;
  calls: number;
  barColor: string;
  textColor: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const kpiCards: KpiCard[] = [
  {
    label: 'LEADS RECEBIDOS',
    value: '463',
    delta: '+12% vs mês ant.',
    deltaPositive: true,
    icon: <Users size={20} />,
    iconColor: 'var(--accent-blue)',
  },
  {
    label: 'MQLs NO SLA',
    value: '80%',
    delta: '+5% vs mês ant.',
    deltaPositive: true,
    icon: <Target size={20} />,
    iconColor: 'var(--accent-teal)',
  },
  {
    label: 'SLA DE 1º CONTATO',
    value: '14 min',
    delta: '-2m vs mês ant.',
    deltaPositive: true,
    icon: <Clock size={20} />,
    iconColor: 'var(--color-orange)',
  },
  {
    label: 'RECEITA ATUAL',
    value: 'R$ 345.000',
    delta: '+8% vs mês ant.',
    deltaPositive: true,
    icon: <DollarSign size={20} />,
    iconColor: 'var(--color-green)',
  },
  {
    label: 'CONVERSÃO',
    value: '5.4%',
    delta: '-0.2% vs mês ant.',
    deltaPositive: false,
    icon: <Percent size={20} />,
    iconColor: 'var(--color-red)',
  },
  {
    label: 'MTD (MONTH TO DATE)',
    value: 'R$ 280.000',
    delta: '',
    deltaPositive: true,
    icon: <BarChart2 size={20} />,
    iconColor: 'var(--accent-purple)',
    extra: '93% da meta',
  },
  {
    label: 'TICKET MÉDIO',
    value: 'R$ 13.800',
    delta: '+5% vs mês ant.',
    deltaPositive: true,
    icon: <Tag size={20} />,
    iconColor: 'var(--accent-blue)',
  },
  {
    label: 'FORECAST',
    value: 'R$ 510.000',
    delta: '',
    deltaPositive: true,
    icon: <TrendingUp size={20} />,
    iconColor: 'var(--color-green)',
    extra: 'Auditoria IA: Alta',
  },
];

const pipelineStages: PipelineStage[] = [
  { name: 'Leads Novos', count: 18, color: 'var(--accent-blue)', max: 250 },
  { name: 'Tentativa', count: 250, color: 'var(--color-orange)', max: 250 },
  { name: 'Conectados', count: 110, color: 'var(--color-yellow)', max: 250 },
  { name: 'Negociações', count: 60, color: 'var(--accent-purple)', max: 250 },
  { name: 'Proposta Enviada', count: 35, color: 'var(--accent-blue)', max: 250 },
  { name: 'Ganhos', count: 28, color: 'var(--color-green)', max: 250 },
  { name: 'Perdidos', count: 22, color: 'var(--color-red)', max: 250 },
];

const channelConversions: ChannelConversion[] = [
  { name: 'Meta Ads', pct: 4.2, color: 'var(--accent-blue)' },
  { name: 'LinkedIn', pct: 6.8, color: 'var(--accent-purple)' },
  { name: 'Google Ads', pct: 5.1, color: 'var(--accent-teal)' },
  { name: 'Social', pct: 3.5, color: 'var(--color-orange)' },
  { name: 'Eventos', pct: 12.0, color: 'var(--color-green)' },
  { name: 'Indicação', pct: 18.5, color: 'var(--color-yellow)' },
];

const lostDeals: LostDeal[] = [
  {
    company: 'AgroSul S.A.',
    contact: 'Pedro Alves',
    reason: 'Budget/Preço Alto',
    badgeColor: 'var(--color-red)',
  },
  {
    company: 'Finanças Now',
    contact: 'Carlos Dutra',
    reason: 'Perdeu para Concorrente',
    badgeColor: 'var(--color-orange)',
  },
];

const gapSellers: GapSeller[] = [
  { name: 'Pedro Alves', days: 14, calls: 22, barColor: 'var(--color-red)', textColor: 'var(--color-red)' },
  { name: 'Carlos Dutra', days: 8, calls: 41, barColor: 'var(--color-orange)', textColor: 'var(--color-orange)' },
  { name: 'Ana Souza', days: 3, calls: 85, barColor: 'var(--color-yellow)', textColor: 'var(--color-yellow)' },
  { name: 'Lucas BH', days: 1, calls: 112, barColor: 'var(--color-green)', textColor: 'var(--color-green)' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCardComponent({ card }: { card: KpiCard }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 12,
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        transition: 'border-color 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }}
        >
          {card.label}
        </span>
        <span
          style={{
            color: card.iconColor,
            display: 'flex',
            alignItems: 'center',
            background: `${card.iconColor}18`,
            borderRadius: 8,
            padding: '5px 6px',
          }}
        >
          {card.icon}
        </span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
        {card.value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {card.delta && (
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: card.deltaPositive ? 'var(--color-green)' : 'var(--color-red)',
            }}
          >
            {card.delta}
          </span>
        )}
        {card.extra && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--accent-purple)',
              background: '#6366f118',
              borderRadius: 6,
              padding: '2px 8px',
            }}
          >
            {card.extra}
          </span>
        )}
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 12,
        padding: '22px 24px',
        flex: 1,
        minWidth: 0,
      }}
    >
      <h3
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 18,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function HorizontalBar({
  label,
  value,
  maxValue,
  color,
  suffix = '',
}: {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  suffix?: string;
}) {
  const pct = Math.min((value / maxValue) * 100, 100);
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 5,
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>
          {value}
          {suffix}
        </span>
      </div>
      <div
        style={{
          height: 6,
          background: 'var(--bg-secondary)',
          borderRadius: 99,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: color,
            borderRadius: 99,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        padding: '32px 36px',
        color: 'var(--text-primary)',
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 32,
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>
          Visão Geral
        </h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 20,
            padding: '7px 16px',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--color-green)',
              display: 'inline-block',
              boxShadow: '0 0 8px var(--color-green)',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-green)' }}>
            Sistema Operacional: Online
          </span>
        </div>
      </div>

      {/* ── KPI Grid (4 cols × 2 rows) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 28,
        }}
      >
        {kpiCards.map((card) => (
          <KpiCardComponent key={card.label} card={card} />
        ))}
      </div>

      {/* ── Pipeline + Channel Row ── */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
        {/* Pipeline Status */}
        <SectionCard title="Status do Pipeline Atual">
          {pipelineStages.map((stage) => (
            <HorizontalBar
              key={stage.name}
              label={stage.name}
              value={stage.count}
              maxValue={stage.max}
              color={stage.color}
            />
          ))}
        </SectionCard>

        {/* Channel Conversion */}
        <SectionCard title="Conversão por Canal">
          {channelConversions.map((ch) => (
            <HorizontalBar
              key={ch.name}
              label={ch.name}
              value={ch.pct}
              maxValue={20}
              color={ch.color}
              suffix="%"
            />
          ))}
        </SectionCard>
      </div>

      {/* ── Losts + Gap Row ── */}
      <div style={{ display: 'flex', gap: 20 }}>
        {/* Lost Deals */}
        <SectionCard title="Últimos Losts Relevantes">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {lostDeals.map((deal) => (
              <div
                key={deal.company}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 8,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {deal.company}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {deal.contact}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Motivo:</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: deal.badgeColor,
                      background: `${deal.badgeColor}22`,
                      border: `1px solid ${deal.badgeColor}55`,
                      borderRadius: 6,
                      padding: '3px 8px',
                    }}
                  >
                    {deal.reason}
                  </span>
                </div>
              </div>
            ))}

            {/* IA Insight Box */}
            <div
              style={{
                background: '#92400e22',
                border: '1px solid #d9770655',
                borderRadius: 10,
                padding: '14px 16px',
                marginTop: 4,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 18,
                    lineHeight: 1,
                    marginTop: 1,
                    flexShrink: 0,
                  }}
                >
                  💡
                </span>
                <p style={{ fontSize: 13, color: '#fbbf24', lineHeight: 1.55 }}>
                  O vendedor <strong>Lucas BH</strong> ganhou uma venda recente quebrando a mesma
                  objeção (<strong>Budget/Preço Alto</strong>).
                </p>
              </div>
              <button
                style={{
                  background: '#d9770620',
                  border: '1px solid #d97706aa',
                  borderRadius: 7,
                  padding: '8px 14px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#fbbf24',
                  cursor: 'pointer',
                  width: '100%',
                  letterSpacing: '0.02em',
                  transition: 'background 0.15s',
                }}
              >
                Escutar Call e Ver Insights
              </button>
            </div>
          </div>
        </SectionCard>

        {/* Gap de Vendas vs Produtividade */}
        <SectionCard title="Gap de Vendas vs Produtividade">
          {/* Subtitle warning */}
          <p
            style={{
              fontSize: 11,
              color: 'var(--color-orange)',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: 18,
              marginTop: -8,
            }}
          >
            Atenção ao Volume de Atividades
          </p>

          {/* Recharts horizontal bar chart — days without close */}
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={gapSellers.map((s) => ({ name: s.name, dias: s.days, color: s.barColor }))}
              layout="vertical"
              margin={{ top: 0, right: 20, bottom: 0, left: 60 }}
              barSize={12}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip
                cursor={{ fill: '#ffffff08' }}
                contentStyle={{
                  background: '#111827',
                  border: '1px solid #1e2d4a',
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#e2e8f0',
                }}
                formatter={(value) => [`${value} dias sem fechar`, '']}
              />
              <Bar dataKey="dias" radius={[0, 6, 6, 0]}>
                {gapSellers.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.barColor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Detail rows */}
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {gapSellers.map((seller) => (
              <div
                key={seller.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-secondary)',
                  borderRadius: 7,
                  padding: '8px 12px',
                  border: `1px solid ${seller.barColor}30`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: seller.barColor,
                      flexShrink: 0,
                      boxShadow: `0 0 4px ${seller.barColor}`,
                    }}
                  />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    {seller.name}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: seller.textColor }}>
                    {seller.days} dia{seller.days !== 1 ? 's' : ''}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      background: 'var(--bg-card)',
                      borderRadius: 5,
                      padding: '2px 8px',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    {seller.calls} calls
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              marginTop: 14,
              fontStyle: 'italic',
              lineHeight: 1.55,
            }}
          >
            * O vendedor com maior tempo sem fechar é também o que tem menor volume de reuniões.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
