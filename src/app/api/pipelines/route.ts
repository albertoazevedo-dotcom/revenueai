import { NextResponse } from "next/server";

const PIPELINES = [
  {
    id: "default",
    label: "Pipeline Principal",
    stages: [
      { id: "qualificacao", label: "Qualificação" },
      { id: "demo", label: "Demo Agendada" },
      { id: "proposta", label: "Proposta Enviada" },
      { id: "negociacao", label: "Em Negociação" },
      { id: "fechamento", label: "Fechamento" },
      { id: "ganho", label: "Ganho" },
      { id: "perdido", label: "Perdido" },
    ],
  },
  {
    id: "enterprise",
    label: "Pipeline Enterprise",
    stages: [
      { id: "prospeccao", label: "Prospecção" },
      { id: "discovery", label: "Discovery" },
      { id: "poc", label: "POC / Piloto" },
      { id: "proposta_ent", label: "Proposta" },
      { id: "juridico", label: "Jurídico" },
      { id: "ganho_ent", label: "Ganho" },
      { id: "perdido_ent", label: "Perdido" },
    ],
  },
];

export async function GET() {
  return NextResponse.json(PIPELINES);
}
