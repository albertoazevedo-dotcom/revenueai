'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, Settings, Zap, Play, Circle, ChevronRight, Cpu, Activity } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Agent {
  id: string;
  name: string;
  status: 'ATIVO' | 'PAUSADO';
  description: string;
  kpiLabel: string;
  kpiValue: string;
}

interface LogEntry {
  time: string;
  source: string;
  sourceColor: string;
  message: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const agents: Agent[] = [
  {
    id: 'sdr',
    name: 'SDR Autônomo',
    status: 'ATIVO',
    description: 'Prospecção ativa 24/7. Responde e-mails e agenda.',
    kpiLabel: 'KPI ATUAL',
    kpiValue: '42 Leads/sem',
  },
  {
    id: 'closer',
    name: 'Closer Assistant',
    status: 'ATIVO',
    description: 'Follow-up de propostas e tira dúvidas técnicas.',
    kpiLabel: 'KPI ATUAL',
    kpiValue: 'R$ 120k Pipeline',
  },
  {
    id: 'cx',
    name: 'CX & Retenção',
    status: 'PAUSADO',
    description: 'Prevê churn e sugere upsell.',
    kpiLabel: 'KPI ATUAL',
    kpiValue: 'Inativo',
  },
];

const ALL_LOG_ENTRIES: LogEntry[] = [
  {
    time: '10:24:01',
    source: 'SDR Agent',
    sourceColor: '#22c55e',
    message: 'Novo lead qualificado → Pedro Silva (AgroSol)',
  },
  {
    time: '10:24:03',
    source: 'SDR Agent',
    sourceColor: '#22c55e',
    message: 'E-mail de follow-up enviado → pedro@agrosol.com.br',
  },
  {
    time: '10:24:07',
    source: 'Closer Agent',
    sourceColor: '#22d3ee',
    message: 'Proposta acessada por 3x → cliente@fintech.com',
  },
  {
    time: '10:24:12',
    source: 'SDR Agent',
    sourceColor: '#22c55e',
    message: 'Reunião agendada → 15/04 14h com TechVentures',
  },
  {
    time: '10:24:18',
    source: 'Sistema',
    sourceColor: '#94a3b8',
    message: 'Sincronizando dados com CRM...',
  },
  {
    time: '10:24:25',
    source: 'SDR Agent',
    sourceColor: '#22c55e',
    message: 'Score calculado: FinTech Solutions → 87/100 (HOT)',
  },
  {
    time: '10:24:31',
    source: 'Closer Agent',
    sourceColor: '#22d3ee',
    message: 'Lembrete enviado → proposta expira em 48h para BancoMax',
  },
  {
    time: '10:24:38',
    source: 'Sistema',
    sourceColor: '#94a3b8',
    message: 'MCP Handshake OK — todos os agentes sincronizados',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: 'ATIVO' | 'PAUSADO' }) {
  const isActive = status === 'ATIVO';
  const color = isActive ? 'var(--color-green)' : 'var(--color-orange)';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.08em',
        color,
        background: isActive ? '#22c55e18' : '#f9731618',
        border: `1px solid ${isActive ? '#22c55e44' : '#f9731644'}`,
        borderRadius: 20,
        padding: '3px 9px',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: color,
          boxShadow: isActive ? `0 0 6px ${color}` : 'none',
          display: 'inline-block',
        }}
      />
      {status}
    </span>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  const isPaused = agent.status === 'PAUSADO';

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${isPaused ? '#f9731633' : 'var(--border-color)'}`,
        borderRadius: 14,
        padding: '24px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Accent glow top-right */}
      {!isPaused && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 80,
            height: 80,
            background: 'radial-gradient(circle at top right, #6366f120 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: isPaused ? '#f9731618' : '#6366f118',
              border: `1px solid ${isPaused ? '#f9731633' : '#6366f133'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isPaused ? 'var(--color-orange)' : 'var(--accent-purple)',
              flexShrink: 0,
            }}
          >
            <Bot size={20} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {agent.name}
            </div>
          </div>
        </div>
        <StatusBadge status={agent.status} />
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
        {agent.description}
      </p>

      {/* KPI */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 10,
          padding: '12px 14px',
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          {agent.kpiLabel}
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: isPaused ? 'var(--text-muted)' : 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}
        >
          {agent.kpiValue}
        </div>
      </div>

      {/* CTA Button */}
      {isPaused ? (
        <button
          style={{
            background: 'var(--accent-purple)',
            border: 'none',
            borderRadius: 9,
            padding: '11px 0',
            fontSize: 13,
            fontWeight: 700,
            color: '#fff',
            cursor: 'pointer',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            letterSpacing: '0.02em',
            transition: 'opacity 0.15s',
          }}
        >
          <Zap size={14} />
          Contratar
        </button>
      ) : (
        <button
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 9,
            padding: '11px 0',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            letterSpacing: '0.02em',
            transition: 'background 0.15s',
          }}
        >
          <Settings size={14} />
          Configurações
        </button>
      )}
    </div>
  );
}

