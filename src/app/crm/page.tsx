"use client";
import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Percent,
  Bot,
  ChevronDown,
  X,
  Star,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Deal {
  id: number;
  company: string;
  contact: string;
  avatar: string;
  value: string;
  prob: number;
  daysInStage: number;
  aiInsight?: string;
  source: string;
}

const pipeline: { stage: string; color: string; count: number; deals: Deal[] }[] = [
  {
    stage: "Leads Novos",
    color: "#3b82f6",
    count: 18,
    deals: [
      { id: 1, company: "AgriTech Ltda", contact: "Renato Lima", avatar: "RL", value: "R$ 24k", prob: 15, daysInStage: 2, source: "LinkedIn" },
      { id: 2, company: "Nova Energia S.A.", contact: "Carla Mota", avatar: "CM", value: "R$ 45k", prob: 20, daysInStage: 1, aiInsight: "Alta probabilidade", source: "Indicação" },
      { id: 3, company: "Grupo Varejo Plus", contact: "Diego Faria", avatar: "DF", value: "R$ 18k", prob: 12, daysInStage: 3, source: "Google Ads" },
    ],
  },
  {
    stage: "Tentativa",
    color: "#f97316",
    count: 250,
    deals: [
      { id: 4, company: "StartupBR", contact: "Fernanda Costa", avatar: "FC", value: "R$ 32k", prob: 30, daysInStage: 5, source: "Meta Ads" },
      { id: 5, company: "FinTech Solutions", contact: "Paulo Melo", avatar: "PM", value: "R$ 67k", prob: 35, daysInStage: 8, aiInsight: "Aguarda follow-up", source: "LinkedIn" },
      { id: 6, company: "Construtora ABC", contact: "Sônia Rocha", avatar: "SR", value: "R$ 28k", prob: 28, daysInStage: 4, source: "Eventos" },
    ],
  },
  {
    stage: "Conectados",
    color: "#eab308",
    count: 110,
    deals: [
      { id: 7, company: "MedTech Brasil", contact: "André Nunes", avatar: "AN", value: "R$ 89k", prob: 45, daysInStage: 7, aiInsight: "Reunião agendada", source: "Indicação" },
      { id: 8, company: "EduPlus", contact: "Bianca Torres", avatar: "BT", value: "R$ 43k", prob: 40, daysInStage: 6, source: "Google Ads" },
      { id: 9, company: "LogiPro", contact: "Ricardo Alves", avatar: "RA", value: "R$ 55k", prob: 42, daysInStage: 9, source: "LinkedIn" },
    ],
  },
  {
    stage: "Negociações",
    color: "#a855f7",
    count: 60,
    deals: [
      { id: 10, company: "AgroSul S.A.", contact: "Pedro Alves", avatar: "PA", value: "R$ 120k", prob: 65, daysInStage: 12, aiInsight: "Objeção: preço", source: "Indicação" },
      { id: 11, company: "TechVentures", contact: "Marcos Lima", avatar: "ML", value: "R$ 95k", prob: 70, daysInStage: 10, source: "LinkedIn" },
      { id: 12, company: "HealthCare+", contact: "Juliana Pinto", avatar: "JP", value: "R$ 78k", prob: 60, daysInStage: 14, aiInsight: "Decisor engajado", source: "Eventos" },
    ],
  },
  {
    stage: "Proposta Enviada",
    color: "#22c55e",
    count: 35,
    deals: [
      { id: 13, company: "TechSolutions S.A.", contact: "Alberto Santos", avatar: "AS", value: "R$ 245k", prob: 80, daysInStage: 3, aiInsight: "Proposta lida 3x", source: "Indicação" },
      { id: 14, company: "Banco Digital", contact: "Camila Souza", avatar: "CS", value: "R$ 180k", prob: 75, daysInStage: 5, source: "LinkedIn" },
      { id: 15, company: "RetailMax", contact: "Felipe Ramos", avatar: "FR", value: "R$ 134k", prob: 72, daysInStage: 4, source: "Eventos" },
    ],
  },
];

