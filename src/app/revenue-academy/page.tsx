"use client";
import { BookOpen, Play, Clock, Star, Users, Award, ChevronRight, CheckCircle } from "lucide-react";
import { useState } from "react";

const courses = [
  {
    id: 1,
    title: "Técnicas de Quebra de Objeções",
    instructor: "Lucas BH",
    duration: "2h 30min",
    modules: 8,
    rating: 4.9,
    students: 342,
    progress: 65,
    badge: "Recomendado pela IA",
    badgeColor: "var(--accent-purple)",
    tag: "Conversão",
    tagColor: "#7c3aed22",
    tagText: "#a78bfa",
    thumbnail: "🎯",
  },
  {
    id: 2,
    title: "Método SPIN Selling na Prática",
    instructor: "Ana Souza",
    duration: "3h 15min",
    modules: 12,
    rating: 4.8,
    students: 289,
    progress: 100,
    badge: "Concluído",
    badgeColor: "var(--color-green)",
    tag: "Qualificação",
    tagColor: "#16a34a22",
    tagText: "#4ade80",
    thumbnail: "📊",
  },
  {
    id: 3,
    title: "Prospecção Outbound de Alta Performance",
    instructor: "Nina - Agente IA",
    duration: "1h 45min",
    modules: 6,
    rating: 4.7,
    students: 178,
    progress: 0,
    badge: "Novo",
    badgeColor: "var(--accent-teal)",
    tag: "SDR",
    tagColor: "#0e7490aa",
    tagText: "#22d3ee",
    thumbnail: "🚀",
  },
  {
    id: 4,
    title: "Forecast e Gestão de Pipeline",
    instructor: "Carlos Dutra",
    duration: "2h 00min",
    modules: 7,
    rating: 4.6,
    students: 211,
    progress: 30,
    badge: null,
    tag: "Gestão",
    tagColor: "#1d4ed822",
    tagText: "#60a5fa",
    thumbnail: "📈",
  },
  {
    id: 5,
    title: "CX e Retenção: Reduzindo Churn",
    instructor: "Nina - Agente IA",
    duration: "2h 20min",
    modules: 9,
    rating: 4.8,
    students: 156,
    progress: 0,
    badge: "Em Alta",
    badgeColor: "var(--color-orange)",
    tag: "Retenção",
    tagColor: "#c2410c22",
    tagText: "#fb923c",
    thumbnail: "🛡️",
  },
  {
    id: 6,
    title: "Negociação e Fechamento de Alto Valor",
    instructor: "Lucas BH",
    duration: "4h 00min",
    modules: 14,
    rating: 4.9,
    students: 403,
    progress: 0,
    badge: "Popular",
    badgeColor: "var(--color-yellow)",
    tag: "Closer",
    tagColor: "#a16207aa",
    tagText: "#fbbf24",
    thumbnail: "💼",
  },
];

const learningPaths = [
  { title: "Trilha SDR", courses: 4, hours: "8h", color: "var(--accent-teal)", icon: "🎯" },
  { title: "Trilha Closer", courses: 5, hours: "12h", color: "var(--accent-purple)", icon: "💰" },
  { title: "Trilha Gestão", courses: 3, hours: "6h", color: "var(--accent-blue)", icon: "📊" },
  { title: "Trilha CX", courses: 4, hours: "9h", color: "var(--color-green)", icon: "🤝" },
];