function TerminalLog({ entries }: { entries: LogEntry[] }) {
  return (
    <div
      style={{
        background: '#0a0e1a',
        border: '1px solid #1a2744',
        borderRadius: 14,
        overflow: 'hidden',
        fontFamily: "'Fira Code', 'Cascadia Code', 'Courier New', monospace",
      }}
    >
      {/* Terminal chrome */}
      <div
        style={{
          background: '#0d1424',
          borderBottom: '1px solid #1a2744',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#eab308', display: 'inline-block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          </div>
          <span style={{ fontSize: 12, color: '#4a6080', marginLeft: 6 }}>
            {'>'} mcp-orchestrator — bash
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Circle size={8} fill="#22c55e" color="#22c55e" style={{ filter: 'drop-shadow(0 0 4px #22c55e)' }} />
          <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>LIVE</span>
        </div>
      </div>

      {/* Log entries */}
      <div style={{ padding: '16px 20px', minHeight: 200, maxHeight: 260, overflowY: 'auto' }}>
        {entries.map((entry, i) => (
          <div
            key={i}
            style={{
              fontSize: 13,
              lineHeight: '1.8',
              color: '#8899bb',
              display: 'flex',
              gap: 0,
              alignItems: 'flex-start',
            }}
          >
            <span style={{ color: '#334466', flexShrink: 0 }}>[</span>
            <span style={{ color: '#4a7090', flexShrink: 0 }}>{entry.time}</span>
            <span style={{ color: '#334466', flexShrink: 0 }}>] </span>
            <span
              style={{
                color: entry.sourceColor,
                fontWeight: 700,
                flexShrink: 0,
                marginRight: 4,
              }}
            >
              {entry.source}:
            </span>
            <span style={{ color: '#a0b4c8' }}>{entry.message}</span>
          </div>
        ))}
        {/* Blinking cursor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <span style={{ color: '#22c55e', fontSize: 13 }}>$</span>
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 14,
              background: '#22c55e',
              animation: 'blink 1s step-end infinite',
              opacity: 0.8,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AgentesIAPage() {
  const [visibleLogs, setVisibleLogs] = useState<LogEntry[]>(ALL_LOG_ENTRIES.slice(0, 3));
  const [logIndex, setLogIndex] = useState(3);
  const terminalRef = useRef<HTMLDivElement>(null);

  const [sdrInstructions, setSdrInstructions] = useState(
    `Você é um SDR autônomo da RevenueAI. Seu objetivo é prospectar leads qualificados no segmento B2B brasileiro.

Ao identificar um lead, siga este fluxo:
1. Pesquise o perfil da empresa e o decision-maker
2. Envie e-mail personalizado com proposta de valor clara
3. Aguarde 48h e faça follow-up via WhatsApp
4. Se sem resposta, tente ligação no horário comercial (9-11h ou 14-16h)
5. Qualifique usando BANT: Budget, Authority, Need, Timeline

Tom de voz: Consultivo, direto, sem pressão. Foco em gerar valor antes de vender.`
  );

  const [closerInstructions, setCloserInstructions] = useState(
    `Você é o Closer Assistant da RevenueAI. Sua função é apoiar o time comercial no fechamento de negócios.

Responsabilidades:
1. Monitorar propostas enviadas e alertar quando acessadas
2. Responder dúvidas técnicas sobre o produto em até 2 minutos
3. Sugerir argumentos para superar objeções comuns (preço, timing, concorrência)
4. Gerar resumo executivo personalizado para cada prospect
5. Acionar desconto ou bonificação automática quando deal em risco

Meta: Aumentar taxa de fechamento de 18% para 25% no trimestre.`
  );

  // Typewriter effect: add one log entry every 2.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setLogIndex((prev) => {
        const next = (prev + 1) % ALL_LOG_ENTRIES.length;
        setVisibleLogs((logs) => {
          const updated = [...logs, ALL_LOG_ENTRIES[next]];
          return updated.slice(-8); // keep last 8 lines
        });
        return next;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleLogs]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        padding: '32px 36px',
        color: 'var(--text-primary)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#6366f118',
              border: '1px solid #6366f133',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-purple)',
            }}
          >
            <Cpu size={18} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Força de Trabalho Digital
          </h1>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginLeft: 46 }}>
          Seus funcionários autônomos que operam 24/7{' '}
          <span
            style={{
              color: 'var(--accent-teal)',
              background: '#22d3ee18',
              border: '1px solid #22d3ee33',
              borderRadius: 6,
              padding: '2px 8px',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            via Protocolo MCP
          </span>
        </p>
      </div>

      {/* Agent Cards */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 32 }}>
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Terminal Section */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 16,
          padding: '24px',
          marginBottom: 28,
        }}
      >
        {/* Terminal header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Activity size={18} color="var(--accent-teal)" />
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
              Terminal de Orquestração MCP
            </h2>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'var(--color-green)',
                background: '#22c55e18',
                border: '1px solid #22c55e44',
                borderRadius: 20,
                padding: '2px 8px',
              }}
            >
              LIVE
            </span>
          </div>

          <button
            style={{
              background: '#22c55e18',
              border: '1px solid #22c55e44',
              borderRadius: 9,
              padding: '9px 18px',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--color-green)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              letterSpacing: '0.02em',
              transition: 'background 0.15s',
            }}
          >
            <Play size={13} fill="currentColor" />
            Iniciar Simulador SDR
          </button>
        </div>

        {/* The terminal itself */}
        <div ref={terminalRef as React.RefObject<HTMLDivElement>}>
          <TerminalLog entries={visibleLogs} />
        </div>
      </div>

      {/* Configure Agents Section */}
      <div>
        <h2
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Settings size={16} color="var(--accent-purple)" />
          Configure Seus Agentes
        </h2>

        <div style={{ display: 'flex', gap: 20 }}>
          {/* SDR Instructions */}
          <div
            style={{
              flex: 1,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 14,
              padding: '22px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bot size={16} color="var(--color-green)" />
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                  Instruções do SDR
                </h3>
              </div>
              <StatusBadge status="ATIVO" />
            </div>

            <textarea
              value={sdrInstructions}
              onChange={(e) => setSdrInstructions(e.target.value)}
              rows={10}
              style={{
                width: '100%',
                background: '#0a0e1a',
                border: '1px solid var(--border-color)',
                borderRadius: 10,
                padding: '14px',
                fontSize: 12,
                lineHeight: 1.7,
                color: '#a0b4c8',
                fontFamily: "'Fira Code', 'Cascadia Code', 'Courier New', monospace",
                resize: 'vertical',
                outline: 'none',
              }}
            />

            <button
              style={{
                marginTop: 12,
                background: 'var(--color-green)',
                border: 'none',
                borderRadius: 9,
                padding: '10px 20px',
                fontSize: 13,
                fontWeight: 700,
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
              }}
            >
              <ChevronRight size={14} />
              Salvar e Aplicar
            </button>
          </div>

          {/* Closer Instructions */}
          <div
            style={{
              flex: 1,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 14,
              padding: '22px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bot size={16} color="var(--accent-teal)" />
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                  Instruções do Closer
                </h3>
              </div>
              <StatusBadge status="ATIVO" />
            </div>

            <textarea
              value={closerInstructions}
              onChange={(e) => setCloserInstructions(e.target.value)}
              rows={10}
              style={{
                width: '100%',
                background: '#0a0e1a',
                border: '1px solid var(--border-color)',
                borderRadius: 10,
                padding: '14px',
                fontSize: 12,
                lineHeight: 1.7,
                color: '#a0b4c8',
                fontFamily: "'Fira Code', 'Cascadia Code', 'Courier New', monospace",
                resize: 'vertical',
                outline: 'none',
              }}
            />

            <button
              style={{
                marginTop: 12,
                background: 'var(--accent-teal)',
                border: 'none',
                borderRadius: 9,
                padding: '10px 20px',
                fontSize: 13,
                fontWeight: 700,
                color: '#0a1a20',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
              }}
            >
              <ChevronRight size={14} />
              Salvar e Aplicar
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
