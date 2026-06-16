import { NextResponse } from "next/server";

// ─── Mock open deals ────────────────────────────────────────────────────────
const OPEN_DEALS = [
  { id: "1", name: "Grupo Votorantim — BI Analytics", amount: 148000, stage: "Em Negociação", closeDate: "2025-07-15", probability: 80, pipeline: "default" },
  { id: "2", name: "Itaú Unibanco — CRM Enterprise", amount: 220000, stage: "Em Negociação", closeDate: "2025-07-30", probability: 75, pipeline: "enterprise" },
  { id: "3", name: "Ambev — Revenue Operations", amount: 95000, stage: "Proposta Enviada", closeDate: "2025-08-10", probability: 65, pipeline: "default" },
  { id: "4", name: "Totvs — Sales Intelligence", amount: 62000, stage: "Proposta Enviada", closeDate: "2025-07-22", probability: 60, pipeline: "default" },
  { id: "5", name: "Magazine Luiza — Automação Comercial", amount: 38000, stage: "Demo Agendada", closeDate: "2025-08-05", probability: 45, pipeline: "default" },
  { id: "6", name: "Localiza — Pipeline Analytics", amount: 44000, stage: "Proposta Enviada", closeDate: "2025-07-18", probability: 55, pipeline: "default" },
  { id: "7", name: "Natura &Co — Forecast IA", amount: 88000, stage: "Em Negociação", closeDate: "2025-08-20", probability: 70, pipeline: "default" },
  { id: "8", name: "WEG Industries — CRM Integrado", amount: 110000, stage: "Em Negociação", closeDate: "2025-09-01", probability: 72, pipeline: "enterprise" },
  { id: "9", name: "Raia Drogasil — Revenue Dashboard", amount: 29000, stage: "Demo Agendada", closeDate: "2025-07-25", probability: 35, pipeline: "default" },
  { id: "10", name: "Vale S.A. — Sales Enablement", amount: 175000, stage: "POC / Piloto", closeDate: "2025-09-15", probability: 68, pipeline: "enterprise" },
  { id: "11", name: "Embraer — Forecast Engine", amount: 135000, stage: "Proposta", closeDate: "2025-08-30", probability: 58, pipeline: "enterprise" },
  { id: "12", name: "JBS — Pipeline Control", amount: 55000, stage: "Qualificação", closeDate: "2025-10-01", probability: 20, pipeline: "default" },
  { id: "13", name: "Bradesco Seguros — Analytics", amount: 42000, stage: "Demo Agendada", closeDate: "2025-07-28", probability: 40, pipeline: "default" },
  { id: "14", name: "Porto Seguro — CRM Suite", amount: 68000, stage: "Proposta Enviada", closeDate: "2025-08-12", probability: 50, pipeline: "default" },
  { id: "15", name: "Gerdau — Revenue Ops", amount: 92000, stage: "Em Negociação", closeDate: "2025-08-08", probability: 78, pipeline: "default" },
  { id: "16", name: "Positivo Tecnologia — BI", amount: 18000, stage: "Qualificação", closeDate: "2025-10-15", probability: 15, pipeline: "default" },
  { id: "17", name: "Movida — Sales Analytics", amount: 33000, stage: "Demo Agendada", closeDate: "2025-08-01", probability: 38, pipeline: "default" },
  { id: "18", name: "SulAmérica — Forecast IA", amount: 76000, stage: "Em Negociação", closeDate: "2025-07-20", probability: 82, pipeline: "enterprise" },
  { id: "19", name: "Arezzo — CRM Commerce", amount: 24000, stage: "Qualificação", closeDate: "2025-09-20", probability: 12, pipeline: "default" },
  { id: "20", name: "Eneva — Pipeline Suite", amount: 145000, stage: "Proposta", closeDate: "2025-08-25", probability: 63, pipeline: "enterprise" },
  { id: "21", name: "Cosan — Sales Intelligence", amount: 87000, stage: "Em Negociação", closeDate: "2025-07-31", probability: 73, pipeline: "default" },
  { id: "22", name: "3tentos — Revenue Analytics", amount: 31000, stage: "Demo Agendada", closeDate: "2025-08-18", probability: 42, pipeline: "default" },
  { id: "23", name: "Dasa — CRM Clínico Comercial", amount: 58000, stage: "Proposta Enviada", closeDate: "2025-07-26", probability: 55, pipeline: "default" },
  { id: "24", name: "Raízen — Revenue Operations", amount: 198000, stage: "POC / Piloto", closeDate: "2025-10-10", probability: 60, pipeline: "enterprise" },
  { id: "25", name: "Fleury — Sales Dashboard", amount: 41000, stage: "Demo Agendada", closeDate: "2025-08-14", probability: 30, pipeline: "default" },
];

const LOSS_REASONS: [string, number][] = [
  ["Budget / Preço Alto", 28],
  ["Perdeu para Concorrente", 21],
  ["Sem necessidade no momento", 16],
  ["Timing ruim", 11],
  ["Falta de aprovação interna", 9],
  ["Produto não atende requisito", 6],
  ["Sem resposta do prospect", 5],
];

function buildByMonth(start: Date, end: Date) {
  const byMonth: Record<string, { total: number; won: number; lost: number; open: number; amount: number }> = {};
  const seed = [
    { won: 3, lost: 7, open: 8, amount: 92000 },
    { won: 4, lost: 8, open: 9, amount: 124000 },
    { won: 3, lost: 6, open: 7, amount: 88000 },
    { won: 5, lost: 9, open: 10, amount: 168000 },
    { won: 4, lost: 7, open: 9, amount: 142000 },
    { won: 6, lost: 8, open: 11, amount: 195000 },
    { won: 5, lost: 9, open: 8, amount: 158000 },
    { won: 7, lost: 7, open: 12, amount: 224000 },
    { won: 4, lost: 8, open: 9, amount: 136000 },
    { won: 6, lost: 10, open: 10, amount: 187000 },
    { won: 5, lost: 9, open: 11, amount: 162000 },
    { won: 7, lost: 8, open: 13, amount: 218000 },
  ];
  const cur = new Date(start.getFullYear(), start.getMonth(), 1);
  let idx = 0;
  while (cur <= end && idx < seed.length) {
    const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}`;
    const s = seed[idx % seed.length];
    byMonth[key] = { total: s.won + s.lost + s.open, ...s };
    cur.setMonth(cur.getMonth() + 1);
    idx++;
  }
  return byMonth;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startParam = searchParams.get("start");
  const endParam = searchParams.get("end");

  const end = endParam ? new Date(endParam) : new Date();
  const start = startParam ? new Date(startParam) : new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);

  const byMonth = buildByMonth(start, end);
  const months = Object.values(byMonth);

  const won = months.reduce((s, m) => s + m.won, 0);
  const lost = months.reduce((s, m) => s + m.lost, 0);
  const open = OPEN_DEALS.length;
  const total = won + lost + open;
  const wonAmount = months.reduce((s, m) => s + m.amount, 0);

  const openDeals = [...OPEN_DEALS].sort((a, b) => (b.probability ?? 0) - (a.probability ?? 0));

  return NextResponse.json({
    total,
    won,
    lost,
    open,
    conversionRate: total ? Math.round((won / total) * 1000) / 10 : 0,
    totalAmount: wonAmount * 1.6,
    wonAmount,
    byMonth,
    lossReasons: LOSS_REASONS,
    openDeals,
  });
}