export default function RevenueAcademyPage() {
  const [activeTab, setActiveTab] = useState("todos");

  const tabs = [
    { id: "todos", label: "Todos os Cursos" },
    { id: "meu-progresso", label: "Meu Progresso" },
    { id: "trilhas", label: "Trilhas de Aprendizado" },
    { id: "certificados", label: "Certificados" },
  ];

  const card = {
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Revenue Academy</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Capacitação contínua impulsionada por IA para seu time de vendas
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "#16a34a22", border: "1px solid #16a34a44" }}>
          <Award size={14} style={{ color: "var(--color-green)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--color-green)" }}>3 Certificados Conquistados</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Cursos Disponíveis", value: "24", icon: BookOpen, color: "var(--accent-purple)" },
          { label: "Horas Assistidas", value: "18h", icon: Clock, color: "var(--accent-teal)" },
          { label: "Certificados", value: "3", icon: Award, color: "var(--color-green)" },
          { label: "Ranking do Time", value: "#2", icon: Star, color: "var(--color-yellow)" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-xl flex items-center gap-3" style={card}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: color + "22" }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--bg-secondary)", width: "fit-content" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2 rounded-md text-sm font-medium transition-all"
            style={{
              background: activeTab === tab.id ? "var(--accent-purple)" : "transparent",
              color: activeTab === tab.id ? "#fff" : "var(--text-secondary)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "trilhas" ? (
        <div className="grid grid-cols-2 gap-4">
          {learningPaths.map((path) => (
            <div key={path.title} className="p-5 rounded-xl" style={card}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{path.icon}</span>
                <div>
                  <p className="font-semibold text-white">{path.title}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{path.courses} cursos · {path.hours}</p>
                </div>
              </div>
              <div className="h-1.5 rounded-full mb-3" style={{ background: "var(--border-color)" }}>
                <div className="h-1.5 rounded-full w-1/3" style={{ background: path.color }} />
              </div>
              <button
                className="w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                style={{ background: path.color + "22", color: path.color, border: `1px solid ${path.color}44` }}
              >
                <Play size={14} /> Iniciar Trilha
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Course grid */
        <div className="grid grid-cols-3 gap-4">
          {courses
            .filter((c) => activeTab !== "meu-progresso" || c.progress > 0)
            .map((course) => (
              <div key={course.id} className="rounded-xl overflow-hidden flex flex-col" style={card}>
                {/* Thumbnail */}
                <div
                  className="h-28 flex items-center justify-center text-4xl"
                  style={{ background: "linear-gradient(135deg, #1a2235, #0d1424)" }}
                >
                  {course.thumbnail}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  {/* Tag + Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: course.tagColor, color: course.tagText }}
                    >
                      {course.tag}
                    </span>
                    {course.badge && (
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                        style={{ background: course.badgeColor }}
                      >
                        {course.badge}
                      </span>
                    )}
                  </div>

                  <p className="font-semibold text-white text-sm leading-snug mb-1">{course.title}</p>
                  <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>por {course.instructor}</p>

                  <div className="flex items-center gap-3 text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
                    <span className="flex items-center gap-1"><Clock size={11} />{course.duration}</span>
                    <span className="flex items-center gap-1"><BookOpen size={11} />{course.modules} módulos</span>
                    <span className="flex items-center gap-1"><Star size={11} style={{ color: "var(--color-yellow)" }} />{course.rating}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Users size={11} style={{ color: "var(--text-muted)" }} />
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{course.students} alunos</span>
                  </div>

                  {/* Progress */}
                  {course.progress > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                        <span>Progresso</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="h-1 rounded-full" style={{ background: "var(--border-color)" }}>
                        <div
                          className="h-1 rounded-full transition-all"
                          style={{
                            width: `${course.progress}%`,
                            background: course.progress === 100 ? "var(--color-green)" : "var(--accent-purple)",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    className="mt-auto w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
                    style={{
                      background: course.progress === 100 ? "var(--color-green)" : "var(--accent-purple)",
                      color: "#fff",
                    }}
                  >
                    {course.progress === 100 ? (
                      <><CheckCircle size={14} /> Concluído</>
                    ) : course.progress > 0 ? (
                      <><Play size={14} /> Continuar</>
                    ) : (
                      <><Play size={14} /> Iniciar Curso</>
                    )}
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* AI Recommendation Banner */}
      <div
        className="p-4 rounded-xl flex items-center gap-4"
        style={{ background: "linear-gradient(135deg, #4f46e522, #06b6d422)", border: "1px solid #6366f133" }}
      >
        <div className="text-2xl">🤖</div>
        <div className="flex-1">
          <p className="font-semibold text-white text-sm">Recomendação da IA para o Time</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Com base nos gaps identificados no Enablement, recomendamos priorizar o curso{" "}
            <strong className="text-white">"Técnicas de Quebra de Objeções"</strong> para Pedro Alves e Carlos Dutra esta semana.
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-1.5 flex-shrink-0"
          style={{ background: "var(--accent-purple)" }}
        >
          Atribuir Curso <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