const contacts = [
  { id: 1, name: "Pedro Alves", company: "AgroSul S.A.", email: "pedro@agrosul.com.br", phone: "(11) 99234-5678", stage: "Negociações", value: "R$ 120k", score: 82, lastContact: "2 dias" },
  { id: 2, name: "Marcos Lima", company: "TechVentures", email: "marcos@techventures.com", phone: "(11) 98765-4321", stage: "Negociações", value: "R$ 95k", score: 78, lastContact: "1 dia" },
  { id: 3, name: "Alberto Santos", company: "TechSolutions S.A.", email: "alberto@techsolutions.com", phone: "(11) 97654-3210", stage: "Proposta Enviada", value: "R$ 245k", score: 91, lastContact: "hoje" },
  { id: 4, name: "Camila Souza", company: "Banco Digital", email: "camila@bancodigital.com.br", phone: "(21) 98877-6655", stage: "Proposta Enviada", value: "R$ 180k", score: 85, lastContact: "3 dias" },
  { id: 5, name: "Fernanda Costa", company: "StartupBR", email: "fernanda@startupbr.com", phone: "(11) 91234-5678", stage: "Tentativa", value: "R$ 32k", score: 55, lastContact: "5 dias" },
  { id: 6, name: "André Nunes", company: "MedTech Brasil", email: "andre@medtech.com.br", phone: "(11) 94321-8765", stage: "Conectados", value: "R$ 89k", score: 70, lastContact: "hoje" },
];

const aiInsights = [
  { icon: "🔥", text: "TechSolutions leu a proposta 3 vezes nas últimas 24h — momento ideal para ligação de fechamento.", color: "#ef4444" },
  { icon: "⚡", text: "Pedro Alves ficou 14 dias sem atividade. Risco de perda. Sugerido: ligação hoje às 14h.", color: "#f97316" },
  { icon: "💡", text: "HealthCare+ tem decisor engajado. Lucas BH disponível para auxiliar no fechamento.", color: "#6366f1" },
];

const stageColor: Record<string, string> = {
  "Leads Novos": "#3b82f6",
  "Tentativa": "#f97316",
  "Conectados": "#eab308",
  "Negociações": "#a855f7",
  "Proposta Enviada": "#22c55e",
};

