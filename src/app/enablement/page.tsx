'use client';

import { useState } from 'react';
import { Send, Mic, Star, TrendingUp } from 'lucide-react';
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

interface RepCard {
  name: string;
  role: string;
  badge: string;
  badgeColor: string;
  score: number;
  scoreColor: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  metrics: { label: string; value: string }[];
}

interface PitchEval {
  rep: string;
  lead: string;
  score: number;
  insight: string;
  live?: boolean;
}

interface Objection {
  label: string;
  count: number;
  color: string;
}

interface RankEntry {
  rank: number;
  name: string;
  score: number;
}

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const repCards: RepCard[] = [
  {
    name: 'LUCAS BH',
    role: 'CHALLENGER',
    badge: 'CHL',
    badgeColor: '#d97706',
    score: 92,
    scoreColor: '#fbbf24',
    gradientFrom: '#1c1408',
    gradientTo: '#2d1f05',
    borderColor: '#92400e',
    metrics: [
      { label: 'Receita', value: 'R$ 120k' },
      { label: 'Convers.', value: '95' },
      { label: 'Pitch', value: '90' },
      { label: 'Ticket', value: 'R$ 45k' },
      { label: 'Conv %', value: '8%' },
    ],
  },
  {
    name: 'ANA SOUZA',
    role: 'RELATIONSHIP BUILDER',
    badge: 'REL',
    badgeColor: '#3b82f6',
    score: 88,
    scoreColor: '#93c5fd',
    gradientFrom: '#0d1424',
    gradientTo: '#111827',
    borderColor: '#1e3a5f',
    metrics: [
      { label: 'Receita', value: 'R$ 95k' },
      { label: 'Convers.', value: '88' },
      { label: 'Pitch', value: '90' },
      { label: 'Ticket', value: 'R$ 38k' },
      { label: 'Conv %', value: '5%' },
    ],
  },
  {
    name: 'NINA - AGENTE IA',
    role: 'AGENTE AUTÔNOMO',
    badge: 'A.I.',
    badgeColor: '#6366f1',
    score: 87,
    scoreColor: '#a5b4fc',
    gradientFrom: '#0f0e1f',
    gradientTo: '#1a1535',
    borderColor: '#3730a3',
    metrics: [
      { label: 'Receita', value: 'R$ 105k' },
      { label: 'Convers.', value: '92' },
      { label: 'Pipeline', value: 'Auto' },
      { label: 'Ticket', value: 'R$ 40k' },
      { label: 'Conv %', value: '8%' },
    ],
  },
];

const pitchEvals: PitchEval[] = [
  {
    rep: 'Lucas BH',
    lead: 'CRES',
    score: 9.2,
    insight: 'Excelente controle da narrativa. BANT qualificado em 8 min.',
    live: true,
  },
  {
    rep: 'Carlos Dutra',
    lead: 'Qualificação',
    score: 8.5,
    insight: 'Bom rapport. Foco necessário no produto e não na dor do cliente.',
  },
  {
    rep: 'Ana Souza',
    lead: 'Negociação',
    score: 8.8,
    insight: 'Excelente gestão de objeções. Manteve foco no valor entregue.',
  },
];

const objections: Objection[] = [
  { label: 'Budget / Preço alto', count: 45, color: 'var(--color-red)' },
  { label: 'Concorrente mais barato', count: 22, color: 'var(--color-orange)' },
  { label: 'Não é o momento certo', count: 16, color: 'var(--color-yellow)' },
  { label: 'Implementação complexa', count: 12, color: 'var(--accent-blue)' },
];

const ranking: RankEntry[] = [
  { rank: 1, name: 'Lucas BH', score: 92 },
  { rank: 2, name: 'Ana Souza', score: 88 },
  { rank: 3, name: 'Nina - Agente IA', score: 87 },
];