// ─── Component ─────────────────────────────────────────────────────────────────
export default function CRMPage() {
  const [activeTab, setActiveTab] = useState("kanban");
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const card = { background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px" };

  const tabs = [
    { id: "kanban", label: "Pipeline Kanban" },
    { id: "contatos", label: "Lista de Contatos" },
    { id: "relatorios", label: "Relatórios" },
  ];

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">CRM Integrado</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Gestão inteligente de clientes para PMEs
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--accent-purple)" }}
        >
          <Plus size={16} /> Novo Contato
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Clientes", value: "1.284", icon: Users, color: "var(--accent-blue)" },
          { label: "Deals Ativos", value: "89", sub: "R$ 2.3M em pipeline", icon: DollarSign, color: "var(--color-green)" },
          { label: "Taxa de Fechamento", value: "18.5%", icon: Percent, color: "var(--accent-purple)" },
          { label: "NPS Médio", value: "72", icon: Star, color: "var(--color-yellow)" },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-xl flex items-center gap-3" style={card}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: color + "22" }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{sub || label}</p>
              {sub && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--bg-secondary)", width: "fit-content" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="px-4 py-2 rounded-md text-sm font-medium transition-all"
            style={{
              background: activeTab === t.id ? "var(--accent-purple)" : "transparent",
              color: activeTab === t.id ? "#fff" : "var(--text-secondary)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Kanban */}
      {activeTab === "kanban" && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {pipeline.map((col) => (
            <div key={col.stage} className="flex-shrink-0 w-64 rounded-xl overflow-hidden" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
              {/* Column header */}
              <div className="p-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border-color)" }}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                  <span className="text-sm font-medium text-white">{col.stage}</span>
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: col.color + "22", color: col.color }}
                >
                  {col.count}
                </span>
              </div>

              {/* Deal cards */}
              <div className="p-2 space-y-2 max-h-96 overflow-y-auto">
                {col.deals.map((deal) => (
                  <div
                    key={deal.id}
                    className="p-3 rounded-lg cursor-pointer transition-all hover:scale-[1.01]"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: col.color + "55" }}
                        >
                          {deal.avatar}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white leading-tight">{deal.company}</p>
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{deal.contact}</p>
                        </div>
                      </div>
                      <MoreHorizontal size={14} style={{ color: "var(--text-muted)" }} />
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-white">{deal.value}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#1e2d4a", color: "var(--text-secondary)" }}>
                        {deal.prob}%
                      </span>
                    </div>

                    {deal.aiInsight && (
                      <div className="mt-2 flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: "#6366f122" }}>
                        <Bot size={11} style={{ color: "var(--accent-purple)" }} />
                        <span className="text-xs" style={{ color: "#a78bfa" }}>{deal.aiInsight}</span>
                      </div>
                    )}

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--border-color)", color: "var(--text-muted)" }}>
                        {deal.source}
                      </span>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{deal.daysInStage}d</span>
                    </div>
                  </div>
                ))}
                <button
                  className="w-full py-2 rounded-lg text-xs flex items-center justify-center gap-1 transition-all hover:opacity-80"
                  style={{ background: col.color + "11", color: col.color, border: `1px dashed ${col.color}44` }}
                >
                  <Plus size={12} /> Adicionar Deal
                </button>
              </div>
            </div>
          ))}

          {/* AI Insights panel */}
          <div className="flex-shrink-0 w-64 rounded-xl" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
            <div className="p-3" style={{ borderBottom: "1px solid var(--border-color)" }}>
              <div className="flex items-center gap-2">
                <Bot size={15} style={{ color: "var(--accent-purple)" }} />
                <span className="text-sm font-medium text-white">Insights IA</span>
              </div>
            </div>
            <div className="p-3 space-y-3">
              {aiInsights.map((insight, i) => (
                <div key={i} className="p-3 rounded-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{insight.icon}</span>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{insight.text}</p>
                  </div>
                </div>
              ))}

              <div className="mt-4">
                <p className="text-xs font-medium mb-2 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                  Lead Score Top
                </p>
                {contacts.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <div>
                      <p className="text-xs font-medium text-white">{c.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{c.company}</p>
                    </div>
                    <div
                      className="text-sm font-bold"
                      style={{ color: c.score >= 80 ? "var(--color-green)" : c.score >= 60 ? "var(--color-yellow)" : "var(--color-red)" }}
                    >
                      {c.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contacts list */}
      {activeTab === "contatos" && (
        <div className="rounded-xl overflow-hidden" style={card}>
          <div className="p-4 flex items-center gap-3" style={{ borderBottom: "1px solid var(--border-color)" }}>
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar contatos..."
                className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
              <Filter size={14} /> Filtrar
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                {["Contato", "Empresa", "Estágio", "Valor", "Lead Score", "Último Contato", "Ações"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-white/5" style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: "var(--accent-purple)" }}
                      >
                        {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{c.name}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>{c.company}</td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: (stageColor[c.stage] || "#6366f1") + "22", color: stageColor[c.stage] || "#6366f1" }}
                    >
                      {c.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-white">{c.value}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--border-color)" }}>
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${c.score}%`,
                            background: c.score >= 80 ? "var(--color-green)" : c.score >= 60 ? "var(--color-yellow)" : "var(--color-red)",
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold" style={{ color: c.score >= 80 ? "var(--color-green)" : "var(--text-secondary)" }}>
                        {c.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--text-muted)" }}>{c.lastContact}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded" style={{ background: "var(--border-color)" }} title="Ligar">
                        <Phone size={13} style={{ color: "var(--text-secondary)" }} />
                      </button>
                      <button className="p-1.5 rounded" style={{ background: "var(--border-color)" }} title="Email">
                        <Mail size={13} style={{ color: "var(--text-secondary)" }} />
                      </button>
                      <button className="p-1.5 rounded" style={{ background: "var(--border-color)" }} title="Agendar">
                        <Calendar size={13} style={{ color: "var(--text-secondary)" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reports tab */}
      {activeTab === "relatorios" && (
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: "Receita por Canal", value: "R$ 2.3M", change: "+12%", positive: true },
            { title: "Ciclo Médio de Venda", value: "28 dias", change: "-3 dias", positive: true },
            { title: "Custo por Aquisição", value: "R$ 1.840", change: "+5%", positive: false },
            { title: "Lifetime Value Médio", value: "R$ 84k", change: "+18%", positive: true },
          ].map((r) => (
            <div key={r.title} className="p-5 rounded-xl" style={card}>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{r.title}</p>
              <p className="text-3xl font-bold text-white mt-1">{r.value}</p>
              <span
                className="text-xs font-medium mt-1 inline-block"
                style={{ color: r.positive ? "var(--color-green)" : "var(--color-red)" }}
              >
                {r.change} vs mês anterior
              </span>
            </div>
          ))}
        </div>
      )}

      {/* New Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-md p-6 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Novo Contato</h2>
              <button onClick={() => setShowModal(false)} style={{ color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Nome Completo", placeholder: "Ex: João Silva" },
                { label: "Empresa", placeholder: "Ex: TechSolutions S.A." },
                { label: "E-mail", placeholder: "joao@empresa.com" },
                { label: "Telefone", placeholder: "(11) 99999-9999" },
                { label: "Valor Estimado (R$)", placeholder: "Ex: 50000" },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    {label}
                  </label>
                  <input
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Canal de Origem
                </label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
                >
                  <option>LinkedIn</option>
                  <option>Meta Ads</option>
                  <option>Google Ads</option>
                  <option>Indicação</option>
                  <option>Eventos</option>
                  <option>Social</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white"
                style={{ background: "var(--accent-purple)" }}
              >
                Adicionar Contato
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