const initialMessages: ChatMessage[] = [
  {
    role: 'user',
    text: 'Como eu quebro a objeção de preço alto?',
  },
  {
    role: 'ai',
    text: 'Ótima pergunta! Para quebrar a objeção de preço alto, use o método ROI:\n\n1) Calcule o custo atual do problema\n2) Mostre o valor entregue em 90 dias\n3) Compare com o investimento\n\nLucas BH usou essa técnica e fechou AgroSul com 18% acima do ticket médio.',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function RepCardComponent({ card }: { card: RepCard }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        borderRadius: 14,
        border: `1px solid ${card.borderColor}`,
        background: `linear-gradient(145deg, ${card.gradientFrom}, ${card.gradientTo})`,
        padding: '22px 22px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle glow overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at top right, ${card.badgeColor}0a, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Top row: name + badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
            {card.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, letterSpacing: '0.05em' }}>
            {card.role}
          </div>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: card.badgeColor,
            background: `${card.badgeColor}22`,
            border: `1px solid ${card.badgeColor}55`,
            borderRadius: 6,
            padding: '3px 9px',
            letterSpacing: '0.06em',
            flexShrink: 0,
          }}
        >
          {card.badge}
        </span>
      </div>

      {/* Score */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 46, fontWeight: 900, color: card.scoreColor, lineHeight: 1 }}>
          {card.score}
        </span>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>/99</span>
      </div>

      {/* Metric pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
        {card.metrics.map((m) => (
          <div
            key={m.label}
            style={{
              background: '#ffffff08',
              border: '1px solid #ffffff12',
              borderRadius: 7,
              padding: '5px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <span style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {m.label}
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              {m.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PanelCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 12,
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h3
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: 18,
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const radius = 14;
  const circ = 2 * Math.PI * radius;
  const dash = (score / 10) * circ;
  return (
    <svg width={36} height={36} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={18} cy={18} r={radius} fill="none" stroke="#1e2d4a" strokeWidth={3} />
      <circle
        cx={18}
        cy={18}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
      />
      <text
        x={18}
        y={18}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          transform: 'rotate(90deg)',
          transformOrigin: '18px 18px',
          fontSize: 9,
          fontWeight: 700,
          fill: color,
        }}
      >
        {score}
      </text>
    </svg>
  );
}

function PlaybookChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = { role: 'user', text: trimmed };
    const aiMsg: ChatMessage = {
      role: 'ai',
      text: 'Analisando sua pergunta com base nos dados de performance da equipe e nas calls gravadas... Aguarde um momento enquanto processo as melhores práticas dos top performers.',
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') send();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 340,
      }}
    >
      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          marginBottom: 14,
          paddingRight: 4,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              gap: 8,
              alignItems: 'flex-start',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                background: msg.role === 'user' ? 'var(--accent-blue)' : 'var(--accent-purple)',
                color: '#fff',
              }}
            >
              {msg.role === 'user' ? 'U' : 'AI'}
            </div>
            {/* Bubble */}
            <div
              style={{
                maxWidth: '80%',
                background: msg.role === 'user' ? '#1e3a5f' : '#1a1535',
                border: `1px solid ${msg.role === 'user' ? '#1e4a8055' : '#3730a355'}`,
                borderRadius: msg.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
                padding: '10px 14px',
                fontSize: 13,
                color: 'var(--text-primary)',
                lineHeight: 1.6,
                whiteSpace: 'pre-line',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 10,
          padding: '6px 8px 6px 14px',
          alignItems: 'center',
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Pergunte sobre técnicas de vendas, objeções, scripts..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 13,
            color: 'var(--text-primary)',
          }}
        />
        <button
          onClick={send}
          style={{
            background: 'var(--accent-purple)',
            border: 'none',
            borderRadius: 7,
            padding: '6px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            transition: 'opacity 0.15s',
          }}
        >
          <Send size={14} />
        </button>
        <button
          style={{
            background: '#22c55e18',
            border: '1px solid #22c55e44',
            borderRadius: 7,
            padding: '6px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-green)',
          }}
        >
          <Mic size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EnablementPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        padding: '32px 36px',
        color: 'var(--text-primary)',
      }}
    >
      {/* ── Page Title ── */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
          Avaliação de Executivos via Inteligência Artificial
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          Rating 0–99 &nbsp;·&nbsp; Baseado em análise de calls, CRM e performance de fechamento
        </p>
      </div>

      {/* ── Rep Cards Row ── */}
      <div style={{ display: 'flex', gap: 18, marginBottom: 24 }}>
        {repCards.map((card) => (
          <RepCardComponent key={card.name} card={card} />
        ))}
      </div>

      {/* ── Playbook Interativo Section ── */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          padding: '24px 26px',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#6366f122',
              border: '1px solid #6366f144',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-purple)',
              flexShrink: 0,
            }}
          >
            <TrendingUp size={16} />
          </div>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
              Playbook Interativo &amp; Agente de Dúvidas
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Converse com a IA para aprender técnicas de fechamento dos top performers
            </p>
          </div>
        </div>

        <PlaybookChat />
      </div>

      {/* ── Three-column analysis row ── */}
      <div style={{ display: 'flex', gap: 18 }}>
        {/* Left: Pitch Evaluation */}
        <PanelCard title="Avaliação de Pitch (IA)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pitchEvals.map((ev) => (
              <div
                key={ev.rep}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 9,
                  padding: '12px 14px',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                {/* Score ring */}
                <ScoreRing
                  score={ev.score}
                  color={ev.score >= 9 ? 'var(--color-green)' : ev.score >= 8.5 ? 'var(--accent-teal)' : 'var(--accent-blue)'}
                />
                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {ev.rep}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: 'var(--accent-teal)',
                        background: '#22d3ee18',
                        border: '1px solid #22d3ee33',
                        borderRadius: 5,
                        padding: '2px 7px',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {ev.lead}
                    </span>
                    {ev.live && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: 'var(--color-green)',
                          background: '#22c55e18',
                          border: '1px solid #22c55e44',
                          borderRadius: 5,
                          padding: '2px 7px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            background: 'var(--color-green)',
                            display: 'inline-block',
                            boxShadow: '0 0 4px var(--color-green)',
                          }}
                        />
                        Ao Vivo
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {ev.insight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </PanelCard>

        {/* Middle: Objection Matrix */}
        <PanelCard title="Matriz de Objeções">
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 16, marginTop: -8 }}>
            Frequência nas calls do mês
          </p>

          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={objections.map((o) => ({ name: o.label, menções: o.count }))}
              layout="vertical"
              margin={{ top: 0, right: 16, bottom: 0, left: 10 }}
              barSize={13}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={140}
              />
              <Tooltip
                cursor={{ fill: '#ffffff06' }}
                contentStyle={{
                  background: '#111827',
                  border: '1px solid #1e2d4a',
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#e2e8f0',
                }}
                formatter={(value) => [`${value} menções`, '']}
              />
              <Bar dataKey="menções" radius={[0, 6, 6, 0]}>
                {objections.map((entry, index) => (
                  <Cell key={`obj-cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend counts */}
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 7 }}>
            {objections.map((obj) => (
              <div
                key={obj.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: obj.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{obj.label}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: obj.color, flexShrink: 0 }}>
                  {obj.count}
                </span>
              </div>
            ))}
          </div>

          <button
            style={{
              marginTop: 20,
              width: '100%',
              background: 'var(--accent-purple)',
              border: 'none',
              borderRadius: 8,
              padding: '9px 0',
              fontSize: 12,
              fontWeight: 700,
              color: '#fff',
              cursor: 'pointer',
              letterSpacing: '0.03em',
              transition: 'opacity 0.15s',
            }}
          >
            Enviar Treinamento
          </button>
        </PanelCard>

        {/* Right: Monthly Ranking */}
        <PanelCard title="Ranking do Mês">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ranking.map((entry) => {
              const medalColors = ['#fbbf24', '#94a3b8', '#d97706'];
              const medal = medalColors[entry.rank - 1] ?? 'var(--text-muted)';
              return (
                <div
                  key={entry.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: 'var(--bg-secondary)',
                    border: `1px solid ${medal}30`,
                    borderRadius: 10,
                    padding: '12px 14px',
                  }}
                >
                  {/* Rank number */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: `${medal}20`,
                      border: `1.5px solid ${medal}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 800,
                      color: medal,
                      flexShrink: 0,
                    }}
                  >
                    {entry.rank}
                  </div>
                  {/* Name */}
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {entry.name}
                  </span>
                  {/* Score badge */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      SCORE
                    </span>
                    <span style={{ fontSize: 20, fontWeight: 900, color: medal, lineHeight: 1 }}>
                      {entry.score}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Star note */}
          <div
            style={{
              marginTop: 20,
              background: '#6366f112',
              border: '1px solid #6366f130',
              borderRadius: 8,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
            }}
          >
            <Star size={14} style={{ color: 'var(--accent-purple)', flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55 }}>
              Rankings são recalculados diariamente com base em performance de calls, taxa de conversão e ticket médio.
            </p>
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
